"use strict";

/* ---------------------------------------------------------------
   Content data (English)
   ---------------------------------------------------------------
   Every category holds episodes. The episodes here are sample
   content only (sample: true) to demonstrate the layout. To add
   real content: fill in title / description / image / audio on
   the matching object, and remove sample: true.

   image: path to a cover image, or null to show a placeholder with
          the category icon.
   audio: path to an mp3 file, or null to show a "coming soon" label.
   pdf: (optional) path to a downloadable/printable PDF file, or null.
   pointsItemKey: (optional) links the episode to a "report" item in the
     points system (js/points.js) - when present, a per-child reading
     report checklist is shown below the episode. Must match the
     equivalent value in js/app.js (Hebrew) for the same episode exactly.
--------------------------------------------------------------- */
const CATEGORIES = [
  {
    id: "tzadikim",
    name: "It Really Happened",
    icon: "🕯️",
    color: "#f0812c",
    type: "audio",
    tagline: "Stories from real life, told by storytellers, about the great sages and tzaddikim of the generations - faith, good character, and love of Israel.",
    episodes: [
      {
        title: "The Drunkard of Kol Nidrei",
        description: "A true story about the Alter Rebbe, Rabbi Schneur Zalman of Liadi, and Reb Shmuel - a man who did something extraordinary on the eve of Yom Kippur to save a Jewish family from jail, and why the Rebbe said his heart had already reached the joy of Simchat Torah.",
        image: "../assets/images/en/kol-nidrei-drunkard.jpeg",
        audio: "../assets/audio/en/kol-nidrei-drunkard-sfx3.mp3",
      },
      {
        title: "A Debt of Gratitude",
        description: "A true story about Rabbi Isser Zalman Meltzer, the great head of the Etz Chaim Yeshiva in Jerusalem - and why, in his old age, he made the difficult climb to a simple family's bar mitzvah to personally thank them for a gift they never knew they'd given him.",
        image: "../assets/images/en/isser-zalman-gratitude.jpeg",
        audio: "../assets/audio/en/isser-zalman-gratitude-sfx3.mp3",
      },
      {
        title: "Step by Step",
        description: "A true story about Rabbi Yosef Chaim of Baghdad, known as the Ben Ish Chai - and about a curious student who once tried to race up the stairs for a glimpse of Eliyahu HaNavi, and what he learned instead about the real way to reach greatness.",
        image: "../assets/images/en/ben-ish-chai.jpeg",
        audio: "../assets/audio/en/ben-ish-chai-sfx3.mp3",
      },
      {
        title: "A Mistake in the Math",
        description: "A true story about the Chazon Ish, Rabbi Avraham Yeshayahu Karelitz, one of the greatest rabbis of recent times - and about the night his student found him collapsed on the floor, and what he said had gone wrong.",
        image: "../assets/images/en/chazon-ish-calculation.jpeg",
        audio: "../assets/audio/en/chazon-ish-calculation-sfx3.mp3",
      },
      {
        title: "Everyone Has Something to Give",
        description: "A true story about Rabbi Shmuel HaLevi Wozner visiting a suffering patient in the hospital - and the story he told him about a sick man from his own youth who found he still had one thing left to give.",
        image: "../assets/images/en/something-to-give.jpeg",
        audio: "../assets/audio/en/something-to-give-sfx3.mp3",
      },
      {
        title: "Water in the Desert",
        description: "A true story about the holy Baal Shem Tov and a thirsty student who learned, in the middle of the desert, that G-d takes care of us long before we even know we need help.",
        image: "../assets/images/en/baal-shem-tov-water.jpeg",
        audio: "../assets/audio/en/baal-shem-tov-water-sfx3.mp3",
      },
      {
        title: "A Share in Heaven",
        description: "A true story about Rabbi Levi Yitzchak of Berditchev, the defender of the Jewish people, and a dying man tormented by his past - and the extraordinary gift the Rabbi offered him in his final moments.",
        image: "../assets/images/en/share-in-heaven.jpeg",
        audio: "../assets/audio/en/share-in-heaven-sfx3.mp3",
      },
      {
        title: "The Believing Officer",
        description: "A true story told to Rabbi Shlomo Carlebach by a secular officer during the Yom Kippur War - about a wounded friend's final request, and the moment two words changed everything he believed.",
        image: "../assets/images/en/believing-officer.jpeg",
        audio: "../assets/audio/en/believing-officer-sfx3.mp3",
      },
      {
        title: "Respect for the Sages",
        description: "A true story about the Baba Sali, Rabbi Yisrael Abuhatzeira, and a man who wrote a book challenging the holy Ohr HaChaim - what happened when he came to the Baba Sali's home in Netivot, and what it teaches us about how to approach the words of our great sages.",
        image: "../assets/images/en/baba-sali-respect.jpeg",
        audio: "../assets/audio/en/baba-sali-respect-sfx3.mp3",
      },
      {
        title: "Kindness to Every Creature",
        description: "A true story about the holy Ari and a kind, welcoming couple who waited years for children - and the small thing from long ago that the Ari helped them understand.",
        image: "../assets/images/en/ari-kindness-to-animals.jpeg",
        audio: "../assets/audio/en/ari-kindness-to-animals-sfx3.mp3",
      },
      {
        title: "The Boy and the Flute",
        description: "A true story about the Baal Shem Tov and a simple village boy who didn't know how to pray or learn Torah - and what he did to show G-d how much he loved Him.",
        image: "../assets/images/en/besht-flute-boy.jpeg",
        audio: "../assets/audio/en/besht-flute-boy-sfx3.mp3",
      },
    ],
  },
  {
    id: "wonders",
    name: "Wonders of Creation",
    icon: "🦋",
    color: "#4caf6d",
    type: "audio",
    tagline: "Audio tours through the natural world - animals, plants, and amazing phenomena that show how everything was created with wisdom.",
    episodes: [
      {
        title: "The Amazing Bat",
        description: "How can a bat fly at night, in total darkness, without crashing into anything? Discover the amazing secret of the only mammal in the world that can really fly.",
        images: ["../assets/images/en/amazing-bat-main.jpeg", "../assets/images/en/amazing-bat.jpeg"],
        audio: "../assets/audio/en/amazing-bat-sfx3.mp3",
      },
      {
        title: "The Platypus",
        description: "An animal with fur like a mammal, a bill like a duck, and webbed feet - that lays eggs! Meet the platypus, one of the strangest and most surprising animals in the world.",
        images: ["../assets/images/en/platypus-main.jpeg", "../assets/images/en/platypus.jpeg"],
        audio: "../assets/audio/en/platypus-sfx3.mp3",
      },
    ],
  },
  {
    id: "parasha-what",
    name: "This Week's Parsha",
    icon: "📜",
    color: "#3aa8e0",
    type: "audio",
    tagline: "The story of the weekly Torah portion in simple, clear language - a short episode you can listen to on the way to school.",
    episodes: [
      {
        title: "Parashat Bereishit",
        parasha: "בראשית",
        description: "The six days of creation, Adam and Eve in the Garden of Eden, and the story of Cain and Abel - and the big lesson of the parsha about the power to choose, every single day.",
        image: "../assets/images/en/parasha-bereishit.jpeg",
        audio: "../assets/audio/en/parasha-bereishit-sfx3.mp3",
      },
      {
        title: "Parashat Noach",
        parasha: "נח",
        description: "The flood, Noah's ark and the animals that entered two by two, all the way to the Tower of Babel - and an important message: even when everyone around us is heading in one direction, we can still choose our own path.",
        image: "../assets/images/en/parasha-noach.jpeg",
        audio: "../assets/audio/en/parasha-noach-sfx3.mp3",
      },
    ],
  },
  {
    id: "parasha-idea",
    name: "An Idea from the Parsha",
    icon: "💡",
    color: "#f2c230",
    type: "audio",
    tagline: "One deep, practical idea, straight from the weekly Torah portion.",
    episodes: [
      {
        title: "A Thought on Parashat Bereishit",
        parasha: "בראשית",
        description: "What does it mean that man was created \"in the image of G-d\"? An idea about the tremendous power that every single Jew holds - and why we should never take it for granted.",
        image: "../assets/images/en/parasha-idea-bereishit.jpeg",
        audio: "../assets/audio/en/parasha-idea-bereishit-sfx3.mp3",
        pdf: "../assets/pdf/parasha-idea-bereishit-en.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
      {
        title: "A Thought on Parashat Noach",
        parasha: "נח",
        description: "Why were the animals swept away in the flood too, when they can't choose between good and evil? A deep idea about how much power our choices have to influence everything around us - for good, and for bad.",
        image: "../assets/images/en/parasha-idea-noach.jpeg",
        audio: "../assets/audio/en/parasha-idea-noach-sfx3.mp3",
        pdf: "../assets/pdf/parasha-idea-noach-en.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
    ],
  },
  {
    id: "enlightenment",
    name: "A Spark of Knowledge",
    icon: "📚",
    color: "#9b6fd1",
    type: "audio",
    tagline: "General knowledge and science, presented tastefully, to broaden horizons without losing our identity.",
    episodes: [
      {
        title: "The Invention of Writing",
        description: "Five thousand years ago, knowledge could only be passed down by memory. How writing began with clay tablets and symbols - and how it changed human life forever.",
        image: "../assets/images/en/invention-of-writing.jpeg",
        audio: "../assets/audio/en/invention-of-writing-sfx3.mp3",
      },
      {
        title: "Journey to the Ocean Depths",
        description: "A submarine sinks into the ocean, the light fades, and the adventure begins - meet the anglerfish with its mysterious flashlight, giant tube worms living by underwater volcanoes, and a giant jellyfish with tentacles up to thirty meters long.",
        image: "../assets/images/en/ocean-depths-journey.jpeg",
        audio: "../assets/audio/en/ocean-depths-journey-sfx3.mp3",
      },
    ],
  },
  {
    id: "spot-diff",
    name: "Spot the Difference",
    icon: "🔍",
    color: "#f26d7d",
    type: "spot-diff",
    tagline: "A picture game - compare the two pictures and find all the differences between them.",
    episodes: [
      {
        title: "The Days of Creation Wheel",
        parasha: "בראשית",
        description: "Compare the two pictures of the days of creation and Shabbat, and find all the differences between them. Click \"Show Solution\" to see where they are hiding.",
        imageA: "../assets/images/spot-diff-bereishit-a.jpg",
        imageB: "../assets/images/spot-diff-bereishit-b.jpg",
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
        title: "Noah's Ark and the Rainbow",
        parasha: "נח",
        description: "A Parashat Noach coloring picture: the animals walk down from the ark onto dry land, with a rainbow in the sky. Compare the two pictures and find the 10 differences. Click \"Show Solution\" to see where they are hiding.",
        imageA: "../assets/images/spot-diff-noach-a.jpg",
        imageB: "../assets/images/spot-diff-noach-b.jpg",
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
    name: "I've Got a Clue!",
    icon: "❓",
    color: "#22bcc7",
    type: "audio",
    tagline: "A halachic question for kids, with the answer - all read together in one recording.",
    episodes: [
      {
        title: "Birkat Hamazon",
        description: "Why do we say a blessing after we eat? Who really gives us our bread - and what are the four blessings of Birkat Hamazon? A chance to stop, say thank you, and remember that our abundance is never to be taken for granted.",
        image: "../assets/images/en/birkat-hamazon.jpeg",
        audio: "../assets/audio/en/birkat-hamazon-sfx3.mp3",
      },
      {
        title: "The Weekly Torah Portion",
        description: "Why do we read a different portion of the Torah every Shabbat, and what does it have to do with us thousands of years later? How to listen to the Torah reading and ask: what does this portion want to teach me?",
        image: "../assets/images/en/parasha-of-the-week.jpeg",
        audio: "../assets/audio/en/parasha-of-the-week-sfx3.mp3",
      },
    ],
  },
  {
    id: "healthy-to-know",
    name: "Healthy to Know",
    icon: "🍎",
    color: "#7cb342",
    type: "audio",
    tagline: "Everything worth knowing about our bodies, nutrition, and health - in simple, clear language, so we can grow up healthy and strong.",
    episodes: [
      {
        title: "Why Breakfast Matters",
        description: "Why shouldn't we skip breakfast? How it gives our body and brain fuel for the whole day, what a balanced breakfast includes, and a small challenge for the coming week.",
        image: "../assets/images/en/healthy-breakfast.jpeg",
        audio: "../assets/audio/en/healthy-breakfast-sfx3.mp3",
      },
      {
        title: "The Benefits of Reading",
        description: "Reading strengthens the brain, sparks the imagination, calms us down, and even helps us fall asleep. Why it's worth picking up a book every day - and what you can discover between the pages.",
        image: "../assets/images/en/benefits-of-reading.jpeg",
        audio: "../assets/audio/en/benefits-of-reading-sfx3.mp3",
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
        <p class="cat-pill__desc">${cat.episodes.length} episodes</p>
      </span>
    </a>`
  ).join("");
}

/* ---------------------------------------------------------------
   Render: episode / content cards per type
--------------------------------------------------------------- */
function mediaHTML(cat, ep, idx) {
  const badge = ep.sample ? `<span class="content-card__badge">Sample content</span>` : "";
  // ep.images: [main, thumb] - a second illustration per episode (same pattern as the "Diamond Island" site): the
  // main one shows large, the second is a small thumb that swaps places with it on click. ep.image (single) still
  // works exactly as before - this is purely an optional addition.
  const [main, thumb] = ep.images || (ep.image ? [ep.image] : []);
  if (main) {
    const thumbHTML = thumb
      ? `<button class="content-card__thumb" type="button" data-swap aria-label="Switch to the second image">
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

function playerHTML(ep, idx) {
  if (ep.audio) {
    return `
      <div class="player" data-src="${ep.audio}">
        <button class="player__btn" type="button" aria-label="Play narration">▶</button>
        <div class="player__body">
          <input class="player__seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="Playback progress">
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
        <span class="player__soon-label">Recording coming soon</span>
      </div>`;
}

// Printable "dvar Torah" card + per-child reading report (points system,
// js/points.js) - shown only when the episode has a pointsItemKey. The
// report checklist itself is built by points.js (not here - app.js has no
// Supabase awareness), only the empty div with data-report-item-key is emitted.
function pdfReportHTML(ep) {
  if (!ep.pointsItemKey) return "";
  const dl = ep.pdf
    ? `<a class="btn btn--outline content-card__pdf-btn" href="${ep.pdf}" target="_blank" download>📄 Download the printable "dvar Torah" page</a>`
    : `<span class="player player--soon"><span class="player__soon-icon" aria-hidden="true">🖨️</span><span class="player__soon-label">The PDF is coming soon</span></span>`;
  return `
    <div class="content-card__pdf">
      ${dl}
      <div class="content-card__report" data-report-item-key="${ep.pointsItemKey}"></div>
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
      <p class="content-card__desc"><strong>About this episode: </strong>${ep.description}</p>
      ${playerHTML(ep, idx)}
      ${pdfReportHTML(ep)}
    </div>
  </article>`;
}

function spotDiffCardHTML(cat, ep, idx) {
  const badge = ep.sample ? `<span class="content-card__badge--inline">Sample content</span>` : "";
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
          <span class="spot-card__label">Image A</span>
          <img src="${ep.imageA}" alt="Image A for comparison">
          ${markers}
        </div>
        <div class="spot-card__frame">
          <span class="spot-card__label">Image B</span>
          <img src="${ep.imageB}" alt="Image B for comparison">
          ${markers}
        </div>
      </div>
      <div class="spot-card__actions">
        <button class="btn btn--primary" type="button" data-spot-toggle>Show Solution (${ep.diffCount} differences)</button>
      </div>
    </div>
  </article>`;
}

const INITIAL_VISIBLE_EPISODES = 4;
const PARASHA_CATEGORY_IDS = ["parasha-what", "parasha-idea", "spot-diff"];

function renderCategorySections() {
  const host = document.getElementById("category-sections");
  host.innerHTML = CATEGORIES.map((cat) => {
    // Newest-added episode first, regardless of the order it was pushed into
    // the data array - keeps the freshest content most discoverable without
    // needing to remember to unshift instead of push when adding one.
    let episodesNewestFirst = [...cat.episodes].reverse();
    // מדורי הפרשה: הפרשה של השבת הקרובה בראש, ואחריה הבאות בתור (js/parasha-order.js).
    if (PARASHA_CATEGORY_IDS.includes(cat.id) && typeof orderEpisodesByParasha === "function") {
      episodesNewestFirst = orderEpisodesByParasha(episodesNewestFirst);
    }
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
      ? `<span class="category-section__note">🧩 The items below are structural examples only - they'll be replaced with real recordings and content</span>`
      : "";
    const showMoreHTML = overflowCount > 0
      ? `<button class="btn btn--ghost category-section__more" type="button" data-show-more="cat-${cat.id}">Show more episodes</button>`
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
      ? "Hide Solution"
      : `Show Solution (${card.querySelectorAll(".spot-card__frame:first-child .spot-card__marker").length} differences)`;
    if (solved) {
      const catEl = card.querySelector(".content-card__eyebrow");
      const titleEl = card.querySelector(".content-card__title");
      window.zkbLogEvent && window.zkbLogEvent("spot_diff_solved", catEl ? catEl.textContent : null, titleEl ? titleEl.textContent : null);
    }
  });
}

/* ---------------------------------------------------------------
   Lightweight usage tracking (see js/analytics.js) - category chip click
   in the quick-nav grid. Non-blocking, doesn't affect navigation
   (href="#cat-..." keeps working exactly as before).
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
    let loggedPlay = false;

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
        btn.setAttribute("aria-label", "Pause");
        // Lightweight, non-blocking usage tracking (see js/analytics.js) -
        // only on the first play of a page load, not on every pause/resume.
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
        btn.setAttribute("aria-label", "Resume narration");
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
   Hero: twinkling stars (same effect as "Diamond Island") + an occasional moon
--------------------------------------------------------------- */
function setupSparkles() {
  const wrap = document.querySelector(".hero__sparkles");
  if (!wrap) return;
  // Count scales with the hero's area instead of being fixed: "Diamond Island" has 16 stars over ~830,000 px²
  // (one per ~52,000). This hero is shorter, so a fixed count looked denser - here one per ~55,000, clamped to 8-14.
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
    // No moon in a hidden tab (its animation doesn't run there, so the node would linger)
    if (!document.hidden) {
      const size = 34 + Math.random() * 22;
      const moon = document.createElement("span");
      moon.className = "hero__moon";
      moon.style.width = moon.style.height = `${size}px`;
      // Side margins only (left/right thirds) and the top band, so the moon never covers the centered title/text
      moon.style.left = `${Math.random() < 0.5 ? 4 + Math.random() * 20 : 74 + Math.random() * 18}%`;
      moon.style.top = `${3 + Math.random() * 9}%`;
      // Crescent = offset inner shadow on a transparent circle; thickness scales with size so every moon looks alike
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

  // 2026-09-23: was localStorage (remembered forever, even after the app was
  // uninstalled) - changed to sessionStorage per Avraham's request: closing
  // it only quiets the current visit, not forever - so if the app still
  // isn't installed, the strip reappears on the next visit.
  const dismissKey = "zkb-install-dismissed-en";
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
    subEl.textContent = "Get to everything with one tap, right from your home screen";
    showBanner();
  });

  window.addEventListener("appinstalled", () => {
    dismiss();
  });

  const instructions = document.createElement("div");
  instructions.className = "install-steps";
  instructions.innerHTML = isIOS
    ? `<button class="install-steps__close" type="button" aria-label="Close">✕</button>
       <h3>How to install on iPhone?</h3>
       <ol>
         <li>Tap the Share button ⬆️ in Safari's toolbar</li>
         <li>Scroll down and choose "Add to Home Screen"</li>
         <li>Tap "Add" - and that's it, the app is ready!</li>
       </ol>`
    : `<button class="install-steps__close" type="button" aria-label="Close">✕</button>
       <h3>How to install?</h3>
       <ol>
         <li>Open the browser menu (three dots)</li>
         <li>Choose "Install app" or "Add to Home Screen"</li>
         <li>Confirm - and that's it, the app is ready!</li>
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
    subEl.textContent = "Add it to your home screen and get a real app on your phone";
    showBanner();
  } else {
    setTimeout(() => {
      if (!deferredPrompt && banner.hidden) {
        subEl.textContent = "Add the app to your home screen";
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
      navigator.serviceWorker.register("../sw.js").catch(() => {});
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
  setupCatNavTracking();
  setupSparkles();
  setupMoon();
  setupScrollReveal();
  setupInstallBanner();
  setupServiceWorker();
});
