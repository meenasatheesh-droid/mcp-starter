import React from 'react';
import { MarketAsset } from '../types/market';
import { Globe, TrendingUp, TrendingDown } from 'lucide-react';

interface WorldStockMarketsProps {
  indices: MarketAsset[];
  onSelectIndex: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

interface RegionalExchange {
  region: string;
  exchanges: Array<{
    name: string;
    city: string;
    status: 'Open' | 'Closed' | 'Pre-Market';
    indexSymbol: string;
  }>;
}

const REGIONS: RegionalExchange[] = [
  {
    region: 'Americas',
    exchanges: [
      { name: 'New York Stock Exchange', city: 'New York', status: 'Open', indexSymbol: 'S&P 500' },
      { name: 'Nasdaq Stock Market', city: 'New York', status: 'Open', indexSymbol: 'NDX' },
      { name: 'Toronto Stock Exchange', city: 'Toronto', status: 'Open', indexSymbol: 'DJI' },
    ],
  },
  {
    region: 'Europe',
    exchanges: [
      { name: 'Frankfurt Stock Exchange', city: 'Frankfurt', status: 'Closed', indexSymbol: 'DAX' },
      { name: 'London Stock Exchange', city: 'London', status: 'Closed', indexSymbol: 'FTSE 100' },
      { name: 'Euronext Paris', city: 'Paris', status: 'Closed', indexSymbol: 'STOXX 50' },
    ],
  },
  {
    region: 'Asia-Pacific',
    exchanges: [
      { name: 'Tokyo Stock Exchange', city: 'Tokyo', status: 'Closed', indexSymbol: 'N225' },
      { name: 'Hong Kong Stock Exchange', city: 'Hong Kong', status: 'Closed', indexSymbol: 'HSI' },
      { name: 'Singapore Exchange', city: 'Singapore', status: 'Closed', indexSymbol: 'RUT' },
    ],
  },
];

export const WorldStockMarkets: React.FC<WorldStockMarketsProps> = ({
  indices,
  onSelectIndex,
  isDarkMode,
}) => {
  return (
    <div className={`p-5 rounded-lg border transition-colors ${
      isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-700/20">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#2962ff]" />
          <h2 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            World Stock Markets & Global Exchanges
          </h2>
        </div>
        <span className="text-xs text-slate-400">Global Trading Sessions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REGIONS.map((reg) => (
          <div
            key={reg.region}
            className={`p-3.5 rounded-lg border ${
              isDarkMode ? 'bg-[#131722]/50 border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {reg.region}
            </h3>

            <div className="space-y-2.5">
              {reg.exchanges.map((exch) => {
                const matchedIndex = indices.find(
                  (i) => i.symbol === exch.indexSymbol || i.name.includes(exch.indexSymbol)
                );
                const isPos = (matchedIndex?.changePercent ?? 0) >= 0;

                return (
                  <div
                    key={exch.name}
                    onClick={() => {
                      if (matchedIndex) onSelectIndex(matchedIndex);
                    }}
                    className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between ${
                      isDarkMode 
                        ? 'bg-[#1e222d] border-[#2a2e39] hover:border-[#2962ff]' 
                        : 'bg-white border-slate-200 hover:border-[#2962ff]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          exch.status === 'Open' ? 'bg-[#089981] animate-pulse' : 'bg-slate-500'
                        }`} />
                        <span className={`font-semibold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {exch.city}
                        </span>
                        <span className="text-[10px] text-slate-400">({exch.status})</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                        {matchedIndex ? matchedIndex.symbol : exch.name}
                      </p>
                    </div>

                    {matchedIndex && (
                      <div className="text-right font-mono tabular-nums">
                        <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {matchedIndex.price.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                        </div>
                        <div className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}>
                          {isPos ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          <span>{isPos ? '+' : ''}{matchedIndex.changePercent.toFixed(2)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
