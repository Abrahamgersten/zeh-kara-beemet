-- שיתוף בסטטוס (אברהם, 2026-10-19): כפתור השיתוף של סיפור עם תמונת סטטוס שואל "בהודעה או בסטטוס"
-- (js/share-sheet.js), ובסוף ההקלטה של סיפור מסומן מוצגת הזמנה לשתף בסטטוס (js/story.js).
-- שני אירועים חדשים למונה של דפי הסיפור (0012):
--   status - לחצו "לשיתוף בסטטוס" (או הורידו את תמונת הסטטוס במחשב)
--   popup  - ההזמנה לסטטוס בסוף ההקלטה הוצגה
-- "share" נשאר: שיתוף בהודעה. נוצר ע"י רוני המתכנת.

alter table story_link_events drop constraint if exists story_link_events_event_type_check;
alter table story_link_events add constraint story_link_events_event_type_check
  check (event_type in ('open', 'play', 'finish', 'share', 'join', 'status', 'popup'));

create or replace function log_story_event(p_slug text, p_lang text, p_event text, p_visitor text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_visitor text := p_visitor;
begin
  if p_slug is null or p_slug !~ '^[a-z0-9-]{1,80}$' then return; end if;
  if p_lang is null or p_lang not in ('he', 'en') then return; end if;
  if p_event is null or p_event not in ('open', 'play', 'finish', 'share', 'join', 'status', 'popup') then return; end if;
  if v_visitor is not null and v_visitor !~ '^[a-f0-9-]{16,40}$' then v_visitor := null; end if;

  if v_visitor is not null and exists (
    select 1 from story_link_events
    where visitor = v_visitor and slug = p_slug and lang = p_lang and event_type = p_event
      and occurred_at > now() - interval '30 minutes'
  ) then
    return;
  end if;
  if (select count(*) from story_link_events where occurred_at > now() - interval '1 minute') >= 1000 then
    return;
  end if;

  insert into story_link_events (slug, lang, event_type, visitor) values (p_slug, p_lang, p_event, v_visitor);
exception when others then
  return;
end;
$$;
grant execute on function log_story_event(text, text, text, text) to anon, authenticated;

create or replace function admin_story_link_stats()
returns jsonb language plpgsql security definer set search_path = public stable as $$
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
      from story_link_events
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
        from story_link_events
        group by slug, lang
        order by opens desc, plays desc
        limit 200
      ) x
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;
grant execute on function admin_story_link_stats() to authenticated;
