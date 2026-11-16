-- Points: a prize every week, a comic booklet each time (Avraham 2026-11-16).
-- "The points needed should match what can be collected in a week, and the prize each time a comic booklet with five comics."
--
-- The threshold: 110 points = the most one child can collect in a week: 3 chosen daily items x 5 points x 6 days (Sunday to
-- Friday, no site on Shabbat) + 20 for "קראתי את דבר התורה בשולחן שבת" once a week. With more children points_per_child()
-- rounds up (2 children: 3 points each, 18 a day), so bigger families get a little room.
-- The prizes: the booklet "חיוך עם משמעות" (25 comics) in five numbered booklets of five comics, the same files the WhatsApp
-- bots give (רוני המתכנת/Tools/wa_cloud_bot/promo/build_comic_booklets.py, Supabase Storage wa-media/promo/booklets/).
-- Diamond Island stops being a prize: it is now a free story in "סיפורים בהמשכים" (the same day).
-- A family that already won it keeps the claim; its points since that claim count toward the first booklet.
-- get_my_points_state() also returns claimed_rewards, so a booklet that was won can be opened again later
-- (until now it was only in the celebration window).

update rewards set is_active = false, updated_at = now()
 where link_url_he = 'https://abrahamgersten.github.io/diamond-island-story/';

insert into rewards (threshold_points, title_he, title_en, description_he, description_en, link_url_he, link_url_en, image_url, is_active, sort_order)
select 110,
       'חיוך עם משמעות: חוברת ' || o.he,
       '"A Smile with Meaning": Booklet ' || o.n,
       'חוברת קומיקס עם חמישה קומיקסים קצרים ומסר לחיים, לקרוא יחד עם כל המשפחה.',
       'A comic booklet with five short comics and a message for life (in Hebrew), to read together as a family.',
       'https://nuadpewhrhpdgznbbqbs.supabase.co/storage/v1/object/public/wa-media/promo/booklets/chiuch-' || o.n || '.pdf',
       'https://nuadpewhrhpdgznbbqbs.supabase.co/storage/v1/object/public/wa-media/promo/booklets/chiuch-' || o.n || '.pdf',
       'https://abrahamgersten.github.io/zeh-kara-beemet/assets/images/rewards/chiuch-' || o.n || '.jpg',
       true, o.n
  from (values (1, 'ראשונה'), (2, 'שנייה'), (3, 'שלישית'), (4, 'רביעית'), (5, 'חמישית')) as o(n, he)
 where not exists (select 1 from rewards r where r.link_url_he like '%/booklets/chiuch-' || o.n || '.pdf');

create or replace function public.get_my_points_state()
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare
  v_family_id uuid; v_today date := family_today();
  v_child_count int; v_family_total int; v_cycle_start int;
  v_next_reward jsonb; v_result jsonb;
begin
  select id into v_family_id from subscribers where auth_user_id = auth.uid();
  if v_family_id is null then raise exception 'not authorized'; end if;
  select count(*) into v_child_count from children where family_id = v_family_id and is_active;
  select coalesce(sum(points_awarded), 0) into v_family_total from checkins where family_id = v_family_id;

  select coalesce(max(points_at_claim), 0) into v_cycle_start
    from family_reward_claims where family_id = v_family_id;

  select jsonb_build_object(
    'id', r.id, 'threshold_points', r.threshold_points,
    'title_he', r.title_he, 'title_en', r.title_en,
    'description_he', r.description_he, 'description_en', r.description_en,
    'link_url_he', r.link_url_he, 'link_url_en', r.link_url_en, 'image_url', r.image_url
  ) into v_next_reward
  from rewards r
  where r.is_active and r.id not in (
    select reward_id from family_reward_claims where family_id = v_family_id
  )
  order by r.sort_order, r.created_at limit 1;

  select jsonb_build_object(
    'family_total', v_family_total,
    'cycle_points', v_family_total - v_cycle_start,
    'children', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name) order by sort_order, created_at)
                 from children where family_id = v_family_id and is_active), '[]'::jsonb),
    'checklist_items', coalesce((
      select jsonb_agg(jsonb_build_object(
                 'id', ci.id, 'item_key', ci.item_key, 'category', ci.category,
                 'label_he', ci.label_he, 'label_en', ci.label_en, 'icon', ci.icon,
                 'points_today', points_per_child(ci.base_points, v_child_count)
               ) order by coalesce(fcs.sort_order, ci.sort_order))
      from checklist_items ci
      left join family_checklist_selection fcs on fcs.item_id = ci.id and fcs.family_id = v_family_id
      where ci.is_active and (
        (ci.category = 'daily' and fcs.family_id = v_family_id)
        or ci.category = 'parasha'
      )
    ), '[]'::jsonb),
    'preset_catalog', coalesce((select jsonb_agg(jsonb_build_object(
                 'id', id, 'item_key', item_key, 'label_he', label_he, 'label_en', label_en,
                 'icon', icon, 'is_custom', (family_id is not null)
               ) order by (family_id is not null), sort_order)
                 from checklist_items
                 where category = 'daily' and is_active and (family_id is null or family_id = v_family_id)), '[]'::jsonb),
    'checked_today', coalesce((select jsonb_agg(jsonb_build_object('child_id', child_id, 'item_id', item_id))
                 from checkins where family_id = v_family_id and checkin_date = v_today), '[]'::jsonb),
    'next_reward', v_next_reward,
    -- the prizes this family already won, newest first (2026-11-16), so a booklet can be opened again
    'claimed_rewards', coalesce((select jsonb_agg(jsonb_build_object(
                 'id', r.id, 'title_he', r.title_he, 'title_en', r.title_en,
                 'link_url_he', r.link_url_he, 'link_url_en', r.link_url_en, 'image_url', r.image_url,
                 'claimed_at', c.claimed_at
               ) order by c.claimed_at desc)
                 from family_reward_claims c join rewards r on r.id = c.reward_id
                 where c.family_id = v_family_id), '[]'::jsonb)
  ) into v_result;
  return v_result;
end; $function$;
