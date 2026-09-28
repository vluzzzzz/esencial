// bn — banners del hero + tarjetas de categoría
'use strict';

/* ════════════════════════════════════════════════════════════════════════════
   ZONA EDITABLE — acá pegás las rutas de tus imágenes.

   Mientras 'desktop' esté vacío se ve el rectángulo punteado con la medida.
   Apenas pegás la ruta, el punteado desaparece solo.

   Medidas:
     desktop → 1920 × 560 px
     mobile  → 1080 × 1080 px  · si lo dejás vacío se usa el de desktop

   Los que faltan muestran el hueco punteado con el nombre de archivo que
   esperan. Guardás la imagen con ese nombre en images/ y la pegás en
   'desktop'. El orden de esta lista es el orden en que se ven.
   ════════════════════════════════════════════════════════════════════════════ */
const BANNERS = [
  { desktop:'images/principalhero.png', mobile:'', alt:'Essential Tech · Tecnología al por mayor', link:'#productos' },
  { desktop:'images/bannerdos.png',     mobile:'', alt:'AirPods Pro 3 desde $11.500 por unidad',   link:'#productos' },
  { desktop:'images/bannertres.png',    mobile:'', alt:'Apple Watch Series 11 desde $25.990 por unidad', link:'#productos' },
  { desktop:'images/bannercuatro.png',  mobile:'', alt:'Batería MagSafe', link:'#productos' },
  // Quinto banner en pausa. Para traerlo de vuelta, borrá las dos barras:
  // { desktop:'', mobile:'', archivo:'bannercinco.png',  alt:'Banner 5', link:'#productos' },
];

// Banner ancho de promoción (va entre la grilla y las reseñas) → 2400 × 600 px
const PROMO_BANNER = { desktop:'', mobile:'', archivo:'bannerpromo.png', alt:'Promoción', link:'#productos' };

// Mensajes de la cinta de arriba. Se repiten en bucle, uno tras otro.
const CINTA = [
  'Calidad Garantizada',
  '+500 Clientes',
  'Pago Seguro',
  'Envío Express',
  'Distribución Mayorista',
];

// Velocidad de la cinta, en píxeles por segundo. Más chico = más lenta.
const CINTA_VELOCIDAD = 28;

// Lo que separa un mensaje del otro. Es el mismo archivo que subiste; solo
// cambia el nombre, sin la ñ, porque en una URL da problemas de servidor.
const CINTA_SEPARADOR = 'images/logo-cinta.png';

/* Tarjetas de categoría en puzzle. El orden de la lista es el de la pantalla:

     ┌─────────┬─────────┬─────────┐
     │         │    2    │         │
     │    1    ├─────────┤    4    │     1 y 4 altas · 2 y 3 bajas
     │         │    3    │         │
     └─────────┴─────────┴─────────┘

   'arriba' es la línea chica y 'titulo' la grande. 'desde' es el precio del
   recuadro; si lo dejás vacío no se muestra el recuadro.
   Cada hueco dice qué archivo espera y en qué medida exportarlo.          */
const CATEGORIAS = [
  { arriba:'Lo mejor en', titulo:'Audífonos',  desde:'$14.000', img:'', archivo:'cat-audifonos.png',  medida:'800 × 1000', link:'#productos' },
  { arriba:'Todo en',     titulo:'Smartwatch', desde:'$29.990', img:'', archivo:'cat-smartwatch.png', medida:'800 × 500',  link:'#productos' },
  { arriba:'Accesorios',  titulo:'iPhone',     desde:'$13.000', img:'', archivo:'cat-iphone.png',     medida:'800 × 500',  link:'#productos' },
  { arriba:'Todo en',     titulo:'Cargadores', desde:'$5.000',  img:'', archivo:'cat-cargadores.png', medida:'800 × 1000', link:'#productos' },
];
/* ═══════════════════════════ FIN ZONA EDITABLE ═════════════════════════════ */


