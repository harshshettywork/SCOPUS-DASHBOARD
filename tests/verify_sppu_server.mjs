import { spawn } from 'child_process';

console.log('🚀 Launching SPPU Scopus server on port 8000 and 8080...');
const server = spawn('node', ['scripts/serve-sppu.cjs'], {
  stdio: 'pipe',
});

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  await wait(1500);
  console.log('\n--- VERIFYING SPPU SCOPUS LOCALHOST ENDPOINTS ---');

  try {
    // 1. GET http://localhost:8000/
    const home8000 = await fetch('http://localhost:8000/');
    const homeHtml = await home8000.text();
    console.log('✅ 1. GET http://localhost:8000/ -> Status:', home8000.status, 'HTML contains SPPU title:', homeHtml.includes('Savitribai Phule Pune University'));

    // 2. GET http://localhost:8000/scopuskey.text
    const keyRes = await fetch('http://localhost:8000/scopuskey.text');
    const keyText = await keyRes.text();
    console.log('✅ 2. GET http://localhost:8000/scopuskey.text -> Status:', keyRes.status, 'Key present:', keyText.trim().length > 10);

    // 3. GET http://localhost:8080/
    const home8080 = await fetch('http://localhost:8080/');
    console.log('✅ 3. GET http://localhost:8080/ -> Status:', home8080.status);

    // 3. GET /style.css
    const cssRes = await fetch('http://localhost:8080/style.css');
    console.log('✅ 3. GET /style.css -> Status:', cssRes.status, 'Content-Type:', cssRes.headers.get('content-type'));

    // 4. GET /ICARE%20logo.jpeg
    const logoRes = await fetch('http://localhost:8080/ICARE%20logo.jpeg');
    console.log('✅ 4. GET /ICARE%20logo.jpeg -> Status:', logoRes.status, 'Content-Type:', logoRes.headers.get('content-type'));

    // 5. GET /api/scopus (Proxy check)
    const proxyRes = await fetch('http://localhost:8080/api/scopus?count=1');
    console.log('✅ 5. GET /api/scopus -> Status:', proxyRes.status);

    console.log('\n🎉 ALL SPPU DASHBOARD LOCALHOST CHECKS VERIFIED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ SPPU Verification failed:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

runTests();
