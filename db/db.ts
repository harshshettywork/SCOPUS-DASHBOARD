import seedData from './seed_data.json';
import { City, Route, VisaRule, DestinationWeight, RankingCacheItem } from '../lib/types';
import fs from 'fs';
import path from 'path';

interface DBStore {
  cities: City[];
  routes: Route[];
  visa_rules: VisaRule[];
  destination_weights: DestinationWeight[];
  ranking_cache: RankingCacheItem[];
}

const DATA_FILE = path.join(process.cwd(), 'db', 'store.json');

class DatabaseService {
  private store: DBStore;

  constructor() {
    this.store = this.loadOrInitStore();
  }

  private loadOrInitStore(): DBStore {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing store.json, reinitializing with seed data.', e);
    }

    const initialStore: DBStore = {
      cities: [...(seedData.cities as City[])],
      routes: [...(seedData.routes as Route[])],
      visa_rules: [...(seedData.visa_rules as VisaRule[])],
      destination_weights: [...(seedData.destination_weights as DestinationWeight[])],
      ranking_cache: [],
    };

    return initialStore;
  }

  private saveStore(): void {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save store to file:', e);
    }
  }

  // --- CITIES ---
  public getCities(): City[] {
    return [...this.store.cities];
  }

  public getCityByIata(iata: string): City | undefined {
    return this.store.cities.find((c) => c.airport_iata.toUpperCase() === iata.toUpperCase());
  }

  // --- ROUTES ---
  public getRoutes(): Route[] {
    return [...this.store.routes];
  }

  public getRoutesByOrigin(originIata: string): Route[] {
    return this.store.routes.filter(
      (r) => r.origin_iata.toUpperCase() === originIata.toUpperCase()
    );
  }

  // --- VISA RULES ---
  public getVisaRules(): VisaRule[] {
    return [...this.store.visa_rules];
  }

  public getVisaRule(country: string): VisaRule | undefined {
    return this.store.visa_rules.find(
      (v) => v.dest_country.toLowerCase() === country.toLowerCase()
    );
  }

  // --- DESTINATION WEIGHTS ---
  public getDestinationWeights(): DestinationWeight[] {
    return [...this.store.destination_weights];
  }

  public getDestinationWeight(country: string): number {
    const item = this.store.destination_weights.find(
      (w) => w.dest_country.toLowerCase() === country.toLowerCase()
    );
    return item ? item.dest_weight : 0.20; // Default unlisted country weight is 0.20
  }

  // --- RANKING CACHE ---
  public getRankingCache(): RankingCacheItem[] {
    return [...this.store.ranking_cache];
  }

  public saveRankingCache(rankings: RankingCacheItem[]): void {
    this.store.ranking_cache = rankings;
    this.saveStore();
  }

  public resetToSeed(): void {
    this.store = {
      cities: [...(seedData.cities as City[])],
      routes: [...(seedData.routes as Route[])],
      visa_rules: [...(seedData.visa_rules as VisaRule[])],
      destination_weights: [...(seedData.destination_weights as DestinationWeight[])],
      ranking_cache: [],
    };
    this.saveStore();
  }
}

// Global Singleton for database service
export const db = new DatabaseService();
