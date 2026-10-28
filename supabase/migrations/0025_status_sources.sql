-- איפה משתפים יותר בסטטוס (אברהם, 2026-10-28: "מעקב מאיפה אנשים יותר משתפים בסטטוס, דרך האזנה בממשק או דרך
-- האזנה בבוט"). טבלה אחת ב-bots.html, לכל מקור:
--   offered  כמה הוצע להם לשתף      shared  כמה לחצו "לשיתוף בסטטוס" / הסכימו וקיבלו את החומר
--   posted   כמה אישרו שהעלו (רק בבוטים ששואלים)     arrivals  כמה אנשים הגיעו דרך הסטטוסים האלה
-- המקורות:
--   app      האפליקציה (js/app.js, מ-28.10): log_story_event עם הקמפיין app - popup = ההזמנה בסוף פרק, status = לחצו.
--            הסטטוס שלה מקשר עם c=app-status, וההגעות הן פתיחות של דף סיפור מהקישור הזה.
--   pages    דפי הסיפור s/<slug>/ (js/story.js): אותם אירועים בלי הקמפיין app; ההגעות = פתיחות עם c=site-status.
--   story    בוט "האזנה לסיפור" (A ו-B), diamond - "אשמח לסיפור", rec - "אשמח להקלטה", promo - "אי היהלומים":
--            wa_funnel (offer, rest בלי מי שקיבל את החומר אחרי שתיקה, posted). ההגעות: story ו-diamond לפי הקוד האישי
--            (wa_referrals, לפי הבוט שבו המשתף קיבל את החומר לאחרונה), rec לפי פתיחות דף הסיפור מהקישור שבסטטוס שלו
--            (c=bot-recording), promo לפי הסמל שבהודעה (wa_ab_events).
-- אנשים שונים בכל עמודה, בלי המכשירים והמספרים של אברהם. נוצר ע"י רוני המתכנת.

insert into join_campaigns (code, name, description) values
  ('app-status', 'סטטוסים מהאפליקציה', 'הקישור שבסטטוס שמשתפים מתוך האפליקציה (מ-28.10.2026; עד אז נספר יחד עם site-status)')
on conflict (code) do nothing;

create or replace function public.admin_status_sources(p_days integer default 30)
returns jsonb
language plpgsql
stable security definer
set search_path to 'public'
as $function$
declare
  v_since timestamptz := case when p_days is null then null else now() - make_interval(days => p_days) end;
  v_result jsonb;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  with site as (
    select event_type, coalesce(campaign_code, '') = 'app' as app, coalesce(visitor, id::text) as who
    from story_link_events_counted
    where event_type in ('popup', 'status') and (v_since is null or occurred_at >= v_since)
  ),
  opens as (
    select campaign_code, count(distinct coalesce(visitor, id::text)) as people
    from story_link_events_counted
    where event_type = 'open' and campaign_code in ('app-status', 'site-status', 'bot-recording') and (v_since is null or occurred_at >= v_since)
    group by campaign_code
  ),
  tests as (
    select distinct wa_id from wa_funnel where is_owner
  ),
  f as (
    select case when flow = 'storyb' then 'story' else flow end as src, step, variant, wa_id
    from wa_funnel
    where not is_owner and flow in ('story', 'storyb', 'diamond', 'rec', 'promo') and step in ('offer', 'rest', 'posted')
      and (v_since is null or created_at >= v_since)
  ),
  bots as (
    select src,
      count(distinct wa_id) filter (where step = 'offer') as offered,
      count(distinct wa_id) filter (where step = 'rest' and coalesce(variant, '') <> 'timeout') as shared,
      count(distinct wa_id) filter (where step = 'posted') as posted
    from f group by src
  ),
  refs as (
    select (select case when f2.flow = 'storyb' then 'story' else f2.flow end
            from wa_funnel f2
            where f2.wa_id = r.referrer and f2.step = 'rest' and f2.flow in ('story', 'storyb', 'diamond') and f2.created_at <= r.created_at
            order by f2.created_at desc limit 1) as src
    from wa_referrals r
    where (v_since is null or r.created_at >= v_since)
      and r.wa_id not in (select wa_id from tests) and r.referrer not in (select wa_id from tests)
  ),
  promo_arrivals as (
    select count(distinct wa_id) as people from wa_ab_events
    where kind = 'arrived' and variant in ('a', 'b') and wa_id not in (select wa_id from tests)
      and (v_since is null or created_at >= v_since)
  ),
  src as (
    select 'app' as key,
      (select count(distinct who) from site where app and event_type = 'popup') as offered,
      (select count(distinct who) from site where app and event_type = 'status') as shared,
      null::bigint as posted,
      coalesce((select people from opens where campaign_code = 'app-status'), 0) as arrivals
    union all
    select 'pages',
      (select count(distinct who) from site where not app and event_type = 'popup'),
      (select count(distinct who) from site where not app and event_type = 'status'),
      null,
      coalesce((select people from opens where campaign_code = 'site-status'), 0)
    union all
    select k, coalesce(b.offered, 0), coalesce(b.shared, 0),
      case when k in ('story', 'diamond') then coalesce(b.posted, 0) end,
      case k when 'rec' then coalesce((select people from opens where campaign_code = 'bot-recording'), 0)
             when 'promo' then (select people from promo_arrivals)
             else (select count(*) from refs where refs.src = k) end
    from (values ('story'), ('diamond'), ('rec'), ('promo')) v(k)
    left join bots b on b.src = v.k
  )
  select jsonb_build_object(
    'sources', (select jsonb_object_agg(key, jsonb_build_object('offered', offered, 'shared', shared, 'posted', posted, 'arrivals', arrivals)) from src),
    'app_since', (select min(occurred_at) from story_link_events where campaign_code = 'app')
  ) into v_result;

  return v_result;
end;
$function$;

revoke all on function public.admin_status_sources(integer) from public, anon;
grant execute on function public.admin_status_sources(integer) to authenticated;
