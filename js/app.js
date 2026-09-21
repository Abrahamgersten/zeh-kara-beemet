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
        audio: "assets/audio/kol-nidrei-drunkard.mp3",
      },
      {
        title: "חוב של הכרת הטוב",
        description: "סיפור אמיתי על רבי איסר זלמן מלצר, ראש ישיבת עץ חיים בירושלים - ועל הסיבה שבזקנתו טיפס במדרגות קשות לבר מצווה של משפחה פשוטה, כדי להודות להם על מתנה שלא ידעו שנתנו לו.",
        image: "assets/images/isser-zalman-gratitude.jpeg",
        audio: "assets/audio/isser-zalman-gratitude.mp3",
      },
      {
        title: "הבן איש חי",
        description: "סיפור אמיתי על רבי יוסף חיים מבגדד, המכונה \"הבן איש חי\", ועל תלמיד סקרן שניסה יום אחד לרוץ במעלה המדרגות כדי לחזות באליהו הנביא - ומה הוא למד במקום זה על הדרך האמיתית להגיע לגדלות.",
        image: "assets/images/ben-ish-chai.jpeg",
        audio: "assets/audio/ben-ish-chai.mp3",
      },
      {
        title: "טעות בחישוב",
        description: "סיפור אמיתי על החזון איש, רבי אברהם ישעיהו קרליץ, מגדולי פוסקי ההלכה בדור האחרון - ועל הלילה שתלמידו מצא אותו שוכב על הרצפה, ומה הוא סיפר לו שהשתבש.",
        image: "assets/images/chazon-ish-calculation.jpeg",
        audio: "assets/audio/chazon-ish-calculation.mp3",
      },
      {
        title: "לכל אחד יש מה לתת",
        description: "סיפור אמיתי על רבי שמואל הלוי ווזנר, שביקר חולה סובל בבית החולים וסיפר לו סיפור מנעוריו - על חולה אחר שגילה שגם לו, כשנדמה שאין לו כלום לתת, עדיין יש מה לתת.",
        image: "assets/images/something-to-give.jpeg",
        audio: "assets/audio/something-to-give.mp3",
      },
      {
        title: "מים במדבר",
        description: "סיפור אמיתי על הבעל שם טוב הקדוש ועל תלמיד צמא שלמד, באמצע המדבר, עד כמה ההשגחה העליונה רואה רחוק לפנינו.",
        image: "assets/images/baal-shem-tov-water.jpeg",
        audio: "assets/audio/baal-shem-tov-water.mp3",
      },
      {
        title: "חלק בגן עדן",
        description: "סיפור אמיתי על רבי לוי יצחק מברדיטשוב, סנגורם של ישראל, ועל חולה שייסר אותו עברו - ועל המתנה היוצאת דופן שהרבי הציע לו ברגעיו האחרונים.",
        image: "assets/images/share-in-heaven.jpeg",
        audio: "assets/audio/share-in-heaven.mp3",
      },
      {
        title: "הקצין המאמין",
        description: "סיפור אמיתי שסיפר קצין חילוני לרבי שלמה קרליבך במלחמת יום הכיפורים - על בקשתו האחרונה של חבר פצוע, ועל הרגע ששתי מילים שינו הכול.",
        image: "assets/images/believing-officer.jpeg",
        audio: "assets/audio/believing-officer.mp3",
      },
      {
        title: "הבבא סלי מלמד על כבוד חכמים",
        description: "סיפור אמיתי על הבבא סלי, רבי ישראל אבוחצירא, ועל אדם שכתב ספר שבו חלק על האור החיים הקדוש - ומה קרה כשהגיע לביתו של הבבא סלי בנטיבות, ומה אפשר ללמוד מזה על היחס לדברי חכמים.",
        image: null,
        audio: "assets/audio/baba-sali-respect.mp3",
      },
      {
        title: "ורחמיו על כל מעשיו",
        description: "סיפור אמיתי על האר\"י הקדוש ועל זוג טוב לב, מכניסי אורחים, שחיכו שנים לילדים - ועל דבר קטן מהעבר שהאר\"י עזר להם להבין.",
        image: null,
        audio: "assets/audio/ari-kindness-to-animals.mp3",
      },
      {
        title: "הבעל שם טוב והנער המאמין",
        description: "סיפור אמיתי על הבעל שם טוב ועל נער כפרי פשוט שלא ידע להתפלל ולא ללמוד תורה - ומה עשה כדי להראות כמה הוא אוהב את ה'.",
        image: null,
        audio: "assets/audio/besht-flute-boy.mp3",
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
        image: "assets/images/amazing-bat.jpeg",
        audio: "assets/audio/amazing-bat.mp3",
      },
      {
        title: "הברווזן",
        description: "בעל חיים עם פרווה של יונק, מקור של ברווז וקרומי שחייה - שמטיל ביצים! הכירו את הברווזן, אחד מבעלי החיים המוזרים והמפתיעים ביותר בעולם.",
        image: "assets/images/platypus.jpeg",
        audio: "assets/audio/platypus.mp3",
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
        description: "ששת ימי הבריאה, אדם וחווה בגן עדן וסיפור קין והבל - והמסר הגדול של הפרשה על היכולת לבחור בכל יום מחדש.",
        image: null,
        audio: "assets/audio/parasha-bereishit.mp3",
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
        title: "לדוגמה: רעיון מתוך פרשת השבוע",
        description: "כאן יבוא תיאור אמיתי של הרעיון המרכזי בפרק - מה השאלה ומה התובנה. זהו טקסט לדוגמה בלבד.",
        image: null,
        audio: null,
        sample: true,
      },
      {
        title: "לדוגמה: עוד רעיון לשולחן שבת",
        description: "כאן יבוא תיאור אמיתי של הרעיון. זהו טקסט לדוגמה בלבד, להמחשת מבנה הכרטיס.",
        image: null,
        audio: null,
        sample: true,
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
        title: "לדוגמה: איך נבנו הפירמידות?",
        description: "כאן יבוא תיאור אמיתי של נושא הפרק ומה מעניין בו. זהו טקסט לדוגמה בלבד.",
        image: null,
        audio: null,
        sample: true,
      },
      {
        title: "לדוגמה: מה קורה בגוף שלנו כשאנחנו ישנים?",
        description: "כאן יבוא תיאור אמיתי של נושא הפרק. זהו טקסט לדוגמה בלבד, להמחשת מבנה הכרטיס.",
        image: null,
        audio: null,
        sample: true,
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
        title: "לדוגמה: הבית והעץ",
        description: "השוו בין שתי התמונות ומצאו את כל ההבדלים. לחצו על \"הצג פתרון\" כדי לראות איפה הם מסתתרים.",
        imageA: "assets/images/spot-diff-a.svg",
        imageB: "assets/images/spot-diff-b.svg",
        diffCount: 6,
        spots: [
          { x: 82.5, y: 20 },
          { x: 46.25, y: 11.7 },
          { x: 19.4, y: 31.7 },
          { x: 37.75, y: 73 },
          { x: 30.75, y: 80.3 },
          { x: 53.75, y: 88.3 },
        ],
        sample: true,
      },
    ],
  },
  {
    id: "what-to-do",
    name: "מה לעשו״ת?",
    icon: "❓",
    color: "#22bcc7",
    type: "audio",
    tagline: "שאלה הלכתית לילדים, עם התשובה - הכול מוקרא יחד בהקלטה אחת.",
    episodes: [
      {
        title: "לדוגמה: מצאתי חפץ שאינו שלי - מה עושים?",
        description: "כאן תישמע שאלה הלכתית לילדים ותשובה עליה, מוקראות יחד בהקלטה אחת. זהו טקסט לדוגמה בלבד - לפני העלאת פרק אמיתי יש לוודא שהתשובה נבדקה ואושרה על ידי רב מוסמך.",
        image: null,
        audio: null,
        sample: true,
      },
      {
        title: "לדוגמה: ספר קודש על הרצפה - מה עושים?",
        description: "כאן תישמע שאלה הלכתית לילדים ותשובה עליה, מוקראות יחד בהקלטה אחת. זהו טקסט לדוגמה בלבד - לפני העלאת פרק אמיתי יש לוודא שהתשובה נבדקה ואושרה על ידי רב מוסמך.",
        image: null,
        audio: null,
        sample: true,
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
  if (ep.image) {
    return `
      <div class="content-card__media">
        ${badge}
        <img class="content-card__main-img" src="${ep.image}" alt="${ep.title}" loading="lazy" data-full="${ep.image}">
      </div>`;
  }
  return `
      <div class="content-card__media">
        ${badge}
        <div class="cover-placeholder" style="background: linear-gradient(150deg, color-mix(in srgb, ${cat.color} 65%, white), ${cat.color})"><span aria-hidden="true">${cat.icon}</span></div>
      </div>`;
}

function playerHTML(ep, idx) {
  if (ep.audio) {
    return `
      <div class="player" data-src="${ep.audio}">
        <button class="player__btn" type="button" aria-label="הפעל הקראה">▶</button>
        <div class="player__body">
          <input class="player__seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="התקדמות ההקראה">
          <div class="player__times">
            <span class="player__current">0:00</span>
            <span class="player__duration">--:--</span>
          </div>
        </div>
      </div>`;
  }
  return `
      <div class="player player--soon">
        <span class="player__soon-icon" aria-hidden="true">🎙️</span>
        <span class="player__soon-label">ההקלטה תעלה בקרוב</span>
      </div>`;
}

function audioCardHTML(cat, ep, idx) {
  const reverseClass = idx % 2 === 1 ? " content-card--reverse" : "";
  return `
  <article class="content-card${reverseClass}">
    ${mediaHTML(cat, ep, idx)}
    <div class="content-card__body">
      <span class="content-card__eyebrow">${cat.name}</span>
      <h3 class="content-card__title">${ep.title}</h3>
      <p class="content-card__desc"><strong>על הפרק: </strong>${ep.description}</p>
      ${playerHTML(ep, idx)}
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
        <div class="spot-card__frame">
          <span class="spot-card__label">תמונה א</span>
          <img src="${ep.imageA}" alt="תמונה א להשוואה">
          ${markers}
        </div>
        <div class="spot-card__frame">
          <span class="spot-card__label">תמונה ב</span>
          <img src="${ep.imageB}" alt="תמונה ב להשוואה">
          ${markers}
        </div>
      </div>
      <div class="spot-card__actions">
        <button class="btn btn--primary" type="button" data-spot-toggle>הצג פתרון (${ep.diffCount} הבדלים)</button>
      </div>
    </div>
  </article>`;
}

const INITIAL_VISIBLE_EPISODES = 4;

function renderCategorySections() {
  const host = document.getElementById("category-sections");
  host.innerHTML = CATEGORIES.map((cat) => {
    // הפרק שנוסף אחרון מוצג ראשון, בלי קשר לסדר בו הוא נוסף למערך הנתונים.
    const episodesNewestFirst = [...cat.episodes].reverse();
    const hasSample = cat.episodes.some((ep) => ep.sample);
    const overflowCount = Math.max(0, episodesNewestFirst.length - INITIAL_VISIBLE_EPISODES);

    const cardsHTML = episodesNewestFirst
      .map((ep, idx) => {
        const hiddenAttr = idx >= INITIAL_VISIBLE_EPISODES ? ' hidden data-overflow-card="true"' : "";
        const card = cat.type === "spot-diff" ? spotDiffCardHTML(cat, ep, idx) : audioCardHTML(cat, ep, idx);
        return card.replace("<article ", `<article${hiddenAttr} `);
      })
      .join("");

    const noteHTML = hasSample
      ? `<span class="category-section__note">🧩 התכנים שלהלן הם דוגמה למבנה בלבד - הם יוחלפו בהקלטות ובתכנים אמיתיים</span>`
      : "";
    const showMoreHTML = overflowCount > 0
      ? `<button class="btn btn--ghost category-section__more" type="button" data-show-more="cat-${cat.id}">הצג את כל ${episodesNewestFirst.length} הפרקים</button>`
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
      : `הצג פתרון (${card.querySelectorAll(".spot-card__frame:first-child .spot-card__marker").length} הבדלים)`;
  });
}

/* ---------------------------------------------------------------
   Audio players
--------------------------------------------------------------- */
function setupPlayers() {
  const players = Array.from(document.querySelectorAll(".player:not(.player--soon)"));

  players.forEach((el) => {
    const src = el.dataset.src;
    const btn = el.querySelector(".player__btn");
    const seek = el.querySelector(".player__seek");
    const current = el.querySelector(".player__current");
    const duration = el.querySelector(".player__duration");
    let audio = null;
    let seeking = false;

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
      });
      audio.addEventListener("pause", () => {
        btn.textContent = "▶";
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "המשך הקראה");
      });
      audio.addEventListener("ended", () => {
        btn.textContent = "▶";
        btn.classList.remove("is-playing");
        seek.value = 0;
        current.textContent = "0:00";
      });
      return audio;
    }

    btn.addEventListener("click", () => {
      const a = ensureAudio();
      if (a.paused) a.play().catch(() => {});
      else a.pause();
    });

    el.addEventListener("zkb-pause-request", () => {
      if (audio && !audio.paused) audio.pause();
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
  });
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

  const dismissKey = "zkb-install-dismissed";
  const alreadyDismissed = storage && storage.getItem(dismissKey) === "1";

  if (!isMobileUA || isStandalone || alreadyDismissed) return;

  let deferredPrompt = null;

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  function dismiss() {
    hideBanner();
    if (storage) storage.setItem(dismissKey, "1");
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
   Init
--------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCatNav();
  renderCategorySections();
  setupMediaInteractions();
  setupSpotDiff();
  setupShowMore();
  setupPlayers();
  setupScrollReveal();
  setupInstallBanner();
  setupServiceWorker();
});
