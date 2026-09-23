"use strict";
// רצועת "התקן את האפליקציה" - גרסה עצמאית דו-לשונית לדפים בלי app.js (login/offer,
// שתי השפות - זיהוי שפה לפי document.documentElement.lang). הלוגיקה זהה לזו
// שב-js/app.js/en/js/app.js (index.html) - כפילות מכוונת כדי לא לגעת בקוד
// שכבר עובד שם; אם מעדכנים משהו כאן, לעדכן גם שם (ולהפך).
// נוצר ע"י רוני המתכנת, 2026-09-23.

function zkbSafeSessionStorage() {
  try {
    const k = "__zkb_test__";
    sessionStorage.setItem(k, "1");
    sessionStorage.removeItem(k);
    return sessionStorage;
  } catch (e) {
    return null;
  }
}
const zkbSessionStore = zkbSafeSessionStorage();

function setupInstallBannerStandalone() {
  const banner = document.getElementById("install-banner");
  if (!banner) return;
  const actionBtn = document.getElementById("install-banner-action");
  const closeBtn = document.getElementById("install-banner-close");
  const subEl = document.getElementById("install-banner-sub");
  const isEn = document.documentElement.lang === "en";

  const ua = navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isMobileUA = isIOS || isAndroid || /Mobi/i.test(ua);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  const dismissKey = isEn ? "zkb-install-dismissed-en" : "zkb-install-dismissed";
  const alreadyDismissedThisVisit = zkbSessionStore && zkbSessionStore.getItem(dismissKey) === "1";

  if (!isMobileUA || isStandalone || alreadyDismissedThisVisit) return;

  let deferredPrompt = null;

  function showBanner() { banner.hidden = false; }
  function hideBanner() { banner.hidden = true; }
  function dismiss() {
    hideBanner();
    if (zkbSessionStore) zkbSessionStore.setItem(dismissKey, "1");
    closeInstructions();
  }

  closeBtn.addEventListener("click", dismiss);

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    subEl.textContent = isEn
      ? "Get to everything with one tap, right from your home screen"
      : "גשו לכל התכנים בלחיצה אחת, ישר מהמסך הראשי";
    showBanner();
  });

  window.addEventListener("appinstalled", () => dismiss());

  const instructions = document.createElement("div");
  instructions.className = "install-steps";
  instructions.innerHTML = isIOS
    ? (isEn
      ? `<button class="install-steps__close" type="button" aria-label="Close">✕</button>
         <h3>How to install on iPhone?</h3>
         <ol>
           <li>Tap the share button ⬆️ in Safari's toolbar</li>
           <li>Scroll and choose "Add to Home Screen"</li>
           <li>Tap "Add" - done, the app is ready!</li>
         </ol>`
      : `<button class="install-steps__close" type="button" aria-label="סגירה">✕</button>
         <h3>איך מתקינים באייפון?</h3>
         <ol>
           <li>הקישו על כפתור השיתוף ⬆️ בסרגל הכלים של Safari</li>
           <li>גללו ובחרו "הוסף למסך הבית" (Add to Home Screen)</li>
           <li>הקישו "הוספה" - וזהו, האפליקציה מוכנה!</li>
         </ol>`)
    : (isEn
      ? `<button class="install-steps__close" type="button" aria-label="Close">✕</button>
         <h3>How to install?</h3>
         <ol>
           <li>Open the browser menu (three dots)</li>
           <li>Choose "Install app" or "Add to Home screen"</li>
           <li>Confirm - done, the app is ready!</li>
         </ol>`
      : `<button class="install-steps__close" type="button" aria-label="סגירה">✕</button>
         <h3>איך מתקינים?</h3>
         <ol>
           <li>פתחו את התפריט (שלוש הנקודות) בדפדפן</li>
           <li>בחרו "התקן אפליקציה" או "הוסף למסך הבית"</li>
           <li>אשרו - וזהו, האפליקציה מוכנה!</li>
         </ol>`);
  document.body.appendChild(instructions);

  function openInstructions() { instructions.classList.add("is-open"); }
  function closeInstructions() { instructions.classList.remove("is-open"); }
  instructions.querySelector(".install-steps__close").addEventListener("click", closeInstructions);

  actionBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice.catch(() => null);
      deferredPrompt = null;
      if (choice && choice.outcome === "accepted") dismiss();
    } else {
      openInstructions();
    }
  });

  if (isIOS) {
    subEl.textContent = isEn
      ? "Add to your home screen and get a real app on your phone"
      : "הוסיפו למסך הבית וקבלו אפליקציה אמיתית לטלפון";
    showBanner();
  } else {
    setTimeout(() => {
      if (!deferredPrompt && banner.hidden) {
        subEl.textContent = isEn ? "Add the app to your home screen" : "הוסיפו את האפליקציה למסך הבית שלכם";
        showBanner();
      }
    }, 2500);
  }
}

setupInstallBannerStandalone();
