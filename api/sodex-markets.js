const { send, query } = require('./_utils');
const sodex = require('../src/clients/sodex');
module.exports = async (req, res) => {
  const { asset = 'BTC' } = query(req);
  const [ticker, klines] = await Promise.all([sodex.getSpotTickers(asset), sodex.getSpotKlines(asset, '1d', 30)]);
  send(res, 200, { ok: ticker.ok || klines.ok, ticker, klines });
};
