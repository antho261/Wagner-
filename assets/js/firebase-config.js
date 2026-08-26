// =========================================
// FJKM Wagner – Configuration Firebase
// =========================================
// INSTRUCTIONS :
// 1. Allez sur https://console.firebase.google.com
// 2. Créez un projet ou ouvrez le vôtre
// 3. Paramètres du projet (⚙️) → Vos applications → Web (</>)
// 4. Copiez vos valeurs et remplacez-les ci-dessous
// =========================================

var FJKM_FIREBASE_CONFIG = {
  apiKey:            "VOTRE_API_KEY",
  authDomain:        "VOTRE_PROJECT_ID.firebaseapp.com",
  projectId:         "VOTRE_PROJECT_ID",
  storageBucket:     "VOTRE_PROJECT_ID.appspot.com",
  messagingSenderId: "VOTRE_SENDER_ID",
  appId:             "VOTRE_APP_ID"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(FJKM_FIREBASE_CONFIG);
}
