"use strict";

/* ---------------------------------------------------------------
   האתר פתוח לכולם (אברהם, 2026-11-12): מי שנכנס בלי מנוי רואה את כל האתר. כשהוא לוחץ על פרק, הפרק מתחיל
   להתנגן, ואחרי טעימה (45 שניות) נעצר ומבקש להעלות את הסיפור לסטטוס בוואטסאפ. רק אחרי שלחצו על כפתור
   השיתוף ובחרו לאן לשתף מופיע הכפתור "העליתי, ממשיכים". זה על אמון: אין דרך לראות סטטוס מדף אינטרנט.
     * פרק אחד ביום (שעון ישראל). אותו פרק אפשר לשמוע שוב באותו יום. לא יותר משניים בשבעה ימים.
     * פרק נוסף: ההודעה על תוכנית המנויים, עם שדה טלפון (guest_lead).
     * "נגן ברצף" לא מוצג. מנוי מחובר רואה את האתר כרגיל (index.html לא מפעיל את המצב הזה).
   הספירה נשמרת במכשיר (localStorage), לא בשרת. קישור המתנה האישי (?g=, js/gift.js) נשאר כמו שהיה, ושם
   הכללים בשרת. הקובץ הזה מציג את עצמו לנגן (js/app.js) באותו ממשק: window.ZkbGift.active() / play().

   window.ZkbGuest.enable()   נקרא מ-index.html כשאין מנוי מחובר
--------------------------------------------------------------- */
(function () {
  if (/[?&]g=[a-f0-9]{20}(?:&|$)/.test(location.search)) return; // the gift link has its own rules (js/gift.js)

  const API = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/";
  const KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz"; // the public key of js/supabase-config.js
  const STORE = "zkb_guest_plays";
  const TEASER = 45; // seconds of an episode before the request
  const LIVE = location.hostname === "abrahamgersten.github.io" && new URLSearchParams(location.search).get("t") !== "1";

  // Remarketing (Avraham, 2026-11-12: "to colour whoever comes into my site"): a Meta Pixel id goes here once he has
  // one. Empty = nothing is loaded and nothing is sent.
  const PIXEL_ID = "";

  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isPhone = isApple || /Android/i.test(navigator.userAgent);
  const canShareFiles = isPhone && typeof navigator.share === "function" && typeof navigator.canShare === "function" && typeof File === "function";

  let on = false;
  let bar = null;
  let root = null;
  let card = null;
  let lastFocus = null;
  let statuses = null; // slug -> { image, text } (s/index.json)
  let fallbackStatus = null;
  let teaser = null; // the episode being tasted: { o, src }
  let asking = false;
  let memory = []; // when the browser keeps nothing (private browsing)

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- what this device already listened to ---------- */
  const dayOf = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(d);
  const today = () => dayOf(new Date());
  function plays() {
    let list = memory;
    try {
      list = JSON.parse(localStorage.getItem(STORE) || "[]");
    } catch (e) {
      // private browsing: the count lives until the page is closed
    }
    const from = dayOf(new Date(Date.now() - 6 * 864e5));
    return (Array.isArray(list) ? list : []).filter((p) => p && typeof p.slug === "string" && typeof p.day === "string" && p.day >= from);
  }
  function state() {
    const list = plays();
    const t = list.find((p) => p.day === today());
    const reason = t ? "day" : list.length >= 2 ? "week" : null;
    return { today: t ? t.slug : null, can_pick: !reason, reason };
  }
  function remember(slug) {
    const list = plays().concat([{ slug, day: today() }]);
    memory = list;
    try {
      localStorage.setItem(STORE, JSON.stringify(list));
    } catch (e) {
      // kept in memory
    }
  }

  function visitor() {
    try {
      let v = localStorage.getItem("zkb_story_visitor"); // the same browser number as the story pages
      if (!v) {
        v = typeof crypto.randomUUID === "function" ? crypto.randomUUID()
          : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
        localStorage.setItem("zkb_story_visitor", v);
      }
      return v;
    } catch (e) {
      return null;
    }
  }
  function rpc(name, body) {
    return fetch(API + name, {
      method: "POST",
      keepalive: true,
      headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => {
      if (!r.ok) throw new Error("guest " + r.status);
      return r.status === 204 ? null : r.json();
    });
  }
  const sent = {};
  function track(event, slug) {
    if (!LIVE || sent[event + ":" + (slug || "")]) return; // once per page for each step of each episode
    sent[event + ":" + (slug || "")] = true;
    rpc("guest_event", { p_visitor: visitor(), p_event: event, p_slug: slug || null }).catch(() => {});
    if (PIXEL_ID && typeof window.fbq === "function" && event !== "enter") window.fbq("trackCustom", "zkb_" + event, { slug: slug || "" });
  }

  function loadPixel() {
    if (!PIXEL_ID || !LIVE || window.fbq) return;
    const n = (window.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
    window._fbq = n; n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }

  /* ---------- the bar at the bottom ---------- */
  function cardOf(slug) {
    const btn = slug && document.querySelector(`[data-share-slug="${slug}"]`);
    return btn ? btn.closest(".content-card") : null;
  }
  function titleOf(slug) {
    const c = cardOf(slug);
    const t = c && c.querySelector(".content-card__title");
    return t ? t.textContent : "";
  }
  function goToEpisode(slug) {
    if (!slug) return;
    const hash = "#ep-" + slug;
    if (location.hash === hash) window.dispatchEvent(new HashChangeEvent("hashchange"));
    else location.hash = hash;
  }

  function showBar() {
    if (!on || !document.body) return;
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "gift-bar";
      bar.setAttribute("role", "status");
      document.body.appendChild(bar);
      bar.addEventListener("click", (e) => {
        if (e.target.closest("[data-gift-go]")) goToEpisode(state().today);
      });
    }
    document.querySelectorAll(".content-card--gift").forEach((c) => c.classList.remove("content-card--gift"));
    const s = state();
    const login = `<a class="gift-bar__btn gift-bar__btn--quiet" href="login.html">כניסת מנויים</a>`;
    if (s.today) {
      const c = cardOf(s.today);
      if (c) c.classList.add("content-card--gift");
      const t = titleOf(s.today);
      bar.innerHTML = `<span class="gift-bar__text">🎧 הפרק שלכם היום${t ? `: <strong>${esc(t)}</strong>` : ""}</span><button class="gift-bar__btn" type="button" data-gift-go>לפרק</button>`;
    } else if (s.reason === "week") {
      bar.innerHTML = `<span class="gift-bar__text">🎧 השבוע כבר האזנתם לשני פרקים. נתראה בשבוע הבא!</span>${login}`;
    } else {
      bar.innerHTML = `<span class="gift-bar__text">🎧 <strong>ברוכים הבאים!</strong> בחרו פרק ולחצו ▶</span>${login}`;
    }
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
        const items = card.querySelectorAll("button:not([disabled]):not([hidden]), a[href], input");
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
    card.innerHTML = `<button class="share-sheet__close" type="button" data-gift-close aria-label="סגירה">✕</button>${html}`;
    card.querySelectorAll("[data-gift-close]").forEach((b) => b.addEventListener("click", close));
    root.hidden = false;
    document.body.style.overflow = "hidden";
    const first = card.querySelector("[data-gift-first]") || card.querySelector("button");
    if (first) first.focus();
  }
  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    asking = false;
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  /* ---------- the request after the taste: put the story on your status ---------- */
  fetch("s/index.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      const stories = ((j && j.stories) || []).filter((s) => s.status);
      statuses = Object.fromEntries(stories.map((s) => [s.slug, s.status]));
      fallbackStatus = stories.length ? { slug: stories[0].slug, ...stories[0].status } : null;
    })
    .catch(() => {});
  // the status picture of the episode itself; an episode without one (a joke, a serial chapter) shares a story's picture
  function statusOf(slug) {
    const s = statuses && statuses[slug] ? { slug, ...statuses[slug] } : fallbackStatus;
    return s ? { ...s, text: s.text.replace(/([?&]c=)site-status/g, "$1app-status") } : null;
  }

  function copyText(text) {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") return navigator.clipboard.writeText(text).then(() => true, () => false);
    } catch (e) {
      // no clipboard here
    }
    return Promise.resolve(false);
  }

  function ask(o) {
    if (asking) return;
    const st = statusOf(o.slug);
    if (!st) {
      // the pictures did not load (no network?): nothing to share, so nothing is asked
      unlock(o);
      return;
    }
    asking = true;
    track("ask", o.slug);
    const name = `${st.slug}-status.jpg`;
    let ready = null;
    const file = !canShareFiles ? Promise.resolve(null)
      : fetch(st.image)
        .then((r) => (r.ok ? r.blob() : null))
        .then((blob) => {
          if (!blob) return null;
          const f = new File([blob], name, { type: blob.type || "image/jpeg" });
          return navigator.canShare({ files: [f] }) ? f : null;
        })
        .catch(() => null);
    const steps = canShareFiles
      ? ["לוחצים \"להעלות לסטטוס\" ובוחרים וואטסאפ.", "בוחרים \"הסטטוס שלי\" בראש הרשימה.",
        isApple ? "מדביקים בכיתוב את המלל עם הקישור. הוא כבר הועתק." : "המלל עם הקישור מצורף לבד."]
      : ["מורידים את התמונה.", "מעבירים אותה לטלפון ומעלים לסטטוס בוואטסאפ.", "מדביקים בכיתוב את המלל עם הקישור. הוא כבר הועתק."];
    const download = `<a class="btn btn--primary share-sheet__primary" href="${esc(st.image)}" download="${esc(name)}" data-guest-download data-gift-first>הורדת התמונה</a>`;
    show(`
      <h2 class="share-sheet__title" id="gift-title">נהנים מהסיפור? 💛</h2>
      <p class="gift-sheet__text">הסיפורים כאן מגיעים לעוד בתים בזכות הורים שמספרים עליהם. <strong>העלו את הסיפור לסטטוס שלכם</strong>, כדי שעוד ילדים ישמעו סיפור טוב לפני השינה, והמשיכו להאזין.</p>
      <div class="share-sheet__status">
        <img class="share-sheet__preview" src="${esc(st.image)}" alt="תמונת הסטטוס" width="1080" height="1920">
        <ol class="share-sheet__steps">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      </div>
      <div class="share-sheet__actions" data-guest-share>
        ${canShareFiles ? `<button class="btn btn--primary share-sheet__primary" type="button" data-guest-go data-gift-first disabled>רגע, מכינים את התמונה…</button>` : download}
      </div>
      <div class="share-sheet__actions guest-sheet__after" data-guest-after hidden>
        <button class="btn btn--primary share-sheet__primary" type="button" data-guest-continue>העליתי, ממשיכים לסיפור</button>
      </div>
      <p class="share-sheet__note" role="status" aria-live="polite"></p>
      <p class="gift-sheet__hint">הפרק הזה יהיה הפרק שלכם להיום, ואפשר לשמוע אותו שוב כמה שרוצים.</p>`);
    const note = card.querySelector(".share-sheet__note");
    const after = card.querySelector("[data-guest-after]");
    const shareBox = card.querySelector("[data-guest-share]");
    let tries = 0;
    // "only after they tap the button and WhatsApp" (Avraham): the way on appears once the share went out
    const shared = () => {
      track("share", o.slug);
      after.hidden = false;
      note.textContent = "תודה ששיתפתם! ❤️";
      after.querySelector("button").focus();
    };
    const toDownload = () => {
      shareBox.innerHTML = download;
      wireDownload();
    };
    function wireDownload() {
      const a = shareBox.querySelector("[data-guest-download]");
      if (a) a.addEventListener("click", () => {
        copyText(st.text);
        setTimeout(shared, 600);
      });
    }
    wireDownload();
    const go = card.querySelector("[data-guest-go]");
    if (go) {
      file.then((f) => {
        if (!go.isConnected) return;
        ready = f;
        if (f) {
          go.disabled = false;
          go.textContent = "להעלות לסטטוס";
        } else toDownload(); // the picture did not come, or this phone does not share files
      });
      go.addEventListener("click", async () => {
        const copied = copyText(st.text); // on this tap, before the share menu (an iPhone drops the text that comes with a file)
        const attempts = isApple ? [{ files: [ready] }] : [{ files: [ready], text: st.text }, { files: [ready] }];
        for (const data of attempts) {
          try {
            await navigator.share(data);
            shared();
            return;
          } catch (err) {
            if (err && err.name === "AbortError") return; // the share menu was closed: nothing was shared
            if (err && err.name === "NotAllowedError") break;
          }
        }
        tries += 1;
        await copied;
        if (tries >= 2) toDownload(); // the share menu will not open on this phone: the picture can be saved instead
        else note.textContent = "השיתוף לא נפתח. נסו ללחוץ שוב.";
      });
    }
    card.querySelector("[data-guest-continue]").addEventListener("click", () => unlock(o));
  }

  function unlock(o) {
    remember(o.slug);
    track("unlock", o.slug);
    teaser = null;
    close();
    showBar();
    if (o.audio) o.audio.play().catch(() => {}); // from the tap on "continue"
  }

  // the taste ends here: the episode waits, and the request comes up
  function onTime(e) {
    if (!on || !teaser) return;
    const a = e.target;
    if (a.src !== teaser.src) return;
    const limit = a.duration > 0 ? Math.min(TEASER, a.duration * 0.4) : TEASER;
    if (a.currentTime < limit) return;
    a.pause();
    if (a.currentTime > limit + 1) a.currentTime = limit;
    ask(teaser.o);
  }
  const wired = new WeakSet();
  function watch(audio) {
    if (!audio || wired.has(audio)) return;
    wired.add(audio);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("seeking", onTime);
  }

  /* ---------- another episode: the subscription plan (the wording of js/gift.js, Avraham 2026-11-10) ---------- */
  function offer(o, s) {
    track("offer", o.slug);
    const t = s.today ? titleOf(s.today) : "";
    const hint = s.reason === "day"
      ? `היום כבר בחרתם פרק${t ? `: "${esc(t)}"` : ""}. אפשר לשמוע אותו שוב כמה שרוצים, ומחר לבחור פרק חדש.`
      : "השבוע כבר האזנתם לשני פרקים. בשבוע הבא אפשר לבחור שוב.";
    show(`
      <h2 class="share-sheet__title" id="gift-title">רוצים להאזין גם לפרק הזה?</h2>
      <p class="gift-sheet__text">כדי להאזין לפרק הזה ולכל הפרקים באתר, עומדת להיפתח <strong>תוכנית מנויים</strong>.</p>
      <p class="gift-sheet__text"><strong>רוצים שנפנה אליכם כשהיא תהיה זמינה לציבור?</strong></p>
      <div class="share-sheet__actions gift-sheet__ask">
        <button class="btn btn--primary share-sheet__primary" type="button" data-gift-want data-gift-first>כן, עדכנו אותי</button>
        <button class="share-sheet__link" type="button" data-gift-close>לא עכשיו</button>
      </div>
      <form class="gift-sheet__form" hidden novalidate>
        <label class="gift-sheet__label" for="gift-phone">מספר הטלפון שלכם</label>
        <input class="gift-sheet__input" id="gift-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="050-1234567" aria-describedby="gift-phone-note">
        <p class="share-sheet__note gift-sheet__note" id="gift-phone-note" role="status" aria-live="polite"></p>
        <div class="share-sheet__actions">
          <button class="btn btn--primary share-sheet__primary" type="submit">שמירה</button>
          <button class="share-sheet__link" type="button" data-gift-close>ביטול</button>
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
        note.textContent = "נראה שחסרות ספרות במספר. בדקו ונסו שוב.";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      const submit = form.querySelector("[type='submit']");
      submit.disabled = true;
      note.textContent = "שומרים…";
      rpc("guest_lead", { p_phone: phone, p_slug: o.slug, p_visitor: visitor() })
        .then((r) => {
          if (!r || !r.ok) throw new Error("lead");
          if (PIXEL_ID && typeof window.fbq === "function") window.fbq("track", "Lead");
          show(`
            <h2 class="share-sheet__title" id="gift-title">תודה! רשמנו 🎧</h2>
            <p class="gift-sheet__text">נעדכן אתכם ברגע שתוכנית המנויים תיפתח.</p>
            <div class="share-sheet__actions"><button class="btn btn--primary share-sheet__primary" type="button" data-gift-close data-gift-first>סגירה</button></div>`);
        })
        .catch(() => {
          submit.disabled = false;
          note.textContent = "לא הצלחנו לשמור. בדקו את החיבור לאינטרנט ונסו שוב.";
        });
    });
  }

  // called by the player's button (js/app.js) instead of playing straight away
  function play(o) {
    const s = state();
    if (s.today === o.slug) {
      teaser = null;
      o.start();
      return;
    }
    if (!s.can_pick) {
      offer(o, s);
      return;
    }
    watch(o.audio);
    o.start(); // the taste
    teaser = { o, src: o.audio ? o.audio.src : "" };
    track("teaser", o.slug);
  }

  const api = { active: () => on, play, disable() {} };

  function enable() {
    if (on) return;
    on = true;
    window.ZkbGift = api;
    document.documentElement.classList.add("gift-mode", "guest-mode");
    loadPixel();
    track("enter");
    showBar();
    window.addEventListener("load", showBar); // by now js/app.js has built the cards
  }

  window.ZkbGuest = { enable };
  if (window.zkbGuestOn) enable(); // index.html decided before this file ran
})();
