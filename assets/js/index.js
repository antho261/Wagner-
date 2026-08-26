// =========================================
// FJKM Wagner – Finoana Paris
// Script — index.html
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
const reveals  = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(el => revealObs.observe(el));


// ════════════════════════════════════════════
// LANGUE — FR / MG / EN  (choix manuel)
// ════════════════════════════════════════════
(function () {
  const LANG_KEY = 'fjkm-lang';

  const btnFR = document.getElementById('btnFR');
  const btnMG = document.getElementById('btnMG');
  const btnEN = document.getElementById('btnEN');

  // Titres composés (innerHTML avec <br> et <em>)
  const richTitles = {
    hero: {
      fr: 'Bienvenue au<br>sein de l\'<em>FJKM</em><br><strong>Wagner Paris</strong>',
      mg: 'Tongasoa eto<br>amin\'ny <em>FJKM</em><br><strong>Wagner Paris</strong>',
      en: 'Welcome to<br><em>FJKM</em><br><strong>Wagner Paris</strong>',
    },
    community: {
      fr: 'Notre<br><em>communauté</em>',
      mg: 'Ny<br><em>Fiangonana</em>',
      en: 'Our<br><em>Community</em>',
    },
    calendar: {
      fr: 'Calendrier<br><em>liturgique</em>',
      mg: 'Perikopa<br><em>sy Litorjia</em>',
      en: 'Liturgical<br><em>Calendar</em>',
    },
    gallery: {
      fr: 'Vaovao<br><em>Mpegonana</em>',
      mg: 'Vaovao<br><em>Mpegonana</em>',
      en: 'Church<br><em>News</em>',
    },
    sections: {
      fr: 'Vaovao<br><em>Sampana</em>',
      mg: 'Vaovao<br><em>Sampana</em>',
      en: 'Groups<br><em>News</em>',
    },
  };

  function applyLang(lang, save) {
    // html lang attr
    const htmlLangMap = { fr: 'fr', mg: 'mg', en: 'en' };
    document.documentElement.setAttribute('lang', htmlLangMap[lang]);
    document.documentElement.setAttribute('data-lang', lang);

    // Boutons actifs
    [btnFR, btnMG, btnEN].forEach(b => b && b.classList.remove('active'));
    const active = { fr: btnFR, mg: btnMG, en: btnEN }[lang];
    if (active) active.classList.add('active');

    // Traduire tous les éléments [data-fr]
    document.querySelectorAll('[data-fr]').forEach(el => {
      const attrKey = 'data-' + lang;
      const text = el.getAttribute(attrKey) || el.getAttribute('data-fr');
      if (el.children.length === 0) el.textContent = text;
    });

    // Titres riches (innerHTML)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.innerHTML = richTitles.hero[lang];

    const communityH = document.querySelector('#features .section-heading');
    if (communityH) communityH.innerHTML = richTitles.community[lang];

    const calendarH = document.querySelector('#perikopa .section-heading');
    if (calendarH) calendarH.innerHTML = richTitles.calendar[lang];

    const galleryH = document.querySelector('#gallery .section-heading');
    if (galleryH) galleryH.innerHTML = richTitles.gallery[lang];

    const sectionsH = document.querySelector('#sections-news .section-heading');
    if (sectionsH) sectionsH.innerHTML = richTitles.sections[lang];

    if (save) localStorage.setItem(LANG_KEY, lang);
  }

  btnFR && btnFR.addEventListener('click', () => applyLang('fr', true));
  btnMG && btnMG.addEventListener('click', () => applyLang('mg', true));
  btnEN && btnEN.addEventListener('click', () => applyLang('en', true));

  // Init : saved ou FR par défaut
  applyLang(localStorage.getItem(LANG_KEY) || 'fr', false);
})();


// ════════════════════════════════════════════
// THÈME — Jour / Nuit  (choix manuel)
// ════════════════════════════════════════════
(function () {
  const THEME_KEY = 'fjkm-theme';

  const btnDay   = document.getElementById('btnDay');
  const btnNight = document.getElementById('btnNight');

  function applyTheme(theme, save) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);

    btnDay   && btnDay.classList.toggle('active',   !isDark);
    btnNight && btnNight.classList.toggle('active',  isDark);

    if (save) localStorage.setItem(THEME_KEY, theme);
  }

  btnDay   && btnDay.addEventListener('click',   () => applyTheme('light', true));
  btnNight && btnNight.addEventListener('click', () => applyTheme('dark',  true));

  // Init : saved ou détection système, ou 'light' par défaut
  const saved    = localStorage.getItem(THEME_KEY);
  const prefDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefDark ? 'dark' : 'light'), false);

  // Suivre les changements système si pas de préférence sauvegardée
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light', false);
  });
})();

document.querySelectorAll('.copyright-year').forEach(e => e.textContent = new Date().getFullYear());
