-- דוח המשפך של בוטי הוואטסאפ (אברהם, 2026-10-26: "מעקב על המרות של כל שלב כדי להבין איפה הולך חלק ואיפה ניתקע",
-- "באתר בממשק מנהל דיווח אוטומטי ללא טוקנים"). מוצג ב-bots.html, רק למנהל.
-- המקורות: wa_funnel (כל שלב שאדם הגיע אליו בבוט, נכתב ע"י הבוט - רוני המתכנת/Tools/wa_cloud_bot, מיגרציה wa_0004),
-- join_clicks (לחיצות על קישורי הקבוצה שהבוטים שולחים, לפי קמפיין) ו-story_link_events (האזנות מהסטטוסים של בוט ההקלטה).
-- נספרים אנשים שונים (לא הודעות), בלי הבדיקות של אברהם עצמו. p_days = כמה ימים אחורה, null = מההתחלה.
-- נוצר ע"י רוני המתכנת.

create or replace function admin_bot_funnel(p_days integer default 30)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
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
    from join_clicks
    where campaign_code in ('bot-diamond', 'bot-diamond-promo', 'bot-recording') and (v_since is null or occurred_at >= v_since)
    group by campaign_code
  ),
  listens as (
    select event_type, count(distinct coalesce(visitor, id::text)) as people
    from story_link_events
    where campaign_code = 'bot-recording' and (v_since is null or occurred_at >= v_since)
    group by event_type
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
    'days', coalesce((select jsonb_agg(jsonb_build_object('day', day, 'flow', flow, 'people', people) order by day) from days), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;
grant execute on function admin_bot_funnel(integer) to authenticated;
