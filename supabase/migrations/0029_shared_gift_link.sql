-- קישור מתנה משותף (אברהם, 2026-11-12 בלילה): "אנשים לא מגיעים למתנה דרך הבוט, אני אשלח את הקישור לאתר המתנה
-- בקבוצה, ואנשים יידרשו להעלות סטטוס כדי להשלים את ההאזנה לפרק".
-- קוד שמסומן shared הוא קישור אחד לכל מי שמקבל אותו. אין בו תנאי של סטטוס שאושר בבוט: האתר עצמו מבקש את הסטטוס
-- אחרי הטעימה, והספירה (פרק ביום, שניים בשבוע) נשמרת בכל מכשיר (js/guest.js). כדי לבטל קישור: למחוק את השורה שלו.
-- הקישורים האישיים (מיגרציה 0026) לא השתנו. נוצר ע"י רוני המתכנת.

alter table gift_tokens add column if not exists shared boolean not null default false;

create or replace function gift_state(p_token text)
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare
  v_wa     text;
  v_shared boolean;
  v_day    date := (now() at time zone 'Asia/Jerusalem')::date;
  v_today  text;
  v_week   int;
  v_free   int;
begin
  if p_token is null or p_token !~ '^[a-f0-9]{20}$' then return jsonb_build_object('valid', false); end if;
  select wa_id, shared into v_wa, v_shared from gift_tokens where token = p_token;
  if v_wa is null then return jsonb_build_object('valid', false); end if;
  if v_shared then return jsonb_build_object('valid', true, 'shared', true); end if;

  select slug into v_today from gift_plays where wa_id = v_wa and day = v_day;
  select count(*) into v_week from gift_plays where wa_id = v_wa and day > v_day - 7;
  select count(*) into v_free from wa_shares s
   where s.wa_id = v_wa and s.posted_at > now() - interval '7 days'
     and not exists (select 1 from gift_plays p where p.share_id = s.id);

  return jsonb_build_object(
    'valid', true,
    'today', v_today,
    'can_pick', v_today is null and v_week < 2 and v_free > 0,
    'reason', case when v_today is not null then 'day' when v_week >= 2 then 'week' when v_free = 0 then 'no_share' else null end
  );
end;
$$;
grant execute on function gift_state(text) to anon, authenticated;
