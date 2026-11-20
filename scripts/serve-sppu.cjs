const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTS = process.env.PORT ? [parseInt(process.env.PORT, 10)] : [8000, 8080, 3000];
const SPPU_DIR = path.join(__dirname, '..', 'SPPU ALL CODES');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.text': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
};

function getScopusApiKey() {
  const keyFile = path.join(SPPU_DIR, 'scopuskey.text');
  if (fs.existsSync(keyFile)) {
    try {
      return fs.readFileSync(keyFile, 'utf8').trim();
    } catch {
      return '';
    }
  }
  return '';
}

async function handleRequest(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-ELS-APIKey, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(reqUrl.pathname);

  // Scopus API proxy to bypass browser CORS
  if (pathname === '/api/scopus') {
    const apiKey = req.headers['x-els-apikey'] || reqUrl.searchParams.get('apiKey') || getScopusApiKey();
    const query = reqUrl.searchParams.get('query') || 'AF-ID(60014953)';
    const start = reqUrl.searchParams.get('start') || '0';
    const count = reqUrl.searchParams.get('count') || '25';
    const sort = reqUrl.searchParams.get('sort') || '-coverDate';
    const field = reqUrl.searchParams.get('field') || 'dc:title,dc:creator,prism:publicationName,prism:coverDate,citedby-count,prism:doi,dc:identifier,affiliation,author';

    const targetUrl = `https://api.elsevier.com/content/search/scopus?query=${encodeURIComponent(query)}&start=${start}&count=${count}&sort=${encodeURIComponent(sort)}&field=${encodeURIComponent(field)}`;

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'X-ELS-APIKey': apiKey,
          'Accept': 'application/json'
        }
      });
      const data = await response.text();
      res.writeHead(response.status, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy request to Scopus failed', message: err.message }));
    }
    return;
  }

  // Default to index.html
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const filePath = path.join(SPPU_DIR, pathname.replace(/^\/+/, ''));

  // Security: prevent path traversal
  if (!filePath.startsWith(SPPU_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache',
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error');
      }
    });
    res.on('error', () => {});
    stream.pipe(res);
  });
}

process.on('uncaughtException', (err) => {
  console.warn('Recovered from exception:', err.message);
});

function startServerOnPort(port) {
  const server = http.createServer(handleRequest);
  server.listen(port, '0.0.0.0', () => {
    console.log(`✅ SPPU Dashboard live at: http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} is already in use.`);
    } else {
      console.error(`Error on port ${port}:`, err);
    }
  });
}

console.log('\n======================================================');
console.log('🏛️  SAVITRIBAI PHULE PUNE UNIVERSITY SCOPUS DASHBOARD');
console.log('======================================================');
for (const p of PORTS) {
  startServerOnPort(p);
}
console.log(`📁 Serving files from: ${SPPU_DIR}`);
console.log('Press Ctrl+C to stop.\n');

