"use strict";

/* ---------------------------------------------------------------
   הדף של היעד המשותף לקבוצות (s/wondrous-map/) - נוצר ע"י tools/build_map_campaign.mjs.
   אברהם, 2026-11-25: "על כל 100 משתתפים חדשים לשחרר פרק חדש" של "המפה המופלאה", דף עם הפרקים שכבר
   השתחררו, וקישורים שמאפשרים שיתוף: ההזמנה הכללית למיזם עם סרטון ההזמנה של בצלאל (לחברים ולקבוצות),
   והסרטון של הסיפור השבועי לסטטוס (אותו סטטוס של הבוט ושל כפתור השיתוף באתר, guest_status).

   אילו פרקים פתוחים וכמה משפחות יש בקבוצות: קובץ מצב קטן (map/state.json במאגר ההקלטות), שמעדכן
   רוני המתכנת/Tools/map_campaign/update.py. לא נקרא: פרק 1, שכתוב בדף עצמו.
   הנגן עצמו הוא js/serial.js, שנטען אחרי שהפרקים נכנסו לדף.

   אין דרך לשתף מדף אינטרנט בלי נגיעה של האדם, ואין דרך לבחור בשבילו "סטטוס": הכפתור פותח את תפריט
   השיתוף של הטלפון עם הסרטון, ובוואטסאפ בוחרים צ'אטים או "הסטטוס שלי". באייפון וואטסאפ משמיט מלל
   שמגיע עם קובץ, ולכן המלל מועתק באותה לחיצה. במחשב: הסרטון יורד והמלל מועתק.
   ?share=groups / ?share=status בכתובת: הדף נפתח על הכפתור הזה, והסרטון שלו כבר יורד.
--------------------------------------------------------------- */
(function () {
  let CFG = {};
  try {
    CFG = JSON.parse(document.getElementById("map-config").textContent) || {};
  } catch (e) {
    return;
  }
  const params = new URLSearchParams(location.search);
  const TEST = params.get("t") === "1";
  const WANT = params.get("share") === "groups" || params.get("share") === "status" ? params.get("share") : null;
  const KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
  const API = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/";
  const UP = "../../";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const num = (n) => Number(n).toLocaleString("he-IL");

  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isPhone = isApple || /Android/i.test(navigator.userAgent);
  const canShareFiles = isPhone && typeof navigator.share === "function" && typeof navigator.canShare === "function" && typeof File === "function";

  function rpc(name, body) {
    return fetch(API + name, {
      method: "POST",
      headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
      keepalive: true,
    });
  }
  function visitorId() {
    try {
      return localStorage.getItem("zkb_story_visitor");
    } catch (e) {
      return null;
    }
  }
  function track(event) {
    if (TEST || location.hostname !== "abrahamgersten.github.io") return;
    try {
      rpc("log_story_event", { p_slug: CFG.serial, p_lang: "he", p_event: event, p_visitor: visitorId(), p_campaign: null }).catch(() => {});
    } catch (e) {
      // never affects the page
    }
  }

  // ---------- the chapters that are open, and the counter ----------
  function chapterHTML(ch, i, total) {
    const media = ch.image
      ? `<div class="content-card__media"><img class="content-card__main-img" src="${esc(UP + ch.image)}" alt="${esc(ch.title)}"${i ? ' loading="lazy"' : ""}></div>`
      : "";
    return `<article class="content-card is-visible serial-chapter" id="${esc(ch.slug)}">${media}
      <div class="content-card__body">
        <span class="content-card__eyebrow">פרק ${i + 1} מתוך ${total}</span>
        <h2 class="content-card__title">${esc(ch.title)}</h2>
        ${ch.description ? `<p class="content-card__desc">${esc(ch.description)}</p>` : ""}
        <div class="player-wrap">
          <div class="player" data-src="${esc(UP + ch.audio)}" data-slug="${esc(ch.slug)}" data-title="${esc(ch.title)}">
            <button class="player__btn" type="button" aria-label="הפעלת ${esc(ch.title)}">▶</button>
            <div class="player__body">
              <input class="player__seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="התקדמות ההקראה של ${esc(ch.title)}">
              <div class="player__times"><span class="player__current">0:00</span><span class="player__duration">--:--</span></div>
            </div>
          </div>
          <p class="story-player-error" role="alert" hidden>לא הצלחנו לטעון את ההקלטה. בדקו את החיבור לאינטרנט ונסו שוב.</p>
        </div>
      </div>
    </article>`;
  }

  function paint(state) {
    const total = CFG.total || state.chapters.length;
    const open = state.chapters.length;
    const done = open >= total;
    $("map-chapters").innerHTML = state.chapters.map((ch, i) => chapterHTML(ch, i, total)).join("\n");
    $("serial-data").textContent = JSON.stringify({ serial: CFG.serial, lang: "he", chapters: state.chapters.map((c) => c.slug) });

    const count = Number(state.count) > 0 ? Number(state.count) : null;
    $("map-count").textContent = count ? `אנחנו כבר ${num(count)} משפחות` : "";
    const bar = $("map-bar");
    const locked = $("map-locked");
    if (done) {
      $("map-left").textContent = `כל ${total} הפרקים כבר פתוחים. תודה לכל מי שהזמין עוד משפחה!`;
      bar.hidden = true;
      locked.hidden = true;
    } else {
      const nextAt = Number(state.next_at) || 0;
      const left = count && nextAt ? Math.max(1, nextAt - count) : null;
      $("map-left").textContent = state.left_text ? state.left_text : left
        ? `עוד ${num(left)} משפחות, ופרק ${open + 1} נפתח לכולם.`
        : `כשנגיע ל-${num(nextAt)} משפחות, פרק ${open + 1} נפתח לכולם.`;
      if (count && nextAt) {
        const pct = Math.max(4, Math.min(100, Math.round(((count - (nextAt - 100)) / 100) * 100)));
        bar.hidden = false;
        bar.setAttribute("aria-valuenow", String(pct));
        requestAnimationFrame(() => { bar.firstElementChild.style.width = pct + "%"; });
      }
      locked.hidden = false;
      locked.innerHTML = `<strong>פרק ${open + 1} עוד סגור</strong>${nextAt ? `הוא ייפתח כאן כשנהיה ${esc(num(nextAt))} משפחות בקבוצות, או בעוד שבוע לכל המאוחר.` : "הוא ייפתח כאן בקרוב."}`;
    }
    if (open > 1) $("map-hint").textContent = "לוחצים על כפתור ההפעלה של הפרק שרוצים. בסוף כל פרק, הפרק הבא שכבר נפתח מתחיל לבד.";
  }

  function startPlayer() {
    const s = document.createElement("script");
    s.src = UP + "js/serial.js";
    document.body.appendChild(s);
  }

  const valid = (st) => st && Array.isArray(st.chapters) && st.chapters.length > 0 && st.chapters.every((c) => c && c.slug && c.title && c.audio);
  fetch(CFG.state + "?v=" + Math.floor(Date.now() / 300000), { cache: "no-store" })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
    .then((st) => {
      paint(valid(st) ? st : CFG.fallback);
      startPlayer();
    });

  // ---------- the two share buttons ----------
  const note = (text) => { $("map-note").textContent = text || ""; };
  const buttons = {};
  document.querySelectorAll("[data-map-share]").forEach((b) => {
    buttons[b.dataset.mapShare] = { el: b, label: b.textContent };
  });

  // what each button sends: { video | image, text, name }
  const items = {
    groups: Promise.resolve({ video: CFG.invite.video, text: CFG.invite.text, name: "sipur-lifnei-hashena.mp4" }),
    // the weekly status, as in the "סטטוס" bot and the site's share button (js/share-sheet.js): Thursday and Friday the
    // "מה בפרשה" banner video, the other days Bezalel's trailer of the weekly story, with the caption of the bot
    status: rpc("guest_status")
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m || !m.text) return null;
        let arm = "a";
        try { arm = /[89ab]/i.test((localStorage.getItem("zkb_story_visitor") || "0").slice(-1)) ? "b" : "a"; } catch (e) { /* a */ }
        const video = m.video || (m.videos || {})[arm] || null;
        const image = (m.images || {})[arm] || m.image || null;
        return video || image ? { video, image, text: m.text, name: (m.slug || "story") + "-status." + (video ? "mp4" : "jpg") } : null;
      })
      .catch(() => null)
      .then((it) => it || (CFG.statusFallback.image ? { image: CFG.statusFallback.image, text: CFG.statusFallback.text, name: "sipur-status.jpg" } : null)),
  };

  const files = {}; // kind -> { promise, ready: File|null, failed, loaded, total }
  function fetchFile(kind) {
    if (files[kind]) return files[kind];
    const rec = { ready: null, failed: false, loaded: 0, total: 0 };
    rec.promise = items[kind]
      .then((it) => {
        if (!it) return null;
        const url = it.video || it.image;
        return fetch(url).then((r) => {
          if (!r.ok) return null;
          rec.total = Number(r.headers.get("content-length")) || 0;
          const type = it.video ? "video/mp4" : r.headers.get("content-type") || "image/jpeg";
          if (!rec.total || !r.body || typeof r.body.getReader !== "function") return r.blob().then((b) => new File([b], it.name, { type }));
          const reader = r.body.getReader();
          const parts = [];
          const pump = () => reader.read().then(({ done, value }) => {
            if (done) return new File(parts, it.name, { type });
            parts.push(value);
            rec.loaded += value.length;
            progress(kind);
            return pump();
          });
          return pump();
        });
      })
      .catch(() => null)
      .then((file) => {
        rec.ready = file && (!canShareFiles || navigator.canShare({ files: [file] })) ? file : null;
        rec.failed = !rec.ready;
        if (rec.failed) delete files[kind]; // tried again on the next tap
        return rec.ready;
      });
    files[kind] = rec;
    return rec;
  }
  function progress(kind) {
    const b = buttons[kind];
    const rec = files[kind];
    if (!b || !rec || !b.el.disabled) return;
    const pct = rec.total ? Math.min(99, Math.round((rec.loaded / rec.total) * 100)) : null;
    b.el.textContent = pct === null ? "מכינים את הסרטון..." : `מכינים את הסרטון... ${pct}%`;
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(() => true, () => false);
    return Promise.resolve(false);
  }
  function saveToComputer(file) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 60000);
  }

  const WHERE = { groups: "בוחרים חברים, משפחה או קבוצות, ושולחים.", status: "בוחרים למעלה \"הסטטוס שלי\", ושולחים." };

  async function send(kind, file, it) {
    track(kind === "status" ? "status" : "share");
    if (!canShareFiles) {
      // a computer: the file is saved and the text is copied
      saveToComputer(file);
      const ok = await copy(it.text);
      note(ok ? "הסרטון נשמר במחשב, והמלל הועתק. פותחים את וואטסאפ, מצרפים את הסרטון ומדביקים את המלל." : "הסרטון נשמר במחשב. פותחים את וואטסאפ ומצרפים אותו.");
      return;
    }
    const copied = isApple ? copy(it.text) : Promise.resolve(false); // on this tap, before the menu (iPhone drops the text)
    const attempts = isApple ? [{ files: [file] }] : [{ files: [file], text: it.text }, { files: [file] }];
    for (const data of attempts) {
      try {
        await navigator.share(data);
        note("תודה רבה! 💛 כל משפחה שמצטרפת מקרבת את הפרק הבא.");
        return;
      } catch (err) {
        if (err && err.name === "AbortError") { note(""); return; } // closed the share menu
        if (err && err.name === "NotAllowedError") break; // the wait for the download used up the tap: one more tap works
      }
    }
    await copied;
    note("לחצו שוב על הכפתור, והסרטון ייפתח לשליחה.");
  }

  const got = {}; // kind -> the item, once known (so a tap on a ready video stays one synchronous step: Safari needs that)
  Object.keys(items).forEach((kind) => items[kind].then((it) => { got[kind] = it; }));

  async function tap(kind) {
    const b = buttons[kind];
    if (got[kind] && files[kind] && files[kind].ready) {
      if (canShareFiles) note(isApple ? "המלל הועתק. בוואטסאפ: " + WHERE[kind] + " את המלל מדביקים בלחיצה ארוכה." : "בוואטסאפ: " + WHERE[kind]);
      send(kind, files[kind].ready, got[kind]);
      return;
    }
    const it = await items[kind];
    if (!it) { note("לא הצלחנו להכין את הסרטון. בדקו את החיבור לאינטרנט ונסו שוב."); return; }
    const rec = fetchFile(kind);
    b.el.disabled = true;
    progress(kind);
    note("הסרטון יורד, עוד רגע.");
    const file = await rec.promise;
    b.el.disabled = false;
    b.el.textContent = b.label;
    if (!file) { note("לא הצלחנו להכין את הסרטון. בדקו את החיבור לאינטרנט ונסו שוב."); return; }
    if (!canShareFiles) { send(kind, file, it); return; }
    note("הסרטון מוכן. לחצו שוב על הכפתור כדי לשלוח.");
    b.el.focus();
  }

  Object.keys(buttons).forEach((kind) => {
    buttons[kind].el.addEventListener("click", () => tap(kind));
  });

  // the videos start coming down before the tap (phones only), so the tap itself opens the share menu
  if (canShareFiles) {
    if (WANT) fetchFile(WANT);
    const warm = () => { fetchFile("groups"); fetchFile("status"); };
    document.addEventListener("pointerdown", warm, { capture: true, once: true, passive: true });
    document.addEventListener("scroll", warm, { capture: true, once: true, passive: true });
  }

  // ?share=groups / ?share=status: the page opens on that button
  if (WANT && buttons[WANT]) {
    const el = buttons[WANT].el;
    el.classList.add("is-called");
    window.addEventListener("load", () => {
      $("map-share").scrollIntoView({ block: "center" });
      note(WANT === "status" ? "לחצו על \"העלאה לסטטוס\", והסרטון של השבוע ייפתח לשליחה." : "לחצו על \"שליחת הזמנה\", וסרטון ההזמנה ייפתח לשליחה.");
    });
  }

  // "open" and "join" are counted by js/serial.js
})();
