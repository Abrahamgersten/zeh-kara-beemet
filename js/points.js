// מערכת נקודות ופרסים יומית ("זה קרה באמת") - מודול ES משותף דו-לשוני
// (בדיוק בדפוס js/install-banner.js: קובץ אחד, זיהוי שפה לפי
// document.documentElement.lang, לא כפילות מלאה כמו js/app.js).
// נוצר ע"י רוני המתכנת, 2026-09-23. ראו הפרוטוקול: "רוני המתכנת\Docs\
// פרוטוקול מערכת הנקודות - זה קרה באמת.md".
//
// initPoints() נקראת רק אחרי ש-guardGatedPage() אישר זכאות (ראו index.html/
// en/index.html) - הווידג'ט לעולם לא בונה תוכן למשתמש לא-מזוהה.

import { getSupabaseClient } from "./auth.js";

const isEn = document.documentElement.lang === "en";

// הקובץ הזה נטען משני עומקי-תיקיה שונים (js/points.js מ-index.html,
// ../js/points.js מ-en/index.html) - נתיב הסאונד נגזר מכתובת המודול עצמו
// (import.meta.url) כדי שיעבוד זהה משני המקומות, לא מכתובת הדף.
// כמה קובצי תשואות שונים (אברהם סיפק 5) - רוטציה אקראית ביניהם בלי חזרה
// על אותו קובץ פעמיים ברצף, כדי שהחגיגה לא תרגיש מונוטונית.
const CHEER_SOUND_SRCS = [1, 2, 3, 4, 5].map(
  (n) => new URL(`../assets/sound/cheer-${n}.mp3`, import.meta.url).href
);
let lastCheerIdx = -1;
function pickCheerSrc() {
  if (CHEER_SOUND_SRCS.length === 1) return CHEER_SOUND_SRCS[0];
  let idx;
  do {
    idx = Math.floor(Math.random() * CHEER_SOUND_SRCS.length);
  } while (idx === lastCheerIdx);
  lastCheerIdx = idx;
  return CHEER_SOUND_SRCS[idx];
}

// בלוני מספרים אמיתיים שאברהם סיפק (תמונות עם הספרה כבר "אפויה" בתוך צורת
// הבלון) - תואמים בדיוק לערכים הנפוצים במערכת (ceil(5/1)=5, ceil(5/2)=3,
// ceil(5/3)=2). לכל ערך אחר (למשל פריט עתידי עם base_points שונה) - בלון
// ירוק גנרי בלי מספר מודפס, עם הערך כטקסט מעוצב שמונח מעליו ב-CSS.
const BALLOON_IMAGES = {
  2: new URL("../assets/images/balloons/balloon-2.png", import.meta.url).href,
  3: new URL("../assets/images/balloons/balloon-3.png", import.meta.url).href,
  5: new URL("../assets/images/balloons/balloon-5.png", import.meta.url).href,
  20: new URL("../assets/images/balloons/balloon-20.png", import.meta.url).href,
};
const GENERIC_BALLOON_SRC = new URL("../assets/images/balloons/balloon-generic.png", import.meta.url).href;

