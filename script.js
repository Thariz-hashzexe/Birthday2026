/* ============================================================
   CONFIG — edit everything birthday-related here
   ============================================================ */
const CONFIG = {
  // The big date. Month is 0-indexed (0 = Jan). Year controls the countdown target.
  birthday: { month: 7, day: 17, year: 2026 },

  // Photos for the memory gallery. Replace `src` with real files in assets/images/,
  // e.g. "assets/images/photo1.jpg". Leave src empty to show a soft placeholder card.
  photos: [
    { src: "assets/images/photo2021.jpg", caption: "2021" },
    { src: "assets/images/photo2022.jpg", caption: "2022" },
    { src: "assets/images/photo2023.jpg", caption: "2023" },
    { src: "assets/images/photo2024.jpg", caption: "2024" },
    { src: "assets/images/photo2025.jpg", caption: "2025" },
    { src: "assets/images/photo2026.jpg", caption: "2026" },
  ],

  // "How well do you know me" quiz. Edit freely — answers[correct] is the 0-based index.
  quiz: [
    {
      q: "Where would you most likely find me on a lazy Sunday?",
      options: ["Still in bed", "Out exploring somewhere new", "Cooking something ambitious", "Deep in a book"],
      correct: 1,
      feedback: "Close enough — you know me.",
    },
    {
      q: "What's my go-to comfort food?",
      options: ["Pizza", "Noodles", "Something sweet", "Whatever's left in the fridge"],
      correct: 2,
      feedback: "You've clearly paid attention.",
    },
    {
      q: "Pick the gift that would actually surprise me.",
      options: ["A handwritten letter", "Concert tickets", "A weekend trip", "You showing up unannounced"],
      correct: 3,
      feedback: "That would genuinely get me.",
    },
    {
      q: "What year did we first meet?",
      options: ["Doesn't matter — it feels like always", "A while back", "Recently", "No idea, honestly"],
      correct: 0,
      feedback: "Sentimental answer, correct answer.",
    },
    {
      q: "If I could teleport anywhere right now, I'd go...",
      options: ["Somewhere with mountains", "Somewhere with an ocean", "Home, honestly", "Somewhere I've never been"],
      correct: 3,
      feedback: "Always chasing somewhere new.",
    },
  ],

  // Secret Easter-egg message.
  secretMessage:
    "Since you went looking — thank you. For being someone who pays attention, who shows up, and who makes ordinary days feel worth celebrating. This one's just for you.",

  // Music player — drop a real file at assets/music/birthday-song.mp3 and edit the title below.
  song: { title: "Add your song — see assets/music" },
};

/* ============================================================
   UTIL
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ============================================================
   OPENING SEQUENCE
   ============================================================ */
function runOpeningSequence() {
  const lines = $$(".reveal-line");
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("show"), 500 + i * 650);
  });
}

function enterExperience() {
  document.body.classList.remove("pre-enter");
  document.body.classList.add("entered");
  const player = $("#player");
  if (player) player.hidden = false;
  requestAnimationFrame(() => {
    $("#countdown")?.scrollIntoView({ behavior: "smooth" });
  });
  initScrollReveal();
  updateRail();
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function initCountdown() {
  const target = new Date(CONFIG.birthday.year, CONFIG.birthday.month, CONFIG.birthday.day, 0, 0, 0).getTime();

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      $("#countdownGrid").style.display = "none";
      $("#itsMyDay").hidden = false;
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    $("#cd-days").textContent = String(d).padStart(2, "0");
    $("#cd-hours").textContent = String(h).padStart(2, "0");
    $("#cd-mins").textContent = String(m).padStart(2, "0");
    $("#cd-secs").textContent = String(s).padStart(2, "0");

    requestAnimationFrame(() => setTimeout(tick, 1000));
  }
  tick();
}

/* ============================================================
   CAKE
   ============================================================ */
