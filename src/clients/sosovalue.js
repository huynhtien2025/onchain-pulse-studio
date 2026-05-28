const { config } = require('../core/env');
const { requestJson, qs } = require('./http');

function sosoHeaders() {
  const headers = { accept: 'application/json' };
  if (config.sosovalue.apiKey) {
    if (config.sosovalue.authHeader.toLowerCase() === 'authorization') {
      headers.authorization = `Bearer ${config.sosovalue.apiKey}`;
    } else {
      headers[config.sosovalue.authHeader] = config.sosovalue.apiKey;
    }
  }
  return headers;
}

async function trySoso(paths, params = {}) {
  if (!config.sosovalue.apiKey) {
    return { ok: false, source: 'SoSoValue', error: 'SOSOVALUE_API_KEY is not configured' };
  }
  const errors = [];
  for (const path of paths.filter(Boolean)) {
    const clean = path.startsWith('/') ? path : `/${path}`;
    const url = `${config.sosovalue.baseUrl}${clean}${qs(params)}`;
    const res = await requestJson(url, { headers: sosoHeaders() });
    if (res.ok) return { ...res, source: 'SoSoValue' };
    errors.push({ path: clean, status: res.status, error: res.error, body: res.body });
  }
  return { ok: false, source: 'SoSoValue', error: 'No SoSoValue endpoint returned data', attempts: errors };
}

async function getMarket(asset) {
  const symbol = String(asset || 'BTC').toUpperCase();
  return trySoso([
    config.sosovalue.marketPath,
    '/currency/market-data',
    '/currency/market/snapshot',
    '/currency/info',
    '/market/snapshot',
    '/coins/markets'
  ], { symbol, currency: symbol, coin: symbol });
}

async function getNews(asset) {
  const symbol = String(asset || 'BTC').toUpperCase();
  return trySoso([
    config.sosovalue.newsPath,
    '/news',
    '/news/feed',
    '/alpha/news',
    '/crypto/news'
  ], { symbol, keyword: symbol, limit: 20, pageSize: 20 });
}

async function getEtf(asset) {
  const symbol = String(asset || 'BTC').toUpperCase();
  return trySoso([
    config.sosovalue.etfPath,
    '/etf/flow',
    '/etf/dashboard',
    '/etf/net-inflow',
    '/indexes/etf-flow'
  ], { symbol, asset: symbol, limit: 30 });
}

async function getIndexes() {
  return trySoso([
    config.sosovalue.indexPath,
    '/index',
    '/indexes',
    '/index/dashboard',
    '/sector/indexes'
  ], { limit: 30 });
}

module.exports = { getMarket, getNews, getEtf, getIndexes };