const T = isEn
  ? {
      onboardingTitle: "Want to turn this into a game?",
      onboardingExplain:
        "Checking something off the daily list - like brushing teeth or saying the Shema - earns points, and the whole family collects them together toward a surprise reward. It's a fun, completely optional extra - you can keep using the site without it, and join in whenever you like.",
      onboardingCta: "Add a child to get started",
      eyebrowOptional: "🎈 An optional family game",
      namePlaceholder: "Child's name",
      add: "Add ➕",
      addChildChip: "+ Add a child",
      removeChild: (name) => `🗑️ Remove ${name} from the list`,
      removeConfirm: (name) => `Remove ${name} from the children list? Their history stays saved, but they won't appear in the list anymore.`,
      changeChecklist: "⚙️ Change checklist items",
      pickerTitle: "Choose 3 checklist items",
      pickerExplain: "Pick exactly 3 items to promote at home. You can change this anytime.",
      pickerCount: (n) => `Selected: ${n} of 3`,
      pickerAddCustom: "+ Write your own",
      pickerCustomPlaceholder: "e.g. Fed the fish",
      pickerSave: "Save",
      pickerCancel: "Cancel",
      cancel: "Cancel",
      pointsLabel: "Your points",
      of: "of",
      nextReward: "Next reward",
      hintLocked: (n) => `${n} points to go and the new story unlocks!`,
      noRewardHint: "Your points are waiting for the next surprise 🤫",
      ctaLocked: (n) => `${n} points to go 🔒`,
      noRewardTitle: "A new surprise, coming soon 🤫",
      noRewardText:
        "There's no new story queued up as a surprise just yet - but we hope there will be soon! In the meantime, keep collecting points, and the moment a new surprise is ready, it'll be waiting for you.",
      cheers: [
        "Amazing!", "You're a champion!", "Way to go!", "Fantastic!", "Awesome job!",
        "So proud of you!", "You're a star!", "Keep it up!", "Wonderful!", "Nailed it!",
      ],
      celebrateTitle: "You did it! 🎉",
      celebrateCta: "Open the reward 🎁",
      celebrateClose: "Close",
      prepTitle: "🗓️ Getting ready for Shabbat?",
      prepSteps: [
        `🎧 Listen to "Idea from the Parsha"`,
        "🖨️ Print the attached page",
        "📖 Read it together at the Shabbat table",
      ],
      prepNote: "On Sunday you'll be able to check it off and earn points! 🎈",
    }
  : {
      onboardingTitle: "רוצים להפוך את זה למשחק?",
      onboardingExplain:
        "כל סימון ברשימה היומית - כמו צחצוח שיניים או אמירת קריאת שמע - מזכה בנקודות, וכל המשפחה צוברת אותן יחד לקראת פרס מפתיע. זו תוספת כיפית ולגמרי אופציונלית - אפשר להמשיך להשתמש באתר גם בלעדיה, ולהצטרף למשחק מתי שבא לכם.",
      onboardingCta: "הוסיפו ילד/ה כדי להתחיל",
      eyebrowOptional: "🎈 משחק משפחתי אופציונלי",
      namePlaceholder: "שם הילד/ה",
      add: "הוספה ➕",
      addChildChip: "+ הוסיפו ילד/ה",
      removeChild: (name) => `🗑️ הסרת ${name} מהרשימה`,
      removeConfirm: (name) => `להסיר את ${name} מרשימת הילדים? ההיסטוריה שלו/ה תישמר, אבל הוא/היא לא יופיע/תופיע יותר ברשימה.`,
      changeChecklist: "⚙️ שנו רובריקות",
      pickerTitle: "בחרו 3 רובריקות",
      pickerExplain: "בחרו בדיוק 3 רובריקות לקדם בבית. אפשר לשנות את הבחירה בכל שלב.",
      pickerCount: (n) => `נבחרו: ${n} מתוך 3`,
      pickerAddCustom: "+ הוסיפו רובריקה משלכם",
      pickerCustomPlaceholder: "לדוגמה: האכלתי את הדגים",
      pickerSave: "שמרו",
      pickerCancel: "ביטול",
      cancel: "ביטול",
      pointsLabel: "הנקודות שלכם",
      of: "מתוך",
      nextReward: "הפרס הבא",
      hintLocked: (n) => `עוד ${n} נקודות והסיפור החדש נפתח!`,
      noRewardHint: "הנקודות ממתינות להפתעה הבאה 🤫",
      ctaLocked: (n) => `עוד ${n} נקודות 🔒`,
      noRewardTitle: "בקרוב, הפתעה חדשה 🤫",
      noRewardText:
        "טרם עלה סיפור בהמשכים חדש שיוכל לשמש הפתעה - אך אנחנו מקווים שזה יקרה בקרוב! בינתיים אפשר להמשיך לצבור נקודות, וברגע שתהיה הפתעה חדשה, היא תחכה לכם.",
      cheers: [
        "כל הכבוד!", "אליפות!", "אין עליך בעולם!", "מדהים!", "איזה יופי!",
        "וואו, ישר כוח!", "פשוט מושלם!", "איזה כיף!", "כל הכבוד לך!", "מעולה!",
      ],
      celebrateTitle: "הצלחתם! 🎉",
      celebrateCta: "לצפייה בפרס 🎁",
      celebrateClose: "סגירה",
      prepTitle: "🗓️ מתכוננים לשבת?",
      prepSteps: [
        `🎧 הקשיבו ל"רעיון בפרשה"`,
        "🖨️ הדפיסו את הדף המצורף",
        "📖 קראו אותו יחד בשולחן השבת",
      ],
      prepNote: "ביום ראשון תוכלו לסמן שעשיתם את זה ולזכות בנקודות! 🎈",
    };

let state = null;
let activeChildId = null;
let showInlineAddChild = false;
let widgetEl = null;
let celebrateEl = null;
let encourageTimer = null;
let pickerEl = null;
let pickerSelected = null; // Set<string> של item-id-ים, רק כשהבורר פתוח
let pickerShowAddCustom = false;
let lastKnownDateStr = null; // ראו jerusalemDateString()/refreshIfDateRolledOver()

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// יום בשבוע לפי שעון ישראל (0=ראשון..6=שבת), לא לפי שעון הדפדפן - כדי
// שיישאר עקבי עם family_today() בשרת (Asia/Jerusalem) גם למשפחה שגולשת
// מחו"ל. משמש רק להצגה (מתי מופיע כפתור/הסבר דיווח "רעיון בפרשה"), לא
// לחישוב נקודות - שם התאריך תמיד נקבע בשרת.
const WEEKDAY_MAP = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
function jerusalemDayOfWeek() {
  const short = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", weekday: "short" }).format(new Date());
  return WEEKDAY_MAP[short];
}

