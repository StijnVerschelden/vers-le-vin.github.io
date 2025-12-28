/* =========================
   AGE GATE (ROBUST + CLICKABLE)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  // If user already verified, do nothing
  if (localStorage.getItem("ageVerified") === "true") return;

  // Create/inject gate if missing
  let gate = document.getElementById("ageGate");
  if (!gate) {
    gate = document.createElement("div");
    gate.id = "ageGate";
    gate.setAttribute("data-nosnippet", "");
    gate.innerHTML = `
      <div class="age-modal" role="dialog" aria-modal="true" aria-labelledby="ageGateTitle">
        <h2 id="ageGateTitle">Are you 18 or older?</h2>
        <p>You must be of legal drinking age to enter this website.</p>
        <div class="age-actions">
          <button type="button" id="enterBtn">Yes, I am 18+</button>
          <button type="button" id="leaveBtn">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(gate);
  }

  // Make sure it's visible (CSS controls layout)
  gate.classList.remove("hidden");


  // Prevent background scrolling while gate is open
  document.body.style.overflow = "hidden";

  // Delegate clicks so buttons always work
  gate.addEventListener("click", (e) => {
    const id = e.target && e.target.id;

    if (id === "enterBtn") {
      localStorage.setItem("ageVerified", "true");
      gate.classList.add("hidden");
      document.body.style.overflow = ""; // restore scroll
    }

    if (id === "leaveBtn") {
      window.location.href = "https://www.google.com";
    }
  });

  // Accessibility: ESC = leave
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !gate.classList.contains("hidden")) {
      window.location.href = "https://www.google.com";
    }
  });
});


/* =========================
   DROPDOWN CONTROLS
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const controls = [{ btnId: "lantBtn" }, { btnId: "blogBtn" }];

  controls.forEach((c) => {
    const btn = document.getElementById(c.btnId);
    if (!btn) return;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      const menu = btn.nextElementSibling;
      if (menu) menu.style.display = expanded ? "none" : "block";
    });

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        btn.setAttribute("aria-expanded", "false");
        const menu = btn.nextElementSibling;
        if (menu) menu.style.display = "none";
        btn.blur();
      }
    });
  });

  document.addEventListener("click", (e) => {
    controls.forEach((c) => {
      const btn = document.getElementById(c.btnId);
      if (!btn) return;

      const menu = btn.nextElementSibling;
      if (!menu) return;

      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        btn.setAttribute("aria-expanded", "false");
        menu.style.display = "none";
      }
    });
  });
});


/* =========================
   LOGO CARD FLIP (GUARDED: NO CRASH)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const logoCard = document.getElementById("logoCard");
  const hint = document.querySelector(".hover-hint");

  if (!logoCard) return; // IMPORTANT: prevents JS crash on pages without logoCard

  let isFlipped = false;

  logoCard.addEventListener("touchstart", () => {
    isFlipped = !isFlipped;
    logoCard.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
    if (hint) hint.style.opacity = "0";
  });

  // Hide hint on desktop click as well
  logoCard.addEventListener("click", () => {
    if (hint) hint.style.opacity = "0";
  });
});


/* =========================
   MOBILE HAMBURGER TOGGLE
   ========================= */
(function () {
  const navWrap = document.querySelector(".nav-wrap");
  const hamburger = document.querySelector(".hamburger");
  if (!navWrap || !hamburger) return;

  function setOpen(open) {
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    navWrap.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!navWrap.classList.contains("open"));
  });

  document.addEventListener("click", (e) => {
    if (!navWrap.classList.contains("open")) return;
    if (!navWrap.contains(e.target)) setOpen(false);
  });

  window.addEventListener("resize", () => setOpen(false));
})();
