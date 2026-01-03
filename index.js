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

  document.addEventListener("click", (e) => {
  if (e.target.id === "enterBtn") {
    localStorage.setItem("ageVerified", "true");
    document.getElementById("ageGate")?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  if (e.target.id === "leaveBtn") {
    window.location.href = "https://www.google.com";
  }
}, true); // capture phase

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
  if (!logoCard) return;

  let isFlipped = false;

function flip(toBack) {
    isFlipped = toBack;
    logoCard.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
    logoCard.classList.toggle("flipped", isFlipped);
    if (hint) hint.style.opacity = "0";

 function resetBackToFirstSlide() {
  const row = logoCard.querySelector(".card-back .back-row");
  if (!row) return;

  // hide arrow reset state (it will show again when flipped)
  logoCard.classList.remove("swiped");

  // snap to first slide reliably
  row.scrollTo({ left: 0, behavior: "auto" });
 }

 function armSwipeHintAutoHide() {
  const row = logoCard.querySelector(".card-back .back-row");
  if (!row) return;

  const onFirstUserScroll = () => {
    logoCard.classList.add("swiped");      // hides arrow via CSS
    row.removeEventListener("scroll", onFirstUserScroll, { passive: true });
  };

  row.addEventListener("scroll", onFirstUserScroll, { passive: true, once: true });
}

 // ✅ on flip: start at first slide + prepare swipe hint
 if (isFlipped) {
  requestAnimationFrame(() => {
    resetBackToFirstSlide();
    armSwipeHintAutoHide();
  });
 }
}

  // Tap card to flip (but DON'T flip when swiping on media/captions)
 logoCard.addEventListener("touchstart", (e) => {
  // if user touches gallery, do NOT flip
  if (e.target.closest(".back-row")) return;

  isFlipped = !isFlipped;
  logoCard.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
  logoCard.classList.toggle("flipped", isFlipped);

  if (hint) hint.style.opacity = "0";
 if (isFlipped) {
    requestAnimationFrame(() => {
      const row = logoCard.querySelector(".card-back .back-row");
      if (!row) return;
      logoCard.classList.remove("swiped");
      row.scrollTo({ left: 0, behavior: "auto" });

      // hide arrow after first swipe
      const onScrollOnce = () => logoCard.classList.add("swiped");
      row.addEventListener("scroll", onScrollOnce, { passive: true, once: true });
    });
  }
}, { passive: true });

  // Desktop click just hides hint
  logoCard.addEventListener("click", () => {
    if (hint) hint.style.opacity = "0";
  });

  // ✅ Tap outside the card to flip back (red X zones)
  document.addEventListener("pointerdown", (e) => {
  if (!isFlipped) return;
  if (logoCard.contains(e.target)) return;
  isFlipped = false;
  logoCard.style.transform = "rotateY(0deg)";
  logoCard.classList.remove("flipped");
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