// "YYYY-MM-DD" לפי שעון ישראל - להשוואה זולה (מחרוזת) בלי לבנות Date חדש בכל
// פעם. en-CA הוא טריק תקין: זו הלוקאל היחידה שפורמט ברירת המחדל שלה הוא
// כבר ISO (YYYY-MM-DD), בלי צורך ב-formatToParts.
function jerusalemDateString() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jerusalem" }).format(new Date());
}

function label(item) {
  return isEn ? item.label_en : item.label_he;
}
function title(reward) {
  return isEn ? reward.title_en : reward.title_he;
}
function desc(reward) {
  return isEn ? reward.description_en : reward.description_he;
}
function linkUrl(reward) {
  return isEn ? reward.link_url_en : reward.link_url_he;
}

function isCheckedToday(childId, itemId) {
  return state.checked_today.some((c) => c.child_id === childId && c.item_id === itemId);
}

function playCheerSound() {
  try {
    const audio = new Audio(pickCheerSrc());
    audio.play().catch(() => {});
  } catch (e) {
    // נכשל בשקט (למשל דפדפן חוסם אודיו לפני אינטראקציה) - בלי שגיאת קונסול.
  }
}

/* ---------------------------------------------------------------
   Rendering
--------------------------------------------------------------- */
// state.children תמיד ריק כשהפונקציה הזו מרונדרת (renderWidget() עובר
// לתצוגת הצ'קליסט המלאה מיד ברגע שיש ולו ילד אחד - ראו שם) - אין צורך
// ברשימת-צ'יפים/כפתור-"סיימנו" כאן, הטופס הזה תמיד לילד הראשון בלבד.
function onboardingHTML() {
  return `
    <div class="points-onboarding">
      <span class="points-onboarding__emoji" aria-hidden="true">🎈</span>
      <h2 class="points-onboarding__title">${T.onboardingTitle}</h2>
      <p class="points-onboarding__explain">${T.onboardingExplain}</p>
      <p class="points-onboarding__cta">${T.onboardingCta}</p>
      <form class="points-onboarding__form" data-add-child-form>
        <input class="auth-card__input" type="text" name="childName" placeholder="${T.namePlaceholder}" required maxlength="40">
        <button class="btn btn--primary" type="submit">${T.add}</button>
      </form>
    </div>`;
}

function tabsHTML() {
  const tabs = state.children
    .map(
      (c) => `
      <button class="points-child-tab${c.id === activeChildId ? " is-active" : ""}" type="button"
        role="tab" aria-selected="${c.id === activeChildId}" data-child-id="${c.id}">${esc(c.name)}</button>`
    )
    .join("");
  const addChip = showInlineAddChild
    ? `
      <form class="points-child-tabs__add-form" data-add-child-form>
        <input class="auth-card__input points-child-tabs__add-input" type="text" name="childName" placeholder="${T.namePlaceholder}" required maxlength="40" autofocus>
        <button class="btn btn--outline points-child-tabs__add-submit" type="submit">${T.add}</button>
        <button class="points-child-tabs__add-cancel" type="button" aria-label="${T.cancel}" data-cancel-add-child>✕</button>
      </form>`
    : `<button class="points-child-tab points-child-tab--add" type="button" data-add-child>${T.addChildChip}</button>`;
  return `<div class="points-child-tabs" role="tablist">${tabs}${addChip}</div>`;
}

function removeChildRowHTML() {
  const child = state.children.find((c) => c.id === activeChildId);
  const removeBtn = child
    ? `<button class="points-remove-child" type="button" data-remove-child="${child.id}">${T.removeChild(esc(child.name))}</button>`
    : "";
  return `
    <div class="points-widget__controls">
      ${removeBtn}
      <button class="points-remove-child" type="button" data-open-picker>${T.changeChecklist}</button>
    </div>`;
}

function checklistHTML() {
  const items = state.checklist_items.filter((i) => i.category === "daily");
  const rows = items
    .map((item) => {
      const checked = isCheckedToday(activeChildId, item.id);
      return `
      <li class="points-checklist__item" data-item-id="${item.id}" data-item-key="${item.item_key}">
        <button class="points-checkbox" type="button" aria-pressed="${checked}" data-checkbox>
          <span class="points-checkbox__circle${checked ? " is-checked" : ""}" aria-hidden="true">✓</span>
          <span class="points-checkbox__icon" aria-hidden="true">${item.icon || "⭐"}</span>
          <span class="points-checkbox__label">${esc(label(item))}</span>
          <span class="points-checkbox__value">+${item.points_today}</span>
        </button>
      </li>`;
    })
    .join("");
  return `<ul class="points-checklist" data-active-child="${activeChildId || ""}">${rows}</ul>`;
}

