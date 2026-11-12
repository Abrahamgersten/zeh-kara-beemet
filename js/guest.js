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
  // Avraham, 2026-11-12 (night): the regular link is the login door again, and all of this (the taste, the status
  // request, the fades) works on the gift link only. There js/gift.js keeps the rules (one episode a day, two a week,
  // on the server) and calls taste() here; whether today's status was posted is kept in this browser (on trust).
  const GIFT = /[?&]g=[a-f0-9]{20}(?:&|$)/.test(location.search);
  const GIFT_SHARED = "zkb_gift_shared";

  const API = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/";
  const KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz"; // the public key of js/supabase-config.js
  const EN = document.documentElement.lang === "en"; // the English site (en/index.html) loads this same file
  const L = (he, en) => (EN ? en : he);
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
    return { today: t ? t.slug : null, shared: !!(t && t.shared !== false), can_pick: !reason, reason };
  }
  function save(list) {
    memory = list;
    try {
      localStorage.setItem(STORE, JSON.stringify(list));
    } catch (e) {
      // kept in memory
    }
  }
  // Avraham, 2026-11-12 (evening): the episode of the day is fixed when it is chosen, before any listening, so nobody
  // tastes one episode after another; "shared" opens the rest of it. One a day, two in seven days.
  function remember(slug) {
    const list = plays();
    if (!list.some((p) => p.day === today())) save(list.concat([{ slug, day: today(), shared: false }]));
  }
  function markShared() {
    save(plays().map((p) => (p.day === today() ? { ...p, shared: true } : p)));
  }
  let giftSharedNow = null; // when the browser keeps nothing
  function giftShared(slug) {
    const key = today() + ":" + slug;
    if (giftSharedNow === key) return true;
    try {
      return localStorage.getItem(GIFT_SHARED) === key;
    } catch (e) {
      return false;
    }
  }
  function setGiftShared(slug) {
    giftSharedNow = today() + ":" + slug;
    try {
      localStorage.setItem(GIFT_SHARED, giftSharedNow);
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
    const login = ""; // "כניסת מנויים" sits at the bottom of the page (footerLogin), not in the bar (Avraham, 2026-11-12)
    if (s.today) {
      const c = cardOf(s.today);
      if (c) c.classList.add("content-card--gift");
      const t = titleOf(s.today);
      bar.innerHTML = `<span class="gift-bar__text">${L(`🎧 הפרק שלכם היום`, `🎧 Your episode for today`)}${t ? `: <strong>${esc(t)}</strong>` : ""}</span><button class="gift-bar__btn" type="button" ${L(`data-gift-go>לפרק<`, `data-gift-go>Go to episode<`)}/button>`;
    } else if (s.reason === "week") {
      bar.innerHTML = `<span class="gift-bar__text">${L(`🎧 השבוע כבר האזנתם לשני פרקים. נתראה בשבוע הבא!`, `🎧 You've already heard two episodes this week. See you next week!`)}</span>${login}`;
    } else {
      bar.innerHTML = `<span class="gift-bar__text">${L(`🎧 <strong>ברוכים הבאים!</strong> בחרו פרק ולחצו ▶`, `🎧 <strong>Welcome!</strong> Pick an episode and press ▶`)}</span>${login}`;
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
    if (weekly) return weekly;
    const s = statuses && statuses[slug] ? { slug, ...statuses[slug] } : fallbackStatus;
    return s ? { ...s, text: s.text.replace(/([?&]c=)site-status/g, "$1app-status") } : null;
  }
  // Avraham, 2026-11-12: the status asked for is the one of the "סטטוס" bot, whatever episode was tasted. Thursday and
  // Friday: the "מה בפרשה" banner video with the caption of its bot; the other days: Bezalel's trailer of the week's
  // story (or the story's banner video) with the caption of the listening bot. guest_status() picks (migration 0028);
  // the material is written every hour by Tools/wa_cloud_bot/sync_recording.py. Hebrew only: the bots speak Hebrew.
  // Nothing came back: the status picture of the episode, as before.
  let weekly = null;
  const media = {}; // address -> the file, fetched once (the video starts downloading when the taste starts)
  function mediaFile(st) {
    const url = st.video || st.image;
    if (!canShareFiles) return Promise.resolve(null);
    if (!media[url]) {
      const name = `${st.slug}-status.${st.video ? "mp4" : "jpg"}`;
      media[url] = fetch(url)
        .then((r) => (r.ok ? r.blob() : null))
        .then((blob) => {
          if (!blob) return null;
          const f = new File([blob], name, { type: st.video ? "video/mp4" : blob.type || "image/jpeg" });
          return navigator.canShare({ files: [f] }) ? f : null;
        })
        .catch(() => null);
      media[url].then((f) => { if (!f) delete media[url]; }); // a failed download is tried again next time
    }
    return media[url];
  }
  function loadWeekly() {
    if (EN) return;
    rpc("guest_status", {})
      .then((m) => {
        if (!m || !m.text || !m.slug) return;
        const arm = /[89ab]/i.test((visitor() || "0").slice(-1)) ? "b" : "a"; // his two banner designs, a steady one per device
        const video = m.video || (m.videos || {})[arm] || null;
        const image = (m.images || {})[arm] || m.image || null;
        if (!video && !image) return;
        weekly = { slug: m.slug, video, image, text: m.text };
      })
      .catch(() => {});
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
    const name = `${st.slug}-status.${st.video ? "mp4" : "jpg"}`;
    const src = st.video || st.image;
    const what = st.video ? L("הסרטון", "the video") : L("התמונה", "the picture");
    let ready = null;
    const file = mediaFile(st);
    const steps = EN
      ? (canShareFiles
        ? ["Tap \"Share to status\" and choose WhatsApp.", "Choose \"My status\" at the top of the list.",
          isApple ? "Paste the text with the link into the caption. It's already copied." : "The text with the link is attached for you."]
        : [`Tap "Share to status": ${what} is saved to this computer and the text is copied.`, "Post it to your WhatsApp status (from your phone, or from WhatsApp on the computer).", "Paste the text with the link into the caption."])
      : canShareFiles
      ? ["לוחצים \"שיתוף הסטטוס\" ובוחרים וואטסאפ.", "בוחרים \"הסטטוס שלי\" בראש הרשימה.",
        isApple ? "מדביקים בכיתוב את המלל עם הקישור. הוא כבר הועתק." : "המלל עם הקישור מצורף לבד."]
      : [`לוחצים "שיתוף הסטטוס": ${what} נשמר במחשב והמלל מועתק.`, "מעלים לסטטוס בוואטסאפ (מהטלפון, או מוואטסאפ במחשב).", "מדביקים בכיתוב את המלל עם הקישור."];
    const download = `<a class="btn btn--primary share-sheet__primary" href="${esc(src)}" download="${esc(name)}" data-guest-download data-gift-first>${L(`שיתוף הסטטוס`, `Share to status`)}</a>`;
    show(`
      <h2 class="share-sheet__title" id="gift-title">${L(`איזה כיף שאתם מקשיבים! 💛`, `So glad you're listening! 💛`)}</h2>
      <!-- the wording is Avraham's own, 2026-11-12 --><p class="gift-sheet__text">${L(`אנחנו לא מפרסמים. הסיפורים עוברים מבית לבית, מהורה להורה. <strong>העלו אותו לסטטוס שלכם</strong>, ועוד ילד ילך לישון הלילה עם סיפור טוב. מיד אחר כך ממשיכים בדיוק מאיפה שעצרנו.`, `We don't advertise. The stories pass from home to home, from parent to parent. <strong>Post it to your WhatsApp status</strong>, and one more child will go to sleep tonight with a good story. Right after that we pick up exactly where we stopped.`)}</p>
      <div class="share-sheet__status${weekly ? " guest-sheet__status--banner" : ""}">
        ${st.video && !st.image
          ? `<video class="share-sheet__preview" src="${esc(st.video)}" muted autoplay loop playsinline preload="metadata" ${L(`aria-label="סרטון הסטטוס"`, `aria-label="The status video"`)} width="1080" height="1920"></video>`
          : `<img class="share-sheet__preview" src="${esc(st.image)}" ${L(`alt="תמונת הסטטוס"`, `alt="The status picture"`)} width="1080" height="1920">`}
        <ol class="share-sheet__steps">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      </div>
      <div class="share-sheet__actions" data-guest-share>
        ${canShareFiles ? `<button class="btn btn--primary share-sheet__primary" type="button" data-guest-go data-gift-first disabled>${L(`רגע, מכינים את ${what}…`, `One moment, getting ${what} ready…`)}</button>` : download}
      </div>
      <div class="share-sheet__actions guest-sheet__after" data-guest-after hidden>
        <button class="btn btn--primary share-sheet__primary" type="button" data-guest-continue>${L(`העליתי, ממשיכים לסיפור`, `I posted it, on with the story`)}</button>
      </div>
      <p class="share-sheet__note" role="status" aria-live="polite"></p>
      <p class="gift-sheet__hint">${L(`הפרק הזה יהיה הפרק שלכם להיום, ואפשר לשמוע אותו שוב כמה שרוצים.`, `This will be your episode for today, and you can listen to it again as many times as you like.`)}</p>`);
    const note = card.querySelector(".share-sheet__note");
    const after = card.querySelector("[data-guest-after]");
    const shareBox = card.querySelector("[data-guest-share]");
    let tries = 0;
    // "only after they tap the button and WhatsApp" (Avraham): the way on appears once the share went out
    const shared = () => {
      track("share", o.slug);
      after.hidden = false;
      note.textContent = L("תודה ששיתפתם! ❤️", "Thank you for sharing! ❤️");
      after.querySelector("button").focus();
    };
    const toDownload = () => {
      shareBox.innerHTML = download;
      wireDownload();
    };
    function wireDownload() {
      const a = shareBox.querySelector("[data-guest-download]");
      if (a) a.addEventListener("click", (e) => {
        e.preventDefault();
        copyText(st.text);
        note.textContent = L("רגע…", "One moment…");
        fetch(src)
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("file"))))
          .then((blob) => {
            const u = URL.createObjectURL(blob);
            const t = document.createElement("a");
            t.href = u;
            t.download = name;
            document.body.appendChild(t);
            t.click();
            t.remove();
            setTimeout(() => URL.revokeObjectURL(u), 60000);
            shared();
            note.textContent = L(`${what} נשמר והמלל הועתק. העלו לסטטוס בוואטסאפ והדביקו את המלל. תודה! ❤️`, `Saved, and the text is copied. Post it to your WhatsApp status and paste the text. Thank you! ❤️`);
          })
          .catch(() => {
            note.textContent = L("לא הצלחנו להכין את הקובץ. בדקו את החיבור לאינטרנט ונסו שוב.", "We couldn't get the file ready. Please check your internet connection and try again.");
          });
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
          go.textContent = L("שיתוף הסטטוס", "Share to status");
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
        else note.textContent = L("השיתוף לא נפתח. נסו ללחוץ שוב.", "Sharing didn't open. Try tapping again.");
      });
    }
    card.querySelector("[data-guest-continue]").addEventListener("click", () => unlock(o));
  }

  // Avraham, 2026-11-12: the sound goes down over one second before the request, and comes up over one second after it.
  // (An iPhone does not let a page change the volume: there the episode simply stops and starts.)
  const FADE = 1; // seconds
  let fadeTimer = null;
  let fullVolume = 1;
  function ramp(a, from, to, done) {
    clearInterval(fadeTimer);
    const t0 = performance.now();
    const set = (v) => { try { a.volume = Math.min(1, Math.max(0, v)); } catch (e) { /* no volume control here */ } };
    set(from);
    fadeTimer = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / (FADE * 1000));
      set(from + (to - from) * k);
      if (k >= 1) {
        clearInterval(fadeTimer);
        fadeTimer = null;
        if (done) done();
      }
    }, 40);
  }

  function unlock(o) {
    if (GIFT) setGiftShared(o.slug);
    else markShared();
    track("unlock", o.slug);
    teaser = null;
    close();
    if (!GIFT) showBar();
    if (o.audio) {
      ramp(o.audio, 0, fullVolume, null);
      o.audio.play().catch(() => {}); // from the tap on "continue"
    }
  }

  const limitOf = (a) => (a.duration > 0 ? Math.min(TEASER, a.duration * 0.4) : TEASER);
  let fading = false;
  // the taste ends here: the sound fades, the episode waits, and the request comes up
  function onTime(e) {
    if ((!on && !GIFT) || !teaser || fading) return;
    const a = e.target;
    if (a.src !== teaser.src) return;
    const limit = limitOf(a);
    if (a.currentTime < limit - FADE) return;
    const o = teaser.o;
    const stop = () => {
      fading = false;
      a.pause();
      if (a.currentTime > limit + 0.5) a.currentTime = limit;
      try { a.volume = fullVolume; } catch (err) { /* no volume control here */ }
      if (teaser && teaser.o === o) ask(o);
    };
    if (a.currentTime >= limit) { // dragged past the taste, or came back to an episode that is waiting
      clearInterval(fadeTimer);
      stop();
      return;
    }
    if (a.paused) return;
    fading = true;
    fullVolume = a.volume > 0 ? a.volume : 1;
    ramp(a, fullVolume, 0, stop);
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
      ? `${L(`היום כבר בחרתם פרק${t ? `: "${esc(t)}"` : ""}. אפשר לשמוע אותו שוב כמה שרוצים, ומחר לבחור פרק חדש.`, `You already picked an episode today${t ? `: "${esc(t)}"` : ""}. You can listen to it again as many times as you like, and pick a new one tomorrow.`)}`
      : L("השבוע כבר האזנתם לשני פרקים. בשבוע הבא אפשר לבחור שוב.", "You've already heard two episodes this week. You can pick again next week.");
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
      rpc("guest_lead", { p_phone: phone, p_slug: o.slug, p_visitor: visitor() })
        .then((r) => {
          if (!r || !r.ok) throw new Error("lead");
          if (PIXEL_ID && typeof window.fbq === "function") window.fbq("track", "Lead");
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

  // "is this the episode you choose?" (the wording of the gift link, js/gift.js): said before any listening, so it is
  // clear that there is one episode a day (Avraham, 2026-11-12: "it made clear, before I listened, that I get one")
  function confirmPick(o) {
    show(`
      <h2 class="share-sheet__title" id="gift-title">${L(`🎧 זה הפרק שבחרתם?`, `🎧 Is this the episode you want?`)}</h2>
      <p class="share-sheet__lead gift-sheet__lead">${esc(o.title || titleOf(o.slug))}</p>
      <p class="gift-sheet__text">${L(`אפשר להאזין כאן לפרק אחד ביום, ועד שני פרקים בשבוע. אחרי שבוחרים אי אפשר להחליף, אבל אפשר לשמוע אותו שוב היום כמה שרוצים.`, `You can listen to one episode a day here, and up to two a week. Once you choose, you can't switch, but you can listen to it again today as many times as you like.`)}</p>
      <div class="share-sheet__actions">
        <button class="btn btn--primary share-sheet__primary" type="button" data-guest-yes data-gift-first>${L(`כן, להאזין לפרק הזה`, `Yes, play this episode`)}</button>
        <button class="share-sheet__link" type="button" data-gift-close>${L(`רגע, אבחר פרק אחר`, `Wait, I'll pick a different one`)}</button>
      </div>`);
    card.querySelector("[data-guest-yes]").addEventListener("click", () => {
      close();
      remember(o.slug);
      showBar();
      taste(o); // from the tap itself (a phone plays only from a tap)
    });
  }

  // the chosen episode until its status is posted: it plays up to the taste, then the request
  function taste(o) {
    watch(o.audio);
    if (teaser && teaser.o.slug === o.slug && o.audio && o.audio.src === teaser.src && o.audio.currentTime >= limitOf(o.audio) - 0.3) {
      teaser.o = o;
      ask(o); // already waiting at the end of the taste
      return;
    }
    o.start();
    teaser = { o, src: o.audio ? o.audio.src : "" };
    const st = statusOf(o.slug);
    if (st) mediaFile(st); // ready by the time the request comes up
    track("teaser", o.slug);
  }

  // called by the player's button (js/app.js) instead of playing straight away
  function play(o) {
    const s = state();
    if (s.today === o.slug) {
      if (s.shared) {
        teaser = null;
        o.start();
      } else taste(o);
      return;
    }
    if (!s.can_pick) {
      offer(o, s);
      return;
    }
    confirmPick(o);
  }

  function footerLogin() {
    const box = document.querySelector(".site-footer__inner");
    if (!on || !box || box.querySelector(".site-footer__login")) return;
    const a = document.createElement("a");
    a.className = "site-footer__login";
    a.href = "login.html";
    a.textContent = L("כניסת מנויים", "Subscriber login");
    box.appendChild(a);
  }

  const api = { active: () => on, play, disable() {} };

  function enable() {
    if (on || GIFT) return;
    on = true;
    window.ZkbGift = api;
    document.documentElement.classList.add("gift-mode", "guest-mode");
    loadPixel();
    loadWeekly();
    track("enter");
    showBar();
    footerLogin();
    window.addEventListener("load", showBar); // by now js/app.js has built the cards
    window.addEventListener("load", footerLogin);
  }

  // the look of what this file adds (kept here: css/style.css is shared with work in progress)
  const css = document.createElement("style");
  css.textContent = `
    .share-sheet .guest-sheet__status--banner { grid-template-columns: 1fr; justify-items: center; }
    .share-sheet .guest-sheet__status--banner .share-sheet__preview { width: min(100%, 250px); aspect-ratio: auto; object-fit: contain; }
    .share-sheet .guest-sheet__status--banner .share-sheet__steps { justify-self: stretch; }
    .site-footer__login { display: inline-block; margin-top: 0.9rem; padding: 0.45rem 0.2rem; color: inherit; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }`;
  document.head.appendChild(css);

  if (GIFT) loadWeekly();
  // taste / shared: for js/gift.js, the chosen episode of the gift
  window.ZkbGuest = { enable, taste, shared: giftShared };
  if (window.zkbGuestOn) enable(); // index.html decided before this file ran
})();
