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
      {
        title: "Rabbi Mordechai Eliyahu and the Cat",
        description: "A busy, crowded day at the home of the Chief Rabbi of Israel, and right as he's about to leave - one question is waiting for him. Not a great halachic question, but one about a cat that won't eat. How do we see real greatness in the \"small\" things?",
        image: "../assets/images/en/mordechai-eliyahu-cat.jpeg",
        audio: "../assets/audio/en/mordechai-eliyahu-cat-sfx3.mp3",
      },
      {
        title: "Hashem Doesn't Owe Us Anything",
        description: "A true story told by a woman who waited many years for children, and about the blessing she received from a leading rabbi of the generation - Rabbi Shlomo Zalman Auerbach. What did he tell her that stayed with her every single day since?",
        image: "../assets/images/en/hashem-not-obligated.jpeg",
        audio: "../assets/audio/en/hashem-not-obligated-sfx3.mp3",
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
      {
        title: "The Wise Builder",
        description: "A creature that can cut down whole trees with its teeth, and build its own house inside the water. Why there, of all places? Meet the beaver, one of the most talented builders in all of nature.",
        image: "../assets/images/en/wise-builder.jpeg",
        audio: "../assets/audio/en/wise-builder-sfx3.mp3",
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
      {
        title: "Parashat Lech Lecha",
        parasha: "לך לך",
        description: "Avraham Avinu leaves his home and everything he knows, sets out on a journey to an unfamiliar land, faces difficult tests - and in the end is given a special covenant with Hashem. A journey of faith that begins with two words: Lech Lecha.",
        image: "../assets/images/en/parasha-lechlecha.jpeg",
        audio: "../assets/audio/en/parasha-lechlecha-sfx3.mp3",
      },
      {
        title: "Parashat Vayera",
        parasha: "וירא",
        description: "Avraham Avinu welcomes guests at the entrance of his tent, prays for Sodom, rejoices at Yitzchak's birth and stands up to the test of the Akeidah - and what we learn from his total devotion.",
        image: "../assets/images/en/parasha-vayera.jpeg",
        audio: "../assets/audio/en/parasha-vayera-sfx3.mp3",
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
      {
        title: "A Thought on Parashat Lech Lecha",
        parasha: "לך לך",
        description: "Avraham Avinu and Lot both face an important choice. One chooses based on what looks good, and the other chooses based on what's right. Which kind of choice do we make, every single day?",
        image: "../assets/images/en/parasha-idea-lechlecha.jpeg",
        audio: "../assets/audio/en/parasha-idea-lechlecha-sfx3.mp3",
        pdf: "../assets/pdf/parasha-idea-lechlecha-en.pdf",
        pointsItemKey: "parasha-report-weekly",
      },
      {
        title: "A Thought on Parashat Vayera",
        parasha: "וירא",
        description: "Why does Avraham Avinu start by asking for fifty righteous people, and not right away for ten? A thought about how to go far - step by step, until even what seems impossible becomes possible.",
        image: "../assets/images/en/parasha-idea-vayera.jpeg",
        audio: "../assets/audio/en/parasha-idea-vayera-sfx3.mp3",
        pdf: "../assets/pdf/parasha-idea-vayera-en.pdf",
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
      {
        title: "How Does a Phone Carry Our Voice?",
        description: "We talk to a friend on the other side of the world, and they hear us in an instant. The amazing journey of our voice: sound waves, a microphone, electrical signals, radio waves and a speaker.",
        image: "../assets/images/en/how-phone-carries-voices.jpeg",
        audio: "../assets/audio/en/how-phone-carries-voices-sfx4.mp3",
      },
      {
        title: "The Story of Plastic",
        description: "How was plastic born, why did it take over the world, and what big problem was discovered later? A journey from the oil deep underground to the recycling bin - and what each of us can do.",
        image: "../assets/images/en/story-of-plastic.jpeg",
        audio: "../assets/audio/en/story-of-plastic-sfx3.mp3",
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
        title: "The Garden of Eden",
        parasha: "בראשית",
        parashaEn: "Parashat Bereishit",
        description: "A Parashat Bereishit picture: the Garden of Eden with the apple tree, the river and its fish, the animals, the sun, the moon and the stars. Compare the two pictures and find the 10 differences. Click \"Show Solution\" to see where they are hiding.",
        imageA: "../assets/images/spot-diff-bereishit-color-a.jpg",
        imageB: "../assets/images/spot-diff-bereishit-color-b.jpg",
        coloringPage: "../assets/images/coloring/bereishit.jpg",
        diffCount: 10,
        spots: [
          { x: 91.8, y: 24.9 },
          { x: 54.2, y: 86.1 },
          { x: 6.8, y: 32.6 },
          { x: 50.8, y: 12.8 },
          { x: 63.5, y: 63.3 },
          { x: 91.5, y: 65.3 },
          { x: 33.6, y: 8.2 },
          { x: 61.6, y: 54.7 },
          { x: 43.8, y: 78.4 },
          { x: 24.4, y: 23.3 },
        ],
      },
      {
        title: "Noah's Ark and the Rainbow",
        parasha: "נח",
        parashaEn: "Parashat Noach",
        description: "A Parashat Noach picture: the animals walk down from the ark onto dry land, with a rainbow in the sky. Compare the two pictures and find the 10 differences. Click \"Show Solution\" to see where they are hiding.",
        imageA: "../assets/images/spot-diff-noach-color-a.jpg",
        imageB: "../assets/images/spot-diff-noach-color-b.jpg",
        coloringPage: "../assets/images/coloring/noach.jpg",
        diffCount: 10,
        spots: [
          { x: 14.4, y: 32.1 },
          { x: 57.5, y: 57.3 },
          { x: 18.2, y: 57.1 },
          { x: 61.7, y: 78.7 },
          { x: 71.0, y: 13.6 },
          { x: 74.0, y: 90.3 },
          { x: 39.8, y: 54.6 },
          { x: 67.2, y: 28.8 },
          { x: 15.5, y: 87.6 },
          { x: 37.0, y: 79.0 },
        ],
      },
      {
        title: "Avraham's Caravan",
        parasha: "לך לך",
        parashaEn: "Parashat Lech Lecha",
        description: "A Parashat Lech Lecha picture: a caravan of camels on the journey to the Land of Canaan, tents, a well and an altar, with stars in the sky. Compare the two pictures and find the 10 differences. Click \"Show Solution\" to see where they are hiding.",
        imageA: "../assets/images/spot-diff-lechlecha-color-a.jpg",
        imageB: "../assets/images/spot-diff-lechlecha-color-b.jpg",
        coloringPage: "../assets/images/coloring/lechlecha.jpg",
        diffCount: 10,
        spots: [
          { x: 79.1, y: 18.9 },
          { x: 50.8, y: 67.3 },
          { x: 32.6, y: 62.1 },
          { x: 87.1, y: 55.3 },
          { x: 11.1, y: 72.3 },
          { x: 74.6, y: 76.5 },
          { x: 42.0, y: 17.9 },
          { x: 94.5, y: 6.1 },
          { x: 33.6, y: 93.8 },
          { x: 54.6, y: 51.5 },
        ],
      },
      {
        title: "Avraham's Open Tent",
        parasha: "וירא",
        parashaEn: "Parashat Vayera",
        description: "A Parashat Vayera picture: Avraham's tent, open on all sides under the tamarisk tree, a table set for guests, a well, a donkey carrying wood, and the ram caught in the thicket. Compare the two pictures and find the 10 differences. Click \"Show Solution\" to see where they are hiding.",
        imageA: "../assets/images/spot-diff-vayera-color-a.jpg",
        imageB: "../assets/images/spot-diff-vayera-color-b.jpg",
        coloringPage: "../assets/images/coloring/vayera.jpg",
        diffCount: 10,
        spots: [
          { x: 4.7, y: 83.0 },
          { x: 83.3, y: 79.1 },
          { x: 93.1, y: 20.4 },
          { x: 62.6, y: 54.7 },
          { x: 79.2, y: 42.2 },
          { x: 91.5, y: 10.6 },
          { x: 68.3, y: 31.0 },
          { x: 55.5, y: 85.5 },
          { x: 75.4, y: 78.6 },
          { x: 66.1, y: 8.5 },
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
        audio: "../assets/audio/en/parasha-of-the-week-sfx4.mp3",
      },
      {
        title: "Why Do We Make a Bracha?",
        description: "Why do we make a bracha before we eat, do we need one even for a tiny crumb, and can't we just say Shehakol on everything? Everything you need to know about the bracha before eating.",
        image: "../assets/images/en/why-we-bless.jpeg",
        audio: "../assets/audio/en/why-we-bless-sfx3.mp3",
      },
      {
        title: "How Long May We Wait Between the Bracha and Eating?",
        description: "You made a bracha on an apple, and then a friend started talking to you - now what? When do we need to make the bracha again, and when is it okay to pause between the bracha and eating?",
        image: "../assets/images/en/bracha-to-eating-gap.jpeg",
        audio: "../assets/audio/en/bracha-to-eating-gap-sfx3.mp3",
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
      {
        title: "Healthy Teeth: Why Does It Matter So Much?",
        description: "Why is brushing so important? What do the germs in our mouths do, how do our teeth affect the health of our whole body, and which small habits keep a healthy smile for years?",
        image: "../assets/images/en/teeth-health.jpeg",
        audio: "../assets/audio/en/teeth-health-sfx3.mp3",
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

// "Play in a row" - built and approved first on the Diamond Island site, ported
// here per Avraham's request (2026-10-08): the chain must stay inside the
// category it started in, never spill into the next one. audioIdx/audioTotal
// are this episode's position/count among *this category's audio episodes
// only* (some episodes may be "coming soon" with no audio at all).
const CONTINUOUS_CHEVRON_SVG = `<svg class="continuous-dd__chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;

function continuousSelectHTML(ep, audioIdx, audioTotal) {
  const remaining = audioTotal - audioIdx; // audio episodes from here to the end of this category, including this one
  if (remaining <= 1) return ""; // last episode in the category - nothing to chain to
  const fixedOptions = [2, 3, 5].filter((n) => n < remaining);
  const choices = [{ value: "1", label: "This episode only" }]
    .concat(fixedOptions.map((n) => ({ value: String(n), label: `${n} episodes` })))
    .concat([{ value: "all", label: `All ${remaining} episodes from here` }]);
  const items = choices
    .map(
      (c, i) =>
        `<li class="continuous-dd__option${i === 0 ? " is-selected" : ""}" role="option" data-value="${c.value}" aria-selected="${i === 0}" tabindex="-1">${c.label}</li>`
    )
    .join("");
  return `
      <div class="player-continuous">
        <span class="player-continuous__text">Play in a row:</span>
        <div class="continuous-dd" data-value="1">
          <button type="button" class="continuous-dd__btn" aria-haspopup="listbox" aria-expanded="false">
            <span class="continuous-dd__value">This episode only</span>
            ${CONTINUOUS_CHEVRON_SVG}
          </button>
          <ul class="continuous-dd__list" role="listbox" aria-label="How many episodes to play in a row, starting from ${ep.title}" hidden>${items}</ul>
        </div>
      </div>`;
}

function playerHTML(ep, audioIdx, audioTotal) {
  if (ep.audio) {
    return `
      <div class="player-wrap">
        <div class="player" data-src="${ep.audio}">
          <button class="player__btn" type="button" aria-label="Play narration">▶</button>
          <div class="player__body">
            <input class="player__seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="Playback progress">
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

function audioCardHTML(cat, ep, idx, audioIdx, audioTotal) {
  const reverseClass = idx % 2 === 1 ? " content-card--reverse" : "";
  return `
  <article class="content-card${reverseClass}">
    ${mediaHTML(cat, ep, idx)}
    <div class="content-card__body">
      <span class="content-card__eyebrow">${cat.name}</span>
      <h3 class="content-card__title">${ep.title}</h3>
      <p class="content-card__desc"><strong>About this episode: </strong>${ep.description}</p>
      ${playerHTML(ep, audioIdx, audioTotal)}
      ${shareButtonHTML(cat, ep)}
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
  <article class="content-card content-card--full spot-card" data-cat-name="${cat.name}">
    <div class="content-card__body">
      <div class="content-card__head-row">
        <span class="content-card__eyebrow">${ep.parashaEn || cat.name}</span>
        ${badge}
      </div>
      <h3 class="content-card__title">${ep.title}</h3>
      <p class="content-card__desc">${ep.description}</p>
      <div class="spot-card__images">
        <div class="spot-card__item">
          <span class="spot-card__label">Image A</span>
          <div class="spot-card__frame">
          <img src="${ep.imageA}" alt="Image A for comparison">
          ${markers}
          </div>
        </div>
        <div class="spot-card__item">
          <span class="spot-card__label">Image B</span>
          <div class="spot-card__frame">
          <img src="${ep.imageB}" alt="Image B for comparison">
          ${markers}
          </div>
        </div>
      </div>
      <div class="spot-card__actions">
        <button class="btn btn--primary" type="button" data-spot-toggle>Show Solution (${ep.diffCount} differences)</button>
        ${ep.coloringPage ? `<a class="btn btn--outline spot-card__coloring" href="${ep.coloringPage}" download="Coloring page - ${ep.parashaEn || ep.title}.jpg">🖍️ Download a coloring page</a>` : ""}
      </div>
    </div>
  </article>`;
}

/* ---------------------------------------------------------------
   "שיתוף" on every recording card (Avraham, 2026-10-18): shares this one recording the way the weekly WhatsApp
   message does - the teaser, a listening link to its own page (s/<slug>/) and the group invitation. The text is
   the story page's own (s/index.json -> shareText, written by tools/build_story_pages.mjs from ברלה's files).
   Android: with the episode's picture as a file. iPhone: text only (WhatsApp there drops the text of a shared
   file, and the invitation would be lost). Computer: WhatsApp with the message ready.
--------------------------------------------------------------- */
const STORY_PAGE_BASE = "https://abrahamgersten.github.io/zeh-kara-beemet/en/s/";

function storySlug(audioPath) {
  const name = audioPath.split("/").pop();
  return name.includes("-sfx") ? name.slice(0, name.lastIndexOf("-sfx")) : name.replace(/\.[^.]+$/, "");
}

function shareButtonHTML(cat, ep) {
  if (!ep.audio) return "";
  const label = cat.id === "tzadikim" ? "Share the story" : "Share this recording";
  return `
      <div class="content-card__share">
        <button class="btn btn--outline content-card__share-btn" type="button" data-share-slug="${storySlug(ep.audio)}" data-share-kind="${cat.id === "tzadikim" ? "story" : "recording"}" aria-label="Share on WhatsApp: ${ep.title}">📤 ${label}</button>
      </div>`;
}

function setupStoryShare() {
  const host = document.getElementById("category-sections");
  if (!host) return;
  let texts = null;
  let statuses = {}; // stories that can also be shared to WhatsApp status (tools/status_shares.json, js/share-sheet.js)
  // Where people share to status from (Avraham, 2026-10-28: the app, the story pages or the bot - bots.html): the app's
  // share sheet is counted like the story pages (log_story_event, js/story.js) under the campaign "app" - "popup" = the
  // invitation after an episode offered the status, "status" = they pressed "share to status". Its status text links
  // with c=app-status, so arrivals from statuses shared in the app are counted apart from the story pages' site-status.
  const STATUS_COUNTER = "https://nuadpewhrhpdgznbbqbs.supabase.co/rest/v1/rpc/log_story_event";
  const STATUS_KEY = "sb_publishable_AcpmlZnxKM4yJxr1OsoSjw_CG6Kt2pz";
  const STATUS_LANG = document.documentElement.lang === "en" ? "en" : "he";
  const appStatus = (slug) => (statuses[slug] ? { ...statuses[slug], text: statuses[slug].text.replace(/([?&]c=)site-status/g, "$1app-status") } : null);
  function statusVisitor() {
    try {
      let v = localStorage.getItem("zkb_story_visitor"); // the same browser number as the story pages (js/story.js)
      if (!v) {
        v = typeof crypto.randomUUID === "function" ? crypto.randomUUID()
          : Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
        localStorage.setItem("zkb_story_visitor", v);
      }
      return v;
    } catch (e) {
      return null;
    }
  }
  function trackStatus(slug, event) {
    // only on the live site, and not Avraham's tests (&t=1, migration 0019)
    if (location.hostname !== "abrahamgersten.github.io" || new URLSearchParams(location.search).get("t") === "1") return;
    try {
      fetch(STATUS_COUNTER, {
        method: "POST",
        keepalive: true,
        headers: { apikey: STATUS_KEY, Authorization: "Bearer " + STATUS_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ p_slug: slug, p_lang: STATUS_LANG, p_event: event, p_visitor: statusVisitor(), p_campaign: "app" }),
      }).catch(() => {});
    } catch (e) {
      // never affects the app
    }
  }
  fetch("s/index.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      const stories = (j && j.stories) || [];
      texts = j ? Object.fromEntries(stories.map((s) => [s.slug, s.shareText])) : null;
      statuses = Object.fromEntries(stories.filter((s) => s.status).map((s) => [s.slug, s.status]));
    })
    .catch(() => {});
  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  function pictureFile(card, slug) {
    const img = card && card.querySelector(".content-card__main-img");
    if (!img || isApple || typeof navigator.canShare !== "function" || typeof File !== "function") return Promise.resolve(null);
    const load = fetch(img.currentSrc || img.src)
      .then((r) => (r.ok ? r.blob() : null))
      .then((blob) => {
        if (!blob) return null;
        const type = blob.type || "image/jpeg";
        const file = new File([blob], slug + (type === "image/png" ? ".png" : ".jpg"), { type });
        return navigator.canShare({ files: [file] }) ? file : null;
      })
      .catch(() => null);
    // the picture is already on screen (and cached); if it is slow, share the text without it
    return Promise.race([load, new Promise((res) => setTimeout(() => res(null), 1500))]);
  }

  // with a status picture: ask first - as a message (below) or to status (js/share-sheet.js)
  host.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-share-slug]");
    if (!btn) return;
    const slug = btn.dataset.shareSlug;
    const card = btn.closest(".content-card");
    if (statuses[slug] && window.ZkbShareSheet) {
      const titleEl = card && card.querySelector(".content-card__title");
      window.ZkbShareSheet.choose({ title: titleEl ? titleEl.textContent : "", slug, status: appStatus(slug), track: (ev) => trackStatus(slug, ev), onMessage: () => shareAsMessage(card, slug) });
      return;
    }
    shareAsMessage(card, slug);
  });

  // the popup at the end of an episode (called by the player): the same two choices, after EVERY playback - Avraham,
  // 2026-10-21: "I want it to pop up after every listen" (no once-per-load, no skipping what was already shared)
  window.zkbInviteShare = (playerEl) => {
    const card = playerEl && playerEl.closest(".content-card");
    const btn = card && card.querySelector("[data-share-slug]");
    if (!btn || !window.ZkbShareSheet) return;
    const slug = btn.dataset.shareSlug;
    const titleEl = card.querySelector(".content-card__title");
    if (statuses[slug]) trackStatus(slug, "popup");
    window.ZkbShareSheet.invite({ title: titleEl ? titleEl.textContent : "", slug, status: appStatus(slug), track: (ev) => trackStatus(slug, ev),
      isStory: btn.dataset.shareKind !== "recording", onMessage: () => shareAsMessage(card, slug) });
  };

  async function shareAsMessage(card, slug) {
    const title = card && card.querySelector(".content-card__title") ? card.querySelector(".content-card__title").textContent : "";
    const text = (texts && texts[slug]) || `${title} - It Really Happened\n${STORY_PAGE_BASE}${slug}/`;
    const whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(text);
    if (typeof navigator.share !== "function") {
      window.open(whatsappUrl, "_blank", "noopener");
      return;
    }
    const file = await pictureFile(card, slug);
    for (const data of file ? [{ files: [file], text }, { text }] : [{ text }]) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return; // closed the share menu
      }
    }
    location.href = whatsappUrl;
  }
}

