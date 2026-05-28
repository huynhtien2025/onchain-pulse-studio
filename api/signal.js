const { send, query } = require('./_utils');
const soso = require('../src/clients/sosovalue');
const sodex = require('../src/clients/sodex');
const backup = require('../src/clients/backupMarket');
const { normalizeMarket, normalizeNews, normalizeRows } = require('../src/core/normalize');
const { computeSignal } = require('../src/core/signal');
module.exports = async (req, res) => {
  const { asset = 'BTC' } = query(req);
  const [sosoMarket, sodexMarket, backupMarket, newsRes, etfRes] = await Promise.all([
    soso.getMarket(asset), sodex.getSpotTickers(asset), backup.getTicker(asset), soso.getNews(asset), soso.getEtf(asset)
  ]);
  const market = normalizeMarket(asset, sosoMarket.ok ? sosoMarket : sodexMarket, backupMarket);
  const news = normalizeNews(newsRes);
  const etf = normalizeRows(etfRes);
  send(res, 200, { ok: Boolean(market.price), signal: computeSignal({ market, news, etf, sodex: sodexMarket }), market, news, etf, sources: { sosovalue: sosoMarket.ok || newsRes.ok || etfRes.ok, sodex: sodexMarket.ok } });
};
