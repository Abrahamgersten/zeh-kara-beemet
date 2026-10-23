-- שתי בקשות של אברהם (2026-10-23):
-- 1) "נקודות הנטישה בכל הקלטה: לראות בדף הניהול באיזו דקה אנשים מפסיקים להקשיב".
--    listen_sessions: שורה לכל השמעה (מהאתר המלא, מדף סיפור, או מדף סיפור שנפתח מסטטוס) - מאיפה התחילה,
--    עד איפה הגיעה בהאזנה רציפה (דילוג קדימה לא נחשב), והאם הגיעה לסוף. בלי שום פרט מזהה: המזהה הוא מספר
--    אקראי של ההשמעה עצמה. הדפדפן מעדכן את השורה כל 30 שניות של האזנה ובעצירה (js/progress.js).
-- 2) "התראה 'סיפור חדש עלה' לטלפון של מי שהתקין את האתר כאפליקציה".
--    push_subscriptions: כתובת ההתראות שהדפדפן נותן (Web Push) והמפתחות שלה, ושפת האתר. השליחה עצמה
--    מהמחשב של רוני, עם המפתח הפרטי (רוני המתכנת/Tools/push/send_push.py), אחרי שפרק חדש עולה.
-- כמו בשאר המערכת: RLS בלי policies; כתיבה רק דרך הפונקציות, קריאה רק למנהל (is_admin()).
-- נוצר ע"י רוני המתכנת.

