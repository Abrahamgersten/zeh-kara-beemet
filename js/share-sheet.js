"use strict";

/* ---------------------------------------------------------------
   שיתוף בהודעה או בסטטוס (אברהם, 2026-10-19: "כשלוחצים על שיתוף הסיפור, שישאל אם לשתף
   כהודעה או לסטטוס; בסטטוס - התמונה של הסיפור עם מלל שמותאם לסטטוס").
   רק לסיפורים שיש להם תמונת סטטוס (tools/status_shares.json -> assets/images/status/<slug>.jpg).
   משמש את כפתור השיתוף בכרטיסים באתר (js/app.js) ובדף הסיפור (js/story.js).

   window.ZkbShareSheet.choose(o)  חלון הבחירה: "בהודעה" (o.onMessage - השיתוף הקיים) או "בסטטוס".
   window.ZkbShareSheet.invite(o)  ישר למסך הסטטוס, עם הזמנה ("אהבתם את הסיפור?") - בסוף ההקלטה.
   o = { title, slug, status: { image, text }, onMessage(), track(event) }

   אין דרך לפרסם סטטוס ישירות מדף אינטרנט. מה שאפשר: לפתוח את תפריט השיתוף של הטלפון עם
   התמונה, ובוואטסאפ "הסטטוס שלי" מופיע בראש רשימת הנמענים. המלל (עם הקישור להאזנה) מצורף
   באנדרואיד ככיתוב; באייפון וואטסאפ משמיט מלל שמגיע עם קובץ, ולכן הוא מועתק מראש להדבקה.
   במחשב (אין שיתוף קבצים): הורדת התמונה והעתקת המלל.
--------------------------------------------------------------- */
(function () {
  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  // סטטוס מעלים מהטלפון. במחשב (גם כשיש לדפדפן תפריט שיתוף, כמו כרום ב-Windows) - הורדה והעתקה.
  const isPhone = isApple || /Android/i.test(navigator.userAgent);
  const canShareFiles = isPhone && typeof navigator.share === "function" && typeof navigator.canShare === "function" && typeof File === "function";

  const T = {
    chooseTitle: "איך לשתף את הסיפור?",
    message: "בהודעה",
    messageSub: "לחבר, למשפחה או לקבוצה, עם קישור להאזנה",
    status: "בסטטוס",
    statusSub: "תמונת הסיפור עם מלל קצר וקישור להאזנה",
    statusTitle: "שיתוף בסטטוס",
    inviteTitle: "אהבתם את הסיפור?",
    inviteText: "שתפו אותו בסטטוס, ועוד משפחות יוכלו להקשיב לו ❤️",
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
  };

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

  // התמונה יורדת כבר כשהחלון נפתח: navigator.share חייב לרוץ מיד עם הלחיצה.
  function loadFile(o) {
    if (!canShareFiles) return Promise.resolve(null);
    return fetch(o.status.image)
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => {
        if (!blob) return null;
        const file = new File([blob], `${o.slug || "story"}-status.jpg`, { type: blob.type || "image/jpeg" });
        return navigator.canShare({ files: [file] }) ? file : null;
      })
      .catch(() => null);
  }

  function open(o, mode) {
    ensure();
    lastFocus = document.activeElement;
    current = { o, mode, file: loadFile(o), ready: null };
    current.file.then((f) => { if (current && current.o === o) current.ready = f; });
    render(mode === "invite" ? "status" : "choose");
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
    if (screen === "choose") {
      card.innerHTML = `${closeButton()}
        <h2 class="share-sheet__title" id="share-sheet-title">${esc(T.chooseTitle)}</h2>
        <div class="share-sheet__options">
          <button class="share-sheet__option" type="button" data-act="message">
            <span class="share-sheet__icon" aria-hidden="true">💬</span>
            <span class="share-sheet__option-text"><strong>${esc(T.message)}</strong><small>${esc(T.messageSub)}</small></span>
          </button>
          <button class="share-sheet__option" type="button" data-act="status">
            <img class="share-sheet__thumb" src="${esc(o.status.image)}" alt="" width="1080" height="1920">
            <span class="share-sheet__option-text"><strong>${esc(T.status)}</strong><small>${esc(T.statusSub)}</small></span>
          </button>
        </div>`;
      card.querySelector("[data-act='message']").focus();
      return;
    }
    const invite = mode === "invite";
    const steps = canShareFiles ? T.stepsPhone : T.stepsDesktop;
    const primary = canShareFiles
      ? `<button class="btn btn--primary share-sheet__primary" type="button" data-act="share-status">${esc(T.shareStatus)}</button>`
      : `<a class="btn btn--primary share-sheet__primary" href="${esc(o.status.image)}" download="${esc((o.slug || "story") + "-status.jpg")}" data-act="download">${esc(T.download)}</a>`;
    card.innerHTML = `${closeButton()}
      <h2 class="share-sheet__title" id="share-sheet-title">${esc(invite ? T.inviteTitle : T.statusTitle)}</h2>
      ${invite ? `<p class="share-sheet__lead">${esc(T.inviteText)}</p>` : ""}
      <div class="share-sheet__status">
        <img class="share-sheet__preview" src="${esc(o.status.image)}" alt="${esc(T.preview(o.title || ""))}" width="1080" height="1920">
        <ol class="share-sheet__steps">${steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
      </div>
      <div class="share-sheet__actions">
        ${primary}
        <button class="share-sheet__link" type="button" data-act="copy">${esc(T.copy)}</button>
        ${invite ? `<button class="share-sheet__link" type="button" data-act="close">${esc(T.later)}</button>`
                 : `<button class="share-sheet__link" type="button" data-act="back">${esc(T.back)}</button>`}
      </div>
      <p class="share-sheet__note" role="status" aria-live="polite"></p>`;
    card.querySelector(".share-sheet__primary").focus();
  }

  function note(text) {
    const el = card.querySelector(".share-sheet__note");
    if (el) el.textContent = text;
  }

  function copyText() {
    const text = current.o.status.text;
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

  function handle(act, el, e) {
    if (!current) return;
    if (act === "close") close();
    else if (act === "back") render("choose");
    else if (act === "status") render("status");
    else if (act === "message") {
      const fn = current.o.onMessage;
      close();
      if (typeof fn === "function") fn();
    } else if (act === "share-status") shareStatus();
    else if (act === "copy") copyText().then((ok) => note(ok ? T.copied : `${T.copyFailed}
${current ? current.o.status.text : ""}`));
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
