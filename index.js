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
   DROPDOWN CONTROLS
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const controls = [{ btnId: "lantBtn" }, { btnId: "blogBtn" }, { btnId: "wijnBtn" }];

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
   CENTRE LOGO CARD FLIP
   (existing behaviour — unchanged)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const logoCard = document.getElementById("logoCard");
  const backRow = document.getElementById("backRow");
  const hint = document.querySelector(".hover-hint");
  if (!logoCard) return;

  let isFlipped = false;

  function scrollBackIntoView() {
    if (!window.matchMedia("(max-width: 720px)").matches || !backRow) return;
    setTimeout(() => {
      backRow.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 140);
  }

  function setFlipped(state) {
    isFlipped = state;
    logoCard.classList.toggle("flipped", isFlipped);
    logoCard.setAttribute("aria-pressed", isFlipped ? "true" : "false");
    if (hint) hint.style.opacity = "0";
    if (isFlipped) scrollBackIntoView();
  }

  logoCard.addEventListener("pointerup", (e) => {
    if (isFlipped && e.target.closest("a")) return;
    setFlipped(!isFlipped);
  });

  logoCard.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    setFlipped(!isFlipped);
  });

  document.addEventListener("pointerdown", (e) => {
    if (!isFlipped) return;
    if (logoCard.contains(e.target)) return;
    setFlipped(false);
  });
});


/* =========================
   SIDE CARDS FLIP
   (winkelCard + terriorCard)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  ["winkelCard", "terriorCard"].forEach((id) => {
    const card = document.getElementById(id);
    if (!card) return;

    let flipped = false;

    function setFlipped(state) {
      flipped = state;
      card.classList.toggle("is-flipped", flipped);
      card.setAttribute("aria-pressed", flipped ? "true" : "false");
    }

    card.addEventListener("pointerup", (e) => {
      // Allow clicks on links inside the back face
      if (flipped && e.target.closest("a")) return;
      setFlipped(!flipped);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      setFlipped(!flipped);
    });
  });

  // Click outside any side card → flip it back
  document.addEventListener("pointerdown", (e) => {
    ["winkelCard", "terriorCard"].forEach((id) => {
      const card = document.getElementById(id);
      if (!card) return;
      if (!card.contains(e.target) && card.classList.contains("is-flipped")) {
        card.classList.remove("is-flipped");
        card.setAttribute("aria-pressed", "false");
      }
    });
  });
});


/* =========================
   MOBILE HAMBURGER
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