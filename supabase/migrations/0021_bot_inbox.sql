-- תיבת השיחות של המספר העסקי (inbox.html, אברהם 2026-10-27): כל מי שכתב לבוטים, מה הבוט שלח לו, ומה אברהם ענה.
-- קריאה בלבד, למנהל בלבד. השליחה עצמה עוברת בפונקציית הקצה wa-inbox (צריכה את הטוקן של וואטסאפ).
-- הטבלאות: wa_events (נכנסות), wa_outbound (יוצאות, מ-27.10), wa_forward (מה שהבוט לא טיפל בו), wa_funnel (שלבי
-- הבוט, מוצגים כשורות מערכת לשיחות שלפני רישום היוצאות), wa_inbox_state (נקרא/טופל). מיגרציית הבוט: wa_0006.
-- "דורש תשובה" = הודעה שהבוט לא טיפל בה, אחרי התשובה האחרונה של אברהם ואחרי שסימן "טופל". לחיצה על כפתור ישן
-- (הבוט כבר סיים עם האדם ומעביר אותה הלאה) לא נחשבת. ברשימת "דורשים תשובה" רק מי שעוד אפשר לענות לו בחינם (24 שעות).
-- נוצר ע"י רוני המתכנת.

create or replace function public.admin_inbox_rows(p_wa_id text default null, p_days integer default 30)
returns table (
  wa_id text, name text, last_in_at timestamptz, last_in_kind text, last_in_body text, last_out_at timestamptz,
  last_reply_at timestamptz, unhandled_at timestamptz, seen_at timestamptz, handled_at timestamptz,
  needs_reply boolean, unread boolean, window_open boolean, is_test boolean, flows text[]
)
language sql stable security definer set search_path to 'public'
as $$
  with people as (
    select e.wa_id, max(e.created_at) as last_in_at
    from wa_events e
    where e.kind <> 'failed' and e.wa_id is not null
      and (p_wa_id is null or e.wa_id = p_wa_id)
      and (p_wa_id is not null or p_days is null or e.created_at > now() - make_interval(days => p_days))
    group by e.wa_id
  )
  select p.wa_id,
    coalesce(
      (select e.name from wa_events e where e.wa_id = p.wa_id and e.name is not null order by e.created_at desc limit 1),
      (select f.name from wa_forward f where f.wa_id = p.wa_id and f.name is not null order by f.created_at desc limit 1),
      (select c.name from wa_contacts c where (c.wa_id = p.wa_id or c.wa_id like '%:' || p.wa_id) and c.name is not null order by c.updated_at desc nulls last limit 1)
    ),
    p.last_in_at, li.kind, li.body,
    (select max(o.created_at) from wa_outbound o where o.wa_id = p.wa_id),
    lr.at,
    un.at,
    s.seen_at, s.handled_at,
    coalesce(un.at > greatest(coalesce(s.handled_at, '-infinity'), coalesce(lr.at, '-infinity')), false),
    p.last_in_at > coalesce(s.seen_at, '-infinity'),
    p.last_in_at > now() - interval '24 hours',
    exists (select 1 from wa_funnel t where t.wa_id = p.wa_id and t.is_owner),
    array(select distinct t.flow from wa_funnel t where t.wa_id = p.wa_id order by 1)
  from people p
  left join lateral (select e.kind, left(e.body, 200) as body from wa_events e
                     where e.wa_id = p.wa_id and e.kind <> 'failed' order by e.created_at desc limit 1) li on true
  left join lateral (select max(o.created_at) as at from wa_outbound o where o.wa_id = p.wa_id and o.sent_by = 'avraham') lr on true
  left join lateral (select max(f.created_at) as at from wa_forward f
                     where f.wa_id = p.wa_id and f.stage is distinct from 'send_failed'
                       and not exists (select 1 from wa_events b where b.wa_id = f.wa_id and b.kind = 'interactive' and b.body = f.text
                                       and b.created_at between f.created_at - interval '5 minutes' and f.created_at + interval '5 minutes')) un on true
  left join wa_inbox_state s on s.wa_id = p.wa_id;
