'use client';

import React from 'react';
import { Globe, Plane, ShieldCheck, Sparkles, BookOpen, RefreshCw } from 'lucide-react';
import { StatsSummaryData } from '@/lib/types';

interface HeroSectionProps {
  stats: StatsSummaryData | null;
  onOpenMethodology: () => void;
  onRecalculate: () => void;
  isRecalculating: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onOpenMethodology,
  onRecalculate,
  isRecalculating,
}) => {
  return (
    <div className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-xs font-medium text-emerald-400 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Indian Passport Mobility Benchmark • 2026 Edition</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMethodology}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-colors backdrop-blur-md shadow-sm"
              id="hero-methodology-btn"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Methodology & Sources</span>
            </button>

            <button
              onClick={onRecalculate}
              disabled={isRecalculating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/50 rounded-lg transition-all backdrop-blur-md shadow-sm active:scale-95 disabled:opacity-50"
              id="hero-recalculate-btn"
              title="Recalculate Index Scores"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>{isRecalculating ? 'Recalculating...' : 'Recalculate Index'}</span>
            </button>
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-4xl mb-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
            India Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">Access Index</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-light leading-relaxed max-w-3xl">
            Which Indian city gives you the easiest physical and visa access to the rest of the world?
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Scoring Engine Formula:</span>
            <code className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800 text-sky-300 font-mono text-[11px]">
              Route Score = Direct Flight × Visa Ease (V_d) × Global Weight (W_d)
            </code>
          </div>
        </div>

        {/* Quick Stats Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-sky-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gateway Cities</span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats?.totalCities ?? 20} <span className="text-sm font-normal text-slate-400">Cities</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Evaluated across all Indian states</p>
          </div>

          <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Direct Routes</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Plane className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats?.totalRoutes ?? 120}+ <span className="text-sm font-normal text-slate-400">Routes</span>
            </div>
            <p className="text-[11px] text-emerald-400/90 mt-1">
              To {stats?.uniqueCountries ?? 42} countries worldwide
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top Access Hub</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-2">
              <span>{stats?.topIata ?? 'DEL'}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                100.0 Score
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Delhi (Indira Gandhi Intl)</p>
          </div>

          <div className="glass-panel p-4 rounded-xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Data Integrity</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              100% <span className="text-sm font-normal text-slate-400">Verifiable</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">DGCA, AAI, UN Tourism & World Bank</p>
          </div>
        </div>
      </div>
    </div>
  );
};
