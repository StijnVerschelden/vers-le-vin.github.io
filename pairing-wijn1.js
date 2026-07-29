/* pairing-wijn1.js — Vers Le Vin
   Detail-page navigation, slideshow, pairing tabs and discussion.
   ---------------------------------------------------------------- */

'use strict';

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
    if (event.key === 'Escape') closeAllDropdowns();
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
   THREE-IMAGE AUTOMATIC SLIDESHOW
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('[data-slideshow]');
  if (!gallery) return;

  const stage = gallery.querySelector('.wine-gallery-stage');
  const slides = Array.from(gallery.querySelectorAll('.wine-slide'));
  const previousButton = gallery.querySelector('[data-gallery-previous]');
  const nextButton = gallery.querySelector('[data-gallery-next]');
  const dotsWrap = gallery.querySelector('[data-gallery-dots]');
  const currentOutput = gallery.querySelector('[data-current-slide]');
  const totalOutput = gallery.querySelector('[data-total-slides]');
  const caption = document.getElementById('wineGalleryCaption');

  if (!stage || !slides.length || !dotsWrap) return;

  const AUTOPLAY_MS = 5200;
  let currentIndex = 0;
  let autoplayTimer = null;

  /*
    The second and third demo filenames can be replaced later.
    If either file is missing, it falls back to the first image.
  */
  const fallbackImage = slides[0].getAttribute('src');

  slides.slice(1).forEach((slide) => {
    slide.addEventListener(
      'error',
      () => {
        if (slide.getAttribute('src') !== fallbackImage) {
          slide.setAttribute('src', fallbackImage);
        }
      },
      { once: true }
    );
  });

  totalOutput.textContent = String(slides.length);

  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show image ${index + 1}`);
    dot.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');

    dot.addEventListener('click', () => {
      showSlide(index);
      restartAutoplay();
    });

    dotsWrap.appendChild(dot);
    return dot;
  });

  function showSlide(index) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === currentIndex;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    currentOutput.textContent = String(currentIndex + 1);

    const nextCaption =
      slides[currentIndex].dataset.caption || `Image ${currentIndex + 1}`;

    if (caption) caption.textContent = nextCaption;
  }

  function stopAutoplay() {
    if (autoplayTimer) window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    autoplayTimer = window.setInterval(() => {
      showSlide(currentIndex + 1);
    }, AUTOPLAY_MS);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  previousButton?.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    restartAutoplay();
  });

  nextButton?.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    restartAutoplay();
  });

  stage.addEventListener('mouseenter', stopAutoplay);
  stage.addEventListener('mouseleave', startAutoplay);
  stage.addEventListener('focusin', stopAutoplay);
  stage.addEventListener('focusout', startAutoplay);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  showSlide(0);
  startAutoplay();
});

/* =========================
   PAIRING TABS
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = Array.from(document.querySelectorAll('[data-pairing-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-pairing-panel]'));

  if (!tabs.length || !panels.length) return;

  const validNames = tabs.map((tab) => tab.dataset.pairingTab);

  function activatePairing(name, updateHash = true) {
    if (!validNames.includes(name)) name = validNames[0];

    tabs.forEach((tab) => {
      const active = tab.dataset.pairingTab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.dataset.pairingPanel === name;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });

    if (updateHash) {
      history.replaceState(null, '', `#${name}`);
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activatePairing(tab.dataset.pairingTab);
    });

    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        return;
      }

      event.preventDefault();

      let nextIndex = index;

      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      }
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;

      tabs[nextIndex].focus();
      activatePairing(tabs[nextIndex].dataset.pairingTab);
    });
  });

  const requestedPanel = window.location.hash.replace('#', '');

  if (validNames.includes(requestedPanel)) {
    activatePairing(requestedPanel, false);
  } else {
    activatePairing(validNames[0], false);
  }
});

