/* ══════════════════════════════════════════════
   script.js — Ujwal Doijode Portfolio v4
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
  revealHero();
  initParticles();
  startTyping();
}

/* ─────────────────────────────────────────────
   2. HERO ENTRANCE
───────────────────────────────────────────── */
const hPhoto  = document.getElementById('h-photo');
const hCopy   = document.getElementById('h-copy');
const hScroll = document.getElementById('h-scroll');
const hName   = document.getElementById('h-name');
const hTLine  = document.getElementById('h-title-line');

function revealHero() {
  /* Photo entrance — scale + blur → sharp, purely vertical */
  hPhoto.style.cssText = `
    opacity: 0;
    filter: blur(20px) brightness(0.3) saturate(0.1);
    transform: translateX(-50%) scale(1.1);
    transition:
      opacity    1.6s cubic-bezier(0.16,1,0.3,1),
      filter     1.5s cubic-bezier(0.16,1,0.3,1),
      transform  1.7s cubic-bezier(0.16,1,0.3,1);
  `;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setTimeout(() => {
      hPhoto.style.opacity   = '1';
      hPhoto.style.filter    = 'blur(0px) brightness(1) saturate(1)';
      hPhoto.style.transform = 'translateX(-50%) scale(1)';
    }, 60);
  }));

  /* Name reveal */
  setTimeout(() => {
    hName.classList.add('vis');
    hTLine.classList.add('vis');
  }, 280);

  /* Copy */
  [hCopy, hScroll].forEach((el, i) => {
    if (!el) return;
    el.classList.add('hv');
    setTimeout(() => el.classList.add('vis'), 650 + i * 180);
  });
}

/* ─────────────────────────────────────────────
   3. PARTICLE SYSTEM
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
  [139,111,255],
  [91, 158,255],
  [180,160,255],
  [220,200,255],
  [255,255,255],
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
  step() {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.max || this.y < -6) this.reset(false);
  }
  draw() {
    const a = Math.sin((this.life / this.max) * Math.PI) * 0.65;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle   = `rgba(${this.rgb},${a})`;
    ctx.shadowBlur  = 7;
    ctx.shadowColor = `rgba(${this.rgb},0.55)`;
    ctx.fill();
    ctx.shadowBlur  = 0;
  }
}

class Nebula {
  constructor(init) { this.reset(init === true); }
  reset(init) {
    this.x    = rnd(W * 0.15, W * 0.85);
    this.y    = init ? rnd(0, H) : H + 180;
    this.r    = rnd(70, 160);
    this.vx   = rnd(-0.05, 0.05);
    this.vy   = rnd(-0.1, -0.03);
    this.life = 0;
    this.max  = rnd(350, 650);
    this.hue  = Math.random() > 0.5 ? '139,111,255' : '91,158,255';
  }
  step() {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.max || this.y < -200) this.reset(false);
  }
  draw() {
    const a = Math.sin((this.life / this.max) * Math.PI) * 0.065;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    g.addColorStop(0, `rgba(${this.hue},${a})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
}

function spawnAll() {
  const mobile = window.innerWidth < 768;
  ptcls = [
    ...Array.from({length: mobile ? 20 : 55}, () => new Dot(true)),
    ...Array.from({length: mobile ? 3  : 7},  () => new Nebula(true)),
  ];
}

function initParticles() {
  if (animGoing) return;
  animGoing = true;
  spawnAll();
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    ptcls.forEach(p => { p.step(); p.draw(); });
    requestAnimationFrame(loop);
  })();
}

/* ─────────────────────────────────────────────
   4. TYPING
───────────────────────────────────────────── */
const ROLES  = ['AI Engineer', 'Full Stack Developer', 'Builder', 'LLM Systems Designer'];
const typEl  = document.getElementById('typed');
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
   5. CURSOR
