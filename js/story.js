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
     נספר: open (הדף נפתח), play (התחילו להאזין), finish (הקשיבו עד הסוף), share, join.
     נשלחים רק שם הסיפור, השפה, סוג האירוע ומספר אקראי שהדפדפן שומר אצלו (כדי להבחין בין
     פתיחות לאנשים, ושרענון לא ייספר שוב) - שום פרט מזהה. ערוץ רקע: נכשל בשקט תמיד.
     הכתובת והמפתח הם אלה שב-js/supabase-config.js (מפתח ציבורי; הקובץ הזה אינו מודול ולא יכול לייבא). */
  const COUNTER_URL = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/log_story_event";
  const COUNTER_KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
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
      return null; // גלישה פרטית / אחסון חסום: האירוע נספר בלי מספר
    }
  }

  function track(event) {
    // פעם אחת לכל סוג אירוע בטעינת דף, ורק באתר החי (לא בתצוגה מקומית בזמן פיתוח).
    if (!STORY.slug || counted.has(event) || location.hostname !== "abrahamgersten.github.io") return;
    counted.add(event);
    try {
      fetch(COUNTER_URL, {
        method: "POST",
        keepalive: true, // "join" נשלח רגע לפני שהדף מתחלף
        headers: { apikey: COUNTER_KEY, Authorization: "Bearer " + COUNTER_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_slug: STORY.slug, p_lang: STORY.lang, p_event: event, p_visitor: visitorId() }),
      }).catch(() => {});
    } catch (e) {
      // לעולם לא משפיע על הדף
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
    const audio = new Audio();
    audio.preload = "metadata";
    audio.src = el.dataset.src;

    audio.addEventListener("loadedmetadata", () => {
      seek.max = audio.duration || 0;
      duration.textContent = formatTime(audio.duration);
    });
    audio.addEventListener("timeupdate", () => {
      if (seeking) return;
      seek.value = audio.currentTime;
      current.textContent = formatTime(audio.currentTime);
    });
    audio.addEventListener("play", () => {
      btn.textContent = "⏸";
      btn.classList.add("is-playing");
      btn.setAttribute("aria-label", el.dataset.labelPause);
      if (errorEl) errorEl.hidden = true;
      setMediaSession();
      track("play");
    });
    audio.addEventListener("pause", () => {
      btn.textContent = "▶";
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-label", el.dataset.labelResume);
    });
    audio.addEventListener("ended", () => {
      btn.textContent = "▶";
      btn.classList.remove("is-playing");
      btn.setAttribute("aria-label", el.dataset.labelPlay);
      seek.value = 0;
      current.textContent = "0:00";
      track("finish");
    });
    audio.addEventListener("error", showError);

    function showError() {
      btn.textContent = "▶";
      btn.classList.remove("is-playing");
      if (errorEl) errorEl.hidden = false;
    }

    btn.addEventListener("click", () => {
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
    btn.addEventListener("click", async () => {
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
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    track("open");
    setupPlayer();
    setupMedia();
    setupShare();
    const join = document.querySelector("[data-join]");
    if (join) join.addEventListener("click", () => track("join"));
  });
})();
