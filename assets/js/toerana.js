// =========================================
// FJKM Wagner – Toerana (Lieu de Culte)
// Script — pages/toerana.html
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
const reveals   = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
reveals.forEach(el => revealObs.observe(el));


// ════════════════════════════════════════════
// LANGUE — FR / MG / EN
// ════════════════════════════════════════════
(function () {
  const LANG_KEY = 'fjkm-lang';

  const btnFR = document.getElementById('btnFR');
  const btnMG = document.getElementById('btnMG');
  const btnEN = document.getElementById('btnEN');

  // Titres riches spécifiques à cette page
  const richTitles = {
    heroSub: { fr: 'Bienvenue au', mg: "Tongasoa ao amin'ny", en: 'Welcome to' },
    heroEm:  { fr: 'Toerana',     mg: 'Toerana',             en: 'Toerana'    },
    prochain: {
      fr: 'Prochain<br><em>Lieu de Culte</em>',
      mg: "Ho avy<br><em>Toerana Fivavahana</em>",
      en: 'Upcoming<br><em>Worship Place</em>',
    },
    atmosphere: {
      fr: "Un lieu de <em>paix</em> &amp; de foi",
      mg: "Toerana <em>fiadanana</em> &amp; finoana",
      en: "A place of <em>peace</em> &amp; faith",
    },
  };

  function applyLang(lang, save) {
    const htmlLang = { fr: 'fr', mg: 'mg', en: 'en' };
    document.documentElement.setAttribute('lang', htmlLang[lang]);
    document.documentElement.setAttribute('data-lang', lang);

    // Boutons actifs
    [btnFR, btnMG, btnEN].forEach(b => b && b.classList.remove('active'));
    const active = { fr: btnFR, mg: btnMG, en: btnEN }[lang];
    if (active) active.classList.add('active');

    // Traduire tous les [data-fr]
    document.querySelectorAll('[data-fr]').forEach(el => {
      const text = el.getAttribute('data-' + lang) || el.getAttribute('data-fr');
      if (el.children.length === 0) el.textContent = text;
    });

    // Titres riches
    const heroSub = document.querySelector('.hero-title-sub');
    if (heroSub) heroSub.textContent = richTitles.heroSub[lang];

    const heroEm = document.querySelector('.hero-title em');
    if (heroEm) heroEm.textContent = richTitles.heroEm[lang];

    const prochainH = document.querySelector('#prochains-cultes .section-heading');
    if (prochainH) prochainH.innerHTML = richTitles.prochain[lang];

    const atmoH = document.querySelector('#atmosphere .section-heading');
    if (atmoH) atmoH.innerHTML = richTitles.atmosphere[lang];

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
