export interface City {
  airport_iata: string;
  city_name: string;
  state: string;
  intl_pax_volume: number;
}

export interface Route {
  route_id?: number;
  origin_iata: string;
  origin_city: string;
  dest_iata: string;
  dest_city: string;
  dest_country: string;
  is_direct: boolean;
  flights_per_week: number;
  avg_duration_mins: number;
  data_source: string;
  last_verified?: string;
}

export type VisaCategory = 'VISA_FREE' | 'ETA / VOA' | 'EVISA' | 'VISA_REQUIRED';

export interface VisaRule {
  dest_country: string;
  visa_category: VisaCategory;
  visa_score: number;
  max_stay_days: string;
  fee_usd: number;
}

export interface DestinationWeight {
  dest_country: string;
  dest_weight: number;
}

export interface RankingCacheItem {
  rank: number;
  airport_iata: string;
  city_name: string;
  state?: string;
  intl_pax_volume?: number;
  raw_score: number;
  index_score: number;
  direct_dest_count: number;
  visa_free_dest_count: number;
  calculated_at?: string;
}

export interface CityRouteDetail {
  dest_iata: string;
  dest_city: string;
  dest_country: string;
  is_direct: boolean;
  flights_per_week: number;
  avg_duration_mins: number;
  data_source: string;
  visa_category: VisaCategory;
  visa_score: number;
  dest_weight: number;
  route_score: number;
  max_stay_days: string;
  fee_usd: number;
}

export interface CityWithRoutes {
  city: City;
  ranking?: RankingCacheItem;
  routes: CityRouteDetail[];
  category_counts: {
    visa_free: number;
    eta_voa: number;
    evisa: number;
    visa_required: number;
  };
}

export interface StatsSummaryData {
  totalCities: number;
  totalRoutes: number;
  uniqueCountries: number;
  uniqueAirports?: number;
  topCity: string;
  topIata?: string;
  topScore: number;
  avgScore: number;
  lastCalculated: string;
}
