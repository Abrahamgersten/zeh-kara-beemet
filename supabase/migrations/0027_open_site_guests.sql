-- האתר פתוח לכולם (אברהם, 2026-11-12): מי שנכנס בלי מנוי רואה את האתר, שומע טעימה מפרק, ומתבקש להעלות את הסיפור
-- לסטטוס לפני שהוא ממשיך (js/guest.js). זה על אמון, והספירה (פרק ביום, שניים בשבוע) נשמרת במכשיר ולא כאן.
-- כאן רק: מונה צעדים אנונימי (כמה נכנסו, טעמו, התבקשו, שיתפו, המשיכו) וטלפונים של מי שביקש עדכון על תוכנית המנויים.
-- RLS בלי policy, והגישה רק דרך הפונקציות. נוצר ע"י רוני המתכנת.

create table if not exists guest_events (
  id         bigint generated always as identity primary key,
  visitor    text,                 -- מספר אקראי של הדפדפן (zkb_story_visitor), לא פרט מזהה
  event      text not null,        -- enter, teaser, ask, share, unlock, offer
  slug       text,
  created_at timestamptz not null default now()
);
create index if not exists guest_events_created_idx on guest_events (created_at);
alter table guest_events enable row level security;

create or replace function guest_event(p_visitor text, p_event text, p_slug text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_event is null or p_event not in ('enter', 'teaser', 'ask', 'share', 'unlock', 'offer') then return; end if;
  if p_visitor is not null and p_visitor !~ '^[a-f0-9-]{16,40}$' then return; end if;
  if p_visitor is not null and (select count(*) from guest_events where visitor = p_visitor and created_at > now() - interval '1 day') >= 200 then return; end if;
  insert into guest_events (visitor, event, slug)
  values (p_visitor, p_event, case when p_slug ~ '^[a-z0-9-]{1,80}$' then p_slug else null end);
end;
$$;
grant execute on function guest_event(text, text, text) to anon, authenticated;

-- "עדכנו אותי כשתוכנית המנויים נפתחת", בלי קישור אישי. עד 5 ביום לדפדפן, ועד 500 ביום בסך הכול.
create or replace function guest_lead(p_phone text, p_slug text default null, p_visitor text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_phone text := regexp_replace(coalesce(p_phone, ''), '[^0-9+]', '', 'g');
  v_vis   text := case when p_visitor ~ '^[a-f0-9-]{16,40}$' then p_visitor else null end;
begin
  if v_phone !~ '^\+?[0-9]{9,15}$' then return jsonb_build_object('ok', false, 'reason', 'phone'); end if;
  if (select count(*) from subscription_leads where source = 'guest' and created_at > now() - interval '1 day') >= 500 then
    return jsonb_build_object('ok', true);
  end if;
  if v_vis is not null and (select count(*) from subscription_leads where wa_id = 'v:' || v_vis and created_at > now() - interval '1 day') >= 5 then
    return jsonb_build_object('ok', true);
  end if;
  if not exists (select 1 from subscription_leads where phone = v_phone) then
    insert into subscription_leads (phone, wa_id, slug, source)
    values (v_phone, case when v_vis is null then null else 'v:' || v_vis end, case when p_slug ~ '^[a-z0-9-]{1,80}$' then p_slug else null end, 'guest');
  end if;
  return jsonb_build_object('ok', true);
end;
$$;
grant execute on function guest_lead(text, text, text) to anon, authenticated;

-- דף המנהל: נוסף 'guest' (כמה דפדפנים בכל צעד, ב-7 ימים ובסך הכול) ומקור לכל טלפון.
create or replace function admin_gift_overview()
returns jsonb language plpgsql security definer set search_path = public stable as $$
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  return jsonb_build_object(
    'links', (select count(*) from gift_tokens),
    'plays', (select count(*) from gift_plays),
    'plays_7d', (select count(*) from gift_plays where created_at > now() - interval '7 days'),
    'people', (select count(distinct wa_id) from gift_plays),
    'top', coalesce((select jsonb_agg(t) from (
        select slug, count(*) as plays from gift_plays group by slug order by count(*) desc, slug limit 15) t), '[]'::jsonb),
    'leads', coalesce((select jsonb_agg(l) from (
        select phone, slug, source, created_at from subscription_leads order by created_at desc limit 500) l), '[]'::jsonb),
    'guest', coalesce((select jsonb_object_agg(event, jsonb_build_object('week', week, 'total', total)) from (
        select event,
               count(distinct coalesce(visitor, id::text)) filter (where created_at > now() - interval '7 days') as week,
               count(distinct coalesce(visitor, id::text)) as total
          from guest_events group by event) g), '{}'::jsonb),
    'guest_top', coalesce((select jsonb_agg(t) from (
        select slug, count(*) as plays from guest_events where event = 'unlock' and slug is not null
         group by slug order by count(*) desc, slug limit 15) t), '[]'::jsonb)
  );
end;
$$;
grant execute on function admin_gift_overview() to authenticated;
