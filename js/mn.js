// mn
'use strict';
document.querySelectorAll('.porque-card').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('flipped')));
document.addEventListener('DOMContentLoaded', async () => {
  await loadCatalog();                          // hidrata desde Supabase si está; si no, queda el fallback
  document.body.classList.add('sheet-ready');

  // El hero flotante y el carrusel de destacados se quitaron, así que
  // ProductNav, MaskReveal, CartButton y Carousel3D ya no se inician.
  Cart.init();ProductsSection.init();NavScroll.init();ProductModal.init();Checkout.init();

  // Piezas de venta. Van después de loadCatalog porque leen las tarjetas ya pintadas.
  Banners.init();Reviews.init();Trust.init();Buscador.init();
});
