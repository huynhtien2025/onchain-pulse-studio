const { send } = require('./_utils');
const sodex = require('../src/clients/sodex');
module.exports = async (req, res) => {
  const result = await sodex.getAccountState();
  send(res, 200, { ok: result.ok, source: 'SoDEX', account: result.body || null, error: result.error, status: result.status });
};
