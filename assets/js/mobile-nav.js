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

  /* ═══ Sampana ═══
     Source unique pour le menu déroulant desktop et la
     feuille mobile. Les libellés reprennent ceux des
     cartes de sections.html, dans le même ordre. */
  var SAMPANA_HREF = pages + 'sections.html';

  var SAMPANA = [
    { href: pages + 'safif.html',          acr: 'SAFIF',
      fr: 'Réveil Spirituel',        en: 'Spiritual Revival',      mg: 'Fifohazana' },
    { href: pages + 'stk.html',            acr: 'STK',
      fr: 'Jeunesse Chrétienne',     en: 'Christian Youth',        mg: 'Tanora Kristiana' },
    { href: pages + 'slk.html',            acr: 'SLK',
      fr: 'Hommes Chrétiens',        en: 'Christian Men',          mg: 'Lehilahy Kristiana' },
    { href: pages + 'sampaty.html',        acr: 'SAMPATY',
      fr: 'Scoutisme FJKM',          en: 'FJKM Scouting',          mg: 'Mpanazava sy Tily' },
    { href: pages + 'sekoly-alahady.html', acr: 'SEKOLY',
      fr: 'École du Dimanche',       en: 'Sunday School',          mg: 'Sekoly Alahady' },
    { href: pages + 'vfl.html',            acr: 'VFL',
      fr: 'Groupe des Laïcs',        en: 'Lay Foundation Group',   mg: 'Fototra Laika' },
    { href: pages + 'dorkasy.html',        acr: 'DORKASY',
      fr: 'Entraide & Action Sociale', en: 'Charity & Social Action', mg: 'Asa Fiantrana' }
  ];

  /* Feuille de traduction : sans enfant, donc applyLang()
     la reprend telle quelle aux changements de langue. */
  function langSpan(cls, it) {
    var s = document.createElement('span');
    s.className = cls;
    s.setAttribute('data-fr', it.fr);
    s.setAttribute('data-en', it.en);
    s.setAttribute('data-mg', it.mg);
    s.textContent = it.fr;
    return s;
  }

  /* applyLang() a déjà tourné quand ce script s'exécute :
     on aligne ce qu'on vient d'injecter sur la langue en cours. */
  function syncLang(scope) {
    var lang = document.documentElement.getAttribute('data-lang') || 'fr';
    if (lang === 'fr') return;
    scope.querySelectorAll('[data-fr]').forEach(function (el) {
      if (el.children.length === 0) {
        el.textContent = el.getAttribute('data-' + lang) || el.getAttribute('data-fr');
      }
    });
  }

  function sampanaLink(s, itemClass, acrClass, nameClass) {
    var a = document.createElement('a');
    a.className = itemClass;
    a.href = s.href;
    if (s.href.split('/').pop().toLowerCase() === file) {
      a.setAttribute('aria-current', 'page');
    }
    var acr = document.createElement('span');
    acr.className = acrClass;
    acr.textContent = s.acr;
    a.appendChild(acr);
    a.appendChild(langSpan(nameClass, s));
    return a;
  }

  /* Première entrée des deux menus : la page sections elle-même,
     pour qu'un seul geste y mène encore. */
  function allSectionsLink(itemClass, nameClass) {
    var a = document.createElement('a');
    a.className = itemClass + ' ' + itemClass + '-all';
    a.href = SAMPANA_HREF;
    a.appendChild(langSpan(nameClass, {
      fr: 'Toutes les sections', en: 'All groups', mg: 'Ny sampana rehetra'
    }));
    var arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.className = 'nav-sub-arrow';
    arrow.textContent = '→';
    a.appendChild(arrow);
    return a;
  }

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

      /* L'onglet « Sections » ouvre la feuille des sampana
         au lieu de naviguer : la page sections.html reste
         accessible par la première entrée de la feuille. */
      if (it.key === 'sections') {
        a.setAttribute('aria-haspopup', 'dialog');
        a.setAttribute('aria-expanded', 'false');
        a.addEventListener('click', function (e) {
          e.preventDefault();
          openSheet(a);
        });
      }

      bar.appendChild(a);
    });

    nav.appendChild(bar);
    document.body.appendChild(nav);

    syncLang(bar);
  }

  /* ── Mobile : feuille des sampana au-dessus de la barre ── */
  var sheet = null;
  var sheetOpener = null;

  function buildSheet() {
    if (sheet) return sheet;

    sheet = document.createElement('div');
    sheet.className = 'mnav-sheet';
    sheet.id = 'mnavSheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Sampana');

    var back = document.createElement('div');
    back.className = 'mnav-sheet-backdrop';
    back.addEventListener('click', closeSheet);

    var panel = document.createElement('div');
    panel.className = 'mnav-sheet-panel';

    var grip = document.createElement('span');
    grip.className = 'mnav-sheet-grip';
    grip.setAttribute('aria-hidden', 'true');
    panel.appendChild(grip);

    var title = document.createElement('div');
    title.className = 'mnav-sheet-title';
    title.setAttribute('data-fr', 'Sections');
    title.setAttribute('data-en', 'Groups');
    title.setAttribute('data-mg', 'Sampana');
    title.textContent = 'Sections';
    panel.appendChild(title);

    panel.appendChild(allSectionsLink('mnav-sheet-item', 'mnav-sheet-name'));
    SAMPANA.forEach(function (s) {
      panel.appendChild(
        sampanaLink(s, 'mnav-sheet-item', 'mnav-sheet-acr', 'mnav-sheet-name'));
    });

    sheet.appendChild(back);
    sheet.appendChild(panel);
    document.body.appendChild(sheet);
    syncLang(sheet);

    /* Échap attaché ici, pas dans mountDesktopMenu() : celui-ci
       sort tôt sur les pages légales (pas de .nav-links), où la
       feuille peut pourtant s'ouvrir. Sans ça elle n'y était
       fermable qu'au clic sur le fond. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSheet();
    });

    return sheet;
  }

  function openSheet(opener) {
    var el = buildSheet();
    sheetOpener = opener || null;

    var done = false;
    function reveal() {
      if (done) return;
      done = true;
      /* Verrou et ouverture ensemble : posé avant, le verrou
         restait seul si rAF ne tournait pas — page bloquée en
         défilement, sans feuille visible ni moyen de fermer. */
      document.body.classList.add('mnav-sheet-lock');
      el.classList.add('open');
      if (sheetOpener) sheetOpener.setAttribute('aria-expanded', 'true');
      var first = el.querySelector('.mnav-sheet-item');
      if (first) first.focus();
    }

    /* Deux frames : la transition part bien de l'état fermé.
       Minuteur de secours si rAF est gelé (onglet en arrière-plan). */
    requestAnimationFrame(function () { requestAnimationFrame(reveal); });
    setTimeout(reveal, 120);
  }

  function closeSheet() {
    if (!sheet || !sheet.classList.contains('open')) return;
    sheet.classList.remove('open');
    document.body.classList.remove('mnav-sheet-lock');
    if (sheetOpener) {
      sheetOpener.setAttribute('aria-expanded', 'false');
      sheetOpener.focus();
      sheetOpener = null;
    }
  }

  /* ── Desktop : « Section » devient un menu déroulant ── */
  function mountDesktopMenu() {
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks || document.getElementById('navSampana')) return;

    var trigger = null;
    var anchors = navLinks.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      if (/sections\.html/i.test(anchors[i].getAttribute('href') || '')) {
        trigger = anchors[i];
        break;
      }
    }
    /* Les pages légales n'ont pas ce lien : rien à faire. */
    if (!trigger || trigger.parentNode.tagName !== 'LI') return;

    var li = trigger.parentNode;
    li.classList.add('nav-has-sub');

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-sub-toggle';
    toggle.setAttribute('aria-controls', 'navSampana');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Sampana');
    toggle.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="m6 9 6 6 6-6"/></svg>';
    li.appendChild(toggle);

    var sub = document.createElement('ul');
    sub.className = 'nav-sub';
    sub.id = 'navSampana';

    function row(node) {
      var wrap = document.createElement('li');
      wrap.appendChild(node);
      sub.appendChild(wrap);
    }
    row(allSectionsLink('nav-sub-item', 'nav-sub-name'));
    SAMPANA.forEach(function (s) {
      row(sampanaLink(s, 'nav-sub-item', 'nav-sub-acr', 'nav-sub-name'));
    });

    li.appendChild(sub);
    syncLang(sub);

    function closeMenu() {
      li.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = li.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    li.addEventListener('mouseleave', closeMenu);
    document.addEventListener('click', function (e) {
      if (li.classList.contains('open') && !li.contains(e.target)) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeMenu();
      closeSheet();
    });
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

  function init() { mount(); mountSettings(); mountDesktopMenu(); }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
