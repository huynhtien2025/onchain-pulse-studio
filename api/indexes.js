const { send } = require('./_utils');
const soso = require('../src/clients/sosovalue');
const { normalizeRows } = require('../src/core/normalize');
module.exports = async (req, res) => {
  const result = await soso.getIndexes();
  send(res, 200, { ok: result.ok, source: 'SoSoValue', rows: normalizeRows(result), error: result.error, attempts: result.attempts });
};
