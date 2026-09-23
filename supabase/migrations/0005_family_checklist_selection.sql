-- בחירת רובריקות אישית לכל משפחה ("זה קרה באמת") - מרחיבה את מערכת הנקודות
-- (0004): במקום קטלוג יומי גלובלי-אחיד, כל משפחה בוחרת 3 מתוך 7 תבניות
-- מוכנות + אפשרות ליצור רובריקות מותאמות-אישית משלה. נוצר ע"י רוני המתכנת,
-- 2026-09-24. ראו הפרוטוקול: "רוני המתכנת\Docs\פרוטוקול מערכת הנקודות -
-- זה קרה באמת.md".

-- 4 תבניות רובריקה גלובליות חדשות (מצטרפות לשלוש הקיימות: brush-teeth,
-- hug-parents, shema) - חלק מבחירת-הרובריקות האישית למשפחה.
insert into checklist_items (item_key, category, label_he, label_en, icon, base_points, sort_order) values
  ('pack-bag',    'daily', 'הכנתי מערכת (תיק) למחר',              'Packed my bag for tomorrow',            '🎒', 5, 4),
  ('eat-dinner',  'daily', 'אכלתי יפה ארוחת ערב',                  'Ate dinner nicely',                     '🍽️', 5, 5),
  ('tidy-house',  'daily', 'עזרתי לסדר את הבית 10 דקות',           'Helped tidy the house for 10 minutes',  '🧹', 5, 6),
  ('gratitude',   'daily', 'אמרתי תודה על 3 דברים טובים שהיו לי',  'Said thanks for 3 good things today',   '🙏', 5, 7)
on conflict (item_key) do nothing;

-- family_id על checklist_items: null = תבנית גלובלית (זמינה לבחירה לכולם),
-- לא-null = פריט מותאם-אישית שנוצר ע"י משפחה ספציפית (פרטי לה בלבד).
alter table checklist_items add column if not exists family_id uuid references subscribers(id) on delete cascade;
create index if not exists checklist_items_family_id_idx on checklist_items (family_id);

-- מעדכנים את ה-select policy הקיים: פריט גלובלי גלוי לכולם (כמו היום), פריט
-- מותאם-אישית גלוי רק למשפחה שיצרה אותו.
drop policy if exists "authenticated reads active items" on checklist_items;
create policy "authenticated reads active items"
  on checklist_items for select to authenticated
  using (is_active and (family_id is null or family_id in (select id from subscribers where auth_user_id = auth.uid())));

-- אילו 3 פריטים (category='daily') פעילים כרגע עבור כל משפחה.
create table if not exists family_checklist_selection (
  id           uuid primary key default gen_random_uuid(),
  family_id    uuid not null references subscribers(id) on delete cascade,
  item_id      uuid not null references checklist_items(id) on delete cascade,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  unique (family_id, item_id)
);
create index if not exists family_checklist_selection_family_id_idx on family_checklist_selection (family_id);
alter table family_checklist_selection enable row level security;
drop policy if exists "family reads own selection" on family_checklist_selection;
create policy "family reads own selection"
  on family_checklist_selection for select
  using (family_id in (select id from subscribers where auth_user_id = auth.uid()));

-- יצירת פריט מותאם-אישית (האופציה הפתוחה - "ההורה כותב רובריקה בעצמו").
create or replace function create_custom_checklist_item(p_label_he text, p_label_en text default null, p_icon text default '⭐')
returns checklist_items language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid; v_count int; v_row checklist_items;
  v_key text := 'custom-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10);
  v_he text := trim(coalesce(p_label_he, ''));
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  if v_he = '' then raise exception 'label required'; end if;
  select count(*) into v_count from checklist_items where family_id = v_family_id;
  if v_count >= 10 then raise exception 'too many custom items'; end if;
  insert into checklist_items (item_key, category, label_he, label_en, icon, base_points, family_id)
  values (v_key, 'daily', v_he, coalesce(nullif(trim(p_label_en), ''), v_he), coalesce(nullif(p_icon, ''), '⭐'), 5, v_family_id)
  returning * into v_row;
  return v_row;
end; $$;
grant execute on function create_custom_checklist_item(text, text, text) to authenticated;

-- קביעת הבחירה הפעילה (מחליף לגמרי, לא מוסיף) - חייב בדיוק 3 פריטי daily
-- תקינים (גלובליים או שייכים למשפחה עצמה).
create or replace function set_checklist_selection(p_item_ids uuid[])
returns void language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid; v_valid_count int;
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  if coalesce(array_length(p_item_ids, 1), 0) <> 3 then raise exception 'must select exactly 3 items'; end if;
  select count(*) into v_valid_count from checklist_items
    where id = any(p_item_ids) and category = 'daily' and is_active
      and (family_id is null or family_id = v_family_id);
  if v_valid_count <> 3 then raise exception 'invalid item selection'; end if;
  delete from family_checklist_selection where family_id = v_family_id;
  insert into family_checklist_selection (family_id, item_id, sort_order)
  select v_family_id, x, row_number() over ()
  from unnest(p_item_ids) as x;
end; $$;
grant execute on function set_checklist_selection(uuid[]) to authenticated;

