"use strict";

/* ---------------------------------------------------------------
   דף סיפור בהמשכים שלם (s/<niche>/) - נוצר ע"י tools/build_serial_page.mjs.
   אברהם, 2026-11-19: "קישור אחד שיכיל את כל הסיפור בהמשכים" (המתנה של שאלון ההורים).
   נגן לכל פרק, רק פרק אחד מתנגן בכל רגע, ובסוף פרק הפרק הבא מתחיל לבד (אלמנט Audio אחד,
   כדי שגם במסך נעול הטלפון יעבור לפרק הבא). "המשך מאיפה שעצרתם" ונקודות הנטישה כמו באתר
   (js/progress.js). המונה: open לסיפור כולו, play/finish לכל פרק (log_story_event, כמו js/story.js).
--------------------------------------------------------------- */
(function () {
  let DATA = {};
  try {
    DATA = JSON.parse(document.getElementById("serial-data").textContent) || {};
  } catch (e) {
    DATA = {};
  }
  const LANG = DATA.lang || "he";

  const COUNTER_URL = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/log_story_event";
  const COUNTER_KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
  const params = new URLSearchParams(location.search);
  const TEST = params.get("t") === "1";
  const CAMPAIGN = (() => {
    const c = (params.get("c") || "").toLowerCase();
    return /^[a-z0-9-]{2,40}$/.test(c) ? c : null;
  })();
  const counted = new Set();

  function visitorId() {
    try {
      let v = localStorage.getItem("zkb_story_visitor");
      if (!v) {
        v = typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
        localStorage.setItem("zkb_story_visitor", v);
      }
      return v;
    } catch (e) {
      return null;
    }
  }

  function track(slug, event) {
    const key = slug + ":" + event;
    if (TEST || !slug || counted.has(key) || location.hostname !== "abrahamgersten.github.io") return;
    counted.add(key);
    try {
      fetch(COUNTER_URL, {
        method: "POST",
        keepalive: true,
        headers: { apikey: COUNTER_KEY, Authorization: "Bearer " + COUNTER_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_slug: slug, p_lang: LANG, p_event: event, p_visitor: visitorId(), p_campaign: CAMPAIGN }),
      }).catch(() => {});
    } catch (e) {
      // never affects the page
    }
  }

  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const players = Array.from(document.querySelectorAll(".player[data-src]")).map((el) => ({
    el,
    slug: el.dataset.slug,
    title: el.dataset.title,
    src: el.dataset.src,
    btn: el.querySelector(".player__btn"),
    seek: el.querySelector(".player__seek"),
    current: el.querySelector(".player__current"),
    duration: el.querySelector(".player__duration"),
    error: el.parentElement.querySelector(".story-player-error"),
    card: el.closest(".serial-chapter"),
    known: null, // the chapter's length, once known
    order: Number(el.dataset.order) || 0,
  }));
  if (!players.length) return;
  // the playing order is the page order, unless the page shows the chapters in another order (data-order, s/wondrous-map/)
  if (players.every((p) => p.order > 0)) players.sort((a, b) => a.order - b.order);

  const audio = new Audio();
  audio.preload = "none";
  let active = null;
  let session = null;
  let seeking = false;
  let lastSave = 0;

  track(DATA.serial, "open");
  document.querySelectorAll("[data-join]").forEach((a) => a.addEventListener("click", () => track(DATA.serial, "join")));
  document.querySelectorAll("[data-share]").forEach((a) => a.addEventListener("click", () => track(DATA.serial, "share")));

  // the length of every chapter right away (metadata only), as on the story page
  players.forEach((p) => {
    const probe = new Audio();
    probe.preload = "metadata";
    probe.addEventListener("loadedmetadata", () => {
      p.known = probe.duration;
      if (p !== active) p.duration.textContent = formatTime(probe.duration);
      const saved = window.ZkbResume ? window.ZkbResume.get(LANG, p.slug) : null;
      if (saved && p !== active) {
        p.current.textContent = formatTime(saved.t);
        p.seek.value = (saved.t / probe.duration) * 100;
      }
    }, { once: true });
    probe.src = p.src;
  });

  function paint() {
    players.forEach((p) => {
      const on = p === active && !audio.paused;
      p.btn.textContent = on ? "❚❚" : "▶";
      p.btn.classList.toggle("is-playing", on);
      p.btn.setAttribute("aria-label", (on ? "השהיית " : "הפעלת ") + p.title);
      if (p.card) p.card.classList.toggle("is-current", p === active);
    });
  }

  function savePlace() {
    if (!active || !window.ZkbResume || !(audio.duration > 0)) return;
    window.ZkbResume.set(LANG, active.slug, audio.currentTime, audio.duration);
  }

  function select(p, fromStart) {
    if (active === p) return;
    if (active) {
      savePlace();
      if (session) session.flush();
    }
    session = null;
    active = p;
    p.error.hidden = true;
    audio.src = p.src;
    const saved = !fromStart && window.ZkbResume ? window.ZkbResume.get(LANG, p.slug) : null;
    if (saved) {
      audio.addEventListener("loadedmetadata", () => {
        audio.currentTime = saved.t;
      }, { once: true });
    }
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: p.title, artist: "זה קרה באמת" });
      } catch (e) {
        // older browsers
      }
    }
  }

  function play(p, fromStart) {
    select(p, fromStart);
    audio.play().catch(() => {
      // autoplay of the next chapter can be blocked when the page is in the background: just show it as paused
      paint();
    });
  }

  players.forEach((p) => {
    p.btn.addEventListener("click", () => {
      if (p === active && !audio.paused) {
        audio.pause();
        return;
      }
      play(p, false);
    });
    p.seek.addEventListener("input", () => {
      seeking = true;
      if (p !== active) select(p, false);
      const d = audio.duration || p.known;
      if (d > 0) {
        p.current.textContent = formatTime((p.seek.value / 100) * d);
      }
    });
    p.seek.addEventListener("change", () => {
      const d = audio.duration || p.known;
      if (d > 0) {
        const t = (p.seek.value / 100) * d;
        if (audio.readyState >= 1) audio.currentTime = t;
        else audio.addEventListener("loadedmetadata", () => { audio.currentTime = t; }, { once: true });
      }
      seeking = false;
    });
  });

  audio.addEventListener("play", () => {
    paint();
    track(active.slug, "play");
    if (window.ZkbNew) window.ZkbNew.seen(LANG, active.slug);
  });
  audio.addEventListener("pause", () => {
    paint();
    savePlace();
    if (session) session.flush();
  });
  audio.addEventListener("loadedmetadata", () => {
    if (active) active.duration.textContent = formatTime(audio.duration);
  });
  audio.addEventListener("timeupdate", () => {
    if (!active) return;
    const d = audio.duration;
    if (!seeking && d > 0) {
      active.seek.value = (audio.currentTime / d) * 100;
      active.current.textContent = formatTime(audio.currentTime);
    }
    if (!session && window.ZkbListen) session = window.ZkbListen.session(active.slug, LANG, "link");
    if (session && !audio.paused) session.time(audio.currentTime, d);
    const now = Date.now();
    if (now - lastSave > 5000) {
      lastSave = now;
      savePlace();
    }
  });
  audio.addEventListener("ended", () => {
    const done = active;
    track(done.slug, "finish");
    if (session) session.end();
    session = null;
    if (window.ZkbResume) window.ZkbResume.clear(LANG, done.slug);
    done.seek.value = 100;
    const next = players[players.indexOf(done) + 1];
    if (next) {
      play(next, true);
      if (next.card && document.visibilityState === "visible") {
        next.card.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      }
    } else {
      paint();
    }
  });
  audio.addEventListener("error", () => {
    if (active && audio.src) active.error.hidden = false;
    paint();
  });
  window.addEventListener("pagehide", () => {
    savePlace();
    if (session) session.flush();
  });

  if ("mediaSession" in navigator) {
    try {
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        const next = active && players[players.indexOf(active) + 1];
        if (next) play(next, true);
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        const prev = active && players[players.indexOf(active) - 1];
        if (prev) play(prev, true);
      });
    } catch (e) {
      // not supported
    }
  }

  paint();

  // "play in a row" from the first chapter (the button of s/wondrous-map/)
  window.ZkbSerial = {
    playAll() {
      const first = players[0];
      if (active === first) audio.currentTime = 0;
      play(first, true);
      if (first.card) first.card.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    },
  };
})();
