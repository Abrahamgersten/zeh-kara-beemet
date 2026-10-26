-- הצטרפות בפועל לקבוצות הסיפורים דרך הבוטים (אברהם, 2026-10-26: "כמה נכנסים לקבוצה של זה קרה באמת דרך הבוט של אי היהלומים").
-- המקור: wa_group_joins (מיגרציה wa_0005 בתיקיית הבוט), שנכתבת כל שעה ע"י Tools/wa_cloud_bot/group_join_sync.py:
-- מי מבין מי שקיבלו הזמנה מבוט נמצא היום בקבוצות, ומתי נראה שם לראשונה. admin_bot_funnel מחזירה עכשיו גם
-- group_joins (לפי בוט ומצב) ו-group_tracking (מתי התחילה הבדיקה ומתי נבדק לאחרונה).
-- נוצר ע"י רוני המתכנת.

CREATE OR REPLACE FUNCTION public.admin_bot_funnel(p_days integer DEFAULT 30)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_since timestamptz := case when p_days is null then null else now() - make_interval(days => p_days) end;
  v_result jsonb;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  with f as (
    select * from wa_funnel where not is_owner and (v_since is null or created_at >= v_since)
  ),
  steps as (
    select flow, step, count(distinct wa_id) as people from f group by flow, step
  ),
  variants as (
    select flow, step, variant, count(distinct wa_id) as people from f where variant is not null group by flow, step, variant
  ),
  joins as (
    select campaign_code, count(distinct visitor) + count(*) filter (where visitor is null) as people
    from join_clicks_counted
    where campaign_code in ('bot-diamond', 'bot-diamond-promo', 'bot-recording') and (v_since is null or occurred_at >= v_since)
    group by campaign_code
  ),
  listens as (
    select event_type, count(distinct coalesce(visitor, id::text)) as people
    from story_link_events_counted
    where campaign_code = 'bot-recording' and (v_since is null or occurred_at >= v_since)
    group by event_type
  ),
  joins_real as (
    select flow, status, count(distinct wa_id) as people from wa_group_joins
    where status <> 'joined_after_bot' or v_since is null or member_since >= v_since
    group by flow, status
  ),
  days as (
    select (created_at at time zone 'Asia/Jerusalem')::date as day, flow, count(distinct wa_id) as people
    from wa_funnel
    where not is_owner and step = 'request' and created_at >= now() - interval '14 days'
    group by 1, 2
  )
  select jsonb_build_object(
    'since', v_since,
    'first_event', (select min(created_at) from wa_funnel where not is_owner),
    'flows', coalesce((select jsonb_object_agg(flow, s) from (
        select flow, jsonb_object_agg(step, people) as s from steps group by flow) x), '{}'::jsonb),
    'variants', coalesce((select jsonb_object_agg(flow || ':' || step, v) from (
        select flow, step, jsonb_object_agg(variant, people) as v from variants group by flow, step) y), '{}'::jsonb),
    'joins', coalesce((select jsonb_object_agg(campaign_code, people) from joins), '{}'::jsonb),
    'listens', coalesce((select jsonb_object_agg(event_type, people) from listens), '{}'::jsonb),
    'group_joins', coalesce((select jsonb_object_agg(flow, s) from (
        select flow, jsonb_object_agg(status, people) as s from joins_real group by flow) z), '{}'::jsonb),
    'group_tracking', (select value from wa_settings where key = 'group_tracking'),
    'days', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'flow', flow, 'people', people) order by day) from days), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$function$;
