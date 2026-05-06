/* ═══════════════════════════════════════════
   script.js — Ujwal Doijode Portfolio v3
   Full cinematic experience. Zero dependencies.
═══════════════════════════════════════════ */
(function () {
'use strict';

/* ─────────────────────────────────────────
   1. LOADER
───────────────────────────────────────── */
const loader  = document.getElementById('loader');
const ldNum   = document.getElementById('ld-num');
const ldFill  = document.getElementById('ld-fill');

let prog = 0;
const loadTick = setInterval(() => {
  const rem = 100 - prog;
  prog = Math.min(100, prog + Math.max(0.4, rem * 0.04 + Math.random() * 1.6));
  ldNum.textContent = Math.floor(prog);
  ldFill.style.width = prog + '%';
  if (prog >= 100) {
    clearInterval(loadTick);
    ldNum.textContent = '100';
    ldFill.style.width = '100%';
    setTimeout(onLoaded, 440);
  }
}, 28);

function onLoaded() {
  loader.classList.add('out');
  document.body.classList.add('loaded');
  revealHero();
  startParticles();
  startTyping();
}

/* ─────────────────────────────────────────
   2. HERO ENTRANCE — image drops in from
      straight (scale + blur only, no X drift)
───────────────────────────────────────── */
const imgWrap = document.getElementById('img-wrap');
const heroCopy = document.getElementById('hero-copy');
const scrlEl   = document.getElementById('scrl');

function revealHero() {
  /* Set initial state via JS so CSS doesn't fight it */
  imgWrap.style.cssText = `
    opacity: 0;
    filter: blur(18px) brightness(0.4) saturate(0.2);
    transform: translateX(-50%) scaleY(0.88) scaleX(0.94);
    transition:
      opacity 1.5s cubic-bezier(0.16,1,0.3,1),
      filter 1.4s cubic-bezier(0.16,1,0.3,1),
      transform 1.5s cubic-bezier(0.16,1,0.3,1);
  `;

  /* next frame: animate to final */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    setTimeout(() => {
      imgWrap.style.opacity   = '1';
      imgWrap.style.filter    = 'blur(0px) brightness(1) saturate(1)';
      imgWrap.style.transform = 'translateX(-50%) scaleY(1) scaleX(1)';
    }, 80);
  }));

  /* Flank letters */
  const letters = document.querySelectorAll('.flank span');
  letters.forEach((el, i) => {
    setTimeout(() => el.classList.add('vis'), 350 + i * 60);
  });

  /* Copy overlay */
  [heroCopy, scrlEl].forEach((el, i) => {
    if (!el) return;
    el.classList.add('hero-r');
    setTimeout(() => el.classList.add('vis'), 700 + i * 200);
  });
}

