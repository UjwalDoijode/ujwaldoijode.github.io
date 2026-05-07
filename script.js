/* ══════════════════════════════════════════════
   script.js — Ujwal Doijode Portfolio v5
   Pure vanilla JS. Zero dependencies.
══════════════════════════════════════════════ */
(function () {
'use strict';

/* ─────────────────────────────────────────────
   1. LOADER
───────────────────────────────────────────── */
const loader = document.getElementById('loader');
const ldN    = document.getElementById('ld-n');
const ldFill = document.getElementById('ld-fill');

let prog = 0;
const loadInterval = setInterval(() => {
  const rem = 100 - prog;
  prog = Math.min(100, prog + Math.max(0.4, rem * 0.042 + Math.random() * 1.5));
  ldN.textContent    = Math.floor(prog);
  ldFill.style.width = prog + '%';
  if (prog >= 100) {
    clearInterval(loadInterval);
    ldN.textContent    = '100';
    ldFill.style.width = '100%';
    setTimeout(onLoaded, 460);
  }
}, 26);

function onLoaded() {
  loader.classList.add('out');
  document.body.classList.add('loaded');
  buildName();       // build letter spans before revealing
  revealHero();
  initParticles();
  startTyping();
}

/* ─────────────────────────────────────────────
   2. BUILD NAME — split into individual letter spans
   HTML has two .hn-word containers and a .hn-sep.
   We inject <span class="hn-l"> for each character.
───────────────────────────────────────────── */
function buildName() {
  const words = document.querySelectorAll('.hn-word');
  words.forEach(word => {
    const text = word.dataset.text || word.textContent.trim();
    word.textContent = '';
    word.dataset.text = text;
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.className = 'hn-l';
      span.textContent = ch;
      word.appendChild(span);
    });
  });
}

/* ─────────────────────────────────────────────
   3. HERO ENTRANCE
───────────────────────────────────────────── */
const hPhoto  = document.getElementById('h-photo');
const hCopy   = document.getElementById('h-copy');
const hScroll = document.getElementById('h-scroll');
const hTLine  = document.getElementById('h-title-line');

function revealHero() {
  /* Photo entrance */
  hPhoto.style.cssText = `
    opacity: 0;
    filter: blur(18px) brightness(0.3) saturate(0.1);
    transform: translateX(-50%) scale(1.08);
    transition:
      opacity   1.5s cubic-bezier(0.16,1,0.3,1),
      filter    1.4s cubic-bezier(0.16,1,0.3,1),
      transform 1.6s cubic-bezier(0.16,1,0.3,1);
  `;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setTimeout(() => {
      hPhoto.style.opacity   = '1';
      hPhoto.style.filter    = 'blur(0px) brightness(1) saturate(1)';
      hPhoto.style.transform = 'translateX(-50%) scale(1)';
    }, 80);
  }));

  /* Letters — stagger each one dropping in */
  const letters = document.querySelectorAll('.hn-l');
  letters.forEach((l, i) => {
    // stagger: 60ms per letter, starting at 200ms
    setTimeout(() => l.classList.add('vis'), 200 + i * 55);
  });

  /* Separator dot */
  const sep = document.querySelector('.hn-sep');
  if (sep) setTimeout(() => sep.classList.add('vis'), 200 + letters.length * 55);

  /* Subtitle line */
  if (hTLine) setTimeout(() => hTLine.classList.add('vis'), 600);

  /* Copy + scroll cue */
  [hCopy, hScroll].forEach((el, i) => {
    if (!el) return;
    el.classList.add('hv');
    setTimeout(() => el.classList.add('vis'), 700 + i * 180);
  });
}

/* ─────────────────────────────────────────────
   4. PARTICLE SYSTEM
───────────────────────────────────────────── */
const canvas = document.getElementById('ptcl');
const ctx    = canvas.getContext('2d');
let W, H, ptcls = [], animGoing = false;

function sizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
sizeCanvas();
window.addEventListener('resize', () => { sizeCanvas(); spawnAll(); });

function rnd(a, b) { return a + Math.random() * (b - a); }

const PALETTES = [
  [139,111,255],[91,158,255],[180,160,255],[220,200,255],[255,255,255],
];

