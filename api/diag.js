const { MercadoPagoConfig, Preference } = require('mercadopago');
const { sbConfigurado, sbRest } = require('./_supabase');

const limpio = e => String(e && e.message || e).slice(0, 400);

module.exports = async (req, res) => {
  const out = { env: {}, supabase: null, mercadopago: null };

  out.env = {
    MERCADO_PAGO_ACCESS_TOKEN: !!process.env.MERCADO_PAGO_ACCESS_TOKEN,
    tokenTipo: String(process.env.MERCADO_PAGO_ACCESS_TOKEN || '').slice(0, 8),
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    NOTIFICATION_EMAIL: !!process.env.NOTIFICATION_EMAIL,
    FRONTEND_URL: process.env.FRONTEND_URL || null,
  };

  try {
    if (!sbConfigurado()) out.supabase = { ok: false, error: 'faltan las variables' };
    else {
      const filas = await sbRest('orders', { method: 'GET', query: '?select=status,payment_id,created_at&order=created_at.desc&limit=10' }) || [];
      const porEstado = {};
      filas.forEach(f => { porEstado[f.status] = (porEstado[f.status] || 0) + 1; });
      out.supabase = { ok: true, total: filas.length, porEstado,
        ultimos: filas.map(f => ({ status: f.status, pago: f.payment_id, cuando: f.created_at })) };
    }
  } catch (e) { out.supabase = { ok: false, error: limpio(e) }; }

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, options: { timeout: 8000 } });
    const r = await new Preference(client).create({ body: {
      items: [{ title: 'diag', quantity: 1, unit_price: 1000, currency_id: 'CLP' }],
      back_urls: { success: 'https://esencialtech.vercel.app/success', failure: 'https://esencialtech.vercel.app/cancel', pending: 'https://esencialtech.vercel.app/cancel' },
      auto_return: 'approved',
      purpose: 'wallet_purchase',
    }});
    out.mercadopago = { ok: true, id: r.id };
  } catch (e) {
    out.mercadopago = { ok: false, error: limpio(e), causa: limpio(JSON.stringify(e && e.cause || null)) };
  }

  res.status(200).json(out);
};