/* ─────────────────────────────────────────
   3. PARTICLE SYSTEM
      Floating purple/blue orbs that drift
      They feel alive and organic
───────────────────────────────────────── */
const canvas = document.getElementById('ptcl');
const ctx    = canvas.getContext('2d');
let ptcls    = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function rnd(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x    = rnd(0, W);
    this.y    = init ? rnd(0, H) : H + 10;
    this.r    = rnd(1, 3.5);
    this.vx   = rnd(-0.18, 0.18);
    this.vy   = rnd(-0.55, -0.15);
    this.life = 0;
    this.maxLife = rnd(180, 380);
    /* alternate violet / blue / white */
    const palette = [
      [139, 111, 255],
      [91,  158, 255],
      [180, 160, 255],
      [255, 255, 255],
    ];
    this.rgb = palette[Math.floor(Math.random() * palette.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset(false);
  }
  draw() {
    const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},${alpha})`;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = `rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},0.5)`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

/* Larger, slow nebula blobs */
class Nebula {
  constructor() { this.reset(true); }
  reset(init) {
    this.x    = rnd(W * 0.2, W * 0.8);
    this.y    = init ? rnd(0, H) : H + 200;
    this.r    = rnd(60, 140);
    this.vx   = rnd(-0.06, 0.06);
    this.vy   = rnd(-0.12, -0.04);
    this.life = 0;
    this.maxLife = rnd(300, 600);
    this.hue  = Math.random() > 0.5 ? [139,111,255] : [91,158,255];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -200) this.reset(false);
  }
  draw() {
    const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.06;
    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    grd.addColorStop(0, `rgba(${this.hue[0]},${this.hue[1]},${this.hue[2]},${alpha})`);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }
}

let animRunning = false;

function startParticles() {
  if (animRunning) return;
  animRunning = true;
  ptcls = [
    ...Array.from({length: 55}, () => new Particle()),
    ...Array.from({length: 8},  () => new Nebula()),
  ];
  animLoop();
}

function animLoop() {
  ctx.clearRect(0, 0, W, H);
  ptcls.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animLoop);
}

/* ─────────────────────────────────────────
   4. TYPING ANIMATION
───────────────────────────────────────── */
const ROLES  = ['AI Engineer', 'Full Stack Developer', 'Builder', 'LLM Systems Designer'];
const typEl  = document.getElementById('typed');
let ri = 0, ci = 0, deleting = false;

function startTyping() { typeStep(); }

function typeStep() {
  const word = ROLES[ri];
  if (!deleting) {
    typEl.textContent = word.slice(0, ci + 1);
    ci++;
    if (ci === word.length) { deleting = true; setTimeout(typeStep, 1900); return; }
  } else {
    typEl.textContent = word.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; ri = (ri + 1) % ROLES.length; setTimeout(typeStep, 350); return; }
  }
  setTimeout(typeStep, deleting ? 48 : 90 + Math.random() * 26);
}

/* ─────────────────────────────────────────
   5. CUSTOM CURSOR
───────────────────────────────────────── */
const cDot  = document.getElementById('cur-dot');
const cRing = document.getElementById('cur-ring');
const cGlow = document.getElementById('cur-glow');

let mx = W / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cDot.style.left = mx + 'px'; cDot.style.top = my + 'px';
  cGlow.style.left = mx + 'px'; cGlow.style.top = my + 'px';
  cGlow.style.opacity = '1';
});
document.addEventListener('mouseleave', () => cGlow.style.opacity = '0');

(function ringLoop() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  cRing.style.left = rx + 'px';
  cRing.style.top  = ry + 'px';
  requestAnimationFrame(ringLoop);
})();

document.querySelectorAll('a, .btn-p, .btn-g, .ski').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cDot.style.width  = '12px'; cDot.style.height = '12px';
    cDot.style.background = 'var(--v2)';
    cRing.style.width = '54px'; cRing.style.height = '54px';
    cRing.style.borderColor = 'rgba(91,158,255,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cDot.style.width  = '6px'; cDot.style.height = '6px';
    cDot.style.background = 'var(--v1)';
    cRing.style.width = '32px'; cRing.style.height = '32px';
    cRing.style.borderColor = 'rgba(139,111,255,0.5)';
  });
});

/* ─────────────────────────────────────────
   6. NAV SCROLL
───────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ─────────────────────────────────────────
   7. HERO SCROLL — CINEMATIC
      Same mechanic as akshayiscoding.me:
      As user scrolls #hero's 320vh range:
      • Image: clip-path shrinks upward (reveals bg underneath)
      • Image also slowly scales up (ken-burns zoom)
      • Flank letters fade & spread outward
      • Copy fades up
      The key: clip-path inset(bottom%) cuts image from bottom
      so it appears to "sink below the fold" cinematically.
───────────────────────────────────────── */
const heroSec  = document.getElementById('hero');
const flankL   = document.getElementById('flank-l');
const flankR   = document.getElementById('flank-r');
const heroImg  = document.getElementById('hero-img');

let lastSY = 0, rafId = null;

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function ease(t) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }

function applyHeroScroll() {
  rafId = null;
  const heroH    = heroSec.offsetHeight;
  const vH       = window.innerHeight;
  const scrollable = heroH - vH;
  const rawP     = clamp(lastSY / scrollable, 0, 1);
  const p        = ease(rawP);   /* eased 0→1 */

  /* ── Image: clip from bottom (Akshay style) ──
     inset(top right bottom left)
     We clip the BOTTOM of the image as we scroll.
     At p=0 → full image (inset 0% on all sides)
     At p=1 → image fully clipped (inset 100% from top or bottom)
     We go bottom→top clip so image looks like it "sinks"
  */
  const clipBottom = clamp(p * 110, 0, 100);        /* bottom clip grows 0→100% */
  const clipTop    = 0;                               /* top stays 0 */
  imgWrap.style.clipPath = `inset(${clipTop}% 0% ${clipBottom}% 0%)`;

  /* ── Image zoom (ken-burns) ── */
  const scale = 1 + p * 0.22;
  heroImg.style.transform = `scale(${scale})`;

  /* ── Copy: fade out & slide up ── */
  const copyOp = clamp(1 - p * 3, 0, 1);
  const copyTY = -p * 50;
  heroCopy.style.opacity   = String(copyOp);
  heroCopy.style.transform = `translateY(${copyTY}px)`;

  /* ── Flank letters: spread out & fade ── */
  const flankOp = clamp(1 - p * 2.5, 0, 1);
  const flankX  = p * 40;
  if (flankL) { flankL.style.opacity = String(flankOp); flankL.style.transform = `translateY(-52%) translateX(-${flankX}px)`; }
  if (flankR) { flankR.style.opacity = String(flankOp); flankR.style.transform = `translateY(-52%) translateX(${flankX}px)`; }

  /* ── Scroll cue ── */
  if (scrlEl) scrlEl.style.opacity = String(clamp(1 - p * 6, 0, 1));
}

window.addEventListener('scroll', () => {
  lastSY = window.scrollY;
  if (!rafId) rafId = requestAnimationFrame(applyHeroScroll);
}, { passive: true });

/* ─────────────────────────────────────────
   8. IMAGE 3D TILT on mouse move
      Only active when hero is visible
───────────────────────────────────────── */
let tiltX = 0, tiltY = 0;
let tTX = 0, tTY = 0;

document.addEventListener('mousemove', e => {
  if (lastSY > window.innerHeight * 0.3) { tTX = 0; tTY = 0; return; }
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  tTX = ((e.clientY - cy) / cy) * -5;
  tTY = ((e.clientX - cx) / cx) *  5;
});

(function tiltLoop() {
  tiltX += (tTX - tiltX) * 0.06;
  tiltY += (tTY - tiltY) * 0.06;
  if (heroImg && lastSY < window.innerHeight * 0.4) {
    heroImg.style.transform = `scale(${1 + (lastSY / (heroSec.offsetHeight - window.innerHeight)) * 0.22})
      perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  }
  requestAnimationFrame(tiltLoop);
})();