-- add_child: אם למשפחה עדיין אין בחירה בכלל (הצטרפות ראשונה) - ממלאים
-- ברירת מחדל אוטומטית בשלושת הפריטים המקוריים, בלי לחסום/לשאול.
create or replace function add_child(child_name text)
returns children language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid; v_count int; v_row children; v_name text := trim(coalesce(child_name, ''));
  v_has_selection boolean;
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  if v_name = '' then raise exception 'child name required'; end if;
  select count(*) into v_count from children where family_id = v_family_id and is_active;
  if v_count >= 12 then raise exception 'too many children'; end if;
  insert into children (family_id, name, sort_order)
  values (v_family_id, v_name, v_count) returning * into v_row;

  select exists(select 1 from family_checklist_selection where family_id = v_family_id) into v_has_selection;
  if not v_has_selection then
    insert into family_checklist_selection (family_id, item_id, sort_order)
    select v_family_id, id, row_number() over (order by sort_order)
    from checklist_items where item_key in ('brush-teeth', 'hug-parents', 'shema');
  end if;

  return v_row;
end; $$;
-- grant כבר קיים מ-0004, לא צריך שוב.

-- get_my_points_state: checklist_items מוחזר מסונן לפי הבחירה הפעילה של
-- המשפחה (daily) בשילוב עם פריטי parasha (ללא שינוי, לא חלק מ"ה-3").
-- תוספת: preset_catalog - כל האפשרויות שהמשפחה יכולה לבחור מהן (גלובליות +
-- המותאמות-אישית שלה), לצורך מסך "שנו רובריקות" בלקוח.
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
    'checklist_items', coalesce((
      select jsonb_agg(jsonb_build_object(
                 'id', ci.id, 'item_key', ci.item_key, 'category', ci.category,
                 'label_he', ci.label_he, 'label_en', ci.label_en, 'icon', ci.icon,
                 'points_today', points_per_child(ci.base_points, v_child_count)
               ) order by coalesce(fcs.sort_order, ci.sort_order))
      from checklist_items ci
      left join family_checklist_selection fcs on fcs.item_id = ci.id and fcs.family_id = v_family_id
      where ci.is_active and (
        (ci.category = 'daily' and fcs.family_id = v_family_id)
        or ci.category = 'parasha'
      )
    ), '[]'::jsonb),
    'preset_catalog', coalesce((select jsonb_agg(jsonb_build_object(
                 'id', id, 'item_key', item_key, 'label_he', label_he, 'label_en', label_en,
                 'icon', icon, 'is_custom', (family_id is not null)
               ) order by (family_id is not null), sort_order)
                 from checklist_items
                 where category = 'daily' and is_active and (family_id is null or family_id = v_family_id)), '[]'::jsonb),
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
-- grant כבר קיים מ-0004.

-- ניהול קטלוג הרובריקות הגלובליות מתוך admin.html - הוספה/עריכה/הפעלה-
-- השבתה. p_item_key הפך לאופציונלי (נוצר אוטומטית אם לא סופק) כדי שהאדמין
-- לא יצטרך להמציא מזהה טכני ידנית בעת יצירת רובריקה חדשה; שאר פרמטרי
-- ברירת המחדל נוספו רק כדי לשמר את אותה חתימת-טיפוסים בדיוק (text, text,
-- text, text, text, int, int) שכבר קיימת מ-0004 - כך create or replace
-- מחליף את הפונקציה הקיימת במקום, בלי ליצור עומס-שם (overload) כפול.
create or replace function admin_upsert_checklist_item(
  p_item_key text default null,
  p_category text default 'daily',
  p_label_he text default null,
  p_label_en text default null,
  p_icon text default '⭐',
  p_base_points int default 5,
  p_sort_order int default 0
) returns checklist_items language plpgsql security definer set search_path = public as $$
declare
  v_row checklist_items;
  v_key text := coalesce(nullif(trim(p_item_key), ''), 'preset-' || substr(md5(random()::text || clock_timestamp()::text), 1, 10));
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  if trim(coalesce(p_label_he, '')) = '' then raise exception 'label required'; end if;
  insert into checklist_items (item_key, category, label_he, label_en, icon, base_points, sort_order)
  values (v_key, p_category, p_label_he, coalesce(nullif(trim(p_label_en), ''), p_label_he), p_icon, p_base_points, p_sort_order)
  on conflict (item_key) do update set category = excluded.category, label_he = excluded.label_he,
    label_en = excluded.label_en, icon = excluded.icon, base_points = excluded.base_points,
    sort_order = excluded.sort_order, is_active = true, updated_at = now()
  returning * into v_row;
  return v_row;
end; $$;
-- grant כבר קיים מ-0004 (אותה חתימה בדיוק).

create or replace function admin_list_checklist_items()
returns table(id uuid, item_key text, category text, label_he text, label_en text, icon text, base_points int, sort_order int, is_active boolean)
language plpgsql security definer set search_path = public stable as $$
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  return query
    select ci.id, ci.item_key, ci.category, ci.label_he, ci.label_en, ci.icon, ci.base_points, ci.sort_order, ci.is_active
    from checklist_items ci
    where ci.family_id is null
    order by ci.category, ci.sort_order;
end; $$;
grant execute on function admin_list_checklist_items() to authenticated;

create or replace function admin_set_checklist_item_active(p_item_id uuid, p_is_active boolean)
returns checklist_items language plpgsql security definer set search_path = public as $$
declare v_row checklist_items;
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  update checklist_items set is_active = p_is_active, updated_at = now()
  where id = p_item_id
  returning * into v_row;
  if v_row.id is null then raise exception 'item not found'; end if;
  return v_row;
end; $$;
grant execute on function admin_set_checklist_item_active(uuid, boolean) to authenticated;
