/* wijnmakers.js — Vers Le Vin
   Flip cards + hamburger nav for the wijnmakers page.
   ------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── FLIP CARDS ── */
  const cards = document.querySelectorAll('.wijnmaker-card');

  function closeAll(except = null) {
    cards.forEach(c => {
      if (c !== except) c.classList.remove('is-flipped');
    });
  }

  cards.forEach(card => {
    // wrap inner content in .wijnmaker-flip-inner for preserve-3d
    const front = card.querySelector('.wijnmaker-front');
    const back  = card.querySelector('.wijnmaker-back');

    if (front && back) {
      const inner = document.createElement('div');
      inner.className = 'wijnmaker-flip-inner';
      card.insertBefore(inner, front);
      inner.appendChild(front);
      inner.appendChild(back);
    }

    card.addEventListener('click', e => {
      e.preventDefault?.();
      const willOpen = !card.classList.contains('is-flipped');
      closeAll(card);
      card.classList.toggle('is-flipped', willOpen);
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const willOpen = !card.classList.contains('is-flipped');
        closeAll(card);
        card.classList.toggle('is-flipped', willOpen);
      }
      if (e.key === 'Escape') card.classList.remove('is-flipped');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.wijnmaker-card')) closeAll();
  });

  /* ── DROPDOWN BUTTONS ── */
  ['lantBtn', 'wijnBtn', 'blogBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      const menu = btn.nextElementSibling;
      if (menu) menu.style.display = expanded ? 'none' : 'block';
    });

    btn.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        btn.setAttribute('aria-expanded', 'false');
        const menu = btn.nextElementSibling;
        if (menu) menu.style.display = 'none';
        btn.blur();
      }
    });
  });

  document.addEventListener('click', e => {
    ['lantBtn', 'wijnBtn', 'blogBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const menu = btn.nextElementSibling;
      if (!menu) return;
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        btn.setAttribute('aria-expanded', 'false');
        menu.style.display = 'none';
      }
    });
  });

  /* ── MOBILE HAMBURGER ── */
  (function () {
    const navWrap   = document.querySelector('.nav-wrap');
    const hamburger = document.querySelector('.hamburger');
    if (!navWrap || !hamburger) return;

    function setOpen(open) {
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      navWrap.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      setOpen(!navWrap.classList.contains('open'));
    });

    document.addEventListener('click', e => {
      if (!navWrap.classList.contains('open')) return;
      if (!navWrap.contains(e.target)) setOpen(false);
    });

    window.addEventListener('resize', () => setOpen(false));
  })();

});