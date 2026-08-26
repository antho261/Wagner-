// =========================================
// FJKM Wagner – Logique du panneau d'administration
// =========================================

var auth, db, storage;
var currentPhotoKey = null;
var currentFile = null;
var toastTimer = null;

// ── Définition de toutes les photos du site ──────────────
var PHOTO_SECTIONS = [
  {
    title: "Page d'accueil",
    icon: "🏠",
    slots: [
      { key: "accueil-hero",      label: "Photo héro (bannière principale)" },
      { key: "accueil-evenement", label: "Photo événement (concert / hetsika)" },
      { key: "accueil-galerie-1", label: "Galerie — Photo 1" },
      { key: "accueil-galerie-2", label: "Galerie — Photo 2" },
      { key: "accueil-galerie-3", label: "Galerie — Photo 3" },
      { key: "accueil-galerie-4", label: "Galerie — Photo 4" },
      { key: "accueil-galerie-5", label: "Galerie — Photo 5" },
      { key: "accueil-section-1", label: "Carte Sermons / Prédications" },
      { key: "accueil-section-2", label: "Carte Jeunesse" },
      { key: "accueil-section-3", label: "Carte Femmes (Reny Kristiana)" },
      { key: "accueil-section-4", label: "Carte Chorale & Louange" }
    ]
  },
  {
    title: "Notre Église",
    icon: "⛪",
    slots: [
      { key: "eglise-hero",       label: "Photo héro" },
      { key: "eglise-histoire-1", label: "Histoire — Époque 1 (Origines)" },
      { key: "eglise-histoire-2", label: "Histoire — Époque 2 (Pasteur Max)" },
      { key: "eglise-histoire-3", label: "Histoire — Époque 3 (FJKM en France)" },
      { key: "eglise-histoire-4", label: "Histoire — Époque 4 (Pasteur Yves)" },
      { key: "eglise-archive-1",  label: "Archive — Culte du dimanche" },
      { key: "eglise-archive-2",  label: "Archive — Événements" },
      { key: "eglise-archive-3",  label: "Archive — Prédications" },
      { key: "eglise-archive-4",  label: "Archive — Chorale & Louange" },
      { key: "eglise-archive-5",  label: "Archive — Groupe jeunesse" },
      { key: "eglise-archive-6",  label: "Archive — Temps de prière" },
      { key: "eglise-archive-7",  label: "Archive — Vie communautaire" },
      { key: "eglise-bureau-1",   label: "Bureau — Pasteur Yves Raholiarson" },
      { key: "eglise-bureau-2",   label: "Bureau — Lanto (Secrétaire)" },
      { key: "eglise-bureau-3",   label: "Bureau — Rakoto Jean (Trésorier)" },
      { key: "eglise-bureau-4",   label: "Bureau — Santos Payne (Pasteur Church)" },
      { key: "eglise-bureau-5",   label: "Bureau — Jean-Pierre (Diacre)" }
    ]
  },
  {
    title: "Sections (Sampana)",
    icon: "👥",
    slots: [
      { key: "sections-hero",    label: "Photo héro (bannière sections)" },
      { key: "sections-safif",   label: "SAFIF — Réveil Spirituel" },
      { key: "sections-stk",     label: "STK — Jeunesse Chrétienne" },
      { key: "sections-slk",     label: "SLK — Hommes Chrétiens" },
      { key: "sections-sampaty", label: "SAMPATY — Scoutisme FJKM" },
      { key: "sections-sekoly",  label: "SEKOLY ALAHADY — École du Dimanche" },
      { key: "sections-vfl",     label: "VFL — Groupe des Laïcs" },
      { key: "sections-dorkasy", label: "DORKASY — Entraide & Action Sociale" }
    ]
  },
  {
    title: "Lieu de Culte (Toerana)",
    icon: "📍",
    slots: [
      { key: "toerana-hero", label: "Photo héro (bannière toerana)" },
      { key: "toerana-lieu", label: "Photo intérieur de l'église" }
    ]
  }
];

// ── Références UI ─────────────────────────────────────────
var $loading    = document.getElementById('loadingScreen');
var $login      = document.getElementById('loginScreen');
var $dash       = document.getElementById('dashboard');
var $modal      = document.getElementById('uploadModal');
var $toast      = document.getElementById('toast');
var $sections   = document.getElementById('photoSections');

var $loginForm  = document.getElementById('loginForm');
var $email      = document.getElementById('emailInput');
var $pass       = document.getElementById('passInput');
var $loginError = document.getElementById('loginError');
var $btnLogin   = document.getElementById('btnLogin');
var $btnLogout  = document.getElementById('btnLogout');

