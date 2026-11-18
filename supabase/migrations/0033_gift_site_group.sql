-- 2026-11-18 (Avraham): on the gift site the WhatsApp group is offered only after the subscription window
-- (js/guest.js groupInvite). Its button leads to whatsapp/?c=gift-site, so campaigns.html counts who came from it.
insert into join_campaigns (code, name, description)
values ('gift-site', 'כפתור ההצטרפות באתר המתנה, אחרי הודעת המנויים',
        'הכפתור "להצטרפות לקבוצה" שמופיע באתר (קישור המתנה) רק אחרי ההודעה על תוכנית המנויים: למי שסגר אותה בלי להשאיר טלפון, ובתודה למי שהשאיר')
on conflict (code) do nothing;