function initCake() {
  const cake = $("#cakeEl");
  const lightBtn = $("#lightBtn");
  const blowBtn = $("#blowBtn");
  const wishText = $("#wishText");

  on(lightBtn, "click", () => {
    cake.classList.add("lit");
    cake.classList.remove("blown");
    blowBtn.disabled = false;
    lightBtn.disabled = true;
    wishText.hidden = true;
    wishText.classList.remove("show");
  });

  on(blowBtn, "click", () => {
    cake.classList.add("blown");
    cake.classList.remove("lit");
    blowBtn.disabled = true;
    lightBtn.disabled = false;
    wishText.hidden = false;
    requestAnimationFrame(() => wishText.classList.add("show"));
    fireConfetti();
  });

  on(cake, "click", () => {
    if (!cake.classList.contains("lit")) lightBtn.click();
  });
}

/* Confetti canvas, self-contained */
let confettiCtx, confettiCanvas, confettiParticles = [], confettiRAF;
function fireConfetti() {
  confettiCanvas = $("#confetti");
  if (!confettiCanvas) return;
  const rect = confettiCanvas.parentElement.getBoundingClientRect();
  confettiCanvas.width = rect.width;
  confettiCanvas.height = rect.height;
  confettiCtx = confettiCanvas.getContext("2d");

  const colors = ["#8b5cf6", "#c084fc", "#ffb870", "#f5f3f9", "#e9a4c4"];
  confettiParticles = Array.from({ length: 90 }, () => ({
    x: rect.width / 2 + (Math.random() - 0.5) * 60,
    y: rect.height * 0.35,
    vx: (Math.random() - 0.5) * 8,
    vy: -Math.random() * 9 - 3,
    size: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 12,
    life: 0,
  }));

  cancelAnimationFrame(confettiRAF);
  const gravity = 0.28;
  function frame() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;
    confettiParticles.forEach((p) => {
      p.vy += gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      if (p.y < confettiCanvas.height + 20) alive = true;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rot * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.globalAlpha = Math.max(0, 1 - p.life / 220);
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();
    });
    if (alive) confettiRAF = requestAnimationFrame(frame);
  }
  frame();
}

/* ============================================================
   GALLERY
   ============================================================ */
let galleryState = { index: 0 };
function initGallery() {
  const grid = $("#galleryGrid");
  grid.innerHTML = CONFIG.photos
    .map((p, i) => {
      const bg = p.src ? `style="background-image:url('${p.src}')"` : "";
      const fallback = p.src ? "" : `<div class="photo-fallback">${escapeHtml(p.caption || "Photo")}</div>`;
      return `<div class="photo-card" data-index="${i}" ${bg}>${fallback}<div class="photo-cap">${escapeHtml(p.caption || "")}</div></div>`;
    })
    .join("");

  $$(".photo-card", grid).forEach((card) => {
    on(card, "click", () => openModal(Number(card.dataset.index)));
  });

  on($("#modalClose"), "click", closeModal);
  on($("#modalBackdrop"), "click", closeModal);
  on($("#modalPrev"), "click", () => stepModal(-1));
  on($("#modalNext"), "click", () => stepModal(1));

  // swipe support
  let touchStartX = null;
  const frame = $("#modalFrame");
  on(frame, "touchstart", (e) => (touchStartX = e.touches[0].clientX), { passive: true });
  on(frame, "touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) stepModal(dx > 0 ? -1 : 1);
    touchStartX = null;
  });

  on(document, "keydown", (e) => {
    if (!$("#photoModal").classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") stepModal(-1);
    if (e.key === "ArrowRight") stepModal(1);
  });
}

function renderModal() {
  const p = CONFIG.photos[galleryState.index];
  const photoEl = $("#modalPhoto");
  photoEl.style.backgroundImage = p.src ? `url('${p.src}')` : "none";
  photoEl.textContent = p.src ? "" : p.caption || "Photo";
  photoEl.classList.toggle("no-photo", !p.src);
  $("#modalCaption").textContent = p.caption || "";
}
function openModal(i) {
  galleryState.index = i;
  renderModal();
  $("#photoModal").classList.add("open");
  $("#photoModal").setAttribute("aria-hidden", "false");
}
function closeModal() {
  $("#photoModal").classList.remove("open");
  $("#photoModal").setAttribute("aria-hidden", "true");
}
function stepModal(delta) {
  const n = CONFIG.photos.length;
  galleryState.index = (galleryState.index + delta + n) % n;
  renderModal();
}

