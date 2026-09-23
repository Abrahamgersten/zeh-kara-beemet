-- ממשק ניהול (admin.html): פונקציות שמאפשרות לאברהם בלבד להעניק/לבטל גישה
-- ולראות את רשימת המנויים, ישירות מהאתר - בלי Supabase Dashboard.
-- "אדמין" מזוהה לפי אימייל מחובר == abrahamgersten@gmail.com (מוטבע בקוד,
-- לא ניתן לעקיפה מהלקוח - נבדק בתוך כל פונקציה, SECURITY DEFINER).
-- נוצר ע"י רוני המתכנת, 2026-09-23.

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'abrahamgersten@gmail.com';
$$;

grant execute on function is_admin() to authenticated;

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
    set plan_status = 'active', provider = target_provider, updated_at = now();
end;
$$;

grant execute on function admin_grant_subscriber(text, text) to authenticated;

create or replace function admin_revoke_subscriber(target_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  update subscribers set plan_status = 'canceled', updated_at = now()
  where lower(email) = lower(trim(target_email));
end;
$$;

grant execute on function admin_revoke_subscriber(text) to authenticated;

create or replace function admin_list_subscribers()
returns setof subscribers
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  return query select * from subscribers order by created_at desc limit 300;
end;
$$;

grant execute on function admin_list_subscribers() to authenticated;
