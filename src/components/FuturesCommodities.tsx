import React from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

interface FuturesCommoditiesProps {
  futures: MarketAsset[];
  onSelectFuture: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const FuturesCommodities: React.FC<FuturesCommoditiesProps> = ({
  futures,
  onSelectFuture,
  isDarkMode,
}) => {
  return (
    <div className={`rounded-lg border overflow-hidden transition-colors ${
      isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
    }`}>
      <div className={`p-4 border-b flex items-center justify-between ${
        isDarkMode ? 'border-[#2a2e39]' : 'border-slate-200'
      }`}>
        <div>
          <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Commodities & Futures Contracts
          </h3>
          <p className="text-xs text-slate-400">Energy, precious metals, and industrial materials</p>
        </div>
        <span className="text-xs text-slate-400 font-mono">NYMEX / COMEX / ICE</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className={`border-b text-slate-400 font-medium ${
            isDarkMode ? 'bg-[#181b23] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
          }`}>
            <tr>
              <th className="py-2.5 pl-4 pr-3">Contract</th>
              <th className="py-2.5 px-3 text-right">Last Price</th>
              <th className="py-2.5 px-3 text-right">Change</th>
              <th className="py-2.5 px-3 text-right">Change %</th>
              <th className="py-2.5 px-3 text-right hidden sm:table-cell">Day High</th>
              <th className="py-2.5 px-3 text-right hidden sm:table-cell">Day Low</th>
              <th className="py-2.5 px-3 text-center hidden md:table-cell">Technical</th>
              <th className="py-2.5 px-3 text-center hidden lg:table-cell">Sparkline</th>
              <th className="py-2.5 pr-4 pl-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-[#2a2e39]' : 'divide-slate-200'}`}>
            {futures.map((item) => {
              const isPos = item.changePercent >= 0;

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectFuture(item)}
                  className={`cursor-pointer transition-colors group ${
                    isDarkMode ? 'hover:bg-[#252a37]' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded font-mono font-bold text-xs flex items-center justify-center ${
                        isDarkMode ? 'bg-[#2a2e39] text-amber-400' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <span className={`font-mono font-bold text-sm group-hover:text-[#2962ff] transition-colors ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {item.symbol}
                        </span>
                        <p className="text-[11px] text-slate-400">{item.name}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                    <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                      ${item.price.toFixed(item.digits ?? 2)}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                    <span className={isPos ? 'text-[#089981]' : 'text-[#f23645]'}>
                      {isPos ? '+' : ''}${item.change.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <div className={`inline-flex items-center gap-1 font-semibold ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}>
                      {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{isPos ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums hidden sm:table-cell">
                    ${item.high.toFixed(item.digits ?? 2)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums hidden sm:table-cell">
                    ${item.low.toFixed(item.digits ?? 2)}
                  </td>

                  <td className="py-3 px-3 text-center hidden md:table-cell">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.rating === 'Strong Buy'
                        ? 'bg-[#089981]/20 text-[#089981]'
                        : item.rating === 'Buy'
                        ? 'bg-[#089981]/15 text-[#089981]'
                        : 'bg-[#f23645]/20 text-[#f23645]'
                    }`}>
                      {item.rating}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center hidden lg:table-cell">
                    <div className="flex justify-center">
                      <Sparkline
                        data={item.sparkline}
                        isPositive={isPos}
                        width={70}
                        height={22}
                        showGradient={false}
                      />
                    </div>
                  </td>

                  <td className="py-3 pr-4 pl-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFuture(item);
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
  );
};
