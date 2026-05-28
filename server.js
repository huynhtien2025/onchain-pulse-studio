const http = require('http');
const fs = require('fs');
const path = require('path');
const publicDir = path.join(__dirname, 'public');
const apiDir = path.join(__dirname, 'api');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

function serveStatic(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const target = path.join(publicDir, file);
  if (!target.startsWith(publicDir) || !fs.existsSync(target)) {
    res.statusCode = 404; res.end('Not found'); return;
  }
  res.setHeader('content-type', mime[path.extname(target)] || 'application/octet-stream');
  fs.createReadStream(target).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname.startsWith('/api/')) {
      const name = url.pathname.replace('/api/', '').replace(/\.json$/, '');
      const file = path.join(apiDir, `${name}.js`);
      if (!fs.existsSync(file)) { res.statusCode = 404; res.end(JSON.stringify({ ok: false, error: 'API route not found' })); return; }
      delete require.cache[require.resolve(file)];
      return require(file)(req, res);
    }
    serveStatic(req, res);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ ok: false, error: error.message }));
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`OnChain Pulse Studio running at http://localhost:${port}`));
