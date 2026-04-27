/* events.js — Vers Le Vin
   Handles: flip cards, photo carousel, hamburger nav, dropdown buttons.
   -------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     FLIP CARDS + CAROUSEL INIT
     ============================================================ */
  document.querySelectorAll('.evt-card-wrap').forEach(wrap => {
    const card = wrap.querySelector('.evt-card');
    const front = card.querySelector('.evt-front');
    const back = card.querySelector('.evt-back');
    const btnLees = front.querySelector('.btn-lees');
    const btnTerug = back.querySelector('.btn-terug');
    const carousel = back.querySelector('.evt-carousel');

    const slides = Array.from(
      carousel.querySelectorAll('.car-photo, .car-photo-placeholder')
    );
    const dotsContainer = carousel.querySelector('.car-dots');
    const arrBtns = carousel.querySelectorAll('.car-arr');
    let current = 0;

    if (slides.length > 1) {
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'car-dot' + (i === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(idx) {
      slides[current].classList.remove('active');
      dotsContainer.querySelectorAll('.car-dot').forEach(d => d.classList.remove('active'));
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      const dots = dotsContainer.querySelectorAll('.car-dot');
      if (dots[current]) dots[current].classList.add('active');
    }

    if (arrBtns.length === 2) {
      arrBtns[0].addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
      arrBtns[1].addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
    }

    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    function openCard(e) {
      e.stopPropagation();
      card.classList.add('is-flipped');
      goTo(0);
    }

    card.addEventListener('click', openCard);
    card.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && !card.classList.contains('is-flipped')) {
        e.preventDefault();
        openCard(e);
      }
      if (e.key === 'Escape') card.classList.remove('is-flipped');
    });

    btnTerug.addEventListener('click', e => {
      e.stopPropagation();
      card.classList.remove('is-flipped');
    });

    btnLees.addEventListener('click', e => {
      e.stopPropagation();
      card.classList.add('is-flipped');
      goTo(0);
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.evt-card-wrap')) {
      document.querySelectorAll('.evt-card.is-flipped').forEach(c => c.classList.remove('is-flipped'));
    }
  });


  /* ============================================================
     DROPDOWN BUTTONS
     ============================================================ */
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


  /* ============================================================
     MOBILE HAMBURGER
     ============================================================ */
  (function () {
    const navWrap = document.querySelector('.nav-wrap');
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