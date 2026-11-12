-- 0028: the status a guest of the open site is asked to post (Avraham, 2026-11-12): the same rule as the "סטטוס" bot.
-- Thursday and Friday (Israel time), while this week's "מה בפרשה" is fresh: its banner video with the caption of its
-- bot. The other days: Bezalel's trailer of the week's story, or the story's banner video, with the caption of the
-- listening bot. The material itself is written every hour by Tools/wa_cloud_bot/sync_recording.py into
-- wa_settings.site_status; this function only picks by the day. Revert: drop function public.guest_status();
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
      then value->'parasha'
    else value->'story'
  end
  from public.wa_settings where key = 'site_status'
$$;
revoke all on function public.guest_status() from public;
grant execute on function public.guest_status() to anon, authenticated;
