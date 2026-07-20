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
   (rewritten with simpler, correct logic)

   Instead of juggling two separate "next index" trackers for
   face A and face B (which was error-prone), we now keep ONE
   single counter for "which slide should be visible next",
   and a single boolean for which physical face is currently
   front-facing. Whichever face is about to be HIDDEN gets its
   image updated mid-flip to the slide that will be needed
   the NEXT time it comes back around.
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

  /* ─── IMAGES + KEYWORDS — add as many as you like ─── */
  const slides = [
    { img: "images/beelden/wijnenik.jpg",     keyword: "Wine" },
    { img: "images/beelden/arthistory.jpg",   keyword: "Art History" },
    { img: "images/beelden/wijnenmensen.jpg", keyword: "Wine Travel" },
    { img: "images/beelden/natuurenik.jpg",   keyword: "Nature" },
    { img: "images/beelden/photography1.jpg", keyword: "Analog Photography"},
    { img: "images/beelden/filmmaker2.jpg", keyword: "Filmmaker"},
    {img: "images/beelden/filmposter.png", keyword: "Short Film"},
    { img: "images/beelden/photography2.jpg", keyword: "Travelogue"},
  ];
    

  const SECONDS_PER_SLIDE = 3.5;
  const FLIP_DURATION_MS = 1400;

  /* "cursor" = index of the NEXT slide to be assigned to whichever
     face is currently hidden. Starts at 2 because faces A and B
     already hold slides 0 and 1 from the initial paint below. */
  let cursor = 2 % slides.length;

  /* true = face A is currently the one facing the viewer (card NOT flipped) */
  let frontIsA = true;

  let autoplayTimer = null;

  function paint(imgEl, keywordEl, counterEl, slideIndex) {
    const slide = slides[slideIndex % slides.length];
    imgEl.src = slide.img;
    keywordEl.textContent = slide.keyword;
    counterEl.textContent = (slideIndex % slides.length + 1) + "/" + slides.length;
  }

  function flipOnce() {
    /* Flip the card: if A is currently front, flipping shows B (and vice versa) */
    card.classList.toggle("is-flipped", frontIsA);

    /* The face that is now becoming HIDDEN (the one that was front a
       moment ago) gets repainted partway through the flip, once it's
       turned away from the viewer. */
    const hiddenIsA = frontIsA; // the face going out of view

    setTimeout(() => {
      if (hiddenIsA) {
        paint(imgA, keywordA, counterA, cursor);
      } else {
        paint(imgB, keywordB, counterB, cursor);
      }
      cursor = (cursor + 1) % slides.length;
      frontIsA = !frontIsA;
    }, FLIP_DURATION_MS * 0.55);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(flipOnce, SECONDS_PER_SLIDE * 1000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  });

  /* Initial paint: face A = slide 0, face B = slide 1 */
  paint(imgA, keywordA, counterA, 0);
  paint(imgB, keywordB, counterB, 1);
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

/* =========================
   WINKEL CARD — autoplay wine photo flip
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const card     = document.getElementById("winkelCard");
  const imgA     = document.getElementById("winkelImgA");
  const imgB     = document.getElementById("winkelImgB");
  const kwA      = document.getElementById("winkelKeywordA");
  const kwB      = document.getElementById("winkelKeywordB");
  const ctA      = document.getElementById("winkelCounterA");
  const ctB      = document.getElementById("winkelCounterB");
  if (!card || !imgA || !imgB) return;

  /* ── add your real filenames here ── */
  const slides = [
    { img: "images/FBWIT1.jpg", keyword: "Wit" },
    { img: "images/FBROOD1.jpg", keyword: "Rood" },
    { img: "images/FBWIT2.jpg", keyword: "Wit" },
    { img: "images/FBROOD2.jpg", keyword: "Rood" },
    { img: "images/FBWIT3.jpg", keyword: "Wit" },
    { img: "images/FBROOD3.jpg", keyword: "Rood" },
    { img: "images/FBWIT4.jpg", keyword: "Wit" },
    { img: "images/FBROOD4.jpg", keyword: "Rood" }
  ];

  const SECONDS_PER_SLIDE = 5;
  const FLIP_DURATION_MS  = 1400;
  const total = slides.length;
  let cursor   = 2 % total;
  let frontIsA = true;
  let timer    = null;

  function paint(imgEl, kwEl, ctEl, i) {
    const s = slides[i % total];
    imgEl.src           = s.img;
    kwEl.textContent    = s.keyword;
    ctEl.textContent    = (i % total + 1) + "/" + total;
  }

  function flipOnce() {
    card.classList.toggle("is-flipped", frontIsA);
    const hiddenIsA = frontIsA;
    setTimeout(() => {
      if (hiddenIsA) { paint(imgA, kwA, ctA, cursor); }
      else           { paint(imgB, kwB, ctB, cursor); }
      cursor   = (cursor + 1) % total;
      frontIsA = !frontIsA;
    }, FLIP_DURATION_MS * 0.55);
  }

  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(flipOnce, SECONDS_PER_SLIDE * 1000);
  }

  card.addEventListener("pointerup", () => { flipOnce(); start(); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { clearInterval(timer); } else { start(); }
  });

  paint(imgA, kwA, ctA, 0);
  paint(imgB, kwB, ctB, 1);
  start();
});