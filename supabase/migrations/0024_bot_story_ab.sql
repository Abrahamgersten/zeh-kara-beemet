-- ניסוי A/B בבוט "האזנה לסיפור" (אברהם, 2026-10-28): הגרסה שלו (story) מול הגרסה של רוני (storyb).
-- admin_bot_funnel מחזירה עכשיו גם את קמפיין ההצטרפות של B (bot-story-b), ואת "מי הביא את מי" לכל גרסה בנפרד:
-- referrals_by_arm.a / .b - כמה קיבלו קוד, כמה אנשים חדשים הביאו. הגרסה של אדם = לפי איש הקשר שלו (storyb:<מספר>).
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
    where campaign_code in ('bot-diamond', 'bot-diamond-promo', 'bot-recording', 'bot-story', 'bot-story-b') and (v_since is null or occurred_at >= v_since)
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
  tests as (
    select distinct wa_id from wa_funnel where is_owner
  ),
  refs as (
    select r.* from wa_referrals r
    where (v_since is null or r.created_at >= v_since)
      and r.wa_id not in (select wa_id from tests) and r.referrer not in (select wa_id from tests)
  ),
  top_refs as (
    select r.referrer, count(*) as people,
      (select c.name from wa_contacts c where c.wa_id = 'story:' || r.referrer) as name
    from refs r group by r.referrer order by count(*) desc limit 10
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
    'referrals', jsonb_build_object(
      'codes', (select count(*) from wa_ref_codes k where (v_since is null or k.created_at >= v_since) and k.wa_id not in (select wa_id from tests)),
      'brought', (select count(*) from refs),
      'referrers', (select count(distinct referrer) from refs),
      'top', coalesce((select jsonb_agg(jsonb_build_object('name', name, 'tail', right(referrer, 4), 'people', people) order by people desc) from top_refs), '[]'::jsonb)
    ),
    'referrals_by_arm', (select jsonb_object_agg(arm, jsonb_build_object('codes', codes, 'brought', brought)) from (
        select arm, sum(codes) as codes, sum(brought) as brought from (
          select case when exists (select 1 from wa_contacts c where c.wa_id = 'storyb:' || k.wa_id) then 'b' else 'a' end as arm,
                 1 as codes, 0 as brought
          from wa_ref_codes k where (v_since is null or k.created_at >= v_since) and k.wa_id not in (select wa_id from tests)
          union all
          select case when exists (select 1 from wa_contacts c where c.wa_id = 'storyb:' || r.referrer) then 'b' else 'a' end, 0, 1
          from refs r
        ) u group by arm) w),
    'days', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'flow', flow, 'people', people) order by day) from days), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$function$;
