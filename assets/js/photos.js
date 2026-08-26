// =========================================
// FJKM Wagner – Chargeur de photos dynamiques
// =========================================
// Lit les URLs depuis la table Supabase « photos » et les
// applique à tous les éléments [data-photo-key].
//
// Si Supabase n'est pas configuré ou hors ligne, les photos
// d'origine (attribut src / background CSS) restent
// affichées — aucun message d'erreur visible.
//
// Une seule requête pour toute la page : l'ancienne version
// Firestore lisait un document par clé, soit jusqu'à 17
// allers-retours sur notre-eglise.html.
// =========================================

(function () {
  if (!window.FJKM_SB) return;

  var elements = document.querySelectorAll('[data-photo-key]');
  if (!elements.length) return;

  var keys = [];
  elements.forEach(function (el) {
    var k = el.dataset.photoKey;
    if (k && keys.indexOf(k) === -1) keys.push(k);
  });
  if (!keys.length) return;

  FJKM_SB.from('photos')
    .select('key,url,alt')
    .in('key', keys)
    .then(function (res) {
      if (res.error || !res.data) return;

      var byKey = {};
      res.data.forEach(function (row) { byKey[row.key] = row; });

      elements.forEach(function (el) {
        var row = byKey[el.dataset.photoKey];
        if (!row || !row.url) return;

        if (el.tagName === 'IMG') {
          el.src = row.url;
          if (row.alt) el.alt = row.alt;
        } else {
          el.style.backgroundImage = "url('" + row.url.replace(/'/g, "\\'") + "')";
        }
      });
    })
    .catch(function () { /* repli silencieux */ });
})();
