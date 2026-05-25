/* winkel.js — Vers Le Vin
   Includes: age gate, hamburger nav, cart system, floating cart button.
   ---------------------------------------------------------------- */

/* =========================
   AGE GATE
   ========================= */
document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("ageVerified") === "true") return;

  let gate = document.getElementById("ageGate");
  if (!gate) {
    gate = document.createElement("div");
    gate.id = "ageGate";
    gate.setAttribute("data-nosnippet", "");
    gate.innerHTML = `
      <div class="age-modal" role="dialog" aria-modal="true" aria-labelledby="ageGateTitle">
        <h2 id="ageGateTitle">Bent u 18 jaar of ouder?</h2>
        <p>U moet de wettelijke leeftijd hebben om alcohol te kopen.</p>
        <div class="age-actions">
          <button type="button" id="enterBtn">Ja, ik ben 18+</button>
          <button type="button" id="leaveBtn">Nee</button>
        </div>
      </div>
    `;
    document.body.appendChild(gate);
  }

  gate.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  document.addEventListener("click", (e) => {
    if (e.target.id === "enterBtn") {
      localStorage.setItem("ageVerified", "true");
      document.getElementById("ageGate")?.classList.add("hidden");
      document.body.style.overflow = "";
    }
    if (e.target.id === "leaveBtn") {
      window.location.href = "https://www.google.com";
    }
  }, true);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !gate.classList.contains("hidden")) {
      window.location.href = "https://www.google.com";
    }
  });
});


/* =========================
   MOBILE HAMBURGER
   ========================= */
(function () {
  const navWrap   = document.querySelector('.nav-wrap');
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


/* =========================
   DROPDOWN BUTTONS
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  ['lantBtn', 'wijnBtn', 'blogBtn'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      const menu = btn.nextElementSibling;
      if (menu) menu.style.display = expanded ? 'none' : 'block';
    });
  });

  document.addEventListener('click', (e) => {
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
});


/* =========================
   CART SYSTEM
   ========================= */

function getCart() {
  try { return JSON.parse(localStorage.getItem('vlv_cart') || '{}'); }
  catch { return {}; }
}

function saveCart(cart) {
  localStorage.setItem('vlv_cart', JSON.stringify(cart));
}

function getCartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((s, q) => s + q, 0);
}

function updateNavCartBadge() {
  const count = getCartCount();

  /* ── nav badge ── */
  const badge = document.getElementById('navCartBadge');
  if (badge) {
    badge.textContent   = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  /* ── floating button ── */
  const floatBtn   = document.querySelector('.cart-float');
  const floatCount = document.getElementById('floatCartCount');
  if (floatCount) floatCount.textContent = count;
  if (floatBtn)   floatBtn.classList.toggle('visible', count > 0);
}

function addToCart(wineId, btn) {
  if (!wineId) return;
  const cart = getCart();
  cart[wineId] = (cart[wineId] || 0) + 1;
  saveCart(cart);
  updateNavCartBadge();

  /* visual feedback */
  const original = btn.textContent;
  btn.textContent  = '✓ Toegevoegd';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent  = original;
    btn.style.opacity = '';
  }, 1200);
}

/* =========================
   DOM READY — inject UI + bind buttons
   ========================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ── nav cart icon ── */
  const navUl = document.querySelector('.nav-wrap nav ul');
  if (navUl) {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="winkelwagen.html" class="nav-cart-link" aria-label="Winkelwagen">
        🛒
        <span class="nav-cart-badge" id="navCartBadge" style="display:none">0</span>
      </a>`;
    navUl.appendChild(li);
  }

  /* ── floating cart button ── */
  const floatBtn = document.createElement('a');
  floatBtn.href      = 'winkelwagen.html';
  floatBtn.className = 'cart-float';
  floatBtn.setAttribute('aria-label', 'Winkelwagen bekijken');
  floatBtn.innerHTML = `
    <span class="cart-float-icon">🛒</span>
    <span class="cart-float-label">Winkelwagen</span>
    <span class="cart-float-count" id="floatCartCount">0</span>`;
  document.body.appendChild(floatBtn);

  /* ── initialise badges ── */
  updateNavCartBadge();

  /* ── bind "In de winkel" buttons ── */
  document.querySelectorAll('.btn-bestel:not(.sold-out)').forEach(btn => {
    const article  = btn.closest('article');
    const leesLink = article?.querySelector('.btn-lees');
    let wineId     = article?.dataset?.wineId;

    if (!wineId && leesLink) {
      const href = leesLink.getAttribute('href') || '';
      wineId = href.replace('winkel-', '').replace('.html', '');
    }

    btn.addEventListener('click', () => addToCart(wineId, btn));
  });
});


/* =========================
   WINKEL-DETAIL PAGE SUPPORT
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const detailBtn = document.querySelector('.btn-bestel-lg');
  if (!detailBtn) return;

  const wineId = document.body.dataset.wineId;
  if (!wineId) return;

  detailBtn.addEventListener('click', () => {
    addToCart(wineId, detailBtn);
  });
});