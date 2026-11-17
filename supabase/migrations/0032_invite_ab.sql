-- שתי בדיקות A/B על ההזמנות המוקלטות (אברהם, 2026-11-17). A = ההזמנה לפני ההקלטה, B = אחריה.
--   story: בדף הסיפור הבודד (s/<slug>/, מה שנשלח בקבוצות): הזמנה לקבל סיפור נוסף במתנה. ההמרה: כניסה לקישור המתנה.
--   gift : בקישור המתנה (?g=): הזמנה להשאיר פרטים לקראת המנוי. ההמרה: השארת טלפון.
-- כאן רק מונה צעדים אנונימי לכל וריאציה, לפי המספר האקראי של הדפדפן (zkb_story_visitor), ודוח לדף המנהל.
-- RLS בלי policy, והגישה רק דרך הפונקציות. נוצר ע"י רוני המתכנת.

create table if not exists ab_events (
  id         bigint generated always as identity primary key,
  test       text not null,        -- story | gift
  variant    text not null,        -- a | b
  event      text not null,        -- start, invite, finish, popup, click, enter, lead
  slug       text,
  visitor    text,
  created_at timestamptz not null default now()
);
create index if not exists ab_events_test_idx on ab_events (test, created_at);
create index if not exists ab_events_visitor_idx on ab_events (visitor, created_at);
alter table ab_events enable row level security;

create or replace function ab_event(p_test text, p_variant text, p_event text, p_slug text default null, p_visitor text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_vis  text := case when p_visitor ~ '^[a-f0-9-]{16,40}$' then p_visitor else null end;
  v_slug text := case when p_slug ~ '^[a-z0-9-]{1,80}$' then p_slug else null end;
begin
  if p_test is null or p_test not in ('story', 'gift') then return; end if;
  if p_variant is null or p_variant not in ('a', 'b') then return; end if;
  if p_event is null or p_event not in ('start', 'invite', 'finish', 'popup', 'click', 'enter', 'lead') then return; end if;
  -- אותו צעד של אותו דפדפן באותה הקלטה נספר פעם אחת בחצי שעה (רענון, לחיצה כפולה)
  if v_vis is not null and exists (
    select 1 from ab_events
     where visitor = v_vis and test = p_test and event = p_event and slug is not distinct from v_slug
       and created_at > now() - interval '30 minutes') then return; end if;
  if v_vis is not null and (select count(*) from ab_events where visitor = v_vis and created_at > now() - interval '1 day') >= 200 then return; end if;
  if (select count(*) from ab_events where created_at > now() - interval '1 minute') >= 1000 then return; end if;
  insert into ab_events (test, variant, event, slug, visitor) values (p_test, p_variant, p_event, v_slug, v_vis);
exception when others then
  return;
end;
$$;
grant execute on function ab_event(text, text, text, text, text) to anon, authenticated;

-- דף המנהל: כמה דפדפנים עברו כל צעד, בכל בדיקה ובכל וריאציה. דפדפן שראה את שתי הווריאציות (אחסון שנמחק) נספר בכל אחת.
create or replace function admin_ab_overview()
returns jsonb language plpgsql security definer set search_path = public stable as $$
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  return jsonb_build_object(
    'since', (select min(created_at) from ab_events),
    'rows', coalesce((select jsonb_agg(r) from (
        select test, variant, event, count(distinct coalesce(visitor, id::text)) as people
          from ab_events group by test, variant, event order by test, variant, event) r), '[]'::jsonb)
  );
end;
$$;
grant execute on function admin_ab_overview() to authenticated;
