-- סבב תיקונים/שינוי-ארכיטקטורה למערכת הנקודות ("זה קרה באמת"), לפי רשימת
-- בקשות של אברהם, 2026-09-24:
-- 1. יעד הפרס עולה מ-100 ל-400 נקודות ("המבצע יחזיק כחודש").
-- 2. אחרי שמשפחה מגיעה ליעד - "המחזור" מתאפס והיא מתחילה לצבור לקראת
--    הפרס הבא ברשימה (לא נשארת "פתוחה לתמיד" כמו במודל הישן). תומך
--    במספר פרסים עוקבים (סיפורים בהמשכים נוספים, שיוזנו בעתיד).
-- 3. תיקון ניצול אבטחה אמיתי: הסרת ילד לא הייתה מוחקת את נקודות אותו
--    היום שלו, מה שאיפשר הסרה+הוספה חוזרת לצבירת נקודות בלתי-מוגבלת.
-- נוצר ע"י רוני המתכנת, 2026-09-24.

-- --- 0. הגנה: auth_user_id חייב להיות ייחודי --------------------------
-- התגלה תוך כדי בדיקות הסבב הזה: אין (הייתה חייבת להיות) הגבלת ייחודיות
-- על subscribers.auth_user_id. אם משתמש כלשהו מקבל בטעות שתי שורות
-- subscribers (למשל admin_grant_subscriber שמופעל פעמיים, או race condition
-- בזמן webhook תשלום) - כל פונקציית security-definer שעושה
-- "select id into v_family_id from subscribers where auth_user_id = auth.uid()"
-- הופכת לבלתי-דטרמיניסטית (איזו שורה "תזכה" תלוי בסדר פיזי לא-מובטח) -
-- באג פוטנציאלי אמיתי לכל משתמש, לא רק לבדיקות. NULL עדיין מותר בריבוי
-- (סמנטיקת UNIQUE הרגילה ב-Postgres), רק ערכים לא-null חייבים להיות ייחודיים.
do $$ begin
  if not exists (
    select 1 from pg_constraint where conname = 'subscribers_auth_user_id_key'
  ) then
    alter table subscribers add constraint subscribers_auth_user_id_key unique (auth_user_id);
  end if;
end $$;

-- --- 1. rewards: תמיכה במספר פרסים באותו סף, בסדר מוגדר -------------------
alter table rewards drop constraint if exists rewards_threshold_points_key;
alter table rewards add column if not exists sort_order int not null default 0;

update rewards set threshold_points = 400, sort_order = 0
  where title_he = 'סיפור "אי היהלומים"';

-- --- 2. אילו פרסים כל משפחה כבר מימשה, ובאיזה family_total זה קרה --------
-- points_at_claim (לא threshold_points עצמו) הוא הבסיס לחישוב "נקודות
-- המחזור הנוכחי" - כך נקודות עודפות שנצברו מעבר לסף (למשל 430 כשהסף 400)
-- לא הולכות לאיבוד, אלא ממשיכות לתוך המחזור הבא.
create table if not exists family_reward_claims (
  id               uuid primary key default gen_random_uuid(),
  family_id        uuid not null references subscribers(id) on delete cascade,
  reward_id        uuid not null references rewards(id) on delete cascade,
  points_at_claim  int not null,
  claimed_at       timestamptz not null default now(),
  unique (family_id, reward_id)
);
create index if not exists family_reward_claims_family_id_idx on family_reward_claims (family_id);
alter table family_reward_claims enable row level security;
drop policy if exists "family reads own claims" on family_reward_claims;
create policy "family reads own claims"
  on family_reward_claims for select
  using (family_id in (select id from subscribers where auth_user_id = auth.uid()));

-- --- 3. תיקון ניצול: הסרת ילד מוחקת רק את נקודות היום שלו -----------------
-- (לא את כל ההיסטוריה - ימים קודמים כבר "ננעלו" ונשארים כמו שהם). בלי זה,
-- הסרה+הוספה חוזרת של אותו ילד (או ילד חדש) מאפשרת לסמן את אותן 3 הרובריקות
-- שוב ושוב באותו יום ולצבור נקודות בלי הגבלה.
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
  delete from checkins where child_id = p_child_id and checkin_date = family_today();
  return true;
