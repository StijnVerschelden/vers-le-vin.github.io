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
   TERROIR CARD — CONTINUOUS TWO-FACE IMAGE CYCLE
   The card has two physical faces (A = front, B = back).
   It just keeps flipping between them forever. Each time a
   face is hidden (facing away from the viewer), we quietly
   update its image to the NEXT one in the sequence — so when
   it swings back around, it shows new content. This gives a
   continuous slideshow with no "video/info" side at all.
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("terroirCard");
  if (!card) return;

  const imgA = document.getElementById("terroirImgA");
  const imgB = document.getElementById("terroirImgB");
  const keywordA = document.getElementById("terroirKeywordA");
  const keywordB = document.getElementById("terroirKeywordB");
  const counterA = document.getElementById("terroirCounterA");
  const counterB = document.getElementById("terroirCounterB");
  if (!imgA || !imgB) return;

  /* ─── IMAGES + KEYWORDS — add as many as you like here ───
     Later you can swap any "img" value for a short video or GIF
     by changing the markup; the cycling logic stays the same. */
  const slides = [
    { img: "images/beelden/wijnenik.jpg",     keyword: "Wijn en Ik" },
    { img: "images/beelden/arthistory.jpg",   keyword: "Art History" },
    { img: "images/beelden/wijnenmensen.jpg", keyword: "Wine" },
    { img: "images/beelden/naturrenik.jpg",   keyword: "Nature" }
  ];

  /* ─── TIMING ───
     SECONDS_PER_SLIDE: how long each image stays visible —
       keep this generous enough that the keyword text is readable.
     FLIP_DURATION_MS: must match the CSS transition duration above
       (.side-card.multi-flip transition). */
  const SECONDS_PER_SLIDE = 5.5;
  const FLIP_DURATION_MS = 1400;

  /* index of the slide currently shown on face A, and on face B */
  let indexA = 0;
  let indexB = 1 % slides.length;
  let showingA = true; // true = face A is facing the viewer right now
  let autoplayTimer = null;
  let paused = false;

  function paint(imgEl, keywordEl, counterEl, slideIndex) {
    const slide = slides[slideIndex % slides.length];
    imgEl.src = slide.img;
    keywordEl.textContent = slide.keyword;
    counterEl.textContent = (slideIndex % slides.length + 1) + "/" + slides.length;
  }

  function nextIndex(current) {
    return (current + 2) % slides.length; // skip by 2 since A and B alternate
  }

  function flipOnce() {
    card.classList.toggle("is-flipped", showingA);
    // The face now going OUT of view is the one that was showing;
    // wait until it's fully turned away, then update it to the
    // slide that will be needed two flips from now.
    setTimeout(() => {
      if (showingA) {
        indexB = nextIndex(indexB);
        paint(imgB, keywordB, counterB, indexB);
      } else {
        indexA = nextIndex(indexA);
        paint(imgA, keywordA, counterA, indexA);
      }
      showingA = !showingA;
    }, FLIP_DURATION_MS * 0.55);
  }

  function startAutoplay() {
    stopAutoplay();
    if (paused) return;
    autoplayTimer = setInterval(flipOnce, SECONDS_PER_SLIDE * 1000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  /* Manual click advances immediately and resets the timer */
  card.addEventListener("pointerup", () => {
    flipOnce();
    startAutoplay();
  });

  card.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    flipOnce();
    startAutoplay();
  });

  /* Pause/resume when the browser tab is hidden/visible */
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  /* Initial paint */
  paint(imgA, keywordA, counterA, indexA);
  paint(imgB, keywordB, counterB, indexB);
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