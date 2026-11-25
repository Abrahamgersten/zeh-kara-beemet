-- המפה המופלאה, היעד המשותף של הקבוצות: מעקב אחרי כל לחיצה במהלך (אברהם, 26.11.2026:
-- "תבצע מעקב אחרי לחיצות על כל הדברים במהלך הזה כדי ללמוד מזה").
-- טבלה נפרדת, כדי שהלחיצות האלה לא ייכנסו למונים של דפי הסיפורים (story_link_events) בדף הניהול.
--   action   מה קרה: page-open, play-all, to-share, to-status, join, save-link (דף ההאזנה),
--            share-view, share-tap, share-done, share-cancel, share-retry, share-fail (דף ההזמנה),
--            status-view, status-tap, status-done, status-cancel, status-retry, status-fail (דף הסטטוס)
--   source   מאיפה הגיעו לדף: page (מדף ההאזנה), direct (קישור ישיר), או קוד קמפיין מה-?c=
--   visitor  המזהה האקראי של הדפדפן (zkb_story_visitor), בלי שום פרט מזהה
-- אותו אדם ואותה פעולה נספרים פעם אחת ב-10 דקות. קריאה: רק דרך מפתח הניהול (Tools/map_campaign/report.py).

create table if not exists map_campaign_events (
  id          bigint generated always as identity primary key,
  action      text not null,
  source      text,
  visitor     text,
  occurred_at timestamptz not null default now()
);
create index if not exists map_campaign_events_time_idx on map_campaign_events (occurred_at);
create index if not exists map_campaign_events_visitor_idx on map_campaign_events (visitor, action, occurred_at);
alter table map_campaign_events enable row level security;

create or replace function log_map_event(p_action text, p_visitor text default null, p_source text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_visitor text := p_visitor;
  v_source  text := nullif(lower(trim(coalesce(p_source, ''))), '');
begin
  if p_action is null or p_action !~ '^[a-z0-9-]{2,40}$' then return; end if;
  if v_visitor is not null and v_visitor !~ '^[a-f0-9-]{16,40}$' then v_visitor := null; end if;
  if v_source is not null and v_source !~ '^[a-z0-9-]{2,40}$' then v_source := null; end if;
  if v_visitor is not null and exists (
    select 1 from map_campaign_events
    where visitor = v_visitor and action = p_action and occurred_at > now() - interval '10 minutes'
  ) then
    return;
  end if;
  if (select count(*) from map_campaign_events where occurred_at > now() - interval '1 minute') >= 1000 then
    return;
  end if;
  insert into map_campaign_events (action, source, visitor) values (p_action, v_source, v_visitor);
exception when others then
  return;
end;
$$;
revoke all on function log_map_event(text, text, text) from public;
grant execute on function log_map_event(text, text, text) to anon, authenticated;
