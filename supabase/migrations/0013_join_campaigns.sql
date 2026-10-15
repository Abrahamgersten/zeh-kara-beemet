-- קישורי קמפיין לקבוצות הוואטסאפ "סיפור לפני השינה - זה קרה באמת" (בקשת אברהם, 2026-10-15):
-- "קישורים שונים שיפנו לקישור הרגיל ... כך שכל קישור יאפשר זיהוי לכל אחד מהאפיקים
--  שדרכם אנשים מצטרפים, לדעת מי הגיע מאיפה ומה הכי אפקטיבי".
--
-- כל קמפיין הוא אותו דף whatsapp/ עם ?c=<קוד>. הדף קורא ל-join_click(), שרושם כניסה
-- ומחזיר את הקבוצה הנוכחית (join_target, 0011) באותה קריאה, כך שההפניה לא מתעכבת.
-- גם הקישור הרגיל, בלי קוד, נספר (campaign_code ריק), כדי שיהיה בסיס להשוואה.
-- נספרות לחיצות על הקישור. וואטסאפ לא מדווחת מי מהן השלים בפועל הצטרפות לקבוצה.
-- בלי שום פרט מזהה: visitor הוא מספר אקראי שהדפדפן שומר אצלו (אותו מספר כמו בדפי הסיפור,
-- js/story.js), כדי להבחין בין "100 לחיצות" ל-"100 אנשים" ולא לספור רענון כלחיצה נוספת.
-- נוצר ע"י רוני המתכנת.

create table if not exists join_campaigns (
  code        text primary key check (code ~ '^[a-z0-9-]{2,40}$'),
  name        text not null check (length(trim(name)) between 1 and 120),
  description text check (description is null or length(description) <= 2000),
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table join_campaigns enable row level security;

create table if not exists join_clicks (
  id            bigint generated always as identity primary key,
  campaign_code text,                      -- null = הקישור הרגיל, בלי קמפיין
  visitor       text,
  occurred_at   timestamptz not null default now()
);
create index if not exists join_clicks_code_idx on join_clicks (campaign_code, occurred_at);
create index if not exists join_clicks_visitor_idx on join_clicks (visitor, occurred_at);
create index if not exists join_clicks_occurred_at_idx on join_clicks (occurred_at);

-- כמו בשאר המערכת: RLS בלי אף policy. כתיבה רק דרך join_click, קריאה רק דרך פונקציות המנהל.
alter table join_clicks enable row level security;

-- הדף הציבורי whatsapp/ קורא לזה במקום get_join_target(). הרישום לעולם לא מפיל את ההפניה:
-- כל תקלה בו נבלעת, והכתובת מוחזרת תמיד.
-- בלמים (כמו log_story_event): אותו דפדפן ואותו קישור נספרים פעם אחת ב-30 דקות,
-- ולא יותר מ-1000 לחיצות בדקה בסך הכול.
-- קוד שלא נוצר בממשק עדיין נספר (אם הוא בצורה תקינה), ומוצג למנהל כ"קוד לא מוכר",
-- כדי שטעות הקלדה בקישור לא תעלים כניסות.
create or replace function join_click(p_code text default null, p_visitor text default null)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code    text := nullif(lower(trim(coalesce(p_code, ''))), '');
  v_visitor text := p_visitor;
  v_url     text;
begin
  select url into v_url from join_target where id = 1;

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

    insert into join_clicks (campaign_code, visitor) values (v_code, v_visitor);
  exception when others then
    null;
  end;

  return v_url;
end;
$$;
grant execute on function join_click(text, text) to anon, authenticated;

-- יצירת קמפיין מהממשק. הקוד נוצר כאן: 5 תווים (אותיות לטיניות קטנות וספרות, בלי תווים
-- שמתבלבלים כמו l/1 ו-o/0), כדי שהקישור יהיה קצר ושלא יהיה אפשר לנחש קישורים של קמפיינים אחרים.
create or replace function admin_create_join_campaign(p_name text, p_description text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_alphabet constant text := 'abcdefghjkmnpqrstuvwxyz23456789';
  v_code text;
  v_row  join_campaigns;
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'חסר שם קמפיין';
  end if;

  loop
    v_code := '';
    for i in 1..5 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from join_campaigns where code = v_code);
  end loop;

  insert into join_campaigns (code, name, description)
  values (v_code, trim(p_name), nullif(trim(coalesce(p_description, '')), ''))
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;
grant execute on function admin_create_join_campaign(text, text) to authenticated;

create or replace function admin_update_join_campaign(p_code text, p_name text, p_description text, p_archived boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'חסר שם קמפיין';
  end if;
  update join_campaigns
  set name = trim(p_name),
      description = nullif(trim(coalesce(p_description, '')), ''),
      archived = coalesce(p_archived, false)
  where code = p_code;
  if not found then
    raise exception 'קמפיין לא נמצא';
  end if;
end;
$$;
grant execute on function admin_update_join_campaign(text, text, text, boolean) to authenticated;

-- הסיכום לממשק (campaigns.html): שורה לכל קמפיין, שורה לקישור הרגיל, ושורה לכל קוד לא מוכר.
-- people = אנשים שונים (לפי המספר האקראי); לחיצה בלי מספר (גלישה פרטית) נספרת כאדם נפרד.
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