function progressHTML() {
  const reward = state.next_reward;
  if (!reward) {
    return `
      <div class="points-progress">
        <div class="points-progress__head">
          <span class="points-progress__label">${T.pointsLabel}</span>
          <span class="points-progress__count"><strong>${state.cycle_points}</strong></span>
        </div>
        <p class="points-progress__hint" data-encourage-slot>${T.noRewardHint}</p>
      </div>`;
  }
  const pct = Math.min(100, Math.round((state.cycle_points / reward.threshold_points) * 100));
  const hint = T.hintLocked(Math.max(0, reward.threshold_points - state.cycle_points));
  return `
    <div class="points-progress">
      <div class="points-progress__head">
        <span class="points-progress__label">${T.pointsLabel}</span>
        <span class="points-progress__count"><strong>${state.cycle_points}</strong> ${T.of} <strong>${reward.threshold_points}</strong></span>
      </div>
      <div class="points-progress__track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="points-progress__fill" style="width:${pct}%"></div>
      </div>
      <p class="points-progress__hint" data-encourage-slot>${esc(hint)}</p>
    </div>`;
}

// כאן reward (כשקיים) תמיד "בתהליך" - ברגע שהמשפחה חוצה את הסף, ה-RPC של
// toggle_checkin עצמו מממש את הפרס וממחזר מיד לקראת הבא (ראו handleChecklistToggle) -
// אין יותר מצב "פתוח, ממתין ללחיצה" מתמשך כמו במודל הישן; הרגע הזה מטופל
// כולו ע"י חגיגת celebrate().
function rewardHTML() {
  const reward = state.next_reward;
  if (!reward) {
    return `
      <div class="points-reward points-reward--pending">
        <div class="points-reward__art"><div class="cover-placeholder">🔭</div></div>
        <div class="points-reward__body">
          <span class="points-reward__eyebrow">${T.nextReward}</span>
          <h3 class="points-reward__title">${T.noRewardTitle}</h3>
          <p class="points-reward__desc">${T.noRewardText}</p>
        </div>
      </div>`;
  }
  const cover = reward.image_url
    ? `<img src="${reward.image_url}" alt="">`
    : `<div class="cover-placeholder">🎁</div>`;
  const remaining = Math.max(0, reward.threshold_points - state.cycle_points);
  return `
    <div class="points-reward points-reward--locked">
      <div class="points-reward__art">${cover}<span class="points-reward__lock" aria-hidden="true">🔒</span></div>
      <div class="points-reward__body">
        <span class="points-reward__eyebrow">${T.nextReward}</span>
        <h3 class="points-reward__title">${esc(title(reward))}</h3>
        <p class="points-reward__desc">${esc(desc(reward) || "")}</p>
        <button class="btn btn--outline points-reward__cta" type="button" disabled>${T.ctaLocked(remaining)}</button>
      </div>
    </div>`;
}

function renderWidget() {
  if (!widgetEl) return;
  if (!state.children.length) {
    widgetEl.innerHTML = onboardingHTML();
    return;
  }
  if (!activeChildId || !state.children.some((c) => c.id === activeChildId)) {
    activeChildId = state.children[0].id;
  }
  widgetEl.innerHTML = `
    <p class="section-eyebrow points-widget__eyebrow">${T.eyebrowOptional}</p>
    ${tabsHTML()}
    ${removeChildRowHTML()}
    ${checklistHTML()}
    <div class="points-progress-host">${progressHTML()}</div>
    <div class="points-reward-host">${rewardHTML()}</div>`;
}

function parashaPrepHTML() {
  return `
    <div class="parasha-prep">
      <p class="parasha-prep__title">${T.prepTitle}</p>
      <ol class="parasha-prep__steps">
        ${T.prepSteps.map((s) => `<li>${s}</li>`).join("")}
      </ol>
      <p class="parasha-prep__note">${T.prepNote}</p>
    </div>`;
}

/* ---------------------------------------------------------------
   "רעיון בפרשה" - שורות דיווח לכל ילד, בכל div[data-report-item-key]
   שקיים בעמוד (מרונדר ע"י js/app.js דרך pdfReportHTML - ריק כברירת
   מחדל, מתמלא רק אם קיים פריט תואם בקטלוג). נשאר ריק כל עוד אין
   עדיין תוכן "רעיון בפרשה" אמיתי.
   מחזור שבועי (לפי יום בשבוע בשעון ישראל, ראו jerusalemDayOfWeek):
   ראשון - הרובריקה עצמה (מסמנים שקראו על שולחן השבת שעבר). רביעי-שבת -
   הכנה: מה צריך לעשות כדי שיהיה מה לסמן בראשון. שני-שלישי - כלום (בין
   מחזור לסיומו לבין הכנת המחזור הבא).
--------------------------------------------------------------- */
function renderParashaReports() {
  if (!state) return;
  const day = jerusalemDayOfWeek();
  document.querySelectorAll("[data-report-item-key]").forEach((host) => {
    const key = host.dataset.reportItemKey;
    const item = state.checklist_items.find((i) => i.item_key === key && i.category === "parasha");
    if (!item || !state.children.length) {
      host.innerHTML = "";
      return;
    }
    if (day >= 3) {
      // רביעי(3)-שבת(6): עדיין לא ראשון - מציגים הכנה, לא כפתור סימון.
      host.innerHTML = parashaPrepHTML();
      return;
    }
    if (day !== 0) {
      // שני(1)/שלישי(2): לא ראשון ולא עוד בטווח ההכנה - כלום.
      host.innerHTML = "";
      return;
    }
    host.innerHTML = `
      <ul class="points-checklist points-checklist--report">
        ${state.children
          .map((c) => {
            const checked = isCheckedToday(c.id, item.id);
            return `
          <li class="points-checklist__item" data-item-id="${item.id}" data-item-key="${item.item_key}" data-child-id="${c.id}">
            <button class="points-checkbox points-checkbox--report" type="button" aria-pressed="${checked}" data-report-checkbox>
              <span class="points-checkbox__circle${checked ? " is-checked" : ""}" aria-hidden="true">✓</span>
              <span class="points-checkbox__label">${esc(c.name)}</span>
              <span class="points-checkbox__value">+${item.points_today}</span>
            </button>
          </li>`;
          })
          .join("")}
      </ul>`;
  });
}