/* ============================================================
   QUIZ
   ============================================================ */
let quizState = { i: 0, score: 0 };
function initQuiz() {
  renderQuestion();
  on($("#quizReplay"), "click", () => {
    quizState = { i: 0, score: 0 };
    $("#quizResult").hidden = true;
    $("#quizCard").hidden = false;
    renderQuestion();
  });
}

function renderQuestion() {
  const total = CONFIG.quiz.length;
  const q = CONFIG.quiz[quizState.i];
  $("#quizCount").textContent = `Question ${quizState.i + 1} of ${total}`;
  $("#quizProgressFill").style.width = `${((quizState.i) / total) * 100}%`;
  $("#quizQuestion").textContent = q.q;
  $("#quizFeedback").hidden = true;

  const wrap = $("#quizOptions");
  wrap.innerHTML = q.options
    .map((opt, i) => `<button class="quiz-option" data-index="${i}">${escapeHtml(opt)}</button>`)
    .join("");

  $$(".quiz-option", wrap).forEach((btn) => {
    on(btn, "click", () => selectAnswer(Number(btn.dataset.index)));
  });
}

function selectAnswer(i) {
  const q = CONFIG.quiz[quizState.i];
  const opts = $$(".quiz-option");
  opts.forEach((b) => (b.disabled = true));
  opts[i].classList.add(i === q.correct ? "correct" : "wrong");
  if (i !== q.correct) opts[q.correct].classList.add("correct");
  if (i === q.correct) quizState.score++;

  const fb = $("#quizFeedback");
  fb.textContent = q.feedback || (i === q.correct ? "Nice." : "Close!");
  fb.hidden = false;

  setTimeout(() => {
    quizState.i++;
    if (quizState.i >= CONFIG.quiz.length) {
      finishQuiz();
    } else {
      renderQuestion();
    }
  }, 1400);
}

function finishQuiz() {
  $("#quizProgressFill").style.width = "100%";
  $("#quizCard").hidden = true;
  $("#quizResult").hidden = false;
  $("#quizScore").textContent = `${quizState.score}/${CONFIG.quiz.length}`;
  const lines = {
    5: "Flawless. Almost suspicious.",
    4: "Basically an expert.",
    3: "Solid showing.",
    2: "There's room to grow.",
    1: "We need to hang out more.",
    0: "Bold of you to even try.",
  };
  $("#quizResultLine").textContent = lines[quizState.score] ?? "";
}

/* ============================================================
   MESSAGE WALL (localStorage only)
   ============================================================ */
const MSG_KEY = "birthday_messages_v1";
function initMessageForm() {
  renderMessages();
  on($("#messageForm"), "submit", (e) => {
    e.preventDefault();
    const name = $("#msgName").value.trim();
    const text = $("#msgText").value.trim();
    if (!name || !text) return;

    const messages = loadMessages();
    messages.unshift({ name, text, t: Date.now() });
    saveMessages(messages);
    renderMessages();
    e.target.reset();
  });
}
function loadMessages() {
  try {
    return JSON.parse(localStorage.getItem(MSG_KEY)) || [];
  } catch {
    return [];
  }
}
function saveMessages(list) {
  try {
    localStorage.setItem(MSG_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* storage unavailable — messages just won't persist */
  }
}
function renderMessages() {
  const wall = $("#messagesWall");
  const messages = loadMessages();
  wall.innerHTML = messages
    .map(
      (m, i) => `<div class="msg-card glass">
        <button class="msg-delete" data-index="${i}" aria-label="Delete message" title="Delete">&times;</button>
        <div class="msg-name">${escapeHtml(m.name)}</div>
        <div class="msg-body">${escapeHtml(m.text)}</div>
      </div>`
    )
    .join("");

  $$(".msg-delete", wall).forEach((btn) => {
    on(btn, "click", () => {
      const messages = loadMessages();
      messages.splice(Number(btn.dataset.index), 1);
      saveMessages(messages);
      renderMessages();
    });
  });
}

/* ============================================================
   SECRET
   ============================================================ */
function initSecret() {
  const trigger = $("#secretTrigger");
  const reveal = $("#secretReveal");
  $("#secretNote").textContent = CONFIG.secretMessage;
  on(trigger, "click", () => {
    trigger.classList.add("found");
    reveal.hidden = false;
    fireConfetti_full();
  });
}

/* full-screen confetti burst for the secret + could be reused */
function fireConfetti_full() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;z-index:300;pointer-events:none;width:100%;height:100%;";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const colors = ["#8b5cf6", "#c084fc", "#ffb870", "#f5f3f9", "#e9a4c4"];
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 3 + 2,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * 360,
    vr: (Math.random() - 0.5) * 10,
    life: 0,
  }));
  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach((p) => {
      p.vy += 0.05;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      if (p.y < canvas.height + 20 && p.life < 420) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.life / 400);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (alive) requestAnimationFrame(frame);
    else canvas.remove();
  }
  frame();
}

