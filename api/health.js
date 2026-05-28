const { send } = require('./_utils');
const { config } = require('../src/core/env');
module.exports = async (req, res) => send(res, 200, {
  ok: true,
  app: 'OnChain Pulse Studio',
  version: '1.0.0',
  configured: {
    sosovalue: Boolean(config.sosovalue.apiKey),
    sodexUser: Boolean(config.sodex.userAddress),
    sodexSigning: Boolean(config.sodex.keyName && config.sodex.privateKey),
    liveTrading: config.enableLiveTrading
  },
  time: new Date().toISOString()
});
