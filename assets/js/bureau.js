// FJKM Wagner – Carrousel Membres du Bureau (partagé)
// ── Bureau : carrousel 3D ──
(function () {
  const carousel = document.getElementById('bcCarousel');
  const dotsEl   = document.getElementById('bcDots');
  if (!carousel) return;

  const cards = [...carousel.querySelectorAll('.bc-card')];
  const total = cards.length;
  let active = 2; // center card by default

  function render() {
    cards.forEach((card, i) => {
      let offset = i - active;
      if (offset < -Math.floor(total / 2)) offset += total;
      if (offset >  Math.floor(total / 2)) offset -= total;
      card.setAttribute('data-offset', offset);
    });
    if (dotsEl) {
      [...dotsEl.querySelectorAll('.bc-dot')].forEach((dot, i) => {
        dot.classList.toggle('active', i === active);
      });
    }
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => { active = i; render(); });
  });

  if (dotsEl) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'bc-dot';
      dot.setAttribute('aria-label', `Membre ${i + 1}`);
      dot.addEventListener('click', () => { active = i; render(); });
      dotsEl.appendChild(dot);
    });
  }

  let startX = 0;
  carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) { active = (active + (dx < 0 ? 1 : -1) + total) % total; render(); }
  }, { passive: true });

  render();
})();