function renderAll() {
  renderWidget();
  renderParashaReports();
}

/* ---------------------------------------------------------------
   מיקרו-אינטראקציה: פיל "+N"/"-N", פרגון עידוד, סימון-פופ, סאונד
--------------------------------------------------------------- */
// "בלון הליום" - במקום לרחף מעט ליד התיבה שסומנה, הנקודות "נפרדות" מהרובריקה
// לגמרי (position:fixed על document.body, לא ילד של הכפתור) וטסות אל מרכז-
// למעלה של המסך עד שנעלמות מעבר לקצה העליון, כאילו המשיכו לעלות.
function floatPointsNear(el, delta) {
  if (!el || delta <= 0) return;
  const rect = el.getBoundingClientRect();
  const bx = rect.left + rect.width / 2;
  const by = rect.top + rect.height / 2;
  // סחיפה כללית לכיוון אמצע המסך (לא רק כלפי מעלה) - הכיוון וההיקף שלה
  // תלויים באיפה בדיוק סומן, אז מחושבים כאן ולא בקבועי ה-CSS.
  const drift = window.innerWidth / 2 - bx;
  const wrap = document.createElement("div");
  wrap.className = "balloon-float";
  wrap.style.setProperty("--bx", bx + "px");
  wrap.style.setProperty("--by", by + "px");
  wrap.style.setProperty("--drift", drift + "px");
  wrap.setAttribute("aria-hidden", "true");
  const numberedSrc = BALLOON_IMAGES[delta];
  const balloonHTML = numberedSrc
    ? `<img class="balloon-float__img" src="${numberedSrc}" alt="">`
    : `<div class="balloon-float__generic">
         <img class="balloon-float__img" src="${GENERIC_BALLOON_SRC}" alt="">
         <span class="balloon-float__number">+${delta}</span>
       </div>`;
  wrap.innerHTML = `${balloonHTML}<span class="balloon-float__string"></span>`;
  document.body.appendChild(wrap);
  wrap.addEventListener("animationend", () => wrap.remove());
}

function showEncourage() {
  if (!widgetEl) return;
  const slot = widgetEl.querySelector("[data-encourage-slot]");
  if (!slot) return;
  clearTimeout(encourageTimer);
  const phrase = T.cheers[Math.floor(Math.random() * T.cheers.length)];
  slot.textContent = phrase;
  slot.classList.remove("points-encourage");
  // eslint-disable-next-line no-unused-expressions
  void slot.offsetWidth; // מאלץ reflow כדי שהאנימציה תרוץ מחדש גם אם הופעלה כרגע
  slot.classList.add("points-encourage");
  encourageTimer = setTimeout(() => {
    if (widgetEl && widgetEl.contains(slot)) renderWidgetProgressOnly();
  }, 2200);
}

function renderWidgetProgressOnly() {
  const host = widgetEl && widgetEl.querySelector(".points-progress-host");
  if (host) host.innerHTML = progressHTML();
}

/* ---------------------------------------------------------------
   חגיגת פתיחת פרס (חד-פעמית לסשן, לפי מעבר-סף אמיתי בין before/after)
--------------------------------------------------------------- */
function ensureCelebrateEl() {
  if (celebrateEl) return celebrateEl;
  celebrateEl = document.createElement("div");
  celebrateEl.className = "lightbox points-celebrate";
  celebrateEl.hidden = true;
  document.body.appendChild(celebrateEl);
  celebrateEl.addEventListener("click", (e) => {
    if (e.target === celebrateEl || e.target.closest("[data-celebrate-close]")) {
      celebrateEl.hidden = true;
    }
  });
  return celebrateEl;
}

