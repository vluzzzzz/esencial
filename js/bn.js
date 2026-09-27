// bn — banners del hero + tarjetas de categoría
'use strict';

/* ════════════════════════════════════════════════════════════════════════════
   ZONA EDITABLE — acá pegás las rutas de tus imágenes.

   Mientras 'desktop' esté vacío se ve el rectángulo punteado con la medida.
   Apenas pegás la ruta, el punteado desaparece solo.

   Medidas recomendadas:
     desktop → 2400 × 800 px   (webp)
     mobile  → 1200 × 1200 px  (webp)  · si lo dejás vacío se usa el de desktop
   ════════════════════════════════════════════════════════════════════════════ */
const BANNERS = [
  { desktop:'', mobile:'', alt:'Banner 1', link:'#productos' },
  { desktop:'', mobile:'', alt:'Banner 2', link:'#productos' },
  { desktop:'', mobile:'', alt:'Banner 3', link:'#productos' },
  { desktop:'', mobile:'', alt:'Banner 4', link:'#productos' },
  { desktop:'', mobile:'', alt:'Banner 5', link:'#productos' },
];

// Banner ancho de promoción (va entre la grilla y las reseñas) → 2400 × 600 px
const PROMO_BANNER = { desktop:'', mobile:'', alt:'Promoción', link:'#productos' };

// Tarjetas de categoría → 800 × 1000 px cada una (vertical)
const CATEGORIAS = [
  { chip:'Audio',      titulo:'AirPods',      sub:'Sonido sin cables',    img:'', link:'#productos' },
  { chip:'Relojes',    titulo:'Apple Watch',  sub:'Salud y deporte',      img:'', link:'#productos' },
  { chip:'Carga',      titulo:'Cargadores',   sub:'Rápida y segura',      img:'', link:'#productos' },
  { chip:'Accesorios', titulo:'MagSafe',      sub:'Magnético y práctico', img:'', link:'#productos' },
];
/* ═══════════════════════════ FIN ZONA EDITABLE ═════════════════════════════ */


const Banners = (() => {
  let swiper = null;

  // Imagen responsive. Sin ruta → hueco punteado con la medida escrita.
  function media(item, w, h, clase) {
    if (!item.desktop) {
      return `<div class="slot ${clase}" data-medida="${w} × ${h}"></div>`;
    }
    const mob = item.mobile || item.desktop;
    return `<picture class="${clase}">
        <source media="(max-width:700px)" srcset="${escAttr(mob)}">
        <img src="${escAttr(item.desktop)}" alt="${escAttr(item.alt || '')}" loading="lazy" decoding="async">
      </picture>`;
  }

  function slide(item) {
    const inner = media(item, '2400', '800', 'bnr-media');
    return item.link && item.desktop
      ? `<div class="swiper-slide bnr-slide"><a href="${escAttr(item.link)}" class="bnr-link">${inner}</a></div>`
      : `<div class="swiper-slide bnr-slide">${inner}</div>`;
  }

  function categoria(c) {
    const img = c.img
      ? `<img src="${escAttr(c.img)}" alt="${escAttr(c.titulo)}" loading="lazy" decoding="async">`
      : `<div class="slot cat-slot" data-medida="800 × 1000"></div>`;
    return `<a href="${escAttr(c.link || '#productos')}" class="cat-card">
        <div class="cat-media">${img}</div>
        <div class="cat-body">
          <span class="cat-chip">${escTxt(c.chip)}</span>
          <h3 class="cat-titulo">${escTxt(c.titulo)}</h3>
          <p class="cat-sub">${escTxt(c.sub)}</p>
        </div>
      </a>`;
  }

  function renderBanners() {
    const wrap = document.getElementById('bnrWrapper');
    if (!wrap) return;
    wrap.innerHTML = BANNERS.map(slide).join('');

    if (typeof Swiper === 'undefined') return;
    swiper = new Swiper('.bnr-swiper', {
      loop: BANNERS.length > 1,
      speed: 650,
      autoplay: reduceMotion() ? false : { delay: 6000, disableOnInteraction: false, pauseOnMouseEnter: true },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: { prevEl: '.bnr-arr-prev', nextEl: '.bnr-arr-next' },
      pagination: { el: '.bnr-pagination', clickable: true },
      a11y: { prevSlideMessage: 'Banner anterior', nextSlideMessage: 'Banner siguiente' },
    });
  }

  function renderPromo() {
    const el = document.getElementById('promoBanner');
    if (!el) return;
    const inner = media(PROMO_BANNER, '2400', '600', 'promo-media');
    el.innerHTML = PROMO_BANNER.link && PROMO_BANNER.desktop
      ? `<a href="${escAttr(PROMO_BANNER.link)}" class="promo-link">${inner}</a>`
      : inner;
  }

  function renderCategorias() {
    const el = document.getElementById('catGrid');
    if (el) el.innerHTML = CATEGORIAS.map(categoria).join('');
  }

  function init() {
    renderBanners();
    renderCategorias();
    renderPromo();
  }

  return { init, get swiper(){ return swiper; } };
})();
