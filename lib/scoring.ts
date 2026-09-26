import { db } from '../db/db';
import { RankingCacheItem, CityRouteDetail, CityWithRoutes, VisaCategory } from './types';

export interface CalculationOptions {
  forceRecalculate?: boolean;
}

/**
 * Calculate Route Score:
 * Route_Score(c, d) = Is_Direct(c, d) * V_d * W_d
 */
export function calculateRouteScore(
  isDirect: boolean,
  visaScore: number,
  destWeight: number
): number {
  if (!isDirect) return 0;
  return Number((visaScore * destWeight).toFixed(6));
}

/**
 * Recalculates the entire India Global Access Index scoring matrix
 * and stores it into ranking_cache.
 */
export function calculateGlobalAccessIndex(options: CalculationOptions = {}): RankingCacheItem[] {
  const cached = db.getRankingCache();
  if (cached.length > 0 && !options.forceRecalculate) {
    return cached;
  }

  const cities = db.getCities();
  const routes = db.getRoutes();

  interface CityScoreAcc {
    airport_iata: string;
    city_name: string;
    state: string;
    intl_pax_volume: number;
    raw_score: number;
    direct_dest_count: number;
    visa_free_dest_count: number;
  }

  const cityMap = new Map<string, CityScoreAcc>();

  for (const city of cities) {
    cityMap.set(city.airport_iata.toUpperCase(), {
      airport_iata: city.airport_iata,
      city_name: city.city_name,
      state: city.state,
      intl_pax_volume: city.intl_pax_volume,
      raw_score: 0,
      direct_dest_count: 0,
      visa_free_dest_count: 0,
    });
  }

  // Aggregate route scores per city
  // De-duplicate multiple flights to the same destination airport if necessary or sum distinct destinations
  // The formula specifies: sum over destinations d in Destinations: Route_Score(c, d)
  // Let's ensure each unique destination per city is scored once for route score
  const processedCityDestinations = new Set<string>();

  for (const route of routes) {
    const originKey = route.origin_iata.toUpperCase();
    const cityAcc = cityMap.get(originKey);
    if (!cityAcc) continue;

    const routeUniqueKey = `${originKey}->${route.dest_iata.toUpperCase()}`;
    if (processedCityDestinations.has(routeUniqueKey)) {
      continue;
    }
    processedCityDestinations.add(routeUniqueKey);

    const visaRule = db.getVisaRule(route.dest_country);
    const visaScore = visaRule ? visaRule.visa_score : 0.20; // default 0.2 if unlisted
    const destWeight = db.getDestinationWeight(route.dest_country);

    const routeScore = calculateRouteScore(route.is_direct, visaScore, destWeight);

    cityAcc.raw_score += routeScore;
    if (route.is_direct) {
      cityAcc.direct_dest_count += 1;
      // Visa free reach includes VISA_FREE (1.0) and ETA/VOA (0.8)
      if (visaScore >= 0.8) {
        cityAcc.visa_free_dest_count += 1;
      }
    }
  }

  // Find max raw score for normalization
  const cityAccList = Array.from(cityMap.values());
  const maxRawScore = Math.max(...cityAccList.map((c) => c.raw_score), 0.0001);

  // Sort by raw_score descending, tie-break with intl_pax_volume
  cityAccList.sort((a, b) => {
    if (Math.abs(b.raw_score - a.raw_score) > 0.0001) {
      return b.raw_score - a.raw_score;
    }
    return b.intl_pax_volume - a.intl_pax_volume;
  });

  const now = new Date().toISOString();
  const rankings: RankingCacheItem[] = cityAccList.map((c, index) => {
    // Normalization: (Raw_Score / max(Raw_Score)) * 100
    const normalized = (c.raw_score / maxRawScore) * 100;
    return {
      rank: index + 1,
      airport_iata: c.airport_iata,
      city_name: c.city_name,
      state: c.state,
      intl_pax_volume: c.intl_pax_volume,
      raw_score: Number(c.raw_score.toFixed(4)),
      index_score: Number(normalized.toFixed(1)),
      direct_dest_count: c.direct_dest_count,
      visa_free_dest_count: c.visa_free_dest_count,
      calculated_at: now,
    };
  });

  // Save to DB ranking_cache
  db.saveRankingCache(rankings);

  return rankings;
}

/**
 * Get detailed routes with visa and scoring breakdown for a specific city
 */
export function getCityRoutesDetail(iata: string): CityWithRoutes | null {
  const city = db.getCityByIata(iata);
  if (!city) return null;

  const rankings = calculateGlobalAccessIndex();
  const ranking = rankings.find((r) => r.airport_iata.toUpperCase() === iata.toUpperCase());

  const routes = db.getRoutesByOrigin(iata);

  let visaFreeCount = 0;
  let etaVoaCount = 0;
  let evisaCount = 0;
  let visaRequiredCount = 0;

  const detailedRoutes: CityRouteDetail[] = routes.map((r) => {
    const visaRule = db.getVisaRule(r.dest_country);
    const visaCategory: VisaCategory = visaRule ? visaRule.visa_category : 'VISA_REQUIRED';
    const visaScore = visaRule ? visaRule.visa_score : 0.20;
    const destWeight = db.getDestinationWeight(r.dest_country);
    const routeScore = calculateRouteScore(r.is_direct, visaScore, destWeight);

    if (visaCategory === 'VISA_FREE') visaFreeCount++;
    else if (visaCategory === 'ETA / VOA') etaVoaCount++;
    else if (visaCategory === 'EVISA') evisaCount++;
    else visaRequiredCount++;

    return {
      dest_iata: r.dest_iata,
      dest_city: r.dest_city,
      dest_country: r.dest_country,
      is_direct: r.is_direct,
      flights_per_week: r.flights_per_week,
      avg_duration_mins: r.avg_duration_mins,
      data_source: r.data_source,
      visa_category: visaCategory,
      visa_score: visaScore,
      dest_weight: destWeight,
      route_score: Number(routeScore.toFixed(4)),
      max_stay_days: visaRule ? visaRule.max_stay_days : 'Varies',
      fee_usd: visaRule ? visaRule.fee_usd : 0,
    };
  });

  // Sort routes by route_score descending
  detailedRoutes.sort((a, b) => b.route_score - a.route_score);

  return {
    city,
    ranking,
    routes: detailedRoutes,
    category_counts: {
      visa_free: visaFreeCount,
      eta_voa: etaVoaCount,
      evisa: evisaCount,
      visa_required: visaRequiredCount,
    },
  };
}
