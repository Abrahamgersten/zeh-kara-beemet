"use strict";

/* ---------------------------------------------------------------
   "סיפור חדש עלה" - התראה לטלפון (אברהם, 2026-10-23). Web Push רגיל:
   - אנדרואיד/מחשב: הכרטיס "קבלו התראה" מופיע, ולחיצה מבקשת אישור ונרשמת.
   - אייפון: התראות אפשריות רק כשהאתר מותקן כאפליקציה (iOS 16.4 ומעלה, "הוספה למסך הבית"). בדפדפן עצמו
     מוצג הסבר איך להתקין; מתוך האפליקציה המותקנת - הכרטיס הרגיל.
   הכתובת והמפתחות שהדפדפן נותן נשמרים ב-push_subscriptions (supabase/migrations/0015), בלי שום פרט מזהה.
   השליחה: רוני המתכנת/Tools/push/send_push.py, אחרי שפרק חדש עולה. ההתראה עצמה מוצגת ע"י sw.js.
   "לא עכשיו" מסתיר את הכרטיס ל-30 יום. מי שכבר נרשם - לא רואה אותו (והרישום מתרענן בשקט).
--------------------------------------------------------------- */
(function () {
  const VAPID_PUBLIC = "BCDr2SpDJOsxiYdOlDf9h-LNLBZv75QhGpOeX_Czms1XyS8P4GqBLRusUXgYKqv-4_4TKxOmS0UxYa0KOobepSI";
  const RPC = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/";
  const KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz"; // public key (js/supabase-config.js)
  const DISMISS_KEY = "zkb_push_dismissed";
  const lang = document.documentElement.lang === "en" ? "en" : "he";
  const T = lang === "en"
    ? {
        title: "Want to know when a new story comes out?",
        sub: "We'll send a notification to your phone. Only for new recordings.",
        on: "🔔 Turn on notifications",
        later: "Not now",
        done: "✓ Notifications are on. We'll let you know when a new story comes out.",
        denied: "Notifications are blocked in this browser's settings.",
        failed: "That didn't work. Please try again later.",
        iosTitle: "Get a notification for every new story",
        iosSub: "On iPhone: tap the Share button, choose \"Add to Home Screen\", open the site from the new icon - and turn notifications on there.",
        iosOk: "Got it",
      }
    : {
        title: "רוצים לדעת כשעולה סיפור חדש?",
        sub: "נשלח התראה לטלפון, רק כשעולה הקלטה חדשה.",
        on: "🔔 הפעלת התראות",
        later: "לא עכשיו",
        done: "✓ ההתראות פעילות. נעדכן כשעולה סיפור חדש.",
        denied: "ההתראות חסומות בהגדרות של הדפדפן הזה.",
        failed: "זה לא הצליח. נסו שוב מאוחר יותר.",
        iosTitle: "קבלו התראה על כל סיפור חדש",
        iosSub: "באייפון: לחצו על כפתור השיתוף, בחרו \"הוספה למסך הבית\", פתחו את האתר מהאייקון החדש - והפעילו שם את ההתראות.",
        iosOk: "הבנתי",
      };
  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

  const dismissedRecently = () => {
    try {
      return Date.now() - Number(localStorage.getItem(DISMISS_KEY) || 0) < 30 * 864e5;
    } catch (e) {
      return false;
    }
  };
  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch (e) {
      // ignore
    }
  };

  function keyBytes(b64) {
    const pad = "=".repeat((4 - (b64.length % 4)) % 4);
    const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(raw, (c) => c.charCodeAt(0));
  }

  function rpc(name, body) {
    return fetch(RPC + name, {
      method: "POST",
      headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  function save(sub) {
    const j = sub.toJSON();
    return rpc("save_push_subscription", { p_endpoint: j.endpoint, p_p256dh: j.keys.p256dh, p_auth: j.keys.auth, p_lang: lang });
  }

  // the service worker is registered by js/app.js on load; do not wait for it forever
  function ready() {
    return Promise.race([navigator.serviceWorker.ready, new Promise((res) => setTimeout(() => res(null), 6000))]);
  }

  async function subscribe() {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return permission === "denied" ? "denied" : "later";
    const reg = await ready();
    if (!reg) return "failed";
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID_PUBLIC) });
    const r = await save(sub);
    return r.ok ? "ok" : "failed";
  }

  function card(host, html) {
    host.innerHTML = `<div class="push-optin__card" role="region" aria-label="${T.title}">${html}</div>`;
    host.hidden = false;
  }

  async function init() {
    const host = document.getElementById("push-optin");
    if (!host) return;
    host.hidden = true;

    if (!supported) {
      // iPhone in Safari (not installed): explain how to install, once a month at most
      if (isApple && !standalone && !dismissedRecently()) {
        card(host, `
          <span class="push-optin__icon" aria-hidden="true">🔔</span>
          <div class="push-optin__text"><strong>${T.iosTitle}</strong><span>${T.iosSub}</span></div>
          <div class="push-optin__actions"><button class="push-optin__later" type="button" data-push="later">${T.iosOk}</button></div>`);
        host.querySelector("[data-push='later']").addEventListener("click", () => {
          dismiss();
          host.hidden = true;
        });
      }
      return;
    }
    if (Notification.permission === "denied") return;
    if (Notification.permission === "granted") {
      const reg = await ready();
      const sub = reg && (await reg.pushManager.getSubscription());
      if (sub) {
        save(sub).catch(() => {}); // keeps the subscription on the list (and its language) fresh
        return;
      }
    }
    if (dismissedRecently()) return;

    card(host, `
      <span class="push-optin__icon" aria-hidden="true">🔔</span>
      <div class="push-optin__text"><strong>${T.title}</strong><span>${T.sub}</span></div>
      <div class="push-optin__actions">
        <button class="btn btn--primary push-optin__on" type="button" data-push="on">${T.on}</button>
        <button class="push-optin__later" type="button" data-push="later">${T.later}</button>
      </div>
      <p class="push-optin__note" role="status" aria-live="polite"></p>`);
    const note = host.querySelector(".push-optin__note");
    host.querySelector("[data-push='later']").addEventListener("click", () => {
      dismiss();
      host.hidden = true;
    });
    host.querySelector("[data-push='on']").addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      let result = "failed";
      try {
        result = await subscribe();
      } catch (err) {
        result = "failed";
      }
      if (result === "ok") {
        host.querySelector(".push-optin__actions").remove();
        note.textContent = T.done;
        setTimeout(() => (host.hidden = true), 5000);
      } else if (result === "denied") {
        note.textContent = T.denied;
        setTimeout(() => (host.hidden = true), 5000);
      } else if (result === "later") {
        btn.disabled = false; // closed the browser's question without answering
      } else {
        note.textContent = T.failed;
        btn.disabled = false;
      }
    });
  }

  window.ZkbPush = { init, subscribe };
  document.addEventListener("DOMContentLoaded", () => {
    init().catch(() => {});
  });
})();