class Dot {
  constructor(init) { this.reset(init === true); }
  reset(init) {
    this.x    = rnd(0, W);
    this.y    = init ? rnd(0, H) : H + 8;
    this.r    = rnd(0.8, 2.8);
    this.vx   = rnd(-0.15, 0.15);
    this.vy   = rnd(-0.55, -0.18);
    this.life = 0;
    this.max  = rnd(200, 400);
    this.rgb  = PALETTES[Math.floor(Math.random() * PALETTES.length)];
  }
  step() { this.x += this.vx; this.y += this.vy; this.life++; if (this.life > this.max || this.y < -6) this.reset(false); }
  draw() {
    const a = Math.sin((this.life / this.max) * Math.PI) * 0.65;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.rgb},${a})`;
    ctx.shadowBlur = 7; ctx.shadowColor = `rgba(${this.rgb},0.55)`;
    ctx.fill(); ctx.shadowBlur = 0;
  }
}

class Nebula {
  constructor(init) { this.reset(init === true); }
  reset(init) {
    this.x    = rnd(W * 0.1, W * 0.9);
    this.y    = init ? rnd(0, H) : H + 200;
    this.r    = rnd(80, 170);
    this.vx   = rnd(-0.05, 0.05);
    this.vy   = rnd(-0.09, -0.03);
    this.life = 0;
    this.max  = rnd(350, 650);
    this.hue  = Math.random() > 0.5 ? '139,111,255' : '91,158,255';
  }
  step() { this.x += this.vx; this.y += this.vy; this.life++; if (this.life > this.max || this.y < -200) this.reset(false); }
  draw() {
    const a = Math.sin((this.life / this.max) * Math.PI) * 0.06;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    g.addColorStop(0, `rgba(${this.hue},${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
  }
}

function spawnAll() {
  const mob = window.innerWidth < 768;
  ptcls = [
    ...Array.from({length: mob ? 20 : 55}, () => new Dot(true)),
    ...Array.from({length: mob ? 3  : 7},  () => new Nebula(true)),
  ];
}

function initParticles() {
  if (animGoing) return;
  animGoing = true; spawnAll();
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    ptcls.forEach(p => { p.step(); p.draw(); });
    requestAnimationFrame(loop);
  })();
}

/* ─────────────────────────────────────────────
   5. TYPING
───────────────────────────────────────────── */
const ROLES = ['AI Engineer', 'Full Stack Developer', 'Builder', 'LLM Systems Designer'];
const typEl = document.getElementById('typed');
let ri = 0, ci = 0, del = false;

function startTyping() { tick(); }
function tick() {
  const w = ROLES[ri];
  if (!del) {
    typEl.textContent = w.slice(0, ci + 1); ci++;
    if (ci === w.length) { del = true; setTimeout(tick, 1900); return; }
  } else {
    typEl.textContent = w.slice(0, ci - 1); ci--;
    if (ci === 0) { del = false; ri = (ri + 1) % ROLES.length; setTimeout(tick, 360); return; }
  }
  setTimeout(tick, del ? 48 : 88 + Math.random() * 28);
}

/* ─────────────────────────────────────────────
   6. CURSOR
───────────────────────────────────────────── */
const cDot  = document.getElementById('c-dot');
const cRing = document.getElementById('c-ring');
const cGlow = document.getElementById('c-glow');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cDot.style.left = mx + 'px'; cDot.style.top  = my + 'px';
  cGlow.style.left = mx + 'px'; cGlow.style.top = my + 'px';
  cGlow.style.opacity = '1';
});
document.addEventListener('mouseleave', () => cGlow.style.opacity = '0');
(function ringLoop() {
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  cRing.style.left = rx + 'px'; cRing.style.top = ry + 'px';
  requestAnimationFrame(ringLoop);
})();

document.querySelectorAll('a,.btn-v,.btn-o,.ski').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cDot.style.width = '12px'; cDot.style.height = '12px'; cDot.style.background = 'var(--v2)';
    cRing.style.width = '52px'; cRing.style.height = '52px'; cRing.style.borderColor = 'rgba(91,158,255,0.75)';
  });
  el.addEventListener('mouseleave', () => {
    cDot.style.width = '6px'; cDot.style.height = '6px'; cDot.style.background = 'var(--v1)';
    cRing.style.width = '32px'; cRing.style.height = '32px'; cRing.style.borderColor = 'rgba(139,111,255,0.5)';
  });
});

