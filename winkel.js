/* winkel.js — Vers Le Vin
   Navigation only. Payment buttons are intentionally inactive
   until a payment platform (Snipcart / Stripe / Mollie) is chosen.
   ---------------------------------------------------------------- */

// Mobile hamburger toggle — identical to wit.js
(function () {
  const navWrap = document.querySelector('.nav-wrap');
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


/* ----------------------------------------------------------------
   "In de winkel" buttons — placeholder notice
   When you choose your payment platform, replace this block:

   SNIPCART example:
     <button class="btn-bestel snipcart-add-item"
       data-item-id="le-blanc-2024"
       data-item-name="Le Blanc 2024"
       data-item-price="21.50"
       data-item-url="/winkel.html"
       data-item-description="Château des Vergers, Beaujolais Lantignié"
       data-item-image="/images/cosimaface.jpg">
       In de winkel
     </button>

   STRIPE PAYMENT LINK example:
     <a href="https://buy.stripe.com/YOUR_LINK" class="btn-bestel">
       In de winkel
     </a>

   ---------------------------------------------------------------- */

document.querySelectorAll('.btn-bestel').forEach(btn => {
  btn.addEventListener('click', () => {
    // Temporary: inform the visitor the shop is coming soon.
    // Remove this listener once your payment platform is connected.
    alert('De webshop opent binnenkort. Neem contact op via contact.html voor bestellingen.');
  });
});