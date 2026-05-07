/* winkel.js — Vers Le Vin
   Includes: age gate, hamburger nav, placeholder buy buttons.
   ---------------------------------------------------------------- */

/* =========================
   AGE GATE
   Identical pattern to index.js — same localStorage key "ageVerified"
   so verification on any page carries over to all other pages.
   ========================= */
document.addEventListener("DOMContentLoaded", () => {

  // If already verified (on index or any other page), skip immediately
  if (localStorage.getItem("ageVerified") === "true") return;

  // Inject the gate element (same structure as index.js)
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

  // Same capture-phase listener as index.js
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

  // ESC = leave (same as index.js)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !gate.classList.contains("hidden")) {
      window.location.href = "https://www.google.com";
    }
  });
});
/* ── END AGE GATE ─────────────────────────────────────────────── */


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
    alert('De webshop opent binnenkort. Contacteer via info@vers-le-vin.be voor bestellingen.');
  });
});