// reward מגיע ישירות מ-newly_claimed_reward שמחזיר toggle_checkin - השרת הוא
// המקור-האמיתי היחיד לרגע המימוש (לא ניחוש/דידופ בצד הלקוח כמו במודל הישן;
// הפונקציה נקראת אך ורק כשה-RPC עצמו מדווח על מימוש בפועל, פעם אחת בלבד).
function celebrate(reward) {
  const el = ensureCelebrateEl();
  // התמונה עצמה לחיצה לקישור הפרס - לא רק כפתור ה-CTA שמתחתיה.
  const art = reward.image_url
    ? `<a class="points-celebrate__art" href="${linkUrl(reward)}" target="_blank" rel="noopener"><img src="${reward.image_url}" alt=""></a>`
    : "";
  el.innerHTML = `
    <div class="points-celebrate__card">
      <button class="lightbox__close" type="button" data-celebrate-close aria-label="${T.celebrateClose}">✕</button>
      <span class="points-celebrate__emoji" aria-hidden="true">🎉</span>
      <h2 class="points-celebrate__title">${T.celebrateTitle}</h2>
      ${art}
      <p class="points-celebrate__reward-title">${esc(title(reward))}</p>
      <a class="btn btn--primary" href="${linkUrl(reward)}" target="_blank" rel="noopener">${T.celebrateCta}</a>
    </div>`;
  el.hidden = false;
  playCheerSound();
}

/* ---------------------------------------------------------------
   בורר רובריקות ("⚙️ שנו רובריקות") - אותו דפוס בדיוק כמו מודל החגיגה
   (div.lightbox נפרד ב-document.body, לא תלוי ב-#points-widget). בחירה
   זמנית (pickerSelected) עד לחיצה על "שמרו" - לא נוגעת ב-state האמיתי
   קודם לכן, כדי שביטול לא ישאיר שינוי חלקי.
--------------------------------------------------------------- */
function ensurePickerEl() {
  if (pickerEl) return pickerEl;
  pickerEl = document.createElement("div");
  pickerEl.className = "lightbox points-picker";
  pickerEl.hidden = true;
  document.body.appendChild(pickerEl);
  pickerEl.addEventListener("click", (e) => {
    if (e.target === pickerEl || e.target.closest("[data-picker-close]")) {
      closePicker();
      return;
    }
    const chip = e.target.closest("[data-picker-item-id]");
    if (chip && !chip.disabled) {
      const id = chip.dataset.pickerItemId;
      if (pickerSelected.has(id)) pickerSelected.delete(id);
      else if (pickerSelected.size < 3) pickerSelected.add(id);
      renderPicker();
      return;
    }
    if (e.target.closest("[data-picker-show-add]")) {
      pickerShowAddCustom = true;
      renderPicker();
      return;
    }
    if (e.target.closest("[data-picker-cancel-add]")) {
      pickerShowAddCustom = false;
      renderPicker();
      return;
    }
    if (e.target.closest("[data-picker-save]")) {
      handlePickerSave();
    }
  });
  pickerEl.addEventListener("submit", (e) => {
    const form = e.target.closest("[data-picker-add-form]");
    if (!form) return;
    e.preventDefault();
    handlePickerAddCustom(form);
  });
  return pickerEl;
}

function pickerChipHTML(item) {
  const selected = pickerSelected.has(item.id);
  const disabled = !selected && pickerSelected.size >= 3;
  return `
    <button class="points-picker__chip" type="button" data-picker-item-id="${item.id}"
      data-selected="${selected}" ${disabled ? "disabled" : ""}>
      <span aria-hidden="true">${item.icon || "⭐"}</span>
      <span>${esc(isEn ? item.label_en : item.label_he)}</span>
    </button>`;
}

function renderPicker() {
  const el = ensurePickerEl();
  const addForm = pickerShowAddCustom
    ? `
      <form class="points-child-tabs__add-form points-picker__add-form" data-picker-add-form>
        <input class="auth-card__input points-child-tabs__add-input" type="text" name="customLabel"
          placeholder="${T.pickerCustomPlaceholder}" required maxlength="60" autofocus>
        <button class="btn btn--outline points-child-tabs__add-submit" type="submit">${T.add}</button>
        <button class="points-child-tabs__add-cancel" type="button" data-picker-cancel-add aria-label="${T.cancel}">✕</button>
      </form>`
    : `<button class="points-child-tab points-child-tab--add" type="button" data-picker-show-add>${T.pickerAddCustom}</button>`;
  el.innerHTML = `
    <div class="points-picker__card">
      <button class="lightbox__close" type="button" data-picker-close aria-label="${T.pickerCancel}">✕</button>
      <h2 class="points-picker__title">${T.pickerTitle}</h2>
      <p class="points-picker__explain">${T.pickerExplain}</p>
      <p class="points-picker__count">${T.pickerCount(pickerSelected.size)}</p>
      <div class="points-picker__list">
        ${state.preset_catalog.map(pickerChipHTML).join("")}
      </div>
      <div class="points-picker__add-row">${addForm}</div>
      <div class="points-picker__actions">
        <button class="btn btn--outline" type="button" data-picker-close>${T.pickerCancel}</button>
        <button class="btn btn--primary" type="button" data-picker-save ${pickerSelected.size === 3 ? "" : "disabled"}>${T.pickerSave}</button>
      </div>
    </div>`;
}

