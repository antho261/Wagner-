// =========================================
// FJKM Wagner – Configuration Supabase
// =========================================
// INSTRUCTIONS :
// 1. Allez sur https://supabase.com et créez un projet
// 2. Project Settings (⚙️) → API
// 3. Copiez « Project URL » et la clé « anon public »
// 4. Remplacez les deux valeurs ci-dessous
//
// La clé « anon » est PUBLIQUE et destinée au navigateur :
// elle peut figurer dans le dépôt sans risque. La sécurité
// repose sur les règles RLS (voir supabase-setup.sql).
// Ne mettez JAMAIS la clé « service_role » ici.
// =========================================

var FJKM_SUPABASE_URL      = 'https://rpxilsqfnyaxyxconidb.supabase.co';
var FJKM_SUPABASE_ANON_KEY = 'sb_publishable_G7-J30sqj7eQO66YwdCvqA_TBzEf8hi';

// Client partagé par le site et le panneau d'administration.
// Nommé FJKM_SB pour ne pas masquer « supabase », qui est le
// namespace de la librairie chargée depuis le CDN.
var FJKM_SB = null;

(function () {
  if (typeof supabase === 'undefined') return;           // SDK non chargé
  if (FJKM_SUPABASE_URL.indexOf('VOTRE_') === 0) return; // pas encore configuré
  try {
    FJKM_SB = supabase.createClient(FJKM_SUPABASE_URL, FJKM_SUPABASE_ANON_KEY);
  } catch (e) {
    FJKM_SB = null;
  }
})();
