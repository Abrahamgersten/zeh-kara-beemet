"use strict";

/* ---------------------------------------------------------------
   שני דפי השיתוף הפשוטים (share/ ו-status/) - נוצרים ע"י tools/build_map_campaign.mjs.
   אברהם, 2026-11-25: "קישור לשיתוף ההודעה עם כפתור אחד מאוד ברור בלי עוד דברים, וקישור לשיתוף הסטטוס
   עם כפתור מאוד ברור כנ"ל", ו"שהסרטון שמעלים לסטטוס יהיה קל מאוד ושייקח זמן מינימלי לטעינה".

   share/   סרטון ההזמנה של בצלאל + נוסח ההזמנה של אברהם (לחברים ולקבוצות).
   status/  הסטטוס השבועי, כמו בבוט "סטטוס" ובכפתור השיתוף באתר (guest_status): בחמישי ובשישי סרטון
            "מה בפרשה", בשאר הימים הטריילר של בצלאל לסיפור השבועי, עם הכיתוב של הבוט.

   הסרטון מתחיל לרדת ברגע שהדף נפתח, כדי שהלחיצה עצמה תפתח את תפריט השיתוף של הטלפון. אין דרך לשתף
   מדף אינטרנט בלי נגיעה של האדם, ואין דרך לבחור בשבילו "סטטוס". באייפון וואטסאפ משמיט מלל שמגיע עם
   קובץ, ולכן המלל מועתק באותה לחיצה. במחשב: הסרטון נשמר והמלל מועתק.
   ?t=1 = בדיקה, לא נספר.
--------------------------------------------------------------- */
(function () {
  let CFG = {};
  try {
    CFG = JSON.parse(document.getElementById("share-config").textContent) || {};
  } catch (e) {
    return;
  }
  const KIND = CFG.kind === "status" ? "status" : "groups";
  const TEST = new URLSearchParams(location.search).get("t") === "1";
  const KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
  const API = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/";
  const btn = document.getElementById("go");
  const noteEl = document.getElementById("note");
  const LABEL = btn.textContent;
  const note = (text) => { noteEl.textContent = text || ""; };

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
  function visitor() {
    try {
      let v = localStorage.getItem("zkb_story_visitor");
      if (!v) {
        v = (crypto.randomUUID ? crypto.randomUUID() : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join(""));
        localStorage.setItem("zkb_story_visitor", v);
      }
      return v;
    } catch (e) {
      return null;
    }
  }
  // every step of the page is counted (Avraham, 26.11: "follow the clicks on everything in this move, to learn from it"):
  // view, tap, done (the share menu finished), cancel (it was closed), retry (one more tap was needed), fail (no video)
  const PAGE_NAME = KIND === "status" ? "status" : "share";
  const SOURCE = (new URLSearchParams(location.search).get("c") || (/\/s\/wondrous-map\//.test(document.referrer) ? "page" : "direct")).toLowerCase();
  function step(name) {
    if (TEST || location.hostname !== "abrahamgersten.github.io") return;
    try {
      rpc("log_map_event", { p_action: PAGE_NAME + "-" + name, p_visitor: visitor(), p_source: SOURCE }).catch(() => {});
    } catch (e) {
      // never affects the page
    }
  }
  function track(event) {
    if (TEST || location.hostname !== "abrahamgersten.github.io") return;
    try {
      rpc("log_story_event", { p_slug: CFG.serial, p_lang: "he", p_event: event, p_visitor: visitor(), p_campaign: null }).catch(() => {});
    } catch (e) {
      // never affects the page
    }
  }

  // what the button sends: { video | image, text, name }
  const item = KIND === "groups"
    ? Promise.resolve({ video: CFG.invite.video, text: CFG.invite.text, name: "sipur-lifnei-hashena.mp4" })
    : rpc("guest_status")
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m || !m.text) return null;
        const arm = /[89ab]/i.test((visitor() || "0").slice(-1)) ? "b" : "a";
        const video = m.video || (m.videos || {})[arm] || null;
        const image = (m.images || {})[arm] || m.image || null;
        return video || image ? { video, image, text: m.text, name: (m.slug || "story") + "-status." + (video ? "mp4" : "jpg") } : null;
      })
      .catch(() => null)
      .then((it) => it || (CFG.statusFallback.image ? { image: CFG.statusFallback.image, text: CFG.statusFallback.text, name: "sipur-status.jpg" } : null));

  let got = null; // the item, once known
  let ready = null; // the File, once it is here
  let loading = null;
  let waiting = false; // the button was tapped before the video arrived
  const rec = { loaded: 0, total: 0 };

  function progress() {
    if (!waiting) return;
    const pct = rec.total ? Math.min(99, Math.round((rec.loaded / rec.total) * 100)) : null;
    btn.textContent = pct === null ? "מכינים את הסרטון..." : `מכינים את הסרטון... ${pct}%`;
  }

  function load() {
    if (loading) return loading;
    rec.loaded = rec.total = 0;
    loading = item
      .then((it) => {
        got = it;
        if (!it) return null;
        return fetch(it.video || it.image).then((r) => {
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
            progress();
            return pump();
          });
          return pump();
        });
      })
      .catch(() => null)
      .then((file) => {
        ready = file && (!canShareFiles || navigator.canShare({ files: [file] })) ? file : null;
        if (!ready) loading = null; // tried again on the next tap
        return ready;
      });
    return loading;
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

  const WHERE = KIND === "status" ? "בוואטסאפ בוחרים למעלה \"הסטטוס שלי\", ושולחים." : "בוואטסאפ בוחרים חברים, משפחה או קבוצות, ושולחים.";

  async function send() {
    track(KIND === "status" ? "status" : "share");
    if (!canShareFiles) {
      step("done-computer");
      // a computer: the file is saved and the text is copied
      saveToComputer(ready);
      const ok = await copy(got.text);
      note(ok ? "הסרטון נשמר במחשב, והמלל הועתק.\nפותחים את וואטסאפ, מצרפים את הסרטון ומדביקים את המלל." : "הסרטון נשמר במחשב. פותחים את וואטסאפ ומצרפים אותו.");
      return;
    }
    note(isApple ? WHERE + "\nהמלל הועתק: מדביקים אותו בלחיצה ארוכה." : WHERE);
    const copied = isApple ? copy(got.text) : Promise.resolve(false); // on this tap, before the menu (iPhone drops the text)
    const attempts = isApple ? [{ files: [ready] }] : [{ files: [ready], text: got.text }, { files: [ready] }];
    for (const data of attempts) {
      try {
        await navigator.share(data);
        note("תודה רבה! 💛");
        step("done");
        return;
      } catch (err) {
        if (err && err.name === "AbortError") { step("cancel"); return; } // closed the share menu: the instructions stay
        if (err && err.name === "NotAllowedError") break; // the wait for the download used up the tap: one more tap works
      }
    }
    await copied;
    step("retry");
    note("הסרטון מוכן. לחצו שוב על הכפתור.");
  }

  btn.addEventListener("click", async () => {
    step("tap");
    if (ready && got) {
      send(); // one synchronous step from the tap: Safari needs that
      return;
    }
    if (waiting) return;
    waiting = true;
    btn.disabled = true;
    progress();
    const file = await load();
    waiting = false;
    btn.disabled = false;
    btn.textContent = LABEL;
    if (!file) {
      step("fail");
      note("לא הצלחנו להכין את הסרטון. בדקו את החיבור לאינטרנט ונסו שוב.");
      return;
    }
    send(); // a short wait usually keeps the tap; when not, send() asks for one more tap
  });

  step("view");
  load(); // the page has one job, so the video starts coming down right away
})();
