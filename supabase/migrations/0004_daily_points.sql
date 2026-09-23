-- מערכת נקודות יומית ("זה קרה באמת") - ילדים, סימוני צ'קליסט יומיים (עם
-- הקפאת נקודות), טבלת פרסים/רפי-סף להתקדמות המשפחה. נוצר ע"י רוני המתכנת,
-- 2026-09-23. ראו הפרוטוקול: "רוני המתכנת\Docs\פרוטוקול מערכת הנקודות -
-- זה קרה באמת.md".

create table if not exists children (
  id           uuid primary key default gen_random_uuid(),
  family_id    uuid not null references subscribers(id) on delete cascade,
  name         text not null,
  is_active    boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists children_family_id_idx on children (family_id);
alter table children enable row level security;
drop policy if exists "family reads own children" on children;
create policy "family reads own children"
  on children for select
  using (family_id in (select id from subscribers where auth_user_id = auth.uid()));
drop trigger if exists children_set_updated_at on children;
create trigger children_set_updated_at
  before update on children for each row execute function set_updated_at();

create table if not exists checklist_items (
  id           uuid primary key default gen_random_uuid(),
  item_key     text not null unique,
  category     text not null check (category in ('daily', 'parasha')),
  label_he     text not null,
  label_en     text not null,
  icon         text,
  base_points  int not null default 5 check (base_points > 0),
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table checklist_items enable row level security;
drop policy if exists "authenticated reads active items" on checklist_items;
create policy "authenticated reads active items"
  on checklist_items for select to authenticated using (is_active);
drop trigger if exists checklist_items_set_updated_at on checklist_items;
create trigger checklist_items_set_updated_at
  before update on checklist_items for each row execute function set_updated_at();

insert into checklist_items (item_key, category, label_he, label_en, icon, base_points, sort_order) values
  ('brush-teeth', 'daily', 'צחצחתי שיניים', 'Brushed my teeth', '🦷', 5, 1),
  ('hug-parents', 'daily', 'חיבקתי את אמא ואבא', 'Hugged mom and dad', '🤗', 5, 2),
  ('shema',       'daily', 'אמרתי קריאת שמע',    'Said the Shema',    '🌙', 5, 3)
on conflict (item_key) do nothing;

create table if not exists checkins (
  id                             uuid primary key default gen_random_uuid(),
  family_id                      uuid not null references subscribers(id) on delete cascade,
  child_id                       uuid not null references children(id) on delete cascade,
  item_id                        uuid not null references checklist_items(id),
  checkin_date                   date not null,
  points_awarded                 int not null,
  family_child_count_at_checkin  int not null,
  created_at                     timestamptz not null default now(),
  unique (child_id, item_id, checkin_date)
);
create index if not exists checkins_family_id_idx on checkins (family_id);
create index if not exists checkins_child_date_idx on checkins (child_id, checkin_date);
alter table checkins enable row level security;
drop policy if exists "family reads own checkins" on checkins;
create policy "family reads own checkins"
  on checkins for select
  using (family_id in (select id from subscribers where auth_user_id = auth.uid()));

create table if not exists rewards (
  id                uuid primary key default gen_random_uuid(),
  threshold_points  int not null unique check (threshold_points > 0),
  title_he          text not null,
  title_en          text not null,
  description_he    text,
  description_en    text,
  link_url_he       text,
  link_url_en       text,
  image_url         text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
alter table rewards enable row level security;
drop policy if exists "authenticated reads active rewards" on rewards;
create policy "authenticated reads active rewards"
  on rewards for select to authenticated using (is_active);
drop trigger if exists rewards_set_updated_at on rewards;
create trigger rewards_set_updated_at
  before update on rewards for each row execute function set_updated_at();

insert into rewards (threshold_points, title_he, title_en, description_he, description_en, link_url_he, link_url_en) values
  (100, 'סיפור "אי היהלומים"', 'The "Diamond Island" Story',
   'סיפור המשך מלא הרפתקאות מחכה לכם!',
   'A sequel story full of adventures is waiting for you!',
   'https://abrahamgersten.github.io/diamond-island-story/',
   'https://abrahamgersten.github.io/diamond-island-story/en/')
on conflict (threshold_points) do nothing;

create or replace function points_per_child(base_points int, child_count int)
returns int language sql immutable as $$
  select ceil(base_points::numeric / greatest(child_count, 1))::int;
$$;

create or replace function family_today()
returns date language sql stable as $$
  select (now() at time zone 'Asia/Jerusalem')::date;
$$;

create or replace function add_child(child_name text)
returns children language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid; v_count int; v_row children; v_name text := trim(coalesce(child_name, ''));
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  if v_name = '' then raise exception 'child name required'; end if;
  select count(*) into v_count from children where family_id = v_family_id and is_active;
  if v_count >= 12 then raise exception 'too many children'; end if;
  insert into children (family_id, name, sort_order)
  values (v_family_id, v_name, v_count) returning * into v_row;
  return v_row;
end; $$;
grant execute on function add_child(text) to authenticated;

-- מחיקה רכה (is_active=false), לא מחיקה אמיתית - שומרת על היסטוריית checkins
-- קיימת (הנקודות שכבר נצברו למשפחה לא נגרעות), רק מסירה את הילד מהרשימה
-- הפעילה (טאבים, ספירת "לכמה ילדים לחלק" בסימונים עתידיים).
create or replace function remove_child(p_child_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid;
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  update children set is_active = false
    where id = p_child_id and family_id = v_family_id and is_active;
  if not found then raise exception 'child not found'; end if;
  return true;
end; $$;
grant execute on function remove_child(uuid) to authenticated;

create or replace function toggle_checkin(p_child_id uuid, p_item_key text)
returns table(checked boolean, points_delta int, family_total int)
language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid; v_item_id uuid; v_base_points int;
  v_today date := family_today();
  v_existing checkins; v_child_count int; v_points int;
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  if not exists (select 1 from children where id = p_child_id and family_id = v_family_id and is_active) then
    raise exception 'not authorized';
  end if;
  select id, base_points into v_item_id, v_base_points
    from checklist_items where item_key = p_item_key and is_active;
  if v_item_id is null then raise exception 'unknown item'; end if;
  select * into v_existing from checkins
    where child_id = p_child_id and item_id = v_item_id and checkin_date = v_today;
  if found then
    delete from checkins where id = v_existing.id;
    checked := false; points_delta := -v_existing.points_awarded;
  else
    select count(*) into v_child_count from children where family_id = v_family_id and is_active;
    v_points := points_per_child(v_base_points, v_child_count);
    insert into checkins (family_id, child_id, item_id, checkin_date, points_awarded, family_child_count_at_checkin)
    values (v_family_id, p_child_id, v_item_id, v_today, v_points, v_child_count);
    checked := true; points_delta := v_points;
  end if;
  select coalesce(sum(points_awarded), 0) into family_total from checkins where family_id = v_family_id;
  return next;
end; $$;
grant execute on function toggle_checkin(uuid, text) to authenticated;

create or replace function get_my_points_state()
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare
  v_family_id uuid; v_today date := family_today();
  v_child_count int; v_family_total int; v_result jsonb;
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  select count(*) into v_child_count from children where family_id = v_family_id and is_active;
  select coalesce(sum(points_awarded), 0) into v_family_total from checkins where family_id = v_family_id;
  select jsonb_build_object(
    'family_total', v_family_total,
    'children', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name) order by sort_order, created_at)
                 from children where family_id = v_family_id and is_active), '[]'::jsonb),
    'checklist_items', coalesce((select jsonb_agg(jsonb_build_object(
                 'id', id, 'item_key', item_key, 'category', category,
                 'label_he', label_he, 'label_en', label_en, 'icon', icon,
                 'points_today', points_per_child(base_points, v_child_count)
               ) order by sort_order) from checklist_items where is_active), '[]'::jsonb),
    'checked_today', coalesce((select jsonb_agg(jsonb_build_object('child_id', child_id, 'item_id', item_id))
                 from checkins where family_id = v_family_id and checkin_date = v_today), '[]'::jsonb),
    'rewards', coalesce((select jsonb_agg(jsonb_build_object(
                 'id', id, 'threshold_points', threshold_points,
                 'title_he', title_he, 'title_en', title_en,
                 'description_he', description_he, 'description_en', description_en,
                 'link_url_he', link_url_he, 'link_url_en', link_url_en, 'image_url', image_url,
                 'unlocked', (v_family_total >= threshold_points)
               ) order by threshold_points) from rewards where is_active), '[]'::jsonb)
  ) into v_result;
  return v_result;
