function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function deepFindNumber(input, keys) {
  const wanted = keys.map((k) => k.toLowerCase());
  const seen = new Set();

  function scan(value) {
    if (!value || typeof value !== 'object' || seen.has(value)) return null;
    seen.add(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        const got = scan(item);
        if (got !== null) return got;
      }
      return null;
    }

    for (const [key, val] of Object.entries(value)) {
      if (wanted.includes(key.toLowerCase())) {
        const n = toNumber(val);
        if (n !== null) return n;
      }
    }

    for (const val of Object.values(value)) {
      const got = scan(val);
      if (got !== null) return got;
    }

    return null;
  }

  return scan(input);
}

function firstArray(input) {
  if (Array.isArray(input)) return input;
  if (!input || typeof input !== 'object') return [];
  for (const val of Object.values(input)) {
    if (Array.isArray(val)) return val;
    if (val && typeof val === 'object') {
      const nested = firstArray(val);
      if (nested.length) return nested;
    }
  }
  return [];
}

function unwrapData(raw) {
  if (!raw) return raw;
  if (Array.isArray(raw)) return raw[0] || raw;
  if (Array.isArray(raw.data)) return raw.data[0] || raw.data;
  if (raw.data && typeof raw.data === 'object') return raw.data;
  return raw;
}

function normalizeMarket(asset, primary, backup) {
  const selected = primary?.ok ? primary : backup;
  const raw = selected?.body;
  const row = unwrapData(raw);

  const price =
    deepFindNumber(row, [
      'lastPx',
      'lastPrice',
      'price',
      'close',
      'current_price',
      'last',
      'markPrice',
      'markPx',
      'bidPx',
      'askPx'
    ]) ??
    deepFindNumber(raw, [
      'lastPx',
      'lastPrice',
      'price',
      'close',
      'current_price',
      'last',
      'markPrice',
      'markPx',
      'bidPx',
      'askPx'
    ]);

  const change24h =
    deepFindNumber(row, [
      'changePct',
      'changePercent',
      'change24h',
      'priceChangePercent',
      'percentChange24h',
      'changePercent24h',
      'priceChange24h'
    ]) ??
    deepFindNumber(raw, [
      'changePct',
      'changePercent',
      'change24h',
      'priceChangePercent',
      'percentChange24h',
      'changePercent24h',
      'priceChange24h'
    ]);

  const volume24h =
    deepFindNumber(row, [
      'quoteVolume',
      'volume24h',
      'baseVolume',
      'volume',
      'totalVolume',
      'amount24h'
    ]) ??
    deepFindNumber(raw, [
      'quoteVolume',
      'volume24h',
      'baseVolume',
      'volume',
      'totalVolume',
      'amount24h'
    ]);

  const marketCap =
    deepFindNumber(row, ['marketCap', 'market_cap', 'mcap']) ??
    deepFindNumber(raw, ['marketCap', 'market_cap', 'mcap']);

  return {
    asset: String(asset || 'BTC').toUpperCase(),
    source: selected?.source || null,
    price,
    change24h,
    volume24h,
    marketCap,
    raw
  };
}

function normalizeNews(res) {
  if (!res?.ok) return [];
  return firstArray(res.body).slice(0, 20).map((item, idx) => ({
    id: item.id || item.newsId || item.slug || idx,
    title: item.title || item.name || item.headline || item.subject || 'Untitled update',
    summary: item.summary || item.description || item.content || item.brief || item.text || '',
    url: item.url || item.link || item.sourceUrl || item.shareUrl || '',
    time: item.time || item.publishedAt || item.publishTime || item.createdAt || item.date || ''
  }));
}

function normalizeRows(res, limit = 30) {
  if (!res?.ok) return [];
  const arr = firstArray(res.body);
  return arr.slice(0, limit).map((item, idx) => ({
    id: item.id || item.symbol || item.name || idx,
    label: item.label || item.date || item.time || item.symbol || item.name || item.title || `Item ${idx + 1}`,
    value: Number(item.value ?? item.netInflow ?? item.netFlow ?? item.amount ?? item.price ?? item.close ?? item.volume ?? item.quoteVolume ?? 0),
    raw: item
  }));
}

module.exports = { deepFindNumber, firstArray, normalizeMarket, normalizeNews, normalizeRows };
