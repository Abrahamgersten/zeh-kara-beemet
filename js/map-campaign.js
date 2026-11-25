"use strict";

/* ---------------------------------------------------------------
   דף ההאזנה של היעד המשותף לקבוצות (s/wondrous-map/) - נוצר ע"י tools/build_map_campaign.mjs.
   אברהם, 2026-11-25: "על כל 100 משתתפים חדשים לשחרר פרק חדש" של "המפה המופלאה".
   באותו ערב: "שהפרק הנוכחי יהיה זה שבולט לעין מייד, שהתמונה תהיה מרובעת כמו בשאר הפרקים, ששאר הפרקים
   יופיעו מתחת, ושיהיה גם את הכפתור של נגן ברצף". השיתוף עצמו עבר לשני דפים פשוטים (share/, status/,
   js/map-share.js), וכאן נשארו רק שני קישורים אליהם.

   אילו פרקים פתוחים וכמה משפחות יש בקבוצות: קובץ מצב קטן (map/state.json במאגר ההקלטות), שמעדכן
   רוני המתכנת/Tools/map_campaign/update.py. לא נקרא: פרק 1, שכתוב בדף עצמו.
   הנגן עצמו הוא js/serial.js, שנטען אחרי שהפרקים נכנסו לדף. סדר ההשמעה הוא לפי data-order
   (פרק 1, 2, 3...), גם כשהפרק החדש מוצג ראשון.
--------------------------------------------------------------- */
(function () {
  let CFG = {};
  try {
    CFG = JSON.parse(document.getElementById("map-config").textContent) || {};
  } catch (e) {
    return;
  }
  const params = new URLSearchParams(location.search);
  // the links of the first version (25.11 noon) opened this page on a share button: they go to the simple pages
  const old = params.get("share");
  if (old === "groups" || old === "status") {
    location.replace("../../" + (old === "groups" ? "share" : "status") + "/");
    return;
  }
  const UP = "../../";
  // every click of the campaign is counted in its own table (Avraham, 26.11; supabase/migrations/0034)
  const TEST = params.get("t") === "1";
  const API = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/";
  const KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz"; // the publishable key, as in js/map-share.js
  const SOURCE = (params.get("c") || "direct").toLowerCase();
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
  function step(action) {
    if (TEST || location.hostname !== "abrahamgersten.github.io") return;
    try {
      fetch(API + "log_map_event", {
        method: "POST",
        keepalive: true,
        headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_action: action, p_visitor: visitor(), p_source: SOURCE }),
      }).catch(() => {});
    } catch (e) {
      // never affects the page
    }
  }
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const num = (n) => Number(n).toLocaleString("he-IL");

  function chapterHTML(ch, i, total, now) {
    const media = ch.image
      ? `<div class="content-card__media"><img class="content-card__main-img" src="${esc(UP + ch.image)}" alt="${esc(ch.title)}" width="1024" height="1024"${now ? ' fetchpriority="high"' : ' loading="lazy"'}></div>`
      : "";
    const row = now && i > 0
      ? `<div class="map-row"><button class="btn btn--outline" type="button" id="map-play-all">נגן ברצף את כל הפרקים הזמינים</button></div>`
      : "";
    return `<article class="content-card is-visible serial-chapter${now ? " serial-now" : ""}" id="${esc(ch.slug)}">${media}
      <div class="content-card__body">
        <span class="content-card__eyebrow">${now && total > 1 ? "הפרק החדש · " : ""}פרק ${i + 1} מתוך ${total}</span>
        <h2 class="content-card__title">${esc(ch.title)}</h2>
        ${ch.description ? `<p class="content-card__desc">${esc(ch.description)}</p>` : ""}
        <div class="player-wrap">
          <div class="player" data-src="${esc(UP + ch.audio)}" data-slug="${esc(ch.slug)}" data-title="${esc(ch.title)}" data-order="${i + 1}">
            <button class="player__btn" type="button" aria-label="הפעלת ${esc(ch.title)}">▶</button>
            <div class="player__body">
              <input class="player__seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="התקדמות ההקראה של ${esc(ch.title)}">
              <div class="player__times"><span class="player__current">0:00</span><span class="player__duration">--:--</span></div>
            </div>
          </div>
          <p class="story-player-error" role="alert" hidden>לא הצלחנו לטעון את ההקלטה. בדקו את החיבור לאינטרנט ונסו שוב.</p>
        </div>${row}
      </div>
    </article>`;
  }

  function paint(state) {
    const total = CFG.total || state.chapters.length;
    const open = state.chapters.length;
    const done = open >= total;
    const goal = Number(CFG.goal) || 0;

    // the newest chapter first and big, the earlier ones under it in their order
    $("map-now").innerHTML = chapterHTML(state.chapters[open - 1], open - 1, total, true);
    const earlier = state.chapters.slice(0, open - 1);
    $("map-chapters").innerHTML = earlier.map((ch, i) => chapterHTML(ch, i, total, false)).join("\n");
    $("map-chapters").hidden = $("map-earlier").hidden = !earlier.length;
    $("serial-data").textContent = JSON.stringify({ serial: CFG.serial, lang: "he", chapters: state.chapters.map((c) => c.slug) });

    const count = Number(state.count) > 0 ? Number(state.count) : null;
    $("map-count").textContent = count ? `אנחנו כבר ${num(count)} משפחות` : "";
    const bar = $("map-bar");
    if (done) {
      $("map-left").textContent = `כל ${total} הפרקים כבר פתוחים. תודה לכל מי שהזמין עוד משפחה!`;
      bar.hidden = true;
      return;
    }
    const nextAt = Number(state.next_at) || 0;
    const left = count && nextAt ? Math.max(1, nextAt - count) : null;
    const toGoal = count && goal > count ? goal - count : null;
    const nextLine = state.left_text ? state.left_text : left
      ? `עוד ${num(left)} משפחות, ופרק ${open + 1} נפתח לכולם.`
      : `כשנגיע ל-${num(nextAt)} משפחות, פרק ${open + 1} נפתח לכולם.`;
    $("map-left").textContent = nextLine + (toGoal ? ` עוד ${num(toGoal)} משפחות, והגענו ליעד.` : "");
    if (count && goal) {
      const start = 2600; // where the count stood when the goal was set
      const pct = Math.max(4, Math.min(100, Math.round(((count - start) / (goal - start)) * 100)));
      bar.hidden = false;
      bar.setAttribute("aria-valuenow", String(pct));
      bar.setAttribute("aria-label", "כמה התקדמנו אל היעד");
      requestAnimationFrame(() => { bar.firstElementChild.style.width = pct + "%"; });
    }
  }

  function startPlayer() {
    const s = document.createElement("script");
    s.src = UP + "js/serial.js?v=2";
    s.onload = () => {
      const all = $("map-play-all");
      if (all && window.ZkbSerial) all.addEventListener("click", () => { step("play-all"); window.ZkbSerial.playAll(); });
    };
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

  // "open" and "join" are counted by js/serial.js for the story counters; here the same and the rest, for the campaign
  step("page-open");
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("[data-step]");
    if (a) step(a.dataset.step);
    const play = e.target.closest && e.target.closest(".player__btn");
    if (play) step("play-ch-" + (play.closest(".player").dataset.order || "0"));
  });
})();
