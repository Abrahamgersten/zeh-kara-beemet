"use strict";

/* ---------------------------------------------------------------
   Content data
   ---------------------------------------------------------------
   כל קטגוריה מכילה episodes. הפרקים כאן הם תוכן לדוגמה בלבד
   (sample: true) - להמחשת המבנה. כדי להוסיף תוכן אמיתי: מחליפים
   title / description / image / audio באובייקט המתאים, ומורידים
   את sample: true.

   image: נתיב לתמונת שער, או null להצגת placeholder עם אייקון הקטגוריה.
   audio: נתיב לקובץ mp3, או null להצגת תווית "בקרוב".
   pdf: (אופציונלי) נתיב לקובץ PDF להורדה/הדפסה, או null אם עוד אין.
   pointsItemKey: (אופציונלי) מקשר את הפרק לפריט "דיווח" במערכת הנקודות
     (js/points.js) - כשקיים, מוצגת תחת הפרק תיבת דיווח-קריאה לכל ילד.
     חייב להיות זהה בדיוק לערך המקביל ב-en/js/app.js לאותו פרק.
--------------------------------------------------------------- */
const CATEGORIES = [
  {
    id: "tzadikim",
    name: "זה קרה באמת",
    icon: "🕯️",
    color: "#f0812c",
    type: "audio",
    tagline: "סיפורים מהחיים, מפי מספרים, על גדולי ישראל וצדיקי הדורות - אמונה, מידות טובות ואהבת ישראל.",
    episodes: [
      {
        title: "השיכור של כל נדרי",
        description: "סיפור אמיתי על האדמו\"ר הזקן, רבי שניאור זלמן מלאדי, ועל רבי שמואל - יהודי שעשה דבר יוצא דופן בערב יום כיפור כדי להציל משפחה יהודית מבית הסוהר, ולמה הרבי אמר שליבו כבר הגיע לשמחת תורה.",
        image: "assets/images/kol-nidrei-drunkard.jpeg",
        audio: "assets/audio/kol-nidrei-drunkard-sfx4.mp3",
      },
      {
        title: "חוב של הכרת הטוב",
        description: "סיפור אמיתי על רבי איסר זלמן מלצר, ראש ישיבת עץ חיים בירושלים - ועל הסיבה שבזקנתו טיפס במדרגות קשות לבר מצווה של משפחה פשוטה, כדי להודות להם על מתנה שלא ידעו שנתנו לו.",
        image: "assets/images/isser-zalman-gratitude.jpeg",
        audio: "assets/audio/isser-zalman-gratitude-sfx4.mp3",
      },
      {
        title: "הבן איש חי",
        description: "סיפור אמיתי על רבי יוסף חיים מבגדד, המכונה \"הבן איש חי\", ועל תלמיד סקרן שניסה יום אחד לרוץ במעלה המדרגות כדי לחזות באליהו הנביא - ומה הוא למד במקום זה על הדרך האמיתית להגיע לגדלות.",
        image: "assets/images/ben-ish-chai.jpeg",
        audio: "assets/audio/ben-ish-chai-sfx4.mp3",
      },
      {
        title: "טעות בחישוב",
        description: "סיפור אמיתי על החזון איש, רבי אברהם ישעיהו קרליץ, מגדולי פוסקי ההלכה בדור האחרון - ועל הלילה שתלמידו מצא אותו שוכב על הרצפה, ומה הוא סיפר לו שהשתבש.",
        image: "assets/images/chazon-ish-calculation.jpeg",
        audio: "assets/audio/chazon-ish-calculation-sfx4.mp3",
      },
      {
        title: "לכל אחד יש מה לתת",
        description: "סיפור אמיתי על רבי שמואל הלוי ווזנר, שביקר חולה סובל בבית החולים וסיפר לו סיפור מנעוריו - על חולה אחר שגילה שגם לו, כשנדמה שאין לו כלום לתת, עדיין יש מה לתת.",
        image: "assets/images/something-to-give.jpeg",
        audio: "assets/audio/something-to-give-sfx4.mp3",
      },
      {
        title: "מים במדבר",
        description: "סיפור אמיתי על הבעל שם טוב הקדוש ועל תלמיד צמא שלמד, באמצע המדבר, עד כמה ההשגחה העליונה רואה רחוק לפנינו.",
        image: "assets/images/baal-shem-tov-water.jpeg",
        audio: "assets/audio/baal-shem-tov-water-sfx4.mp3",
      },
      {
        title: "חלק בגן עדן",
        description: "סיפור אמיתי על רבי לוי יצחק מברדיטשוב, סנגורם של ישראל, ועל חולה שייסר אותו עברו - ועל המתנה היוצאת דופן שהרבי הציע לו ברגעיו האחרונים.",
        image: "assets/images/share-in-heaven.jpeg",
        audio: "assets/audio/share-in-heaven-sfx4.mp3",
      },
      {
        title: "הקצין המאמין",
        description: "סיפור אמיתי שסיפר קצין חילוני לרבי שלמה קרליבך במלחמת יום הכיפורים - על בקשתו האחרונה של חבר פצוע, ועל הרגע ששתי מילים שינו הכול.",
        image: "assets/images/believing-officer.jpeg",
        audio: "assets/audio/believing-officer-sfx4.mp3",
      },
      {
        title: "הבבא סלי מלמד על כבוד חכמים",
        description: "סיפור אמיתי על הבבא סלי, רבי ישראל אבוחצירא, ועל אדם שכתב ספר שבו חלק על האור החיים הקדוש - ומה קרה כשהגיע לביתו של הבבא סלי בנטיבות, ומה אפשר ללמוד מזה על היחס לדברי חכמים.",
        image: "assets/images/baba-sali-respect.jpeg",
        audio: "assets/audio/baba-sali-respect-sfx4.mp3",
      },
      {
        title: "ורחמיו על כל מעשיו",
        description: "סיפור אמיתי על האר\"י הקדוש ועל זוג טוב לב, מכניסי אורחים, שחיכו שנים לילדים - ועל דבר קטן מהעבר שהאר\"י עזר להם להבין.",
        image: "assets/images/ari-kindness-to-animals.jpeg",
        audio: "assets/audio/ari-kindness-to-animals-sfx4.mp3",
      },
      {
        title: "הבעל שם טוב והנער המאמין",
        description: "סיפור אמיתי על הבעל שם טוב ועל נער כפרי פשוט שלא ידע להתפלל ולא ללמוד תורה - ומה עשה כדי להראות כמה הוא אוהב את ה'.",
        image: "assets/images/besht-flute-boy.jpeg",
        audio: "assets/audio/besht-flute-boy-sfx4.mp3",
      },
    ],
  },
  {
    id: "wonders",
    name: "נפלאות הבריאה",
    icon: "🦋",
    color: "#4caf6d",
    type: "audio",
    tagline: "סיורים קוליים בעולם הטבע - בעלי חיים, צמחים ותופעות מדהימות, שמראות איך הכול נברא בחוכמה.",
    episodes: [
      {
        title: "העטלף המופלא",
        description: "איך עטלף מצליח לעוף בלילה, בחשכה מוחלטת, בלי להתנגש בשום דבר? גלו את הסוד המדהים של היונק היחיד בעולם שיכול לעוף.",
        images: ["assets/images/amazing-bat-main.jpeg", "assets/images/amazing-bat.jpeg"],
        audio: "assets/audio/amazing-bat-sfx4.mp3",
      },
      {
        title: "הברווזן",
        description: "בעל חיים עם פרווה של יונק, מקור של ברווז וקרומי שחייה - שמטיל ביצים! הכירו את הברווזן, אחד מבעלי החיים המוזרים והמפתיעים ביותר בעולם.",
        images: ["assets/images/platypus-main.jpeg", "assets/images/platypus.jpeg"],
        audio: "assets/audio/platypus-sfx4.mp3",
      },
    ],
  },
  {
    id: "parasha-what",
    name: "מה בפרשה",
    icon: "📜",
    color: "#3aa8e0",
    type: "audio",
    tagline: "סיפור פרשת השבוע בשפה פשוטה וברורה - פרק קצר שאפשר להקשיב לו בדרך לבית הספר.",
    episodes: [
      {
        title: "פרשת בראשית",
        parasha: "בראשית",
        description: "ששת ימי הבריאה, אדם וחווה בגן עדן וסיפור קין והבל - והמסר הגדול של הפרשה על היכולת לבחור בכל יום מחדש.",
        image: "assets/images/parasha-bereishit.jpeg",
        audio: "assets/audio/parasha-bereishit-sfx4.mp3",
      },
      {
        title: "פרשת נח",
        parasha: "נח",
        description: "המבול שכיסה את העולם, תיבת נח ובעלי החיים שנכנסו זוג-זוג, ועד מגדל בבל - ומסר חשוב: גם כשכולם סביבנו הולכים בכיוון מסוים, אנחנו יכולים לבחור בדרך שלנו.",
        image: "assets/images/parasha-noach.jpeg",
        audio: "assets/audio/parasha-noach-sfx4.mp3",
      },
    ],
  },
  {
    id: "parasha-idea",
    name: "רעיון בפרשה",
    icon: "💡",
    color: "#f2c230",
    type: "audio",
    tagline: "רעיון אחד, עמוק ומעשי, שיוצא היישר מתוך פרשת השבוע.",
    episodes: [
      {
        title: "רעיון לפרשת בראשית",
        parasha: "בראשית",
        description: "מה זה אומר שהאדם נברא \"בצלם אלוקים\"? ולמה לכל יהודי, גם הפשוט ביותר, יש כוח עצום להשפיע לטובה על כל העולם - כי כולנו בני מלך.",
        image: "assets/images/parasha-idea-bereishit.jpeg",
        audio: "assets/audio/parasha-idea-bereishit-sfx4.mp3",
        pdf: "assets/pdf/parasha-idea-bereishit.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
      {
        title: "רעיון לפרשת נח",
        parasha: "נח",
        description: "למה גם בעלי החיים נשטפו במבול, הרי אין להם בחירה בין טוב לרע? רעיון עמוק על הכוח העצום שיש לבחירות שלנו להשפיע - לטובה ולרעה - על כל מה שסביבנו.",
        image: "assets/images/parasha-idea-noach.jpeg",
        audio: "assets/audio/parasha-idea-noach-sfx4.mp3",
        pdf: "assets/pdf/parasha-idea-noach.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
    ],
  },
  {
    id: "enlightenment",
    name: "אור בהשכלה",
    icon: "📚",
    color: "#9b6fd1",
    type: "audio",
    tagline: "ידע כללי ומדע, מוגשים בטוב טעם, כדי להרחיב אופקים בלי לאבד את הזהות.",
    episodes: [
      {
        title: "המצאת הכתב",
        description: "איך שמרו בני האדם על הידע שלהם לפני שהומצא הכתב? מסע מרתק מכתב היתדות של בבל והכתב המצרי הקדום, ועד למקלדת ולמסך של היום.",
        image: "assets/images/invention-of-writing.jpeg",
        audio: "assets/audio/invention-of-writing-sfx4.mp3",
      },
      {
        title: "מסע אל מעמקי האוקינוס",
        description: "צוללת יורדת אל תוך האוקיינוס, האור נעלם וההרפתקה רק מתחילה - הכירו את דג החכאי עם הפנס המסתורי, תולעי-הענק שחיות ליד הרי געש תת-ימיים, ואת המדוזה הענקית עם הזרועות שמגיעות ל-30 מטר.",
        image: "assets/images/ocean-depths-journey.jpeg",
        audio: "assets/audio/ocean-depths-journey-sfx4.mp3",
      },
    ],
  },
  {
    id: "spot-diff",
    name: "מצא את ההבדלים",
    icon: "🔍",
    color: "#f26d7d",
    type: "spot-diff",
    tagline: "משחק תמונות - השוו בין שתי התמונות ומצאו את כל ההבדלים ביניהן.",
    episodes: [
      {
        title: "גלגל ימי הבריאה",
        parasha: "בראשית",
        description: "השוו בין שני ציורי ימי הבריאה ושבת ומצאו את כל ההבדלים ביניהם. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-bereishit-a.jpg",
        imageB: "assets/images/spot-diff-bereishit-b.jpg",
        diffCount: 12,
        spots: [
          { x: 41.3, y: 15.2 },
          { x: 34.2, y: 7.8 },
          { x: 47.9, y: 9.3 },
          { x: 38.6, y: 25.2 },
          { x: 45.3, y: 32.8 },
          { x: 74.0, y: 31.4 },
          { x: 19.6, y: 47.8 },
          { x: 50.0, y: 47.8 },
          { x: 91.0, y: 53.1 },
          { x: 87.1, y: 64.8 },
          { x: 61.1, y: 76.8 },
          { x: 81.3, y: 76.1 },
        ],
      },
      {
        title: "תיבת נח והקשת",
        parasha: "נח",
        description: "דף צביעה של פרשת נח: החיות יורדות מהתיבה אל היבשה, וקשת בשמיים. השוו בין שתי התמונות ומצאו את 10 ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-noach-a.jpg",
        imageB: "assets/images/spot-diff-noach-b.jpg",
        diffCount: 10,
        spots: [
          { x: 70.9, y: 13.6 },
          { x: 89.3, y: 14.7 },
          { x: 59.0, y: 29.5 },
          { x: 39.8, y: 56.6 },
          { x: 18.1, y: 58.0 },
          { x: 59.7, y: 53.7 },
          { x: 63.4, y: 76.5 },
          { x: 36.8, y: 78.9 },
          { x: 15.4, y: 87.6 },
          { x: 73.7, y: 90.5 },
        ],
      },
    ],
  },
  {
    id: "what-to-do",
    name: "יש לי מושג",
    icon: "❓",
    color: "#22bcc7",
    type: "audio",
    tagline: "שאלה הלכתית לילדים, עם התשובה - הכול מוקרא יחד בהקלטה אחת.",
    episodes: [
      {
        title: "ברכת המזון",
        description: "למה מברכים אחרי האוכל? מי באמת נותן לנו את הלחם - ומה יש בארבע הברכות של ברכת המזון. הזדמנות לעצור, להודות ולהבין שהשפע בחיים שלנו הוא לא מובן מאליו.",
        image: "assets/images/birkat-hamazon.jpeg",
        audio: "assets/audio/birkat-hamazon-sfx4.mp3",
      },
      {
        title: "פרשת השבוע",
        description: "למה קוראים בכל שבת פרשה אחרת בתורה, מה זה קשור אלינו אחרי אלפי שנים, ואיך אפשר להקשיב לקריאה ולשאול: מה הפרשה הזאת רוצה ללמד אותי?",
        image: "assets/images/parasha-of-the-week.jpeg",
        audio: "assets/audio/parasha-of-the-week-sfx5.mp3",
      },
    ],
  },
  {
    id: "healthy-to-know",
    name: "בריא לדעת",
    icon: "🍎",
    color: "#7cb342",
    type: "audio",
    tagline: "כל מה שכדאי לדעת על הגוף, על התזונה ועל הבריאות - בשפה פשוטה וברורה, כדי לגדול בריאים וחזקים.",
    episodes: [
      {
        title: "חשיבות ארוחת הבוקר",
        description: "למה כדאי לא לדלג על ארוחת הבוקר? איך היא נותנת לגוף ולמוח דלק לכל היום, מה כוללת ארוחת בוקר מאוזנת, ואתגר קטן לשבוע הקרוב.",
        image: "assets/images/healthy-breakfast.jpeg",
        audio: "assets/audio/healthy-breakfast-sfx4.mp3",
      },
      {
        title: "יתרונות הקריאה",
        description: "קריאה מחזקת את המוח, מפתחת דמיון, מרגיעה ואפילו עוזרת להירדם. למה כדאי לקחת ספר בכל יום, ומה אפשר לגלות בין הדפים.",
        image: "assets/images/benefits-of-reading.jpeg",
        audio: "assets/audio/benefits-of-reading-sfx4.mp3",
      },
    ],
  },
];

/* ---------------------------------------------------------------
   Utilities
--------------------------------------------------------------- */
function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function safeStorage() {
  try {
    const k = "__zkb_test__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return localStorage;
  } catch (e) {
    return null;
  }
}
const storage = safeStorage();

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

/* ---------------------------------------------------------------
   Render: category quick-nav grid
--------------------------------------------------------------- */
function renderCatNav() {
  const grid = document.getElementById("cat-nav-grid");
  grid.innerHTML = CATEGORIES.map(
    (cat) => `
    <a class="cat-pill" href="#cat-${cat.id}">
      <span class="cat-pill__icon" aria-hidden="true" style="background:${cat.color}">${cat.icon}</span>
      <span>
        <span class="cat-pill__title">${cat.name}</span>
        <p class="cat-pill__desc">${cat.episodes.length} תכנים</p>
      </span>
    </a>`
  ).join("");
}

/* ---------------------------------------------------------------
   Render: episode / content cards per type
--------------------------------------------------------------- */
function mediaHTML(cat, ep, idx) {
  const badge = ep.sample ? `<span class="content-card__badge">תוכן לדוגמה</span>` : "";
  // ep.images: [main, thumb] - שני איורים לפרק (בהשראת "אי היהלומים"): הראשי מוצג גדול, השני כתמונה קטנה
  // שמחליפה מקום עם הראשי בלחיצה. ep.image (יחיד) ממשיך לעבוד בדיוק כמו קודם - זה רק תוספת אופציונלית.
  const [main, thumb] = ep.images || (ep.image ? [ep.image] : []);
  if (main) {
    const thumbHTML = thumb
      ? `<button class="content-card__thumb" type="button" data-swap aria-label="החלף לתמונה השנייה">
           <img src="${thumb}" alt="${ep.title}" loading="lazy">
         </button>`
      : "";
    return `
      <div class="content-card__media">
        ${badge}
        <img class="content-card__main-img" src="${main}" alt="${ep.title}" loading="lazy" data-full="${main}">
        ${thumbHTML}
      </div>`;
  }
  return `
      <div class="content-card__media">
        ${badge}
        <div class="cover-placeholder" style="background: linear-gradient(150deg, color-mix(in srgb, ${cat.color} 65%, white), ${cat.color})"><span aria-hidden="true">${cat.icon}</span></div>
      </div>`;
}

// "נגן ברצף" (רוני, 2026-10-08 - בדוי קודם ואושר ב"אי היהלומים", מועבר לכאן):
// בדיוק כמו שם, אבל כל שרשרת מוגבלת למדור שבו היא התחילה (אברהם: "לא יהיה
// רצף של האזנות בין מדור למדור אלא לאפשר רצף של האזנה באותו המדור") - audioIdx/
// audioTotal הם המיקום/הכמות של הפרק בתוך *פרקי האודיו של המדור הזה בלבד*
// (לא כל פרקי המדור - חלקם עשויים להיות "תעלה בקרוב" בלי אודיו כלל).
const CONTINUOUS_CHEVRON_SVG = `<svg class="continuous-dd__chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

function continuousSelectHTML(ep, audioIdx, audioTotal) {
  const remaining = audioTotal - audioIdx; // פרקי-אודיו מכאן ועד סוף המדור, כולל זה
  if (remaining <= 1) return ""; // הפרק האחרון במדור - אין לאן להמשיך
  const fixedOptions = [2, 3, 5].filter((n) => n < remaining);
  const choices = [{ value: "1", label: "פרק זה בלבד" }]
    .concat(fixedOptions.map((n) => ({ value: String(n), label: `${n} פרקים` })))
    .concat([{ value: "all", label: `כל ${remaining} הפרקים מכאן` }]);
  const items = choices
    .map(
      (c, i) =>
        `<li class="continuous-dd__option${i === 0 ? " is-selected" : ""}" role="option" data-value="${c.value}" aria-selected="${i === 0}" tabindex="-1">${c.label}</li>`
    )
    .join("");
  return `
      <div class="player-continuous">
        <span class="player-continuous__text">נגן ברצף:</span>
        <div class="continuous-dd" data-value="1">
          <button type="button" class="continuous-dd__btn" aria-haspopup="listbox" aria-expanded="false">
            <span class="continuous-dd__value">פרק זה בלבד</span>
            ${CONTINUOUS_CHEVRON_SVG}
          </button>
          <ul class="continuous-dd__list" role="listbox" aria-label="כמה פרקים לנגן ברצף במדור, מתחילים מ${ep.title}" hidden>${items}</ul>
        </div>
      </div>`;
}

function playerHTML(ep, audioIdx, audioTotal) {
  if (ep.audio) {
    return `
      <div class="player-wrap">
        <div class="player" data-src="${ep.audio}">
          <button class="player__btn" type="button" aria-label="הפעל הקראה">▶</button>
          <div class="player__body">
            <input class="player__seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="התקדמות ההקראה">
            <div class="player__times">
              <span class="player__current">0:00</span>
              <span class="player__duration">--:--</span>
            </div>
          </div>
        </div>
        ${continuousSelectHTML(ep, audioIdx, audioTotal)}
      </div>`;
  }
  return `
      <div class="player player--soon">
        <span class="player__soon-icon" aria-hidden="true">🎙️</span>
        <span class="player__soon-label">ההקלטה תעלה בקרוב</span>
      </div>`;
}

// כרטיס "דבר תורה" להדפסה + דיווח-קריאה לכל ילד (מערכת הנקודות, js/points.js) -
// מוצג רק כשלפרק יש pointsItemKey. תיבת הדיווח עצמה נבנית ע"י points.js (לא כאן -
// app.js לא מודע ל-Supabase), רק ה-div הריק עם data-report-item-key מוזרק כאן.
function pdfReportHTML(ep) {
  if (!ep.pointsItemKey) return "";
  const dl = ep.pdf
    ? `<a class="btn btn--outline content-card__pdf-btn" href="${ep.pdf}" target="_blank" download>📄 הורידו את דף "דבר תורה" להדפסה</a>`
    : `<span class="player player--soon"><span class="player__soon-icon" aria-hidden="true">🖨️</span><span class="player__soon-label">דף ה-PDF יעלה בקרוב</span></span>`;
  return `
    <div class="content-card__pdf">
      ${dl}
      <div class="content-card__report" data-report-item-key="${ep.pointsItemKey}"></div>
    </div>`;
}

function audioCardHTML(cat, ep, idx, audioIdx, audioTotal) {
  const reverseClass = idx % 2 === 1 ? " content-card--reverse" : "";
  return `
  <article class="content-card${reverseClass}">
    ${mediaHTML(cat, ep, idx)}
    <div class="content-card__body">
      <span class="content-card__eyebrow">${cat.name}</span>
      <h3 class="content-card__title">${ep.title}</h3>
      <p class="content-card__desc"><strong>על הפרק: </strong>${ep.description}</p>
      ${playerHTML(ep, audioIdx, audioTotal)}
      ${pdfReportHTML(ep)}
    </div>
  </article>`;
}

function spotDiffCardHTML(cat, ep, idx) {
  const badge = ep.sample ? `<span class="content-card__badge--inline">תוכן לדוגמה</span>` : "";
  const markers = (ep.spots || [])
    .map((p) => `<span class="spot-card__marker" style="left:${p.x}%; top:${p.y}%"></span>`)
    .join("");
  return `
  <article class="content-card content-card--full spot-card">
    <div class="content-card__body">
      <div class="content-card__head-row">
        <span class="content-card__eyebrow">${cat.name}</span>
        ${badge}
      </div>
      <h3 class="content-card__title">${ep.title}</h3>
      <p class="content-card__desc">${ep.description}</p>
      <div class="spot-card__images">
        <div class="spot-card__item">
          <span class="spot-card__label">תמונה א</span>
          <div class="spot-card__frame">
          <img src="${ep.imageA}" alt="תמונה א להשוואה">
          ${markers}
          </div>
        </div>
        <div class="spot-card__item">
          <span class="spot-card__label">תמונה ב</span>
          <div class="spot-card__frame">
          <img src="${ep.imageB}" alt="תמונה ב להשוואה">
          ${markers}
          </div>
        </div>
      </div>
      <div class="spot-card__actions">
        <button class="btn btn--primary" type="button" data-spot-toggle>הצג פתרון (${ep.diffCount} הבדלים)</button>
      </div>
    </div>
  </article>`;
}

const INITIAL_VISIBLE_EPISODES = 4;
const PARASHA_CATEGORY_IDS = ["parasha-what", "parasha-idea", "spot-diff"];

function renderCategorySections() {
  const host = document.getElementById("category-sections");
  host.innerHTML = CATEGORIES.map((cat) => {
    // הפרק שנוסף אחרון מוצג ראשון, בלי קשר לסדר בו הוא נוסף למערך הנתונים.
    let episodesNewestFirst = [...cat.episodes].reverse();
    // מדורי הפרשה: הפרשה של השבת הקרובה בראש, ואחריה הבאות בתור (js/parasha-order.js).
    if (PARASHA_CATEGORY_IDS.includes(cat.id) && typeof orderEpisodesByParasha === "function") {
      episodesNewestFirst = orderEpisodesByParasha(episodesNewestFirst);
    }
    const hasSample = cat.episodes.some((ep) => ep.sample);
    const overflowCount = Math.max(0, episodesNewestFirst.length - INITIAL_VISIBLE_EPISODES);
    // רק פרקים עם אודיו בפועל נספרים לצורך "נגן ברצף" - פרק "תעלה בקרוב" לא בר-המשך.
    const audioEpisodes = episodesNewestFirst.filter((ep) => ep.audio);

    const cardsHTML = episodesNewestFirst
      .map((ep, idx) => {
        const hiddenAttr = idx >= INITIAL_VISIBLE_EPISODES ? ' hidden data-overflow-card="true"' : "";
        const audioIdx = ep.audio ? audioEpisodes.indexOf(ep) : -1;
        const card = cat.type === "spot-diff" ? spotDiffCardHTML(cat, ep, idx) : audioCardHTML(cat, ep, idx, audioIdx, audioEpisodes.length);
        return card.replace("<article ", `<article${hiddenAttr} `);
      })
      .join("");

    const noteHTML = hasSample
      ? `<span class="category-section__note">🧩 התכנים שלהלן הם דוגמה למבנה בלבד - הם יוחלפו בהקלטות ובתכנים אמיתיים</span>`
      : "";
    const showMoreHTML = overflowCount > 0
      ? `<button class="btn btn--ghost category-section__more" type="button" data-show-more="cat-${cat.id}">הצג עוד פרקים</button>`
      : "";

    return `
    <section class="category-section" id="cat-${cat.id}">
      <div class="category-section__inner">
        <div class="category-section__head">
          <span class="category-section__icon" aria-hidden="true" style="background:${cat.color}">${cat.icon}</span>
          <h2 class="category-section__title">${cat.name}</h2>
        </div>
        <p class="category-section__tagline">${cat.tagline}</p>
        ${noteHTML}
        <div class="cards-list">${cardsHTML}</div>
        ${showMoreHTML}
      </div>
    </section>`;
  }).join("");
}

function setupShowMore() {
  const host = document.getElementById("category-sections");
  host.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-show-more]");
    if (!btn) return;
    const section = document.getElementById(btn.dataset.showMore);
    section.querySelectorAll('[data-overflow-card="true"]').forEach((card) => {
      card.hidden = false;
    });
    btn.remove();
  });
}

/* ---------------------------------------------------------------
   Image lightbox
--------------------------------------------------------------- */
function setupMediaInteractions() {
  const host = document.getElementById("category-sections");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  host.addEventListener("click", (e) => {
    const swapBtn = e.target.closest("[data-swap]");
    if (swapBtn) {
      const media = swapBtn.closest(".content-card__media");
      const mainImg = media.querySelector(".content-card__main-img");
      const thumbImg = swapBtn.querySelector("img");
      const tmpSrc = mainImg.src;
      mainImg.style.opacity = "0";
      setTimeout(() => {
        mainImg.src = thumbImg.src;
        mainImg.dataset.full = thumbImg.src;
        thumbImg.src = tmpSrc;
        mainImg.style.opacity = "1";
      }, 120);
      return;
    }

    const mainImg = e.target.closest(".content-card__main-img");
    if (mainImg) {
      lightboxImg.src = mainImg.dataset.full || mainImg.src;
      lightboxImg.alt = mainImg.alt;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    }
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

/* ---------------------------------------------------------------
   Spot-the-difference reveal
--------------------------------------------------------------- */
function setupSpotDiff() {
  const host = document.getElementById("category-sections");
  host.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-spot-toggle]");
    if (!btn) return;
    const card = btn.closest(".spot-card");
    const solved = card.classList.toggle("is-solved");
    btn.textContent = solved
      ? "הסתר פתרון"
      : `הצג פתרון (${card.querySelectorAll(".spot-card__item:first-child .spot-card__marker").length} הבדלים)`;
    if (solved) {
      const catEl = card.querySelector(".content-card__eyebrow");
      const titleEl = card.querySelector(".content-card__title");
      window.zkbLogEvent && window.zkbLogEvent("spot_diff_solved", catEl ? catEl.textContent : null, titleEl ? titleEl.textContent : null);
    }
  });
}

/* ---------------------------------------------------------------
   מעקב-שימוש קליל (ראו js/analytics.js) - קליק על צ'יפ קטגוריה בניווט
   המהיר. לא-חוסם, לא נוגע בניווט (href="#cat-..." ממשיך לעבוד רגיל).
--------------------------------------------------------------- */
function setupCatNavTracking() {
  const grid = document.getElementById("cat-nav-grid");
  if (!grid) return;
  grid.addEventListener("click", (e) => {
    const pill = e.target.closest(".cat-pill");
    if (!pill) return;
    const titleEl = pill.querySelector(".cat-pill__title");
    window.zkbLogEvent && window.zkbLogEvent("category_nav_click", titleEl ? titleEl.textContent : null, null);
  });
}

/* ---------------------------------------------------------------
   Audio players
--------------------------------------------------------------- */
// תפריט נפתח מותאם-אישית ל"נגן ברצף" - זהה במלואו לגרסה שאושרה ונבדקה
// ב"אי היהלומים" (כולל שני תיקונים שאברהם ביקש שם): רשימת ה-<select> הפתוחה
// היא chrome של מערכת ההפעלה שאי-אפשר לעצב, אז זה כפתור+רשימה-צפה שנבנו
// מאפס; וכל כרטיס (.content-card) הוא overflow:hidden (כדי לחתוך את התמונה
// לפי הפינות המעוגלות), שהיה חותך גם רשימה שנפתחת קרוב לתחתית הכרטיס - לכן
// כל רשימה עוברת ל-<body> וממוקמת לפי מיקום הכפתור בפועל על המסך (fixed).
function setupContinuousDropdowns() {
  const entries = Array.from(document.querySelectorAll(".continuous-dd")).map((dd) => {
    const btn = dd.querySelector(".continuous-dd__btn");
    const list = dd.querySelector(".continuous-dd__list");
    document.body.appendChild(list);
    return { dd, btn, list, options: Array.from(list.querySelectorAll(".continuous-dd__option")) };
  });
  const isRtl = document.documentElement.dir === "rtl";

  function positionList(entry) {
    const r = entry.btn.getBoundingClientRect();
    entry.list.style.top = `${r.bottom + 6}px`;
    entry.list.style.minWidth = `${r.width}px`;
    if (isRtl) {
      entry.list.style.right = `${window.innerWidth - r.right}px`;
      entry.list.style.left = "auto";
    } else {
      entry.list.style.left = `${r.left}px`;
      entry.list.style.right = "auto";
    }
  }
  function closeDropdown(entry) {
    entry.list.hidden = true;
    entry.btn.setAttribute("aria-expanded", "false");
  }
  function closeAll(except) {
    entries.forEach((entry) => { if (entry !== except) closeDropdown(entry); });
  }
  function openDropdown(entry) {
    closeAll(entry);
    positionList(entry);
    entry.list.hidden = false;
    entry.btn.setAttribute("aria-expanded", "true");
  }
  function selectOption(entry, li) {
    const valueEl = entry.btn.querySelector(".continuous-dd__value");
    entry.options.forEach((o) => {
      o.classList.toggle("is-selected", o === li);
      o.setAttribute("aria-selected", o === li ? "true" : "false");
    });
    entry.dd.dataset.value = li.dataset.value;
    valueEl.textContent = li.textContent;
  }

  entries.forEach((entry) => {
    const { btn, options } = entry;

    btn.addEventListener("click", () => {
      if (entry.list.hidden) {
        openDropdown(entry);
        (options.find((o) => o.classList.contains("is-selected")) || options[0]).focus();
      } else {
        closeDropdown(entry);
      }
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDropdown(entry);
        (options.find((o) => o.classList.contains("is-selected")) || options[0]).focus();
      }
    });

    options.forEach((li, i) => {
      li.addEventListener("click", () => { selectOption(entry, li); closeDropdown(entry); btn.focus(); });
      li.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectOption(entry, li);
          closeDropdown(entry);
          btn.focus();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          (options[i + 1] || options[0]).focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          (options[i - 1] || options[options.length - 1]).focus();
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeDropdown(entry);
          btn.focus();
        } else if (e.key === "Tab") {
          closeDropdown(entry);
        }
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".continuous-dd") && !e.target.closest(".continuous-dd__list")) closeAll();
  });
  window.addEventListener("scroll", () => closeAll(), { passive: true, capture: true });
  window.addEventListener("resize", () => closeAll());
}

function setupPlayers() {
  const players = Array.from(document.querySelectorAll(".player:not(.player--soon)"));
  // "נגן ברצף" (אברהם, 2026-10-08): רצף מוגבל למדור שבו הוא התחיל - לכן
  // מקבצים את הנגנים לפי .category-section, ומריצים את השרשרת רק בתוך הרשימה
  // של אותו מדור (categoryControllers[nextIdx] פשוט לא קיים בקצה המדור).
  const controllersBySection = new Map();
  let continuousPlan = null; // { remaining } - רק נגן אחד מתנגן בכל רגע נתון באתר, אז זה גלובלי

  players.forEach((el) => {
    const section = el.closest(".category-section");
    if (!controllersBySection.has(section)) controllersBySection.set(section, []);
    const categoryControllers = controllersBySection.get(section);
    const catIdx = categoryControllers.length; // המיקום שישויך לפרק הזה ברשימת-המדור, לפני שהוא נוסף אליה

    const src = el.dataset.src;
    const btn = el.querySelector(".player__btn");
    const seek = el.querySelector(".player__seek");
    const current = el.querySelector(".player__current");
    const duration = el.querySelector(".player__duration");
    const continuousDd = el.closest(".player-wrap")?.querySelector(".continuous-dd");
    let audio = null;
    let seeking = false;
    let loggedPlay = false;
    let pausedByOther = false; // true רק כש-zkb-pause-request השהה אותנו (פרק אחר התחיל) - לא השהיה ידנית

    function ensureAudio() {
      if (audio) return audio;
      audio = new Audio(src);
      audio.preload = "none";

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
        players.forEach((other) => {
          if (other !== el) other.dispatchEvent(new CustomEvent("zkb-pause-request"));
        });
        btn.textContent = "⏸";
        btn.classList.add("is-playing");
        btn.setAttribute("aria-label", "השהה");
        // מעקב-שימוש (לא-חוסם, ראו js/analytics.js) - רק ב"נגן ראשון" של
        // ההקלטה בטעינת העמוד, לא בכל חזרה-מפאוזה של אותה האזנה.
        if (!loggedPlay) {
          loggedPlay = true;
          const card = el.closest(".content-card");
          const catEl = card && card.querySelector(".content-card__eyebrow");
          const titleEl = card && card.querySelector(".content-card__title");
          window.zkbLogEvent && window.zkbLogEvent("audio_play", catEl ? catEl.textContent : null, titleEl ? titleEl.textContent : null);
        }
      });
      audio.addEventListener("pause", () => {
        btn.textContent = "▶";
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "המשך הקראה");
        // השהיה ידנית (לא פרק הבא בשרשרת שמתחיל, שמשהה את כל השאר דרך
        // zkb-pause-request) מבטלת את התוכנית.
        if (!pausedByOther) continuousPlan = null;
        pausedByOther = false;
      });
      audio.addEventListener("ended", () => {
        btn.textContent = "▶";
        btn.classList.remove("is-playing");
        seek.value = 0;
        current.textContent = "0:00";
        continueChainFrom(categoryControllers, catIdx);
      });
      return audio;
    }

    btn.addEventListener("click", () => {
      const a = ensureAudio();
      if (a.paused) {
        const choice = continuousDd ? continuousDd.dataset.value : "1";
        continuousPlan = choice === "1" ? null : { remaining: choice === "all" ? Infinity : Number(choice) - 1 };
        a.play().catch(() => {});
      } else {
        a.pause();
      }
    });

    el.addEventListener("zkb-pause-request", () => {
      if (audio && !audio.paused) {
        pausedByOther = true;
        audio.pause();
      }
    });

    seek.addEventListener("input", () => {
      seeking = true;
      current.textContent = formatTime(Number(seek.value));
    });
    seek.addEventListener("change", () => {
      const a = ensureAudio();
      a.currentTime = Number(seek.value);
      seeking = false;
    });

    categoryControllers.push({
      playFromStart() {
        // אם הפרק הבא עדיין מתחת ל"הצג עוד פרקים" - לחשוף אותו, אחרת הקול
        // מתנגן בלי כרטיס נראה על המסך.
        const hiddenCard = el.closest('.content-card[hidden]');
        if (hiddenCard) { hiddenCard.hidden = false; hiddenCard.removeAttribute("data-overflow-card"); }
        const a = ensureAudio();
        a.currentTime = 0;
        a.play().catch(() => {});
        (el.closest(".content-card") || el).scrollIntoView({ behavior: "smooth", block: "center" });
      },
    });
  });

  function continueChainFrom(categoryControllers, idx) {
    if (!continuousPlan || continuousPlan.remaining <= 0) { continuousPlan = null; return; }
    const nextIdx = idx + 1;
    if (!categoryControllers[nextIdx]) { continuousPlan = null; return; }
    continuousPlan.remaining -= 1;
    categoryControllers[nextIdx].playFromStart();
  }
}

/* ---------------------------------------------------------------
   Hero: כוכבים מנצנצים (כמו ב"אי היהלומים") + ירח שמופיע מדי פעם
--------------------------------------------------------------- */
function setupSparkles() {
  const wrap = document.querySelector(".hero__sparkles");
  if (!wrap) return;
  // הכמות לפי שטח ההירו, לא מספר קבוע: ב"אי היהלומים" יש 16 כוכבים על ~830,000 פיקסלים רבועים
  // (כוכב לכל ~52,000). ההירו כאן נמוך יותר, אז מספר קבוע נראה צפוף יותר - כאן כוכב לכל ~55,000, בין 8 ל-14.
  const box = wrap.getBoundingClientRect();
  const count = Math.max(8, Math.min(14, Math.round((box.width * box.height) / 55000)));
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = Math.random() > 0.5 ? "✦" : "✧";
    s.style.left = `${Math.random() * 100}%`;
    s.style.top = `${Math.random() * 100}%`;
    s.style.fontSize = `${7 + Math.random() * 12}px`;
    s.style.animationDelay = `${Math.random() * 3.6}s`;
    s.style.animationDuration = `${3 + Math.random() * 2.5}s`;
    wrap.appendChild(s);
  }
}

function setupMoon() {
  const wrap = document.querySelector(".hero__sparkles");
  if (!wrap) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function showMoon() {
    // לא יוצרים ירח בטאב מוסתר (האנימציה לא רצה שם והצומת היה נשאר תלוי)
    if (!document.hidden) {
      const size = 34 + Math.random() * 22;
      const moon = document.createElement("span");
      moon.className = "hero__moon";
      moon.style.width = moon.style.height = `${size}px`;
      // שוליים בלבד (שליש שמאלי/ימני) ורצועה עליונה - כדי שהירח לא יסתיר את הכותרת והטקסט במרכז
      moon.style.left = `${Math.random() < 0.5 ? 4 + Math.random() * 20 : 74 + Math.random() * 18}%`;
      moon.style.top = `${3 + Math.random() * 9}%`;
      // סהר = צל פנימי מוסט על עיגול שקוף; העובי יחסי לגודל כדי שכל הירחים ייראו אותו דבר
      moon.style.boxShadow = `inset -${(size * 0.3).toFixed(1)}px -${(size * 0.07).toFixed(1)}px 0 0 #fff1c2`;
      moon.addEventListener("animationend", () => moon.remove());
      wrap.appendChild(moon);
    }
    setTimeout(showMoon, 22000 + Math.random() * 26000);
  }
  setTimeout(showMoon, 4000 + Math.random() * 4000);
}