/* ============================================================
   MUSIC PLAYER
   ============================================================ */
function initPlayer() {
  const audio = $("#audio");
  const toggle = $("#playerToggle");
  const iconPlay = $("#iconPlay");
  const iconPause = $("#iconPause");
  const progress = $("#playerProgress");
  $("#playerTitle").textContent = CONFIG.song.title;

  on(toggle, "click", () => {
    if (audio.paused) {
      audio.play().catch(() => {
        $("#playerTitle").textContent = "Add a file at assets/music/birthday-song.mp3";
      });
    } else {
      audio.pause();
    }
  });

  on(audio, "play", () => {
    iconPlay.hidden = true;
    iconPause.hidden = false;
  });
  on(audio, "pause", () => {
    iconPlay.hidden = false;
    iconPause.hidden = true;
  });
  on(audio, "timeupdate", () => {
    if (audio.duration) progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  });
  on(audio, "ended", () => {
    iconPlay.hidden = false;
    iconPause.hidden = true;
  });
}

/* ============================================================
   SCROLL REVEAL + SECTION RAIL
   ============================================================ */
let scrollObserver;
function initScrollReveal() {
  if (scrollObserver) return;
  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    },
    { threshold: 0.2 }
  );
  $$(".scroll-reveal").forEach((el) => scrollObserver.observe(el));
}

function updateRail() {
  const sections = $$(".screen");
  const dots = $$(".rail-dot");
  const railObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          dots.forEach((d) => d.classList.toggle("active", d.dataset.target === id));
        }
      });
    },
    { threshold: 0.5 }
  );
  sections.forEach((s) => railObserver.observe(s));

  dots.forEach((dot) => {
    on(dot, "click", () => {
      $(`#${dot.dataset.target}`)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ============================================================
   AMBIENT PARTICLES CANVAS
   ============================================================ */
function initParticles() {
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  function seed() {
    const count = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 26000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.05),
      vx: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.4 + 0.15,
    }));
  }
  resize();
  seed();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });

  function frame() {
    ctx.clearRect(0, 0, w, h);
    const scrollY = window.scrollY;
    particles.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < -10) p.y = h + 10;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      ctx.beginPath();
      ctx.arc(p.x, p.y - scrollY * 0, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,164,255,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(frame);
  }
  frame();
}

/* ============================================================
   CURSOR GLOW (desktop only)
   ============================================================ */
function initCursorGlow() {
  const glow = $("#cursorGlow");
  if (!glow || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  on(window, "mousemove", (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    glow.classList.add("active");
  });
  on(document, "mouseleave", () => glow.classList.remove("active"));
}

/* ============================================================
   PARALLAX for ambient orbs on scroll
   ============================================================ */
function initParallax() {
  const orbs = $$(".orb");
  let ticking = false;
  on(window, "scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        orb.style.transform = `translateY(${y * (0.04 + i * 0.02)}px)`;
      });
      ticking = false;
    });
  });
}

/* ============================================================
   REPLAY
   ============================================================ */
function initReplay() {
  on($("#replayBtn"), "click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================================================
   HELPERS
   ============================================================ */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("pre-enter");
  runOpeningSequence();
  initCountdown();
  initCake();
  initGallery();
  initQuiz();
  initMessageForm();
  initSecret();
  initPlayer();
  initParticles();
  initCursorGlow();
  initParallax();
  initReplay();

  on($("#enterBtn"), "click", enterExperience);
});
