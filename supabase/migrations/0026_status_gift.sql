-- מתנה למי שהעלה סטטוס (אברהם, 2026-11-10): קישור מיוחד לאתר (?g=<קוד אישי>), בלי התחברות, שבו בוחרים פרק אחד
-- להאזנה. הקישור הרגיל לאתר לא השתנה.
--   * כל סטטוס שאושר בבוט (wa_shares, מיגרציה wa_0008 של הבוט) = מתנה אחת: פרק אחד לבחירה.
--   * פרק אחד ביום (יום לפי שעון ישראל). אותו פרק אפשר לשמוע שוב באותו יום, פרק אחר לא.
--   * סטטוס נוסף ביום אחר = עוד פרק, אבל לא יותר משני פרקים בשבעה ימים.
--   * סטטוס שלא נוצל תקף שבעה ימים.
--   * מי שמנסה פרק נוסף רואה הודעה על תוכנית המנויים, ויכול להשאיר טלפון (subscription_leads).
-- הקוד האישי נוצר לכל מספר וואטסאפ (gift_tokens) ונשלח לו מהבוט. מי שמעביר את הקישור שלו הלאה חולק את אותה מתנה.
-- כמו בשאר המערכת: RLS בלי policy, והגישה רק דרך הפונקציות. נוצר ע"י רוני המתכנת.

create table if not exists gift_tokens (
  token      text primary key,
  wa_id      text not null unique,
  created_at timestamptz not null default now()
);
alter table gift_tokens enable row level security;

create table if not exists gift_plays (
  id         bigint generated always as identity primary key,
  wa_id      text not null,
  share_id   bigint not null unique,           -- הסטטוס (wa_shares.id) שהפרק הזה ניצל
  slug       text not null,
  day        date not null,                    -- היום בישראל
  created_at timestamptz not null default now(),
  unique (wa_id, day)
);
alter table gift_plays enable row level security;

create table if not exists subscription_leads (
  id         bigint generated always as identity primary key,
  phone      text not null,
  wa_id      text,                             -- בעל הקישור שממנו הגיעו (לא בהכרח מי שהשאיר את הטלפון)
  slug       text,                             -- הפרק שניסו לשמוע
  source     text not null default 'gift',
  created_at timestamptz not null default now()
);
alter table subscription_leads enable row level security;

-- הקוד האישי של מספר וואטסאפ (נוצר בפעם הראשונה). רק לבוט (service_role).
create or replace function gift_token_for(p_wa_id text)
returns text language plpgsql security definer set search_path = public as $$
declare
  v_token text;
begin
  if p_wa_id is null or p_wa_id !~ '^[0-9]{8,20}$' then return null; end if;
  select token into v_token from gift_tokens where wa_id = p_wa_id;
  if v_token is null then
    insert into gift_tokens (token, wa_id)
    values (substr(replace(gen_random_uuid()::text, '-', ''), 1, 20), p_wa_id)
    on conflict (wa_id) do nothing;
    select token into v_token from gift_tokens where wa_id = p_wa_id;
  end if;
  return v_token;
end;
$$;
revoke all on function gift_token_for(text) from public, anon, authenticated;
grant execute on function gift_token_for(text) to service_role;

-- מצב המתנה של קישור: { valid, today (הפרק שנבחר היום), can_pick, reason }
-- reason כשאי אפשר לבחור: day (כבר נבחר פרק היום), week (שניים בשבעה ימים), no_share (אין סטטוס שלא נוצל)
create or replace function gift_state(p_token text)
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare
  v_wa    text;
  v_day   date := (now() at time zone 'Asia/Jerusalem')::date;
  v_today text;
  v_week  int;
  v_free  int;
begin
  if p_token is null or p_token !~ '^[a-f0-9]{20}$' then return jsonb_build_object('valid', false); end if;
  select wa_id into v_wa from gift_tokens where token = p_token;
  if v_wa is null then return jsonb_build_object('valid', false); end if;

  select slug into v_today from gift_plays where wa_id = v_wa and day = v_day;
  select count(*) into v_week from gift_plays where wa_id = v_wa and day > v_day - 7;
  select count(*) into v_free from wa_shares s
   where s.wa_id = v_wa and s.posted_at > now() - interval '7 days'
     and not exists (select 1 from gift_plays p where p.share_id = s.id);

  return jsonb_build_object(
    'valid', true,
    'today', v_today,
    'can_pick', v_today is null and v_week < 2 and v_free > 0,
    'reason', case when v_today is not null then 'day' when v_week >= 2 then 'week' when v_free = 0 then 'no_share' else null end
  );
