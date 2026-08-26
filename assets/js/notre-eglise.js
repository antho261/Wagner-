// =========================================
// FJKM Wagner – Notre Église
// =========================================

// ── Navbar scroll ──────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backtotop').classList.toggle('show', window.scrollY > 400);
});

// ── Mobile menu ────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click',   () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ── Scroll reveal ──────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Timeline horizontale : activation par IntersectionObserver ──
(function () {
  const section = document.getElementById('histoire');
  if (!section) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        section.classList.add('h-active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  obs.observe(section);
})();

// ── Bureau : carrousel 3D ──
(function () {
  const carousel = document.getElementById('bcCarousel');
  const dotsEl   = document.getElementById('bcDots');
  if (!carousel) return;

  const cards = [...carousel.querySelectorAll('.bc-card')];
  const total = cards.length;
  let active = 2; // center card by default

  function render() {
    cards.forEach((card, i) => {
      let offset = i - active;
      if (offset < -Math.floor(total / 2)) offset += total;
      if (offset >  Math.floor(total / 2)) offset -= total;
      card.setAttribute('data-offset', offset);
    });
    if (dotsEl) {
      [...dotsEl.querySelectorAll('.bc-dot')].forEach((dot, i) => {
        dot.classList.toggle('active', i === active);
      });
    }
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => { active = i; render(); });
  });

  if (dotsEl) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'bc-dot';
      dot.setAttribute('aria-label', `Membre ${i + 1}`);
      dot.addEventListener('click', () => { active = i; render(); });
      dotsEl.appendChild(dot);
    });
  }

  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { active = (active + (dx < 0 ? 1 : -1) + total) % total; render(); }
  }, { passive: true });

  render();
})();

// ── Filtre archives photos ──
(function () {
  const btns   = document.querySelectorAll('.af-btn');
  const photos = document.querySelectorAll('.archive-photo');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      photos.forEach(photo => {
        if (filter === 'all' || photo.dataset.cat === filter) {
          photo.classList.remove('hidden');
        } else {
          photo.classList.add('hidden');
        }
      });
    });
  });
})();


// ════════════════════════════════════════════
// LANGUE — FR / MG / EN
// ════════════════════════════════════════════
(function () {
  const LANG_KEY = 'fjkm-lang';

  const btnFR = document.getElementById('btnFR');
  const btnMG = document.getElementById('btnMG');
  const btnEN = document.getElementById('btnEN');

  function applyLang(lang, save) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);

    [btnFR, btnMG, btnEN].forEach(b => b && b.classList.remove('active'));
    const active = { fr: btnFR, mg: btnMG, en: btnEN }[lang];
    if (active) active.classList.add('active');

    document.querySelectorAll('[data-fr]').forEach(el => {
      const text = el.getAttribute('data-' + lang) || el.getAttribute('data-fr');
      if (el.children.length === 0) el.textContent = text;
    });

    if (save) localStorage.setItem(LANG_KEY, lang);
  }

  btnFR && btnFR.addEventListener('click', () => applyLang('fr', true));
  btnMG && btnMG.addEventListener('click', () => applyLang('mg', true));
  btnEN && btnEN.addEventListener('click', () => applyLang('en', true));

  applyLang(localStorage.getItem(LANG_KEY) || 'fr', false);
})();


// ════════════════════════════════════════════
// THÈME — Jour / Nuit
// ════════════════════════════════════════════
(function () {
  const THEME_KEY = 'fjkm-theme';

  const btnDay   = document.getElementById('btnDay');
  const btnNight = document.getElementById('btnNight');

  function applyTheme(theme, save) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    btnDay   && btnDay.classList.toggle('active',  !isDark);
    btnNight && btnNight.classList.toggle('active',  isDark);
    if (save) localStorage.setItem(THEME_KEY, theme);
  }

  btnDay   && btnDay.addEventListener('click',   () => applyTheme('light', true));
  btnNight && btnNight.addEventListener('click', () => applyTheme('dark',  true));

  const saved    = localStorage.getItem(THEME_KEY);
  const prefDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefDark ? 'dark' : 'light'), false);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light', false);
  });
})();

document.querySelectorAll('.copyright-year').forEach(e => e.textContent = new Date().getFullYear());
