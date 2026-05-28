const { config } = require('../src/core/env');
const rows = [
  ['SOSOVALUE_API_KEY', Boolean(config.sosovalue.apiKey)],
  ['SODEX_USER_ADDRESS', Boolean(config.sodex.userAddress)],
  ['SODEX_API_KEY_NAME', Boolean(config.sodex.keyName)],
  ['SODEX_API_PRIVATE_KEY', Boolean(config.sodex.privateKey)],
  ['ENABLE_LIVE_TRADING', config.enableLiveTrading]
];
console.table(rows.map(([name, ok]) => ({ name, status: ok ? 'OK' : 'MISSING/OFF' })));
