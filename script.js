/* ─────────────────────────────────────────
   script.js — Ujwal Doijode Portfolio
   All animation & interaction logic.
───────────────────────────────────────── */

(function () {
  'use strict';

  /* ──────────────────────────────────────
     LOADER
  ─────────────────────────────────────── */
  const loader     = document.getElementById('loader');
  const loaderNum  = document.getElementById('loader-num');
  const loaderBar  = document.getElementById('loader-bar');

  let progress = 0;
  const TARGET_DURATION = 2200; // ms
  const STEPS = 80;
  const STEP_TIME = TARGET_DURATION / STEPS;

  const loaderInterval = setInterval(() => {
    // Ease the progress (slow → fast → slow)
    const remaining = 100 - progress;
    const increment = Math.max(0.6, remaining * 0.045 + Math.random() * 1.2);
    progress = Math.min(100, progress + increment);

    loaderNum.textContent = Math.floor(progress);
    loaderBar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(loaderInterval);
      loaderNum.textContent = '100';
      loaderBar.style.width = '100%';

      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        triggerHeroReveal();
      }, 400);
    }
  }, STEP_TIME);


  /* ──────────────────────────────────────
     CUSTOM CURSOR
  ─────────────────────────────────────── */
  // Inject cursor elements
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  const cursorGlow = document.getElementById('cursor-glow');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx, ry = my; // ring smooth position

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;

    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // Move cursor glow immediately
    cursorGlow.style.left = mx + 'px';
    cursorGlow.style.top  = my + 'px';
    cursorGlow.style.opacity = '1';
  });

  // Smooth ring follow via rAF
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects
  document.querySelectorAll('a, .btn, .project-link').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '14px';
      dot.style.height = '14px';
      dot.style.background = 'var(--accent-2)';
      ring.style.width  = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(91,156,246,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '8px';
      dot.style.height = '8px';
      dot.style.background = 'var(--accent-1)';
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(124,106,247,0.5)';
    });
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });


  /* ──────────────────────────────────────
     HERO REVEAL (post-loader)
  ─────────────────────────────────────── */
  function triggerHeroReveal() {
    const items = document.querySelectorAll('.hero-text .reveal-item, #scroll-hint');
    items.forEach((el) => {
      setTimeout(() => el.classList.add('visible'), 80);
    });

    // Image entrance
    const imgWrap = document.getElementById('hero-image-wrap');
    imgWrap.style.transition = 'opacity 1.2s cubic-bezier(0.16,1,0.3,1), filter 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.4s cubic-bezier(0.16,1,0.3,1)';
    imgWrap.style.opacity = '0';
    imgWrap.style.filter  = 'blur(12px)';
    imgWrap.style.transform = 'translateX(-50%) scale(1.15)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          imgWrap.style.opacity   = '1';
          imgWrap.style.filter    = 'blur(0px)';
          imgWrap.style.transform = 'translateX(-50%) scale(1)';
        }, 300);
      });
    });

    // Start typing
    setTimeout(startTyping, 700);
  }


  /* ──────────────────────────────────────
     TYPING ANIMATION
  ─────────────────────────────────────── */
  const ROLES = ['AI Engineer', 'Full Stack Developer', 'Builder'];
  const typingEl = document.getElementById('typing-text');
  let roleIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function startTyping() {
    typeLoop();
  }

  function typeLoop() {
    const current = ROLES[roleIndex];

    if (!isDeleting) {
      typingEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000); // pause at end
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % ROLES.length;
        setTimeout(typeLoop, 400);
        return;
      }
    }

    const speed = isDeleting ? 55 : 90;
    setTimeout(typeLoop, speed + Math.random() * 30);
  }


  /* ──────────────────────────────────────
     SCROLL-BASED HERO CINEMATIC TRANSFORM
  ─────────────────────────────────────── */
  const heroSection  = document.getElementById('hero');
  const heroText     = document.getElementById('hero-text');
  const heroImgWrap  = document.getElementById('hero-image-wrap');
  const heroGlowRing = document.getElementById('hero-glow-ring');
  const scrollHint   = document.getElementById('scroll-hint');

  let scrollRAFPending = false;
  let lastScrollY = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!scrollRAFPending) {
      scrollRAFPending = true;
      requestAnimationFrame(applyScrollTransform);
    }
  }

  function applyScrollTransform() {
    scrollRAFPending = false;

    const heroHeight = heroSection.offsetHeight;
    const viewH      = window.innerHeight;
    // Scrollable range = heroHeight - viewH
    const scrollable = heroHeight - viewH;
    const raw = Math.min(Math.max(lastScrollY / scrollable, 0), 1);

    // Ease progress
    const p = raw < 0.5
      ? 2 * raw * raw
      : 1 - Math.pow(-2 * raw + 2, 2) / 2;

    // ── Text: fade out + move up
    if (heroText) {
      heroText.style.opacity   = String(Math.max(0, 1 - p * 2.2));
      heroText.style.transform = `translateY(${-p * 60}px)`;
    }

    // ── Scroll hint fade
    if (scrollHint) {
      scrollHint.style.opacity = String(Math.max(0, 1 - p * 4));
    }

    // ── Image: scale up + move up (cinematic zoom)
    if (heroImgWrap) {
      const scale    = 1 + p * 0.38;
      const moveUp   = -p * 80;
      // Keep centered horizontally always
      heroImgWrap.style.transform = `translateX(-50%) scale(${scale}) translateY(${moveUp}px)`;
      heroImgWrap.style.filter    = `brightness(${1 - p * 0.35})`;
    }

    // ── Glow intensifies
    if (heroGlowRing) {
      const glowOp = 1 + p * 1.8;
      heroGlowRing.style.opacity = String(glowOp);
      const glowScale = 1 + p * 0.6;
      heroGlowRing.style.transform = `translateX(-50%) scaleX(${glowScale})`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ──────────────────────────────────────
     IMAGE 3D TILT ON MOUSE MOVE
  ─────────────────────────────────────── */
  const imgTilt = document.getElementById('hero-img-tilt');
  let tiltX = 0, tiltY = 0;
  let targetTiltX = 0, targetTiltY = 0;

  document.addEventListener('mousemove', (e) => {
    const rect = imgTilt.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (window.innerWidth / 2);
    const dy   = (e.clientY - cy) / (window.innerHeight / 2);
    targetTiltX = dy * -8;  // tilt vertical
    targetTiltY = dx *  8;  // tilt horizontal
  });

  function animateTilt() {
    tiltX += (targetTiltX - tiltX) * 0.07;
    tiltY += (targetTiltY - tiltY) * 0.07;

    // Only tilt if hero is near-visible
    if (lastScrollY < window.innerHeight * 0.5) {
      imgTilt.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    } else {
      imgTilt.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    }

    requestAnimationFrame(animateTilt);
  }
  animateTilt();

  // Reset tilt on mouse leave
  document.addEventListener('mouseleave', () => {
    targetTiltX = 0;
    targetTiltY = 0;
  });


  /* ──────────────────────────────────────
     SCROLL REVEAL — Projects & Footer
  ─────────────────────────────────────── */
  const scrollRevealEls = document.querySelectorAll('.reveal-scroll');

  const ioReveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        ioReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  scrollRevealEls.forEach(el => ioReveal.observe(el));


  /* ──────────────────────────────────────
     PROJECT CARD — MOUSE GLOW
  ─────────────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
      card.style.backgroundImage = `
        radial-gradient(
          circle at ${x}% ${y}%,
          rgba(124,106,247,0.04) 0%,
          transparent 60%
        )
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = '';
    });
  });


  /* ──────────────────────────────────────
     MOBILE: Reduce animation intensity
  ─────────────────────────────────────── */
  const isMobile = () => window.innerWidth < 768;

  if (isMobile()) {
    // Disable tilt on mobile
    document.removeEventListener('mousemove', () => {});
  }

})();
