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
   WINKEL CARD FLIP (simple single flip)
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("winkelCard");
  if (!card) return;

  let flipped = false;

  function setFlipped(state) {
    flipped = state;
    card.classList.toggle("is-flipped", flipped);
    card.setAttribute("aria-pressed", flipped ? "true" : "false");
  }

  card.addEventListener("pointerup", (e) => {
    if (flipped && e.target.closest("a")) return;
    setFlipped(!flipped);
  });

  card.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    setFlipped(!flipped);
  });

  document.addEventListener("pointerdown", (e) => {
    if (!flipped) return;
    if (card.contains(e.target)) return;
    setFlipped(false);
  });
});


/* =========================
   TERROIR CARD — AUTOPLAY MULTI-PHOTO FLIP
   Front cycles through several photos automatically,
   each paired with a keyword. Clicking advances early.
   Double-click flips to the back (video + info).
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("terroirCard");
  const frontImg = document.getElementById("terroirFrontImg");
  const counter = document.getElementById("terroirCounter");
  const keywordEl = document.getElementById("terroirKeyword");
  if (!card || !frontImg || !counter || !keywordEl) return;

  /* ─── PHOTOS + KEYWORDS — edit this list to add your own ─── */
  const slides = [
    { img: "images/wijnenik.jpg", keyword: "Wijn en Ik" },
    { img: "images/arthistory.jpg",       keyword: "Art History" },
    { img: "images/wijnenmensen.jpg",       keyword: "Wine" },
    { img: "images/naturrenik.jpg",       keyword: "Nature" }
  ];

  /* Fixed timing — 5s per photo, 1.3s flip (matches the CSS transition) */
  const SECONDS_PER_PHOTO = 5;
  const FLIP_DURATION_MS = 1300;

  let index = 0;
  let isShowingBack = false;
  let autoplayTimer = null;

  function showSlide(i) {
    index = ((i % slides.length) + slides.length) % slides.length;
    frontImg.src = slides[index].img;
    keywordEl.textContent = slides[index].keyword;
    counter.textContent = (index + 1) + "/" + slides.length;
  }

  function advanceSlide() {
    card.classList.add("is-flipped");
    setTimeout(() => {
      showSlide(index + 1);
      card.classList.remove("is-flipped");
    }, FLIP_DURATION_MS * 0.55);
  }

  function startAutoplay() {
    stopAutoplay();
    if (isShowingBack) return;
    autoplayTimer = setInterval(advanceSlide, SECONDS_PER_PHOTO * 1000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  card.addEventListener("pointerup", (e) => {
    if (isShowingBack && e.target.closest("a")) return;

    if (!isShowingBack) {
      advanceSlide();
      startAutoplay();
    } else {
      isShowingBack = false;
      card.classList.remove("is-flipped");
      startAutoplay();
    }
  });

  card.addEventListener("dblclick", (e) => {
    e.preventDefault();
    isShowingBack = true;
    stopAutoplay();
    card.classList.add("is-flipped");
  });

  card.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (!isShowingBack) {
      advanceSlide();
      startAutoplay();
    }
  });

  document.addEventListener("pointerdown", (e) => {
    if (card.contains(e.target)) return;
    if (isShowingBack) {
      isShowingBack = false;
      card.classList.remove("is-flipped");
      startAutoplay();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (!isShowingBack) {
      startAutoplay();
    }
  });

  showSlide(0);
  startAutoplay();
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