/* =========================
   THREADED DISCUSSION

   Comments are stored locally under the same key used by
   pairing.html's discussion preview:
   versLeVinPairingComments:wijn1

   This is a front-end demo. A public shared forum requires
   a database/backend.
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const discussion = document.querySelector('.discussion[data-comments-key]');
  const list = document.getElementById('commentList');
  const empty = document.getElementById('discussionEmpty');
  const openButton = document.getElementById('openCommentButton');
  const composer = document.getElementById('commentComposer');
  const cancelButton = document.getElementById('cancelCommentButton');
  const cancelReplyButton = document.getElementById('cancelReplyButton');
  const replyContext = document.getElementById('replyContext');
  const replyContextText = document.getElementById('replyContextText');
  const parentInput = document.getElementById('commentParentId');
  const nameInput = document.getElementById('commentName');
  const textInput = document.getElementById('commentText');
  const status = document.getElementById('commentStatus');
  const sortSelect = document.getElementById('commentSort');

  if (
    !discussion ||
    !list ||
    !empty ||
    !openButton ||
    !composer ||
    !cancelButton ||
    !cancelReplyButton ||
    !replyContext ||
    !replyContextText ||
    !parentInput ||
    !nameInput ||
    !textInput ||
    !status ||
    !sortSelect
  ) {
    return;
  }

  const commentsKey = discussion.dataset.commentsKey;
  const storageKey = `versLeVinPairingComments:${commentsKey}`;
  const likedKey = `${storageKey}:liked`;

  let comments = readComments();
  let likedCommentIds = readLikedCommentIds();

  function readComments() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Could not read comments:', error);
      return [];
    }
  }

  function saveComments() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comments));
    } catch (error) {
      console.warn('Could not save comments:', error);
      status.textContent =
        'Your browser could not save this comment. Please try again.';
    }
  }

  function readLikedCommentIds() {
    try {
      const raw = localStorage.getItem(likedKey);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveLikedCommentIds() {
    try {
      localStorage.setItem(likedKey, JSON.stringify(likedCommentIds));
    } catch (error) {
      console.warn('Could not save likes:', error);
    }
  }

  function createId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();

    return `comment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    return new Intl.DateTimeFormat('en', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() === new Date().getFullYear()
        ? undefined
        : 'numeric'
    }).format(date);
  }

  function initials(name) {
    return (
      name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('') || '?'
    );
  }

  function childrenFor(parentId) {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .sort((a, b) => {
        return (
          (Date.parse(a.createdAt) || 0) -
          (Date.parse(b.createdAt) || 0)
        );
      });
  }

  function topLevelComments() {
    const topLevel = comments.filter((comment) => !comment.parentId);
    const direction = sortSelect.value === 'oldest' ? 1 : -1;

    return topLevel.sort((a, b) => {
      return direction * (
        (Date.parse(a.createdAt) || 0) -
        (Date.parse(b.createdAt) || 0)
      );
    });
  }

  function openComposer(replyTo = null) {
    composer.hidden = false;
    openButton.setAttribute('aria-expanded', 'true');

    if (replyTo) {
      parentInput.value = replyTo.id;
      replyContext.hidden = false;
      replyContextText.textContent = `Replying to ${replyTo.name}`;
    } else {
      clearReplyMode();
    }

    window.setTimeout(() => {
      if (!nameInput.value.trim()) nameInput.focus();
      else textInput.focus();
    }, 30);

    composer.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }

  function closeComposer() {
    composer.hidden = true;
    openButton.setAttribute('aria-expanded', 'false');
    composer.reset();
    status.textContent = '';
    clearReplyMode();
  }

  function clearReplyMode() {
    parentInput.value = '';
    replyContext.hidden = true;
    replyContextText.textContent = '';
  }

  function toggleLike(commentId) {
    const comment = comments.find((item) => item.id === commentId);
    if (!comment) return;

    const alreadyLiked = likedCommentIds.includes(commentId);
    const currentLikes = Number(comment.likes) || 0;

    if (alreadyLiked) {
      comment.likes = Math.max(0, currentLikes - 1);
      likedCommentIds = likedCommentIds.filter((id) => id !== commentId);
    } else {
      comment.likes = currentLikes + 1;
      likedCommentIds.push(commentId);
    }

    saveComments();
    saveLikedCommentIds();
    renderComments();
  }

  function createCommentElement(comment, depth = 0) {
    const article = document.createElement('article');
    article.className = 'comment';

    if (depth > 0) article.classList.add('comment--reply');

    const avatar = document.createElement('div');
    avatar.className = 'comment-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = initials(comment.name);

    const body = document.createElement('div');
    body.className = 'comment-body';

    const topline = document.createElement('div');
    topline.className = 'comment-topline';

    const author = document.createElement('p');
    author.className = 'comment-author';
    author.textContent = comment.name || 'Anonymous';

    const date = document.createElement('time');
    date.className = 'comment-date';
    date.dateTime = comment.createdAt || '';
    date.textContent = formatDate(comment.createdAt);

    const text = document.createElement('p');
    text.className = 'comment-text';
    text.textContent = comment.text;

    const footer = document.createElement('div');
    footer.className = 'comment-footer';

    const likeButton = document.createElement('button');
    likeButton.className = 'comment-action';
    likeButton.type = 'button';

    const liked = likedCommentIds.includes(comment.id);
    likeButton.setAttribute('aria-pressed', liked ? 'true' : 'false');
    likeButton.textContent = `${liked ? '♥' : '♡'} ${Number(comment.likes) || 0}`;

    likeButton.addEventListener('click', () => {
      toggleLike(comment.id);
    });

    const replyButton = document.createElement('button');
    replyButton.className = 'comment-action';
    replyButton.type = 'button';
    replyButton.textContent = 'Reply';

    replyButton.addEventListener('click', () => {
      openComposer(comment);
    });

    topline.append(author, date);
    footer.append(likeButton, replyButton);
    body.append(topline, text, footer);
    article.append(avatar, body);

    const fragment = document.createDocumentFragment();
    fragment.appendChild(article);

    childrenFor(comment.id).forEach((child) => {
      fragment.appendChild(
        createCommentElement(child, Math.min(depth + 1, 3))
      );
    });

    return fragment;
  }

  function renderComments() {
    list.replaceChildren();

    if (!comments.length) {
      empty.hidden = false;
      list.appendChild(empty);
      return;
    }

    empty.hidden = true;

    topLevelComments().forEach((comment) => {
      list.appendChild(createCommentElement(comment));
    });
  }

  openButton.addEventListener('click', () => {
    if (composer.hidden) openComposer();
    else closeComposer();
  });

  cancelButton.addEventListener('click', closeComposer);
  cancelReplyButton.addEventListener('click', clearReplyMode);
  sortSelect.addEventListener('change', renderComments);

  composer.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    status.textContent = '';

    if (!name || !text) {
      status.textContent = 'Please add your name and a comment.';
      if (!name) nameInput.focus();
      else textInput.focus();
      return;
    }

    comments.push({
      id: createId(),
      name,
      text,
      createdAt: new Date().toISOString(),
      parentId: parentInput.value || null,
      likes: 0
    });

    saveComments();
    renderComments();

    const savedName = name;
    composer.reset();
    nameInput.value = savedName;
    clearReplyMode();

    status.textContent = 'Your comment was added.';
    textInput.focus();
  });

  renderComments();
});
