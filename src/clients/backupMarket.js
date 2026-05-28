const { config } = require('../core/env');
const { requestJson, qs } = require('./http');

const mapSymbol = (asset) => `${String(asset || 'BTC').toUpperCase()}USDT`;

async function getTicker(asset) {
  const symbol = mapSymbol(asset);
  const [ticker, price] = await Promise.all([
    requestJson(`${config.backup.baseUrl}/ticker/24hr${qs({ symbol })}`),
    requestJson(`${config.backup.baseUrl}/ticker/price${qs({ symbol })}`)
  ]);
  if (!ticker.ok && !price.ok) return { ok: false, source: 'External Market Backup', error: ticker.error || price.error, attempts: [ticker, price] };
  return {
    ok: true,
    source: 'External Market Backup',
    body: {
      symbol,
      price: Number(price.body?.price || ticker.body?.lastPrice || 0),
      change24h: Number(ticker.body?.priceChangePercent || 0),
      volume24h: Number(ticker.body?.quoteVolume || 0),
      high24h: Number(ticker.body?.highPrice || 0),
      low24h: Number(ticker.body?.lowPrice || 0),
      raw: { ticker: ticker.body, price: price.body }
    }
  };
}

async function getKlines(asset, interval = '1d', limit = 30) {
  const symbol = mapSymbol(asset);
  const res = await requestJson(`${config.backup.baseUrl}/klines${qs({ symbol, interval, limit })}`);
  if (!res.ok) return { ...res, source: 'External Market Backup' };
  return {
    ok: true,
    source: 'External Market Backup',
    body: (Array.isArray(res.body) ? res.body : []).map((row) => ({
      time: row[0],
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5])
    }))
  };
}

module.exports = { getTicker, getKlines };
