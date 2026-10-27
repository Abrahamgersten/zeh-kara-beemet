-- מי לחץ על קישור הקבוצה (אברהם, 2026-10-27): בוט "האזנה לסיפור" שולח לכל אדם קישור קבוצה עם הקוד האישי שלו
-- (whatsapp/?c=bot-story&u=<5 ספרות>). חצי שעה אחרי ההתחלה הבוט בודק אם האדם לחץ, ורק אם לא, שולח לו הזמנה.
-- join_clicks.ref = הקוד; join_click מקבלת p_ref (רשות; בלעדיו הכול כמו קודם). service_role קורא את join_clicks
-- (פונקציית הקצה wa-diamond). נוצר ע"י רוני המתכנת.

alter table public.join_clicks add column if not exists ref text;
create index if not exists join_clicks_ref on public.join_clicks (ref) where ref is not null;
grant select on public.join_clicks to service_role;

drop function if exists public.join_click(text, text, boolean);

create function public.join_click(p_code text default null, p_visitor text default null, p_test boolean default false, p_ref text default null)
 returns text
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_code    text := nullif(lower(trim(coalesce(p_code, ''))), '');
  v_visitor text := p_visitor;
  v_ref     text := case when p_ref ~ '^\d{5}$' then p_ref end;
  v_url     text;
begin
  select url into v_url from join_target where id = 1;
  if coalesce(p_test, false) then return v_url; end if; -- a test link (&t=1): to the group, not counted

  begin
    if v_code is not null and v_code !~ '^[a-z0-9-]{2,40}$' then v_code := null; end if;
    if v_visitor is not null and v_visitor !~ '^[a-f0-9-]{16,40}$' then v_visitor := null; end if;

    if v_visitor is not null and exists (
      select 1 from join_clicks
      where visitor = v_visitor and campaign_code is not distinct from v_code
        and occurred_at > now() - interval '30 minutes'
    ) then
      return v_url;
    end if;
    if (select count(*) from join_clicks where occurred_at > now() - interval '1 minute') >= 1000 then
      return v_url;
    end if;

    insert into join_clicks (campaign_code, visitor, ref) values (v_code, v_visitor, v_ref);
  exception when others then
    null;
  end;

  return v_url;
end;
$function$;

grant execute on function public.join_click(text, text, boolean, text) to public, anon, authenticated;
