// mn
'use strict';
document.querySelectorAll('.porque-card').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('flipped')));

document.addEventListener('DOMContentLoaded', () => {
  // Refuerzo del arranque arriba: si la URL no trae ancla, se sube del todo.
  if (!location.hash) window.scrollTo(0, 0);

  // ── 1. YA. Nada de esto depende de Supabase, así que no espera a la red.
  //    Antes todo iba detrás de `await loadCatalog()` y la página se quedaba
  //    en blanco varios segundos: cinta, banners, categorías y buscador
  //    aparecían recién cuando contestaba la base de datos.
  document.body.classList.add('sheet-ready');
  Banners.init();Reviews.init();Buscador.init();
  Cart.init();NavScroll.init();ProductModal.init();Checkout.init();
  Trust.init();                       // pinta la tira y decora el fallback
  ProductsSection.init();

  // ── 2. Después, sin bloquear. Si Supabase responde, se repinta la grilla
  //    con los datos reales y se vuelve a decorar.
  loadCatalog().then(ok => {
    if (!ok) return;
    ProductsSection.init();
    Trust.decorarTarjetas();
  }).catch(err => console.error('Catálogo:', err));
});
