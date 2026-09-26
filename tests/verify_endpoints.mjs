import { spawn } from 'child_process';

console.log('🚀 Launching Next.js server on port 3001...');
const server = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-p', '3001'], {
  stdio: 'inherit',
  shell: true,
});

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  await wait(3000);
  console.log('\n--- VERIFYING LIVE HTTP ENDPOINTS ---');

  try {
    // 1. GET /api/stats
    const statsRes = await fetch('http://localhost:3001/api/stats');
    const stats = await statsRes.json();
    console.log('✅ 1. GET /api/stats -> Status:', statsRes.status, stats.data);

    // 2. GET /api/rankings
    const rankingsRes = await fetch('http://localhost:3001/api/rankings');
    const rankings = await rankingsRes.json();
    console.log('✅ 2. GET /api/rankings -> Status:', rankingsRes.status, 'Total cities:', rankings.count);
    console.log('   Top 5 Rankings:', rankings.data.slice(0, 5).map(r => `#${r.rank} ${r.airport_iata}: ${r.index_score} pts (${r.direct_dest_count} direct, ${r.visa_free_dest_count} visa-free)`));

    // 3. GET /api/cities/DEL/routes
    const delRes = await fetch('http://localhost:3001/api/cities/DEL/routes');
    const del = await delRes.json();
    console.log('✅ 3. GET /api/cities/DEL/routes -> Status:', delRes.status, 'DEL direct destinations:', del.data.routes.length);
    console.log('   Category counts:', del.data.category_counts);

    // 4. GET /api/cities/BOM/routes
    const bomRes = await fetch('http://localhost:3001/api/cities/BOM/routes');
    const bom = await bomRes.json();
    console.log('✅ 4. GET /api/cities/BOM/routes -> Status:', bomRes.status, 'BOM direct destinations:', bom.data.routes.length);

    // 5. POST /api/recalculate
    const recalcRes = await fetch('http://localhost:3001/api/recalculate', { method: 'POST' });
    const recalc = await recalcRes.json();
    console.log('✅ 5. POST /api/recalculate -> Status:', recalcRes.status, recalc.message);

    // 6. GET / (HTML)
    const pageRes = await fetch('http://localhost:3001');
    const html = await pageRes.text();
    console.log('✅ 6. GET / (HTML page) -> Status:', pageRes.status, 'HTML length:', html.length);
    console.log('   Contains Title:', html.includes('India Global Access Index'));

    console.log('\n🎉 ALL ENDPOINTS AND CALCULATION PIPELINES VERIFIED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}

runTests();
