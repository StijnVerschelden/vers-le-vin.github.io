/* winkelwagen.js — Vers Le Vin
   Renders the cart page, handles quantities, and submits the order form.
   This file runs ONLY on winkelwagen.html.
   -------------------------------------------------------------------- */

/* ── WINE CATALOGUE
   Must match the data in winkel.js WINES array exactly.
   id, name, domaine, price, img are used for the cart display.
   ---------------------------------------------------------------- */
const WINE_CATALOGUE = {
  /* Beaujolais Lantignié — Rood */
  'colette':       { domaine: 'Domaine de Colette',          name: '2024',                      price: 15.90, img: 'images/COLE1.jpg' },
  'spes':          { domaine: 'Domaine les Vignes en M',     name: 'Spes 2024',                 price: 16.90, img: 'images/spec.jpg' },
  'filrouge':      { domaine: 'Domaine de La Roche',         name: 'Le Fil Rouge 2023',         price: 18.00, img: 'images/lefilrouge.jpg' },
  'auxvergers':    { domaine: 'Château des Vergers',         name: 'Aux Vergers 2023',          price: 18.00, img: 'images/cosimalandscape.jpg' },
  'mi':            { domaine: 'Domaine de Romarand',         name: 'Mi 2023',                   price: 18.00, img: 'images/pi.jpg' },
  'alpha':         { domaine: 'Domaine de Romarand',         name: 'Alpha 2023',                price: 24.90, img: 'images/alfa.jpg' },
  'fbrood':        { domaine: 'Domaine Frédéric Berne',      name: 'Aux Vergers 2023',          price: 22.00, img: 'images/FBROOD1.jpg' },
  'croixblanche':  { domaine: 'Domaine de La Roche',         name: 'La Croix Blanche 2020',     price: 21.00, img: 'images/lacroixblanche.jpg' },
  'aliopacto':     { domaine: 'Domaine les Capréoles',       name: 'Alio Pacto 2023',           price: 32.00, img: 'images/aliopacto.jpg' },
  'rochebl':       { domaine: 'Domaine de La Roche',         name: 'Beaujolais Lantignié 2023', price: 14.90, img: 'images/rocheb.jpg' },
  'diaclase':      { domaine: 'Domaine les Capréoles',       name: 'Diaclase 2023',             price: 22.00, img: 'images/DIA1.jpg' },
  'vignes':        { domaine: 'Les Vignes de M',             name: 'Vernus 2024',               price: 21.00, img: 'images/vignes.jpg' },
  /* Irancy */
  'irancy-mouroux':{ domaine: 'William Charriat',            name: 'Mouroux 2019',              price: 29.00, img: 'images/irancy02.png' },
  'irancy-rood':   { domaine: 'William Charriat',            name: 'Irancy 2021 & 2022',        price: 22.00, img: 'images/irancy03.png' },
  'irancy-rose':   { domaine: 'William Charriat',            name: 'Bourgogne Rosé 2023',       price: 16.00, img: 'images/irancy01.jpg' },
  /* Beaujolais Lantignié — Wit */
  'leblanc':       { domaine: 'Château des Vergers',         name: 'Le Blanc 2024',             price: 21.50, img: 'images/cosimaface.jpg' },
  'fblanc':        { domaine: 'Domaine Frédéric Berne',      name: 'Blanc 2024',                price: 21.90, img: 'images/FBWIT1.jpg' },
  /* Chablis */
  'chablis-grandchaume': { domaine: 'Château de Fleys',     name: 'La Grand Chaume 2023',      price: 22.00, img: 'images/chablis01.jpg' },
  'chablis-2024':        { domaine: 'Château de Fleys',     name: 'Chablis 2024',              price: 21.00, img: 'images/chablis05.jpg' },
  'chablis-leclos':      { domaine: 'Château de Fleys',     name: "Monopole 'Le Clos' 2024",   price: 27.00, img: 'images/chablis04.jpg' },
  'chablis-montmilieux': { domaine: 'Château de Fleys',     name: '1er Cru Mont de Milieu 2023', price: 31.50, img: 'images/chablis03.jpg' },
  'chablis-vv':          { domaine: 'Château de Fleys',     name: '1er Cru Mont de Milieu VV 2023', price: 34.00, img: 'images/chablis02.jpg' },
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
    const wine = WINE_CATALOGUE[id];
    return wine ? sum + wine.price * qty : sum;
  }, 0);
}

