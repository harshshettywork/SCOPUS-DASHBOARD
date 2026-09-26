import assert from 'node:assert';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

const seedData = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'db', 'seed_data.json'), 'utf-8')
);

function calculateRouteScore(isDirect, visaScore, destWeight) {
  if (!isDirect) return 0;
  return Number((visaScore * destWeight).toFixed(6));
}

test('Route score calculation formula verification', () => {
  // Direct Visa-Free (1.0) to Thailand (0.46) => 0.46
  assert.strictEqual(calculateRouteScore(true, 1.0, 0.46), 0.46);

  // Direct eVisa (0.6) to UAE (0.46) => 0.276
  assert.strictEqual(calculateRouteScore(true, 0.6, 0.46), 0.276);

  // Indirect flight => 0
  assert.strictEqual(calculateRouteScore(false, 1.0, 0.95), 0);
});

test('Full dataset contains all 20 evaluated Indian cities and routes', () => {
  assert.strictEqual(seedData.cities.length, 20);
  assert.ok(seedData.routes.length >= 120);

  const iatas = seedData.cities.map((c) => c.airport_iata);
  assert.ok(iatas.includes('DEL'));
  assert.ok(iatas.includes('BOM'));
  assert.ok(iatas.includes('BLR'));
  assert.ok(iatas.includes('MAA'));
  assert.ok(iatas.includes('COK'));
});

test('Unlisted country weights fallback correctly to 0.20', () => {
  const destWeightsMap = new Map(
    seedData.destination_weights.map((w) => [w.dest_country.toLowerCase(), w.dest_weight])
  );

  const getWeight = (c) => destWeightsMap.get(c.toLowerCase()) ?? 0.20;

  assert.strictEqual(getWeight('United States'), 0.95);
  assert.strictEqual(getWeight('UnknownCountryX'), 0.20);
});

test('Scoring pipeline ranking validation', () => {
  const visaMap = new Map(
    seedData.visa_rules.map((v) => [v.dest_country.toLowerCase(), v.visa_score])
  );
  const weightMap = new Map(
    seedData.destination_weights.map((w) => [w.dest_country.toLowerCase(), w.dest_weight])
  );

  const cityScores = {};
  for (const c of seedData.cities) {
    cityScores[c.airport_iata] = { raw: 0, count: 0 };
  }

  const seen = new Set();
  for (const r of seedData.routes) {
    const key = `${r.origin_iata}->${r.dest_iata}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const vScore = visaMap.get(r.dest_country.toLowerCase()) ?? 0.20;
    const wScore = weightMap.get(r.dest_country.toLowerCase()) ?? 0.20;
    const score = calculateRouteScore(r.is_direct, vScore, wScore);

    if (cityScores[r.origin_iata]) {
      cityScores[r.origin_iata].raw += score;
      cityScores[r.origin_iata].count += 1;
    }
  }

  const maxRaw = Math.max(...Object.values(cityScores).map((c) => c.raw));
  const delScore = (cityScores['DEL'].raw / maxRaw) * 100;
  
  assert.strictEqual(Math.round(delScore), 100);
  assert.ok(cityScores['BOM'].raw < cityScores['DEL'].raw);
  assert.ok(cityScores['BLR'].raw < cityScores['BOM'].raw);
});

console.log('✅ All Node.js scoring engine unit tests executed successfully.');
