/* winkelwagen.js — Vers Le Vin
   Renders cart, handles quantities, sends customer to Google Form.
   ---------------------------------------------------------------- */

const WINE_CATALOGUE = {
  'colette':             { domaine: 'Domaine de Colette',        name: '2024',                        price: 15.90, img: 'images/COLE1.jpg' },
  'spes':                { domaine: 'Domaine les Vignes en M',   name: 'Spes 2024',                   price: 16.90, img: 'images/spec.jpg' },
  'filrouge':            { domaine: 'Domaine de La Roche',       name: 'Le Fil Rouge 2023',           price: 18.00, img: 'images/lefilrouge.jpg' },
  'auxvergers':          { domaine: 'Château des Vergers',       name: 'Aux Vergers 2023',            price: 18.00, img: 'images/cosimalandscape.jpg' },
  'mi':                  { domaine: 'Domaine de Romarand',       name: 'Mi 2023',                     price: 18.00, img: 'images/pi.jpg' },
  'alpha':               { domaine: 'Domaine de Romarand',       name: 'Alpha 2023',                  price: 24.90, img: 'images/alfa.jpg' },
  'fbrood':              { domaine: 'Domaine Frédéric Berne',    name: 'Aux Vergers 2023',            price: 22.00, img: 'images/FBROOD1.jpg' },
  'croixblanche':        { domaine: 'Domaine de La Roche',       name: 'La Croix Blanche 2020',       price: 21.00, img: 'images/lacroixblanche.jpg' },
  'aliopacto':           { domaine: 'Domaine les Capréoles',     name: 'Alio Pacto 2023',             price: 32.00, img: 'images/aliopacto.jpg' },
  'rochebl':             { domaine: 'Domaine de La Roche',       name: 'Beaujolais Lantignié 2023',   price: 14.90, img: 'images/rocheb.jpg' },
  'diaclase':            { domaine: 'Domaine les Capréoles',     name: 'Diaclase 2023',               price: 22.00, img: 'images/DIA1.jpg' },
  'vignes':              { domaine: 'Les Vignes de M',           name: 'Vernus 2024',                 price: 21.00, img: 'images/vignes.jpg' },
  'irancy-mouroux':      { domaine: 'William Charriat',          name: 'Mouroux 2019',                price: 29.00, img: 'images/irancy02.png' },
  'irancy-rood':         { domaine: 'William Charriat',          name: 'Irancy 2021 & 2022',          price: 22.00, img: 'images/irancy03.png' },
  'irancy-rose':         { domaine: 'William Charriat',          name: 'Bourgogne Rosé 2023',         price: 16.00, img: 'images/irancy01.jpg' },
  'leblanc':             { domaine: 'Château des Vergers',       name: 'Le Blanc 2024',               price: 21.50, img: 'images/cosimaface.jpg' },
  'fblanc':              { domaine: 'Domaine Frédéric Berne',    name: 'Blanc 2024',                  price: 21.90, img: 'images/FBWIT1.jpg' },
  'chablis-grandchaume': { domaine: 'Château de Fleys',         name: 'La Grand Chaume 2023',        price: 22.00, img: 'images/chablis01.jpg' },
  'chablis-2024':        { domaine: 'Château de Fleys',         name: 'Chablis 2024',                price: 21.00, img: 'images/chablis05.jpg' },
  'chablis-leclos':      { domaine: 'Château de Fleys',         name: "Monopole 'Le Clos' 2024",     price: 27.00, img: 'images/chablis04.jpg' },
  'chablis-montmilieux': { domaine: 'Château de Fleys',         name: '1er Cru Mont de Milieu 2023', price: 31.50, img: 'images/chablis03.jpg' },
  'chablis-vv':          { domaine: 'Château de Fleys',         name: '1er Cru Mont de Milieu VV 2023', price: 34.00, img: 'images/chablis02.jpg' },
};

/* ── HELPERS ── */
function getCart() {
  try { return JSON.parse(localStorage.getItem('vlv_cart') || '{}'); }
  catch { return {}; }
}

function saveCart(cart) {
  localStorage.setItem('vlv_cart', JSON.stringify(cart));
}

function fmt(price) {
  return '€ ' + price.toFixed(2).replace('.', ',');
}

function cartTotal(cart) {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const w = WINE_CATALOGUE[id];
    return w ? sum + w.price * qty : sum;
  }, 0);
}

/* ── RENDER CART ── */
function renderCart() {
  const cart    = getCart();
  const entries = Object.entries(cart).filter(([id]) => WINE_CATALOGUE[id]);
  const emptyEl = document.getElementById('cartEmpty');
  const wrapEl  = document.getElementById('cartItemsWrap');
  const rightEl = document.getElementById('cartRight');
  const itemsEl = document.getElementById('cartItems');

  if (!entries.length) {
    emptyEl.style.display = 'block';
    wrapEl.style.display  = 'none';
    if (rightEl) rightEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  wrapEl.style.display  = 'block';
  if (rightEl) rightEl.style.display = 'block';

  itemsEl.innerHTML = entries.map(([id, qty]) => {
    const w = WINE_CATALOGUE[id];
    return `
      <div class="cart-item">
        <div class="cart-item-info">
          <img class="cart-item-img" src="${w.img}" alt="${w.name}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="cart-item-img-placeholder" style="display:none">🍷</div>
          <div>
            <div class="cart-item-domaine">${w.domaine}</div>
            <div class="cart-item-name">${w.name}</div>
            <div class="cart-item-unit-price">${fmt(w.price)} / fles</div>
            <button class="cart-item-remove" onclick="removeItem('${id}')">Verwijderen</button>
          </div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty('${id}', -1)" aria-label="Minder">−</button>
          <span class="qty-value">${qty}</span>
          <button class="qty-btn" onclick="changeQty('${id}', 1)" aria-label="Meer">+</button>
        </div>
        <div class="cart-item-price">${fmt(w.price * qty)}</div>
      </div>`;
  }).join('');

  renderSummary(cart, entries);
}

function renderSummary(cart, entries) {
  const lines = document.getElementById('summaryLines');
  const total = document.getElementById('summaryTotal');
  if (!lines || !total) return;

  lines.innerHTML = entries.map(([id, qty]) => {
    const w = WINE_CATALOGUE[id];
    return `<div class="summary-line">
      <span>${qty}× ${w.name}</span>
      <span>${fmt(w.price * qty)}</span>
    </div>`;
  }).join('');

  total.textContent = fmt(cartTotal(cart));
}

/* ── QUANTITY CONTROLS ── */
function changeQty(id, delta) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  updateNavBadge();
  renderCart();
}

function removeItem(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  updateNavBadge();
  renderCart();
}

/* ── GO TO GOOGLE FORM ── */
function goToForm() {
  const cart    = getCart();
  const entries = Object.entries(cart).filter(([id]) => WINE_CATALOGUE[id]);

  if (!entries.length) {
    alert('Uw winkelwagen is leeg.');
    return;
  }

  /* ================================================================
     Paste your Google Form shareable URL here.
     Go to your form → click Send → copy the link.
     It looks like: https://forms.gle/xxxxxxxxx
     or: https://docs.google.com/forms/d/e/YOUR_ID/viewform
     ================================================================ */
  const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_LINK_HERE';

  window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
}

/* ── NAV BADGE ── */
function updateNavBadge() {
  const badge = document.getElementById('navCartBadge');
  if (!badge) return;
  const cart  = getCart();
  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  badge.textContent    = count;
  badge.style.display  = count > 0 ? 'flex' : 'none';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateNavBadge();
});