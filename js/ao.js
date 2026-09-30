'use strict';
/* ============================================================================
 *  ao — Panel admin · Pedidos
 *  Lista las compras que Mercado Pago confirmó. Tres estados en orden:
 *  Nuevo → Preparando → Enviado. Los nuevos arriba, los enviados al final y
 *  apagados, pero siempre se pueden abrir para ver los datos del cliente.
 *
 *  La tabla es supabase/add-orders.sql.
 * ========================================================================== */

const Pedidos = (() => {

  const ESTADOS = {
    nuevo:      { txt:'Nuevo',      sig:'preparando', btn:'Preparando →' },
    preparando: { txt:'Preparando', sig:'enviado',    btn:'Enviado →'    },
    enviado:    { txt:'Enviado',    sig:null,         btn:'Ya enviado'   },
  };

  let pedidos = [];
  let filtro = 'todos';
  let cargado = false;
  const abiertos = new Set();

  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const ICONO_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  function fecha(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const dia  = d.toLocaleDateString('es-CL', { day:'2-digit', month:'short' });
    const hora = d.toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' });
    return dia + ' · ' + hora;
  }

  /* ── Leer ───────────────────────────────────────────────────────────── */

  async function cargar() {
    const cont = $('#listPedidos');
    if (!cont) return;
    cont.innerHTML = '<div class="empty">Cargando pedidos…</div>';
    const { data, error } = await sb
      .from('orders')
      .select('*')
      .neq('status', 'iniciado')
      .order('orden',      { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      // 42P01 = la tabla todavía no existe.
      if (error.code === '42P01' || /orders/i.test(error.message || '')) {
        cont.innerHTML = '<div class="card aviso-sql">' +
          '<h2>Falta un paso en la base de datos</h2>' +
          '<p class="hint">Los pedidos se guardan en la tabla <code>orders</code>, ' +
          'que todavía no existe. Abrí Supabase → SQL Editor, pegá el contenido de ' +
          '<code>supabase/add-orders.sql</code> y tocá <b>Run</b>. Después recargá esta página.</p>' +
          '</div>';
        return;
      }
      cont.innerHTML = '<div class="empty">Error: ' + escH(error.message) + '</div>';
      return;
    }
    pedidos = data || [];
    cargado = true;
    pintarFiltro();
    pintar();
  }

  /* ── Pintar ─────────────────────────────────────────────────────────── */

  function pintarFiltro() {
    const sel = $('#filtroPedido');
    const cuenta = e => pedidos.filter(p => p.status === e).length;
    if (sel) {
      const opciones = [
        ['todos',      'Todos (' + pedidos.length + ')'],
        ['nuevo',      'Nuevos (' + cuenta('nuevo') + ')'],
        ['preparando', 'Preparando (' + cuenta('preparando') + ')'],
        ['enviado',    'Enviados (' + cuenta('enviado') + ')'],
      ];
      sel.innerHTML = opciones.map(([v, t]) =>
        '<option value="' + v + '"' + (v === filtro ? ' selected' : '') + '>' + escH(t) + '</option>').join('');
    }

    const res = $('#resumenPedidos');
    if (res) {
      const sinVer = cuenta('nuevo');
      res.textContent = sinVer
        ? sinVer + (sinVer === 1 ? ' pedido nuevo sin atender.' : ' pedidos nuevos sin atender.')
        : 'No hay pedidos nuevos sin atender.';
      res.classList.toggle('resumen-alerta', sinVer > 0);
    }
  }

  function itemsHTML(items) {
    const lista = Array.isArray(items) ? items : [];
    if (!lista.length) return '<p class="hint">Sin detalle de productos.</p>';
    return '<table class="ped-items"><tbody>' + lista.map(i =>
      '<tr><td class="mini">' + (i.img
          ? '<img src="' + escH(i.img) + '" alt="" loading="lazy">'
          : '<span class="mini-vacia"></span>') + '</td>' +
      '<td>' + (Number(i.qty) || 0) + '× ' + escH(i.name) + '</td>' +
      '<td class="num uni">' + fmt(i.price) + '</td>' +
      '<td class="num">' + fmt((Number(i.price) || 0) * (Number(i.qty) || 0)) + '</td></tr>'
    ).join('') + '</tbody></table>';
  }

  function tarjeta(p) {
    const est = ESTADOS[p.status] || ESTADOS.nuevo;
    const abierto = abiertos.has(p.id);
    const tel = String(p.cliente_telefono || '').replace(/[^\d]/g, '');
    return '<div class="card ped ped-' + escH(p.status) + '" data-id="' + escH(p.id) + '">' +
      '<div class="ped-top">' +
        '<div class="ped-quien">' +
          '<p class="ped-nombre">' + (escH(p.cliente_nombre) || 'Sin nombre') + '</p>' +
          '<p class="ped-fecha">' + escH(fecha(p.paid_at || p.created_at)) + '</p>' +
        '</div>' +
        '<div class="ped-meta">' +
          '<span class="ped-chip ped-chip-' + escH(p.status) + '">' + escH(est.txt) + '</span>' +
          '<span class="ped-total">' + fmt(p.total) + '</span>' +
        '</div>' +
      '</div>' +

      '<div class="ped-acciones">' +
        '<button class="btn btn-ghost" data-act="ver">' + (abierto ? 'Ocultar' : 'Ver pedido') + '</button>' +
        '<button class="btn btn-dark" data-act="avanzar"' + (est.sig ? '' : ' disabled') + '>' + escH(est.btn) + '</button>' +
      '</div>' +

      '<div class="ped-detalle"' + (abierto ? '' : ' hidden') + '>' +
        '<div class="ped-datos">' +
          '<p><b>Email</b> ' + escH(p.cliente_email) + '</p>' +
          '<p class="ped-tel"><b>Teléfono</b> <span>' + escH(p.cliente_telefono) + '</span>' +
            (tel ? '<a class="ped-wa" href="https://wa.me/' + escH(tel) +
              '" target="_blank" rel="noopener" title="Escribir por WhatsApp" aria-label="Escribir por WhatsApp">' +
              ICONO_WA + '</a>' : '') + '</p>' +
          (p.cliente_rut       ? '<p><b>RUT</b> '       + escH(p.cliente_rut) + '</p>' : '') +
          (p.cliente_ciudad    ? '<p><b>Ciudad</b> '    + escH(p.cliente_ciudad) + '</p>' : '') +
          (p.cliente_direccion ? '<p><b>Dirección</b> ' + escH(p.cliente_direccion) + '</p>' : '') +
          (p.payment_id        ? '<p><b>Pago Mercado Pago</b> ' + escH(p.payment_id) + '</p>' : '') +
        '</div>' +
        itemsHTML(p.items) +
        '<p class="ped-suma">Total <b>' + fmt(p.total) + '</b></p>' +
      '</div>' +
    '</div>';
  }

  function pintar() {
    const cont = $('#listPedidos');
    if (!cont) return;
    const lista = filtro === 'todos' ? pedidos : pedidos.filter(p => p.status === filtro);
    if (!lista.length) {
      cont.innerHTML = '<div class="empty">' + (filtro === 'todos'
        ? 'Todavía no hay pedidos. Aparecen acá apenas Mercado Pago confirma un pago.'
        : 'No hay pedidos en este estado.') + '</div>';
      return;
    }
    cont.innerHTML = lista.map(tarjeta).join('');
  }

  /* ── Avanzar de estado ──────────────────────────────────────────────── */

  // Un clic no cambia nada: el boton pide confirmacion en su propio lugar y
  // vuelve solo a los 4 segundos. Sin el cartel del navegador, que corta todo.
  let esperando = null;
  let esperaT = null;

  function pedirOk(id, btn) {
    soltarOk();
    esperando = id;
    btn.dataset.txt = btn.textContent;
    btn.textContent = 'Confirmar';
    btn.classList.add('btn-confirmar');
    esperaT = setTimeout(soltarOk, 4000);
  }

  function soltarOk() {
    clearTimeout(esperaT);
    const b = $('#listPedidos .btn-confirmar');
    if (b) { b.textContent = b.dataset.txt || b.textContent; b.classList.remove('btn-confirmar'); }
    esperando = null;
  }

  async function avanzar(id, btn) {
    const p = pedidos.find(x => x.id === id);
    if (!p) return;
    const sig = (ESTADOS[p.status] || {}).sig;
    if (!sig) return;

    const orig = ESTADOS[p.status].btn;
    btn.disabled = true;
    btn.innerHTML = '<span class="spin"></span>';
    try {
      const { data, error } = await sb.from('orders')
        .update({ status: sig, updated_at: new Date().toISOString() })
        .eq('id', id).select('id');
      if (error) throw error;
      if (!data || !data.length) throw new Error('SIN_PERMISO');

      p.status = sig;
      // La base ordena por una columna calculada; acá se reproduce el mismo
      // orden para no tener que volver a consultar.
      const peso = { nuevo:0, preparando:1, enviado:2 };
      pedidos.sort((a, b) => (peso[a.status] - peso[b.status])
        || (new Date(b.created_at) - new Date(a.created_at)));
      pintarFiltro();
      pintar();

      // La tarjeta salta de grupo: un destello la sigue con la vista.
      const card = $('#listPedidos [data-id="' + id + '"]');
      if (card) {
        card.classList.add('ped-cambio');
        setTimeout(() => card.classList.remove('ped-cambio'), 600);
      }
      toast('Pedido en ' + ESTADOS[sig].txt.toLowerCase());
    } catch (err) {
      btn.disabled = false;
      btn.textContent = orig;
      toast(mensajeError(err), true);
    }
  }

  /* ── Eventos ────────────────────────────────────────────────────────── */

  function conectar() {
    const cont = $('#listPedidos');
    if (!cont) return;

    cont.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      // El id, no el índice: la lista se reordena sola al avanzar un estado.
      const card = b.closest('[data-id]');
      const id = card && card.dataset.id;
      if (!id) return;

      if (b.dataset.act !== 'avanzar') soltarOk();

      if (b.dataset.act === 'ver') {
        const det = card.querySelector('.ped-detalle');
        const abrir = det.hasAttribute('hidden');
        if (abrir) { det.removeAttribute('hidden'); abiertos.add(id); }
        else       { det.setAttribute('hidden', ''); abiertos.delete(id); }
        b.textContent = abrir ? 'Ocultar' : 'Ver pedido';
      }
      if (b.dataset.act === 'avanzar') {
        if (esperando === id) { soltarOk(); avanzar(id, b); }
        else pedirOk(id, b);
      }
    });

    // Un clic en cualquier otro lado deshace la confirmacion pendiente.
    document.addEventListener('click', e => {
      if (!e.target.closest('[data-act="avanzar"]')) soltarOk();
    });

    // Una foto que no carga deja el hueco, no el icono de roto. El evento
    // error no burbujea, asi que se escucha en la fase de captura.
    cont.addEventListener('error', e => {
      if (e.target.tagName === 'IMG') e.target.classList.add('mini-rota');
    }, true);

    const sel = $('#filtroPedido');
    if (sel) sel.addEventListener('change', e => { filtro = e.target.value; pintar(); });

    const rec = $('#recargarPedidos');
    if (rec) rec.addEventListener('click', () => {
      const orig = rec.textContent;
      rec.disabled = true;
      rec.innerHTML = '<span class="spin"></span>';
      cargar().catch(e => console.error('Pedidos:', e)).then(() => {
        rec.disabled = false;
        rec.textContent = orig;
      });
    });

    // Carga diferida: la consulta recién se hace al abrir la pestaña, así
    // entrar al panel a cambiar un precio no trae pedidos que nadie pidió.
    $$('.tab').forEach(t => t.addEventListener('click', () => {
      if (t.dataset.tab === 'pedidos' && !cargado) cargar().catch(e => console.error('Pedidos:', e));
    }));
  }

  return { init: conectar, cargar };
})();