var $fileInput    = document.getElementById('fileInput');
var $dropZone     = document.getElementById('dropZone');
var $previewWrap  = document.getElementById('previewWrap');
var $previewImg   = document.getElementById('previewImg');
var $previewName  = document.getElementById('previewName');
var $progressWrap = document.getElementById('progressWrap');
var $progressBar  = document.getElementById('progressBar');
var $progressLabel= document.getElementById('progressLabel');
var $btnUpload    = document.getElementById('btnUpload');
var $btnCancel    = document.getElementById('btnCancel');
var $modalClose   = document.getElementById('modalClose');
var $modalBackdrop= document.getElementById('modalBackdrop');
var $modalTitle   = document.getElementById('modalTitle');
var $modalKey     = document.getElementById('modalKey');

// ── Toast ─────────────────────────────────────────────────
function showToast(msg, type) {
  $toast.textContent = msg;
  $toast.className = 'show ' + (type || '');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { $toast.className = ''; }, 3500);
}

// ── Initialisation Supabase ───────────────────────────────
function initSupabase() {
  if (typeof supabase === 'undefined') {
    $loading.innerHTML = '<div style="color:#E07070;font-family:sans-serif;text-align:center;padding:40px;max-width:500px;margin:0 auto">' +
      '<p style="font-size:48px;margin-bottom:20px">⚠️</p>' +
      '<p style="font-size:18px;margin-bottom:12px;color:#DDD5C8">SDK Supabase non chargé</p>' +
      '<p style="font-size:14px;color:rgba(221,213,200,.5);line-height:1.6">Vérifiez votre connexion internet.<br>Le SDK se charge depuis cdn.jsdelivr.net.</p>' +
      '</div>';
    return;
  }

  if (!window.FJKM_SB) {
    $loading.innerHTML = '<div style="color:#E07070;font-family:sans-serif;text-align:center;padding:40px;max-width:500px;margin:0 auto">' +
      '<p style="font-size:48px;margin-bottom:20px">🔧</p>' +
      '<p style="font-size:18px;margin-bottom:12px;color:#DDD5C8">Configuration Supabase manquante</p>' +
      '<p style="font-size:14px;color:rgba(221,213,200,.5);line-height:1.6">Ouvrez <code style="background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px">assets/js/supabase-config.js</code><br>et renseignez l\'URL du projet et la clé anon.</p>' +
      '</div>';
    return;
  }

  db = FJKM_SB;

  function route(session) {
    $loading.classList.add('hidden');
    if (session) showDashboard();
    else $login.classList.remove('hidden');
  }

  // Session existante (l'utilisateur revient), puis suivi des changements
  FJKM_SB.auth.getSession().then(function (res) {
    route(res.data ? res.data.session : null);
  });
  FJKM_SB.auth.onAuthStateChange(function (event, session) {
    route(session);
  });
}

// ── Authentification ──────────────────────────────────────
$loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  $loginError.textContent = '';
  $btnLogin.disabled = true;
  $btnLogin.textContent = 'Connexion...';

  FJKM_SB.auth.signInWithPassword({
    email: $email.value.trim(),
    password: $pass.value
  }).then(function (res) {
    if (!res.error) return; // onAuthStateChange ouvre le tableau de bord
    var m = (res.error.message || '').toLowerCase();
    var msg = 'Email ou mot de passe incorrect.';
    if (m.indexOf('rate limit') > -1 || m.indexOf('too many') > -1) msg = 'Trop de tentatives. Réessayez dans quelques minutes.';
    if (m.indexOf('failed to fetch') > -1 || m.indexOf('network') > -1) msg = 'Erreur réseau. Vérifiez votre connexion internet.';
    if (m.indexOf('email not confirmed') > -1) msg = 'Compte non confirmé : validez le lien reçu par email.';
    $loginError.textContent = msg;
    $btnLogin.disabled = false;
    $btnLogin.textContent = 'Se connecter';
  });
});

$btnLogout.addEventListener('click', function () {
  FJKM_SB.auth.signOut();
  $dash.classList.add('hidden');
  $login.classList.remove('hidden');
});

// ── Tableau de bord ───────────────────────────────────────
function showDashboard() {
  $login.classList.add('hidden');
  $dash.classList.remove('hidden');
  buildPhotoGrid();
}

function buildPhotoGrid() {
  $sections.innerHTML = '';

  PHOTO_SECTIONS.forEach(function (section) {
    var secEl = document.createElement('div');
    secEl.className = 'photo-section';

    var html = '<div class="photo-section-header">' +
      '<div class="photo-section-icon">' + section.icon + '</div>' +
      '<div class="photo-section-title">' + section.title + '</div>' +
      '</div><div class="photo-grid">';

    section.slots.forEach(function (slot) {
      var escapedLabel = slot.label.replace(/"/g, '&quot;');
      html += '<div class="photo-card" id="card-' + slot.key + '">' +
        '<div class="photo-placeholder" id="thumb-' + slot.key + '">🖼</div>' +
        '<div class="photo-card-body">' +
        '<div class="photo-card-label">' + slot.label + '</div>' +
        '<div class="photo-card-key">' + slot.key + '</div>' +
        '<button class="btn-change" data-key="' + slot.key + '" data-label="' + escapedLabel + '">Changer la photo</button>' +
        '</div></div>';
    });
    html += '</div>';
    secEl.innerHTML = html;
    $sections.appendChild(secEl);

    section.slots.forEach(function (slot) { loadThumb(slot.key); });
  });

  $sections.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-change');
    if (btn) openModal(btn.dataset.key, btn.dataset.label);
  });
}

