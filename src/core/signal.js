function clamp(n, min = 0, max = 100) { return Math.max(min, Math.min(max, n)); }

function computeSignal({ market, news = [], etf = [], sodex = null }) {
  const change = Number(market?.change24h || 0);
  const volume = Number(market?.volume24h || 0);
  const etfSum = etf.reduce((sum, row) => sum + Number(row.value || 0), 0);
  let score = 50;
  score += clamp(change, -10, 10) * 1.8;
  score += volume > 0 ? 8 : -4;
  score += clamp(etfSum / 10000000, -12, 12);
  score += news.length ? 5 : -3;
  if (sodex?.ok) score += 4;
  score = Math.round(clamp(score));
  const stance = score >= 70 ? 'ACCUMULATE' : score >= 55 ? 'WATCH' : score >= 40 ? 'NEUTRAL' : 'DEFENSIVE';
  const reasons = [
    `24h momentum: ${Number.isFinite(change) ? change.toFixed(2) : 'n/a'}%`,
    `Liquidity check: ${volume > 0 ? 'active' : 'not confirmed'}`,
    `News coverage: ${news.length} updates`,
    `Flow bias: ${etfSum > 0 ? 'positive' : etfSum < 0 ? 'negative' : 'not confirmed'}`
  ];
  return { score, stance, reasons };
}

module.exports = { computeSignal };