end;
$$;
grant execute on function gift_state(text) to anon, authenticated;

-- בחירת פרק (נקראת כשלוחצים "נגן"): { ok, reason }. אותו פרק שוב באותו יום: ok.
create or replace function gift_pick(p_token text, p_slug text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_wa    text;
  v_day   date := (now() at time zone 'Asia/Jerusalem')::date;
  v_today text;
  v_share bigint;
begin
  if p_token is null or p_token !~ '^[a-f0-9]{20}$' then return jsonb_build_object('ok', false, 'reason', 'invalid'); end if;
  if p_slug is null or p_slug !~ '^[a-z0-9-]{1,80}$' then return jsonb_build_object('ok', false, 'reason', 'invalid'); end if;
  select wa_id into v_wa from gift_tokens where token = p_token;
  if v_wa is null then return jsonb_build_object('ok', false, 'reason', 'invalid'); end if;

  -- שתי לחיצות באותו רגע (שני מכשירים עם אותו קישור): אחת אחרי השנייה
  perform pg_advisory_xact_lock(hashtext('gift:' || v_wa));

  select slug into v_today from gift_plays where wa_id = v_wa and day = v_day;
  if v_today is not null then
    return jsonb_build_object('ok', v_today = p_slug, 'reason', case when v_today = p_slug then null else 'day' end);
  end if;
  if (select count(*) from gift_plays where wa_id = v_wa and day > v_day - 7) >= 2 then
    return jsonb_build_object('ok', false, 'reason', 'week');
  end if;
  select s.id into v_share from wa_shares s
   where s.wa_id = v_wa and s.posted_at > now() - interval '7 days'
     and not exists (select 1 from gift_plays p where p.share_id = s.id)
   order by s.posted_at limit 1;
  if v_share is null then return jsonb_build_object('ok', false, 'reason', 'no_share'); end if;

  insert into gift_plays (wa_id, share_id, slug, day) values (v_wa, v_share, p_slug, v_day);
  return jsonb_build_object('ok', true, 'reason', null);
end;
$$;
grant execute on function gift_pick(text, text) to anon, authenticated;

-- "עדכנו אותי כשתוכנית המנויים נפתחת": שמירת הטלפון. עד 5 ביום לכל קישור.
create or replace function gift_lead(p_token text, p_phone text, p_slug text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_wa    text;
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g');
begin
  if p_token is null or p_token !~ '^[a-f0-9]{20}$' then return jsonb_build_object('ok', false); end if;
  select wa_id into v_wa from gift_tokens where token = p_token;
  if v_wa is null then return jsonb_build_object('ok', false); end if;
  if v_phone !~ '^\+?[0-9]{9,15}$' then return jsonb_build_object('ok', false, 'reason', 'phone'); end if;
  if (select count(*) from subscription_leads where wa_id = v_wa and created_at > now() - interval '1 day') >= 5 then
    return jsonb_build_object('ok', true);
  end if;
  if not exists (select 1 from subscription_leads where phone = v_phone) then
    insert into subscription_leads (phone, wa_id, slug)
    values (v_phone, v_wa, case when p_slug ~ '^[a-z0-9-]{1,80}$' then p_slug else null end);
  end if;
  return jsonb_build_object('ok', true);
end;
$$;
grant execute on function gift_lead(text, text, text) to anon, authenticated;

-- למנהל (admin.html): כמה ניצלו את המתנה, אילו פרקים נבחרו, ומי ביקש עדכון על תוכנית המנויים.
create or replace function admin_gift_overview()
returns jsonb language plpgsql security definer set search_path = public stable as $$
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  return jsonb_build_object(
    'links', (select count(*) from gift_tokens),
    'plays', (select count(*) from gift_plays),
    'plays_7d', (select count(*) from gift_plays where created_at > now() - interval '7 days'),
    'people', (select count(distinct wa_id) from gift_plays),
    'top', coalesce((select jsonb_agg(t) from (
        select slug, count(*) as plays from gift_plays group by slug order by count(*) desc, slug limit 15) t), '[]'::jsonb),
    'leads', coalesce((select jsonb_agg(l) from (
        select phone, slug, created_at from subscription_leads order by created_at desc limit 500) l), '[]'::jsonb)
  );
end;
$$;
grant execute on function admin_gift_overview() to authenticated;
