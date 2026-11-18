"use strict";

/* ---------------------------------------------------------------
   שיתוף בהודעה או בסטטוס (אברהם, 2026-10-19: "כשלוחצים על שיתוף הסיפור, שישאל אם לשתף
   כהודעה או לסטטוס; בסטטוס - התמונה של הסיפור עם מלל שמותאם לסטטוס").
   רק לסיפורים שיש להם תמונת סטטוס (tools/status_shares.json -> assets/images/status/<slug>.jpg).
   משמש את כפתור השיתוף בכרטיסים באתר (js/app.js) ובדף הסיפור (js/story.js).

   window.ZkbShareSheet.choose(o)  חלון הבחירה: "בהודעה" (o.onMessage - השיתוף הקיים) או "בסטטוס".
   window.ZkbShareSheet.invite(o)  אותה בחירה, עם הזמנה ("אהבתם את הסיפור?") - בסוף כל הקלטה, באתר ובדף הסיפור.
   o = { title, slug, status: { image, text } (בלי status: רק "בהודעה"), isStory, onMessage(), track(event) }

   אין דרך לפרסם סטטוס ישירות מדף אינטרנט. מה שאפשר: לפתוח את תפריט השיתוף של הטלפון עם
   התמונה, ובוואטסאפ "הסטטוס שלי" מופיע בראש רשימת הנמענים. המלל (עם הקישור להאזנה) מצורף
   באנדרואיד ככיתוב; באייפון וואטסאפ משמיט מלל שמגיע עם קובץ, ולכן הוא מועתק מראש להדבקה.
   במחשב (אין שיתוף קבצים): הורדת התמונה והעתקת המלל.

   window.ZkbShareSheet.shareVideo(o)  בדיחה נשלחת כסרטון: התמונה שלה עם ההקלטה, והמלל ככיתוב (אברהם, 2026-11-03).
   window.ZkbShareSheet.warmVideo(url, slug)  הסרטון יורד כבר כשמנגנים את הבדיחה, כדי שהשיתוף ייפתח מיד בלחיצה.
   o = { title, slug, video, poster, text, onFallback() } - onFallback: במחשב, או כשהסרטון לא ירד.
--------------------------------------------------------------- */
(function () {
  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // סטטוס מעלים מהטלפון. במחשב (גם כשיש לדפדפן תפריט שיתוף, כמו כרום ב-Windows) - הורדה והעתקה.
  const isPhone = isApple || /Android/i.test(navigator.userAgent);
  const canShareFiles = isPhone && typeof navigator.share === "function" && typeof navigator.canShare === "function" && typeof File === "function";

  const HE = {
    chooseTitle: "איך לשתף את הסיפור?",
    message: "בהודעה",
    messageSub: "לחבר, למשפחה או לקבוצה, עם קישור להאזנה",
    status: "בסטטוס",
    statusSub: "תמונה עם מלל קצר וקישור להאזנה",
    statusTitle: "שיתוף בסטטוס",
    inviteTitle: "אהבתם את הסיפור?",
    inviteText: "שתפו אותו, ועוד משפחות יוכלו להקשיב לו ❤️",
    inviteTitleRec: "אהבתם את ההקלטה?",
    inviteTextRec: "שתפו אותה, ועוד משפחות יוכלו להקשיב לה ❤️",
    stepsPhone: [
      "לוחצים \"לשיתוף בסטטוס\" ובוחרים וואטסאפ.",
      "בוחרים \"הסטטוס שלי\" בראש הרשימה.",
      isApple
        ? "מדביקים בכיתוב את המלל עם הקישור. הוא כבר הועתק."
        : "המלל עם הקישור מצורף לבד. אם חסר, מדביקים (הוא הועתק).",
    ],
    stepsDesktop: [
      "מורידים את התמונה.",
      "מעבירים אותה לטלפון ומעלים לסטטוס בוואטסאפ.",
      "מדביקים בכיתוב את המלל עם הקישור. הוא כבר הועתק.",
    ],
    shareStatus: "לשיתוף בסטטוס",
    preparing: "רגע, מכינים את התמונה…",
    preparingStatusVideo: "רגע, מכינים את הסרטון…",
    download: "הורדת התמונה",
    copy: "העתקת המלל",
    copied: "המלל הועתק ✓",
    back: "חזרה",
    close: "סגירה",
    later: "אולי אחר כך",
    thanks: "תודה ששיתפתם! ❤️",
    failed: "השיתוף לא נפתח. נסו ללחוץ שוב.",
    copyFailed: "לא הצלחנו להעתיק. זה המלל:",
    preview: (t) => `תמונת הסטטוס של ${t}`,
    videoTitle: "שיתוף הבדיחה",
    videoSteps: ["לוחצים \"לשליחה\" ובוחרים וואטסאפ.", "בוחרים למי לשלוח. הבדיחה נשלחת כסרטון, עם המלל."],
    videoStepsApple: ["לוחצים \"לשליחה\" ובוחרים וואטסאפ.", "בוחרים למי לשלוח. הבדיחה נשלחת כסרטון.", "מדביקים בכיתוב את המלל. הוא כבר הועתק."],
    shareVideo: "📤 לשליחה",
    preparingVideo: "רגע, מכינים את הבדיחה…",
    videoAsText: "שליחה בלי הסרטון",
    videoPreview: (t) => `התמונה של ${t}`,
  };
  const EN = {
    chooseTitle: "How would you like to share?",
    message: "As a message",
    messageSub: "To a friend, family or a group, with a link to listen",
    status: "To your status",
    statusSub: "A picture with a short text and a link to listen",
    statusTitle: "Share to your status",
    inviteTitle: "Enjoyed the story?",
    inviteText: "Share it so more families can listen ❤️",
    inviteTitleRec: "Enjoyed it?",
    inviteTextRec: "Share it so more families can listen ❤️",
    stepsPhone: [
      "Tap \"Share to status\" and choose WhatsApp.",
      "Pick \"My status\" at the top of the list.",
      isApple
        ? "Paste the text with the link into the caption. It's already copied."
        : "The text with the link is added for you. If it's missing, paste it (it's copied).",
    ],
    stepsDesktop: [
      "Download the picture.",
      "Send it to your phone and post it to your WhatsApp status.",
      "Paste the text with the link into the caption. It's already copied.",
    ],
    shareStatus: "Share to status",
    preparing: "One moment, preparing the picture…",
    preparingStatusVideo: "One moment, preparing the video…",
    download: "Download the picture",
    copy: "Copy the text",
    copied: "Text copied ✓",
    back: "Back",
    close: "Close",
    later: "Maybe later",
    thanks: "Thanks for sharing! ❤️",
    failed: "The share menu didn't open. Please tap again.",
    copyFailed: "Couldn't copy. Here's the text:",
    preview: (t) => `Status picture: ${t}`,
    videoTitle: "Share the joke",
    videoSteps: ["Tap \"Send\" and choose WhatsApp.", "Pick who gets it. The joke goes as a video, with the text."],
    videoStepsApple: ["Tap \"Send\" and choose WhatsApp.", "Pick who gets it. The joke goes as a video.", "Paste the text into the caption. It's already copied."],
    shareVideo: "📤 Send",
    preparingVideo: "One moment, preparing the joke…",
    videoAsText: "Send without the video",
    videoPreview: (t) => `The picture of ${t}`,
  };
  const T = document.documentElement.lang === "en" ? EN : HE;

  let root = null;
  let card = null;
  let lastFocus = null;
  let current = null; // { o, file: Promise<File|null>, mode }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function ensure() {
    if (root) return;
    root = document.createElement("div");
    root.className = "lightbox share-sheet";
    root.hidden = true;
    root.innerHTML = `<div class="share-sheet__card" role="dialog" aria-modal="true" aria-labelledby="share-sheet-title"></div>`;
    card = root.firstElementChild;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => {
      if (e.target === root) close();
      const act = e.target.closest("[data-act]");
      if (act) handle(act.dataset.act, act, e);
    });
    document.addEventListener("keydown", (e) => {
      if (root.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") trapFocus(e);
    });
  }

  function trapFocus(e) {
    const items = card.querySelectorAll("button:not([disabled]), a[href]");
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

  // Avraham, 2026-11-18: the status shared from a story card / story page is the same as the "סטטוס" bot's:
  // Thursday and Friday the "מה בפרשה" banner video with its caption, the other days Bezalel's weekly trailer with the
  // caption of the listening bot (guest_status, migration 0028, written hourly by sync_recording.py). Hebrew only.
  // Nothing came back: the status picture of the story, as before.
  let weekly = null;
  if (document.documentElement.lang !== "en") {
    const key = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
    fetch("https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/guest_status", {
      method: "POST", headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" }, body: "{}",
    }).then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m || !m.text || !m.slug) return;
        let arm = "a";
        try { arm = /[89ab]/i.test((localStorage.getItem("zkb_story_visitor") || "0").slice(-1)) ? "b" : "a"; } catch (e) { /* a */ }
        const video = m.video || (m.videos || {})[arm] || null;
        const image = (m.images || {})[arm] || m.image || null;
        if (video || image) weekly = { slug: m.slug, video, image, text: m.text };
        if (warmWanted) warm();
      })
      .catch(() => {});
  }
  const mediaUrl = (st) => st.video || st.image;
  const mediaName = (o, st) => `${st.slug || o.slug || "story"}-status.${st.video ? "mp4" : "jpg"}`;
  function previewTag(st, cls, alt, w, h) {
    return st.image
      ? `<img class="${cls}" src="${esc(st.image)}" alt="${esc(alt)}" width="${w}" height="${h}">`
      : `<video class="${cls}" src="${esc(st.video)}" muted autoplay loop playsinline preload="metadata" aria-label="${esc(alt)}" width="${w}" height="${h}"></video>`;
  }

  // התמונה יורדת כבר כשהחלון נפתח: navigator.share חייב לרוץ מיד עם הלחיצה.
  // Avraham, 2026-11-18: "it takes too long to load the status at the button, I am losing conversions". The weekly video
  // was 15 MB and the button stayed closed until all of it was on the phone. Now (1) the site's copy is light (3.5 MB,
  // Tools/wa_cloud_bot/sync_recording.py light_copy), (2) it starts downloading before the share window (warm, below),
  // once per page, (3) the waiting button shows how far it got, and (4) a slow connection does not wait more than
  // PICTURE_AFTER from the start of its download: the status picture of the same story opens the button, and the video takes
  // its place if it arrives first.
  const PICTURE_AFTER = 6000; // counted from the start of the download, which often began before the tap
  const media = {}; // address -> { file: Promise<File|null>, ready, loaded, total }
  function download(url, rec) {
    return fetch(url).then((r) => {
      if (!r.ok) return null;
      rec.total = Number(r.headers.get("content-length")) || 0;
      if (!rec.total || !r.body || typeof r.body.getReader !== "function") return r.blob();
      const reader = r.body.getReader();
      const parts = [];
      const pump = () => reader.read().then(({ done, value }) => {
        if (done) return new Blob(parts, { type: r.headers.get("content-type") || "" });
        parts.push(value);
        rec.loaded += value.length;
        return pump();
      });
      return pump();
    });
  }
  function mediaOf(url, name, video) {
    if (!canShareFiles || !url) return null;
    if (!media[url]) {
      const rec = { ready: null, loaded: 0, total: 0, started: Date.now() };
      rec.file = download(url, rec)
        .then((blob) => {
          if (!blob) return null;
          const file = new File([blob], name, { type: video ? "video/mp4" : blob.type || "image/jpeg" });
          return navigator.canShare({ files: [file] }) ? file : null;
        })
        .catch(() => null);
      rec.file.then((f) => {
        rec.ready = f;
        if (!f && media[url] === rec) delete media[url]; // a failed download is tried again next time
      });
      media[url] = rec;
    }
    return media[url];
  }
  function filesOf(o) {
    const st = o.status;
    if (!st) return { vid: null, pic: null };
    return {
      vid: st.video ? mediaOf(st.video, mediaName(o, { slug: st.slug, video: st.video }), true) : null,
      pic: st.image ? mediaOf(st.image, mediaName(o, { slug: st.slug }), false) : null,
    };
  }
  // the weekly status starts downloading once something plays on the page (the share invitation comes at its end) or a
  // finger touches a share button; a computer downloads nothing ahead (it saves the file only when asked)
  let warmWanted = false;
  function warm() {
    warmWanted = true;
    if (weekly && canShareFiles) filesOf({ status: weekly, slug: weekly.slug });
  }
  if (canShareFiles) {
    document.addEventListener("play", warm, { capture: true, once: true });
    document.addEventListener("pointerdown", (e) => {
      if (e.target && e.target.closest && e.target.closest("[data-share-slug], [data-share]")) warm();
    }, { capture: true, passive: true });
  }

  function open(o, mode) {
    ensure();
    if (weekly) o = { ...o, status: weekly };
    lastFocus = document.activeElement;
    const { vid, pic } = filesOf(o);
    const main = vid || pic;
    current = { o, mode, vid, pic, main, file: main ? main.file : Promise.resolve(null), ready: main ? main.ready : null };
    const cur = current;
    // only a file that arrived replaces what is ready (a video that failed after the picture opened the button keeps the picture)
    if (main) main.file.then((f) => { if (f && current === cur) cur.ready = f; });
    render("choose");
    root.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    document.body.style.overflow = "";
    current = null;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function closeButton() {
    return `<button class="share-sheet__close" type="button" data-act="close" aria-label="${esc(T.close)}">✕</button>`;
  }

  function render(screen) {
    const { o, mode } = current;
    const invite = mode === "invite";
    if (screen === "video") {
      const steps = isApple ? T.videoStepsApple : T.videoSteps;
      card.innerHTML = `${closeButton()}
        <h2 class="share-sheet__title" id="share-sheet-title">${esc(T.videoTitle)}</h2>
        <div class="share-sheet__status">
          ${o.poster ? `<img class="share-sheet__preview share-sheet__preview--square" src="${esc(o.poster)}" alt="${esc(T.videoPreview(o.title || ""))}" width="1024" height="1024">` : ""}
          <ol class="share-sheet__steps">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
        </div>
        <div class="share-sheet__actions">
          <button class="btn btn--primary share-sheet__primary" type="button" data-act="share-video">${esc(T.shareVideo)}</button>
          ${isApple ? `<button class="share-sheet__link" type="button" data-act="copy">${esc(T.copy)}</button>` : ""}
          <button class="share-sheet__link" type="button" data-act="close">${esc(T.close)}</button>
        </div>
        <p class="share-sheet__note" role="status" aria-live="polite"></p>`;
      const btn = card.querySelector(".share-sheet__primary");
      btn.focus();
      // as with the status picture: the button opens only once the video is here, so the tap opens the share menu
      if (!current.ready) {
        btn.disabled = true;
        btn.textContent = T.preparingVideo;
        current.file.then((f) => {
          if (!current || current.o !== o || !btn.isConnected) return;
          if (f) {
            btn.disabled = false;
            btn.textContent = T.shareVideo;
            if (document.activeElement === document.body || document.activeElement === btn) btn.focus();
          } else {
            btn.outerHTML = `<button class="btn btn--primary share-sheet__primary" type="button" data-act="video-text">${esc(T.videoAsText)}</button>`;
          }
        });
      }
      return;
    }
    if (screen === "choose") {
      // invite = the popup at the end of a recording (Avraham, 2026-10-21): the same two choices, with an invitation
      const story = o.isStory !== false;
      const head = invite
        ? `<h2 class="share-sheet__title" id="share-sheet-title">${esc(story ? T.inviteTitle : T.inviteTitleRec)}</h2>
        <p class="share-sheet__lead">${esc(story ? T.inviteText : T.inviteTextRec)}</p>`
        : `<h2 class="share-sheet__title" id="share-sheet-title">${esc(T.chooseTitle)}</h2>`;
      const statusOption = o.status
        ? `<button class="share-sheet__option" type="button" data-act="status">
            ${previewTag(o.status, "share-sheet__thumb", "", 1080, 1920)}
            <span class="share-sheet__option-text"><strong>${esc(T.status)}</strong><small>${esc(T.statusSub)}</small></span>
          </button>`
        : "";
      card.innerHTML = `${closeButton()}
        ${head}
        <div class="share-sheet__options">
          <button class="share-sheet__option" type="button" data-act="message">
            <span class="share-sheet__icon" aria-hidden="true">💬</span>
            <span class="share-sheet__option-text"><strong>${esc(T.message)}</strong><small>${esc(T.messageSub)}</small></span>
          </button>
          ${statusOption}
        </div>
        ${invite ? `<div class="share-sheet__actions"><button class="share-sheet__link" type="button" data-act="close">${esc(T.later)}</button></div>` : ""}`;
      card.querySelector("[data-act='message']").focus();
      return;
    }
    const steps = canShareFiles ? T.stepsPhone : T.stepsDesktop;
    const primary = canShareFiles
      ? `<button class="btn btn--primary share-sheet__primary" type="button" data-act="share-status">${esc(T.shareStatus)}</button>`
      : `<a class="btn btn--primary share-sheet__primary" href="${esc(mediaUrl(o.status))}" download="${esc(mediaName(o, o.status))}" data-act="download">${esc(T.download)}</a>`;
    card.innerHTML = `${closeButton()}
      <h2 class="share-sheet__title" id="share-sheet-title">${esc(T.statusTitle)}</h2>
      <div class="share-sheet__status">
        ${previewTag(o.status, "share-sheet__preview", T.preview(o.title || ""), 1080, 1920)}
        <ol class="share-sheet__steps">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      </div>
      <div class="share-sheet__actions">
        ${primary}
        <button class="share-sheet__link" type="button" data-act="copy">${esc(T.copy)}</button>
        <button class="share-sheet__link" type="button" data-act="back">${esc(T.back)}</button>
      </div>
      <p class="share-sheet__note" role="status" aria-live="polite"></p>`;
    const btn = card.querySelector(".share-sheet__primary");
    btn.focus();
    // בטלפון: הכפתור נפתח רק כשהתמונה כבר ירדה. כך הלחיצה פותחת את תפריט השיתוף מיד; באייפון
    // המתנה להורדה אחרי הלחיצה מבטלת את ההרשאה לפתוח אותו.
    if (canShareFiles && !current.ready) {
      const cur = current;
      const label = o.status.video ? T.preparingStatusVideo : T.preparing;
      btn.disabled = true;
      btn.textContent = label;
      const live = () => current === cur && btn.isConnected;
      const enable = (f) => {
        if (current !== cur) return;
        cur.ready = f;
        if (!btn.isConnected || !btn.disabled) return;
        btn.disabled = false;
        btn.textContent = T.shareStatus;
        if (document.activeElement === document.body || document.activeElement === btn) btn.focus();
      };
      // how far the download got, so nobody thinks it is stuck
      const tick = setInterval(() => {
        if (!live() || !btn.disabled) return clearInterval(tick);
        const m = cur.main;
        const p = m && m.total ? Math.min(99, Math.floor((m.loaded * 100) / m.total)) : 0;
        if (p > 0) btn.textContent = `${label} ${p}%`;
      }, 250);
      const toDownload = () => {
        // התמונה לא ירדה או שהמכשיר לא משתף קבצים: הורדה במקום שיתוף
        if (live() && !cur.ready) btn.outerHTML = `<a class="btn btn--primary share-sheet__primary" href="${esc(mediaUrl(o.status))}" download="${esc(mediaName(o, o.status))}" data-act="download">${esc(T.download)}</a>`;
      };
      cur.file.then((f) => {
        if (current !== cur) return;
        if (f) enable(f);
        else if (cur.pic && cur.main !== cur.pic) cur.pic.file.then((pf) => (pf ? enable(pf) : toDownload()));
        else toDownload();
      });
      // a slow connection: the picture of the same status after PICTURE_AFTER (the video still wins if it comes first)
      if (cur.vid && cur.pic) {
        setTimeout(() => {
          if (live() && !cur.ready) cur.pic.file.then((pf) => { if (pf && !cur.ready) enable(pf); });
        }, Math.max(1500, cur.vid.started + PICTURE_AFTER - Date.now()));
      }
    }
  }

  function note(text) {
    const el = card.querySelector(".share-sheet__note");
    if (el) el.textContent = text;
  }

  function copyText(text) {
    if (text === undefined) text = current.o.status.text;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        return navigator.clipboard.writeText(text).then(() => true, () => legacyCopy(text));
      }
    } catch (e) {
      // נופל לשיטה הישנה
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    ta.remove();
    return ok;
  }

  function markShared() {
    try {
      localStorage.setItem("zkb_status_shared_" + (current.o.slug || ""), String(Date.now()));
    } catch (e) {
      // גלישה פרטית: לא נורא
    }
  }

  async function shareStatus() {
    const o = current.o;
    if (typeof o.track === "function") o.track("status");
    const copied = copyText(); // באותה לחיצה, לפני תפריט השיתוף (באייפון המלל לא עובר עם התמונה)
    let file = current.ready;
    if (!file) file = await current.file; // עוד יורדת: מחכים (בדרך כלל כבר מוכנה)
    if (!file) {
      note(T.failed);
      return;
    }
    const attempts = isApple ? [{ files: [file] }] : [{ files: [file], text: o.status.text }, { files: [file] }];
    for (const data of attempts) {
      try {
        await navigator.share(data);
        markShared();
        note(T.thanks);
        setTimeout(close, 1400);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // סגרו את תפריט השיתוף
        if (err && err.name === "NotAllowedError") break; // ההמתנה להורדה "גמרה" את הלחיצה - לחיצה נוספת תעבוד
      }
    }
    copied.then(() => note(T.failed));
  }

  // ---------- a joke as a video (Avraham, 2026-11-03) ----------
  // "כשלוחצים על כפתור השיתוף של הבדיחה זה ישלח את הבדיחה ... כאודיו מצורף לתמונה", with his text. The video is
  // assets/video/jokes/<the joke's audio name>.mp4 (רוני המתכנת/Tools/daily_joke/build_share_videos.py).
  const videos = {}; // url -> { file: Promise<File|null>, ready: File|null }
  function videoOf(url, slug) {
    if (!canShareFiles || !url) return null;
    if (!videos[url]) {
      const v = { ready: null };
      v.file = fetch(url)
        .then((r) => (r.ok ? r.blob() : null))
        .then((blob) => {
          if (!blob) return null;
          const file = new File([blob], `${slug || "joke"}.mp4`, { type: "video/mp4" });
          return navigator.canShare({ files: [file] }) ? file : null;
        })
        .catch(() => null);
      v.file.then((f) => {
        v.ready = f;
        if (!f && videos[url] === v) delete videos[url]; // a failed download is tried again next time
      });
      videos[url] = v;
    }
    return videos[url];
  }

  // A joke's text carries the generic join page; at share time it becomes the CURRENT group's direct link
  // (Avraham, 2026-11-15). Fetched ahead (page load / warmVideo) so the tap stays synchronous; if the
  // server has not answered, the generic page stays (it redirects to the same group).
  const JOIN_PAGE = "https://abrahamgersten.github.io/zeh-kara-beemet/whatsapp/";
  let groupLink = null, groupLinkAt = 0;
  function fetchGroupLink() {
    if (Date.now() - groupLinkAt < 60000) return;
    groupLinkAt = Date.now();
    const key = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
    fetch("https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/get_join_target", {
      method: "POST", headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" }, body: "{}", cache: "no-store",
    }).then((r) => (r.ok ? r.json() : null))
      .then((u) => { if (typeof u === "string" && /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+$/.test(u)) groupLink = u; })
      .catch(() => {});
  }
  function withGroupLink(text) {
    return groupLink && typeof text === "string" ? text.split(JOIN_PAGE + "\n").join(groupLink + "\n").replace(new RegExp(JOIN_PAGE.replace(/[.*+?^${}()|[\]\\\/]/g, "\\$&") + "$"), groupLink) : text;
  }
  fetchGroupLink();

  function shareVideo(o) {
    fetchGroupLink();
    if (o && o.text) o.text = withGroupLink(o.text);
    const v = videoOf(o.video, o.slug);
    if (!v) {
      if (typeof o.onFallback === "function") o.onFallback(); // a computer: WhatsApp with the text
      return;
    }
    if (v.ready && !isApple) {
      // Android, already downloaded (it was played): straight to the share menu, on this same tap
      navigator.share({ files: [v.ready], text: o.text }).catch((err) => {
        if (!(err && err.name === "AbortError")) openVideo(o, v);
      });
      return;
    }
    openVideo(o, v);
  }

  function openVideo(o, v) {
    ensure();
    lastFocus = document.activeElement;
    current = { o, mode: "video", file: v.file, ready: v.ready };
    v.file.then((f) => { if (current && current.o === o) current.ready = f; });
    render("video");
    root.hidden = false;
    document.body.style.overflow = "hidden";
  }

  async function shareVideoNow() {
    const o = current.o;
    const copied = isApple ? copyText(o.text) : Promise.resolve(true); // on this tap, before the menu (iPhone drops the text)
    const file = current.ready || (await current.file);
    if (!file) {
      note(T.failed);
      return;
    }
    const attempts = isApple ? [{ files: [file] }] : [{ files: [file], text: o.text }, { files: [file] }];
    for (const data of attempts) {
      try {
        await navigator.share(data);
        note(T.thanks);
        setTimeout(close, 1400);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
        if (err && err.name === "NotAllowedError") break;
      }
    }
    copied.then(() => note(T.failed));
  }

  function handle(act, el, e) {
    if (!current) return;
    if (act === "close") close();
    else if (act === "back") render("choose");
    else if (act === "status") render("status");
    else if (act === "message") {
      const fn = current.o.onMessage;
      markShared(); // shared it as a message: the end-of-recording invitation will not ask again
      close();
      if (typeof fn === "function") fn();
    } else if (act === "share-status") shareStatus();
    else if (act === "share-video") shareVideoNow();
    else if (act === "video-text") {
      const fn = current.o.onFallback;
      close();
      if (typeof fn === "function") fn();
    } else if (act === "copy") {
      const text = current.mode === "video" ? current.o.text : current.o.status.text;
      copyText(text).then((ok) => note(ok ? T.copied : `${T.copyFailed}
${text}`));
    }
    else if (act === "download") {
      if (typeof current.o.track === "function") current.o.track("status");
      copyText().then((ok) => { if (ok) note(T.copied); });
      markShared();
    }
  }

  window.ZkbShareSheet = {
    choose(o) {
      open(o, "choose");
    },
    invite(o) {
      open(o, "invite");
    },
    shareVideo,
    withGroupLink,
    warmVideo(url, slug) {
      fetchGroupLink();
      videoOf(url, slug);
    },
    // מי ששיתף כבר בסטטוס את הסיפור הזה לא יקבל שוב את ההזמנה בסוף ההקלטה
    alreadyShared(slug) {
      try {
        return !!localStorage.getItem("zkb_status_shared_" + slug);
      } catch (e) {
        return false;
      }
    },
  };
})();
