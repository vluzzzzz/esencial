// mn
'use strict';
document.querySelectorAll('.porque-card').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('flipped')));
document.addEventListener('DOMContentLoaded', async () => {
  await loadCatalog();                          // hidrata desde Supabase si está; si no, queda el fallback
  document.body.classList.add('sheet-ready');

  ProductNav.init();Cart.init();CartButton.init();MaskReveal.init();
  ProductsSection.init();NavScroll.init();ProductModal.init();Carousel3D.init();Checkout.init();

  // Piezas de venta. Van después de loadCatalog porque leen las tarjetas ya pintadas.
  Banners.init();Reviews.init();Trust.init();Buscador.init();

  // Barra de anuncio: al cerrarla no vuelve a aparecer.
  const tb=document.getElementById('topbar');
  if(tb){
    if(localStorage.getItem('topbarOff')==='1') tb.remove();
    document.getElementById('topbarClose')?.addEventListener('click',()=>{
      localStorage.setItem('topbarOff','1');
      gsap.to(tb,{height:0,opacity:0,duration:.3,ease:'power2.inOut',onComplete:()=>tb.remove()});
    });
  }

  const rr=document.getElementById('revealRect');
  if(rr && typeof ScrollTrigger !== 'undefined')
    gsap.fromTo(rr,{attr:{width:0}},{attr:{width:520},ease:'none',scrollTrigger:{trigger:'.csl-title-wrap',start:'top 65%',end:'top -10%',scrub:2}});
});
