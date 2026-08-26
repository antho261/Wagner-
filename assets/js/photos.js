// =========================================
// FJKM Wagner – Chargeur de photos dynamiques
// =========================================
// Lit les URLs depuis Firestore (collection "photos")
// et les applique à tous les éléments [data-photo-key].
// Si Firebase n'est pas configuré ou hors ligne,
// les photos originales (attribut src / style CSS)
// restent affichées — aucun message d'erreur visible.
// =========================================

(function () {
  if (typeof firebase === 'undefined') return;

  var db;
  try { db = firebase.firestore(); } catch (e) { return; }

  var elements = document.querySelectorAll('[data-photo-key]');
  if (!elements.length) return;

  elements.forEach(function (el) {
    var key = el.dataset.photoKey;
    db.collection('photos').doc(key).get()
      .then(function (doc) {
        if (!doc.exists) return;
        var data = doc.data();
        if (!data || !data.url) return;

        if (el.tagName === 'IMG') {
          el.src = data.url;
          if (data.alt) el.alt = data.alt;
        } else {
          el.style.backgroundImage = "url('" + data.url.replace(/'/g, "\\'") + "')";
        }
      })
      .catch(function () { /* fallback silencieux */ });
  });
})();
