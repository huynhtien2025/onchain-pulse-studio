const path = require('path');
const root = path.join(__dirname, '..');
require(path.join(root, 'src/core/env'));

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
}

function method(req) { return String(req.method || 'GET').toUpperCase(); }

async function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { resolve({}); }
    });
  });
}

function query(req) {
  const base = 'http://localhost';
  return Object.fromEntries(new URL(req.url, base).searchParams.entries());
}

module.exports = { send, method, readBody, query };
