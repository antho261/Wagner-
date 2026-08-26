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

// ── Initialisation Firebase ───────────────────────────────
function initFirebase() {
  if (typeof firebase === 'undefined') {
    $loading.innerHTML = '<div style="color:#E07070;font-family:sans-serif;text-align:center;padding:40px;max-width:500px;margin:0 auto">' +
      '<p style="font-size:48px;margin-bottom:20px">⚠️</p>' +
      '<p style="font-size:18px;margin-bottom:12px;color:#DDD5C8">Firebase non chargé</p>' +
      '<p style="font-size:14px;color:rgba(221,213,200,.5);line-height:1.6">Vérifiez votre connexion internet.<br>Les SDKs Firebase se chargent depuis gstatic.com.</p>' +
      '</div>';
    return;
  }

  try {
    auth    = firebase.auth();
    db      = firebase.firestore();
    storage = firebase.storage();
  } catch (e) {
    $loading.innerHTML = '<div style="color:#E07070;font-family:sans-serif;text-align:center;padding:40px;max-width:500px;margin:0 auto">' +
      '<p style="font-size:48px;margin-bottom:20px">🔧</p>' +
      '<p style="font-size:18px;margin-bottom:12px;color:#DDD5C8">Configuration Firebase manquante</p>' +
      '<p style="font-size:14px;color:rgba(221,213,200,.5);line-height:1.6">Ouvrez <code style="background:rgba(255,255,255,.1);padding:2px 6px;border-radius:4px">assets/js/firebase-config.js</code><br>et renseignez vos clés Firebase.</p>' +
      '</div>';
    return;
  }

  auth.onAuthStateChanged(function (user) {
    $loading.classList.add('hidden');
    if (user) {
      showDashboard();
    } else {
      $login.classList.remove('hidden');
    }
  });
}

// ── Authentification ──────────────────────────────────────
$loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  $loginError.textContent = '';
  $btnLogin.disabled = true;
  $btnLogin.textContent = 'Connexion...';

  auth.signInWithEmailAndPassword($email.value.trim(), $pass.value)
    .catch(function (err) {
      var msg = 'Email ou mot de passe incorrect.';
      if (err.code === 'auth/too-many-requests')       msg = 'Trop de tentatives. Réessayez dans quelques minutes.';
      if (err.code === 'auth/network-request-failed')  msg = 'Erreur réseau. Vérifiez votre connexion internet.';
      if (err.code === 'auth/user-not-found')          msg = 'Aucun compte trouvé avec cet email.';
      $loginError.textContent = msg;
      $btnLogin.disabled = false;
      $btnLogin.textContent = 'Se connecter';
    });
});

$btnLogout.addEventListener('click', function () {
  auth.signOut();
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
  db.collection('photos').doc(key).get()
    .then(function (doc) {
      if (!doc.exists || !doc.data().url) return;
      var el = document.getElementById('thumb-' + key);
      if (!el) return;
      var img = document.createElement('img');
      img.className = 'photo-thumb';
      img.src = doc.data().url;
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

// Upload vers Firebase Storage puis Firestore
$btnUpload.addEventListener('click', function () {
  if (!currentFile || !currentPhotoKey) return;

  $btnUpload.disabled = true;
  $btnUpload.textContent = 'En cours...';
  $btnCancel.disabled = true;
  $modalClose.disabled = true;
  $progressWrap.classList.remove('hidden');
  $progressBar.style.width = '0%';
  $progressLabel.textContent = 'Préparation de l\'upload...';

  var ext = currentFile.name.split('.').pop().toLowerCase() || 'jpg';
  var storagePath = 'photos/' + currentPhotoKey + '.' + ext;
  var uploadTask = storage.ref(storagePath).put(currentFile);

  uploadTask.on('state_changed',
    function (snapshot) {
      var pct = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
      $progressBar.style.width = pct + '%';
      $progressLabel.textContent = 'Téléversement... ' + pct + '%';
    },
    function (err) {
      showToast('Erreur : ' + err.message, 'error');
      $btnUpload.disabled = false;
      $btnUpload.textContent = 'Uploader la photo';
      $btnCancel.disabled = false;
      $modalClose.disabled = false;
    },
    function () {
      $progressLabel.textContent = 'Enregistrement...';
      uploadTask.snapshot.ref.getDownloadURL()
        .then(function (url) {
          return db.collection('photos').doc(currentPhotoKey).set({
            url: url,
            alt: currentPhotoKey,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .then(function () {
          showToast('Photo mise à jour avec succès !', 'success');
          loadThumb(currentPhotoKey);
          closeModal();
        })
        .catch(function (err) {
          showToast('Erreur lors de la sauvegarde : ' + err.message, 'error');
          $btnUpload.disabled = false;
          $btnUpload.textContent = 'Uploader la photo';
          $btnCancel.disabled = false;
          $modalClose.disabled = false;
        });
    }
  );
});

// ── Démarrage ─────────────────────────────────────────────
window.addEventListener('load', initFirebase);