/* ---------------------------------------------------------------
   Scroll reveal
--------------------------------------------------------------- */
function setupScrollReveal() {
  const cards = document.querySelectorAll(".content-card");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((c) => c.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );
  cards.forEach((c) => io.observe(c));
}

/* ---------------------------------------------------------------
   Mobile "install the app" banner (PWA)
--------------------------------------------------------------- */
function setupInstallBanner() {
  const banner = document.getElementById("install-banner");
  const actionBtn = document.getElementById("install-banner-action");
  const closeBtn = document.getElementById("install-banner-close");
  const subEl = document.getElementById("install-banner-sub");

  const ua = navigator.userAgent || "";
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/.test(ua);
  const isMobileUA = isIOS || isAndroid || /Mobi/i.test(ua);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  // 2026-09-23: היה localStorage (זכירה לצמיתות, גם אם האפליקציה הוסרה
  // מהמכשיר) - לבקשת אברהם הוחלף ל-sessionStorage: סגירה משתיקה רק את
  // הביקור הנוכחי, לא לצמיתות - כך שאם האפליקציה עדיין לא מותקנת, הרצועה
  // תופיע שוב בביקור הבא (ולא רק אם ננקה ידנית את האחסון).
  const dismissKey = "zkb-install-dismissed";
  const alreadyDismissedThisVisit = sessionStore && sessionStore.getItem(dismissKey) === "1";

  if (!isMobileUA || isStandalone || alreadyDismissedThisVisit) return;

  let deferredPrompt = null;

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function dismiss() {
    hideBanner();
    if (sessionStore) sessionStore.setItem(dismissKey, "1");
    closeInstructions();
  }

  closeBtn.addEventListener("click", dismiss);

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    subEl.textContent = "גשו לכל התכנים בלחיצה אחת, ישר מהמסך הראשי";
    showBanner();
  });

  window.addEventListener("appinstalled", () => {
    dismiss();
  });

  const instructions = document.createElement("div");
  instructions.className = "install-steps";
  instructions.innerHTML = isIOS
    ? `<button class="install-steps__close" type="button" aria-label="סגירה">✕</button>
       <h3>איך מתקינים באייפון?</h3>
       <ol>
         <li>הקישו על כפתור השיתוף ⬆️ בסרגל הכלים של Safari</li>
         <li>גללו ובחרו "הוסף למסך הבית" (Add to Home Screen)</li>
         <li>הקישו "הוספה" - וזהו, האפליקציה מוכנה!</li>
       </ol>`
    : `<button class="install-steps__close" type="button" aria-label="סגירה">✕</button>
       <h3>איך מתקינים?</h3>
       <ol>
         <li>פתחו את התפריט (שלוש הנקודות) בדפדפן</li>
         <li>בחרו "התקן אפליקציה" או "הוסף למסך הבית"</li>
         <li>אשרו - וזהו, האפליקציה מוכנה!</li>
       </ol>`;
  document.body.appendChild(instructions);

  function openInstructions() {
    instructions.classList.add("is-open");
  }
  function closeInstructions() {
    instructions.classList.remove("is-open");
  }
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
    subEl.textContent = "הוסיפו למסך הבית וקבלו אפליקציה אמיתית לטלפון";
    showBanner();
  } else {
    setTimeout(() => {
      if (!deferredPrompt && banner.hidden) {
        subEl.textContent = "הוסיפו את האפליקציה למסך הבית שלכם";
        showBanner();
      }
    }, 2500);
  }
}