function openPicker() {
  const currentDaily = state.checklist_items.filter((i) => i.category === "daily").map((i) => i.id);
  pickerSelected = new Set(currentDaily);
  pickerShowAddCustom = false;
  renderPicker();
  ensurePickerEl().hidden = false;
}

function closePicker() {
  if (pickerEl) pickerEl.hidden = true;
  pickerSelected = null;
  pickerShowAddCustom = false;
}

async function handlePickerAddCustom(form) {
  const input = form.querySelector('input[name="customLabel"]');
  const labelHe = (input.value || "").trim();
  if (!labelHe) return;
  input.disabled = true;
  const item = await createCustomItem(labelHe);
  input.disabled = false;
  if (!item) return;
  state.preset_catalog.push({ id: item.id, item_key: item.item_key, label_he: item.label_he, label_en: item.label_en, icon: item.icon, is_custom: true });
  if (pickerSelected.size < 3) pickerSelected.add(item.id);
  pickerShowAddCustom = false;
  renderPicker();
}

async function handlePickerSave() {
  if (pickerSelected.size !== 3) return;
  const ok = await setChecklistSelectionApi([...pickerSelected]);
  if (!ok) return;
  const freshState = await fetchState();
  if (!freshState) return;
  state = freshState;
  closePicker();
  renderAll();
}

/* ---------------------------------------------------------------
   Supabase calls
--------------------------------------------------------------- */
async function fetchState() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_my_points_state");
  if (error) return null;
  return data;
}

async function addChild(name) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("add_child", { child_name: name });
  if (error) return null;
  return data;
}

async function toggleCheckin(childId, itemKey) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("toggle_checkin", { p_child_id: childId, p_item_key: itemKey });
  if (error) return null;
  return Array.isArray(data) ? data[0] : data;
}

async function removeChildApi(childId) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  const { error } = await supabase.rpc("remove_child", { p_child_id: childId });
  return !error;
}

async function createCustomItem(labelHe) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("create_custom_checklist_item", { p_label_he: labelHe });
  if (error) return null;
  return data;
}

async function setChecklistSelectionApi(itemIds) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;
  const { error } = await supabase.rpc("set_checklist_selection", { p_item_ids: itemIds });
  return !error;
}

/* ---------------------------------------------------------------
   Event handling
--------------------------------------------------------------- */
async function handleRemoveChild(childId) {
  const child = state.children.find((c) => c.id === childId);
  if (!child) return;
  if (!window.confirm(T.removeConfirm(child.name))) return;
  const ok = await removeChildApi(childId);
  if (!ok) return;
  // כמו בהוספת ילד - הערכים המחולקים של points_today לכל פריט תלויים
  // במספר הילדים הפעילים, אז שולפים מצב מלא מחדש ולא רק מסננים מקומית.
  const freshState = await fetchState();
  if (!freshState) return;
  state = freshState;
  activeChildId = null; // renderWidget יבחר ילד ראשון מחדש (או onboarding אם אין)
  renderAll();
}

async function handleAddChildSubmit(form) {
  const input = form.querySelector('input[name="childName"]');
  const name = (input.value || "").trim();
  if (!name) return;
  input.disabled = true;
  const child = await addChild(name);
  if (!child) {
    input.disabled = false;
    return;
  }
  // חייבים לשלוף מחדש את כל המצב (לא רק לדחוף את הילד החדש למערך המקומי):
  // points_today לכל פריט מגיע מהשרת כבר מחולק לפי מספר הילדים, וה-RPC של
  // add_child לא מחזיר את הרשימה המעודכנת של הפריטים - בלי הרענון הזה
  // הרובריקה ממשיכה להציג את הערך הישן (לדוגמה +5 גם אחרי שהיו צריכים +3).
  const freshState = await fetchState();
  input.disabled = false;
  if (!freshState) return;
  state = freshState;
  activeChildId = child.id;
  showInlineAddChild = false;
  renderAll();

  // אין יותר ברירת-מחדל אוטומטית לרובריקות (בוטלה ב-0006, לפי בקשת אברהם -
  // ההורה בוחר בעצמו) - אם למשפחה עדיין אין אף פריט daily נבחר, זה תמיד
  // אומר שזו ההצטרפות הראשונה שלה, אז פותחים את הבורר מיד, לא משאירים
  // רשימה ריקה עד שמישהו ילחץ "שנו רובריקות" בעצמו.
  const hasDaily = state.checklist_items.some((i) => i.category === "daily");
  if (!hasDaily) openPicker();
}

