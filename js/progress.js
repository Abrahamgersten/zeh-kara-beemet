"use strict";

/* ---------------------------------------------------------------
   שלושה דברים קטנים שמשותפים לאתר המלא (js/app.js) ולדפי הסיפור (js/story.js) - אברהם, 2026-10-23:

   ZkbResume  "המשך מאיפה שעצרתם": המקום בכל הקלטה נשמר בדפדפן (כל 5 שניות ובכל עצירה), ובחזרה
              ההקלטה ממשיכה משם. נמחק כשההקלטה נגמרת. אותו מקום באתר ובדף הסיפור של אותה הקלטה.
   ZkbNew     "חדש מאז הביקור האחרון": הדפדפן זוכר אילו הקלטות כבר ראה. הקלטה שמופיעה לראשונה מקבלת תגית
              "חדש" לשבוע, או עד שמקשיבים לה. בביקור הראשון אין תגיות (הכול "ידוע").
   ZkbListen  נקודות הנטישה: לכל השמעה נשלחים מאיפה התחילה ועד איפה הגיעה בהאזנה רציפה (דילוג קדימה לא
              נחשב), כל 30 שניות ובעצירה - supabase/migrations/0015, מוצג ב-admin.html. בלי שום פרט מזהה.
   שמירה בדפדפן: עטופה ב-try, כי בגלישה פרטית היא יכולה להיכשל - ואז פשוט אין המשך/תגית.
--------------------------------------------------------------- */
(function () {
  const store = {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        // full or blocked storage: nothing to do
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // ignore
      }
    },
  };

  const MIN_RESUME = 10; // seconds: below this, start from the beginning
  const END_MARGIN = 20; // seconds: this close to the end counts as finished
  const KEEP_DAYS = 60;

  window.ZkbResume = {
    get(lang, slug) {
      const v = store.get(`zkb_pos:${lang}:${slug}`);
      if (!v || typeof v.t !== "number" || typeof v.d !== "number") return null;
      if (Date.now() - (v.at || 0) > KEEP_DAYS * 864e5) return null;
      if (v.t < MIN_RESUME || v.t > v.d - END_MARGIN) return null;
      return v;
    },
    set(lang, slug, t, d) {
      if (!(t >= 0) || !(d > 0)) return;
      if (t < MIN_RESUME || t > d - END_MARGIN) {
        store.remove(`zkb_pos:${lang}:${slug}`);
        return;
      }
      store.set(`zkb_pos:${lang}:${slug}`, { t: Math.round(t), d: Math.round(d), at: Date.now() });
    },
    clear(lang, slug) {
      store.remove(`zkb_pos:${lang}:${slug}`);
    },
  };

  const NEW_DAYS = 7;
  window.ZkbNew = {
    // which of these recordings are new for this browser; remembers the rest
    check(lang, slugs) {
      const key = `zkb_known:${lang}`;
      const known = store.get(key);
      const now = Date.now();
      const first = !known || typeof known !== "object";
      const map = first ? {} : known;
      const fresh = new Set();
      for (const s of slugs) {
        if (!(s in map)) map[s] = first ? 0 : now; // 0 = known before this feature, never "new"
        if (map[s] > 0 && now - map[s] < NEW_DAYS * 864e5) fresh.add(s);
      }
      store.set(key, map);
      return fresh;
    },
    // listened to: no longer new
    seen(lang, slug) {
      const key = `zkb_known:${lang}`;
      const map = store.get(key) || {};
      map[slug] = 0;
      store.set(key, map);
    },
  };

  const ENDPOINT = window.ZKB_LISTEN_ENDPOINT || "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/log_listen";
  const KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz"; // the public key of js/supabase-config.js
  const live = () => location.hostname === "abrahamgersten.github.io" || !!window.ZKB_LISTEN_ENDPOINT;
  const randomId = () =>
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");

  window.ZkbListen = {
    // one playback of one recording; feed it the time as it plays, flush() on pause, end() when it finishes
    session(slug, lang, source) {
      const id = randomId();
      let start = null;
      let reached = 0;
      let last = null;
      let duration = null;
      let done = false;
      let sentStep = -1;
      let sentReached = -1;
      function send() {
        if (start === null || !live()) return;
        if (reached === sentReached && !done) return;
        sentReached = reached;
        try {
          fetch(ENDPOINT, {
            method: "POST",
            keepalive: true, // also on the way out of the page
            headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ p_session: id, p_slug: slug, p_lang: lang, p_source: source, p_start: Math.round(start * 10) / 10,
                                   p_reached: Math.round(reached * 10) / 10, p_duration: duration ? Math.round(duration) : null, p_completed: done }),
          }).catch(() => {});
        } catch (e) {
          // never affects listening
        }
      }
      return {
        time(t, d) {
          if (d > 0 && isFinite(d)) duration = d;
          if (start === null) {
            start = t;
            reached = t;
            last = t;
            return;
          }
          const step = t - last;
          if (step > 0 && step < 2.5) reached = Math.max(reached, t); // plain listening (a jump forward is not "heard")
          last = t;
          const k = Math.floor((reached - start) / 30);
          if (k > sentStep) {
            sentStep = k;
            send();
          }
        },
        flush: send,
        end() {
          if (start === null) return;
          done = true;
          if (duration) reached = Math.max(reached, duration);
          send();
        },
      };
    },
  };
})();
