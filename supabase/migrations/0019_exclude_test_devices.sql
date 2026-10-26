-- לא לספור את הבדיקות של אברהם (2026-10-26: "אתה יכול לנטרל בדיווח את הטסטים שלי?").
-- 1. excluded_visitors: מספרי הדפדפן (zkb_story_visitor) של המכשירים שלו. מכשיר נוסף נרשם מ-bots.html
--    בכפתור "לא לספור את המכשיר הזה" (admin_exclude_device). הראשונים: הלחיצות שלו בבדיקות 25-26.10.
-- 2. כל דוחות הלחיצות וההאזנות (קמפיינים, דף המספרים הציבורי, דוח הבוטים, דפי הסיפור) קוראים מעכשיו מ-
--    join_clicks_counted / story_link_events_counted, שמסננים את המכשירים האלה. הנתונים עצמם לא נמחקים.
-- 3. join_click(p_test): קישור עם &t=1 (הבוט מוסיף אותו להודעות שהוא שולח לאברהם עצמו) מעביר לקבוצה בלי לספור.
-- נוצר ע"י רוני המתכנת.

create table if not exists excluded_visitors (
  visitor  text primary key,
  note     text,
  added_at timestamptz not null default now()
);
alter table excluded_visitors enable row level security;
insert into excluded_visitors (visitor, note) values
  ('446a09ee-5963-4e9e-8e76-ce8e2fa1b2a9', 'אברהם - הבדיקות של 25-26.10 (הדפדפן הקבוע)'),
  ('ccf24f4a-1dbc-4cb5-81c7-ccc59e52ecf9', 'אברהם - בדיקת בוט הקומיקס 25.10, 22:41'),
  ('45943033-b1b9-49f3-82df-3b35a4afae4a', 'אברהם - בדיקת בוט ההקלטה 26.10, 09:10')
on conflict (visitor) do nothing;

create or replace view join_clicks_counted as
  select * from join_clicks c where c.visitor is null or not exists (select 1 from excluded_visitors x where x.visitor = c.visitor);
create or replace view story_link_events_counted as
  select * from story_link_events e where e.visitor is null or not exists (select 1 from excluded_visitors x where x.visitor = e.visitor);
revoke all on join_clicks_counted, story_link_events_counted from anon, authenticated;

create or replace function admin_exclude_device(p_visitor text, p_note text default null)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  if p_visitor is null or p_visitor !~ '^[a-f0-9-]{16,40}$' then return false; end if;
  insert into excluded_visitors (visitor, note) values (p_visitor, coalesce(p_note, 'נרשם מ-bots.html')) on conflict (visitor) do nothing;
  return true;
end;
$$;
grant execute on function admin_exclude_device(text, text) to authenticated;

drop function if exists join_click(text, text);
create or replace function join_click(p_code text default null, p_visitor text default null, p_test boolean default false)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code    text := nullif(lower(trim(coalesce(p_code, ''))), '');
  v_visitor text := p_visitor;
  v_url     text;
begin
  select url into v_url from join_target where id = 1;
  if coalesce(p_test, false) then return v_url; end if; -- a test link (&t=1): to the group, not counted

  begin
    if v_code is not null and v_code !~ '^[a-z0-9-]{2,40}$' then v_code := null; end if;
    if v_visitor is not null and v_visitor !~ '^[a-f0-9-]{16,40}$' then v_visitor := null; end if;

    if v_visitor is not null and exists (
      select 1 from join_clicks
      where visitor = v_visitor and campaign_code is not distinct from v_code
        and occurred_at > now() - interval '30 minutes'
    ) then
      return v_url;
    end if;
    if (select count(*) from join_clicks where occurred_at > now() - interval '1 minute') >= 1000 then
      return v_url;
    end if;

    insert into join_clicks (campaign_code, visitor) values (v_code, v_visitor);
  exception when others then
    null;
  end;

  return v_url;
end;
$$;
grant execute on function join_click(text, text, boolean) to anon, authenticated;

