-- קמפיין גם לקישור ההאזנה (אברהם, 2026-10-25: "קישור מיוחד של קמפיין לסיפורים שעולים לסטטוסים").
-- דף סיפור שנפתח עם ?c=<קוד> רושם את הקוד עם האירועים שלו (פתיחה, נגן, עד הסוף), כך שב-campaigns.html
-- ובדף המספרים הציבורי רואים לכל קמפיין גם כמה נכנסו להאזין, ולא רק כמה הגיעו לקבוצה.
-- הקודים שבשימוש: bot-recording (הסטטוס שבוט ההקלטה במספר 6168 שולח), site-status (כפתור "בסטטוס" באתר).
-- נוצר ע"י רוני המתכנת.

alter table story_link_events add column if not exists campaign_code text;
create index if not exists story_link_events_campaign_idx on story_link_events (campaign_code, event_type) where campaign_code is not null;

-- אותה פונקציה עם פרמטר אחד נוסף. הישנה (4 פרמטרים) נמחקת, כדי שקריאה בלי קוד לא תהיה דו-משמעית;
-- דף ישן ששולח 4 פרמטרים מגיע לחדשה (p_campaign ריק).
drop function if exists log_story_event(text, text, text, text);
create or replace function log_story_event(p_slug text, p_lang text, p_event text, p_visitor text default null, p_campaign text default null)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_visitor  text := p_visitor;
  v_campaign text := nullif(lower(trim(coalesce(p_campaign, ''))), '');
begin
  if p_slug is null or p_slug !~ '^[a-z0-9-]{1,80}$' then return; end if;
  if p_lang is null or p_lang not in ('he', 'en') then return; end if;
  if p_event is null or p_event not in ('open', 'play', 'finish', 'share', 'join', 'status', 'popup') then return; end if;
  if v_visitor is not null and v_visitor !~ '^[a-f0-9-]{16,40}$' then v_visitor := null; end if;
  if v_campaign is not null and v_campaign !~ '^[a-z0-9-]{2,40}$' then v_campaign := null; end if;

  if v_visitor is not null and exists (
    select 1 from story_link_events
    where visitor = v_visitor and slug = p_slug and lang = p_lang and event_type = p_event
      and occurred_at > now() - interval '30 minutes'
  ) then
    return;
  end if;
  if (select count(*) from story_link_events where occurred_at > now() - interval '1 minute') >= 1000 then
    return;
  end if;

  insert into story_link_events (slug, lang, event_type, visitor, campaign_code) values (p_slug, p_lang, p_event, v_visitor, v_campaign);
exception when others then
  return;
end;
$$;
grant execute on function log_story_event(text, text, text, text, text) to anon, authenticated;

-- כמה אנשים נכנסו להאזין דרך כל קמפיין: פתחו את דף הסיפור, לחצו נגן, הקשיבו עד הסוף.
create or replace function campaign_listen_counts(p_code text)
returns jsonb language sql security definer set search_path = public stable as $$
  select jsonb_build_object(
    'opens',    count(distinct coalesce(visitor, id::text)) filter (where event_type = 'open'),
    'plays',    count(distinct coalesce(visitor, id::text)) filter (where event_type = 'play'),
    'finishes', count(distinct coalesce(visitor, id::text)) filter (where event_type = 'finish'))
  from story_link_events where campaign_code = p_code;
$$;
revoke all on function campaign_listen_counts(text) from public, anon, authenticated;

create or replace function admin_campaign_listens()
returns jsonb language plpgsql security definer set search_path = public stable as $$
begin
  if not is_admin() then raise exception 'not authorized'; end if;
  return coalesce((select jsonb_object_agg(code, campaign_listen_counts(code))
                   from (select distinct campaign_code as code from story_link_events where campaign_code is not null) c), '{}'::jsonb);
end;
$$;
grant execute on function admin_campaign_listens() to authenticated;

create or replace function campaign_public_listens(p_key text)
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare v_code text;
begin
  if p_key is null or p_key !~ '^[a-f0-9]{16}$' then return null; end if;
  select code into v_code from join_campaigns where stats_key = p_key;
  if v_code is null then return null; end if;
  return campaign_listen_counts(v_code);
end;
$$;
grant execute on function campaign_public_listens(text) to anon, authenticated;
