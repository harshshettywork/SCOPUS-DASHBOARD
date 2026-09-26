'use client';

import React from 'react';
import {
  X,
  BookOpen,
  Calculator,
  ShieldCheck,
  Globe2,
  FileSpreadsheet,
  CheckCircle2,
  Info,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecalculate: () => void;
  isRecalculating: boolean;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
  onRecalculate,
  isRecalculating,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-navy-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 my-8">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Index Methodology & Transparency</h3>
              <p className="text-xs text-slate-400">Mathematical specification and verified data sources</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            id="close-methodology-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Philosophy Section */}
          <div className="glass-panel p-5 rounded-xl border border-sky-500/20 bg-sky-950/20">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm mb-2">
              <Info className="w-4 h-4" />
              <span>Core Philosophy</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Traditional passport indices measure nationality privileges in a vacuum. The{' '}
              <strong className="text-white">India Global Access Index</strong> measures real-world physical and bureaucratic mobility from Indian cities:
            </p>
            <div className="mt-3 p-3 rounded-lg bg-black/40 border border-slate-800 text-center">
              <span className="font-mono text-emerald-400 font-bold text-sm sm:text-base">
                Physical Connectivity (Direct Flights) × Visa Accessibility × Global Weight = Practical Access Score
              </span>
            </div>
          </div>

          {/* Mathematical Formula Section */}
          <div>
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              1. Mathematical Formulation
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 font-mono text-xs">
                <div>
                  <div className="text-slate-400 mb-1 font-sans font-medium text-xs">Step 1: Route Score Formula</div>
                  <div className="p-2.5 rounded bg-slate-900 text-sky-300 border border-slate-800 text-sm">
                    Route_Score(c, d) = Is_Direct(c, d) × V_d × W_d
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-1 font-sans font-medium text-xs">Step 2: City Aggregation</div>
                  <div className="p-2.5 rounded bg-slate-900 text-emerald-300 border border-slate-800 text-sm">
                    Raw_Score(c) = ∑ Route_Score(c, d)   [for all d ∈ Destinations]
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-1 font-sans font-medium text-xs">Step 3: Normalization (0–100 Benchmark)</div>
                  <div className="p-2.5 rounded bg-slate-900 text-amber-300 border border-slate-800 text-sm">
                    Index_Score(c) = ( Raw_Score(c) / max(Raw_Score) ) × 100
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visa Weights Table */}
          <div>
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-400" />
              2. Visa Accessibility Factor (V_d)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-slate-800 bg-slate-900 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Visa Category</th>
                    <th className="py-2.5 px-4 text-center">Score Multiplier (V_d)</th>
                    <th className="py-2.5 px-4">Representative Destinations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-emerald-400">VISA_FREE</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-center text-emerald-300">1.00</td>
                    <td className="py-2.5 px-4">Nepal, Thailand, Malaysia, Maldives, Qatar, Mauritius, Kazakhstan</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-teal-400">ETA / VOA</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-center text-teal-300">0.80</td>
                    <td className="py-2.5 px-4">Sri Lanka, Hong Kong (PAR), Indonesia, Myanmar, Cambodia, Kenya</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-sky-400">EVISA</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-center text-sky-300">0.60</td>
                    <td className="py-2.5 px-4">Vietnam, UAE, Saudi Arabia, Oman, Bahrain, Japan, Kuwait, Turkey, Egypt</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-slate-400">VISA_REQUIRED</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-center text-slate-300">0.20</td>
                    <td className="py-2.5 px-4">Singapore, United Kingdom, USA, Germany, France, Canada, Australia</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Destination Weights Table */}
          <div>
            <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-400" />
              3. Destination Importance Weights (W_d)
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Weights $W_d \in [0.10, 1.00]$ derived from World Bank GDP rankings + UN Tourism International Arrivals:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">United States</span>
                <span className="font-mono font-bold text-amber-400">0.950</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">France</span>
                <span className="font-mono font-bold text-amber-400">0.740</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">Japan</span>
                <span className="font-mono font-bold text-amber-400">0.700</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">Germany</span>
                <span className="font-mono font-bold text-amber-400">0.660</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">United Kingdom</span>
                <span className="font-mono font-bold text-amber-400">0.640</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">UAE</span>
                <span className="font-mono font-bold text-amber-400">0.460</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">Thailand</span>
                <span className="font-mono font-bold text-amber-400">0.460</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">Singapore</span>
                <span className="font-mono font-bold text-amber-400">0.380</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-300">Default Unlisted</span>
                <span className="font-mono font-bold text-slate-400">0.200</span>
              </div>
            </div>
          </div>

          {/* Passport Assumptions & Official Sources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Passport Assumption
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculations assume a <strong className="text-white">standard 36/60-page Indian regular passport</strong> with ordinary validity without reliance on third-party valid visas (such as US B1/B2 or Schengen visa exemptions).
              </p>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-slate-800">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-sky-400" />
                Official Primary Sources
              </h5>
              <ul className="text-xs text-slate-300 space-y-1">
                <li>• Airports Authority of India (AAI) Traffic Handbooks</li>
                <li>• DGCA City-Pair International Flight Schedules</li>
                <li>• IATA Timatic & Official Immigration Portals</li>
                <li>• UN Tourism Barometer & World Bank GDP Data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onRecalculate}
            disabled={isRecalculating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? 'animate-spin' : ''}`} />
            <span>{isRecalculating ? 'Recalculating Database...' : 'Run Scoring Matrix Recalculation'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
