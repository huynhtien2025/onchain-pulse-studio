const crypto = require('crypto');
const { config } = require('../core/env');
const { requestJson, qs } = require('./http');

function assetToSodexSymbol(asset) {
  const a = String(asset || 'BTC').toUpperCase();
  const pairs = {
    BTC: 'vBTC_vUSDC',
    ETH: 'vETH_vUSDC',
    SOL: 'vSOL_vUSDC',
    SOSO: 'SOSO_USDC'
  };
  return pairs[a] || `${a}_USDC`;
}

async function getSpotTickers(asset) {
  const symbol = assetToSodexSymbol(asset);
  const paths = [
    `/markets/tickers${qs({ symbol })}`,
    `/markets/miniTickers${qs({ symbol })}`,
    `/markets/bookTickers${qs({ symbol })}`
  ];
  const attempts = [];
  for (const path of paths) {
    const res = await requestJson(`${config.sodex.spotBaseUrl}${path}`, { headers: { accept: 'application/json' } });
    if (res.ok) return { ...res, source: 'SoDEX', symbol };
    attempts.push({ path, status: res.status, error: res.error, body: res.body });
  }
  return { ok: false, source: 'SoDEX', symbol, error: 'No SoDEX market endpoint returned data', attempts };
}

async function getSpotKlines(asset, interval = '1d', limit = 30) {
  const symbol = assetToSodexSymbol(asset);
  const res = await requestJson(`${config.sodex.spotBaseUrl}/markets/${encodeURIComponent(symbol)}/klines${qs({ interval, limit })}`, {
    headers: { accept: 'application/json' }
  });
  return { ...res, source: 'SoDEX', symbol };
}

async function getAccountState() {
  if (!config.sodex.userAddress) return { ok: false, source: 'SoDEX', error: 'SODEX_USER_ADDRESS is not configured' };
  const path = `/accounts/${config.sodex.userAddress}/state${qs({ accountID: config.sodex.accountId })}`;
  return { ...(await requestJson(`${config.sodex.spotBaseUrl}${path}`, { headers: { accept: 'application/json' } })), source: 'SoDEX' };
}

function signPayload(payload) {
  if (!config.sodex.privateKey || !config.sodex.keyName) {
    return { ok: false, error: 'SoDEX signing keys are not configured' };
  }
  const message = JSON.stringify(payload);
  const key = String(config.sodex.privateKey).replace(/^0x/, '');
  const sign = crypto.createHmac('sha256', Buffer.from(key, 'hex')).update(message).digest('hex');
  return { ok: true, signature: `0x${sign}`, message };
}

async function placeOrder(order) {
  const payload = {
    timestamp: Date.now(),
    accountID: config.sodex.accountId,
    symbol: order.symbol || assetToSodexSymbol(order.asset),
    side: order.side,
    type: order.type || 'LIMIT',
    price: order.price,
    quantity: order.quantity,
    reduceOnly: Boolean(order.reduceOnly)
  };

  if (!config.enableLiveTrading) {
    return { ok: true, source: 'SoDEX', mode: 'dry-run', body: { accepted: false, payload, note: 'Live trading is disabled.' } };
  }

  const signed = signPayload(payload);
  if (!signed.ok) return { ok: false, source: 'SoDEX', error: signed.error };

  const res = await requestJson(`${config.sodex.spotBaseUrl}/trade/orders/batch`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-API-Key': config.sodex.keyName,
      'X-API-Sign': signed.signature
    },
    body: JSON.stringify({ orders: [payload] })
  });
  return { ...res, source: 'SoDEX', mode: 'live' };
}

module.exports = { assetToSodexSymbol, getSpotTickers, getSpotKlines, getAccountState, placeOrder };
