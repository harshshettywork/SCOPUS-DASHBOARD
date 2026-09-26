'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plane,
  Clock,
  Calendar,
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { CityWithRoutes, CityRouteDetail, VisaCategory } from '@/lib/types';

interface CityDrawerProps {
  iata: string | null;
  onClose: () => void;
}

export const CityDrawer: React.FC<CityDrawerProps> = ({ iata, onClose }) => {
  const [cityData, setCityData] = useState<CityWithRoutes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'VISA_FREE_VOA' | 'EVISA' | 'VISA_REQUIRED'>('ALL');
  const [destinationSearch, setDestinationSearch] = useState('');

  useEffect(() => {
    if (!iata) {
      setCityData(null);
      return;
    }

    const fetchCityRoutes = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/cities/${iata}/routes`);
        const json = await res.json();
        if (json.success) {
          setCityData(json.data);
        }
      } catch (err) {
        console.error('Error fetching city routes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityRoutes();
  }, [iata]);

  if (!iata) return null;

  // Filter routes based on selected category tab and search input
  const filteredRoutes = (cityData?.routes || []).filter((route) => {
    let matchesTab = true;
    if (activeTab === 'VISA_FREE_VOA') {
      matchesTab = route.visa_category === 'VISA_FREE' || route.visa_category === 'ETA / VOA';
    } else if (activeTab === 'EVISA') {
      matchesTab = route.visa_category === 'EVISA';
    } else if (activeTab === 'VISA_REQUIRED') {
      matchesTab = route.visa_category === 'VISA_REQUIRED';
    }

    const matchesSearch =
      destinationSearch === '' ||
      route.dest_city.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      route.dest_country.toLowerCase().includes(destinationSearch.toLowerCase()) ||
      route.dest_iata.toLowerCase().includes(destinationSearch.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours === 0) return `${m}m`;
    return m > 0 ? `${hours}h ${m}m` : `${hours}h`;
  };

  const getVisaBadge = (cat: VisaCategory) => {
    switch (cat) {
      case 'VISA_FREE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-[11px]">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Visa-Free (Score 1.0)
          </span>
        );
      case 'ETA / VOA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 font-bold border border-teal-500/40 text-[11px]">
            <Sparkles className="w-3 h-3 text-teal-400" /> ETA / VOA (Score 0.8)
          </span>
        );
      case 'EVISA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40 text-[11px]">
            <FileCheck2 className="w-3 h-3 text-sky-400" /> e-Visa (Score 0.6)
          </span>
        );
      case 'VISA_REQUIRED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 font-medium border border-slate-600/50 text-[11px]">
            <AlertCircle className="w-3 h-3 text-slate-400" /> Visa Required (Score 0.2)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-navy-900 border-l border-slate-800 shadow-2xl flex flex-col relative z-50">
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-800 bg-slate-900/90 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
              id="close-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {cityData ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold">
                    {cityData.city.airport_iata}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{cityData.city.state}</span>
                  {cityData.ranking && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                      National Rank #{cityData.ranking.rank}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-black text-white">{cityData.city.city_name}</h2>

                {cityData.ranking && (
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80">
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Access Score</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        {cityData.ranking.index_score.toFixed(1)}
                        <span className="text-xs text-slate-500 font-normal"> / 100</span>
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Direct Routes</span>
                      <span className="text-xl font-black text-sky-400 font-mono">
                        {cityData.ranking.direct_dest_count}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Visa-Free Reach</span>
                      <span className="text-xl font-black text-teal-400 font-mono">
                        {cityData.ranking.visa_free_dest_count}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Category Filter Tabs */}
          {cityData && (
            <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'ALL'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({cityData.routes.length})
                </button>
                <button
                  onClick={() => setActiveTab('VISA_FREE_VOA')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'VISA_FREE_VOA'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-800/80 text-emerald-400 hover:bg-slate-700'
                  }`}
                >
                  Visa-Free / VOA ({cityData.category_counts.visa_free + cityData.category_counts.eta_voa})
                </button>
                <button
                  onClick={() => setActiveTab('EVISA')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'EVISA'
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-slate-800/80 text-teal-400 hover:bg-slate-700'
                  }`}
                >
                  e-Visa ({cityData.category_counts.evisa})
                </button>
                <button
                  onClick={() => setActiveTab('VISA_REQUIRED')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    activeTab === 'VISA_REQUIRED'
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  Visa Required ({cityData.category_counts.visa_required})
                </button>
              </div>

              <input
                type="text"
                placeholder="Filter routes..."
                value={destinationSearch}
                onChange={(e) => setDestinationSearch(e.target.value)}
                className="w-full sm:w-44 px-2.5 py-1 bg-slate-900 border border-slate-700 text-xs rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          {/* Routes List Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            {isLoading ? (
              <div className="py-20 text-center text-slate-400">
                <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <span>Loading direct international connections...</span>
              </div>
            ) : filteredRoutes.length === 0 ? (
              <div className="py-16 text-center text-slate-400 glass-panel rounded-xl">
                <Plane className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="font-semibold text-slate-300">No routes match this filter</p>
                <p className="text-xs text-slate-500 mt-1">Try switching tabs or clearing your search term.</p>
              </div>
            ) : (
              filteredRoutes.map((route) => (
                <div
                  key={`${route.dest_iata}-${route.dest_country}`}
                  className="glass-panel p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center font-mono">
                        <span className="text-xs font-black text-sky-400">{route.dest_iata}</span>
                        <span className="text-[9px] text-slate-500 font-semibold">DIRECT</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">{route.dest_city}</h4>
                          <span className="text-xs text-slate-400">({route.dest_country})</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {formatDuration(route.avg_duration_mins)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-sky-400" />
                            {route.flights_per_week} flights/wk
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {getVisaBadge(route.visa_category)}
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        Weight: <strong className="text-slate-300">{route.dest_weight.toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Route Meta Bar */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                    <div>
                      <span className="text-slate-500 block">Stay Allowance</span>
                      <span className="text-slate-300 font-medium">{route.max_stay_days}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Visa Fee</span>
                      <span className="text-slate-300 font-medium">
                        {route.fee_usd > 0 ? `$${route.fee_usd} USD` : 'Free ($0)'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block">Contribution</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        +{route.route_score.toFixed(3)} pts
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 flex items-center justify-between">
            <span className="text-[11px]">Source: DGCA City-Pairs & IATA Mobility Database</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-xs font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
