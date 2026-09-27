// bs — buscador de la grilla
'use strict';

const Buscador = (() => {
  let input, limpiar, vacio, grid;

  // Sin acentos ni mayúsculas: "Batería" encuentra "bateria".
  const norm = s => String(s == null ? '' : s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  function filtrar() {
    if (!grid) return;
    const q = norm(input.value);
    const cards = grid.querySelectorAll('.product-card');
    let visibles = 0;

    cards.forEach(card => {
      const heno = norm(`${card.dataset.name} ${card.dataset.id} ${card.dataset.desc || ''}`);
      const ok = !q || heno.includes(q);
      card.hidden = !ok;
      if (ok) visibles++;
    });

    limpiar.hidden = !q;
    if (vacio) {
      vacio.hidden = !(q && visibles === 0);
      if (!vacio.hidden) vacio.textContent = `Sin resultados para "${input.value.trim()}"`;
    }
  }

  function init() {
    input   = document.getElementById('buscadorInput');
    limpiar = document.getElementById('buscadorClear');
    vacio   = document.getElementById('buscadorVacio');
    grid    = document.getElementById('productosGrid');
    if (!input || !grid) return;

    input.addEventListener('input', debounce(filtrar, 150));

    // Enter lleva a la grilla para ver el resultado.
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        filtrar();
        document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });
      }
      if (e.key === 'Escape' && input.value) { input.value = ''; filtrar(); }
    });

    limpiar?.addEventListener('click', () => { input.value = ''; filtrar(); input.focus(); });

    filtrar();
  }

  return { init, filtrar };
})();
