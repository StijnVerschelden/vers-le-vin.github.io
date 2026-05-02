/* events.js — Vers Le Vin
   Handles: flip cards, photo carousel, lightbox zoom, hamburger nav, dropdowns.
   ---------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // clear src after transition so no flash on next open
    setTimeout(() => { lightboxImg.src = ''; }, 320);
  }

  // close on backdrop or image click
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
  });

  lightboxClose?.addEventListener('click', e => {
    e.stopPropagation();
    closeLightbox();
  });

  // close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
  });


  /* ============================================================
     FLIP CARDS + CAROUSEL INIT
     ============================================================ */
  document.querySelectorAll('.evt-card-wrap').forEach(wrap => {
    const card    = wrap.querySelector('.evt-card');
    const back    = card.querySelector('.evt-back');
    const btnTerug = back.querySelector('.btn-terug');
    const carousel = back.querySelector('.evt-carousel');

    const slides = Array.from(
      carousel.querySelectorAll('.car-photo, .car-photo-placeholder')
    );
    const dotsContainer = carousel.querySelector('.car-dots');
    const arrBtns = carousel.querySelectorAll('.car-arr');
    let current = 0;

    // build dots
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

    // arrow buttons
    if (arrBtns.length === 2) {
      arrBtns[0].addEventListener('click', e => { e.stopPropagation(); goTo(current - 1); });
      arrBtns[1].addEventListener('click', e => { e.stopPropagation(); goTo(current + 1); });
    }

    // swipe
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    // zoom — click on active real photo opens lightbox
    carousel.addEventListener('click', e => {
      const photo = e.target.closest('.car-photo');
      if (!photo || !photo.classList.contains('active')) return;
      e.stopPropagation();
      openLightbox(photo.src, photo.alt);
    });

    // flip card open
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
  });

  // click outside all cards — flip back
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
    const navWrap  = document.querySelector('.nav-wrap');
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