end; $$;
grant execute on function remove_child(uuid) to authenticated;

-- --- 4. toggle_checkin: מחזירה גם newly_claimed_reward -------------------
-- שינוי צורת ההחזרה (עמודה נוספת) - Postgres לא מאפשר create or replace עם
-- return type שונה, צריך drop קודם.
drop function if exists toggle_checkin(uuid, text);

create function toggle_checkin(p_child_id uuid, p_item_key text)
returns table(checked boolean, points_delta int, family_total int, newly_claimed_reward jsonb)
language plpgsql security definer set search_path = public as $$
declare
  v_family_id uuid; v_item_id uuid; v_base_points int;
  v_today date := family_today();
  v_existing checkins; v_child_count int; v_points int;
  v_before_total int; v_cycle_start int; v_next_reward rewards;
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  if not exists (select 1 from children where id = p_child_id and family_id = v_family_id and is_active) then
    raise exception 'not authorized';
  end if;
  select id, base_points into v_item_id, v_base_points
    from checklist_items where item_key = p_item_key and is_active;
  if v_item_id is null then raise exception 'unknown item'; end if;

  select coalesce(sum(points_awarded), 0) into v_before_total from checkins where family_id = v_family_id;

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

  newly_claimed_reward := null;
  if family_total > v_before_total then
    select coalesce(max(points_at_claim), 0) into v_cycle_start
      from family_reward_claims where family_id = v_family_id;
    select * into v_next_reward from rewards
      where is_active and id not in (
        select reward_id from family_reward_claims where family_id = v_family_id
      )
      order by sort_order, created_at limit 1;
    if v_next_reward.id is not null and (family_total - v_cycle_start) >= v_next_reward.threshold_points then
      insert into family_reward_claims (family_id, reward_id, points_at_claim)
      values (v_family_id, v_next_reward.id, family_total)
      on conflict (family_id, reward_id) do nothing;
      newly_claimed_reward := jsonb_build_object(
        'id', v_next_reward.id,
        'title_he', v_next_reward.title_he, 'title_en', v_next_reward.title_en,
        'link_url_he', v_next_reward.link_url_he, 'link_url_en', v_next_reward.link_url_en,
        'image_url', v_next_reward.image_url
      );
    end if;
  end if;

  return next;
end; $$;
grant execute on function toggle_checkin(uuid, text) to authenticated;

-- --- 5. get_my_points_state: next_reward יחיד + cycle_points, לא מערך ----
create or replace function get_my_points_state()
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare
  v_family_id uuid; v_today date := family_today();
  v_child_count int; v_family_total int; v_cycle_start int;
  v_next_reward jsonb; v_result jsonb;
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  select count(*) into v_child_count from children where family_id = v_family_id and is_active;
  select coalesce(sum(points_awarded), 0) into v_family_total from checkins where family_id = v_family_id;

  select coalesce(max(points_at_claim), 0) into v_cycle_start
    from family_reward_claims where family_id = v_family_id;

  select jsonb_build_object(
    'id', r.id, 'threshold_points', r.threshold_points,
    'title_he', r.title_he, 'title_en', r.title_en,
    'description_he', r.description_he, 'description_en', r.description_en,
    'link_url_he', r.link_url_he, 'link_url_en', r.link_url_en, 'image_url', r.image_url
  ) into v_next_reward
  from rewards r
  where r.is_active and r.id not in (
    select reward_id from family_reward_claims where family_id = v_family_id
  )
  order by r.sort_order, r.created_at limit 1;

  select jsonb_build_object(
    'family_total', v_family_total,
    'cycle_points', v_family_total - v_cycle_start,
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
    'next_reward', v_next_reward
  ) into v_result;
  return v_result;
end; $$;
grant execute on function get_my_points_state() to authenticated;