/* ---------------------------------------------------------------
   "חדש מאז הביקור האחרון" (Avraham, 2026-10-23): a small tag on a recording this browser has not seen before - for a
   week, or until it is played (js/progress.js, ZkbNew). The first visit tags nothing.
--------------------------------------------------------------- */
function setupNewTags() {
  if (!window.ZkbNew) return;
  const lang = document.documentElement.lang === "en" ? "en" : "he";
  const buttons = Array.from(document.querySelectorAll("[data-share-slug]"));
  const fresh = window.ZkbNew.check(lang, buttons.map((b) => b.dataset.shareSlug));
  buttons.forEach((b) => {
    if (!fresh.has(b.dataset.shareSlug)) return;
    const media = b.closest(".content-card")?.querySelector(".content-card__media");
    if (media && !media.querySelector(".content-card__new")) {
      media.insertAdjacentHTML("beforeend", '<span class="content-card__new">New</span>');
    }
  });
}

/* #ep-<slug> (the link of a "new story" notification): open that episode's card and bring it into view */
function setupEpisodeLink() {
  const go = () => {
    const m = /^#ep-([a-z0-9-]+)$/.exec(location.hash);
    if (!m) return;
    const btn = document.querySelector(`[data-share-slug="${m[1]}"]`);
    const card = btn && btn.closest(".content-card");
    if (!card) return;
    card.hidden = false;
    card.removeAttribute("data-overflow-card");
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.classList.add("content-card--flash");
    setTimeout(() => card.classList.remove("content-card--flash"), 2600);
    // pictures above it that finish loading push it down: put it back in view once they have
    setTimeout(() => {
      const r = card.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) card.scrollIntoView({ block: "center" });
    }, 1600);
  };
  setTimeout(go, 300);
  window.addEventListener("hashchange", go);
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
    // Only episodes with real audio count for "play in a row" - a "coming soon" episode can't be chained to.
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
      : `Show Solution (${card.querySelectorAll(".spot-card__item:first-child .spot-card__marker").length} differences)`;
    if (solved) {
      // the eyebrow shows the parasha (2026-10-21); the usage log keeps the category's own name
      const catEl = card.querySelector(".content-card__eyebrow");
      const titleEl = card.querySelector(".content-card__title");
      window.zkbLogEvent && window.zkbLogEvent("spot_diff_solved", card.dataset.catName || (catEl ? catEl.textContent : null), titleEl ? titleEl.textContent : null);
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
// Custom "play in a row" dropdown - identical to the version approved and
// tested on Diamond Island (including two fixes Avraham asked for there): a
// native <select>'s open option list is OS chrome that can't be restyled, so
// this is a button + floating listbox built from scratch; and every card
// (.content-card) is overflow:hidden (to clip its image to the rounded
// corners), which was silently clipping a list that opened near the card's
// bottom edge - so every list is moved to <body> and positioned from the
// trigger button's own on-screen position (fixed).
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
  // "Play in a row" stays inside the section it started in (Avraham, 2026-10-08) - each episode knows its section's
  // list. Since 2026-10-15 (Avraham: "it plays 2 or 3 in a row and then stops, even if I asked for more" - on this
  // site and on "אי היהלומים"):
  // 1. Only the page's own pause button cancels the chain. Before, any pause cancelled it - a WhatsApp notification
  //    sound, a phone call or the lock screen pauses the media for a moment, the episode carries on, and at its end
  //    the chain was already gone (reproduced: one such pause stopped a 4-episode chain after the first).
  // 2. One media element plays every episode (like a podcast app). With a separate element per episode, a phone
  //    with the screen locked may refuse to start the next one without a tap; switching the file on the element
  //    that is already playing is allowed.
  const audio = new Audio();
  audio.preload = "none";
  let active = null; // the episode whose file is loaded in the shared element
  let pendingSeek = 0; // where to start an episode that was resumed or scrubbed before its file loaded
  let continuousPlan = null; // { remaining } while a chain is in progress

  const sectionLists = new Map();
  const episodes = players.map((el) => {
    const section = el.closest(".category-section");
    if (!sectionLists.has(section)) sectionLists.set(section, []);
    const list = sectionLists.get(section);
    const ep = {
      el,
      list,
      pos: 0,
      posInList: list.length,
      src: el.dataset.src,
      btn: el.querySelector(".player__btn"),
      seek: el.querySelector(".player__seek"),
      current: el.querySelector(".player__current"),
      duration: el.querySelector(".player__duration"),
      dd: el.closest(".player-wrap")?.querySelector(".continuous-dd"),
      playLabel: el.querySelector(".player__btn").getAttribute("aria-label"),
      seeking: false,
      loggedPlay: false,
      slug: storySlug(el.dataset.src),
      session: null, // this playback, for the drop-off chart (js/progress.js)
      savedAt: -1,
    };
    list.push(ep);
    return ep;
  });

  // "continue where you stopped" (Avraham, 2026-10-23): the bar and the time show the saved place, and play starts there
  const lang = document.documentElement.lang === "en" ? "en" : "he";
  if (window.ZkbResume) {
    episodes.forEach((ep) => {
      const saved = window.ZkbResume.get(lang, ep.slug);
      if (!saved) return;
      ep.pos = saved.t;
      ep.seek.max = saved.d;
      ep.seek.value = saved.t;
      ep.current.textContent = formatTime(saved.t);
      ep.duration.textContent = formatTime(saved.d);
      ep.el.classList.add("player--resume");
      showPlaying(ep, false);
    });
  }
  function savePlace(ep, force) {
    if (!window.ZkbResume || !ep || !(audio.duration > 0)) return;
    if (!force && Math.abs(audio.currentTime - ep.savedAt) < 5) return;
    ep.savedAt = audio.currentTime;
    window.ZkbResume.set(lang, ep.slug, audio.currentTime, audio.duration);
  }
  function closeSession(ep) {
    if (ep && ep.session) {
      ep.session.flush();
      ep.session = null;
    }
  }
  // leaving the page (or locking it away): keep the place, send the last listening point
  const leave = () => {
    if (!active) return;
    savePlace(active, true);
    if (active.session) active.session.flush();
  };
  window.addEventListener("pagehide", leave);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") leave();
  });

  function showPlaying(ep, playing) {
    ep.btn.textContent = playing ? "⏸" : "▶";
    ep.btn.classList.toggle("is-playing", playing);
    ep.btn.setAttribute("aria-label", playing ? "Pause" : ep.pos > 0 ? "Resume narration" : ep.playLabel);
  }

  function load(ep) {
    if (active === ep) return;
    if (active) {
      active.pos = audio.currentTime || active.pos;
      showPlaying(active, false);
      savePlace(active, true);
      closeSession(active);
    }
    active = ep;
    pendingSeek = ep.pos;
    audio.src = ep.src;
  }

  function start(ep) {
    load(ep);
    audio.play().catch(() => showPlaying(ep, false));
  }

  function setMediaSession(ep) {
    if (!("mediaSession" in navigator) || typeof MediaMetadata !== "function") return;
    const card = ep.el.closest(".content-card");
    const img = card?.querySelector(".content-card__main-img");
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: card?.querySelector(".content-card__title")?.textContent || document.title,
        artist: card?.querySelector(".content-card__eyebrow")?.textContent || "It Really Happened",
        artwork: img ? [{ src: img.currentSrc || img.src }] : [],
      });
    } catch (e) {
      // lock-screen details are a nicety only
    }
  }

  audio.addEventListener("loadedmetadata", () => {
    if (!active) return;
    active.seek.max = audio.duration || 0;
    active.duration.textContent = formatTime(audio.duration);
    if (pendingSeek > 0 && pendingSeek < audio.duration) audio.currentTime = pendingSeek;
    pendingSeek = 0;
  });
  audio.addEventListener("timeupdate", () => {
    if (!active || active.seeking) return;
    active.seek.value = audio.currentTime;
    active.current.textContent = formatTime(audio.currentTime);
    savePlace(active, false);
    if (active.session) active.session.time(audio.currentTime, audio.duration);
  });
  audio.addEventListener("play", () => {
    if (!active) return;
    showPlaying(active, true);
    setMediaSession(active);
    if (!active.session && window.ZkbListen) active.session = window.ZkbListen.session(active.slug, lang, "site");
    if (window.ZkbNew) window.ZkbNew.seen(lang, active.slug);
    const newTag = active.el.closest(".content-card")?.querySelector(".content-card__new");
    if (newTag) newTag.remove();
    // usage tracking (non-blocking, see js/analytics.js) - only on the first play of an episode in a page load
    if (!active.loggedPlay) {
      active.loggedPlay = true;
      const card = active.el.closest(".content-card");
      const catEl = card && card.querySelector(".content-card__eyebrow");
      const titleEl = card && card.querySelector(".content-card__title");
      window.zkbLogEvent && window.zkbLogEvent("audio_play", catEl ? catEl.textContent : null, titleEl ? titleEl.textContent : null);
    }
  });
  audio.addEventListener("pause", () => {
    // no plan change here: this also fires for pauses the user did not make (notifications, calls, lock screen)
    if (active && !audio.ended) {
      active.pos = audio.currentTime;
      showPlaying(active, false);
      savePlace(active, true);
      if (active.session) active.session.flush();
    }
  });
  audio.addEventListener("ended", () => {
    if (!active) return;
    const ep = active;
    ep.pos = 0;
    ep.savedAt = -1;
    ep.el.classList.remove("player--resume");
    if (ep.session) {
      ep.session.end();
      ep.session = null;
    }
    if (window.ZkbResume) window.ZkbResume.clear(lang, ep.slug);
    showPlaying(ep, false);
    ep.seek.value = 0;
    ep.current.textContent = "0:00";
    continueChainFrom(ep);
    // at the end of every episode: "enjoyed it? share it" - as a message or to status (Avraham, 2026-10-21);
    // a continuing chain keeps playing underneath
    if (window.zkbInviteShare) window.zkbInviteShare(ep.el);
  });

  episodes.forEach((ep) => {
    ep.btn.addEventListener("click", () => {
      if (active === ep && !audio.paused) {
        continuousPlan = null; // the user's own pause: the chain stops here
        audio.pause();
        return;
      }
      const choice = ep.dd ? ep.dd.dataset.value : "1";
      continuousPlan = choice === "1" ? null : { remaining: choice === "all" ? Infinity : Number(choice) - 1 };
      start(ep);
    });

    ep.seek.addEventListener("input", () => {
      ep.seeking = true;
      ep.current.textContent = formatTime(Number(ep.seek.value));
    });
    ep.seek.addEventListener("change", () => {
      const t = Number(ep.seek.value);
      if (active === ep && audio.readyState > 0) audio.currentTime = t;
      else if (active === ep) pendingSeek = t;
      else ep.pos = t;
      ep.seeking = false;
    });
  });

  function continueChainFrom(ep) {
    if (!continuousPlan || continuousPlan.remaining <= 0) { continuousPlan = null; return; }
    const next = ep.list[ep.posInList + 1];
    if (!next) { continuousPlan = null; return; }
    continuousPlan.remaining -= 1;
    // if the next episode is still under "show more", reveal it - otherwise the audio plays with no card on screen
    const hiddenCard = next.el.closest(".content-card[hidden]");
    if (hiddenCard) { hiddenCard.hidden = false; hiddenCard.removeAttribute("data-overflow-card"); }
    next.pos = 0;
    start(next);
    (next.el.closest(".content-card") || next.el).scrollIntoView({ behavior: "smooth", block: "center" });
  }
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
   Real sticky offset at the top of the page (--banner-h, --header-h).
   .install-banner and .site-header are both position:sticky/top:0; when the
   banner is shown, both would stack at the same top:0 and cover each other,
   since neither "knows" how much room the other takes. --banner-h (0 when
   the banner is hidden) is the top offset the header actually gets (in CSS:
   .site-header{top:var(--banner-h)}) so it sits below the banner instead of
   on top of it; --header-h is the sum of both - the total space occupied at
   the top, which anchor links (landing on a category, "About"/"All
   categories") account for (CSS: scroll-margin-top: calc(var(--header-h) +
   10px)). The header's own height also changes (one line on desktop vs. two
   once the nav wraps on narrow screens) - ResizeObserver on both elements
   keeps this updated automatically (including the banner appearing/
   disappearing - see also the MutationObserver on [hidden] as a fallback,
   for cross-browser safety).
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
   Post-font-load re-snap (added 2026-09-28) - the real remaining cause of
   "clicking a category lands a bit above the target", still happening after
   the sticky-header fixes: the fonts (Suez One/Heebo, loaded with
   display=swap) swap from the fallback font to the real one *after* the
   page is already built - measured this in practice as ~250px of total page
   height change (many headings set in Suez One, each a little taller/
   shorter than the fallback). If the user clicks a category link *before*
   that swap finishes (likely on a first visit / slow connection - on a
   repeat visit the fonts are already cached and this never happens at all),
   the browser computes the scroll target using the shorter fallback layout;
   the moment the font actually swaps, everything above the target "grows"
   and the target moves down without the scroll position following it -
   exactly "lands on the category above". Fix: once the fonts have actually
   settled (document.fonts.ready), if the URL still has a #hash pointing at
   an existing element, re-align to it (scrollIntoView honors scroll-margin-
   top just like normal anchor navigation). Also on window load (after every
   image) as a second, cheap, general-purpose safety net.
