"use strict";

/* ---------------------------------------------------------------
   דף סיפור בודד לשיתוף (s/<slug>/ ו-en/s/<slug>/) - הדפים עצמם נוצרים
   ע"י tools/build_story_pages.mjs מתוך CATEGORIES שב-js/app.js.
   דף ציבורי: בלי התחברות, בלי נקודות ובלי "נגן ברצף" - רק ההקלטה הזו.
   הנגן, החלפת התמונה וההגדלה מתנהגים כמו ב-js/app.js (setupPlayers,
   setupMediaInteractions), לנגן אחד. הטקסטים שתלויים בשפה מגיעים
   מ-data-* שבדף, כדי שהקובץ הזה ישרת את העברית ואת האנגלית.
--------------------------------------------------------------- */
(function () {
  // נתוני הדף: slug, שפה, וההודעה שכפתור השיתוף שולח. tools/build_story_pages.mjs כותב אותם לדף.
  let STORY = {};
  try {
    STORY = JSON.parse(document.getElementById("story-data").textContent) || {};
  } catch (e) {
    STORY = {};
  }

  /* מונה לכל קישור (אברהם, 2026-10-14: "לראות איזה סיפור נפתח הכי הרבה") - מוצג ב-admin.html.
     נספר: open (הדף נפתח), play (התחילו להאזין), finish (הקשיבו עד הסוף), share (בהודעה), join,
     status (שיתוף בסטטוס) ו-popup (ההזמנה לסטטוס בסוף ההקלטה הוצגה).
     נשלחים רק שם הסיפור, השפה, סוג האירוע ומספר אקראי שהדפדפן שומר אצלו (כדי להבחין בין
     פתיחות לאנשים, ושרענון לא ייספר שוב) - שום פרט מזהה. ערוץ רקע: נכשל בשקט תמיד.
     הכתובת והמפתח הם אלה שב-js/supabase-config.js (מפתח ציבורי; הקובץ הזה אינו מודול ולא יכול לייבא). */
  const COUNTER_URL = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/log_story_event";
  const COUNTER_KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
  const counted = new Set();
  // קמפיין (אברהם, 2026-10-25): קישור עם ?c=<קוד> נספר גם תחת הקמפיין, למשל הקישור שבסטטוס.
  const CAMPAIGN = (() => {
    const c = (new URLSearchParams(location.search).get("c") || "").toLowerCase();
    return /^[a-z0-9-]{2,40}$/.test(c) ? c : null;
  })();

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
      return null; // גלישה פרטית / אחסון חסום: האירוע נספר בלי מספר
    }
  }

  // &t=1 = בדיקה של אברהם (מיגרציה 0019): הדף עובד כרגיל ולא נספר.
  const TEST = new URLSearchParams(location.search).get("t") === "1";

  function track(event) {
    // פעם אחת לכל סוג אירוע בטעינת דף, ורק באתר החי (לא בתצוגה מקומית בזמן פיתוח).
    if (TEST || !STORY.slug || counted.has(event) || location.hostname !== "abrahamgersten.github.io") return;
    counted.add(event);
    try {
      fetch(COUNTER_URL, {
        method: "POST",
        keepalive: true, // "join" נשלח רגע לפני שהדף מתחלף
        headers: { apikey: COUNTER_KEY, Authorization: "Bearer " + COUNTER_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_slug: STORY.slug, p_lang: STORY.lang, p_event: event, p_visitor: visitorId(), p_campaign: CAMPAIGN }),
      }).catch(() => {});
    } catch (e) {
      // לעולם לא משפיע על הדף
    }
  }

  /* A/B on the invitation to a gift story (Avraham, 2026-11-17). On the page that goes out to the WhatsApp groups (not
     the one opened from a status: that one keeps its "join the group" ending), half of the browsers hear his invitation
     BEFORE the story (a) and half AFTER it (b). The invitation is a short recording of its own, played on the same player
     before or after the story, so no story file is duplicated. STORY.invite = { before, after, plain, link } comes from
     tools/build_story_pages.mjs. What is measured: who goes on to the gift link (the "enter" step is counted there, by
     js/guest.js, with the letter kept here). ?ab=a / ?ab=b shows one of them, for looking at it. */
  const FROM_STATUS = new URLSearchParams(location.search).get("from") === "status";
  const INVITE = !FROM_STATUS && STORY.invite && STORY.invite.plain ? STORY.invite : null;
  const ARM = INVITE ? (() => {
    const forced = new URLSearchParams(location.search).get("ab");
    if (forced === "a" || forced === "b") return forced;
    const pick = () => (Math.random() < 0.5 ? "a" : "b");
    try {
      let v = localStorage.getItem("zkb_ab_story");
      if (v !== "a" && v !== "b") {
        v = pick();
        localStorage.setItem("zkb_ab_story", v);
      }
      return v;
    } catch (e) {
      return pick(); // private browsing: a letter for this visit
    }
  })() : null;
  const abSent = new Set();
  function ab(event) {
    if (!ARM || TEST || abSent.has(event) || location.hostname !== "abrahamgersten.github.io") return;
    abSent.add(event);
    try {
      fetch(COUNTER_URL.replace("log_story_event", "ab_event"), {
        method: "POST",
        keepalive: true, // "click" goes out as the page changes
        headers: { apikey: COUNTER_KEY, Authorization: "Bearer " + COUNTER_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_test: "story", p_variant: ARM, p_event: event, p_slug: STORY.slug, p_visitor: visitorId() }),
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

  function setupPlayer() {
    const el = document.querySelector(".player[data-src]");
    if (!el) return;
    const btn = el.querySelector(".player__btn");
    const seek = el.querySelector(".player__seek");
    const current = el.querySelector(".player__current");
    const duration = el.querySelector(".player__duration");
    const errorEl = document.querySelector(".story-player-error");
    let seeking = false;

    // metadata בלבד: אורך ההקלטה מוצג מיד, וההקלטה עצמה יורדת רק בלחיצה על "נגן".
    // סיומות (אברהם, 2026-10-20): מי שהגיע מהקישור שבסטטוס (?from=status) שומע את ההזמנה לקבוצה;
    // כל השאר - את ההזמנה להפיץ (data-src). באתר המלא אין סיומות.
    const fromStatus = FROM_STATUS;
    const audio = new Audio();
    audio.preload = "metadata";
    // with the gift invitation (INVITE) the story plays as it is on the site, and the invitation comes before or after it
    audio.src = (fromStatus && el.dataset.srcStatus) || (INVITE ? INVITE.plain : el.dataset.src);
    // the invitation that is playing now on this same element: "intro" (before the story) or "outro" (after it). One
    // element for all of it, so a phone with its screen locked goes from one file to the next (as "play in a row" does).
    let clip = null;
    let introDone = false;
    let afterClip = null; // what waits for the invitation after the story to end (the "check yourself" question)
    function startClip(kind) {
      clip = kind;
      seek.disabled = true;
      audio.src = kind === "intro" ? INVITE.before : INVITE.after;
      audio.play().catch((e) => {
        if (e && e.name !== "AbortError") endClip(false);
      });
    }
    function endClip(played) {
      if (!clip) return;
      const kind = clip;
      clip = null;
      seek.disabled = false;
      if (played) ab("invite");
      audio.src = INVITE.plain;
      if (kind === "intro") {
        introDone = true;
        audio.play().catch((e) => {
          if (e && e.name !== "AbortError") showError();
        });
      } else {
        btn.textContent = "▶";
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", el.dataset.labelPlay);
        if (afterClip) {
          const f = afterClip;
          afterClip = null;
          f();
        }
      }
    }
    // the "check yourself" question (js/quiz.js) stops the recording while it is read
    window.zkbPauseMain = () => {
      if (!audio.paused) audio.pause();
    };

    // "המשך מאיפה שעצרתם" (אברהם, 2026-10-23) ומדידת ההאזנה לנקודות הנטישה - js/progress.js.
    // אותו מקום שמור כמו באתר המלא, לפי ההקלטה והשפה.
    const lang = STORY.lang === "en" ? "en" : "he";
    let resumeAt = 0;
    let savedAt = -1;
    let session = null;
    const saved = window.ZkbResume && STORY.slug ? window.ZkbResume.get(lang, STORY.slug) : null;
    if (saved) {
      resumeAt = saved.t;
      seek.max = saved.d;
      seek.value = saved.t;
      current.textContent = formatTime(saved.t);
      duration.textContent = formatTime(saved.d);
      btn.setAttribute("aria-label", el.dataset.labelResume);
      el.classList.add("player--resume");
    }
    function savePlace(force) {
      if (!window.ZkbResume || !STORY.slug || !(audio.duration > 0)) return;
      if (!force && Math.abs(audio.currentTime - savedAt) < 5) return;
      savedAt = audio.currentTime;
      window.ZkbResume.set(lang, STORY.slug, audio.currentTime, audio.duration);
    }
    const leave = () => {
      savePlace(true);
      if (session) session.flush();
    };
    window.addEventListener("pagehide", leave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") leave();
    });

    audio.addEventListener("loadedmetadata", () => {
      if (clip) return; // the bar and the times belong to the story
      seek.max = audio.duration || 0;
      duration.textContent = formatTime(audio.duration);
      if (resumeAt > 0 && resumeAt < audio.duration) audio.currentTime = resumeAt;
      resumeAt = 0;
    });
    audio.addEventListener("timeupdate", () => {
      if (seeking || clip) return;
      seek.value = audio.currentTime;
      current.textContent = formatTime(audio.currentTime);
      if (!audio.paused) {
        savePlace(false);
        if (session) session.time(audio.currentTime, audio.duration);
      }
    });
    audio.addEventListener("play", () => {
      btn.textContent = "⏸";
      btn.classList.add("is-playing");
      btn.setAttribute("aria-label", el.dataset.labelPause);
      if (errorEl) errorEl.hidden = true;
      setMediaSession();
      track("play");
      ab("start");
      if (clip) return; // the invitation: the story's listening is measured from the story itself
      warmStatusPicture();
      if (STORY.video && window.ZkbShareSheet && window.ZkbShareSheet.warmVideo) window.ZkbShareSheet.warmVideo(STORY.video, STORY.slug);
      if (!session && window.ZkbListen && STORY.slug) session = window.ZkbListen.session(STORY.slug, lang, fromStatus ? "status" : "link");
      if (window.ZkbNew && STORY.slug) window.ZkbNew.seen(lang, STORY.slug);
    });
    audio.addEventListener("pause", () => {
      btn.textContent = "▶";
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-label", el.dataset.labelResume);
      if (clip) return;
      if (!audio.ended) {
        savePlace(true);
        if (session) session.flush();
      }
    });
    audio.addEventListener("ended", () => {
      if (clip) {
        endClip(true);
        return;
      }
      btn.textContent = "▶";
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-label", el.dataset.labelPlay);
      seek.value = 0;
      current.textContent = "0:00";
      el.classList.remove("player--resume");
      savedAt = -1;
      if (session) {
        session.end();
        session = null;
      }
      if (window.ZkbResume && STORY.slug) window.ZkbResume.clear(lang, STORY.slug);
      track("finish");
      if (!INVITE) {
        inviteToStatus();
        return;
      }
      // the gift invitation (Avraham, 2026-11-17): b hears it now, and the window that invites to the gift story comes
      // up for both. An episode with "check yourself": the question first (after the invitation, so they do not talk
      // over each other), and the window when the questions are closed.
      ab("finish");
      const hasQuiz = !!(STORY.quiz && window.ZkbQuiz);
      const windows = () => {
        if (hasQuiz && openQuiz(false)) document.addEventListener("zkb-quiz-close", () => inviteToGift(), { once: true });
        else inviteToGift();
      };
      if (ARM === "b") {
        if (hasQuiz) afterClip = windows;
        startClip("outro");
        if (!hasQuiz) windows();
      } else windows();
    });
    audio.addEventListener("error", () => {
      if (clip) endClip(false); // the invitation did not load: on with the story
      else showError();
    });

    function showError() {
      btn.textContent = "▶";
      btn.classList.remove("is-playing");
      if (errorEl) errorEl.hidden = false;
    }

    btn.addEventListener("click", () => {
      // a: the first press on a story that was not started yet plays the invitation, and the story follows by itself
      if (!clip && audio.paused && INVITE && ARM === "a" && !introDone && !(audio.currentTime > 0) && !(resumeAt > 0) && !el.classList.contains("player--resume")) {
        startClip("intro");
        return;
      }
      if (audio.paused) {
        // אחרי שגיאת רשת הדפדפן לא מנסה שוב לבד - טוענים מחדש לפני הניגון.
        if (audio.error) audio.load();
        audio.play().catch((e) => {
          if (e && e.name !== "AbortError") showError();
        });
      } else {
        audio.pause();
      }
    });

    seek.addEventListener("input", () => {
      seeking = true;
      current.textContent = formatTime(Number(seek.value));
    });
    seek.addEventListener("change", () => {
      audio.currentTime = Number(seek.value);
      seeking = false;
    });

    // מסך הנעילה / האוזניות: שם הסיפור והתמונה במקום כתובת הדף.
    function setMediaSession() {
      if (!("mediaSession" in navigator) || typeof MediaMetadata !== "function") return;
      const img = document.querySelector(".content-card__main-img");
      navigator.mediaSession.metadata = new MediaMetadata({
        title: el.dataset.title || document.title,
        artist: el.dataset.brand || "",
        artwork: img ? [{ src: img.currentSrc || img.src }] : [],
      });
    }
  }

  function setupMedia() {
    const card = document.querySelector(".content-card");
    const lightbox = document.getElementById("lightbox");
    if (!card || !lightbox) return;
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");
    const mainImg = card.querySelector(".content-card__main-img");
    let lastFocus = null;

    const swapBtn = card.querySelector("[data-swap]");
    if (swapBtn && mainImg) {
      swapBtn.addEventListener("click", () => {
        const thumbImg = swapBtn.querySelector("img");
        const tmpSrc = mainImg.src;
        mainImg.style.opacity = "0";
        setTimeout(() => {
          mainImg.src = thumbImg.src;
          mainImg.dataset.full = thumbImg.src;
          thumbImg.src = tmpSrc;
          mainImg.style.opacity = "1";
        }, 120);
      });
    }

    function openLightbox() {
      lastFocus = document.activeElement;
      lightboxImg.src = mainImg.dataset.full || mainImg.src;
      lightboxImg.alt = mainImg.alt;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
    }
    function closeLightbox() {
      lightbox.hidden = true;
      lightboxImg.removeAttribute("src");
      document.body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }
    if (mainImg) {
      mainImg.addEventListener("click", openLightbox);
      mainImg.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox();
        }
      });
    }
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  /* "שתפו" (אברהם, 2026-10-14): נשלחת אותה הודעה שברלה שולח לקבוצות - המלל המסקרן, קישור
     ההאזנה וההזמנה לקבוצה - ואם אפשר, יחד עם תמונת הסיפור. ההודעה עצמה מגיעה מ-STORY.shareText.
     - תפריט השיתוף של המכשיר עם התמונה כקובץ וההודעה ככיתוב (אנדרואיד).
     - באייפון וואטסאפ משמיט את המלל כשמצורף קובץ, ואז ההזמנה לקבוצה הייתה הולכת לאיבוד.
       לכן שם נשלחת ההודעה לבדה; וואטסאפ מציג לה תצוגה מקדימה עם התמונה מתוך הקישור.
     - בלי תפריט שיתוף (מחשב): וואטסאפ עם ההודעה מוכנה. */
  function setupShare() {
    const btn = document.querySelector("[data-share]");
    if (!btn) return;
    const text = STORY.shareText || document.title;
    const img = document.querySelector(".content-card__main-img");
    const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let imageFile = null;

    // התמונה מוכנה מראש: navigator.share חייב לרוץ מיד עם הלחיצה, ואי אפשר להוריד אותה רק אז.
    if (img && !isApple && typeof navigator.canShare === "function" && typeof File === "function") {
      const prepare = () => {
        fetch(img.currentSrc || img.src)
          .then((r) => (r.ok ? r.blob() : null))
          .then((blob) => {
            if (!blob) return;
            const type = blob.type || "image/jpeg";
            const file = new File([blob], (STORY.slug || "story") + (type === "image/png" ? ".png" : ".jpg"), { type });
            if (navigator.canShare({ files: [file] })) imageFile = file;
          })
          .catch(() => {});
      };
      if (img.complete && img.naturalWidth) prepare();
      else img.addEventListener("load", prepare, { once: true });
    }

    const whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(text);
    // סיפור עם תמונת סטטוס: קודם שואלים - בהודעה (כאן) או בסטטוס (js/share-sheet.js)
    btn.addEventListener("click", () => {
      if (STORY.video && window.ZkbShareSheet && window.ZkbShareSheet.shareVideo) {
        // a joke: the video with the text (js/share-sheet.js); a computer: WhatsApp with the text and this page
        track("share");
        const title = document.querySelector(".content-card__title");
        window.ZkbShareSheet.shareVideo({ title: title ? title.textContent : "", slug: STORY.slug, video: STORY.video, poster: img ? img.currentSrc || img.src : "",
          text, onFallback: () => window.open("https://wa.me/?text=" + encodeURIComponent(`${window.ZkbShareSheet.withGroupLink(text)}\n\n${location.href.split(/[?#]/)[0]}`), "_blank", "noopener") });
        return;
      }
      if (STORY.status && window.ZkbShareSheet) {
        window.ZkbShareSheet.choose(statusOptions({ onMessage: shareAsMessage }));
        return;
      }
      shareAsMessage();
    });

    shareMessageFn = shareAsMessage;
    async function shareAsMessage() {
      track("share");
      if (typeof navigator.share !== "function") {
        window.open(whatsappUrl, "_blank", "noopener");
        return;
      }
      for (const data of imageFile ? [{ files: [imageFile], text }, { text }] : [{ text }]) {
        try {
          await navigator.share(data);
          return;
        } catch (e) {
          if (e && e.name === "AbortError") return; // המשתמש סגר את התפריט
        }
      }
      location.href = whatsappUrl; // תפריט השיתוף נכשל; חלון חדש כבר ייחסם אחרי ההמתנה
    }
  }

  function statusOptions(extra) {
    const title = document.querySelector(".content-card__title");
    return Object.assign({ title: title ? title.textContent : "", slug: STORY.slug, status: STORY.status, track }, extra);
  }

  /* הזמנה לשתף בסוף ההקלטה (אברהם, 2026-10-19 על "הרב מרדכי אליהו והחתול"; מ-2026-10-21 בכל הקלטה:
     "בסוף כל השמעה של פרק ... חלון שמציע לשתף את הסיפור בהודעה או בסטטוס"). בסוף ולא בפתיחת הדף,
     כדי לא לעצור את ההאזנה. אחרי כל השמעה, בכל פעם (אברהם, 2026-10-21: "אני רוצה שזה יקפוץ אחרי כל השמעה"). */
  let shareMessageFn = null; // setupShare() שם כאן את השיתוף בהודעה
  // תמונת הסטטוס יורדת כבר כשההאזנה מתחילה: כשהסיפור נגמר היא מוכנה, ותפריט השיתוף נפתח
  // מיד בלחיצה (באייפון, המתנה להורדה אחרי הלחיצה מבטלת את ההרשאה לפתוח אותו).
  let warmed = false;
  function warmStatusPicture() {
    if (warmed || !STORY.status) return;
    warmed = true;
    fetch(STORY.status.image).catch(() => {});
  }

  // a joke's page (s/joke-NN/): the invitation once in 10 jokes played to the end, the same count as the site (js/app.js)
  function jokeInviteDue() {
    try {
      const n = (parseInt(localStorage.getItem("zkb_jokes_finished") || "0", 10) || 0) + 1;
      localStorage.setItem("zkb_jokes_finished", String(n));
      return n % 10 === 0;
    } catch (e) {
      return false;
    }
  }

  // "check yourself" on a Yedani episode's page (Avraham, 2026-11-10), as on the site: from the button the question is
  // read at once; at the end of the recording it comes instead of the share invitation, and offers the share at its end
  function openQuiz(autoplay) {
    if (!STORY.quiz || !window.ZkbQuiz) return false;
    const title = document.querySelector(".content-card__title");
    const share = document.querySelector("[data-share]");
    window.ZkbQuiz.open({ title: title ? title.textContent : "", quiz: STORY.quiz, autoplay, onShare: share ? () => share.click() : null });
    return true;
  }

  function inviteToStatus() {
    if (openQuiz(false)) return;
    if (!window.ZkbShareSheet) return;
    if (/^joke-\d/.test(STORY.slug || "") && !jokeInviteDue()) return;
    track("popup");
    window.ZkbShareSheet.invite(statusOptions({ isStory: STORY.kind !== "recording", onMessage: () => shareMessageFn && shareMessageFn() }));
  }

  /* The window at the end of the story on the page that goes out to the groups (Avraham, 2026-11-17, his wording):
     an invitation to the gift story, and a button to the site's gift link. It replaces the "share it" window there. */
  let giftRoot = null;
  function inviteToGift() {
    if (!INVITE) return;
    track("popup");
    ab("popup");
    if (!giftRoot) {
      giftRoot = document.createElement("div");
      giftRoot.className = "lightbox share-sheet gift-sheet";
      giftRoot.hidden = true;
      document.body.appendChild(giftRoot);
      giftRoot.addEventListener("click", (e) => {
        if (e.target === giftRoot || e.target.closest("[data-gift-close]")) closeGift();
        if (e.target.closest("[data-gift-go]")) ab("click");
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !giftRoot.hidden) closeGift();
      });
    }
    const href = INVITE.link + (TEST ? "&t=1" : "");
    giftRoot.innerHTML = `<div class="share-sheet__card" role="dialog" aria-modal="true" aria-labelledby="gift-invite-title">
      <button class="share-sheet__close" type="button" data-gift-close aria-label="סגירה">✕</button>
      <h2 class="share-sheet__title" id="gift-invite-title">נהניתם מהסיפור? רוצים לקבל סיפור נוסף במתנה?</h2>
      <p class="gift-sheet__text"><strong>זה פשוט מאוד!</strong> היכנסו לקישור המצורף בהודעה, לחצו על כפתור השיתוף באתר ושתפו את הסיפור שזה עתה שמעתם בסטטוס שלכם.</p>
      <p class="gift-sheet__text">לאחר השיתוף תוכלו לקבל מאיתנו סיפור נוסף במתנה!</p>
      <div class="share-sheet__actions">
        <a class="btn btn--primary share-sheet__primary" href="${href}" data-gift-go>לקבלת הסיפור במתנה</a>
        <button class="share-sheet__link" type="button" data-gift-close>אולי אחר כך</button>
      </div>
    </div>`;
    giftLastFocus = document.activeElement;
    giftRoot.hidden = false;
    document.body.style.overflow = "hidden";
    giftRoot.querySelector("[data-gift-go]").focus();
  }
  let giftLastFocus = null;
  function closeGift() {
    if (!giftRoot || giftRoot.hidden) return;
    giftRoot.hidden = true;
    document.body.style.overflow = "";
    if (giftLastFocus && typeof giftLastFocus.focus === "function") giftLastFocus.focus();
  }

  document.addEventListener("DOMContentLoaded", () => {
    track("open");
    setupPlayer();
    setupMedia();
    setupShare();
    const join = document.querySelector("[data-join]");
    if (join) join.addEventListener("click", () => track("join"));
    const quizBtn = document.querySelector("[data-quiz]");
    if (quizBtn) quizBtn.addEventListener("click", () => openQuiz(true));
  });
})();