end; $$;
grant execute on function get_my_points_state() to authenticated;

-- לאברהם/רוני - הוספת פריטים/פרסים עתידיים (כולל פריט "רעיון בפרשה" השבועי)
-- בלי מיגרציה חדשה. אין UI ב-admin.html בסבב הזה - מריצים כ-RPC ידנית
-- (SQL Editor, או ישירות דרך חיבור ה-DB שכבר יש לרוני).
create or replace function admin_upsert_checklist_item(
  p_item_key text, p_category text, p_label_he text, p_label_en text,
  p_icon text, p_base_points int, p_sort_order int default 0
) returns checklist_items language plpgsql security definer set search_path = public as $$
declare v_row checklist_items;
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  insert into checklist_items (item_key, category, label_he, label_en, icon, base_points, sort_order)
  values (p_item_key, p_category, p_label_he, p_label_en, p_icon, p_base_points, p_sort_order)
  on conflict (item_key) do update set category = excluded.category, label_he = excluded.label_he,
    label_en = excluded.label_en, icon = excluded.icon, base_points = excluded.base_points,
    sort_order = excluded.sort_order, is_active = true, updated_at = now()
  returning * into v_row;
  return v_row;
end; $$;
grant execute on function admin_upsert_checklist_item(text, text, text, text, text, int, int) to authenticated;

create or replace function admin_upsert_reward(
  p_threshold_points int, p_title_he text, p_title_en text,
  p_description_he text, p_description_en text,
  p_link_url_he text, p_link_url_en text, p_image_url text default null
) returns rewards language plpgsql security definer set search_path = public as $$
declare v_row rewards;
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  insert into rewards (threshold_points, title_he, title_en, description_he, description_en, link_url_he, link_url_en, image_url)
  values (p_threshold_points, p_title_he, p_title_en, p_description_he, p_description_en, p_link_url_he, p_link_url_en, p_image_url)
  on conflict (threshold_points) do update set title_he = excluded.title_he, title_en = excluded.title_en,
    description_he = excluded.description_he, description_en = excluded.description_en,
    link_url_he = excluded.link_url_he, link_url_en = excluded.link_url_en,
    image_url = excluded.image_url, is_active = true, updated_at = now()
  returning * into v_row;
  return v_row;
end; $$;
grant execute on function admin_upsert_reward(int, text, text, text, text, text, text, text) to authenticated;
