'use client';

import React from 'react';
import { Trophy, Plane, MapPin, Sparkles, ChevronRight, Compass } from 'lucide-react';
import { RankingCacheItem } from '@/lib/types';

interface TopPodiumProps {
  topCities: RankingCacheItem[];
  onSelectCity: (iata: string) => void;
}

export const TopPodium: React.FC<TopPodiumProps> = ({ topCities, onSelectCity }) => {
  if (!topCities || topCities.length < 3) return null;

  const [first, second, third] = topCities;

  const getCardStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'glass-card-gold border-amber-500/40 text-amber-100';
      case 2:
        return 'glass-card-silver border-slate-400/40 text-slate-100';
      case 3:
        return 'glass-card-bronze border-amber-700/40 text-amber-200';
      default:
        return 'glass-panel';
    }
  };

  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-amber-400 fill-amber-400/20';
      case 2:
        return 'text-slate-300 fill-slate-300/20';
      case 3:
        return 'text-amber-600 fill-amber-600/20';
      default:
        return 'text-slate-400';
    }
  };

  const renderPodiumCard = (city: RankingCacheItem, rank: number, heightClass: string) => (
    <div
      key={city.airport_iata}
      onClick={() => onSelectCity(city.airport_iata)}
      className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${getCardStyle(
        rank
      )} ${heightClass} flex flex-col justify-between group shadow-xl`}
    >
      {/* Glow highlight */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/10">
              <Trophy className={`w-4 h-4 ${getTrophyColor(rank)}`} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/30 border border-white/10">
              Rank #{rank}
            </span>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">Index Score</div>
            <div className="text-2xl font-black tracking-tight text-white glow-text-emerald">
              {city.index_score.toFixed(1)}
            </div>
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              {city.airport_iata}
            </h3>
            <span className="text-xs text-slate-300 font-medium">({city.state})</span>
          </div>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{city.city_name}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        {/* Progress meter */}
        <div className="w-full bg-slate-900/60 rounded-full h-2 mb-3 overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full ${
              rank === 1
                ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                : rank === 2
                ? 'bg-gradient-to-r from-slate-300 to-sky-400'
                : 'bg-gradient-to-r from-amber-600 to-teal-400'
            }`}
            style={{ width: `${city.index_score}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-black/20">
            <span className="text-[10px] text-slate-400 block">Direct Flights</span>
            <span className="font-bold text-white flex items-center gap-1">
              <Plane className="w-3 h-3 text-sky-400" />
              {city.direct_dest_count} Destinations
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/20">
            <span className="text-[10px] text-slate-400 block">Easy Access</span>
            <span className="font-bold text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {city.visa_free_dest_count} Visa-Free / VOA
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-sky-300 transition-colors">
          <span>Click to inspect route matrix</span>
          <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-4 h-4 text-emerald-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Top 3 Global Gateways of India
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* Render Order: On mobile -> #1 first, #2 second, #3 third. On desktop (md:) -> #2 left, #1 center (elevated), #3 right */}
        {renderPodiumCard(first, 1, 'order-1 md:order-2 ring-1 ring-amber-500/30')}
        {renderPodiumCard(second, 2, 'order-2 md:order-1')}
        {renderPodiumCard(third, 3, 'order-3 md:order-3')}
      </div>
    </div>
  );
};
