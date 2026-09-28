// cf — configuración del sitio, traída de Supabase
'use strict';

/* Lo que se edita desde /admin vive en la tabla site_config. Este archivo la
   lee y reemplaza las listas que están escritas a mano en js/bn.js, js/sc.js
   y js/rv.js.

   El orden importa: primero se pinta con lo que está en el código, que llega
   al instante, y recién después se repinta con lo de la base. Así la página
   nunca se ve vacía esperando a la red, y si Supabase no contesta la tienda
   igual funciona con lo último que quedó escrito en los archivos. */

const SiteConfig = (() => {

  // Cada clave sabe cómo aplicarse. Si una clave no está en la base, no se
  // toca nada y queda lo del archivo.
  const APLICAR = {
    banners(v) {
      if (!Array.isArray(v) || !v.length) return false;
      BANNERS = v;
      return true;
    },
    categorias(v) {
      if (!Array.isArray(v) || !v.length) return false;
      CATEGORIAS = v;
      return true;
    },
    filas(v) {
      if (!v || typeof v !== 'object') return false;
      if (Array.isArray(v.ofertas)) OFERTAS = v.ofertas;
      if (Array.isArray(v.mas))     MAS_PRODUCTOS = v.mas;
      return true;
    },
    reviews(v) {
      if (!Array.isArray(v)) return false;
      REVIEWS = v;
      return true;
    },
  };

  // Qué hay que repintar según lo que cambió. Repintar de más es barato;
  // repintar de menos deja la página mostrando datos viejos.
  function repintar(claves) {
    if (claves.has('banners') || claves.has('categorias')) Banners.init();
    if (claves.has('filas'))   Filas.init();
    if (claves.has('reviews')) { Reviews.init(); Trust.init(); }
  }

  async function cargar() {
    if (!window.sb) return false;        // Supabase sin configurar
    try {
      const { data, error } = await window.sb.from('site_config').select('key,value');
      // Si la tabla todavía no existe (falta correr el SQL), no es un fallo
      // de la tienda: simplemente se queda con lo de los archivos.
      if (error) { console.info('site_config no disponible:', error.message); return false; }

      const tocadas = new Set();
      (data || []).forEach(({ key, value }) => {
        const fn = APLICAR[key];
        if (fn && fn(value)) tocadas.add(key);
      });

      if (!tocadas.size) return false;
      repintar(tocadas);
      return true;
    } catch (err) {
      console.error('Configuración del sitio:', err);
      return false;
    }
  }

  return { cargar };
})();
