import http from 'http';

function checkEndpoint(port, path = '/') {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          port,
          path,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          length: data.length,
          titleFound: data.includes('Savitribai Phule Pune University'),
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('--- VERIFYING SPPU SCOPUS DASHBOARD ENDPOINTS ---');
  for (const port of [8000, 8080, 3000]) {
    try {
      const res = await checkEndpoint(port, '/');
      console.log(`✅ Port ${port} [/]: HTTP ${res.status} | Content-Type: ${res.contentType} | SPPU Match: ${res.titleFound}`);
    } catch (err) {
      console.error(`❌ Port ${port} [/] failed: ${err.message}`);
    }
  }

  // Check CSS & Assets
  try {
    const css = await checkEndpoint(8000, '/style.css');
    console.log(`✅ Port 8000 [/style.css]: HTTP ${css.status} | Bytes: ${css.length}`);
    const logo = await checkEndpoint(8000, '/ICARE%20logo.jpeg');
    console.log(`✅ Port 8000 [/ICARE logo.jpeg]: HTTP ${logo.status} | Bytes: ${logo.length}`);
  } catch (err) {
    console.error(`❌ Asset check failed: ${err.message}`);
  }

  console.log('--- VERIFICATION COMPLETE ---');
}

run();
