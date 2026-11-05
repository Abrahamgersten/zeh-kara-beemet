"use strict";

/* ---------------------------------------------------------------
   "בדוק את עצמך" (אברהם, 2026-11-04): לכל פרק בנישה הלכתית (כרגע ברכות, ב"יש לי מושג") שאלה אחת שהתשובה
   עליה בפרק, ארבע תשובות ואחת מהן מצחיקה מאוד. בלחיצה על הכפתור מושמעת השאלה בקולו של אברהם, עם המוזיקה
   "להציע את המנוי" (רוני המתכנת/Tools/brachot_quiz/build_quiz_audio.py), ובסוף האזנה לפרק היא קופצת במקום
   חלון השיתוף. אחרי תשובה נכונה אפשר לשתף את ההקלטה מתוך החלון.

   window.ZkbQuiz.open(o)  o = { title, quiz: [{ question, options[4], answer, funny, explain, audio }, ...], autoplay, onShare() }
   עד שלוש שאלות לפרק (2026-11-05): "שאלה 1 מתוך 3", ואחרי תשובה נכונה "לשאלה הבאה"; בסוף, השיתוף.
   autoplay: השאלה מושמעת מיד (לחיצה על הכפתור). בסוף פרק לא, כי "נגן ברצף" אולי כבר מנגן את הפרק הבא.
--------------------------------------------------------------- */
(function () {
  const LETTERS = ["א", "ב", "ג", "ד"];
  let root = null;
  let card = null;
  let lastFocus = null;
  let sound = null;
  let current = null;
  let clap = null;
  // a right answer (Avraham, 2026-11-05): applause, and confetti falling from the top of the page. The applause is 3.2 s of a
  // public-domain recording, about 7 LU under the narration; with reduced motion only the applause.
  const CLAP = "assets/audio/quiz/applause.mp3";
  const COLORS = ["#ffb347", "#ffd28f", "#0a7681", "#22bcc7", "#f2716b", "#7bc96f", "#b388eb", "#ffffff"];

  function confetti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof Element.prototype.animate !== "function") return;
    const layer = document.createElement("div");
    layer.className = "confetti";
    layer.setAttribute("aria-hidden", "true");
    const fall = window.innerHeight + 60;
    const count = window.innerWidth < 600 ? 70 : 120;
    let longest = 0;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      const w = 6 + Math.random() * 6;
      const round = Math.random() < 0.3;
      const h = round ? w : w * (1.5 + Math.random());
      p.style.left = `${Math.random() * 100}%`;
      p.style.width = `${w}px`;
      p.style.height = `${h}px`;
      p.style.background = COLORS[i % COLORS.length];
      if (round) p.style.borderRadius = "50%";
      layer.appendChild(p);
      const drift = (Math.random() - 0.5) * 180;
      const spin = (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 720);
      const flip = 360 + Math.random() * 720; // the paper turning over as it falls
      const duration = 1600 + Math.random() * 1200;
      const delay = Math.random() * 400;
      longest = Math.max(longest, duration + delay);
      p.animate([
        { transform: "translate3d(0, 0, 0) rotate(0deg) rotateX(0deg)", opacity: 1 },
        { transform: `translate3d(${drift * 0.6}px, ${fall * 0.6}px, 0) rotate(${spin * 0.6}deg) rotateX(${flip * 0.6}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate3d(${drift}px, ${fall}px, 0) rotate(${spin}deg) rotateX(${flip}deg)`, opacity: 0 },
      ], { duration, delay, easing: "linear", fill: "both" }); // a steady fall: constant motion is linear
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), longest + 120);
  }

  function celebrate() {
    try {
      clap = clap || new Audio(CLAP);
      clap.currentTime = 0;
      clap.play().catch(() => {});
    } catch (e) {
      // no sound, still the confetti
    }
    confetti();
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function ensure() {
    if (root) return;
    root = document.createElement("div");
    root.className = "lightbox share-sheet quiz-sheet";
    root.hidden = true;
    root.innerHTML = `<div class="share-sheet__card quiz-sheet__card" role="dialog" aria-modal="true" aria-labelledby="quiz-title"></div>`;
    card = root.firstElementChild;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => {
      if (e.target === root) close();
      const act = e.target.closest("[data-act]");
      if (act) handle(act);
    });
    document.addEventListener("keydown", (e) => {
      if (root.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "Tab") trapFocus(e);
    });
  }

  function trapFocus(e) {
    const items = card.querySelectorAll("button:not([disabled])");
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function stopSound() {
    if (sound) {
      sound.pause();
      sound = null;
    }
    const b = card && card.querySelector("[data-act='listen']");
    if (b) b.textContent = "🔊 השמעת השאלה";
  }

  function question() {
    return current && current.list[current.at];
  }

  function playSound() {
    const q = question();
    if (!q || !q.audio) return;
    if (window.zkbPauseMain) window.zkbPauseMain(); // the episode stops while the question is read
    stopSound();
    sound = new Audio(q.audio);
    const b = card.querySelector("[data-act='listen']");
    if (b) b.textContent = "⏸ עצירת השמעה";
    sound.addEventListener("ended", stopSound);
    sound.play().catch(stopSound);
  }

  function open(o) {
    ensure();
    lastFocus = document.activeElement;
    current = { o, list: [].concat(o.quiz), at: 0, done: false };
    render(o.autoplay);
    root.hidden = false;
    document.body.style.overflow = "hidden";
    if (!clap) {
      clap = new Audio(CLAP); // ready before the answer, so the applause starts on the tap
      clap.preload = "auto";
    }
  }

  function render(autoplay) {
    const o = current.o;
    const q = question();
    const total = current.list.length;
    const last = current.at === total - 1;
    card.innerHTML = `
      <button class="share-sheet__close" type="button" data-act="close" aria-label="סגירה">✕</button>
      <p class="quiz-sheet__eyebrow">📖 בדוק את עצמך${total > 1 ? `<span class="quiz-sheet__step"> · שאלה ${current.at + 1} מתוך ${total}</span>` : ""}</p>
      <h2 class="share-sheet__title quiz-sheet__question" id="quiz-title">${esc(q.question)}</h2>
      ${q.audio ? `<button class="share-sheet__link quiz-sheet__listen" type="button" data-act="listen">🔊 השמעת השאלה</button>` : ""}
      <div class="quiz-sheet__options" role="group" aria-label="התשובות">
        ${q.options.map((t, i) => `<button class="quiz-sheet__option" type="button" data-act="answer" data-i="${i}"><span class="quiz-sheet__letter" aria-hidden="true">${LETTERS[i]}</span><span>${esc(t)}</span></button>`).join("")}
      </div>
      <p class="quiz-sheet__note" role="status" aria-live="polite"></p>
      <div class="share-sheet__actions quiz-sheet__after" hidden>
        ${last ? (o.onShare ? `<button class="btn btn--primary share-sheet__primary" type="button" data-act="share">📤 שיתוף ההקלטה</button>` : "")
               : `<button class="btn btn--primary share-sheet__primary" type="button" data-act="next">לשאלה הבאה ←</button>`}
        <button class="share-sheet__link" type="button" data-act="close">סגירה</button>
      </div>`;
    current.done = false;
    card.querySelector("[data-act='answer']").focus();
    if (autoplay) playSound();
  }

  function close() {
    if (!root || root.hidden) return;
    stopSound();
    root.hidden = true;
    document.body.style.overflow = "";
    current = null;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function answer(btn) {
    if (!current || current.done) return;
    const q = question();
    const i = Number(btn.dataset.i);
    const note = card.querySelector(".quiz-sheet__note");
    if (i === q.answer) {
      current.done = true;
      stopSound();
      btn.classList.add("is-right");
      card.querySelectorAll("[data-act='answer']").forEach((b) => { b.disabled = b !== btn; });
      note.textContent = `כל הכבוד! 🎉 ${q.explain || ""}`.trim();
      celebrate();
      const after = card.querySelector(".quiz-sheet__after");
      after.hidden = false;
      const first = after.querySelector("button");
      if (first) first.focus();
      return;
    }
    btn.classList.add("is-wrong");
    btn.disabled = true;
    note.textContent = i === q.funny ? "😂 תשובה מצחיקה, אבל לא נכונה. נסו שוב!" : "לא בדיוק. נסו שוב! 💪";
    const next = card.querySelector("[data-act='answer']:not([disabled])");
    if (next) next.focus();
  }

  function handle(el) {
    const act = el.dataset.act;
    if (act === "close") close();
    else if (act === "answer") answer(el);
    else if (act === "listen") (sound ? stopSound() : playSound());
    else if (act === "next" && current) {
      stopSound();
      current.at += 1;
      render(true); // the tap on "next" is the go-ahead to read the next question
    }
    else if (act === "share" && current) {
      const fn = current.o.onShare;
      close();
      if (typeof fn === "function") fn();
    }
  }

  window.ZkbQuiz = { open, close };
})();
