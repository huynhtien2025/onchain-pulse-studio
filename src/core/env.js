const env = (name, fallback = '') => {
  const value = process.env[name];
  return value === undefined || value === null || value === '' ? fallback : value;
};

const boolEnv = (name, fallback = false) => {
  const value = env(name, String(fallback));
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
};

const config = {
  nodeEnv: env('NODE_ENV', 'development'),
  enableLiveTrading: boolEnv('ENABLE_LIVE_TRADING', false),
  sosovalue: {
    apiKey: env('SOSOVALUE_API_KEY'),
    baseUrl: env('SOSOVALUE_BASE_URL', 'https://openapi.sosovalue.com/openapi/v1').replace(/\/$/, ''),
    authHeader: env('SOSOVALUE_AUTH_HEADER', 'x-api-key'),
    marketPath: env('SOSOVALUE_MARKET_PATH'),
    newsPath: env('SOSOVALUE_NEWS_PATH'),
    etfPath: env('SOSOVALUE_ETF_PATH'),
    indexPath: env('SOSOVALUE_INDEX_PATH')
  },
  sodex: {
    spotBaseUrl: env('SODEX_SPOT_BASE_URL', 'https://mainnet-gw.sodex.dev/api/v1/spot').replace(/\/$/, ''),
    perpsBaseUrl: env('SODEX_PERPS_BASE_URL', 'https://mainnet-gw.sodex.dev/api/v1/perps').replace(/\/$/, ''),
    userAddress: env('SODEX_USER_ADDRESS'),
    accountId: env('SODEX_ACCOUNT_ID'),
    keyName: env('SODEX_API_KEY_NAME'),
    publicKey: env('SODEX_API_PUBLIC_KEY'),
    privateKey: env('SODEX_API_PRIVATE_KEY')
  },
  backup: {
    baseUrl: env('MARKET_BACKUP_BASE_URL', 'https://api.binance.com/api/v3').replace(/\/$/, '')
  }
};

module.exports = { env, boolEnv, config };
