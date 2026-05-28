const { send, query } = require('./_utils');
const soso = require('../src/clients/sosovalue');
const sodex = require('../src/clients/sodex');
const backup = require('../src/clients/backupMarket');
const { normalizeMarket } = require('../src/core/normalize');

module.exports = async (req, res) => {
  const { asset = 'BTC' } = query(req);
  const [sosoMarket, sodexMarket, backupMarket, klines] = await Promise.all([
    soso.getMarket(asset),
    sodex.getSpotTickers(asset),
    backup.getTicker(asset),
    backup.getKlines(asset, '1d', 30)
  ]);
  const selected = sosoMarket.ok ? sosoMarket : (sodexMarket.ok ? sodexMarket : null);
  const market = normalizeMarket(asset, selected, backupMarket);
  send(res, 200, {
    ok: Boolean(market.price),
    market,
    chart: klines.ok ? klines.body : [],
    sources: {
      primary: { name: 'SoSoValue', ok: sosoMarket.ok, error: sosoMarket.error, attempts: sosoMarket.attempts },
      execution: { name: 'SoDEX', ok: sodexMarket.ok, error: sodexMarket.error, attempts: sodexMarket.attempts },
      backup: { name: 'External Market Backup', ok: backupMarket.ok, error: backupMarket.error }
    }
  });
};
