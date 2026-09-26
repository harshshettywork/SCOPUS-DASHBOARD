'use client';

import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { TopPodium } from '@/components/TopPodium';
import { RankingsTable } from '@/components/RankingsTable';
import { CityDrawer } from '@/components/CityDrawer';
import { MethodologyModal } from '@/components/MethodologyModal';
import { RankingCacheItem, StatsSummaryData } from '@/lib/types';
import { CheckCircle2, AlertTriangle, Sparkles, PlaneTakeoff, Globe, Shield } from 'lucide-react';

export default function HomePage() {
  const [rankings, setRankings] = useState<RankingCacheItem[]>([]);
  const [stats, setStats] = useState<StatsSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCityIata, setSelectedCityIata] = useState<string | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [rankingsRes, statsRes] = await Promise.all([
        fetch('/api/rankings'),
        fetch('/api/stats'),
      ]);

      const rankingsData = await rankingsRes.json();
      const statsData = await statsRes.json();

      if (rankingsData.success) {
        setRankings(rankingsData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setIsRecalculating(true);
    try {
      const res = await fetch('/api/recalculate', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setRankings(json.data);
        // Refresh stats
        const statsRes = await fetch('/api/stats');
        const statsJson = await statsRes.json();
        if (statsJson.success) {
          setStats(statsJson.data);
        }
        showToast('Index scores recalculated & ranking cache refreshed!');
      }
    } catch (err) {
      console.error('Recalculation error:', err);
      showToast('Error recalculating index');
    } finally {
      setIsRecalculating(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const top3Cities = rankings.slice(0, 3);

  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 flex flex-col relative radial-bg">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl border border-emerald-400/50 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection
        stats={stats}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onRecalculate={handleRecalculate}
        isRecalculating={isRecalculating}
      />

      {/* Top 3 Podium Showcase */}
      {!isLoading && top3Cities.length >= 3 && (
        <TopPodium
          topCities={top3Cities}
          onSelectCity={(iata) => setSelectedCityIata(iata)}
        />
      )}

      {/* Main Rankings Table */}
      <RankingsTable
        rankings={rankings}
        onSelectCity={(iata) => setSelectedCityIata(iata)}
        isLoading={isLoading}
      />

      {/* City Route Matrix Drawer */}
      <CityDrawer
        iata={selectedCityIata}
        onClose={() => setSelectedCityIata(null)}
      />

      {/* Methodology & Transparency Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        onRecalculate={handleRecalculate}
        isRecalculating={isRecalculating}
      />

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">India Global Access Index</span>
              <span className="text-slate-400 block text-[11px]">
                A data-driven international physical and visa accessibility benchmark.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setIsMethodologyOpen(true)}
              className="text-slate-400 hover:text-sky-300 transition-colors"
            >
              Methodology Specification
            </button>
            <span>•</span>
            <span className="text-slate-400">PostgreSQL Schema & Calculation Engine</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Verifiable Open Aviation Data</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