/* ── RENDER CART ── */
function renderCart() {
  const cart = getCart();
  const entries = Object.entries(cart).filter(([id]) => WINE_CATALOGUE[id]);
  const itemsEl  = document.getElementById('cartItems');
  const emptyEl  = document.getElementById('cartEmpty');
  const wrapEl   = document.getElementById('cartItemsWrap');
  const rightEl  = document.getElementById('cartRight');
  const submitEl = document.getElementById('btnSubmit');

  if (!entries.length) {
    emptyEl.style.display = 'block';
    wrapEl.style.display  = 'none';
    rightEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  wrapEl.style.display  = 'block';
  rightEl.style.display = 'block';
  submitEl.disabled = false;

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

/* ── SHOW/HIDE ADDRESS FIELDS ── */
document.getElementById('fDelivery').addEventListener('change', function () {
  const addr = document.getElementById('addressFields');
  addr.style.display = this.value === 'Levering België' ? 'block' : 'none';
});

/* ── FORM SUBMISSION → GOOGLE FORM ── */
function submitOrder() {
  const name     = document.getElementById('fName').value.trim();
  const email    = document.getElementById('fEmail').value.trim();
  const phone    = document.getElementById('fPhone').value.trim();
  const delivery = document.getElementById('fDelivery').value;
  const street   = document.getElementById('fStreet').value.trim();
  const zip      = document.getElementById('fZip').value.trim();
  const city     = document.getElementById('fCity').value.trim();
  const note     = document.getElementById('fNote').value.trim();

  if (!name)     { alert('Vul uw naam in.'); document.getElementById('fName').focus(); return; }
  if (!email)    { alert('Vul uw e-mailadres in.'); document.getElementById('fEmail').focus(); return; }
  if (!delivery) { alert('Kies levering of afhalen.'); document.getElementById('fDelivery').focus(); return; }

  const cart    = getCart();
  const entries = Object.entries(cart).filter(([id]) => WINE_CATALOGUE[id]);
  const total   = cartTotal(cart);

  /* Build the order text for the Google Form */
  const orderLines = entries.map(([id, qty]) => {
    const w = WINE_CATALOGUE[id];
    return `${qty}x ${w.domaine} – ${w.name} (${fmt(w.price)})`;
  }).join('\n');

  const orderText = orderLines + '\n\nTotaal: ' + fmt(total);

  let adresText = delivery;
  if (delivery === 'Levering België' && street) {
    adresText += ' — ' + street + ', ' + zip + ' ' + city;
  }

  /* ================================================================
     GOOGLE FORM INTEGRATION
     ─────────────────────────────────────────────────────────────────
     How to set this up:
     1. Go to forms.google.com → create a new form with these fields:
        - Naam (short text)
        - E-mailadres (short text)
        - Telefoonnummer (short text)
        - Bestelling (paragraph)
        - Levering / afhalen (short text)
        - Opmerking (paragraph)

     2. Click ⋮ → Get pre-filled link → fill dummy values → copy URL.
        The URL contains entry.XXXXXXXXX= for each field.

     3. Replace the entry IDs below with your real ones:
        ENTRY_NAME     → entry ID for Naam
        ENTRY_EMAIL    → entry ID for E-mailadres
        ENTRY_PHONE    → entry ID for Telefoonnummer
        ENTRY_ORDER    → entry ID for Bestelling
        ENTRY_DELIVERY → entry ID for Levering / afhalen
        ENTRY_NOTE     → entry ID for Opmerking

     4. Replace FORM_ID with your real form ID from the URL:
        https://docs.google.com/forms/d/e/FORM_ID/viewform
     ================================================================ */

  const FORM_ID        = 'YOUR_FORM_ID_HERE';
  const ENTRY_NAME     = 'entry.000000001';
  const ENTRY_EMAIL    = 'entry.000000002';
  const ENTRY_PHONE    = 'entry.000000003';
  const ENTRY_ORDER    = 'entry.000000004';
  const ENTRY_DELIVERY = 'entry.000000005';
  const ENTRY_NOTE     = 'entry.000000006';

  const formBase = `https://docs.google.com/forms/d/e/${FORM_ID}/viewform`;
  const params   = new URLSearchParams({
    [ENTRY_NAME]:     name,
    [ENTRY_EMAIL]:    email,
    [ENTRY_PHONE]:    phone,
    [ENTRY_ORDER]:    orderText,
    [ENTRY_DELIVERY]: adresText,
    [ENTRY_NOTE]:     note,
    usp:              'pp_url',
  });

  const formUrl = formBase + '?' + params.toString();

  /* Open the Google Form in a new tab */
  window.open(formUrl, '_blank', 'noopener,noreferrer');

  /* Show success screen and clear cart */
  document.getElementById('successEmail').textContent = email;
  document.getElementById('orderSuccess').style.display = 'flex';
  localStorage.removeItem('vlv_cart');
  updateNavBadge();
}

/* ── NAV BADGE ── */
function updateNavBadge() {
  const badge = document.getElementById('navCartBadge');
  if (!badge) return;
  const cart = getCart();
  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateNavBadge();
});