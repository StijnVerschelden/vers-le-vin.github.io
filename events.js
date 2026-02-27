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


// DESKTOP IMAGE LIGHTBOX

if (window.matchMedia("(min-width: 721px)").matches) {

  const images = document.querySelectorAll(".event-image");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (images.length && lightbox && lightboxImg) {

    images.forEach(img => {
      img.addEventListener("click", () => {
        lightboxImg.src = img.src;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    // close when clicking outside
    lightbox.addEventListener("click", () => {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    });
  }
}
