document.addEventListener('DOMContentLoaded', function () {
  const controls = [{ btnId: 'lantBtn' }, { btnId: 'blogBtn' }];
  controls.forEach(c => {
    const btn = document.getElementById(c.btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      const menu = btn.nextElementSibling;
      if (menu) menu.style.display = expanded ? 'none' : 'block';
    });
    btn.addEventListener('keydown', (e) => { 
      if (e.key==='Escape') { 
        btn.setAttribute('aria-expanded','false'); 
        const menu=btn.nextElementSibling;
        if(menu)menu.style.display='none';
        btn.blur();
      }
    });
  });
  document.addEventListener('click', (e) => {
    controls.forEach(c => {
      const btn = document.getElementById(c.btnId);
      if (!btn) return;
      const menu = btn.nextElementSibling;
      if (!menu) return;
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        btn.setAttribute('aria-expanded', 'false');
        menu.style.display = 'none';
      }
    });
  });
});


document.addEventListener("DOMContentLoaded", function() {
  const gate = document.getElementById("ageGate");
  const enter = document.getElementById("enterBtn");
  const leave = document.getElementById("leaveBtn");

  // If they already confirmed earlier, skip
  if (localStorage.getItem("ageVerified") === "true") {
    gate.style.display = "none";
  }

  enter.addEventListener("click", () => {
    localStorage.setItem("ageVerified", "true");
    gate.style.display = "none";
  });

  leave.addEventListener("click", () => {
    window.location.href = "https://www.google.com"; // or any other redirect
  });
});

const logoCard = document.getElementById("logoCard");
const hint = document.querySelector(".hover-hint");

let isFlipped = false;

logoCard.addEventListener("touchstart", () => {
  isFlipped = !isFlipped;
  logoCard.style.transform = isFlipped
    ? "rotateY(180deg)"
    : "rotateY(0deg)";
  hint.style.opacity = "0";
});


/* Hide hint on desktop click as well */
logoCard.addEventListener("click", () => {
  hint.style.opacity = "0";
});

// Mobile hamburger toggle
(function(){
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

