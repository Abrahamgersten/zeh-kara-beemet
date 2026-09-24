-- שלב ב' של "תובנות ושימוש" (ראו 0008): מעקב-שימוש קליל בתוכן האתר עצמו
-- (אילו סיפורים הופעלו, אילו קטגוריות נלחצו) - לא היה קיים בכלל קודם, כי
-- האתר סטטי-תוכן. תיעוד מצטבר בלבד למנהל, לא יומן-קליקים לכל משפחה.
-- אושר ע"י אברהם 2026-09-24 בתנאי מפורש: "אל תשנה את האתר וחווית המשתמש" -
-- כל המעקב לא-חוסם, נכשל בשקט, ובלי שום שינוי גלוי בצד הלקוח.
-- נוצר ע"י רוני המתכנת, 2026-09-24.

create table if not exists content_events (
  id             uuid primary key default gen_random_uuid(),
  family_id      uuid references subscribers(id) on delete cascade,
  event_type     text not null check (event_type in ('audio_play', 'category_nav_click', 'spot_diff_solved')),
  category_label text,
  episode_label  text,
  occurred_at    timestamptz not null default now()
);
create index if not exists content_events_family_id_idx on content_events (family_id);
create index if not exists content_events_occurred_at_idx on content_events (occurred_at);

-- RLS מופעל בלי שום select/insert policy ללקוח - כתיבה רק דרך log_content_event
-- (security definer), קריאה רק דרך admin_content_engagement (security definer,
-- is_admin() בלבד) - אותה מוסכמת "אין כתיבה/קריאה ישירה, הכל דרך RPC" כמו בכל
-- שאר המערכת.
alter table content_events enable row level security;

-- כתיבת אירוע: לעולם לא זורקת שגיאה (גם אם auth.uid() לא נפתר לאיזושהי
-- סיבה) - זה ערוץ-רקע, לא חלק מהזרימה שהמשתמש רואה, ואסור שיפריע לה.
create or replace function log_content_event(p_event_type text, p_category_label text, p_episode_label text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid;
begin
  if p_event_type not in ('audio_play', 'category_nav_click', 'spot_diff_solved') then
    return;
  end if;
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then
    return;
  end if;
  insert into content_events (family_id, event_type, category_label, episode_label)
  values (v_family_id, p_event_type, nullif(trim(coalesce(p_category_label, '')), ''), nullif(trim(coalesce(p_episode_label, '')), ''));
exception when others then
  -- הגנה כפולה: אף תקלה כאן (למשל קטגוריה חדשה שלא צפויה) לא תעלה ללקוח.
  return;
end;
$$;
grant execute on function log_content_event(text, text, text) to authenticated;

-- תקציר-שימוש בתוכן למנהל: פופולריות פרקים/קטגוריות בפועל.
create or replace function admin_content_engagement()
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare
  v_result jsonb;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  select jsonb_build_object(
    'total_events', (select count(*) from content_events),
    'events_7d', (select count(*) from content_events where occurred_at >= now() - interval '7 days'),
    'families_engaged_7d', (select count(distinct family_id) from content_events where occurred_at >= now() - interval '7 days'),

    'top_episodes', coalesce((
      select jsonb_agg(row) from (
        select jsonb_build_object(
          'category_label', category_label, 'episode_label', episode_label, 'plays', count(*)
        ) as row
        from content_events
        where event_type = 'audio_play' and episode_label is not null
        group by category_label, episode_label
        order by count(*) desc
        limit 15
      ) x
    ), '[]'::jsonb),

    'category_clicks', coalesce((
      select jsonb_agg(row) from (
        select jsonb_build_object('category_label', category_label, 'clicks', count(*)) as row
        from content_events
        where event_type = 'category_nav_click' and category_label is not null
        group by category_label
        order by count(*) desc
      ) x
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;
grant execute on function admin_content_engagement() to authenticated;
