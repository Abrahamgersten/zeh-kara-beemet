"use strict";

/* ---------------------------------------------------------------
   "בדוק את עצמך" (אברהם, 2026-11-04): לכל פרק בנישה הלכתית (כרגע ברכות, ב"יש לי מושג") שאלה אחת שהתשובה
   עליה בפרק, ארבע תשובות ואחת מהן מצחיקה מאוד. בלחיצה על הכפתור מושמעת השאלה בקולו של אברהם, עם המוזיקה
   "להציע את המנוי" (רוני המתכנת/Tools/brachot_quiz/build_quiz_audio.py), ובסוף האזנה לפרק היא קופצת במקום
   חלון השיתוף. אחרי תשובה נכונה אפשר לשתף את ההקלטה מתוך החלון.

   window.ZkbQuiz.open(o)  o = { title, quiz: { question, options[4], answer, funny, explain, audio }, autoplay, onShare() }
   autoplay: השאלה מושמעת מיד (לחיצה על הכפתור). בסוף פרק לא, כי "נגן ברצף" אולי כבר מנגן את הפרק הבא.
--------------------------------------------------------------- */
(function () {
  const LETTERS = ["א", "ב", "ג", "ד"];
  let root = null;
  let card = null;
  let lastFocus = null;
  let sound = null;
  let current = null;

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

  function playSound() {
    const q = current && current.o.quiz;
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
    current = { o, tried: new Set(), done: false };
    const q = o.quiz;
    card.innerHTML = `
      <button class="share-sheet__close" type="button" data-act="close" aria-label="סגירה">✕</button>
      <p class="quiz-sheet__eyebrow">🧠 בדוק את עצמך</p>
      <h2 class="share-sheet__title quiz-sheet__question" id="quiz-title">${esc(q.question)}</h2>
      ${q.audio ? `<button class="share-sheet__link quiz-sheet__listen" type="button" data-act="listen">🔊 השמעת השאלה</button>` : ""}
      <div class="quiz-sheet__options" role="group" aria-label="התשובות">
        ${q.options.map((t, i) => `<button class="quiz-sheet__option" type="button" data-act="answer" data-i="${i}"><span class="quiz-sheet__letter" aria-hidden="true">${LETTERS[i]}</span><span>${esc(t)}</span></button>`).join("")}
      </div>
      <p class="quiz-sheet__note" role="status" aria-live="polite"></p>
      <div class="share-sheet__actions quiz-sheet__after" hidden>
        ${o.onShare ? `<button class="btn btn--primary share-sheet__primary" type="button" data-act="share">📤 שיתוף ההקלטה</button>` : ""}
        <button class="share-sheet__link" type="button" data-act="close">סגירה</button>
      </div>`;
    root.hidden = false;
    document.body.style.overflow = "hidden";
    card.querySelector("[data-act='answer']").focus();
    if (o.autoplay) playSound();
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
    const q = current.o.quiz;
    const i = Number(btn.dataset.i);
    const note = card.querySelector(".quiz-sheet__note");
    if (i === q.answer) {
      current.done = true;
      stopSound();
      btn.classList.add("is-right");
      card.querySelectorAll("[data-act='answer']").forEach((b) => { b.disabled = b !== btn; });
      note.textContent = `כל הכבוד! 🎉 ${q.explain || ""}`.trim();
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
    else if (act === "share" && current) {
      const fn = current.o.onShare;
      close();
      if (typeof fn === "function") fn();
    }
  }

  window.ZkbQuiz = { open, close };
})();