───────────────────────────────────────────── */
const cDot  = document.getElementById('c-dot');
const cRing = document.getElementById('c-ring');
const cGlow = document.getElementById('c-glow');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cDot.style.left  = mx + 'px'; cDot.style.top  = my + 'px';
  cGlow.style.left = mx + 'px'; cGlow.style.top = my + 'px';
  cGlow.style.opacity = '1';
});
document.addEventListener('mouseleave', () => cGlow.style.opacity = '0');

(function ringLoop() {
  rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
  cRing.style.left = rx + 'px'; cRing.style.top = ry + 'px';
  requestAnimationFrame(ringLoop);
})();

document.querySelectorAll('a, .btn-v, .btn-o, .ski').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cDot.style.width = '12px'; cDot.style.height = '12px';
    cDot.style.background = 'var(--v2)';
    cRing.style.width = '52px'; cRing.style.height = '52px';
    cRing.style.borderColor = 'rgba(91,158,255,0.75)';
  });
  el.addEventListener('mouseleave', () => {
    cDot.style.width = '6px'; cDot.style.height = '6px';
    cDot.style.background = 'var(--v1)';
    cRing.style.width = '32px'; cRing.style.height = '32px';
    cRing.style.borderColor = 'rgba(139,111,255,0.5)';
  });
});

/* ─────────────────────────────────────────────
   6. NAV SCROLL STATE
───────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─────────────────────────────────────────────
   7. HERO SCROLL — CINEMATIC
   
   FIX 1: Glow rings fade OUT as photo clips away (p=0.25→0.7)
           so no empty glowing void remains after photo disappears.
   FIX 2: bg-blur fades out with the photo — no orphaned purple circle.
   FIX 3: Particle canvas fades out so particles don't bleed
           into the work section below.
───────────────────────────────────────────── */
const heroSec = document.getElementById('hero');
const phImg   = document.getElementById('ph-img');
const bgBlur  = document.getElementById('bg-blur');
const flName  = document.getElementById('h-name-wrap');
const grEls   = document.querySelectorAll('.gr');

let lastSY = 0, rafPending = false;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function ease(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2; }

function applyScroll() {
  rafPending = false;
  const heroH = heroSec.offsetHeight;
  const viewH = window.innerHeight;
  const rawP  = clamp(lastSY / (heroH - viewH), 0, 1);
  const p     = ease(rawP);

  /* ── Photo: clip from bottom (Akshay mechanic) ── */
  const clipB = clamp(p * 108, 0, 102);
  hPhoto.style.clipPath = `inset(0% 0% ${clipB}% 0% round 0px)`;
  /* Ken-burns scale on inner img only */
  if (phImg) phImg.style.transform = `scale(${1 + p * 0.18})`;

  /* ── Name: spread apart + fade ── */
  const nameOp = clamp(1 - p * 2.2, 0, 1);
  const nameY  = -p * 40;
  if (flName) {
    flName.style.opacity   = nameOp;
    flName.style.transform = `translateY(${nameY}px)`;
  }

  /* ── Copy: fade up ── */
  const copyOp = clamp(1 - p * 2.8, 0, 1);
  const copyY  = -p * 44;
  if (hCopy) {
    hCopy.style.opacity   = copyOp;
    hCopy.style.transform = `translateY(${copyY}px)`;
  }

  /* ── Scroll cue ── */
  if (hScroll) hScroll.style.opacity = clamp(1 - p * 5, 0, 1);

  /* ── FIX 1: Glow rings fade OUT as photo clips away ──
     Full opacity at p=0 → completely gone by p=0.7.
     This eliminates the glowing empty circle after photo disappears.
  */
  grEls.forEach((g, i) => {
    const expand = 1 + p * (0.08 + i * 0.04);
    /* Start fading at p=0.25, fully transparent by p=0.7 */
    const ringOp = clamp(1 - (p - 0.25) / 0.45, 0, 1);
    g.style.transform = `translate(-50%,-50%) scale(${expand})`;
    g.style.opacity   = ringOp;
  });

  /* ── FIX 2: BG blur fades out with the photo ──
     Max opacity 0.65 at p=0 → zero by p≈0.55.
     No orphaned purple atmospheric circle left behind.
  */
  if (bgBlur) {
    const bgScale = 1 + p * 0.06;
    const bgOp    = clamp(0.65 - p * 1.2, 0, 0.65);
    bgBlur.style.transform = `scale(${bgScale})`;
    bgBlur.style.opacity   = bgOp;
  }

  /* ── FIX 3: Particles fade out so they don't float over work section ── */
  const cvs = document.getElementById('ptcl');
  if (cvs) cvs.style.opacity = clamp(1 - p * 1.8, 0, 1);
}

