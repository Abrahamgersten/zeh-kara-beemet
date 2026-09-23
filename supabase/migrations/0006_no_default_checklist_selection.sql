-- ביטול ברירת-המחדל האוטומטית שנוספה ב-0005: אברהם ביקש במפורש שההורה יבחר
-- בעצמו את הרובריקות מיד אחרי הזנת שם הילד הראשון - בלי שום ברירת מחדל
-- "בשקט" ברקע. add_child() חוזרת לגרסה הפשוטה (רק מוסיפה ילד, לא נוגעת
-- ב-family_checklist_selection בכלל) - הלקוח (js/points.js) אחראי לפתוח
-- את בורר הרובריקות אוטומטית ברגע שרואה שלמשפחה עדיין אין אף פריט daily
-- נבחר. נוצר ע"י רוני המתכנת, 2026-09-24.

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
-- grant כבר קיים מ-0004, לא צריך שוב.
