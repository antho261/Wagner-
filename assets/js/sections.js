// =========================================
// FJKM Wagner – Pages Sections (Sampana)
// =========================================

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backtotop').classList.toggle('show', window.scrollY > 400);
});

// ── Mobile menu ──
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
hamburger.addEventListener('click',   () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ── Scroll reveal ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Langue FR / MG / EN ──
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

// ── Thème Jour / Nuit ──
(function () {
  const THEME_KEY = 'fjkm-theme';
  const btnDay   = document.getElementById('btnDay');
  const btnNight = document.getElementById('btnNight');

  function applyTheme(theme, save) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    btnDay   && btnDay.classList.toggle('active', !isDark);
    btnNight && btnNight.classList.toggle('active', isDark);
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
