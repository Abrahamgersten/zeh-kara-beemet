-- לוח-בקרה למנהל: תובנות שימוש ומעורבות ("איזה חלק מהמשתמשים פעילים, כמה
-- הם משתמשים במערכת הנקודות, אילו רובריקות הכי פופולריות"). שלב א' של בקשת
-- אברהם ("נתונים... כדי ללמוד הרגלי שימוש") - בנוי כולו על נתונים שכבר
-- נאספים היום (הרשמות/ילדים/סימוני-רובריקה/פרסים), בלי מעקב-צפיות חדש
-- (זה שלב ב' נפרד, עדיין בתכנון - האתר סטטי-תוכן, אין עדיין תשתית לכך).
-- נוצר ע"י רוני המתכנת, 2026-09-24.

-- --- תקציר-על למנהל: מספרים מצטברים + התפלגויות, לא נתון-לפי-משפחה ------
create or replace function admin_engagement_overview()
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare
  v_today date := family_today();
  v_result jsonb;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  select jsonb_build_object(
    'total_subscribers', (select count(*) from subscribers),
    'active_subscribers', (select count(*) from subscribers where plan_status = 'active'),
    'signups_7d', (select count(*) from subscribers where created_at >= now() - interval '7 days'),
    'signups_30d', (select count(*) from subscribers where created_at >= now() - interval '30 days'),

    'families_with_children', (select count(distinct family_id) from children where is_active),
    'families_ever_checked_in', (select count(distinct family_id) from checkins),
    'families_active_7d', (select count(distinct family_id) from checkins where checkin_date >= v_today - 6),
    'families_active_30d', (select count(distinct family_id) from checkins where checkin_date >= v_today - 29),

    'total_checkins', (select count(*) from checkins),
    'checkins_7d', (select count(*) from checkins where checkin_date >= v_today - 6),
    'avg_children_per_active_family', (
      select round(coalesce(avg(cnt), 0)::numeric, 1)
      from (select count(*) cnt from children where is_active group by family_id) x
    ),
    'custom_items_created', (select count(*) from checklist_items where family_id is not null),
    'rewards_claimed_total', (select count(*) from family_reward_claims),

    -- פופולריות רובריקות (daily בלבד, תבניות גלובליות - לא מותאמות-אישית
    -- שממילא ייחודיות למשפחה בודדת ולא ניתנות להשוואה ביניהן): כמה משפחות
    -- בחרו כל פריט מול כמה פעמים בפועל סומן - כוונה מול שימוש בפועל.
    'item_popularity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'item_key', ci.item_key, 'label_he', ci.label_he, 'icon', ci.icon,
        'families_selected', (select count(*) from family_checklist_selection fcs where fcs.item_id = ci.id),
        'checkins_count', (select count(*) from checkins c where c.item_id = ci.id)
      ) order by (select count(*) from family_checklist_selection fcs where fcs.item_id = ci.id) desc)
      from checklist_items ci
      where ci.category = 'daily' and ci.family_id is null
    ), '[]'::jsonb),

    -- התפלגות סימונים לפי יום בשבוע (0=ראשון..6=שבת, כבר לפי checkin_date
    -- שמוקפא בשעון ישראל דרך family_today() - לא צריך המרת אזור-זמן נוספת).
    'weekday_distribution', coalesce((
      select jsonb_agg(cnt order by dow)
      from (
        select d.dow, count(c.*) cnt
        from generate_series(0, 6) as d(dow)
        left join checkins c on extract(dow from c.checkin_date) = d.dow
        group by d.dow
      ) w
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;
grant execute on function admin_engagement_overview() to authenticated;

-- --- שורה לכל משפחה: לצביעה/מיון בטבלת המנויים לפי רמת-מעורבות בפועל -----
create or replace function admin_list_family_engagement()
returns table(
  family_id uuid,
  email text,
  plan_status text,
  created_at timestamptz,
  active_children_count int,
  lifetime_points int,
  checkins_7d int,
  checkins_30d int,
  last_checkin_date date,
  custom_items_count int,
  rewards_claimed_count int,
  engagement_status text
)
language plpgsql security definer set search_path = public stable as $$
declare
  v_today date := family_today();
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select
    s.id,
    s.email,
    s.plan_status,
    s.created_at,
    coalesce((select count(*)::int from children ch where ch.family_id = s.id and ch.is_active), 0),
    coalesce((select sum(c.points_awarded)::int from checkins c where c.family_id = s.id), 0),
    coalesce((select count(*)::int from checkins c where c.family_id = s.id and c.checkin_date >= v_today - 6), 0),
    coalesce((select count(*)::int from checkins c where c.family_id = s.id and c.checkin_date >= v_today - 29), 0),
    (select max(c.checkin_date) from checkins c where c.family_id = s.id),
    coalesce((select count(*)::int from checklist_items ci where ci.family_id = s.id), 0),
    coalesce((select count(*)::int from family_reward_claims frc where frc.family_id = s.id), 0),
    case
      when not exists (select 1 from children ch where ch.family_id = s.id and ch.is_active) then 'no_children'
      when not exists (select 1 from checkins c where c.family_id = s.id) then 'never_checked_in'
      when (select max(c.checkin_date) from checkins c where c.family_id = s.id) >= v_today - 2 then 'active'
      when (select max(c.checkin_date) from checkins c where c.family_id = s.id) >= v_today - 13 then 'at_risk'
      else 'dormant'
    end
  from subscribers s
  order by s.created_at desc
  limit 300;
end;
$$;
grant execute on function admin_list_family_engagement() to authenticated;
