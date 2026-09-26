'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  Plane,
  Sparkles,
  ChevronRight,
  Filter,
  Users,
  Building2,
  Trophy,
  SlidersHorizontal,
} from 'lucide-react';
import { RankingCacheItem } from '@/lib/types';

interface RankingsTableProps {
  rankings: RankingCacheItem[];
  onSelectCity: (iata: string) => void;
  isLoading: boolean;
}

type SortField = 'rank' | 'index_score' | 'direct_dest_count' | 'visa_free_dest_count' | 'intl_pax_volume';
type SortOrder = 'asc' | 'desc';

export const RankingsTable: React.FC<RankingsTableProps> = ({
  rankings,
  onSelectCity,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Extract unique states for filter dropdown
  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    rankings.forEach((r) => {
      if (r.state) states.add(r.state);
    });
    return Array.from(states).sort();
  }, [rankings]);

  // Filter & Sort Logic
  const filteredAndSortedRankings = useMemo(() => {
    return rankings
      .filter((item) => {
        const matchesSearch =
          item.city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.airport_iata.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.state && item.state.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesState =
          selectedState === 'ALL' || (item.state && item.state === selectedState);

        return matchesSearch && matchesState;
      })
      .sort((a, b) => {
        let valueA: number = (a[sortField] as number) || 0;
        let valueB: number = (b[sortField] as number) || 0;

        if (sortOrder === 'asc') {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      });
  }, [rankings, searchQuery, selectedState, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'rank' ? 'asc' : 'desc');
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-xs shadow-sm shadow-amber-500/10">
          <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" /> #1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-400/20 text-slate-200 font-bold border border-slate-400/40 text-xs">
          <Trophy className="w-3.5 h-3.5 text-slate-300 fill-slate-300/30" /> #2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-700/20 text-amber-400 font-bold border border-amber-700/40 text-xs">
          <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-600/30" /> #3
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-800/80 text-slate-400 font-medium text-xs border border-slate-700/60">
        #{rank}
      </span>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'from-emerald-400 to-teal-400 text-emerald-300';
    if (score >= 40) return 'from-sky-400 to-blue-500 text-sky-300';
    if (score >= 20) return 'from-amber-400 to-orange-500 text-amber-300';
    return 'from-slate-400 to-slate-500 text-slate-300';
  };

  const formatPax = (pax?: number) => {
    if (!pax) return 'N/A';
    if (pax >= 1000000) {
      return `${(pax / 1000000).toFixed(1)}M/yr`;
    }
    return `${(pax / 1000).toFixed(0)}k/yr`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Search & Filter Header Bar */}
      <div className="glass-panel p-4 rounded-2xl mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, airport IATA, or state..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/50 transition-all"
              id="search-cities-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* State Filter & Sorting Stats */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 font-medium">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-slate-900/80 border border-slate-700/80 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
                id="state-filter-select"
              >
                <option value="ALL">All States ({rankings.length})</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
              <span>
                Showing <strong className="text-white">{filteredAndSortedRankings.length}</strong> of {rankings.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="rankings-table">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th
                  onClick={() => handleSort('rank')}
                  className="py-4 px-5 cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4 px-5">City & Airport</th>
                <th
                  onClick={() => handleSort('index_score')}
                  className="py-4 px-5 cursor-pointer hover:text-white transition-colors min-w-[200px]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Global Access Score (0–100)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('direct_dest_count')}
                  className="py-4 px-5 cursor-pointer hover:text-white transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-sky-400" />
                    <span>Direct Destinations</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('visa_free_dest_count')}
                  className="py-4 px-5 cursor-pointer hover:text-white transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Visa-Free / VOA</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('intl_pax_volume')}
                  className="py-4 px-5 cursor-pointer hover:text-white transition-colors text-right hidden lg:table-cell"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Intl Pax Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-4 px-5 text-right">Route Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      <span>Loading calculation engine results...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedRankings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No Indian cities match your search filters.
                  </td>
                </tr>
              ) : (
                filteredAndSortedRankings.map((item) => {
                  const isTop3 = item.rank <= 3;
                  return (
                    <tr
                      key={item.airport_iata}
                      onClick={() => onSelectCity(item.airport_iata)}
                      className={`cursor-pointer transition-all duration-200 group ${
                        isTop3
                          ? 'bg-slate-900/40 hover:bg-slate-800/60'
                          : 'hover:bg-slate-800/40'
                      }`}
                      id={`city-row-${item.airport_iata}`}
                    >
                      {/* Rank Badge */}
                      <td className="py-4 px-5 whitespace-nowrap">{getRankBadge(item.rank)}</td>

                      {/* City & Airport */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center justify-center w-11 h-10 rounded-lg bg-slate-900 border border-slate-700/80 font-mono font-bold text-sky-400 group-hover:border-sky-500/50 group-hover:text-sky-300 transition-colors">
                            <span className="text-xs">{item.airport_iata}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-sky-300 transition-colors flex items-center gap-2">
                              <span>{item.city_name}</span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-500" />
                              <span>{item.state}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Global Access Score Progress Bar */}
                      <td className="py-4 px-5">
                        <div className="space-y-1.5">
                          <div className="flex items-baseline justify-between">
                            <span
                              className={`text-base font-black font-mono ${
                                item.index_score >= 75
                                  ? 'text-emerald-400'
                                  : item.index_score >= 40
                                  ? 'text-sky-400'
                                  : 'text-amber-400'
                              }`}
                            >
                              {item.index_score.toFixed(1)}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              Raw: {item.raw_score.toFixed(3)}
                            </span>
                          </div>
                          <div className="w-full bg-slate-900/90 rounded-full h-2 overflow-hidden border border-slate-800">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(
                                item.index_score
                              )} transition-all duration-500`}
                              style={{ width: `${Math.max(item.index_score, 3)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Direct Destinations Count */}
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/40 text-sky-300 border border-sky-800/40 font-bold text-xs">
                          <Plane className="w-3.5 h-3.5 text-sky-400" />
                          {item.direct_dest_count} direct
                        </span>
                      </td>

                      {/* Visa Free Reach */}
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-bold text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          {item.visa_free_dest_count} countries
                        </span>
                      </td>

                      {/* Pax Volume */}
                      <td className="py-4 px-5 text-right whitespace-nowrap font-mono text-xs text-slate-300 hidden lg:table-cell">
                        {formatPax(item.intl_pax_volume)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCity(item.airport_iata);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-medium border border-slate-700/60 hover:border-sky-500 transition-all duration-200 group-hover:bg-slate-700"
                        >
                          <span>View Routes</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