/* ─────────────────────────────────────────────
   7. NAV
───────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

/* ─────────────────────────────────────────────
   8. HERO SCROLL — REDESIGNED
   
   The big idea:
   • Photo clips from bottom (same cinematic mechanic)
   • Name: "UJWAL" slides LEFT off screen, "DOIJODE" slides RIGHT
     (like a curtain parting — the name splits apart)
   • ALL atmospheric layers (rings, bg-blur, particles) fade to zero
     cleanly so there is ZERO empty space / void visible
   • #h-pin has background:var(--bg) so even if JS is slow,
     the background is always solid dark — never a purple circle
───────────────────────────────────────────── */
const heroSec  = document.getElementById('hero');
const phImg    = document.getElementById('ph-img');
const bgBlur   = document.getElementById('bg-blur');
const grEls    = document.querySelectorAll('.gr');
const wordLeft = document.querySelector('.hn-word[data-text="UJWAL"]');
const wordRight= document.querySelector('.hn-word[data-text="DOIJODE"]');
const nameSep  = document.querySelector('.hn-sep');
const nameWrap = document.getElementById('h-name-wrap');

let lastSY = 0, rafPending = false;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function ease(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }
// More aggressive ease for name split — snappier departure
function easeIn(t) { return t * t * t; }

function applyScroll() {
  rafPending = false;
  const heroH = heroSec.offsetHeight;
  const viewH = window.innerHeight;
  const rawP  = clamp(lastSY / (heroH - viewH), 0, 1);
  const p     = ease(rawP);

  /* ── Photo: clip from bottom ── */
  const clipB = clamp(p * 110, 0, 102);
  hPhoto.style.clipPath = `inset(0% 0% ${clipB}% 0% round 0px)`;
  if (phImg) phImg.style.transform = `scale(${1 + p * 0.15})`;

  /* ── NAME SPLIT: UJWAL flies LEFT, DOIJODE flies RIGHT ──
     Starts moving at p=0, fully off-screen by p=0.5.
     translateX uses viewport width so it's always off-screen.
  */
  const splitP = clamp(p / 0.5, 0, 1); // 0→1 during first half of scroll
  const splitE = easeIn(splitP);         // accelerates out — feels snappy
  const vwOffset = window.innerWidth * 0.55; // how far off screen

  if (wordLeft) {
    wordLeft.style.transform = `translateX(${-splitE * vwOffset}px)`;
    wordLeft.style.opacity   = clamp(1 - splitP * 1.4, 0, 1);
  }
  if (wordRight) {
    wordRight.style.transform = `translateX(${splitE * vwOffset}px)`;
    wordRight.style.opacity   = clamp(1 - splitP * 1.4, 0, 1);
  }
  if (nameSep) {
    nameSep.style.opacity   = clamp(0.8 - splitP * 2, 0, 0.8);
    nameSep.style.transform = `scale(${1 - splitP * 0.3})`;
  }
  /* Whole name wrap fades once letters are gone */
  if (nameWrap) nameWrap.style.opacity = clamp(1 - p * 2.5, 0, 1);

  /* ── Subtitle + copy ── */
  if (hTLine) {
    hTLine.style.opacity   = clamp(1 - p * 3, 0, 1);
    hTLine.style.transform = `translateY(${-p * 20}px)`;
  }
  const copyOp = clamp(1 - p * 2.8, 0, 1);
  if (hCopy) {
    hCopy.style.opacity   = copyOp;
    hCopy.style.transform = `translateY(${-p * 40}px)`;
  }
  if (hScroll) hScroll.style.opacity = clamp(1 - p * 5, 0, 1);

  /* ── Glow rings: fade to zero ── */
  grEls.forEach((g, i) => {
    const expand = 1 + p * (0.06 + i * 0.03);
    const ringOp = clamp(1 - (p - 0.2) / 0.4, 0, 1);
    g.style.transform = `translate(-50%,-50%) scale(${expand})`;
    g.style.opacity   = ringOp;
  });

  /* ── BG blur: fades to zero, no orphaned atmosphere ── */
  if (bgBlur) {
    bgBlur.style.opacity   = clamp(0.5 - p * 1.1, 0, 0.5);
    bgBlur.style.transform = `scale(${1 + p * 0.05})`;
  }

  /* ── Particles: fade out so they don't bleed below ── */
  canvas.style.opacity = clamp(1 - p * 2, 0, 1);
}