function loadThumb(key) {
  FJKM_SB.from('photos').select('url').eq('key', key).maybeSingle()
    .then(function (res) {
      if (res.error || !res.data || !res.data.url) return;
      var el = document.getElementById('thumb-' + key);
      if (!el) return;
      var img = document.createElement('img');
      img.className = 'photo-thumb';
      // ?t= force le navigateur à recharger après un remplacement
      img.src = res.data.url + '?t=' + Date.now();
      img.alt = key;
      el.parentNode.replaceChild(img, el);
    })
    .catch(function () {});
}

// ── Modal d'upload ────────────────────────────────────────
function openModal(key, label) {
  currentPhotoKey = key;
  currentFile = null;
  $modalTitle.textContent = label;
  $modalKey.textContent = 'clé : ' + key;
  $fileInput.value = '';
  $previewWrap.classList.add('hidden');
  $progressWrap.classList.add('hidden');
  $progressBar.style.width = '0%';
  $btnUpload.disabled = true;
  $btnUpload.textContent = 'Uploader la photo';
  $btnCancel.disabled = false;
  $modalClose.disabled = false;
  $modal.classList.remove('hidden');
}

function closeModal() {
  $modal.classList.add('hidden');
  currentPhotoKey = null;
  currentFile = null;
}

$modalClose.addEventListener('click', closeModal);
$btnCancel.addEventListener('click', closeModal);
$modalBackdrop.addEventListener('click', closeModal);

// Sélection de fichier
$fileInput.addEventListener('change', function () {
  if (this.files[0]) selectFile(this.files[0]);
});

// Glisser-déposer
$dropZone.addEventListener('dragover', function (e) {
  e.preventDefault(); this.classList.add('drag-over');
});
$dropZone.addEventListener('dragleave', function () {
  this.classList.remove('drag-over');
});
$dropZone.addEventListener('drop', function (e) {
  e.preventDefault(); this.classList.remove('drag-over');
  var f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) selectFile(f);
  else showToast('Veuillez choisir une image (JPG, PNG ou WebP)', 'error');
});

function selectFile(file) {
  if (file.size > 8 * 1024 * 1024) {
    showToast('Fichier trop grand — 8 Mo maximum', 'error');
    return;
  }
  currentFile = file;
  var sizeKo = (file.size / 1024).toFixed(0);
  $previewName.textContent = file.name + ' — ' + sizeKo + ' Ko';
  var reader = new FileReader();
  reader.onload = function (e) {
    $previewImg.src = e.target.result;
    $previewWrap.classList.remove('hidden');
    $btnUpload.disabled = false;
  };
  reader.readAsDataURL(file);
}

// Upload vers Supabase Storage puis enregistrement en base
$btnUpload.addEventListener('click', function () {
  if (!currentFile || !currentPhotoKey) return;

  $btnUpload.disabled = true;
  $btnUpload.textContent = 'En cours...';
  $btnCancel.disabled = true;
  $modalClose.disabled = true;
  $progressWrap.classList.remove('hidden');
  // Le SDK Supabase v2 ne remonte pas la progression octet par
  // octet : on affiche un état d'activité plutôt qu'un faux
  // pourcentage. La barre passe à 100% une fois le fichier reçu.
  $progressBar.style.width = '35%';
  $progressLabel.textContent = 'Téléversement en cours...';

  var ext  = (currentFile.name.split('.').pop() || 'jpg').toLowerCase();
  var path = currentPhotoKey + '.' + ext;   // le bucket s'appelle déjà « photos »
  var key  = currentPhotoKey;

  function fail(err) {
    showToast('Erreur : ' + (err && err.message ? err.message : 'échec du téléversement'), 'error');
    $btnUpload.disabled = false;
    $btnUpload.textContent = 'Uploader la photo';
    $btnCancel.disabled = false;
    $modalClose.disabled = false;
    $progressWrap.classList.add('hidden');
  }

  FJKM_SB.storage.from('photos')
    .upload(path, currentFile, { upsert: true, contentType: currentFile.type })
    .then(function (res) {
      if (res.error) throw res.error;

      $progressBar.style.width = '100%';
      $progressLabel.textContent = 'Enregistrement...';

      var pub = FJKM_SB.storage.from('photos').getPublicUrl(path);
      return FJKM_SB.from('photos').upsert({
        key: key,
        url: pub.data.publicUrl,
        alt: key,
        updated_at: new Date().toISOString()
      });
    })
    .then(function (res) {
      if (res && res.error) throw res.error;
      showToast('Photo mise à jour avec succès !', 'success');
      loadThumb(key);
      closeModal();
    })
    .catch(fail);
});

// ── Démarrage ─────────────────────────────────────────────
window.addEventListener('load', initSupabase);
