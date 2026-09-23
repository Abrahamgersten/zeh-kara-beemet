-- דגל "הרשמה פתוחה" - כל עוד open_signup=true, claim_subscriber() מקצה מנוי
-- פעיל אוטומטית לכל מי שמתחבר בלי שורת subscribers קיימת (שלב בדיקה/רכה
-- לפני שיש ספק סליקה מחובר). ברגע ש-open_signup=false (מצב "עסקי" רגיל) -
-- חוזרים למצב שרק שורה קיימת (מתשלום אמיתי או הענקה ידנית) מקבלת גישה.
-- נוצר ע"י רוני המתכנת, 2026-09-23.

create table if not exists app_settings (
  id boolean primary key default true,
  open_signup boolean not null default false,
  constraint app_settings_singleton check (id = true)
);

insert into app_settings (id, open_signup) values (true, false)
  on conflict (id) do nothing;

alter table app_settings enable row level security;
-- אין אף policy ל-select/insert/update מהלקוח - הטבלה נקראת רק מתוך
-- claim_subscriber() (SECURITY DEFINER, עוקף RLS), לא ישירות מהדפדפן.

create or replace function claim_subscriber()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_open boolean;
begin
  if v_email = '' then
    return;
  end if;

  -- הנתיב הרגיל: שיוך שורה קיימת (מתשלום אמיתי או הענקה ידנית ב-Table Editor).
  update subscribers
  set auth_user_id = auth.uid(), updated_at = now()
  where lower(email) = v_email
    and auth_user_id is null;

  if not found and not exists (select 1 from subscribers where auth_user_id = auth.uid()) then
    select open_signup into v_open from app_settings where id = true;
    if coalesce(v_open, false) then
      insert into subscribers (email, auth_user_id, plan_status, provider)
      values (v_email, auth.uid(), 'active', 'open_signup_mode')
      on conflict (email) do update set auth_user_id = auth.uid(), plan_status = 'active', updated_at = now();
    end if;
  end if;
end;
$$;

grant execute on function claim_subscriber() to authenticated;