window.addEventListener('scroll', () => {
  lastSY = window.scrollY;
  if (!rafPending) { rafPending = true; requestAnimationFrame(applyScroll); }
}, { passive: true });

/* ─────────────────────────────────────────────
   9. IMAGE 3D TILT (desktop only)
───────────────────────────────────────────── */
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
let tx = 0, ty = 0, ttx = 0, tty = 0;

document.addEventListener('mousemove', e => {
  if (isTouchDevice()) return;
  if (lastSY > window.innerHeight * 0.2) { ttx = 0; tty = 0; return; }
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  ttx = ((e.clientY - cy) / cy) * -4;
  tty = ((e.clientX - cx) / cx) *  4;
});
document.addEventListener('mouseleave', () => { ttx = 0; tty = 0; });

(function tiltLoop() {
  if (!isTouchDevice()) {
    tx += (ttx - tx) * 0.06; ty += (tty - ty) * 0.06;
    if (phImg && lastSY < window.innerHeight * 0.25) {
      const scrollP = lastSY / Math.max(1, heroSec.offsetHeight - window.innerHeight);
      phImg.style.transform = `scale(${1 + scrollP * 0.15}) perspective(900px) rotateX(${tx}deg) rotateY(${ty}deg)`;
    }
  }
  requestAnimationFrame(tiltLoop);
})();

/* ─────────────────────────────────────────────
   10. MARQUEE
───────────────────────────────────────────── */
const MQ = [
  { l:'Python',     i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { l:'LangChain',  e:'🦜' },
  { l:'FastAPI',    i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { l:'Java',       i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { l:'Spring Boot',i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
  { l:'JavaScript', i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { l:'Go',         i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
  { l:'Docker',     i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { l:'Kubernetes', i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { l:'PostgreSQL', i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { l:'AWS',        i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { l:'Prometheus', i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg' },
  { l:'Grafana',    i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg' },
  { l:'LangGraph',  e:'🕸' },
  { l:'Vector DB',  e:'📊' },
  { l:'Agentic AI', e:'⚡' },
  { l:'LangSmith',  e:'🔭' },
  { l:'TypeScript', i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
];

function buildMarquee() {
  const track = document.getElementById('mq-t');
  if (!track) return;
  const set = () => MQ.map((m, idx) => {
    const sep  = idx > 0 ? '<span class="mq-sep"> · </span>' : '';
    const icon = m.i
      ? `<img src="${m.i}" alt="${m.l}" loading="lazy">`
      : `<span style="font-size:1rem">${m.e}</span>`;
    return `${sep}<span class="mq-item">${icon}<span>${m.l}</span></span>`;
  }).join('');
  track.innerHTML = set() + '<span class="mq-sep" style="margin:0 16px"> · </span>' + set();
}
buildMarquee();

/* ─────────────────────────────────────────────
   11. STATS COUNTER
───────────────────────────────────────────── */
function animateCounter(el, target, duration) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target + (target > 9 ? '+' : '');
  };
  requestAnimationFrame(step);
}

const statIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const num = e.target.querySelector('.stat-n');
      if (num && !num.dataset.counted) {
        num.dataset.counted = '1';
        animateCounter(num, parseInt(num.dataset.target), 1600);
      }
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat').forEach(s => statIO.observe(s));

/* ─────────────────────────────────────────────
   12. SCROLL REVEAL
───────────────────────────────────────────── */
const revIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revIO.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
document.querySelectorAll('.rs').forEach(el => revIO.observe(el));

/* ─────────────────────────────────────────────
   13. PROJECT CARD MOUSE GLOW
───────────────────────────────────────────── */
document.querySelectorAll('.pc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    card.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(139,111,255,0.055) 0%, transparent 52%)`;
  });
  card.addEventListener('mouseleave', () => card.style.backgroundImage = '');
});

})(); // end IIFE
