-- מונה לדפי הסיפור לשיתוף (s/<slug>/, en/s/<slug>/ - ראו tools/build_story_pages.mjs, js/story.js).
-- אברהם, 2026-10-14: "מונה האזנות לכל קישור, כדי לראות איזה סיפור נפתח הכי הרבה".
-- הדפים ציבוריים (בלי התחברות), ולכן זה נפרד מ-content_events (0009), שנרשם רק למנוי מחובר.
-- נספר: פתיחת הדף, התחלת האזנה, האזנה עד הסוף, לחיצה על "שיתוף", לחיצה על "להצטרפות לקבוצה".
-- לא נשמר שום פרט מזהה: לא כתובת IP, לא עוגייה, לא שם. visitor הוא מספר אקראי שהדפדפן שומר
-- אצלו, רק כדי להבחין בין "100 פתיחות" ל-"100 אנשים", וכדי לא לספור רענון דף כפתיחה נוספת.
-- נוצר ע"י רוני המתכנת, 2026-10-14.

create table if not exists story_link_events (
  id          bigint generated always as identity primary key,
  slug        text not null,
  lang        text not null check (lang in ('he', 'en')),
  event_type  text not null check (event_type in ('open', 'play', 'finish', 'share', 'join')),
  visitor     text,
  occurred_at timestamptz not null default now()
);
create index if not exists story_link_events_slug_idx on story_link_events (slug, lang, event_type);
create index if not exists story_link_events_occurred_at_idx on story_link_events (occurred_at);
create index if not exists story_link_events_visitor_idx on story_link_events (visitor, slug, event_type, occurred_at);

-- כמו בשאר המערכת: RLS בלי אף policy. כתיבה רק דרך log_story_event, קריאה רק דרך
-- admin_story_link_stats (is_admin() בלבד).
alter table story_link_events enable row level security;

-- כתיבת אירוע מדף ציבורי. לעולם לא זורקת שגיאה: זה ערוץ רקע, ואסור שיפריע להאזנה.
-- הפונקציה פתוחה לכל גולש, ולכן היא מקבלת רק ערכים בצורה הצפויה, ויש בה שני בלמים:
--   * אותו דפדפן, אותו סיפור, אותו אירוע: פעם אחת ב-30 דקות (רענון דף, לחיצה כפולה).
--   * לא יותר מ-1000 אירועים בדקה בסך הכול, כדי שסקריפט לא ינפח את הטבלה. בשיא אמיתי
--     (הודעה ל-16 קבוצות) מדובר במאות בדקה, כך שהבלם לא אמור לגעת בספירה אמיתית.
create or replace function log_story_event(p_slug text, p_lang text, p_event text, p_visitor text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_visitor text := p_visitor;
begin
  if p_slug is null or p_slug !~ '^[a-z0-9-]{1,80}$' then return; end if;
  if p_lang is null or p_lang not in ('he', 'en') then return; end if;
  if p_event is null or p_event not in ('open', 'play', 'finish', 'share', 'join') then return; end if;
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

-- הסיכום למנהל (admin.html): סך הכול, ושורה לכל סיפור ושפה, מהנפתח ביותר.
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
