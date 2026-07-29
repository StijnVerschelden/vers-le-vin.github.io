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
      <div
        class="age-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ageGateTitle"
      >
        <h2 id="ageGateTitle">Bent u 18 jaar of ouder?</h2>

        <p>
          U moet de wettelijke leeftijd hebben om alcohol te kopen.
        </p>

        <div class="age-actions">
          <button type="button" id="enterBtn">
            Ja, ik ben 18+
          </button>

          <button type="button" id="leaveBtn">
            Nee
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(gate);
  }

  gate.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  document.addEventListener(
    "click",
    (event) => {
      if (event.target.id === "enterBtn") {
        localStorage.setItem("ageVerified", "true");

        document
          .getElementById("ageGate")
          ?.classList.add("hidden");

        document.body.style.overflow = "";
      }

      if (event.target.id === "leaveBtn") {
        window.location.href = "https://www.google.com";
      }
    },
    true
  );

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !gate.classList.contains("hidden")
    ) {
      window.location.href = "https://www.google.com";
    }
  });
});


/* =========================
   DROPDOWN CONTROLS
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const controls = [
    { btnId: "lantBtn" },
    { btnId: "blogBtn" },
    { btnId: "wijnBtn" }
  ];

  controls.forEach((control) => {
    const button = document.getElementById(control.btnId);

    if (!button) return;

    button.addEventListener("click", () => {
      const expanded =
        button.getAttribute("aria-expanded") === "true";

      button.setAttribute(
        "aria-expanded",
        expanded ? "false" : "true"
      );

      const menu = button.nextElementSibling;

      if (menu) {
        menu.style.display = expanded ? "none" : "block";
      }
    });

    button.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;

      button.setAttribute("aria-expanded", "false");

      const menu = button.nextElementSibling;

      if (menu) {
        menu.style.display = "none";
      }

      button.blur();
    });
  });

  document.addEventListener("click", (event) => {
    controls.forEach((control) => {
      const button = document.getElementById(control.btnId);

      if (!button) return;

      const menu = button.nextElementSibling;

      if (!menu) return;

      if (
        !button.contains(event.target) &&
        !menu.contains(event.target)
      ) {
        button.setAttribute("aria-expanded", "false");
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
    const mobileView = window.matchMedia(
      "(max-width: 720px)"
    ).matches;

    if (!mobileView || !backRow) return;

    window.setTimeout(() => {
      backRow.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 140);
  }

  function setFlipped(state) {
    isFlipped = state;

    logoCard.classList.toggle(
      "flipped",
      isFlipped
    );

    logoCard.setAttribute(
      "aria-pressed",
      isFlipped ? "true" : "false"
    );

    if (hint) {
      hint.style.opacity = "0";
    }

    if (isFlipped) {
      scrollBackIntoView();
    }
  }

  logoCard.addEventListener("pointerup", (event) => {
    if (
      isFlipped &&
      event.target.closest("a")
    ) {
      return;
    }

    setFlipped(!isFlipped);
  });

  logoCard.addEventListener("keydown", (event) => {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();
    setFlipped(!isFlipped);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!isFlipped) return;
    if (logoCard.contains(event.target)) return;

    setFlipped(false);
  });
});


/* =========================
   WINKEL CARD FLIP
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("winkelCard");

  if (!card) return;

  let flipped = false;

  function setFlipped(state) {
    flipped = state;

    card.classList.toggle(
      "is-flipped",
      flipped
    );

    card.setAttribute(
      "aria-pressed",
      flipped ? "true" : "false"
    );
  }

  card.addEventListener("pointerup", (event) => {
    if (
      flipped &&
      event.target.closest("a")
    ) {
      return;
    }

    setFlipped(!flipped);
  });

  card.addEventListener("keydown", (event) => {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();
    setFlipped(!flipped);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!flipped) return;
    if (card.contains(event.target)) return;

    setFlipped(false);
  });
});


/* =========================
   TERROIR CARD
   CONTINUOUS TWO-FACE IMAGE CYCLE
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const card = document.getElementById("terroirCard");

  if (!card) return;

  const imgA =
    document.getElementById("terroirImgA");

  const imgB =
    document.getElementById("terroirImgB");

  const keywordA =
    document.getElementById("terroirKeywordA");

  const keywordB =
    document.getElementById("terroirKeywordB");

  const counterA =
    document.getElementById("terroirCounterA");

  const counterB =
    document.getElementById("terroirCounterB");

  if (
    !imgA ||
    !imgB ||
    !keywordA ||
    !keywordB ||
    !counterA ||
    !counterB
  ) {
    return;
  }

  const slides = [
    {
      img: "images/beelden/wijnenik.jpg",
      keyword: "Wine"
    },
    {
      img: "images/beelden/arthistory.jpg",
      keyword: "Art History"
    },
    {
      img: "images/beelden/wijnenmensen.jpg",
      keyword: "Wine Travel"
    },
    {
      img: "images/beelden/natuurenik.jpg",
      keyword: "Nature"
    },
    {
      img: "images/beelden/photography1.jpg",
      keyword: "Analog Photography"
    },
    {
      img: "images/beelden/filmmaker2.jpg",
      keyword: "Filmmaker"
    },
    {
      img: "images/beelden/filmposter.png",
      keyword: "Short Film"
    },
    {
      img: "images/beelden/photography2.jpg",
      keyword: "Travelogue"
    }
  ];

  const SECONDS_PER_SLIDE = 3.5;
  const FLIP_DURATION_MS = 1400;

  let cursor = 2 % slides.length;
  let frontIsA = true;
  let autoplayTimer = null;

  function paint(
    imageElement,
    keywordElement,
    counterElement,
    slideIndex
  ) {
    const normalizedIndex =
      slideIndex % slides.length;

    const slide =
      slides[normalizedIndex];

    imageElement.src = slide.img;
    imageElement.alt = slide.keyword;

    keywordElement.textContent =
      slide.keyword;

    counterElement.textContent =
      `${normalizedIndex + 1}/${slides.length}`;
  }

  function flipOnce() {
    card.classList.toggle(
      "is-flipped",
      frontIsA
    );

    const hiddenIsA = frontIsA;

    window.setTimeout(() => {
      if (hiddenIsA) {
        paint(
          imgA,
          keywordA,
          counterA,
          cursor
        );
      } else {
        paint(
          imgB,
          keywordB,
          counterB,
          cursor
        );
      }

      cursor =
        (cursor + 1) % slides.length;

      frontIsA = !frontIsA;
    }, FLIP_DURATION_MS * 0.55);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
    }

    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    autoplayTimer = window.setInterval(
      flipOnce,
      SECONDS_PER_SLIDE * 1000
    );
  }

  card.addEventListener("pointerup", () => {
    flipOnce();
    startAutoplay();
  });

  card.addEventListener("keydown", (event) => {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();
    flipOnce();
    startAutoplay();
  });

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    }
  );

  paint(
    imgA,
    keywordA,
    counterA,
    0
  );

  paint(
    imgB,
    keywordB,
    counterB,
    1
  );

  startAutoplay();
});


/* =========================
   MOBILE HAMBURGER
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const navWrap =
    document.querySelector(".nav-wrap");

  const hamburger =
    document.querySelector(".hamburger");

  if (!navWrap || !hamburger) return;

  function setOpen(open) {
    hamburger.setAttribute(
      "aria-expanded",
      open ? "true" : "false"
    );

    hamburger.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );

    navWrap.classList.toggle(
      "open",
      open
    );

    document.body.style.overflow =
      open ? "hidden" : "";
  }

  hamburger.addEventListener("click", (event) => {
    event.stopPropagation();

    setOpen(
      !navWrap.classList.contains("open")
    );
  });

  document.addEventListener("click", (event) => {
    if (
      !navWrap.classList.contains("open")
    ) {
      return;
    }

    if (!navWrap.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) {
      setOpen(false);
    }
  });
});


/* =========================
   WINKEL CARD
   AUTOPLAY WINE PHOTO FLIP
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const card =
    document.getElementById("winkelCard");

  if (!card) return;

  const imgA =
    document.getElementById("winkelImgA");

  const imgB =
    document.getElementById("winkelImgB");

  const keywordA =
    document.getElementById("winkelKeywordA");

  const keywordB =
    document.getElementById("winkelKeywordB");

  const counterA =
    document.getElementById("winkelCounterA");

  const counterB =
    document.getElementById("winkelCounterB");

  if (
    !imgA ||
    !imgB ||
    !keywordA ||
    !keywordB ||
    !counterA ||
    !counterB
  ) {
    return;
  }

  const slides = [
    {
      img: "images/Winkel-minimal.jpeg",
      keyword: "Winkel"
    },
    {
      img: "images/FBWIT1.jpg",
      keyword: "Wit"
    },
    {
      img: "images/FBROOD1.jpg",
      keyword: "Rood"
    },
    {
      img: "images/cosimaface.jpg",
      keyword: "Wit"
    },
    {
      img: "images/cosimalandscape.jpg",
      keyword: "Rood"
    },
    {
      img: "images/axiom25.jpg",
      keyword: "Wit"
    },
    {
      img: "images/aliopacto.jpg",
      keyword: "Rood"
    },
    {
      img: "images/alba.jpg",
      keyword: "Wit"
    },
    {
      img: "images/pi.jpg",
      keyword: "Rood"
    }
  ];

  const SECONDS_PER_SLIDE = 3.5;
  const FLIP_DURATION_MS = 1400;

  const total = slides.length;

  let cursor = 2 % total;
  let frontIsA = true;
  let timer = null;

  function paint(
    imageElement,
    keywordElement,
    counterElement,
    slideIndex
  ) {
    const normalizedIndex =
      slideIndex % total;

    const slide =
      slides[normalizedIndex];

    imageElement.src = slide.img;
    imageElement.alt = slide.keyword;

    keywordElement.textContent =
      slide.keyword;

    counterElement.textContent =
      `${normalizedIndex + 1}/${total}`;
  }

  function flipOnce() {
    card.classList.toggle(
      "is-flipped",
      frontIsA
    );

    const hiddenIsA = frontIsA;

    window.setTimeout(() => {
      if (hiddenIsA) {
        paint(
          imgA,
          keywordA,
          counterA,
          cursor
        );
      } else {
        paint(
          imgB,
          keywordB,
          counterB,
          cursor
        );
      }

      cursor =
        (cursor + 1) % total;

      frontIsA = !frontIsA;
    }, FLIP_DURATION_MS * 0.55);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
    }

    timer = null;
  }

  function start() {
    stop();

    timer = window.setInterval(
      flipOnce,
      SECONDS_PER_SLIDE * 1000
    );
  }

  card.addEventListener("pointerup", () => {
    flipOnce();
    start();
  });

  card.addEventListener("keydown", (event) => {
    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    event.preventDefault();
    flipOnce();
    start();
  });

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }
  );

  paint(
    imgA,
    keywordA,
    counterA,
    0
  );

  paint(
    imgB,
    keywordB,
    counterB,
    1
  );

  start();
});


/* =========================
   NEWSLETTER POPUP
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  const overlay =
    document.getElementById("newsletterOverlay");

  const modal =
    overlay?.querySelector(".newsletter-modal");

  const closeButton =
    document.getElementById("newsletterClose");

  const laterButton =
    document.getElementById("newsletterLater");

  const form =
    document.getElementById("newsletterForm");

  const emailInput =
    document.getElementById("newsletterEmail");

  const submitButton =
    document.getElementById("newsletterSubmit");

  const status =
    document.getElementById("newsletterStatus");

  if (
    !overlay ||
    !modal ||
    !closeButton ||
    !laterButton ||
    !form ||
    !emailInput ||
    !submitButton ||
    !status
  ) {
    return;
  }

  /*
    IMPORTANT:

    The Google Form submission address must end in
    /formResponse, not /viewform.
  */
  const GOOGLE_FORM_ACTION =
    "https://docs.google.com/forms/d/e/1FAIpQLSc05WEaWWyqvK8oJ7JHVcFk-iRVEIY8RlZzjGmHtuL-QHtj7w/formResponse";

  /*
    This must match the entry number belonging to
    the email question in your Google Form.
  */
  const GOOGLE_FORM_EMAIL_ENTRY =
    "entry.1045781291";

  const OPEN_DELAY_MS = 900;

  let previouslyFocusedElement = null;

  function openNewsletter() {
    if (!overlay.hidden) return;

    previouslyFocusedElement =
      document.activeElement;

    overlay.hidden = false;

    overlay.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "newsletter-open"
    );

    window.setTimeout(() => {
      emailInput.focus();
    }, 80);
  }

  function closeNewsletter() {
    overlay.hidden = true;

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "newsletter-open"
    );

    status.textContent = "";

    emailInput.classList.remove(
      "is-invalid"
    );

    if (
      previouslyFocusedElement instanceof
      HTMLElement
    ) {
      previouslyFocusedElement.focus();
    }
  }

  function scheduleNewsletter() {
    window.setTimeout(
      openNewsletter,
      OPEN_DELAY_MS
    );
  }

  /*
    When the age gate is visible, the newsletter waits
    until the visitor confirms that they are 18+.
  */
  const ageGate =
    document.getElementById("ageGate");

  const ageGateVisible =
    ageGate &&
    !ageGate.classList.contains("hidden");

  if (ageGateVisible) {
    const enterButton =
      document.getElementById("enterBtn");

    if (enterButton) {
      enterButton.addEventListener(
        "click",
        scheduleNewsletter,
        { once: true }
      );
    }
  } else {
    scheduleNewsletter();
  }

  closeButton.addEventListener(
    "click",
    closeNewsletter
  );

  laterButton.addEventListener(
    "click",
    closeNewsletter
  );

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeNewsletter();
    }
  });

  document.addEventListener(
    "keydown",
    (event) => {
      if (overlay.hidden) return;

      if (event.key === "Escape") {
        closeNewsletter();
        return;
      }

      /*
        Keep keyboard focus inside the modal while
        it is open.
      */
      if (event.key === "Tab") {
        const focusableElements =
          modal.querySelectorAll(
            [
              "button:not([disabled])",
              "input:not([disabled])",
              "a[href]",
              '[tabindex]:not([tabindex="-1"])'
            ].join(", ")
          );

        const firstElement =
          focusableElements[0];

        const lastElement =
          focusableElements[
            focusableElements.length - 1
          ];

        if (!firstElement || !lastElement) {
          return;
        }

        if (
          event.shiftKey &&
          document.activeElement === firstElement
        ) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastElement
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  );

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();

      const email =
        emailInput.value.trim();

      emailInput.classList.remove(
        "is-invalid"
      );

      status.textContent = "";

      if (
        !email ||
        !emailInput.checkValidity()
      ) {
        emailInput.classList.add(
          "is-invalid"
        );

        status.textContent =
          "Please enter a valid email address.";

        emailInput.focus();
        return;
      }

      if (
        !GOOGLE_FORM_ACTION ||
        !GOOGLE_FORM_EMAIL_ENTRY
      ) {
        status.textContent =
          "The signup form still needs to be connected in index.js.";

        return;
      }

      submitButton.disabled = true;

      submitButton.textContent =
        "Signing up…";

      try {
        /*
          Google Forms expects a normal URL-encoded
          form submission using its entry number.
        */
        const formData =
          new URLSearchParams();

        formData.append(
          GOOGLE_FORM_EMAIL_ENTRY,
          email
        );

        await fetch(
          GOOGLE_FORM_ACTION,
          {
            method: "POST",

            /*
              Google does not return an accessible
              cross-origin response to your website.
            */
            mode: "no-cors",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded"
            },

            body: formData.toString()
          }
        );

        status.textContent =
          "Thank you — your email was submitted.";

        form.reset();

        window.setTimeout(
          closeNewsletter,
          1300
        );
      } catch (error) {
        console.error(
          "Newsletter signup failed:",
          error
        );

        status.textContent =
          "Something went wrong. Please try again.";
      } finally {
        submitButton.disabled = false;

        submitButton.textContent =
          "Sign up";
      }
    }
  );
});