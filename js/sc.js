// sc — nav pegada, fila de ofertas y panel de resultados
'use strict';
const NavScroll=(()=>{function init(){const nav=document.querySelector('.nav');window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40),{passive:true});}return{init};})();

/* ════════════════════════════════════════════════════════════════════════════
   ZONA EDITABLE — qué productos salen en la fila de ofertas, y en qué orden.
   Son los slugs del catálogo (js/sd.js). Si ponés uno que no existe, se saltea.
   ════════════════════════════════════════════════════════════════════════════ */
const OFERTAS = [
  'airpods-pro-2',
  'apple-watch-ultra-3',
  'airpods-4',
  'bateria-magsafe',
  'cargador-tipo-c',
];
/* ═══════════════════════════ FIN ZONA EDITABLE ═════════════════════════════ */

// Pinta una lista de productos dentro de un contenedor y la deja lista para
// usar: escala de imagen, estrellas, descuento y stock.
function pintarProductos(el, lista){
  if(!el) return;
  el.innerHTML = lista.map(cardHTML).join('');
  el.querySelectorAll('.product-card').forEach(c=>c.style.setProperty('--card-img-scale',c.dataset.imgScale??0.75));
  if(typeof Trust!=='undefined') Trust.decorarTarjetas();
}

// Entrada suave de las tarjetas al aparecer en pantalla.
function animarProductos(el){
  if(!el || typeof gsap==='undefined') return;
  const cards=el.querySelectorAll('.product-card');
  if(!cards.length) return;
  if(reduceMotion()){gsap.set(cards,{opacity:1,y:0});return;}
  gsap.set(cards,{opacity:0,y:40});
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const c=e.target,i=[...cards].indexOf(c);
      gsap.to(c,{opacity:1,y:0,duration:.6,ease:'power3.out',delay:(i%5)*.07});
      obs.unobserve(c);
    });
  },{threshold:.1});
  cards.forEach(c=>obs.observe(c));
}

const Ofertas=(()=>{
  function init(){
    const row=document.getElementById('ofertasRow');
    if(!row)return;
    const elegidos=OFERTAS.map(findProduct).filter(Boolean);
    const lista=elegidos.length?elegidos:CATALOGO.slice(0,5);
    pintarProductos(row,lista);
    animarProductos(row);
  }
  return{init};
})();

