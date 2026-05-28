const { send, method, readBody } = require('./_utils');
const sodex = require('../src/clients/sodex');
module.exports = async (req, res) => {
  if (method(req) !== 'POST') return send(res, 405, { ok: false, error: 'POST only' });
  const body = await readBody(req);
  if (!body.asset || !body.side || !body.quantity) return send(res, 400, { ok: false, error: 'asset, side and quantity are required' });
  const result = await sodex.placeOrder(body);
  send(res, result.ok ? 200 : 400, result);
};
