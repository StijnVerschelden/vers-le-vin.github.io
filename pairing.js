/* pairing.js — Vers Le Vin
   Navigation controls and category filtering for pairing.html.
   ---------------------------------------------------------------- */

'use strict';

document.documentElement.classList.add('js');

/* =========================
   DROPDOWN CONTROLS
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const dropdownButtonIds = ['lantBtn', 'wijnBtn', 'blogBtn'];

  function closeDropdown(button) {
    const menu = button?.nextElementSibling;
    if (!button || !menu) return;

    button.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }

  function closeAllDropdowns(exceptButton = null) {
    dropdownButtonIds.forEach((id) => {
      const button = document.getElementById(id);
      if (button !== exceptButton) closeDropdown(button);
    });
  }

  dropdownButtonIds.forEach((id) => {
    const button = document.getElementById(id);
    const menu = button?.nextElementSibling;
    if (!button || !menu) return;

    button.addEventListener('click', (event) => {
      event.stopPropagation();

      const willOpen = !menu.classList.contains('is-open');
      closeAllDropdowns(button);

      button.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      menu.classList.toggle('is-open', willOpen);
    });
  });

  document.addEventListener('click', (event) => {
    dropdownButtonIds.forEach((id) => {
      const button = document.getElementById(id);
      const menu = button?.nextElementSibling;
      if (!button || !menu) return;

      if (!button.contains(event.target) && !menu.contains(event.target)) {
        closeDropdown(button);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeAllDropdowns();
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
  const filterButtons = Array.from(document.querySelectorAll('.pairing-filter'));
  const pairingRows = Array.from(document.querySelectorAll('.pairing-row'));
  const emptyMessage = document.getElementById('pairingEmpty');

  if (!filterButtons.length || !pairingRows.length) return;

  function applyFilter(category) {
    let visibleCount = 0;

    pairingRows.forEach((row) => {
      const shouldShow = category === 'all' || row.dataset.category === category;
      row.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.filter || 'all');
    });
  });

  applyFilter('all');
});

/* =========================
   PAIRING INTRO: SHOW MORE
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const introText = document.getElementById('pairingIntroText');
  const introToggle = document.getElementById('pairingIntroToggle');

  if (!introText || !introToggle) return;

  introToggle.addEventListener('click', () => {
    const isExpanded = introText.classList.toggle('is-expanded');

    introToggle.setAttribute(
      'aria-expanded',
      isExpanded ? 'true' : 'false'
    );

    introToggle.textContent = isExpanded
      ? 'Show less'
      : 'Show more…';
  });
});

/* =========================
   DISCUSSION PREVIEWS

   The main pairing page shows:
   1. One pinned winemaker comment from the HTML.
   2. The two newest community comments.

   For the future wine-detail pages, save comments under:
   localStorage key: versLeVinPairingComments:<wine key>

   Example:
   versLeVinPairingComments:wijn1

   Each stored comment should look like:
   {
     "name": "Sophie",
     "text": "A beautiful pairing.",
     "createdAt": "2026-07-29T12:00:00.000Z"
   }

   This localStorage setup is useful for design/testing only.
   A public forum shared by all visitors will require a backend.
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const previews = Array.from(
    document.querySelectorAll('.comment-preview[data-comments-key]')
  );

  if (!previews.length) return;

  const STORAGE_PREFIX = 'versLeVinPairingComments:';

  function readComments(key) {
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((comment) => {
          return (
            comment &&
            typeof comment.name === 'string' &&
            typeof comment.text === 'string'
          );
        })
        .sort((a, b) => {
          const timeA = Date.parse(a.createdAt || '') || 0;
          const timeB = Date.parse(b.createdAt || '') || 0;
          return timeB - timeA;
        });
    } catch (error) {
      console.warn('Could not read pairing comments:', error);
      return [];
    }
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  function createCommentElement(comment) {
    const item = document.createElement('article');
    item.className = 'comment-preview-community-item';

    const top = document.createElement('div');
    top.className = 'comment-preview-community-top';

    const author = document.createElement('span');
    author.textContent = comment.name.trim() || 'Anonymous';

    const date = document.createElement('span');
    date.textContent = formatDate(comment.createdAt);

    const text = document.createElement('p');
    text.className = 'comment-preview-community-text';
    text.textContent = comment.text.trim();

    top.append(author, date);
    item.append(top, text);

    return item;
  }

  previews.forEach((preview) => {
    const key = preview.dataset.commentsKey;
    const list = preview.querySelector('[data-comment-list]');

    if (!key || !list) return;

    const latestComments = readComments(key).slice(0, 2);
    list.replaceChildren();

    if (!latestComments.length) {
      const empty = document.createElement('p');
      empty.className = 'comment-preview-empty';
      empty.textContent = 'No comments yet.';
      list.appendChild(empty);
      return;
    }

    latestComments.forEach((comment) => {
      list.appendChild(createCommentElement(comment));
    });
  });
});

