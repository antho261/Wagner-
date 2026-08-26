// =========================================
// FJKM Wagner – Finoana Paris
// Chrome de page : langue, thème, nav, reveal.
//
// Interface : inclure ce script. Rien d'autre.
// Aucune configuration, aucun appel. Tout est piloté
// par le HTML (attributs data-*) et le localStorage.
//
// Remplace le bloc identique qui était recopié dans
// index.js, contact.js, notre-eglise.js, sections.js
// et toerana.js.
// =========================================
(function () {
  'use strict';

  var LANG_KEY  = 'fjkm-lang';
  var THEME_KEY = 'fjkm-theme';

  // ── Nav : ombre au défilement + bouton haut de page ──
  var navbar = document.getElementById('navbar');
  var backtotop = document.getElementById('backtotop');
  if (navbar || backtotop) {
    window.addEventListener('scroll', function () {
      if (navbar)    navbar.classList.toggle('scrolled', window.scrollY > 60);
      if (backtotop) backtotop.classList.toggle('show', window.scrollY > 400);
    });
  }

  // ── Menu mobile (hérité) ──
  // La barre du bas l'a remplacé et mobile-nav.css le masque
  // à toutes les tailles. On garde le câblage — inoffensif —
  // et closeMobile(), encore référencé par des onclick inline.
  var hamburger   = document.getElementById('hamburger');
  var mobileMenu  = document.getElementById('mobileMenu');
  var mobileClose = document.getElementById('mobileClose');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () { mobileMenu.classList.add('open'); });
  }
  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', function () { mobileMenu.classList.remove('open'); });
  }
  window.closeMobile = function () {
    if (mobileMenu) mobileMenu.classList.remove('open');
  };

  // ── Apparition au défilement ──
  // Deux conventions coexistent : .reveal sur la plupart des
  // pages, .section-block sur les pages légales. Les deux
  // démarrent à opacity:0 — sans observateur, la page reste
  // blanche. On couvre donc les deux ici.
  var reveals = document.querySelectorAll('.reveal, .section-block');
  if (reveals.length && 'IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  // ── Langue : FR / MG / EN ──
  var btnFR = document.getElementById('btnFR');
  var btnMG = document.getElementById('btnMG');
  var btnEN = document.getElementById('btnEN');

  function applyLang(lang, save) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);

    [btnFR, btnMG, btnEN].forEach(function (b) { b && b.classList.remove('active'); });
    var active = { fr: btnFR, mg: btnMG, en: btnEN }[lang];
    if (active) active.classList.add('active');

    // 1) Titres porteurs de balisage (<br>, <em>…) : innerHTML.
    //    Traités en premier : ils créent des enfants que la
    //    passe texte ci-dessous doit ensuite pouvoir voir.
    document.querySelectorAll('[data-fr-html]').forEach(function (el) {
      el.innerHTML = el.getAttribute('data-' + lang + '-html') ||
                     el.getAttribute('data-fr-html');
    });

    // 2) Texte simple. Le garde sur children.length empêche
    //    d'écraser le balisage d'un parent traduit en 1).
    document.querySelectorAll('[data-fr]').forEach(function (el) {
      if (el.children.length === 0) {
        el.textContent = el.getAttribute('data-' + lang) ||
                         el.getAttribute('data-fr');
      }
    });

    if (save) localStorage.setItem(LANG_KEY, lang);
  }

  btnFR && btnFR.addEventListener('click', function () { applyLang('fr', true); });
  btnMG && btnMG.addEventListener('click', function () { applyLang('mg', true); });
  btnEN && btnEN.addEventListener('click', function () { applyLang('en', true); });

  applyLang(localStorage.getItem(LANG_KEY) || 'fr', false);

  // ── Thème : jour / nuit ──
  var btnDay   = document.getElementById('btnDay');
  var btnNight = document.getElementById('btnNight');

  function applyTheme(theme, save) {
    var isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    btnDay   && btnDay.classList.toggle('active', !isDark);
    btnNight && btnNight.classList.toggle('active', isDark);
    if (save) localStorage.setItem(THEME_KEY, theme);
  }

  btnDay   && btnDay.addEventListener('click',   function () { applyTheme('light', true); });
  btnNight && btnNight.addEventListener('click', function () { applyTheme('dark',  true); });

  var savedTheme = localStorage.getItem(THEME_KEY);
  var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(savedTheme || (mq && mq.matches ? 'dark' : 'light'), false);

  // Suivre le réglage système tant que rien n'a été choisi
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light', false);
    });
  }

  // ── Année du copyright ──
  document.querySelectorAll('.copyright-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
