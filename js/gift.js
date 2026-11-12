"use strict";

/* ---------------------------------------------------------------
   מתנה למי שהעלה סטטוס (אברהם, 2026-11-10): קישור מיוחד לאתר, ?g=<קוד אישי>, שהבוט שולח אחרי "העליתי את הסטטוס".
   הקישור הרגיל לאתר לא השתנה (התחברות ומנוי, js/auth.js). עם הקישור המיוחד האתר נפתח בלי התחברות, ואפשר לבחור
   בו פרק אחד להאזנה:
     * פרק אחד ביום. אותו פרק אפשר לשמוע שוב באותו יום, פרק אחר לא. "נגן ברצף" לא מוצג.
     * סטטוס נוסף ביום אחר = עוד פרק, ולא יותר משני פרקים בשבעה ימים.
     * מי שלוחץ על פרק נוסף רואה הודעה על תוכנית המנויים, ויכול להשאיר טלפון.
   הכללים נאכפים בשרת (supabase/migrations/0026_status_gift.sql: gift_state, gift_pick, gift_lead), לא כאן.
   מנוי מחובר שפותח את הקישור רואה את האתר כרגיל (index.html קורא ל-ZkbGift.disable()).

   window.ZkbGift.active()                      האם האתר במצב מתנה
   window.ZkbGift.play({ slug, title, start, stop })   נקרא מכפתור הנגן (js/app.js) במקום ניגון ישיר
--------------------------------------------------------------- */
(function () {
  const m = /[?&]g=([a-f0-9]{20})(?:&|$)/.exec(location.search);
  if (!m) return;
  const TOKEN = m[1];
  const API = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/";
  const KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz"; // the public key of js/supabase-config.js (this file is not a module)
  const EN = document.documentElement.lang === "en"; // the English site (en/index.html) loads this same file
  const L = (he, en) => (EN ? en : he);

  let on = !window.zkbGiftOff;
  let state = null; // { valid, today, can_pick, reason }
  let failed = false; // the server could not be reached
  let bar = null;
  let root = null;
  let card = null;
  let lastFocus = null;

  if (on) document.documentElement.classList.add("gift-mode");

  function rpc(name, body) {
    return fetch(API + name, {
      method: "POST",
      headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) throw new Error("gift " + r.status);
      return r.json();
    });
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function loadState() {
    failed = false;
    return rpc("gift_state", { p_token: TOKEN })
      .then((s) => {
        state = s;
        if (on && s && s.valid === false) location.replace("login.html"); // not a gift link: the site's usual door
      })
      .catch(() => {
        failed = true;
      })
      .then(showBar);
  }
  const ready = loadState();

  /* ---------- the bar at the bottom: what the gift is, and the episode chosen today ---------- */
  function cardOf(slug) {
    const btn = slug && document.querySelector(`[data-share-slug="${slug}"]`);
    return btn ? btn.closest(".content-card") : null;
  }
  function titleOf(slug) {
    const c = cardOf(slug);
    const t = c && c.querySelector(".content-card__title");
    return t ? t.textContent : "";
  }

  function showBar() {
    if (!on || !document.body) return;
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "gift-bar";
      bar.setAttribute("role", "status");
      document.body.appendChild(bar);
      bar.addEventListener("click", (e) => {
        if (e.target.closest("[data-gift-go]")) goToEpisode(state && state.today);
        if (e.target.closest("[data-gift-retry]")) loadState();
      });
    }
    document.querySelectorAll(".content-card--gift").forEach((c) => c.classList.remove("content-card--gift"));
    let html;
    if (failed || !state) {
      html = failed
        ? `<span class="gift-bar__text">${L(`🎁 לא הצלחנו לבדוק את המתנה. בדקו את החיבור לאינטרנט.`, `🎁 We couldn't check your gift. Please check your internet connection.`)}</span><button class="gift-bar__btn" type="button" ${L(`data-gift-retry>לנסות שוב<`, `data-gift-retry>Try again<`)}/button>`
        : `<span class="gift-bar__text">${L(`🎁 רגע, בודקים את המתנה שלכם…`, `🎁 One moment, checking your gift…`)}</span>`;
    } else if (state.today) {
      const c = cardOf(state.today);
      if (c) c.classList.add("content-card--gift");
      const t = titleOf(state.today);
      html = `<span class="gift-bar__text">${L(`🎁 הפרק שלכם היום`, `🎁 Your episode for today`)}${t ? `: <strong>${esc(t)}</strong>` : ""}</span><button class="gift-bar__btn" type="button" ${L(`data-gift-go>לפרק<`, `data-gift-go>Go to episode<`)}/button>`;
    } else if (state.can_pick) {
      html = `<span class="gift-bar__text">${L(`🎁 <strong>מתנה על הסטטוס:</strong> בחרו פרק אחד מכל האתר, ולחצו ▶`, `🎁 <strong>A gift for your status:</strong> pick any one episode on the site and press ▶`)}</span>`;
    } else if (state.reason === "week") {
      html = `<span class="gift-bar__text">${L(`🎁 השבוע כבר האזנתם לשני פרקים במתנה. נתראה בשבוע הבא!`, `🎁 You've already heard two gift episodes this week. See you next week!`)}</span>`;
    } else {
      html = `<span class="gift-bar__text">${L(`🎁 כל סטטוס שמעלים = פרק אחד לבחירה. המתנה הבאה מחכה לסטטוס הבא שלכם.`, `🎁 Every status you post = one episode of your choice. Your next gift is waiting for your next status.`)}</span>`;
    }
    bar.innerHTML = html;
  }

  // the card of an episode: js/app.js opens its folder and brings it into view on #ep-<slug>
  function goToEpisode(slug) {
    if (!slug) return;
    const hash = "#ep-" + slug;
    if (location.hash === hash) window.dispatchEvent(new HashChangeEvent("hashchange"));
    else location.hash = hash;
  }

  /* ---------- the dialogs (the look of js/share-sheet.js) ---------- */
  function ensure() {
    if (root) return;
    root = document.createElement("div");
    root.className = "lightbox share-sheet gift-sheet";
    root.hidden = true;
    root.innerHTML = `<div class="share-sheet__card" role="dialog" aria-modal="true" aria-labelledby="gift-title"></div>`;
    card = root.firstElementChild;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => {
      if (e.target === root) close();
    });
    document.addEventListener("keydown", (e) => {
      if (root.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const items = card.querySelectorAll("button:not([disabled]), input");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  function show(html) {
    ensure();
    if (root.hidden) lastFocus = document.activeElement;
    card.innerHTML = `<button class="share-sheet__close" type="button" data-gift-close ${L(`aria-label="סגירה"`, `aria-label="Close"`)}>✕</button>${html}`;
    card.querySelectorAll("[data-gift-close]").forEach((b) => b.addEventListener("click", close));
    root.hidden = false;
    document.body.style.overflow = "hidden";
    const first = card.querySelector("[data-gift-first]") || card.querySelector("button");
    if (first) first.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  // "is this the episode you choose?" - a slip of the finger must not use up the gift
  function confirmPick(o) {
    show(`
      <h2 class="share-sheet__title" id="gift-title">${L(`🎁 זה הפרק שבחרתם?`, `🎁 Is this the episode you want?`)}</h2>
      <p class="share-sheet__lead gift-sheet__lead">${esc(o.title)}</p>
      <p class="gift-sheet__text">${L(`במתנה אפשר להאזין היום לפרק אחד. אחרי שבוחרים אי אפשר להחליף, אבל אפשר לשמוע אותו שוב היום כמה שרוצים.`, `Your gift is one episode today. Once you choose, you can't switch, but you can listen to it again today as many times as you like.`)}</p>
      <div class="share-sheet__actions">
        <button class="btn btn--primary share-sheet__primary" type="button" data-gift-yes data-gift-first>${L(`כן, להאזין לפרק הזה`, `Yes, play this episode`)}</button>
        <button class="share-sheet__link" type="button" data-gift-close>${L(`רגע, אבחר פרק אחר`, `Wait, I'll pick a different one`)}</button>
      </div>`);
    card.querySelector("[data-gift-yes]").addEventListener("click", () => {
      close();
      o.start(); // from the tap itself (a phone plays only from a tap); the server's answer follows
      rpc("gift_pick", { p_token: TOKEN, p_slug: o.slug })
        .then((r) => {
          if (r && r.ok) {
            state = { valid: true, today: o.slug, can_pick: false, reason: "day" };
            showBar();
            return;
          }
          o.stop();
          return loadState().then(() => offer(o, r && r.reason));
        })
        .catch(() => {
          o.stop();
          failed = true;
          showBar();
        });
    });
  }

  // another episode: the subscription plan is about to open - shall we tell you? (Avraham, 2026-11-10)
  function offer(o, reason) {
    const why = reason || (state && state.reason);
    const today = state && state.today ? titleOf(state.today) : "";
    const hint = why === "day"
      ? `${L(`היום כבר בחרתם פרק${today ? `: "${esc(today)}"` : ""}. אפשר לשמוע אותו שוב כמה שרוצים.`, `You already picked an episode today${today ? `: "${esc(today)}"` : ""}. You can listen to it again as many times as you like.`)}`
      : why === "week"
        ? L("השבוע כבר האזנתם לשני פרקים במתנה.", "You've already heard two gift episodes this week.")
        : L("כל סטטוס שמעלים = פרק אחד לבחירה. המתנה הבאה מחכה לסטטוס הבא שלכם.", "Every status you post = one episode of your choice. Your next gift is waiting for your next status.");
    show(`
      <h2 class="share-sheet__title" id="gift-title">${L(`רוצים להאזין גם לפרק הזה?`, `Want to hear this episode too?`)}</h2>
      <p class="gift-sheet__text">${L(`כדי להאזין לפרק הזה ולכל הפרקים באתר, עומדת להיפתח <strong>תוכנית מנויים</strong>.`, `To hear this episode and every episode on the site, a <strong>subscription plan</strong> is about to open.`)}</p>
      <p class="gift-sheet__text">${L(`<strong>רוצים שנפנה אליכם כשהיא תהיה זמינה לציבור?</strong>`, `<strong>Would you like us to let you know when it opens to the public?</strong>`)}</p>
      <div class="share-sheet__actions gift-sheet__ask">
        <button class="btn btn--primary share-sheet__primary" type="button" data-gift-want data-gift-first>${L(`כן, עדכנו אותי`, `Yes, let me know`)}</button>
        <button class="share-sheet__link" type="button" data-gift-close>${L(`לא עכשיו`, `Not now`)}</button>
      </div>
      <form class="gift-sheet__form" hidden novalidate>
        <label class="gift-sheet__label" for="gift-phone">${L(`מספר הטלפון שלכם`, `Your phone number`)}</label>
        <input class="gift-sheet__input" id="gift-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="${L(`050-1234567`, `(555) 123-4567`)}" aria-describedby="gift-phone-note">
        <p class="share-sheet__note gift-sheet__note" id="gift-phone-note" role="status" aria-live="polite"></p>
        <div class="share-sheet__actions">
          <button class="btn btn--primary share-sheet__primary" type="submit"${L(`>שמירה<`, `>Save<`)}/button>
          <button class="share-sheet__link" type="button" data-gift-close${L(`>ביטול<`, `>Cancel<`)}/button>
        </div>
      </form>
      <p class="gift-sheet__hint">${hint}</p>`);
    const form = card.querySelector(".gift-sheet__form");
    const input = card.querySelector("#gift-phone");
    const note = card.querySelector(".gift-sheet__note");
    card.querySelector("[data-gift-want]").addEventListener("click", () => {
      card.querySelector(".gift-sheet__ask").hidden = true;
      form.hidden = false;
      input.focus();
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = input.value.replace(/[^0-9+]/g, "");
      if (!/^\+?[0-9]{9,15}$/.test(phone)) {
        note.textContent = L("נראה שחסרות ספרות במספר. בדקו ונסו שוב.", "It looks like some digits are missing. Please check and try again.");
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      const submit = form.querySelector("[type='submit']");
      submit.disabled = true;
      note.textContent = L("שומרים…", "Saving…");
      rpc("gift_lead", { p_token: TOKEN, p_phone: phone, p_slug: o.slug })
        .then((r) => {
          if (!r || !r.ok) throw new Error("lead");
          show(`
            <h2 class="share-sheet__title" id="gift-title">${L(`תודה! רשמנו 🎧`, `Thank you! Got it 🎧`)}</h2>
            <p class="gift-sheet__text">${L(`נעדכן אתכם ברגע שתוכנית המנויים תיפתח.`, `We'll let you know as soon as the subscription plan opens.`)}</p>
            <div class="share-sheet__actions"><button class="btn btn--primary share-sheet__primary" type="button" data-gift-close ${L(`data-gift-first>סגירה<`, `data-gift-first>Close<`)}/button></div>`);
        })
        .catch(() => {
          submit.disabled = false;
          note.textContent = L("לא הצלחנו לשמור. בדקו את החיבור לאינטרנט ונסו שוב.", "We couldn't save it. Please check your internet connection and try again.");
        });
    });
  }

  function play(o) {
    if (!state) {
      // the gift is still being checked (or the check failed): once it is known, the same tap goes on
      (failed ? loadState() : ready).then(() => {
        if (state) play(o);
      });
      return;
    }
    if (state.today === o.slug) {
      o.start();
      // the day may have changed since the page was opened: the server decides
      rpc("gift_pick", { p_token: TOKEN, p_slug: o.slug })
        .then((r) => {
          if (r && r.ok) return;
          o.stop();
          return loadState().then(() => (state && state.can_pick ? confirmPick(o) : offer(o, r && r.reason)));
        })
        .catch(() => {});
      return;
    }
    if (state.can_pick) confirmPick(o);
    else offer(o);
  }

  window.ZkbGift = {
    active: () => on,
    play,
    disable() {
      on = false;
      document.documentElement.classList.remove("gift-mode");
      if (bar) bar.remove();
      bar = null;
      document.querySelectorAll(".content-card--gift").forEach((c) => c.classList.remove("content-card--gift"));
    },
  };

  // the gift link needs no login: the page is shown at once (index.html's guard only checks for a subscriber here)
  const reveal = () => {
    if (on) document.body.classList.remove("auth-pending");
    showBar();
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", reveal);
  else reveal();
  window.addEventListener("load", showBar); // by now js/app.js has built the cards: the chosen episode's name and mark
})();
