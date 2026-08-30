// =========================================
// FJKM Wagner – Composants de page
// =========================================
// Injecte la barre de navigation et le pied de page depuis
// une définition unique. Avant, ces deux blocs étaient
// recopiés dans 14 fichiers : 1006 lignes, et toute
// correction devait être faite 14 fois — c'est ainsi que la
// nav de toerana.html avait fini avec de mauvais liens.
//
// Les pages gardent les coquilles <nav id="navbar"> et
// <footer id="footer"> vides : le CSS s'applique donc sans
// attendre le JS, et il n'y a pas de saut de mise en page.
//
// À charger EN PREMIER : chrome.js et mobile-nav.js
// interrogent #navbar et .nav-links au démarrage.
// =========================================
(function () {
  'use strict';

  var inPages = /\/pages\//i.test(location.pathname);
  var root    = inPages ? '../' : '';
  var pages   = inPages ? ''    : 'pages/';
  var file    = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!file) file = 'index.html';

  // ═══ Données du site — la seule place à éditer ═══

  var CONTACT = {
    tel:   '(+33) 6.70.56.66.96',
    rue:   '7 bis Rue Pasteur Wagner',
    ville: '75011 Paris',
    email: 'yvesraholiarison@gmail.com'
  };

  var SOCIALS = [
    { nom: 'Facebook',  url: 'https://www.facebook.com/fjkmwagnerparis',
      d: 'M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z' },
    { nom: 'Instagram', url: 'https://www.instagram.com/fjkmwagnerparis',
      d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
    { nom: 'YouTube',   url: 'https://www.youtube.com/@fjkmwagnerparis',
      d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' }
  ];

  /* Icônes trait fin, cohérentes avec le reste du site */
  var ICONS = {
    tel:   '<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>',
    lieu:  '<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>',
    email: '<path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>'
  };

  /* Ordre canonique de la navigation. « key » sert à marquer
     l'entrée active selon la page en cours. */
  var NAV = [
    { key: 'home',    href: root + 'index.html',           fr: 'Accueil',       en: 'Home',          mg: 'Fandraisana' },
    { key: 'eglise',  href: pages + 'notre-eglise.html',   fr: 'Notre Église',  en: 'Our Church',    mg: 'Fiangonana' },
    { key: 'perikopa',href: root + 'index.html#perikopa',  fr: 'Pain du Jour',  en: 'Daily Bread',   mg: "Mofo isan'andro" },
    { key: 'sections',href: pages + 'sections.html',       fr: 'Section',       en: 'Groups',        mg: 'Sampana' },
    { key: 'toerana', href: pages + 'toerana.html',        fr: 'Lieu de Culte', en: 'Worship Place', mg: 'Toerana Fivavahana' },
    { key: 'contact', href: pages + 'contact.html',        fr: 'Contact',       en: 'Contact',       mg: 'Fifandraisana', cta: true }
  ];

  var HORAIRES = [
    { fr: 'Culte du dimanche — 10h00',      en: 'Sunday service — 10:00 AM',     mg: 'Fanompoam-pivavahana Alahady — 10ora' },
    { fr: 'Étude biblique — Mercredi 19h',  en: 'Bible study — Wednesday 7 PM',  mg: 'Fianarana Baiboly — Alarobia 19ora' },
    { fr: 'Répétition chorale — Samedi',    en: 'Choir rehearsal — Saturday',    mg: 'Fiakanana hira — Asabotsy' },
    { fr: 'Groupe de prière — Vendredi',    en: 'Prayer group — Friday',         mg: "Vondron'ny vavaka — Zoma" }
  ];

  var SECTION_PAGES = ['sections.html','safif.html','stk.html','slk.html',
                       'sampaty.html','sekoly-alahady.html','vfl.html','dorkasy.html'];

  var current =
    file === 'notre-eglise.html'     ? 'eglise'   :
    file === 'toerana.html'          ? 'toerana'  :
    file === 'contact.html'          ? 'contact'  :
    SECTION_PAGES.indexOf(file) > -1 ? 'sections' :
    file === 'index.html'            ? 'home'     : '';

  // ═══ Fabrication du balisage ═══

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Les attributs data-* sont lus par applyLang() de chrome.js */
  function i18n(o) {
    return 'data-fr="' + esc(o.fr) + '" data-en="' + esc(o.en) +
           '" data-mg="' + esc(o.mg) + '"';
  }

  function logo(href) {
    return '<a href="' + href + '" class="logo">' +
      '<div class="logo-mark">F</div>' +
      '<div class="logo-text"><span>FJKM Wagner</span><span>Finoana Paris</span></div></a>';
  }

  function navbar() {
    var links = NAV.map(function (n) {
      var cls = [];
      if (n.cta) cls.push('nav-cta');
      if (n.key === current) cls.push('nav-active');
      return '<li><a href="' + n.href + '"' +
             (cls.length ? ' class="' + cls.join(' ') + '"' : '') +
             ' ' + i18n(n) + '>' + esc(n.fr) + '</a></li>';
    }).join('');

    return logo(root + 'index.html') +
      '<ul class="nav-links">' + links + '</ul>' +
      '<button class="hamburger" id="hamburger" aria-label="Menu">' +
      '<span></span><span></span><span></span></button>';
  }

  function contactItem(icon, texte) {
    return '<div class="footer-contact-item">' +
      '<div class="footer-contact-icon"><svg width="16" height="16" fill="none" ' +
      'stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">' + icon + '</svg></div>' +
      '<div class="footer-contact-text">' + texte + '</div></div>';
  }

  function footer() {
    var desc = { fr: "Communauté chrétienne malgache à Paris, unie dans la foi, l'amour et l'espérance depuis de nombreuses années.",
                 en: 'Malagasy Christian community in Paris, united in faith, love, and hope for many years.',
                 mg: "Fiangonana kristiana Malagasy ao Paris, miray amin'ny finoana, fitiavana ary fanantenana nandritra ny taona maro." };
    var droits = { fr: '© 2026 — Tous droits réservés', en: '© 2026 — All rights reserved', mg: '© 2026 — Zo rehetra voatokana' };

    var socials = SOCIALS.map(function (s) {
      return '<a href="' + s.url + '" class="social-link" aria-label="' + s.nom + '"' +
        ' target="_blank" rel="noopener noreferrer">' +
        '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">' +
        '<path d="' + s.d + '"/></svg></a>';
    }).join('');

    /* Liens rapides : mêmes destinations que la nav, sans l'accueil */
    var rapides = NAV.slice(1).map(function (n) {
      return '<li><a href="' + n.href + '" ' + i18n(n) + '>' + esc(n.fr) + '</a></li>';
    }).join('');

    var horaires = HORAIRES.map(function (h) {
      return '<li><a href="#" ' + i18n(h) + '>' + esc(h.fr) + '</a></li>';
    }).join('');

    return '<div class="footer-grid">' +
      '<div class="footer-brand">' +
        '<div class="logo" style="margin-bottom:24px">' +
          '<div class="logo-mark">F</div>' +
          '<div class="logo-text"><span>FJKM Wagner</span><span>Finoana Paris</span></div></div>' +
        '<p><span ' + i18n(desc) + '>' + esc(desc.fr) + '</span></p>' +
        '<p style="margin-top:8px" ' + i18n(droits) + '>© <span class="copyright-year">2026</span> — Tous droits réservés</p>' +
        '<div class="social-links" style="margin-top:24px">' + socials + '</div>' +
      '</div>' +
      '<div><div class="footer-heading" data-fr="Liens rapides" data-en="Quick Links" data-mg="Rohy haingana">Liens rapides</div>' +
        '<ul class="footer-links">' + rapides + '</ul></div>' +
      '<div><div class="footer-heading" data-fr="Contact" data-en="Contact" data-mg="Fifandraisana">Contact</div>' +
        contactItem(ICONS.tel, esc(CONTACT.tel)) +
        contactItem(ICONS.lieu, esc(CONTACT.rue) + '<br>' + esc(CONTACT.ville)) +
        contactItem(ICONS.email, esc(CONTACT.email)) +
      '</div>' +
      '<div><div class="footer-heading" data-fr="Horaires" data-en="Schedule" data-mg="Fotoana">Horaires</div>' +
        '<ul class="footer-links">' + horaires + '</ul></div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<p data-fr="Développé avec ❤️ pour la communauté FJKM Wagner Paris" ' +
      'data-en="Made with ❤️ for the FJKM Wagner Paris community" ' +
      'data-mg="Natao tamin\'ny ❤️ ho an\'ny Fiangonana FJKM Wagner Paris">' +
      'Développé avec ❤️ pour la communauté FJKM Wagner Paris</p>' +
      '<div class="footer-bottom-links">' +
        '<a href="' + pages + 'politique-utilisation.html" data-fr="Politique d\'utilisation" data-en="Terms of Use" data-mg="Fitsipika fampiasana">Politique d\'utilisation</a>' +
        '<a href="' + pages + 'mentions-legales.html" data-fr="Mentions légales" data-en="Legal Notice" data-mg="Filazana ara-dalàna">Mentions légales</a>' +
      '</div>' +
    '</div>';
  }

  // ═══ Injection ═══
  // Uniquement dans les coquilles vides : une page qui garde
  // son balisage propre (toerana, pages légales) est intacte.

  function fill(el, html) {
    if (el && !el.children.length) el.innerHTML = html;
  }

  fill(document.getElementById('navbar'), navbar());
  fill(document.getElementById('footer'), footer());
})();