window.addEventListener('scroll', () => {
  lastSY = window.scrollY;
  if (!rafPending) { rafPending = true; requestAnimationFrame(applyScroll); }
}, { passive: true });

/* ─────────────────────────────────────────────
   8. IMAGE 3D TILT  (desktop only)
───────────────────────────────────────────── */
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;
let tx = 0, ty = 0, ttx = 0, tty = 0;

document.addEventListener('mousemove', e => {
  if (isTouchDevice()) return;
  if (lastSY > window.innerHeight * 0.25) { ttx = 0; tty = 0; return; }
  const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  ttx = ((e.clientY - cy) / cy) * -4.5;
  tty = ((e.clientX - cx) / cx) *  4.5;
});
document.addEventListener('mouseleave', () => { ttx = 0; tty = 0; });

(function tiltLoop() {
  if (!isTouchDevice()) {
    tx += (ttx - tx) * 0.065; ty += (tty - ty) * 0.065;
    if (phImg && lastSY < window.innerHeight * 0.3) {
      const scrollP = lastSY / Math.max(1, heroSec.offsetHeight - window.innerHeight);
      phImg.style.transform = `scale(${1 + scrollP * 0.18}) perspective(900px) rotateX(${tx}deg) rotateY(${ty}deg)`;
    }
  }
  requestAnimationFrame(tiltLoop);
})();

/* ─────────────────────────────────────────────
   9. MARQUEE BUILD
───────────────────────────────────────────── */
const MQ = [
  { l:'Python',      i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { l:'LangChain',   e:'🦜' },
  { l:'FastAPI',     i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { l:'Java',        i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { l:'Spring Boot', i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
  { l:'JavaScript',  i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { l:'Go',          i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
  { l:'Docker',      i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { l:'Kubernetes',  i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { l:'PostgreSQL',  i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { l:'AWS',         i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { l:'Prometheus',  i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg' },
  { l:'Grafana',     i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg' },
  { l:'LangGraph',   e:'🕸' },
  { l:'Vector DB',   e:'📊' },
  { l:'Agentic AI',  e:'⚡' },
  { l:'LangSmith',   e:'🔭' },
  { l:'TypeScript',  i:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
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
   10. STATS COUNTER ANIMATION
───────────────────────────────────────────── */
function animateCounter(el, target, duration) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target);
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
   11. SCROLL REVEAL
───────────────────────────────────────────── */
const revIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); revIO.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.rs').forEach(el => revIO.observe(el));

/* ─────────────────────────────────────────────
   12. PROJECT CARD MOUSE GLOW
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

/* ─────────────────────────────────────────────
   13. NAME HOVER GLOW
───────────────────────────────────────────── */
const hnFirst = document.getElementById('hn-first');
const hnLast  = document.getElementById('hn-last');

[hnFirst, hnLast].forEach(el => {
  if (!el) return;
  el.addEventListener('mouseenter', () => {
    el.style.transition = '-webkit-text-stroke .3s, color .3s';
    el.style.webkitTextStroke = '1.5px rgba(180,160,255,0.9)';
    el.style.textShadow = '0 0 60px rgba(139,111,255,0.35)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.webkitTextStroke = '1.5px rgba(220,210,255,0.55)';
    el.style.textShadow = 'none';
  });
});

})(); // end IIFE
