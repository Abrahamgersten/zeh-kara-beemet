-- כפתור "להצטרפות לקבוצה" בתחתית דף הסיפור (אברהם, 2026-10-25: "אני רוצה לדעת אם הוא אפקטיבי ונכנסים דרכו").
-- 1. לכל קמפיין נספרות גם הלחיצות על הכפתור הזה (אירוע join בדף שנפתח עם ?c=<קוד>), למשל ממי שהגיע מסטטוס.
-- 2. הכפתור עצמו מוביל ל-whatsapp/?c=story-page, כך שב-campaigns.html רואים כמה הגיעו לקבוצה דרכו בסך הכול.
-- נוצר ע"י רוני המתכנת.

create or replace function campaign_listen_counts(p_code text)
returns jsonb language sql security definer set search_path = public stable as $$
  select jsonb_build_object(
    'opens',    count(distinct coalesce(visitor, id::text)) filter (where event_type = 'open'),
    'plays',    count(distinct coalesce(visitor, id::text)) filter (where event_type = 'play'),
    'finishes', count(distinct coalesce(visitor, id::text)) filter (where event_type = 'finish'),
    'joins',    count(distinct coalesce(visitor, id::text)) filter (where event_type = 'join'))
  from story_link_events where campaign_code = p_code;
$$;
revoke all on function campaign_listen_counts(text) from public, anon, authenticated;

insert into join_campaigns (code, name, description)
values ('story-page', 'כפתור ההצטרפות בתחתית דף הסיפור',
        'הכפתור "להצטרפות לקבוצה" בתחתית כל דף סיפור (s/<slug>/), מכל מקור: סטטוס, הודעה, קבוצה')
on conflict (code) do nothing;