// Panel de resultados. Una sola sección que sirve para dos cosas: los
// productos de una categoría (con el resto del catálogo abajo) y los
// resultados del buscador. Antes había una grilla fija con todo; ahora los
// productos aparecen recién cuando el visitante pide verlos.
const Panel=(()=>{
  let sec,sub,titulo,grid,masWrap,masGrid,vacio;
  let catActual='';

  const NOMBRES={
    smartwatch:'Smartwatch',
    audifonos:'Audífonos',
    iphone:'Accesorios para iPhone',
    cargadores:'Cargadores',
    todos:'Todo el catálogo',
  };

  function mostrar(){
    if(!sec)return;
    sec.hidden=false;
    requestAnimationFrame(()=>{
      const y=sec.getBoundingClientRect().top+window.scrollY-90;
      window.scrollTo({top:y,behavior:reduceMotion()?'auto':'smooth'});
    });
  }

  function cerrar(){
    if(!sec)return;
    sec.hidden=true;catActual='';
    document.querySelectorAll('.cat-card.activa').forEach(c=>c.classList.remove('activa'));
  }

  function abrir(cat){
    if(!sec)return;
    // Tocar dos veces la misma categoría la cierra.
    if(catActual===cat){cerrar();return;}
    catActual=cat;

    const dentro = cat==='todos' ? CATALOGO.slice() : porCategoria(cat);
    const fuera  = cat==='todos' ? []               : CATALOGO.filter(p=>p.cat!==cat);

    sub.textContent   = cat==='todos' ? 'Catálogo Mayor 2026' : 'Categoría';
    titulo.textContent= NOMBRES[cat] || cat;
    vacio.hidden=dentro.length>0;
    if(!dentro.length) vacio.textContent='Todavía no hay productos en esta categoría.';

    pintarProductos(grid,dentro);
    masWrap.hidden=!fuera.length;
    if(fuera.length) pintarProductos(masGrid,fuera);
    else masGrid.innerHTML='';

    animarProductos(grid);animarProductos(masGrid);

    document.querySelectorAll('.cat-card').forEach(c=>c.classList.toggle('activa',c.dataset.cat===cat));
    mostrar();
  }

  // Sin acentos ni mayúsculas: "Batería" encuentra "bateria".
  const norm=s=>String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();

  function buscar(q){
    if(!sec)return;
    const t=norm(q);
    if(!t){cerrar();return;}
    catActual='buscar:'+t;

    const hit=CATALOGO.filter(p=>norm(`${p.name} ${p.slug} ${p.desc||''}`).includes(t));
    sub.textContent='Resultados de búsqueda';
    titulo.textContent=`"${q.trim()}"`;
    vacio.hidden=hit.length>0;
    if(!hit.length) vacio.textContent=`Sin resultados para "${q.trim()}"`;

    pintarProductos(grid,hit);
    masWrap.hidden=true;masGrid.innerHTML='';
    animarProductos(grid);
    document.querySelectorAll('.cat-card.activa').forEach(c=>c.classList.remove('activa'));
    sec.hidden=false;
  }

  function init(){
    sec=document.getElementById('panel');
    if(!sec)return;
    sub    =document.getElementById('panelSub');
    titulo =document.getElementById('panelTitulo');
    grid   =document.getElementById('panelGrid');
    masWrap=document.getElementById('panelMas');
    masGrid=document.getElementById('panelMasGrid');
    vacio  =document.getElementById('panelVacio');

    document.getElementById('panelClose')?.addEventListener('click',cerrar);

    // Las tarjetas de categoría y el enlace "Productos" de la nav abren el panel
    // acá mismo, sin salir de la página ni abrir otra ventana.
    document.addEventListener('click',e=>{
      const t=e.target.closest('[data-cat-abrir]');
      if(!t)return;
      e.preventDefault();
      abrir(t.dataset.catAbrir);
    });
  }

  return{init,abrir,buscar,cerrar,mostrar};
})();

const Carousel3D=(()=>{
  function init(){
    if(typeof Swiper==='undefined')return;
    const sw=new Swiper('.csl-swiper',{effect:'coverflow',grabCursor:true,centeredSlides:true,slidesPerView:'auto',loop:false,initialSlide:2,mousewheel:{forceToAxis:true},keyboard:{enabled:true,onlyInViewport:true},coverflowEffect:{rotate:50,stretch:0,depth:50,modifier:1,slideShadows:false},navigation:{prevEl:'.csl-arr-prev',nextEl:'.csl-arr-next'},pagination:{el:'.csl-pagination',clickable:true}});
    const slides=document.querySelectorAll('.csl-swiper .swiper-slide');
    gsap.set(slides,{opacity:0,y:50});
    const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){gsap.to([...slides],{opacity:1,y:0,duration:.7,ease:'power3.out',stagger:.08});obs.disconnect();}});},{threshold:.2});
    obs.observe(document.querySelector('.csl-swiper'));
    let drag=false,pend=null;
    sw.on('sliderMove',()=>{drag=true;});sw.on('touchStart',()=>{drag=false;});
    sw.on('slideChangeTransitionEnd',()=>{if(pend!==null&&!pend.classList.contains('out-of-stock')){const s=pend;pend=null;ProductModal.open(s);}else{pend=null;}});
    document.querySelectorAll('.csl-swiper .swiper-slide[data-name]').forEach((slide,i)=>{
      slide.addEventListener('click',()=>{if(drag||slide.classList.contains('out-of-stock'))return;if(!slide.classList.contains('swiper-slide-active')){pend=slide;sw.slideTo(i);return;}ProductModal.open(slide);});
    });
  }
  return{init};
})();