/* ---------------------------------------------------------------
   Service worker
--------------------------------------------------------------- */
function setupServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
}

/* ---------------------------------------------------------------
   מרווח דביק אמיתי בראש הדף (--banner-h, --header-h) - .install-banner
   ו-.site-header שתיהן position:sticky/top:0; כששתיהן קיימות (הרצועה
   מוצגת) הן היו נערמות זו על זו באותו top:0 ומכסות זו את זו, כי אף אחת לא
   "יודעת" כמה מקום השנייה תופסת. --banner-h (0 כשהרצועה מוסתרת) הוא ה-top
   שה-header מקבל בפועל (ב-css: .site-header{top:var(--banner-h)}) כדי לשבת
   מתחתיה ולא עליה; --header-h הוא סכום שתיהן - המרווח הכולל התפוס למעלה,
   שקישורי-העוגן (נחיתה על מדור, "על הפרויקט", "כל הקטגוריות") מתחשבים בו
   (css: scroll-margin-top: calc(var(--header-h) + 10px)). גם גובה ה-header
   עצמו משתנה (שורה אחת בדסקטופ מול שתיים כשה-nav עובר לשורה נוספת במסכים
   צרים) - ResizeObserver על שני האלמנטים מתעדכן אוטומטית בכל שינוי כזה
   (כולל הופעה/היעלמות של הרצועה - ראו גם ה-MutationObserver על [hidden]
   כגיבוי, ליתר ביטחון בין דפדפנים).
--------------------------------------------------------------- */
function setupHeaderOffsetTracking() {
  const banner = document.getElementById("install-banner");
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => {
    const bannerH = banner && !banner.hidden ? Math.ceil(banner.getBoundingClientRect().height) : 0;
    const headerH = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--banner-h", `${bannerH}px`);
    document.documentElement.style.setProperty("--header-h", `${bannerH + headerH}px`);
  };
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(update);
    ro.observe(header);
    if (banner) ro.observe(banner);
  }
  if (banner && typeof MutationObserver !== "undefined") {
    new MutationObserver(update).observe(banner, { attributes: true, attributeFilter: ["hidden"] });
  }
  update();
}

