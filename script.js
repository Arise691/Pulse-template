'use strict';
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Loading screen ---------- */
(function loadingScreen() {
  const screen = $('#loadingScreen');
  const bar = $('#loadBar');
  if (!screen) return;
  let progress = 0;
  const timer = setInterval(() => {
    progress += Math.random() * 22;
    if (progress >= 100) { progress = 100; clearInterval(timer); }
    if (bar) bar.style.width = `${progress}%`;
  }, 120);
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (bar) bar.style.width = '100%';
      setTimeout(() => screen.classList.add('hidden'), 250);
    }, 300);
  });
  setTimeout(() => screen.classList.add('hidden'), 3000);
})();

/* ---------- Scroll progress bar ---------- */
(function scrollProgress() {
  const bar = $('#scrollProgress');
  if (!bar) return;
  function update() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = `${scrolled}%`;
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ---------- Custom cursor ---------- */
(function customCursor() {
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let ringX = 0, ringY = 0;
  const target = { x: 0, y: 0 };

  window.addEventListener('pointermove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    dot.classList.add('active');
    ring.classList.add('active');
    target.x = e.clientX; target.y = e.clientY;
  });
  window.addEventListener('pointerleave', () => {
    dot.classList.remove('active'); ring.classList.remove('active');
  });
  function loop() {
    ringX += (target.x - ringX) * 0.2;
    ringY += (target.y - ringY) * 0.2;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(loop);
  }
  loop();

  $$('a, button, .gallery-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.7)');
    el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
  });

  document.addEventListener('pointerdown', () => ring.classList.add('clicked'));
  document.addEventListener('pointerup', () => ring.classList.remove('clicked'));
})();

/* ---------- Global click / tap ripple feedback ---------- */
(function clickRipple() {
  document.addEventListener('pointerdown', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
})();

/* ---------- Kinetic hero text reveal ---------- */
(function kineticReveal() {
  const words = $$('.kinetic-word, .kinetic-line');
  words.forEach(el => {
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('in-view'), 200 + delay * 110);
  });
})();

/* ---------- Scroll reveal for stagger groups ---------- */
(function scrollReveal() {
  const items = $$('.stagger-parent, .stagger-item');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
  items.forEach(el => io.observe(el));
})();

/* ---------- Parallax hero blobs ---------- */
(function parallax() {
  const blobs = $$('[data-parallax]');
  if (!blobs.length) return;
  let ticking = false;
  function update() {
    const y = window.scrollY;
    blobs.forEach(el => {
      const factor = parseFloat(el.dataset.parallax);
      el.style.transform = `translateY(${y * factor}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
})();

/* ---------- Magnetic buttons ---------- */
(function magneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });
})();

/* ---------- Animated counters ---------- */
(function counters() {
  const nums = $$('.stat-num[data-count]');
  if (!nums.length) return;
  function animate(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1500;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
    });
  }, { threshold: 0.6 });
  nums.forEach(el => io.observe(el));
})();

/* ---------- Gallery: drag-to-scroll + dots ---------- */
(function gallery() {
  const scroller = $('#galleryScroll');
  const track = $('#galleryTrack');
  const dotsWrap = $('#galleryDots');
  if (!scroller || !track) return;

  const cards = $$('.gallery-card', track);
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    const dots = $$('span', dotsWrap);
    const scrollCenter = scroller.scrollLeft + scroller.clientWidth / 2;
    let closest = 0, closestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - scrollCenter);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === closest));
  }
  scroller.addEventListener('scroll', () => requestAnimationFrame(updateDots), { passive: true });

  // Pointer drag-to-scroll for desktop mouse users
  let isDown = false, startX = 0, startScroll = 0;
  scroller.addEventListener('pointerdown', (e) => {
    isDown = true;
    scroller.classList.add('dragging');
    startX = e.clientX;
    startScroll = scroller.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    scroller.scrollLeft = startScroll - (e.clientX - startX);
  });
  window.addEventListener('pointerup', () => {
    isDown = false;
    scroller.classList.remove('dragging');
  });
})();

/* ---------- Testimonial auto-rotate ---------- */
(function testimonials() {
  const items = $$('.testi-item');
  const dotsWrap = $('#testiDots');
  if (!items.length) return;

  if (dotsWrap) {
    items.forEach((_, i) => {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dotsWrap.appendChild(dot);
    });
  }
  const dots = dotsWrap ? $$('span', dotsWrap) : [];

  let index = 0;
  function show(i) {
    items.forEach((el, idx) => el.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    index = i;
  }
  setInterval(() => show((index + 1) % items.length), 4500);
})();

/* ---------- Mobile nav ---------- */
(function mobileNav() {
  const btn = $('#hamburger');
  const topbar = $('.topbar');
  if (!btn || !topbar) return;
  btn.addEventListener('click', () => {
    const open = topbar.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    topbar.classList.remove('menu-open');
    btn.setAttribute('aria-expanded', 'false');
  }));
})();

/* ---------- Footer year ---------- */
(function footerYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ---------- Service worker (optional offline support) ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}