--------------------------------------------------------------- */
function setupHashCorrection() {
  const resnap = () => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) el.scrollIntoView({ block: "start" });
  };
  // 2026-09-28, round two: a single document.fonts.ready-based correction wasn't
  // enough in practice (confirmed: Android Chrome, "only on the first click after
  // a refresh") - fonts can settle *before* the user even clicks a category, at
  // which point the one-shot promise already fired as a no-op (empty hash) and
  // nothing is left to correct the click that comes after. More robust fix: every
  // click on an anchor link (or a direct hashchange) schedules several staggered
  // follow-up corrections, so no matter exactly when the font/image/anything-else
  // that shifts content settles relative to the click, one of them will catch the
  // final state.
  let timers = [];
  const scheduleCorrections = () => {
    timers.forEach(clearTimeout);
    timers = [100, 400, 900, 1600].map((ms) => setTimeout(resnap, ms));
  };
  document.addEventListener("click", (e) => {
    if (e.target.closest('a[href^="#"]')) scheduleCorrections();
  });
  window.addEventListener("hashchange", scheduleCorrections);
  if (location.hash) scheduleCorrections(); // a direct link with a #hash already in the URL (not via a click)
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
  setupNewTags();
  setupEpisodeLink();
  setupStoryShare();
  setupCatNavTracking();
  setupSparkles();
  setupMoon();
  setupScrollReveal();
  setupInstallBanner();
  setupHeaderOffsetTracking();
  setupHashCorrection();
  setupServiceWorker();
});
