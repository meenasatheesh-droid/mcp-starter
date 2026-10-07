import React from 'react';
import { MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

interface ForexMatrixProps {
  forexPairs: MarketAsset[];
  onSelectForex: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const ForexMatrix: React.FC<ForexMatrixProps> = ({
  forexPairs,
  onSelectForex,
  isDarkMode,
}) => {
  return (
    <div className="space-y-4">
      {/* Forex Table */}
      <div className={`rounded-lg border overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'border-[#2a2e39]' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Major Currency Pairs (FX)
            </h3>
            <p className="text-xs text-slate-400">Institutional spot forex rates with live pip spreads</p>
          </div>
          <span className="text-xs text-[#089981] font-mono">24/5 Liquid Market</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-slate-400 font-medium ${
              isDarkMode ? 'bg-[#181b23] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className="py-2.5 pl-4 pr-3">Pair</th>
                <th className="py-2.5 px-3 text-right">Bid</th>
                <th className="py-2.5 px-3 text-right">Ask</th>
                <th className="py-2.5 px-3 text-right">Spread (pips)</th>
                <th className="py-2.5 px-3 text-right">24h Change</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">Day High</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">Day Low</th>
                <th className="py-2.5 px-3 text-center hidden md:table-cell">Technical</th>
                <th className="py-2.5 pr-4 pl-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#2a2e39]' : 'divide-slate-200'}`}>
              {forexPairs.map((pair) => {
                const isPos = pair.changePercent >= 0;
                const spreadPips = (pair.digits === 4 ? 0.8 : 1.2).toFixed(1);
                const askPrice = (pair.price + (pair.digits === 4 ? 0.00008 : 0.012)).toFixed(pair.digits ?? 4);

                return (
                  <tr
                    key={pair.id}
                    onClick={() => onSelectForex(pair)}
                    className={`cursor-pointer transition-colors group ${
                      isDarkMode ? 'hover:bg-[#252a37]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded font-mono font-bold text-xs flex items-center justify-center ${
                          isDarkMode ? 'bg-[#2a2e39] text-white' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {pair.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className={`font-mono font-bold text-sm group-hover:text-[#2962ff] transition-colors ${
                            isDarkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {pair.symbol}
                          </span>
                          <p className="text-[11px] text-slate-400">{pair.name}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                        {pair.price.toFixed(pair.digits ?? 4)}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-slate-300">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                        {askPrice}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                      {spreadPips}
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <div className={`inline-flex items-center gap-1 font-semibold ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}>
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPos ? '+' : ''}{pair.changePercent.toFixed(2)}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums hidden sm:table-cell">
                      {pair.high.toFixed(pair.digits ?? 4)}
                    </td>

                    <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums hidden sm:table-cell">
                      {pair.low.toFixed(pair.digits ?? 4)}
                    </td>

                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                        pair.rating === 'Buy'
                          ? 'bg-[#089981]/20 text-[#089981]'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {pair.rating}
                      </span>
                    </td>

                    <td className="py-3 pr-4 pl-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectForex(pair);
                        }}
                        className="p-1.5 rounded text-slate-500 hover:text-white"
                        title="Open Chart"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
