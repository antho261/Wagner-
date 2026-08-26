// =========================================
// FJKM Wagner – Finoana Paris
// Script — Pages légales
// (mentions-legales.html & politique-utilisation.html)
// =========================================

// ── Scroll reveal des blocs ────────────────
const blocks = document.querySelectorAll('.section-block');
const obs    = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

blocks.forEach(b => obs.observe(b));

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

// ── Liquid Glass Theme Switcher ───────────────
(function() {
  const STORAGE_KEY  = 'fjkm-theme';
  const STORAGE_DATE = 'fjkm-theme-date';

  const btnDay   = document.getElementById('lgDay');
  const btnNight = document.getElementById('lgNight');
  const switcher = document.getElementById('lgSwitcher');

  function getAutoTheme() {
    const h = new Date().getHours();
    return (h >= 6 && h < 18) ? 'light' : 'dark';
  }

  function applyTheme(theme, saveOverride) {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    btnDay.classList.toggle('active',   theme === 'light');
    btnNight.classList.toggle('active', theme === 'dark');
    if (saveOverride) {
      localStorage.setItem(STORAGE_KEY,  theme);
      localStorage.setItem(STORAGE_DATE, new Date().toDateString());
    }
  }

  function initTheme() {
    const savedDate  = localStorage.getItem(STORAGE_DATE);
    const todayStr   = new Date().toDateString();
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedDate !== todayStr) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_DATE);
    }
    const override = (savedDate === todayStr) ? savedTheme : null;
    applyTheme(override || getAutoTheme(), false);
  }

  switcher.addEventListener('click', function() {
    const isDark = document.body.classList.contains('theme-dark');
    applyTheme(isDark ? 'light' : 'dark', true);
  });

  initTheme();
})();