$$;
revoke all on function public.admin_inbox_rows(text, integer) from public, anon, authenticated;

-- רשימת השיחות. p_filter: 'open' = רק מי שדורש תשובה ועוד אפשר לענות לו, 'all' = כולם (ב-p_days האחרונים).
create or replace function public.admin_inbox_list(p_filter text default 'open', p_days integer default 30)
returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  return jsonb_build_object(
    'now', now(),
    'open_count', (select count(*) from admin_inbox_rows(null, p_days) r where r.needs_reply and r.window_open and not r.is_test),
    'rows', coalesce((
      select jsonb_agg(to_jsonb(r) order by r.last_in_at desc)
      from (select * from admin_inbox_rows(null, p_days) r
            where p_filter = 'all' or (r.needs_reply and r.window_open and not r.is_test)
            order by r.last_in_at desc limit 400) r
    ), '[]'::jsonb)
  );
end;
$$;

-- שיחה אחת: הודעות נכנסות ויוצאות לפי הזמן. לשיחות מלפני רישום היוצאות (27.10) מוצגים שלבי הבוט כשורות מערכת.
create or replace function public.admin_inbox_thread(p_wa_id text)
returns jsonb
language plpgsql stable security definer set search_path to 'public'
as $$
declare
  v_log_since timestamptz := coalesce((select min(created_at) from wa_outbound where sent_by = 'bot'), 'infinity');
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  return jsonb_build_object(
    'now', now(),
    'info', (select to_jsonb(r) from admin_inbox_rows(p_wa_id, null) r limit 1),
    'items', coalesce((
      select jsonb_agg(x.item order by x.at)
      from (
        select * from (
          select e.created_at as at, jsonb_build_object('t', 'in', 'at', e.created_at, 'kind', e.kind, 'body', e.body, 'media_id', e.media_id) as item
          from wa_events e where e.wa_id = p_wa_id and e.kind <> 'failed'
          union all
          select o.created_at, jsonb_build_object('t', 'out', 'at', o.created_at, 'by', o.sent_by, 'kind', o.kind, 'body', o.body,
                                                  'media_link', o.media_link, 'status', o.status, 'error', o.error)
          from wa_outbound o where o.wa_id = p_wa_id
          union all
          select f.created_at, jsonb_build_object('t', 'bot', 'at', f.created_at, 'flow', f.flow, 'step', f.step)
          from wa_funnel f where f.wa_id = p_wa_id and f.created_at < v_log_since
          union all
          select f.created_at, jsonb_build_object('t', 'fail', 'at', f.created_at, 'body', f.text)
          from wa_forward f where f.wa_id = p_wa_id and f.stage = 'send_failed' and f.created_at < v_log_since
        ) all_items order by at desc limit 300
      ) x
    ), '[]'::jsonb)
  );
end;
$$;

-- p_action: 'seen' (פתח את השיחה), 'handled' (טופל, בלי לענות), 'reopen' (להחזיר ל"דורש תשובה").
create or replace function public.admin_inbox_mark(p_wa_id text, p_action text)
returns boolean
language plpgsql security definer set search_path to 'public'
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  if p_action = 'seen' then
    insert into wa_inbox_state (wa_id, seen_at) values (p_wa_id, now())
    on conflict (wa_id) do update set seen_at = now();
  elsif p_action = 'handled' then
    insert into wa_inbox_state (wa_id, seen_at, handled_at) values (p_wa_id, now(), now())
    on conflict (wa_id) do update set seen_at = now(), handled_at = now();
  elsif p_action = 'reopen' then
    update wa_inbox_state set handled_at = null where wa_id = p_wa_id;
  else
    return false;
  end if;
  return true;
end;
$$;

revoke all on function public.admin_inbox_list(text, integer) from public, anon;
revoke all on function public.admin_inbox_thread(text) from public, anon;
revoke all on function public.admin_inbox_mark(text, text) from public, anon;
grant execute on function public.admin_inbox_list(text, integer) to authenticated;
grant execute on function public.admin_inbox_thread(text) to authenticated;
grant execute on function public.admin_inbox_mark(text, text) to authenticated;
