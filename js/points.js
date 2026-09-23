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

function safeSessionStorage() {
  try {
    const k = "__zkb_test__";
    sessionStorage.setItem(k, "1");
    sessionStorage.removeItem(k);
    return sessionStorage;
  } catch (e) {
    return null;
  }
}
const sessionStore = safeSessionStorage();

const T = isEn
  ? {
      onboardingTitle: "Want to turn this into a game?",
      onboardingExplain:
        "Checking something off the daily list - like brushing teeth or saying the Shema - earns points, and the whole family collects them together toward a surprise reward. It's a fun, completely optional extra - you can keep using the site without it, and join in whenever you like.",
      onboardingCta: "Add a child to get started",
      eyebrowOptional: "🎈 An optional family game",
      namePlaceholder: "Child's name",
      add: "Add ➕",
      done: "All done, let's start! 🎉",
      addChildChip: "+ Add a child",
      removeChild: (name) => `🗑️ Remove ${name} from the list`,
      removeConfirm: (name) => `Remove ${name} from the children list? Their history stays saved, but they won't appear in the list anymore.`,
      cancel: "Cancel",
      pointsLabel: "Your points",
      of: "of",
      nextReward: "Next reward",
      hintLocked: (n) => `${n} points to go and the new story unlocks!`,
      hintAllUnlocked: "Amazing, you've unlocked everything!",
      ctaLocked: (n) => `${n} points to go 🔒`,
      ctaUnlocked: "Open the reward 🎁",
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
      done: "סיימנו, בואו נתחיל! 🎉",
      addChildChip: "+ הוסיפו ילד/ה",
      removeChild: (name) => `🗑️ הסרת ${name} מהרשימה`,
      removeConfirm: (name) => `להסיר את ${name} מרשימת הילדים? ההיסטוריה שלו/ה תישמר, אבל הוא/היא לא יופיע/תופיע יותר ברשימה.`,
      cancel: "ביטול",
      pointsLabel: "הנקודות שלכם",
      of: "מתוך",
      nextReward: "הפרס הבא",
      hintLocked: (n) => `עוד ${n} נקודות והסיפור החדש נפתח!`,
      hintAllUnlocked: "כל הכבוד, פתחתם הכל!",
      ctaLocked: (n) => `עוד ${n} נקודות 🔒`,
      ctaUnlocked: "לצפייה בפרס 🎁",
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
function rewardsSorted() {
  return [...state.rewards].sort((a, b) => a.threshold_points - b.threshold_points);
}

function displayReward() {
  const sorted = rewardsSorted();
  return sorted.find((r) => !r.unlocked) || sorted[sorted.length - 1] || null;
}

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
      <ul class="points-onboarding__list">
        ${state.children.map((c) => `<li class="points-onboarding__chip">${esc(c.name)}</li>`).join("")}
      </ul>
      ${state.children.length ? `<button class="btn btn--outline points-onboarding__done" type="button" data-onboarding-done>${T.done}</button>` : ""}
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
  if (!child) return "";
  return `<button class="points-remove-child" type="button" data-remove-child="${child.id}">${T.removeChild(esc(child.name))}</button>`;
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
  const reward = displayReward();
  if (!reward) return "";
  const pct = Math.min(100, Math.round((state.family_total / reward.threshold_points) * 100));
  const hint = reward.unlocked ? T.hintAllUnlocked : T.hintLocked(Math.max(0, reward.threshold_points - state.family_total));
  return `
    <div class="points-progress">
      <div class="points-progress__head">
        <span class="points-progress__label">${T.pointsLabel}</span>
        <span class="points-progress__count"><strong>${state.family_total}</strong> ${T.of} <strong>${reward.threshold_points}</strong></span>
      </div>
      <div class="points-progress__track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div class="points-progress__fill" style="width:${pct}%"></div>
      </div>
      <p class="points-progress__hint" data-encourage-slot>${esc(hint)}</p>
    </div>`;
}

function rewardHTML() {
  const reward = displayReward();
  if (!reward) return "";
  const cover = reward.image_url
    ? `<img src="${reward.image_url}" alt="">`
    : `<div class="cover-placeholder">🎁</div>`;
  const lock = reward.unlocked ? "" : `<span class="points-reward__lock" aria-hidden="true">🔒</span>`;
  const cta = reward.unlocked
    ? `<a class="btn btn--outline points-reward__cta" href="${linkUrl(reward)}" target="_blank" rel="noopener">${T.ctaUnlocked}</a>`
    : `<button class="btn btn--outline points-reward__cta" type="button" disabled>${T.ctaLocked(Math.max(0, reward.threshold_points - state.family_total))}</button>`;
  return `
    <div class="points-reward${reward.unlocked ? " points-reward--unlocked" : " points-reward--locked"}">
      <div class="points-reward__art">${cover}${lock}</div>
      <div class="points-reward__body">
        <span class="points-reward__eyebrow">${T.nextReward}</span>
        <h3 class="points-reward__title">${esc(title(reward))}</h3>
        <p class="points-reward__desc">${esc(desc(reward) || "")}</p>
        ${cta}
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
  const wrap = document.createElement("div");
  wrap.className = "balloon-float";
  wrap.style.setProperty("--bx", bx + "px");
  wrap.style.setProperty("--by", by + "px");
  wrap.setAttribute("aria-hidden", "true");
  wrap.innerHTML = `<span class="balloon-float__body">+${delta}</span><span class="balloon-float__string"></span>`;
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

function celebrate(reward) {
  const el = ensureCelebrateEl();
  el.innerHTML = `
    <div class="points-celebrate__card">
      <button class="lightbox__close" type="button" data-celebrate-close aria-label="${T.celebrateClose}">✕</button>
      <span class="points-celebrate__emoji" aria-hidden="true">🎉</span>
      <h2 class="points-celebrate__title">${T.celebrateTitle}</h2>
      <p class="points-celebrate__reward-title">${esc(title(reward))}</p>
      <a class="btn btn--primary" href="${linkUrl(reward)}" target="_blank" rel="noopener">${T.celebrateCta}</a>
    </div>`;
  el.hidden = false;
  playCheerSound();
}

function checkForNewlyUnlockedRewards(beforeTotal, afterTotal) {
  if (afterTotal <= beforeTotal) return;
  const sorted = rewardsSorted();
  const crossed = sorted.find((r) => beforeTotal < r.threshold_points && r.threshold_points <= afterTotal);
  if (!crossed) return;
  const key = `zkb-reward-celebrated-${crossed.id}`;
  if (sessionStore && sessionStore.getItem(key) === "1") return;
  if (sessionStore) sessionStore.setItem(key, "1");
  crossed.unlocked = true;
  celebrate(crossed);
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

  const beforeTotal = state.family_total;
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

  checkForNewlyUnlockedRewards(beforeTotal, result.family_total);
  renderAll();
  // חייב לרוץ אחרי renderAll(): הפרגון נכתב לתוך [data-encourage-slot], ואם
  // renderAll() היה רץ אחריו הוא היה מוחק אותו מיד (מחליף את כל ה-innerHTML).
  if (result.checked) {
    playCheerSound();
    showEncourage();
  }
}

function attachEvents() {
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
    const doneBtn = e.target.closest("[data-onboarding-done]");
    if (doneBtn) {
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

  attachEvents();
  renderAll();
}