async function handleChecklistToggle(li, isReport) {
  const itemId = li.dataset.itemId;
  const itemKey = li.dataset.itemKey;
  const childId = isReport ? li.dataset.childId : activeChildId;
  const btn = li.querySelector("button");
  if (!childId || btn.disabled) return;

  const item = state.checklist_items.find((i) => i.id === itemId);
  const wasChecked = isCheckedToday(childId, itemId);
  const optimisticDelta = wasChecked ? -item.points_today : item.points_today;

  btn.disabled = true;
  const circle = btn.querySelector(".points-checkbox__circle");
  if (circle) circle.classList.toggle("is-checked", !wasChecked);
  btn.setAttribute("aria-pressed", String(!wasChecked));
  if (!wasChecked) {
    floatPointsNear(btn, optimisticDelta);
    circle && circle.classList.add("is-checked");
  }

  const result = await toggleCheckin(childId, itemKey);
  btn.disabled = false;

  if (!result) {
    // כשל - מחזירים את התצוגה למצב האמיתי (לא זה שניחשנו)
    renderAll();
    return;
  }

  if (result.checked) {
    state.checked_today.push({ child_id: childId, item_id: itemId });
  } else {
    state.checked_today = state.checked_today.filter((c) => !(c.child_id === childId && c.item_id === itemId));
  }
  state.family_total = result.family_total;

  if (result.newly_claimed_reward) {
    // מימוש פרס מאפס את המחזור ומחליף את הפרס הבא - שולפים מצב מלא מחדש
    // במקום לנחש מקומית (זה נדיר, קורה לכל היותר פעם בחודש, לא בכל קליק).
    const freshState = await fetchState();
    if (freshState) state = freshState;
  } else {
    state.cycle_points = Math.max(0, (state.cycle_points || 0) + result.points_delta);
  }
  renderAll();
  if (result.newly_claimed_reward) celebrate(result.newly_claimed_reward);
  // חייב לרוץ אחרי renderAll(): הפרגון נכתב לתוך [data-encourage-slot], ואם
  // renderAll() היה רץ אחריו הוא היה מוחק אותו מיד (מחליף את כל ה-innerHTML).
  if (result.checked) {
    playCheerSound();
    showEncourage();
  }
}

// עוגן חצות: checked_today מתאפס בשרת (family_today()) בכל יום, אבל טאב
// שנשאר פתוח מהיום הקודם לא יודע את זה עד שמישהו יגע בו - בודקים בכל חזרה
// לטאב אם התאריך בישראל התקדם, ואם כן שולפים מצב טרי (מוחק סימוני-"היום"
// ישנים) במקום להשאיר תצוגה מדומה שלא תואמת את השרת.
async function refreshIfDateRolledOver() {
  const today = jerusalemDateString();
  if (today === lastKnownDateStr) return;
  lastKnownDateStr = today;
  const freshState = await fetchState();
  if (!freshState) return;
  state = freshState;
  renderAll();
}

function attachEvents() {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refreshIfDateRolledOver();
  });

  widgetEl.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add-child]");
    if (addBtn) {
      showInlineAddChild = true;
      renderAll();
      return;
    }
    const cancelBtn = e.target.closest("[data-cancel-add-child]");
    if (cancelBtn) {
      showInlineAddChild = false;
      renderAll();
      return;
    }
    const tab = e.target.closest(".points-child-tab[data-child-id]");
    if (tab) {
      activeChildId = tab.dataset.childId;
      renderAll();
      return;
    }
    const checkbox = e.target.closest("[data-checkbox]");
    if (checkbox) {
      const li = checkbox.closest(".points-checklist__item");
      if (li) handleChecklistToggle(li, false);
      return;
    }
    const removeBtn = e.target.closest("[data-remove-child]");
    if (removeBtn) {
      handleRemoveChild(removeBtn.dataset.removeChild);
      return;
    }
    if (e.target.closest("[data-open-picker]")) {
      openPicker();
    }
  });

  widgetEl.addEventListener("submit", (e) => {
    const form = e.target.closest("[data-add-child-form]");
    if (!form) return;
    e.preventDefault();
    handleAddChildSubmit(form);
  });

  // דיווח "רעיון בפרשה" יכול להופיע במקומות אחרים בעמוד (מחוץ ל-#points-widget) -
  // מאזין נפרד על כל המסמך, מוגבל ל-[data-report-checkbox] בלבד.
  document.addEventListener("click", (e) => {
    const checkbox = e.target.closest("[data-report-checkbox]");
    if (!checkbox) return;
    const li = checkbox.closest(".points-checklist__item[data-child-id]");
    if (li) handleChecklistToggle(li, true);
  });
}

/* ---------------------------------------------------------------
   Init
--------------------------------------------------------------- */
export async function initPoints() {
  widgetEl = document.getElementById("points-widget");
  if (!widgetEl) return;
  const supabase = getSupabaseClient();
  if (!supabase) return;

  state = await fetchState();
  if (!state) return;
  lastKnownDateStr = jerusalemDateString();

  attachEvents();
  renderAll();
}
