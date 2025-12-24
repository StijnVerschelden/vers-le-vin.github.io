
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.wine-card');

    function closeAll(except = null){
      cards.forEach(c => { if (c !== except) c.classList.remove('is-flipped'); });
    }

    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // prevent weird text selection on double click
        e.preventDefault?.();

        const willOpen = !card.classList.contains('is-flipped');
        closeAll(card);
        card.classList.toggle('is-flipped', willOpen);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const willOpen = !card.classList.contains('is-flipped');
          closeAll(card);
          card.classList.toggle('is-flipped', willOpen);
        }
        if (e.key === 'Escape') {
          card.classList.remove('is-flipped');
        }
      });
    });

    // click outside closes all
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.wine-card')) closeAll();
    });
  });

   // Mobile hamburger toggle
(function(){
  const navWrap = document.querySelector('.nav-wrap');
  const hamburger = document.querySelector('.hamburger');
  if (!navWrap || !hamburger) return;

  function setOpen(open) {
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    navWrap.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!navWrap.classList.contains('open'));
  });

  document.addEventListener('click', (e) => {
    if (!navWrap.classList.contains('open')) return;
    if (!navWrap.contains(e.target)) setOpen(false);
  });

  window.addEventListener('resize', () => setOpen(false));
})();

