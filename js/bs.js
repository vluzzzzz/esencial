// bs — buscador de la nav
'use strict';

// Ya no hay una grilla fija que filtrar: los resultados se pintan en el panel
// que también usan las categorías (js/sc.js). Así el buscador y las categorías
// muestran los productos en el mismo lugar y no se pisan entre sí.
const Buscador = (() => {
  let input, limpiar;

  function debounce(fn, ms) {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
  }

  function filtrar() {
    if (!input) return;
    const q = input.value;
    limpiar.hidden = !q.trim();
    Panel.buscar(q);
  }

  function init() {
    input   = document.getElementById('buscadorInput');
    limpiar = document.getElementById('buscadorClear');
    if (!input) return;

    input.addEventListener('input', debounce(filtrar, 150));

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter')  { e.preventDefault(); filtrar(); if (input.value.trim()) Panel.mostrar(); }
      if (e.key === 'Escape' && input.value) { input.value = ''; filtrar(); }
    });

    limpiar?.addEventListener('click', () => { input.value = ''; filtrar(); input.focus(); });
  }

  return { init, filtrar };
})();