-- the reports, as they are in the database today, reading the filtered views
CREATE OR REPLACE FUNCTION public.admin_join_campaign_stats()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_result jsonb;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  with c as (
    select
      campaign_code,
      count(*)                                                        as clicks,
      count(distinct visitor) + count(*) filter (where visitor is null) as people,
      count(distinct visitor) filter (where occurred_at >= now() - interval '7 days')
        + count(*) filter (where visitor is null and occurred_at >= now() - interval '7 days') as people_7d,
      count(distinct visitor) filter (where occurred_at >= date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem')
        + count(*) filter (where visitor is null and occurred_at >= date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem') as people_today,
      min(occurred_at) as first_click,
      max(occurred_at) as last_click
    from join_clicks_counted
    group by campaign_code
  )
  select jsonb_build_object(
    'campaigns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'code', jc.code,
        'name', jc.name,
        'description', jc.description,
        'archived', jc.archived,
        'created_at', jc.created_at,
        'stats_key', jc.stats_key,
        'clicks', coalesce(c.clicks, 0),
        'people', coalesce(c.people, 0),
        'people_7d', coalesce(c.people_7d, 0),
        'people_today', coalesce(c.people_today, 0),
        'first_click', c.first_click,
        'last_click', c.last_click
      ) order by jc.archived, coalesce(c.people, 0) desc, jc.created_at desc)
      from join_campaigns jc
      left join c on c.campaign_code = jc.code
    ), '[]'::jsonb),
    'direct', (
      select jsonb_build_object(
        'clicks', coalesce(max(c.clicks), 0),
        'people', coalesce(max(c.people), 0),
        'people_7d', coalesce(max(c.people_7d), 0),
        'people_today', coalesce(max(c.people_today), 0),
        'last_click', max(c.last_click)
      ) from c where c.campaign_code is null
    ),
    'unknown', coalesce((
      select jsonb_agg(jsonb_build_object(
        'code', c.campaign_code, 'clicks', c.clicks, 'people', c.people, 'last_click', c.last_click
      ) order by c.people desc)
      from c
      where c.campaign_code is not null
        and not exists (select 1 from join_campaigns jc where jc.code = c.campaign_code)
    ), '[]'::jsonb),
    'totals', (
      select jsonb_build_object(
        'clicks', count(*),
        'people', count(distinct visitor) + count(*) filter (where visitor is null),
        'people_7d', count(distinct visitor) filter (where occurred_at >= now() - interval '7 days')
          + count(*) filter (where visitor is null and occurred_at >= now() - interval '7 days'),
        'tracked_since', min(occurred_at)
      ) from join_clicks_counted
    )
  ) into v_result;

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.join_campaign_public_stats(p_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_c      join_campaigns;
  v_today  timestamptz := date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem';
  v_result jsonb;
begin
  if p_key is null or p_key !~ '^[a-f0-9]{16}$' then return null; end if;
  select * into v_c from join_campaigns where stats_key = p_key;
  if not found then return null; end if;

  select jsonb_build_object(
    'name', v_c.name,
    'created_at', v_c.created_at,
    'archived', v_c.archived,
    'people',       count(distinct visitor) + count(*) filter (where visitor is null),
    'people_today', count(distinct visitor) filter (where occurred_at >= v_today)
                      + count(*) filter (where visitor is null and occurred_at >= v_today),
    'people_7d',    count(distinct visitor) filter (where occurred_at >= now() - interval '7 days')
                      + count(*) filter (where visitor is null and occurred_at >= now() - interval '7 days'),
    'clicks', count(*),
    'last_click', max(occurred_at),
    'days', coalesce((
      select jsonb_agg(jsonb_build_object('day', d.day, 'people', d.people) order by d.day desc)
      from (
        select (occurred_at at time zone 'Asia/Jerusalem')::date as day,
               count(distinct visitor) + count(*) filter (where visitor is null) as people
        from join_clicks_counted
        where campaign_code = v_c.code and occurred_at >= now() - interval '30 days'
        group by 1
      ) d
    ), '[]'::jsonb)
  ) into v_result
  from join_clicks_counted
  where campaign_code = v_c.code;

  return v_result;
end;
$function$;

CREATE OR REPLACE FUNCTION public.campaign_listen_counts(p_code text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select jsonb_build_object(
    'opens',    count(distinct coalesce(visitor, id::text)) filter (where event_type = 'open'),
    'plays',    count(distinct coalesce(visitor, id::text)) filter (where event_type = 'play'),
    'finishes', count(distinct coalesce(visitor, id::text)) filter (where event_type = 'finish'),
    'joins',    count(distinct coalesce(visitor, id::text)) filter (where event_type = 'join'))
  from story_link_events_counted where campaign_code = p_code;
$function$;

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
$function$;

CREATE OR REPLACE FUNCTION public.admin_story_link_stats()
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_result jsonb;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  select jsonb_build_object(
    'totals', (
      select jsonb_build_object(
        'opens',    count(*) filter (where event_type = 'open'),
        'visitors', count(distinct visitor) filter (where event_type = 'open'),
        'plays',    count(*) filter (where event_type = 'play'),
        'finishes', count(*) filter (where event_type = 'finish'),
        'shares',   count(*) filter (where event_type = 'share'),
        'statuses', count(*) filter (where event_type = 'status'),
        'popups',   count(*) filter (where event_type = 'popup'),
        'joins',    count(*) filter (where event_type = 'join'),
        'opens_7d', count(*) filter (where event_type = 'open' and occurred_at >= now() - interval '7 days'),
        'plays_7d', count(*) filter (where event_type = 'play' and occurred_at >= now() - interval '7 days')
      )
      from story_link_events_counted
    ),
    'stories', coalesce((
      select jsonb_agg(row order by opens desc, plays desc)
      from (
        select
          count(*) filter (where event_type = 'open') as opens,
          count(*) filter (where event_type = 'play') as plays,
          jsonb_build_object(
            'slug', slug,
            'lang', lang,
            'opens',    count(*) filter (where event_type = 'open'),
            'visitors', count(distinct visitor) filter (where event_type = 'open'),
            'plays',    count(*) filter (where event_type = 'play'),
            'finishes', count(*) filter (where event_type = 'finish'),
            'shares',   count(*) filter (where event_type = 'share'),
            'statuses', count(*) filter (where event_type = 'status'),
            'popups',   count(*) filter (where event_type = 'popup'),
            'joins',    count(*) filter (where event_type = 'join'),
            'opens_7d', count(*) filter (where event_type = 'open' and occurred_at >= now() - interval '7 days'),
            'last_open', max(occurred_at) filter (where event_type = 'open')
          ) as row
        from story_link_events_counted
        group by slug, lang
        order by opens desc, plays desc
        limit 200
      ) x
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$function$;
