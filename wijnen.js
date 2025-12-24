
  /* Dropdown click toggle */
  document.addEventListener('DOMContentLoaded', function () {
    const controls = [{ btnId:'lantBtn' }, { btnId:'blogBtn' }];
    controls.forEach(c=>{
      const btn=document.getElementById(c.btnId);
      if(!btn) return;
      btn.addEventListener('click',()=>{
        const expanded = btn.getAttribute('aria-expanded')==='true';
        btn.setAttribute('aria-expanded', expanded?'false':'true');
        const menu = btn.nextElementSibling;
        if(menu) menu.style.display = expanded?'none':'block';
      });
      btn.addEventListener('keydown',e=>{
        if(e.key==='Escape'){
          btn.setAttribute('aria-expanded','false');
          const menu=btn.nextElementSibling;
          if(menu) menu.style.display='none';
          btn.blur();
        }
      });
    });

    /* close menus on outside click */
    document.addEventListener('click',e=>{
      controls.forEach(c=>{
        const btn=document.getElementById(c.btnId);
        if(!btn) return;
        const menu=btn.nextElementSibling;
        if(!menu) return;
        if(!btn.contains(e.target) && !menu.contains(e.target)){
          btn.setAttribute('aria-expanded','false');
          menu.style.display='none';
        }
      });
    });
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

