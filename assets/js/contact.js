// =========================================
// FJKM Wagner – Contact
// =========================================

// URL du backend (API FastAPI). Laisser vide si le backend est servi sur le
// même domaine que le site. Si le backend est hébergé ailleurs (ex. Render),
// mettre son URL sans slash final : const API_BASE = 'https://fjkm-api.onrender.com';
const API_BASE = '';

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backtotop').classList.toggle('show', window.scrollY > 400);
});

// ── Mobile menu ──
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
hamburger.addEventListener('click',   () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ── Scroll reveal ──
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Recipient selection ──
const recBtns = document.querySelectorAll('.cf-recipient');
let selectedEmail = '';
let selectedRecipientName = '';

recBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    recBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedEmail = btn.dataset.email;
    selectedRecipientName = btn.querySelector('.cf-rec-name').textContent.trim();
  });
});

// ── Form submission via Formsubmit.co (no email client needed) ──
document.getElementById('cfSubmit').addEventListener('click', async () => {
  const nom     = document.getElementById('cfNom').value.trim();
  const prenom  = document.getElementById('cfPrenom').value.trim();
  const email   = document.getElementById('cfEmail').value.trim();
  const tel     = document.getElementById('cfTel').value.trim();
  const message = document.getElementById('cfMessage').value.trim();

  // Validation
  if (!selectedEmail) {
    document.getElementById('cfRecipients').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (!nom)    { document.getElementById('cfNom').focus();    return; }
  if (!prenom) { document.getElementById('cfPrenom').focus(); return; }
  if (!email || !email.includes('@')) { document.getElementById('cfEmail').focus(); return; }
  if (!message) { document.getElementById('cfMessage').focus(); return; }

  // Loading state
  const btn = document.getElementById('cfSubmit');
  btn.disabled = true;
  btn.classList.add('loading');

  document.getElementById('cfError').classList.remove('show');

  // Envoi : d'abord le backend (sauvegarde + relais email) ; si le site est
  // hébergé sans backend (hébergement statique), repli direct sur FormSubmit.
  const sendViaBackend = async () => {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        recipient_email: selectedEmail,
        recipient_name : selectedRecipientName,
        nom, prenom, email,
        ...(tel && { tel }),
        message
      })
    });
    if (!res.ok) throw new Error('backend_failed');
    // Certains hébergeurs renvoient une page d'erreur avec un code 200 :
    // on exige la réponse JSON du backend avant de déclarer le succès.
    const data = await res.json();
    if (!data || !data.id) throw new Error('backend_invalid_response');
  };

  const sendViaFormSubmit = async () => {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(selectedEmail)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: `[FJKM Wagner — ${selectedRecipientName}] Message de ${prenom} ${nom}`,
        _replyto: email,
        _captcha: 'false',
        _template: 'table',
        Destinataire: selectedRecipientName,
        Nom: nom,
        'Prénom': prenom,
        Email: email,
        ...(tel && { 'Téléphone': tel }),
        Message: message
      })
    });
    if (!res.ok) throw new Error('formsubmit_failed');
    // FormSubmit peut répondre 200 avec success:"false" (ex. adresse pas
    // encore activée) : on lit la réponse au lieu de croire le statut HTTP.
    const data = await res.json().catch(() => null);
    const ok = data && (data.success === true || data.success === 'true');
    if (!ok) {
      console.warn('FormSubmit:', data && data.message);
      const pending = data && /activat/i.test(data.message || '');
      throw new Error(pending ? 'formsubmit_activation_pending' : 'formsubmit_failed');
    }
  };

  try {
    try {
      await sendViaBackend();
    } catch {
      await sendViaFormSubmit();
    }

    document.querySelector('.cf-container').classList.add('submitted');
    const success = document.getElementById('cfSuccess');
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (e) {
    btn.disabled = false;
    btn.classList.remove('loading');
    const err = document.getElementById('cfError');
    const p = err.querySelector('p');
    if (p && e && e.message === 'formsubmit_activation_pending') {
      p.dataset.fr = "Le service d'envoi n'est pas encore activé pour ce destinataire : un email de confirmation FormSubmit vient de lui être envoyé. Une fois le lien confirmé, le formulaire fonctionnera.";
      p.dataset.en = 'The sending service is not activated for this recipient yet: a FormSubmit confirmation email has just been sent to them. Once confirmed, the form will work.';
      p.dataset.mg = "Mbola tsy nohamarinina ny serivisy fandefasana ho an'ity mpandray ity: nalefa any aminy ny mailaka fanamarinana FormSubmit. Rehefa voamarina dia handeha ny formulaire.";
      const lang = document.documentElement.getAttribute('data-lang') || 'fr';
      p.textContent = p.dataset[lang] || p.dataset.fr;
    }
    err.classList.add('show');
    err.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});

// ════════════════════════════════════════════
// LANGUE — FR / MG / EN
// ════════════════════════════════════════════
(function () {
  const LANG_KEY = 'fjkm-lang';
  const btnFR = document.getElementById('btnFR');
  const btnMG = document.getElementById('btnMG');
  const btnEN = document.getElementById('btnEN');

  function applyLang(lang, save) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    [btnFR, btnMG, btnEN].forEach(b => b && b.classList.remove('active'));
    const active = { fr: btnFR, mg: btnMG, en: btnEN }[lang];
    if (active) active.classList.add('active');
    document.querySelectorAll('[data-fr]').forEach(el => {
      const text = el.getAttribute('data-' + lang) || el.getAttribute('data-fr');
      if (el.children.length === 0) el.textContent = text;
    });
    if (save) localStorage.setItem(LANG_KEY, lang);
  }

  btnFR && btnFR.addEventListener('click', () => applyLang('fr', true));
  btnMG && btnMG.addEventListener('click', () => applyLang('mg', true));
  btnEN && btnEN.addEventListener('click', () => applyLang('en', true));
  applyLang(localStorage.getItem(LANG_KEY) || 'fr', false);
})();

// ════════════════════════════════════════════
// THÈME — Jour / Nuit
// ════════════════════════════════════════════
(function () {
  const THEME_KEY = 'fjkm-theme';
  const btnDay   = document.getElementById('btnDay');
  const btnNight = document.getElementById('btnNight');

  function applyTheme(theme, save) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    btnDay   && btnDay.classList.toggle('active', !isDark);
    btnNight && btnNight.classList.toggle('active', isDark);
    if (save) localStorage.setItem(THEME_KEY, theme);
  }

  btnDay   && btnDay.addEventListener('click',   () => applyTheme('light', true));
  btnNight && btnNight.addEventListener('click', () => applyTheme('dark',  true));

  const saved    = localStorage.getItem(THEME_KEY);
  const prefDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefDark ? 'dark' : 'light'), false);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light', false);
  });
})();

document.querySelectorAll('.copyright-year').forEach(e => e.textContent = new Date().getFullYear());
