import React, { useState } from 'react';
import { SectorItem, MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown, Layers, ChevronRight } from 'lucide-react';

interface SectorHeatmapProps {
  sectors: SectorItem[];
  stocks: MarketAsset[];
  onSelectStock: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({
  sectors,
  stocks,
  onSelectStock,
  isDarkMode,
}) => {
  const [selectedSector, setSelectedSector] = useState<SectorItem | null>(null);

  // Helper for TradingView heatmap color scale
  const getPerformanceBg = (change: number) => {
    if (change >= 2.5) return 'bg-[#089981] text-white';
    if (change >= 1.0) return 'bg-[#00a884] text-white';
    if (change > 0) return 'bg-[#00897b]/80 text-white';
    if (change === 0) return 'bg-[#363a45] text-slate-300';
    if (change > -1.0) return 'bg-[#c62828]/80 text-white';
    if (change > -2.5) return 'bg-[#d32f2f] text-white';
    return 'bg-[#f23645] text-white';
  };

  return (
    <div className={`p-5 rounded-lg border transition-colors ${
      isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Market Sectors Heatmap
            </h2>
            <span className="text-xs text-slate-400">· S&P 500 Performance Map</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tile size indicates sector market capitalization weight; color indicates 1-day percentage change.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 text-[11px] font-mono self-start sm:self-auto">
          <span className="text-slate-400 mr-1">-3%</span>
          <span className="w-5 h-3 rounded-sm bg-[#f23645]"></span>
          <span className="w-5 h-3 rounded-sm bg-[#d32f2f]"></span>
          <span className="w-5 h-3 rounded-sm bg-[#c62828]/80"></span>
          <span className="w-5 h-3 rounded-sm bg-[#363a45]"></span>
          <span className="w-5 h-3 rounded-sm bg-[#00897b]/80"></span>
          <span className="w-5 h-3 rounded-sm bg-[#00a884]"></span>
          <span className="w-5 h-3 rounded-sm bg-[#089981]"></span>
          <span className="text-slate-400 ml-1">+3%</span>
        </div>
      </div>

      {/* Main Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {sectors.map((sec) => {
          const isPos = sec.changePercent >= 0;
          const isSelected = selectedSector?.id === sec.id;
          const bgClass = getPerformanceBg(sec.changePercent);

          return (
            <div
              key={sec.id}
              onClick={() => setSelectedSector(isSelected ? null : sec)}
              className={`p-4 rounded-md cursor-pointer transition-all border transform hover:scale-[1.01] ${bgClass} ${
                isSelected ? 'ring-2 ring-white shadow-lg' : 'border-black/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-sm tracking-tight truncate pr-2">
                  {sec.name}
                </span>
                <span className="font-mono text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded bg-black/20 shrink-0">
                  {isPos ? '+' : ''}{sec.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs opacity-90">
                <span className="font-mono">{sec.marketCap}</span>
                <span className="text-[11px]">{sec.weight}% weight</span>
              </div>

              <div className="mt-2 pt-2 border-t border-white/20 text-[11px] flex items-center justify-between opacity-95">
                <span className="truncate">Top: {sec.topStock}</span>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sector Deep Dive / Leaders Inspector */}
      {selectedSector && (
        <div className={`mt-5 p-4 rounded-lg border transition-all animate-fadeIn ${
          isDarkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2962ff]" />
              <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {selectedSector.name} — Industry Leaders
              </h3>
            </div>
            <button
              onClick={() => setSelectedSector(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {selectedSector.leaders.map((leader) => {
              const matchingStock = stocks.find((s) => s.symbol === leader.symbol);
              const isPos = leader.change >= 0;

              return (
                <div
                  key={leader.symbol}
                  onClick={() => {
                    if (matchingStock) onSelectStock(matchingStock);
                  }}
                  className={`p-3 rounded border cursor-pointer transition-all hover:border-[#2962ff] ${
                    isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {leader.symbol}
                    </span>
                    <span className={`text-[11px] font-mono font-bold tabular-nums ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}>
                      {isPos ? '+' : ''}{leader.change.toFixed(2)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{leader.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">{leader.marketCap}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
