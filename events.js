/* events.js — Vers Le Vin
   Handles: flip cards, photo carousel, lightbox zoom, hamburger nav, dropdowns.
   ---------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     LIGHTBOX
     ============================================================ */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxPrev  = lightbox?.querySelector('.lightbox-prev');
  const lightboxNext  = lightbox?.querySelector('.lightbox-next');

  // current set of photos and index for the lightbox
  let lbPhotos  = [];
  let lbCurrent = 0;

  function updateLightbox() {
    const photo = lbPhotos[lbCurrent];
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.alt || '';
    // counter
    if (lbPhotos.length > 1) {
      lightboxCounter.textContent = `${lbCurrent + 1} / ${lbPhotos.length}`;
    } else {
      lightboxCounter.textContent = '';
    }
    // hide arrows if only one photo
    lightboxPrev.classList.toggle('hidden', lbPhotos.length <= 1);
    lightboxNext.classList.toggle('hidden', lbPhotos.length <= 1);
  }

  function openLightbox(photos, startIndex) {
    if (!lightbox) return;
    lbPhotos  = photos;
    lbCurrent = startIndex;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 320);
  }

  function lbGoTo(idx) {
    lbCurrent = (idx + lbPhotos.length) % lbPhotos.length;
    updateLightbox();
  }

  // close on backdrop click only (not on image or arrows)
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // close on image click
  lightboxImg?.addEventListener('click', e => {
    e.stopPropagation();
    closeLightbox();
  });

  lightboxClose?.addEventListener('click', e => {
    e.stopPropagation();
    closeLightbox();
  });

  lightboxPrev?.addEventListener('click', e => {
    e.stopPropagation();
    lbGoTo(lbCurrent - 1);
  });

  lightboxNext?.addEventListener('click', e => {
    e.stopPropagation();
    lbGoTo(lbCurrent + 1);
  });

  // keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   lbGoTo(lbCurrent - 1);
    if (e.key === 'ArrowRight')  lbGoTo(lbCurrent + 1);
  });

  // swipe in lightbox — only on the image, not on arrows
  let lbTouchX = 0;
  lightboxImg?.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
  lightboxImg?.addEventListener('touchend', e => {
    const diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      e.stopPropagation();
      lbGoTo(diff > 0 ? lbCurrent + 1 : lbCurrent - 1);
    }
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

    // zoom — click on active real photo opens lightbox with all photos from this card
    carousel.addEventListener('click', e => {
      const photo = e.target.closest('.car-photo');
      if (!photo || !photo.classList.contains('active')) return;
      e.stopPropagation();
      // collect all real photos from this carousel
      const allPhotos = Array.from(carousel.querySelectorAll('.car-photo'));
      const startIdx  = allPhotos.indexOf(photo);
      openLightbox(allPhotos, startIdx);
    });

    // flip card open — but not if clicking a photo (that opens lightbox instead)
    function openCard(e) {
      if (e.target.closest('.car-photo')) return; // let carousel handler take it
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