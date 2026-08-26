/* ═══════════════════════════════════════════════════
   BARRE DE NAVIGATION MOBILE
   Injecte la pastille flottante du bas sur chaque page.
   À charger AVANT le JS de la page : applyLang() lit le
   DOM au moment de l'appel, donc les libellés injectés
   ici sont traduits automatiquement.
   ═══════════════════════════════════════════════════ */
(function () {
  var inPages = /\/pages\//i.test(location.pathname);
  var root    = inPages ? '../' : '';
  var pages   = inPages ? ''    : 'pages/';

  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!file) file = 'index.html';

  /* Les pages de sampana gardent l'onglet « Sections » actif */
  var SECTION_PAGES = [
    'sections.html', 'safif.html', 'stk.html', 'slk.html',
    'sampaty.html', 'sekoly-alahady.html', 'vfl.html',
    'dorkasy.html', 'bureau.html'
  ];

  var current =
    file === 'notre-eglise.html'      ? 'eglise'   :
    file === 'toerana.html'           ? 'toerana'  :
    file === 'contact.html'           ? 'contact'  :
    SECTION_PAGES.indexOf(file) > -1  ? 'sections' :
    file === 'index.html'             ? 'home'     : '';

  var items = [
    {
      key: 'home', href: root + 'index.html',
      fr: 'Accueil', en: 'Home', mg: 'Fandraisana',
      icon: '<path d="M3 10.5 12 3l9 7.5"/>' +
            '<path d="M5.5 9.6V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.6"/>'
    },
    {
      key: 'eglise', href: pages + 'notre-eglise.html',
      fr: 'Notre Église', en: 'Our Church', mg: 'Fiangonana',
      icon: '<path d="M12 2v5"/><path d="M9.5 4.5h5"/>' +
            '<path d="M12 7 5 12v9h14v-9z"/><path d="M10 21v-5h4v5"/>'
    },
    {
      key: 'sections', href: pages + 'sections.html',
      fr: 'Sections', en: 'Groups', mg: 'Sampana',
      icon: '<path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/>' +
            '<circle cx="9" cy="7.5" r="3.5"/>' +
            '<path d="M22 20v-1.5a4 4 0 0 0-3-3.87"/>' +
            '<path d="M16.5 4.13a4 4 0 0 1 0 7.75"/>'
    },
    {
      key: 'toerana', href: pages + 'toerana.html',
      fr: 'Lieu de Culte', en: 'Worship Place', mg: 'Toerana Fivavahana',
      icon: '<path d="M20 10.5c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z"/>' +
            '<circle cx="12" cy="10.3" r="3"/>'
    },
    {
      key: 'contact', href: pages + 'contact.html',
      fr: 'Contact', en: 'Contact', mg: 'Fifandraisana',
      icon: '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/>' +
            '<path d="m3.5 6.5 7.35 5.2a2 2 0 0 0 2.3 0l7.35-5.2"/>'
    }
  ];

  function mount() {
    if (document.getElementById('mnav')) return;

    var nav = document.createElement('nav');
    nav.className = 'mnav';
    nav.id = 'mnav';
    nav.setAttribute('aria-label', 'Navigation principale');

    var bar = document.createElement('div');
    bar.className = 'mnav-bar';

    items.forEach(function (it) {
      var a = document.createElement('a');
      a.className = 'mnav-item' + (it.key === current ? ' active' : '');
      a.href = it.href;
      if (it.key === current) a.setAttribute('aria-current', 'page');

      a.innerHTML =
        '<span class="mnav-pill"></span>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        it.icon + '</svg>';

      /* Le nom accessible vient de ce span — traduit par applyLang() */
      var label = document.createElement('span');
      label.className = 'mnav-label';
      label.setAttribute('data-fr', it.fr);
      label.setAttribute('data-en', it.en);
      label.setAttribute('data-mg', it.mg);
      label.textContent = it.fr;
      a.appendChild(label);

      bar.appendChild(a);
    });

    nav.appendChild(bar);
    document.body.appendChild(nav);

    /* Le JS de la page a pu déjà passer applyLang() : on aligne
       les libellés sur la langue courante. Les changements
       ultérieurs sont pris en charge par applyLang(), qui
       requête le DOM à chaque appel. */
    var lang = document.documentElement.getAttribute('data-lang') || 'fr';
    if (lang !== 'fr') {
      bar.querySelectorAll('.mnav-label').forEach(function (el) {
        el.textContent = el.getAttribute('data-' + lang) || el.getAttribute('data-fr');
      });
    }
  }

  /* ── Réglages langue & thème repliés ──
     Les deux panneaux flottaient en bas à droite en
     permanence et recouvraient le texte. On les rattache à un
     bouton placé dans la nav, là où était le hamburger.
     Les pages légales n'ont ni #navbar ni #floatingControls :
     la fonction s'y arrête d'elle-même. */
  function mountSettings() {
    var fc = document.getElementById('floatingControls');
    var navbar = document.getElementById('navbar');
    if (!fc || !navbar || document.getElementById('msetToggle')) return;

    var btn = document.createElement('button');
    btn.id = 'msetToggle';
    btn.className = 'mset-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-controls', 'floatingControls');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Langue et thème');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="21" y1="8" x2="12" y2="8"/><line x1="7" y1="8" x2="3" y2="8"/>' +
      '<line x1="21" y1="16" x2="16" y2="16"/><line x1="11" y1="16" x2="3" y2="16"/>' +
      '<circle cx="9.5" cy="8" r="2.3"/><circle cx="13.5" cy="16" r="2.3"/></svg>';

    navbar.appendChild(btn);

    function close() {
      fc.classList.remove('mset-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = fc.classList.toggle('mset-open');
      btn.setAttribute('aria-expanded', String(open));
    });
    /* Referme au clic à l'extérieur, à l'Échap, et après un choix */
    document.addEventListener('click', function (e) {
      if (fc.classList.contains('mset-open') &&
          !fc.contains(e.target) && !btn.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    fc.addEventListener('click', function (e) {
      if (e.target.closest('button')) setTimeout(close, 260);
    });
  }

  function init() { mount(); mountSettings(); }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
