-- 0035 (Avraham, 2026-11-26): "every status button, everywhere, always gives Bezalel's light trailer of the story, and on
-- Thursday and Friday the 'מה בפרשה' banner video". On 26.11 the week's parasha had no banner pair yet, and the buttons
-- gave its plain picture. Now Thursday and Friday give the parasha only when its banner video exists; otherwise the
-- story's trailer goes, so a status button never hands out a still picture while a video is there.
-- Revert: run 0028 again.
create or replace function public.guest_status()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select case
    when to_char(now() at time zone 'Asia/Jerusalem', 'Dy') in ('Thu', 'Fri')
         and value ? 'parasha' and now() < (value->'parasha'->>'until')::timestamptz
         and (jsonb_typeof(value->'parasha'->'videos') = 'object' or jsonb_typeof(value->'parasha'->'video') = 'string')
      then value->'parasha'
    else value->'story'
  end
  from public.wa_settings where key = 'site_status'
$$;
revoke all on function public.guest_status() from public;
grant execute on function public.guest_status() to anon, authenticated;
