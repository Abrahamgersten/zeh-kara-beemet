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
        audio: "../assets/audio/en/kol-nidrei-drunkard.mp3",
      },
      {
        title: "A Debt of Gratitude",
        description: "A true story about Rabbi Isser Zalman Meltzer, the great head of the Etz Chaim Yeshiva in Jerusalem - and why, in his old age, he made the difficult climb to a simple family's bar mitzvah to personally thank them for a gift they never knew they'd given him.",
        image: "../assets/images/en/isser-zalman-gratitude.jpeg",
        audio: "../assets/audio/en/isser-zalman-gratitude.mp3",
      },
      {
        title: "Step by Step",
        description: "A true story about Rabbi Yosef Chaim of Baghdad, known as the Ben Ish Chai - and about a curious student who once tried to race up the stairs for a glimpse of Eliyahu HaNavi, and what he learned instead about the real way to reach greatness.",
        image: "../assets/images/en/ben-ish-chai.jpeg",
        audio: "../assets/audio/en/ben-ish-chai.mp3",
      },
      {
        title: "A Mistake in the Math",
        description: "A true story about the Chazon Ish, Rabbi Avraham Yeshayahu Karelitz, one of the greatest rabbis of recent times - and about the night his student found him collapsed on the floor, and what he said had gone wrong.",
        image: "../assets/images/en/chazon-ish-calculation.jpeg",
        audio: "../assets/audio/en/chazon-ish-calculation.mp3",
      },
      {
        title: "Everyone Has Something to Give",
        description: "A true story about Rabbi Shmuel HaLevi Wozner visiting a suffering patient in the hospital - and the story he told him about a sick man from his own youth who found he still had one thing left to give.",
        image: "../assets/images/en/something-to-give.jpeg",
        audio: "../assets/audio/en/something-to-give.mp3",
      },
      {
        title: "Water in the Desert",
        description: "A true story about the holy Baal Shem Tov and a thirsty student who learned, in the middle of the desert, that G-d takes care of us long before we even know we need help.",
        image: "../assets/images/en/baal-shem-tov-water.jpeg",
        audio: "../assets/audio/en/baal-shem-tov-water.mp3",
      },
      {
        title: "A Share in Heaven",
        description: "A true story about Rabbi Levi Yitzchak of Berditchev, the defender of the Jewish people, and a dying man tormented by his past - and the extraordinary gift the Rabbi offered him in his final moments.",
        image: "../assets/images/en/share-in-heaven.jpeg",
        audio: "../assets/audio/en/share-in-heaven.mp3",
      },
      {
        title: "The Believing Officer",
        description: "A true story told to Rabbi Shlomo Carlebach by a secular officer during the Yom Kippur War - about a wounded friend's final request, and the moment two words changed everything he believed.",
        image: "../assets/images/en/believing-officer.jpeg",
        audio: "../assets/audio/en/believing-officer.mp3",
      },
      {
        title: "Respect for the Sages",
        description: "A true story about the Baba Sali, Rabbi Yisrael Abuhatzeira, and a man who wrote a book challenging the holy Ohr HaChaim - what happened when he came to the Baba Sali's home in Netivot, and what it teaches us about how to approach the words of our great sages.",
        image: "../assets/images/en/baba-sali-respect.jpeg",
        audio: "../assets/audio/en/baba-sali-respect.mp3",
      },
      {
        title: "Kindness to Every Creature",
        description: "A true story about the holy Ari and a kind, welcoming couple who waited years for children - and the small thing from long ago that the Ari helped them understand.",
        image: "../assets/images/en/ari-kindness-to-animals.jpeg",
        audio: "../assets/audio/en/ari-kindness-to-animals.mp3",
      },
      {
        title: "The Boy and the Flute",
        description: "A true story about the Baal Shem Tov and a simple village boy who didn't know how to pray or learn Torah - and what he did to show G-d how much he loved Him.",
        image: "../assets/images/en/besht-flute-boy.jpeg",
        audio: "../assets/audio/en/besht-flute-boy.mp3",
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
        image: "../assets/images/en/amazing-bat.jpeg",
        audio: "../assets/audio/en/amazing-bat.mp3",
      },
      {
        title: "The Platypus",
        description: "An animal with fur like a mammal, a bill like a duck, and webbed feet - that lays eggs! Meet the platypus, one of the strangest and most surprising animals in the world.",
        image: "../assets/images/en/platypus.jpeg",
        audio: "../assets/audio/en/platypus.mp3",
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
        description: "The six days of creation, Adam and Eve in the Garden of Eden, and the story of Cain and Abel - and the big lesson of the parsha about the power to choose, every single day.",
        image: null,
        audio: "../assets/audio/en/parasha-bereishit.mp3",
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
        title: "Example: An Idea from This Week's Parsha",
        description: "Here a real description of the episode's central idea will go - what's the question, and what's the insight. This is sample text only.",
        image: null,
        audio: null,
        sample: true,
      },
      {
        title: "Example: Another Idea for the Shabbat Table",
        description: "Here a real description of the idea will go. This is sample text only, to demonstrate the card layout.",
        image: null,
        audio: null,
        sample: true,
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
        title: "Example: How Were the Pyramids Built?",
        description: "Here a real description of the episode's topic and what's interesting about it will go. This is sample text only.",
        image: null,
        audio: null,
        sample: true,
      },
      {
        title: "Example: What Happens in Our Bodies When We Sleep?",
        description: "Here a real description of the episode's topic will go. This is sample text only, to demonstrate the card layout.",
        image: null,
        audio: null,
        sample: true,
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
        title: "Example: The House and the Tree",
        description: "Compare the two pictures and find all the differences. Click \"Show Solution\" to see where they're hiding.",
        imageA: "../assets/images/spot-diff-a.svg",
        imageB: "../assets/images/spot-diff-b.svg",
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
    name: "What Would You Do?",
    icon: "❓",
    color: "#22bcc7",
    type: "audio",
    tagline: "A halachic question for kids, with the answer - all read together in one recording.",
    episodes: [
      {
        title: "Example: I Found Something That Isn't Mine - What Should I Do?",
        description: "Here you'll hear a halachic question for kids and its answer, read together in one recording. This is sample text only - before uploading a real episode, make sure the answer has been checked and approved by a qualified rabbi.",
        image: null,
        audio: null,
        sample: true,
      },
      {
        title: "Example: A Holy Book on the Floor - What Should I Do?",
        description: "Here you'll hear a halachic question for kids and its answer, read together in one recording. This is sample text only - before uploading a real episode, make sure the answer has been checked and approved by a qualified rabbi.",
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

function renderCategorySections() {
  const host = document.getElementById("category-sections");
  host.innerHTML = CATEGORIES.map((cat) => {
    // Newest-added episode first, regardless of the order it was pushed into
    // the data array - keeps the freshest content most discoverable without
    // needing to remember to unshift instead of push when adding one.
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
      ? `<span class="category-section__note">🧩 The items below are structural examples only - they'll be replaced with real recordings and content</span>`
      : "";
    const showMoreHTML = overflowCount > 0
      ? `<button class="btn btn--ghost category-section__more" type="button" data-show-more="cat-${cat.id}">Show all ${episodesNewestFirst.length} episodes</button>`
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
      ? "Hide Solution"
      : `Show Solution (${card.querySelectorAll(".spot-card__frame:first-child .spot-card__marker").length} differences)`;
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
        btn.setAttribute("aria-label", "Pause");
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

  const dismissKey = "zkb-install-dismissed-en";
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
  setupScrollReveal();
  setupInstallBanner();
  setupServiceWorker();
});
