const { send, query } = require('./_utils');
const soso = require('../src/clients/sosovalue');
const { normalizeNews } = require('../src/core/normalize');
module.exports = async (req, res) => {
  const { asset = 'BTC' } = query(req);
  const result = await soso.getNews(asset);
  send(res, 200, { ok: result.ok, source: 'SoSoValue', news: normalizeNews(result), error: result.error, attempts: result.attempts });
};
