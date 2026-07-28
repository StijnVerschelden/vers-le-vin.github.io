/* pairing.js — Vers Le Vin
   Navigation controls and category filtering for pairing.html.
   ---------------------------------------------------------------- */

/* =========================
   DROPDOWN CONTROLS
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const buttonIds = ['lantBtn', 'wijnBtn', 'blogBtn'];

  buttonIds.forEach((id) => {
    const button = document.getElementById(id);
    if (!button) return;

    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const menu = button.nextElementSibling;
      if (!menu) return;

      const isOpen = menu.classList.contains('is-open');

      buttonIds.forEach((otherId) => {
        const otherButton = document.getElementById(otherId);
        const otherMenu = otherButton?.nextElementSibling;

        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
        if (otherMenu) otherMenu.classList.remove('is-open');
      });

      button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      menu.classList.toggle('is-open', !isOpen);
    });
  });

  document.addEventListener('click', (event) => {
    buttonIds.forEach((id) => {
      const button = document.getElementById(id);
      const menu = button?.nextElementSibling;
      if (!button || !menu) return;

      if (!button.contains(event.target) && !menu.contains(event.target)) {
        button.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    buttonIds.forEach((id) => {
      const button = document.getElementById(id);
      const menu = button?.nextElementSibling;
      if (!button || !menu) return;

      button.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    });
  });
});

/* =========================
   MOBILE HAMBURGER
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const navWrap = document.querySelector('.nav-wrap');
  const hamburger = document.querySelector('.hamburger');

  if (!navWrap || !hamburger) return;

  function setMenuOpen(open) {
    navWrap.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', (event) => {
    event.stopPropagation();
    setMenuOpen(!navWrap.classList.contains('open'));
  });

  document.addEventListener('click', (event) => {
    if (!navWrap.classList.contains('open')) return;
    if (!navWrap.contains(event.target)) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuOpen(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) setMenuOpen(false);
  });
});

/* =========================
   PAIRING CATEGORY FILTERS
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = [...document.querySelectorAll('.pairing-filter')];
  const pairingCards = [...document.querySelectorAll('.pairing-card')];

  if (!filterButtons.length || !pairingCards.length) return;

  function applyFilter(selectedCategory) {
    pairingCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      card.hidden = selectedCategory !== 'all' && cardCategory !== selectedCategory;
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === selectedCategory;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.filter || 'all');
    });
  });
});
