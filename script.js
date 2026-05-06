/* ══════════════════════════════════════════
   script.js — Ujwal Doijode Portfolio v2
══════════════════════════════════════════ */
(function(){
'use strict';

/* ─────────────────────────────────────
   MARQUEE ITEMS
───────────────────────────────────── */
const MARQUEE_ITEMS = [
  { label:'Python',   icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { label:'LangChain',icon:null, emoji:'🦜' },
  { label:'FastAPI',  icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
  { label:'Java',     icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { label:'Spring Boot',icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg'},
  { label:'JavaScript',icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'},
  { label:'Go',       icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
  { label:'Docker',   icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { label:'Kubernetes',icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg'},
  { label:'PostgreSQL',icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg'},
  { label:'AWS',      icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'},
  { label:'Prometheus',icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg'},
  { label:'Grafana',  icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg'},
  { label:'LangGraph',icon:null,emoji:'🕸'},
  { label:'Vector DB',icon:null,emoji:'📊'},
  { label:'Agentic AI',icon:null,emoji:'⚡'},
  { label:'LangSmith',icon:null,emoji:'🔭'},
];

function buildMarquee(){
  const track = document.getElementById('marquee');
  if(!track) return;
  // Build twice for seamless loop
  const makeSet = () => {
    let html = '';
    MARQUEE_ITEMS.forEach((item, i) => {
      if(i > 0) html += `<span class="m-sep">·</span>`;
      html += `<div class="m-item">`;
      if(item.icon){
        html += `<img src="${item.icon}" alt="${item.label}" loading="lazy">`;
      } else {
        html += `<span style="font-size:1.1rem">${item.emoji}</span>`;
      }
      html += `<span>${item.label}</span></div>`;
    });
    return html;
  };
  // duplicate for seamless scroll
  track.innerHTML = makeSet() + '<span class="m-sep" style="margin:0 24px">·</span>' + makeSet();
}
buildMarquee();


/* ─────────────────────────────────────
   LOADER
───────────────────────────────────── */
const loader    = document.getElementById('loader');
const loaderNum = document.getElementById('loader-num');
const loaderBar = document.getElementById('loader-bar');

let progress = 0;
const tick = setInterval(() => {
  const remaining = 100 - progress;
  progress = Math.min(100, progress + Math.max(0.5, remaining * 0.042 + Math.random() * 1.4));

  loaderNum.textContent = Math.floor(progress);
  loaderBar.style.width = progress + '%';

  if(progress >= 100){
    clearInterval(tick);
    loaderNum.textContent = '100';
    loaderBar.style.width = '100%';
    setTimeout(finishLoad, 450);
  }
}, 28);

function finishLoad(){
  loader.classList.add('out');
  document.body.classList.add('loaded');
  revealHero();
}


/* ─────────────────────────────────────
   HERO REVEAL
───────────────────────────────────── */
function revealHero(){
  // Photo entrance
  const photoScene = document.getElementById('photo-scene');
  photoScene.style.cssText = `
    opacity:0;
    filter:blur(14px) saturate(0.3);
    transform:translateX(-50%) scale(1.12) translateY(30px);
    transition:opacity 1.4s cubic-bezier(0.16,1,0.3,1),
               filter 1.3s cubic-bezier(0.16,1,0.3,1),
               transform 1.5s cubic-bezier(0.16,1,0.3,1);
  `;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    setTimeout(()=>{
      photoScene.style.opacity   = '1';
      photoScene.style.filter    = 'blur(0) saturate(1)';
      photoScene.style.transform = 'translateX(-50%) scale(1) translateY(0)';
    }, 100);
  }));

  // Text stagger
  ['r0','r1','r2','r3','r4'].forEach(cls=>{
    document.querySelectorAll('.'+cls).forEach(el=>{
      setTimeout(()=>el.classList.add('vis'), 200);
    });
  });
  setTimeout(()=>{
    const sc = document.getElementById('scroll-cue');
    if(sc) sc.classList.add('vis');
  }, 1100);

  // Start typing
  setTimeout(startTyping, 650);
}


/* ─────────────────────────────────────
   TYPING
───────────────────────────────────── */
const ROLES = ['AI Engineer', 'Full Stack Developer', 'Builder', 'LLM Systems Designer'];
const typEl = document.getElementById('typed');
let ri=0, ci=0, del=false;

function startTyping(){ typeLoop(); }
function typeLoop(){
  const word = ROLES[ri];
  if(!del){
    typEl.textContent = word.slice(0, ci+1);
    ci++;
    if(ci === word.length){ del=true; setTimeout(typeLoop, 1800); return; }
  } else {
    typEl.textContent = word.slice(0, ci-1);
    ci--;
    if(ci===0){ del=false; ri=(ri+1)%ROLES.length; setTimeout(typeLoop,380); return; }
  }
  setTimeout(typeLoop, del ? 50 : 88 + Math.random()*28);
}


/* ─────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────── */
const curDot  = document.getElementById('cur-dot');
const curRing = document.getElementById('cur-ring');
const curGlow = document.getElementById('cur-glow');

let mx=window.innerWidth/2, my=window.innerHeight/2;
let rx=mx, ry=my;

document.addEventListener('mousemove', e=>{
  mx=e.clientX; my=e.clientY;
  curDot.style.left  = mx+'px';
  curDot.style.top   = my+'px';
  curGlow.style.left = mx+'px';
  curGlow.style.top  = my+'px';
  curGlow.style.opacity='1';
});
document.addEventListener('mouseleave',()=>curGlow.style.opacity='0');

(function ringRAF(){
  rx += (mx-rx)*0.1;
  ry += (my-ry)*0.1;
  curRing.style.left = rx+'px';
  curRing.style.top  = ry+'px';
  requestAnimationFrame(ringRAF);
})();

document.querySelectorAll('a, .btn-p, .btn-g, .ft-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    curDot.style.width='12px'; curDot.style.height='12px';
    curDot.style.background='var(--v2)';
    curRing.style.width='52px'; curRing.style.height='52px';
    curRing.style.borderColor='rgba(94,156,250,0.7)';
  });
  el.addEventListener('mouseleave',()=>{
    curDot.style.width='6px'; curDot.style.height='6px';
    curDot.style.background='var(--v1)';
    curRing.style.width='32px'; curRing.style.height='32px';
    curRing.style.borderColor='rgba(139,114,255,0.45)';
  });
});


/* ─────────────────────────────────────
   NAV SCROLL STATE
───────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, {passive:true});


/* ─────────────────────────────────────
   HERO SCROLL CINEMATIC
───────────────────────────────────── */
const heroSec   = document.getElementById('hero');
const heroCopy  = document.getElementById('hero-copy');
const photoSceneEl = document.getElementById('photo-scene');
const photoGlow = document.getElementById('photo-glow');
const scrollCue = document.getElementById('scroll-cue');

let lastSY=0, rafPending=false;

function lerp(a,b,t){ return a+(b-a)*t; }

function heroScroll(){
  rafPending=false;
  const heroH = heroSec.offsetHeight;
  const vH    = window.innerHeight;
  const scrollable = heroH - vH;
  const raw = Math.min(Math.max(lastSY/scrollable, 0), 1);
  // ease
  const p = raw<.5 ? 2*raw*raw : 1-Math.pow(-2*raw+2,2)/2;

  // Text fades & lifts
  if(heroCopy){
    heroCopy.style.opacity   = String(Math.max(0, 1-p*2.4));
    heroCopy.style.transform = `translateY(${-p*70}px)`;
  }

  // Scroll cue
  if(scrollCue) scrollCue.style.opacity = String(Math.max(0, 1-p*5));

  // Photo: scale + shift up (cinematic reveal)
  if(photoSceneEl){
    const sc = 1 + p*0.45;
    const up = -p*100;
    photoSceneEl.style.transform = `translateX(-50%) scale(${sc}) translateY(${up}px)`;
    photoSceneEl.style.filter    = `brightness(${1-p*0.4}) saturate(${1-p*0.3})`;
  }

  // Glow intensifies
  if(photoGlow){
    photoGlow.style.opacity = String(1 + p*2);
    photoGlow.style.transform = `translateX(-50%) scaleX(${1+p*0.7}) scaleY(${1+p*0.4})`;
  }
}

window.addEventListener('scroll',()=>{
  lastSY=window.scrollY;
  if(!rafPending){ rafPending=true; requestAnimationFrame(heroScroll); }
},{passive:true});


/* ─────────────────────────────────────
   PHOTO 3D TILT
───────────────────────────────────── */
const tiltEl = document.getElementById('photo-tilt');
let tx=0,ty=0, ttx=0,tty=0;

document.addEventListener('mousemove',e=>{
  const cx=window.innerWidth/2, cy=window.innerHeight/2;
  const dx=(e.clientX-cx)/(window.innerWidth/2);
  const dy=(e.clientY-cy)/(window.innerHeight/2);
  ttx = dy * -7;
  tty = dx *  7;
});
document.addEventListener('mouseleave',()=>{ ttx=0; tty=0; });

(function tiltRAF(){
  tx += (ttx-tx)*0.065;
  ty += (tty-ty)*0.065;
  if(lastSY < window.innerHeight*0.4 && tiltEl){
    tiltEl.style.transform = `perspective(900px) rotateX(${tx}deg) rotateY(${ty}deg)`;
  } else if(tiltEl){
    tiltEl.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
  }
  requestAnimationFrame(tiltRAF);
})();


/* ─────────────────────────────────────
   SCROLL REVEAL (IntersectionObserver)
───────────────────────────────────── */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('vis');
      io.unobserve(e.target);
    }
  });
},{threshold:0.1, rootMargin:'0px 0px -30px 0px'});

document.querySelectorAll('.rs').forEach(el=>io.observe(el));


/* ─────────────────────────────────────
   PROJECT CARD MOUSE GLOW
───────────────────────────────────── */
document.querySelectorAll('.proj-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width)*100;
    const y=((e.clientY-r.top)/r.height)*100;
    card.style.backgroundImage=`radial-gradient(circle at ${x}% ${y}%,rgba(139,114,255,0.05) 0%,transparent 55%)`;
  });
  card.addEventListener('mouseleave',()=>card.style.backgroundImage='');
});

})();
