// =========================================
// FJKM Wagner – Finoana Paris
// Script — Pages légales
// (mentions-legales.html & politique-utilisation.html)
// =========================================

// ── Sidebar — lien actif au scroll ────────
const sections = document.querySelectorAll('.section-block');
const navLinks = document.querySelectorAll('.sidebar-nav a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

