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
    nuevo:      { txt:'Nuevo',      sig:'preparando', btn:'Marcar preparando' },
    preparando: { txt:'Preparando', sig:'enviado',    btn:'Pedido enviado'    },
    enviado:    { txt:'Enviado',    sig:null,         btn:'Ya enviado'        },
  };

  let pedidos = [];
  let filtro = 'todos';
  let cargado = false;
  const abiertos = new Set();

  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

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
      '<tr><td>' + (Number(i.qty) || 0) + '× ' + escH(i.name) + '</td>' +
      '<td class="num">' + fmt(i.price) + '</td>' +
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
        '<span class="ped-chip ped-chip-' + escH(p.status) + '">' + escH(est.txt) + '</span>' +
        '<span class="ped-total">' + fmt(p.total) + '</span>' +
      '</div>' +

      '<div class="ped-acciones">' +
        '<button class="btn btn-ghost" data-act="ver">' + (abierto ? 'Ocultar' : 'Ver pedido') + '</button>' +
        '<button class="btn btn-dark" data-act="avanzar"' + (est.sig ? '' : ' disabled') + '>' + escH(est.btn) + '</button>' +
      '</div>' +

      '<div class="ped-detalle"' + (abierto ? '' : ' hidden') + '>' +
        '<div class="ped-datos">' +
          '<p><b>Email</b> ' + escH(p.cliente_email) + '</p>' +
          '<p><b>Teléfono</b> ' + escH(p.cliente_telefono) +
            (tel ? ' <a class="ped-wa" href="https://wa.me/' + escH(tel) + '" target="_blank" rel="noopener">WhatsApp</a>' : '') + '</p>' +
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

  async function avanzar(id, btn) {
    const p = pedidos.find(x => x.id === id);
    if (!p) return;
    const sig = (ESTADOS[p.status] || {}).sig;
    if (!sig) return;
    if (!confirm('¿Pasar este pedido a "' + ESTADOS[sig].txt + '"?')) return;

    const orig = btn.textContent;
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

      if (b.dataset.act === 'ver') {
        const det = card.querySelector('.ped-detalle');
        const abrir = det.hasAttribute('hidden');
        if (abrir) { det.removeAttribute('hidden'); abiertos.add(id); }
        else       { det.setAttribute('hidden', ''); abiertos.delete(id); }
        b.textContent = abrir ? 'Ocultar' : 'Ver pedido';
      }
      if (b.dataset.act === 'avanzar') avanzar(id, b);
    });

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
