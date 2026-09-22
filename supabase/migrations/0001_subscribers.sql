-- מערכת מנויים בתשלום ל"זה קרה באמת" - טבלת subscribers + RLS + claim_subscriber()
-- נוצר ע"י רוני המתכנת, 2026-09-22. ראו התוכנית המלאה ב-
-- "רוני המתכנת\Docs\פרוטוקול מערכת הרשמה ותשלום - זה קרה באמת.md".
--
-- מריצים פעם אחת, ב-Supabase Dashboard > SQL Editor (או `supabase db push`
-- אם עובדים עם ה-CLI מקומית). בטוח להרצה חוזרת (IF NOT EXISTS בכל מקום).

create extension if not exists "pgcrypto";

create table if not exists subscribers (
  id                       uuid primary key default gen_random_uuid(),
  email                    text not null unique,           -- תמיד lower(trim(email)) - זה מפתח הזיהוי
  auth_user_id             uuid references auth.users(id), -- null עד שיוך בהתחברות ראשונה (claim_subscriber)
  plan_status              text not null default 'active'
                             check (plan_status in ('active', 'past_due', 'canceled')),
  price_tier               text,                            -- 'promo_1nis' / 'standard_18nis' - מידע בלבד, לא נאכף כאן
  provider                 text,                            -- 'grow' וכו' - טקסט חופשי עד שנבחר ספק בפועל
  provider_customer_id     text,
  provider_subscription_id text,
  current_period_end       timestamptz,
  first_payment_at         timestamptz not null default now(),
  last_event_at            timestamptz not null default now(),
  last_webhook_payload     jsonb,                           -- המטען הגולמי האחרון, לדיבאג בלי לחזור לספק
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index if not exists subscribers_auth_user_id_idx on subscribers (auth_user_id);

alter table subscribers enable row level security;

-- משתמש קורא רק את השורה שלו. עם RLS מופעל ובלי הרשאת insert/update/delete
-- מהלקוח, אלה חסומים כברירת מחדל - רק מפתח ה-service-role (בתוך Edge
-- Functions בלבד, לעולם לא בדפדפן) כותב לטבלה הזו.
drop policy if exists "subscriber reads own row" on subscribers;
create policy "subscriber reads own row"
  on subscribers for select
  using (auth_user_id = auth.uid());

-- החריג היחיד והמכוון לכלל "אין כתיבה מהלקוח": משתמש שהתחבר יכול לשייך
-- לעצמו שורת מנוי שמתאימה בדיוק לאימייל המאומת שלו - שום דבר אחר.
-- SECURITY DEFINER עוקף RLS לפעולה קבועה אחת, בלי פרמטרים חופשיים -
-- זה לא נתיב כתיבה כללי.
create or replace function claim_subscriber()
returns void
language sql
security definer
set search_path = public
as $$
  update subscribers
  set auth_user_id = auth.uid(), updated_at = now()
  where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and auth_user_id is null;
$$;

grant execute on function claim_subscriber() to authenticated;

-- טריגר updated_at אוטומטי (נוח לדיבאג/לתצוגה בגיליון, לא קריטי ללוגיקה)
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscribers_set_updated_at on subscribers;
create trigger subscribers_set_updated_at
  before update on subscribers
  for each row
  execute function set_updated_at();
