import React from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';

interface IndicesSummaryProps {
  indices: MarketAsset[];
  onSelectIndex: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const IndicesSummary: React.FC<IndicesSummaryProps> = ({
  indices,
  onSelectIndex,
  isDarkMode,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Major World Indices
          </h2>
          <span className="text-xs text-slate-400">· Real-time snapshot</span>
        </div>
        <span className="text-xs text-slate-400">
          Showing {indices.length} benchmarks
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {indices.map((idx) => {
          const isPositive = idx.changePercent >= 0;
          const range = idx.high - idx.low || 1;
          const currentPos = Math.min(Math.max(((idx.price - idx.low) / range) * 100, 2), 98);

          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx)}
              className={`p-4 rounded-lg border transition-all cursor-pointer group hover:border-[#2962ff]/50 ${
                isDarkMode 
                  ? 'bg-[#1e222d] border-[#2a2e39] hover:bg-[#252a37]' 
                  : 'bg-white border-slate-200 hover:shadow-md'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {idx.symbol}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {idx.country}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-[160px]">
                    {idx.name}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIndex(idx);
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity ${
                    isDarkMode ? 'hover:bg-[#2a2e39] text-slate-300' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Open Full Chart"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price & Sparkline row */}
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <div className={`text-xl font-bold font-mono tracking-tight tabular-nums ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  <div className={`flex items-center gap-1.5 mt-0.5 text-xs font-mono font-medium tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}>
                    {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isPositive ? '+' : ''}{idx.change.toFixed(2)}</span>
                    <span>({isPositive ? '+' : ''}{idx.changePercent.toFixed(2)}%)</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <Sparkline
                    data={idx.sparkline}
                    isPositive={isPositive}
                    width={96}
                    height={36}
                  />
                </div>
              </div>

              {/* Day's Range Mini Bar */}
              <div className="mt-3 pt-2.5 border-t border-neutral-700/20 text-[10px] text-slate-400">
                <div className="flex justify-between items-center mb-1 font-mono tabular-nums">
                  <span>L: {idx.low.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                  <span className="text-slate-500 text-[9px] uppercase">Day Range</span>
                  <span>H: {idx.high.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                </div>
                <div className="relative w-full h-1 bg-neutral-700/30 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 bg-[#2962ff] rounded-full"
                    style={{ left: `${Math.max(currentPos - 4, 0)}%`, width: '12%' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