const Banners = (() => {
  let swiper = null;

  // Imagen responsive. Sin ruta → hueco punteado con la medida escrita.
  // El primer banner es lo primero que ve el visitante, así que carga con
  // prioridad alta; los demás esperan a que haga falta (lazy).
  function media(item, w, h, clase, primero = false) {
    if (!item.desktop) {
      // El hueco dice qué archivo espera, para no tener que adivinarlo.
      const nombre = item.archivo
        ? `<span class="slot-archivo">${escTxt(item.archivo)}</span>`
        : '';
      return `<div class="slot ${clase}" data-medida="${w} × ${h}">${nombre}</div>`;
    }
    const mob = item.mobile || item.desktop;
    const carga = primero
      ? 'fetchpriority="high" decoding="sync"'
      : 'loading="lazy" decoding="async"';
    return `<picture class="${clase}">
        <source media="(max-width:700px)" srcset="${escAttr(mob)}">
        <img src="${escAttr(item.desktop)}" alt="${escAttr(item.alt || '')}" width="${w}" height="${h}" ${carga}>
      </picture>`;
  }

  function slide(item, i) {
    const inner = media(item, '1920', '560', 'bnr-media', i === 0);
    return item.link && item.desktop
      ? `<div class="swiper-slide bnr-slide"><a href="${escAttr(item.link)}" class="bnr-link">${inner}</a></div>`
      : `<div class="swiper-slide bnr-slide">${inner}</div>`;
  }

  function categoria(c) {
    const img = c.img
      ? `<img src="${escAttr(c.img)}" alt="${escAttr(c.titulo)}" loading="lazy" decoding="async">`
      : `<div class="slot cat-slot" data-medida="${escAttr(c.medida || '800 × 1000')}">` +
        (c.archivo ? `<span class="slot-archivo">${escTxt(c.archivo)}</span>` : '') +
        `</div>`;
    const precio = c.desde
      ? `<span class="cat-desde"><span class="cat-desde-lbl">desde:</span>${escTxt(c.desde)}</span>`
      : '';
    return `<a href="${escAttr(c.link || '#productos')}" class="cat-card">
        <div class="cat-media">${img}</div>
        <div class="cat-body">
          <div class="cat-texto">
            <span class="cat-arriba">${escTxt(c.arriba || '')}</span>
            <h3 class="cat-titulo">${escTxt(c.titulo)}</h3>
          </div>
          ${precio}
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

  // La cinta nunca puede quedar con un hueco. La animación corre de 0 a -50%,
  // así que el contenido tiene que estar duplicado Y cada mitad tiene que ser
  // más ancha que la pantalla. En un monitor muy ancho una sola vuelta de
  // mensajes no alcanza, así que se repite hasta cubrirla.
  function renderCinta() {
    const el = document.getElementById('topbarTrack');
    if (!el) return;
    const uno = CINTA.map(t =>
      `<span class="cinta-item">${escTxt(t)}</span>` +
      `<img class="cinta-sep" src="${escAttr(CINTA_SEPARADOR)}" alt="" aria-hidden="true" width="58" height="58">`
    ).join('');

    el.innerHTML = uno + uno;
    el.setAttribute('aria-label', CINTA.join('. '));

    // Se mide una mitad y se agregan vueltas hasta pasar el ancho de pantalla.
    requestAnimationFrame(() => {
      const base = el.scrollWidth / 2;
      if (!base) return;
      const vueltas = Math.max(1, Math.ceil(window.innerWidth / base) + 1);
      if (vueltas > 1) el.innerHTML = uno.repeat(vueltas * 2);

      // La duración se calcula según lo que mide el recorrido. Si fuera fija,
      // al agregar vueltas la cinta pasaría cada vez más rápido: el trayecto
      // crece pero el tiempo no. Así la velocidad es siempre la misma.
      const recorrido = base * vueltas;
      el.style.animationDuration = Math.round(recorrido / CINTA_VELOCIDAD) + 's';
    });
  }

  function init() {
    renderCinta();
    renderBanners();
    renderCategorias();
    renderPromo();
  }

  return { init, get swiper(){ return swiper; } };
})();