create table if not exists listen_sessions (
  session_id  text primary key,
  slug        text not null,
  lang        text not null check (lang in ('he', 'en')),
  source      text not null check (source in ('site', 'link', 'status')),
  start_s     real not null default 0,
  reached_s   real not null default 0,
  duration_s  real,
  completed   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists listen_sessions_slug_idx on listen_sessions (slug, lang);
create index if not exists listen_sessions_created_idx on listen_sessions (created_at);
alter table listen_sessions enable row level security;

-- נקרא מכל דף (גם בלי התחברות). לעולם לא זורק שגיאה. בלם: עד 600 השמעות חדשות בדקה בסך הכול.
create or replace function log_listen(p_session text, p_slug text, p_lang text, p_source text,
                                      p_start real, p_reached real, p_duration real, p_completed boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_session is null or p_session !~ '^[a-f0-9-]{16,40}$' then return; end if;
  if p_slug is null or p_slug !~ '^[a-z0-9-]{1,80}$' then return; end if;
  if p_lang not in ('he', 'en') or p_source not in ('site', 'link', 'status') then return; end if;
  if p_start is null or p_reached is null or p_start < 0 or p_reached < 0 or p_reached > 10800 or p_start > 10800 then return; end if;
  if p_duration is not null and (p_duration <= 0 or p_duration > 10800) then return; end if;

  if not exists (select 1 from listen_sessions where session_id = p_session)
     and (select count(*) from listen_sessions where created_at > now() - interval '1 minute') >= 600 then
    return;
  end if;

  insert into listen_sessions (session_id, slug, lang, source, start_s, reached_s, duration_s, completed)
  values (p_session, p_slug, p_lang, p_source, p_start, greatest(p_reached, p_start), p_duration, coalesce(p_completed, false))
  on conflict (session_id) do update
    set reached_s  = greatest(listen_sessions.reached_s, excluded.reached_s),
        duration_s = coalesce(excluded.duration_s, listen_sessions.duration_s),
        completed  = listen_sessions.completed or excluded.completed,
        updated_at = now()
    where listen_sessions.slug = excluded.slug and listen_sessions.lang = excluded.lang;
exception when others then
  return;
end;
$$;
grant execute on function log_listen(text, text, text, text, real, real, real, boolean) to anon, authenticated;

-- למנהל: לכל הקלטה ושפה - כמה השמעות, כמה הגיעו לסוף, ובכל דקה: כמה עדיין מקשיבים וכמה עצרו בה.
-- רק השמעות של 5 שניות ומעלה, מ-90 הימים האחרונים. מי שהגיע עד 25 שניות לפני הסוף נחשב כמי שסיים: בדפי
-- הסיפור אלה הסיומת והמוזיקה שאחרי הסיפור, ועצירה שם היא לא "נטישה" של הסיפור.
create or replace function admin_listen_dropoff()
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare
  v_result jsonb;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  with s as (
    select session_id, slug, lang, source, start_s, reached_s, duration_s, updated_at,
           (completed or (duration_s is not null and reached_s >= duration_s - 25)) as completed
    from listen_sessions
    where created_at > now() - interval '90 days' and reached_s - start_s >= 5
  ),
  per as (
    select slug, lang,
           count(*) as listens,
           count(*) filter (where completed) as completed,
           max(duration_s) as duration_s,
           round(avg(least(1, reached_s / nullif(duration_s, 0)))::numeric * 100) as avg_pct,
           max(updated_at) as last_at
    from s group by slug, lang
  ),
  minutes as (
    select p.slug, p.lang, m
    from per p, generate_series(0, greatest(0, ceil(coalesce(p.duration_s, 60) / 60.0)::int - 1)) as m
  ),
  curve as (
    select mi.slug, mi.lang, mi.m,
           (select count(*) from s where s.slug = mi.slug and s.lang = mi.lang
              and s.start_s <= mi.m * 60 + 1 and (s.completed or s.reached_s >= mi.m * 60)) as present,
           (select count(*) from s where s.slug = mi.slug and s.lang = mi.lang and not s.completed
              and floor(s.reached_s / 60) = mi.m) as stopped
    from minutes mi
  )
  select jsonb_build_object(
    'since_days', 90,
    'total', (select count(*) from s),
    'stories', coalesce((
      select jsonb_agg(jsonb_build_object(
               'slug', p.slug, 'lang', p.lang, 'listens', p.listens, 'completed', p.completed,
               'duration_s', p.duration_s, 'avg_pct', p.avg_pct, 'last_at', p.last_at,
               'present', (select jsonb_agg(c.present order by c.m) from curve c where c.slug = p.slug and c.lang = p.lang),
               'stopped', (select jsonb_agg(c.stopped order by c.m) from curve c where c.slug = p.slug and c.lang = p.lang),
               'by_source', (select jsonb_object_agg(src, n) from (select source as src, count(*) as n from s
                              where s.slug = p.slug and s.lang = p.lang group by source) q)
             ) order by p.listens desc)
      from per p
    ), '[]'::jsonb)
  ) into v_result;
  return v_result;
end;
$$;
grant execute on function admin_listen_dropoff() to authenticated;


create table if not exists push_subscriptions (
  endpoint     text primary key,
  p256dh       text not null,
  auth         text not null,
  lang         text not null default 'he' check (lang in ('he', 'en')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  last_sent_at timestamptz,
  failures     int not null default 0
);
alter table push_subscriptions enable row level security;

create or replace function save_push_subscription(p_endpoint text, p_p256dh text, p_auth text, p_lang text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_endpoint is null or p_endpoint !~ '^https://' or length(p_endpoint) > 1000 then return; end if;
  if p_p256dh is null or length(p_p256dh) > 200 or p_auth is null or length(p_auth) > 100 then return; end if;
  if (select count(*) from push_subscriptions where created_at > now() - interval '1 minute') >= 200 then return; end if;
  insert into push_subscriptions (endpoint, p256dh, auth, lang)
  values (p_endpoint, p_p256dh, p_auth, case when p_lang = 'en' then 'en' else 'he' end)
  on conflict (endpoint) do update
    set p256dh = excluded.p256dh, auth = excluded.auth, lang = excluded.lang, failures = 0, updated_at = now();
exception when others then
  return;
end;
$$;
grant execute on function save_push_subscription(text, text, text, text) to anon, authenticated;

create or replace function delete_push_subscription(p_endpoint text)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from push_subscriptions where endpoint = p_endpoint;
exception when others then
  return;
end;
$$;
grant execute on function delete_push_subscription(text) to anon, authenticated;

create or replace function admin_push_stats()
returns jsonb language plpgsql security definer set search_path = public stable as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  return (select jsonb_build_object(
    'total', count(*),
    'he', count(*) filter (where lang = 'he'),
    'en', count(*) filter (where lang = 'en'),
    'last_sent_at', max(last_sent_at)
  ) from push_subscriptions);
end;
$$;
grant execute on function admin_push_stats() to authenticated;