/* ─────────────────────────────────────────
   9. MARQUEE BUILD
───────────────────────────────────────── */
const MQ_ITEMS = [
  { label: 'Python',      img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { label: 'LangChain',   emoji: '🦜' },
  { label: 'FastAPI',     img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { label: 'Java',        img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { label: 'Spring Boot', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
  { label: 'JavaScript',  img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { label: 'Go',          img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
  { label: 'Docker',      img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { label: 'Kubernetes',  img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
  { label: 'PostgreSQL',  img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
  { label: 'AWS',         img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { label: 'Prometheus',  img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg' },
  { label: 'LangGraph',   emoji: '🕸' },
  { label: 'Vector DB',   emoji: '📊' },
  { label: 'Agentic AI',  emoji: '⚡' },
  { label: 'LangSmith',   emoji: '🔭' },
];

function buildMarquee() {
  const track = document.getElementById('mq');
  if (!track) return;

  const makeSet = () => MQ_ITEMS.map((item, i) => {
    const icon = item.img
      ? `<img src="${item.img}" alt="${item.label}" loading="lazy">`
      : `<span class="mq-e">${item.emoji}</span>`;
    const sep = i > 0 ? '<span class="mq-sep">·</span>' : '';
    return `${sep}<div class="mq-item">${icon}<span>${item.label}</span></div>`;
  }).join('');

  // Duplicate for seamless loop
  track.innerHTML = makeSet() + '<span class="mq-sep" style="margin:0 20px">·</span>' + makeSet();
}
buildMarquee();

/* ─────────────────────────────────────────
   10. SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────────── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

document.querySelectorAll('.rs').forEach(el => io.observe(el));

/* ─────────────────────────────────────────
   11. PROJECT CARD MOUSE GLOW
───────────────────────────────────────── */
document.querySelectorAll('.pc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    card.style.backgroundImage = `radial-gradient(circle at ${x}% ${y}%, rgba(139,111,255,0.055) 0%, transparent 52%)`;
  });
  card.addEventListener('mouseleave', () => card.style.backgroundImage = '');
});

})();
