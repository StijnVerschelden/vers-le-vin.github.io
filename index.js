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
   SHARED FLIP CYCLE FACTORY
   Creates an autoplay two-face image cycle for any card.
   Used for both the Terroir card and the Winkel card —
   same proven logic, no duplication.

   Options:
     cardId        — id of the .side-card element
     imgAId        — id of the <img> on face A
     imgBId        — id of the <img> on face B
     keywordAId    — id of the keyword <span> on face A
     keywordBId    — id of the keyword <span> on face B
     counterAId    — id of the counter <span> on face A
     counterBId    — id of the counter <span> on face B
     slides        — array of { img, keyword } objects
     secondsPerSlide  — how long each photo stays visible
     flipDurationMs   — must match the CSS transition duration
   ========================= */
function createFlipCycle({
  cardId,
  imgAId, imgBId,
  keywordAId, keywordBId,
  counterAId, counterBId,
  slides,
  secondsPerSlide = 5,
  flipDurationMs = 1400,
}) {
  const card     = document.getElementById(cardId);
  const imgA     = document.getElementById(imgAId);
  const imgB     = document.getElementById(imgBId);
  const kwA      = document.getElementById(keywordAId);
  const kwB      = document.getElementById(keywordBId);
  const ctA      = document.getElementById(counterAId);
  const ctB      = document.getElementById(counterBId);
  if (!card || !imgA || !imgB) return;

  const total = slides.length;
  let cursor   = 2 % total;   // next index to assign to the hidden face
  let frontIsA = true;        // true = face A is currently facing viewer
  let timer    = null;

  function paint(imgEl, kwEl, ctEl, i) {
    const s = slides[i % total];
    imgEl.src        = s.img;
    if (kwEl) kwEl.textContent = s.keyword;
    if (ctEl) ctEl.textContent = (i % total + 1) + "/" + total;
  }

  function flipOnce() {
    card.classList.toggle("is-flipped", frontIsA);
    const hiddenIsA = frontIsA;

    setTimeout(() => {
      if (hiddenIsA) {
        paint(imgA, kwA, ctA, cursor);
      } else {
        paint(imgB, kwB, ctB, cursor);
      }
      cursor   = (cursor + 1) % total;
      frontIsA = !frontIsA;
    }, flipDurationMs * 0.55);
  }

  function start() {
    stop();
    timer = setInterval(flipOnce, secondsPerSlide * 1000);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  card.addEventListener("pointerup", () => { flipOnce(); start(); });
  card.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    flipOnce();
    start();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  /* Initial paint */
  paint(imgA, kwA, ctA, 0);
  paint(imgB, kwB, ctB, 1);
  start();
}


/* =========================
   TERROIR CARD — images from beelden/ folder
   NOTE: every entry must end with a comma except the last one.
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  createFlipCycle({
    cardId:      "terroirCard",
    imgAId:      "terroirImgA",
    imgBId:      "terroirImgB",
    keywordAId:  "terroirKeywordA",
    keywordBId:  "terroirKeywordB",
    counterAId:  "terroirCounterA",
    counterBId:  "terroirCounterB",
    secondsPerSlide: 5,
    flipDurationMs:  1400,
    slides: [
      { img: "images/beelden/wijnenik.jpg",     keyword: "Wine" },
      { img: "images/beelden/arthistory.jpg",   keyword: "Art History" },
      { img: "images/beelden/wijnenmensen.jpg", keyword: "Wine Travel" },
      { img: "images/beelden/natuurenik.jpg",   keyword: "Nature" },
      { img: "images/beelden/photography1.jpg", keyword: "Analog Photography" },
      { img: "images/beelden/filmmaker1.jpg",   keyword: "Filmmaker" },
      { img: "images/beelden/photography2.jpg", keyword: "Photography" },
      { img: "images/beelden/fimposter.jpg",    keyword: "Short Film" },
      { img: "images/beelden/shortfilm2.png",   keyword: "Short Film" }
    ],
  });
});


/* =========================
   WINKEL CARD — wine bottle images wijn1–wijn8
   NOTE: every entry must end with a comma except the last one.
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  createFlipCycle({
    cardId:      "winkelCard",
    imgAId:      "winkelImgA",
    imgBId:      "winkelImgB",
    keywordAId:  "winkelKeywordA",
    keywordBId:  "winkelKeywordB",
    counterAId:  "winkelCounterA",
    counterBId:  "winkelCounterB",
    secondsPerSlide: 5,
    flipDurationMs:  1400,
    slides: [
      { img: "images/FBWIT1.jpg", keyword: "Wit" },
      { img: "images/FBROOD1.jpg", keyword: "Rood" },
      { img: "images/lefilrouge.jpg", keyword: "Rood" },
      { img: "images/lacroixblanche.jpg", keyword: "Rood" },
      { img: "images/pi.jpg", keyword: "Rood" },
      { img: "images/assam.jpg", keyword: "Wit" },
      { img: "images/axiome.jpg", keyword: "Wit" },
      { img: "images/alba.jpg", keyword: "Wit" }
    ],
  });
});


/* =========================
   MOBILE HAMBURGER
   ========================= */
(function () {
  const navWrap   = document.querySelector(".nav-wrap");
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