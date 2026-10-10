-- קישור הצטרפות חכם לקבוצות הוואטסאפ "סיפור לפני השינה - זה קרה באמת" (בקשת אברהם, 2026-10-10).
-- דף whatsapp/ קורא את היעד הנוכחי דרך get_join_target() (פתוח לכולם, מחזיר רק כתובת קבוצה),
-- והשער של משה מחליף אותו דרך set_join_target() כשקבוצה מתמלאת. ההחלפה מוגנת בסוד
-- (נשמר כ-hash בלבד בטבלה join_target_secret, שאין אליה גישה ישירה - RLS בלי policies).
-- נוצר ע"י רוני המתכנת.
create extension if not exists pgcrypto with schema extensions;

create table if not exists join_target (
  id int primary key check (id = 1),
  url text not null,
  updated_at timestamptz not null default now()
);
alter table join_target enable row level security;

create table if not exists join_target_secret (
  id int primary key check (id = 1),
  secret_hash text not null
);
alter table join_target_secret enable row level security;

create or replace function get_join_target()
returns text
language sql
security definer
stable
set search_path = public
as $$ select url from join_target where id = 1 $$;

grant execute on function get_join_target() to anon, authenticated;

create or replace function set_join_target(p_secret text, p_url text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_url is null or p_url !~ '^https://chat\.whatsapp\.com/[A-Za-z0-9]+$' then
    raise exception 'bad url';
  end if;
  if p_secret is null or not exists (
    select 1 from join_target_secret
    where id = 1 and secret_hash = encode(digest(p_secret, 'sha256'), 'hex')
  ) then
    raise exception 'not authorized';
  end if;
  insert into join_target (id, url) values (1, p_url)
  on conflict (id) do update set url = excluded.url, updated_at = now();
end;
$$;

grant execute on function set_join_target(text, text) to anon, authenticated;
