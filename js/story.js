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

  // "שתפו": תפריט השיתוף של המכשיר, ובלעדיו וואטסאפ עם שם הסיפור והקישור לדף הזה.
  function setupShare() {
    const btn = document.querySelector("[data-share]");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      const canonical = document.querySelector('link[rel="canonical"]');
      const url = canonical ? canonical.href : location.href.split(/[?#]/)[0];
      const text = btn.dataset.shareText || document.title;
      if (navigator.share) {
        try {
          await navigator.share({ title: document.title, text, url });
          return;
        } catch (e) {
          if (e && e.name === "AbortError") return; // המשתמש סגר את התפריט
        }
      }
      window.open("https://wa.me/?text=" + encodeURIComponent(text + "\n" + url), "_blank", "noopener");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    setupPlayer();
    setupMedia();
    setupShare();
  });
})();
