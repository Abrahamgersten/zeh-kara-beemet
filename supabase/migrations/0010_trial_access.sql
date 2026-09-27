-- שני סוגי "הענקת גישה" ע"י אברהם ב-admin.html (בקשתו, 2026-09-28):
--   1. לצמיתות - כמו שהיה עד היום (admin_grant_subscriber, ללא שינוי בהתנהגות).
--   2. נסיון לחודש - גישה חינמית שפגה אוטומטית אחרי חודש; לאחר מכן ההתחברות
--      הבאה מפנה אותם לדף ההצטרפות הרגיל (offer.html, 1 ₪ חודש ראשון ואז 18 ₪
--      לחודש) - בדיוק כמו כל מי שאינו זכאי, בלי צורך בג'וב מתוזמן: הזכאות
--      נבדקת מול current_period_end בכל טעינת דף (guardGatedPage), לא משהו
--      שצריך "להפעיל" ברקע.
-- נוצר ע"י רוני המתכנת, 2026-09-28.

-- מעניק/מחדש נסיון של חודש (provider='manual_trial', current_period_end =
-- עכשיו + חודש). אם המשפחה כבר קיימת (למשל הוענקה לה בעבר גישה לצמיתות) -
-- ההענקה הזאת דורסת אותה במפורש לנסיון-חודש; אם רוצים להחזיר לצמיתות
-- משתמשים אחר כך ב-admin_grant_subscriber הרגיל.
create or replace function admin_grant_trial_subscriber(target_email text, months int default 1)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  if months < 1 or months > 12 then
    raise exception 'months out of range';
  end if;
  insert into subscribers (email, plan_status, provider, current_period_end)
  values (lower(trim(target_email)), 'active', 'manual_trial', now() + (months || ' months')::interval)
  on conflict (email) do update
    set plan_status = 'active',
        provider = 'manual_trial',
        current_period_end = now() + (months || ' months')::interval,
        updated_at = now();
end;
$$;

grant execute on function admin_grant_trial_subscriber(text, int) to authenticated;

-- admin_grant_subscriber (הענקה לצמיתות, מ-0003): מנקה current_period_end
-- במפורש בעדכון-דריסה, כדי שמי שהיה עד עכשיו בנסיון-חודש ועובר לצמיתות לא
-- יישאר עם תאריך-פקיעה ישן ותקוע ברקע.
create or replace function admin_grant_subscriber(target_email text, target_provider text default 'manual_admin')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  insert into subscribers (email, plan_status, provider)
  values (lower(trim(target_email)), 'active', target_provider)
  on conflict (email) do update
    set plan_status = 'active', provider = target_provider, current_period_end = null, updated_at = now();
end;
$$;

grant execute on function admin_grant_subscriber(text, text) to authenticated;

-- admin_list_family_engagement (מ-0008): מוסיף provider + current_period_end
-- + access_type מחושב (permanent/trial_active/trial_expired/paid/canceled) -
-- כדי שהטבלה ב-admin.html תראה בבירור מי הוענק לצמיתות, מי בנסיון ומתי הוא
-- פג (גם אם plan_status עצמו עדיין 'active' בפועל - הפקיעה היא רק בבדיקת
-- הזכאות בזמן טעינת הדף, לא שינוי בפועל בטבלה).
drop function if exists admin_list_family_engagement();

create or replace function admin_list_family_engagement()
returns table(
  family_id uuid,
  email text,
  plan_status text,
  provider text,
  current_period_end timestamptz,
  access_type text,
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
    s.provider,
    s.current_period_end,
    case
      when s.plan_status = 'canceled' then 'canceled'
      when s.provider = 'manual_trial' and s.current_period_end is not null and s.current_period_end <= now() then 'trial_expired'
      when s.provider = 'manual_trial' then 'trial_active'
      when s.provider = 'manual_admin' then 'permanent'
      else 'paid'
    end,
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
