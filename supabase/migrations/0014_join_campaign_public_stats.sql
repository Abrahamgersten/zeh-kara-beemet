-- קישור צפייה במספרים לכל קמפיין (אברהם, 2026-10-19: "קישור לכל קמפיין שאפשר לראות כמה נכנסו
-- דרך כל קמפיין"). דף ציבורי campaign/?k=<מפתח>, בלי התחברות, רק המספרים של אותו קמפיין.
-- המפתח נפרד מקוד הקמפיין: הקוד מופיע בקישור שמופץ לכולם, והמפתח רק בקישור הצפייה,
-- כך שמי שקיבל קישור הצטרפות לא יכול לראות מספרים, ומי שקיבל קישור צפייה לא רואה קמפיינים אחרים.
-- לא מוצג "אופן הפעולה" (הערות פנימיות של אברהם), רק השם והמספרים.
-- נוצר ע"י רוני המתכנת.

alter table join_campaigns
  add column if not exists stats_key text not null default encode(extensions.gen_random_bytes(8), 'hex');
create unique index if not exists join_campaigns_stats_key_idx on join_campaigns (stats_key);

create or replace function join_campaign_public_stats(p_key text)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_c      join_campaigns;
  v_today  timestamptz := date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem';
  v_result jsonb;
begin
  if p_key is null or p_key !~ '^[a-f0-9]{16}$' then return null; end if;
  select * into v_c from join_campaigns where stats_key = p_key;
  if not found then return null; end if;

  select jsonb_build_object(
    'name', v_c.name,
    'created_at', v_c.created_at,
    'archived', v_c.archived,
    'people',       count(distinct visitor) + count(*) filter (where visitor is null),
    'people_today', count(distinct visitor) filter (where occurred_at >= v_today)
                      + count(*) filter (where visitor is null and occurred_at >= v_today),
    'people_7d',    count(distinct visitor) filter (where occurred_at >= now() - interval '7 days')
                      + count(*) filter (where visitor is null and occurred_at >= now() - interval '7 days'),
    'clicks', count(*),
    'last_click', max(occurred_at),
    'days', coalesce((
      select jsonb_agg(jsonb_build_object('day', d.day, 'people', d.people) order by d.day desc)
      from (
        select (occurred_at at time zone 'Asia/Jerusalem')::date as day,
               count(distinct visitor) + count(*) filter (where visitor is null) as people
        from join_clicks
        where campaign_code = v_c.code and occurred_at >= now() - interval '30 days'
        group by 1
      ) d
    ), '[]'::jsonb)
  ) into v_result
  from join_clicks
  where campaign_code = v_c.code;

  return v_result;
end;
$$;
grant execute on function join_campaign_public_stats(text) to anon, authenticated;

-- הסיכום למנהל: כמו ב-0013, ועכשיו גם stats_key לכל קמפיין (לכפתור "קישור למספרים").
create or replace function admin_join_campaign_stats()
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_result jsonb;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  with c as (
    select
      campaign_code,
      count(*)                                                        as clicks,
      count(distinct visitor) + count(*) filter (where visitor is null) as people,
      count(distinct visitor) filter (where occurred_at >= now() - interval '7 days')
        + count(*) filter (where visitor is null and occurred_at >= now() - interval '7 days') as people_7d,
      count(distinct visitor) filter (where occurred_at >= date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem')
        + count(*) filter (where visitor is null and occurred_at >= date_trunc('day', now() at time zone 'Asia/Jerusalem') at time zone 'Asia/Jerusalem') as people_today,
      min(occurred_at) as first_click,
      max(occurred_at) as last_click
    from join_clicks
    group by campaign_code
  )
  select jsonb_build_object(
    'campaigns', coalesce((
      select jsonb_agg(jsonb_build_object(
        'code', jc.code,
        'name', jc.name,
        'description', jc.description,
        'archived', jc.archived,
        'created_at', jc.created_at,
        'stats_key', jc.stats_key,
        'clicks', coalesce(c.clicks, 0),
        'people', coalesce(c.people, 0),
        'people_7d', coalesce(c.people_7d, 0),
        'people_today', coalesce(c.people_today, 0),
        'first_click', c.first_click,
        'last_click', c.last_click
      ) order by jc.archived, coalesce(c.people, 0) desc, jc.created_at desc)
      from join_campaigns jc
      left join c on c.campaign_code = jc.code
    ), '[]'::jsonb),
    'direct', (
      select jsonb_build_object(
        'clicks', coalesce(max(c.clicks), 0),
        'people', coalesce(max(c.people), 0),
        'people_7d', coalesce(max(c.people_7d), 0),
        'people_today', coalesce(max(c.people_today), 0),
        'last_click', max(c.last_click)
      ) from c where c.campaign_code is null
    ),
    'unknown', coalesce((
      select jsonb_agg(jsonb_build_object(
        'code', c.campaign_code, 'clicks', c.clicks, 'people', c.people, 'last_click', c.last_click
      ) order by c.people desc)
      from c
      where c.campaign_code is not null
        and not exists (select 1 from join_campaigns jc where jc.code = c.campaign_code)
    ), '[]'::jsonb),
    'totals', (
      select jsonb_build_object(
        'clicks', count(*),
        'people', count(distinct visitor) + count(*) filter (where visitor is null),
        'people_7d', count(distinct visitor) filter (where occurred_at >= now() - interval '7 days')
          + count(*) filter (where visitor is null and occurred_at >= now() - interval '7 days'),
        'tracked_since', min(occurred_at)
      ) from join_clicks
    )
  ) into v_result;

  return v_result;
end;
$$;
grant execute on function admin_join_campaign_stats() to authenticated;