/* ---------------------------------------------------------------
   תיקון-נחיתה אחרי טעינת גופנים (נוסף 2026-09-28) - הסיבה האמיתית ל"קליק על
   קטגוריה נוחת קצת מעל היעד" שנשארה גם אחרי תיקוני ה-sticky: הגופנים
   (Suez One/Heebo, נטענים עם display=swap) מוחלפים מגופן-גיבוי לגופן האמיתי
   *אחרי* שהדף כבר נבנה - ומדדתי בפועל שזה משנה את הגובה הכולל של הדף בכ-250
   פיקסל (המון כותרות עם Suez One, כל אחת קצת שונה בגובה מהגיבוי). אם
   המשתמש לוחץ על קטגוריה **לפני** שההחלפה הזאת הושלמה (סביר בביקור ראשון/
   רשת איטית - בביקור חוזר הגופנים כבר בקאש והבעיה לא קיימת בכלל), הדפדפן
   מחשב את מיקום הגלילה לפי הפריסה הקצרה-יותר של גופן-הגיבוי; ברגע שהגופן
   מוחלף בפועל כל מה שמעל היעד "תופח", והיעד זז מטה בלי שהגלילה עוקבת אחריו -
   בדיוק "נוחת על הקטגוריה שמעל". התיקון: ברגע שהגופנים באמת התייצבו
   (document.fonts.ready) - אם עדיין יש #hash בכתובת שמצביע על אלמנט קיים,
   מיישרים אליו מחדש (scrollIntoView מכבד scroll-margin-top כמו ניווט-עוגן
   רגיל). גם ב-window load (אחרי כל התמונות) כרשת-ביטחון נוספת, זולה וכללית.
--------------------------------------------------------------- */
function setupHashCorrection() {
  const resnap = () => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ block: "start" });
  };
  // 2026-09-28, סבב שני: תיקון-יישור בודד שתלוי ב-document.fonts.ready לא הספיק
  // בפועל (אושש: אנדרואיד כרום, "רק בלחיצה הראשונה אחרי רענון") - הפונטים
  // יכולים להתייצב *לפני* שהמשתמש בכלל הספיק ללחוץ על קטגוריה, ואז ה-promise
  // החד-פעמי כבר "נשרף" בלי טעם (מצא hash ריק) ואין יותר מי שיתקן את הלחיצה
  // שבאה אחר כך. הפתרון החזק יותר: **כל** לחיצה על קישור-עוגן (או hashchange
  // ישיר) מפעילה כמה תיקונים עוקבים ומדורגים בזמן (לא רק אחד), כך שלא משנה
  // מתי בדיוק הפונט/תמונה/כל דבר אחר שמזיז תוכן מתייצב ביחס ללחיצה - אחד
  // מהתיקונים המדורגים תמיד יתפוס את המצב הסופי.
  let timers = [];
  const scheduleCorrections = () => {
    timers.forEach(clearTimeout);
    timers = [100, 400, 900, 1600].map((ms) => setTimeout(resnap, ms));
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest('a[href^="#"]')) scheduleCorrections();
  });
  window.addEventListener("hashchange", scheduleCorrections);
  if (location.hash) scheduleCorrections(); // קישור ישיר עם #hash כבר בכתובת (לא דרך לחיצה)
}

/* ---------------------------------------------------------------
   Init
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCatNav();
  renderCategorySections();
  setupMediaInteractions();
  setupSpotDiff();
  setupShowMore();
  setupContinuousDropdowns();
  setupPlayers();
  setupCatNavTracking();
  setupSparkles();
  setupMoon();
  setupScrollReveal();
  setupInstallBanner();
  setupHeaderOffsetTracking();
  setupHashCorrection();
  setupServiceWorker();
});
