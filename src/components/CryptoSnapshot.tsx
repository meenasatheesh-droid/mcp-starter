import React from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { TrendingUp, TrendingDown, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

interface CryptoSnapshotProps {
  cryptoAssets: MarketAsset[];
  onSelectCrypto: (asset: MarketAsset) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  isDarkMode: boolean;
}

export const CryptoSnapshot: React.FC<CryptoSnapshotProps> = ({
  cryptoAssets,
  onSelectCrypto,
  watchlist,
  onToggleWatchlist,
  isDarkMode,
}) => {
  return (
    <div className="space-y-4">
      {/* Metric Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Total Market Cap</span>
          <div className={`text-lg font-bold font-mono tabular-nums mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            $2.38 Trillion
          </div>
          <span className="text-xs text-[#089981] font-mono mt-0.5 inline-block">+2.45% 24h</span>
        </div>

        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">24h Trading Volume</span>
          <div className={`text-lg font-bold font-mono tabular-nums mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            $84.2 Billion
          </div>
          <span className="text-xs text-slate-400 font-mono mt-0.5 inline-block">Across all exchanges</span>
        </div>

        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Bitcoin Dominance</span>
          <div className={`text-lg font-bold font-mono tabular-nums mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            58.6%
          </div>
          <div className="w-full bg-slate-700/30 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#f7931a] h-full rounded-full" style={{ width: '58.6%' }}></div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${
          isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[11px] text-slate-400 uppercase font-semibold">Ethereum Dominance</span>
          <div className={`text-lg font-bold font-mono tabular-nums mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            13.8%
          </div>
          <div className="w-full bg-slate-700/30 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#627eea] h-full rounded-full" style={{ width: '13.8%' }}></div>
          </div>
        </div>
      </div>

      {/* Crypto Table */}
      <div className={`rounded-lg border overflow-hidden transition-colors ${
        isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'border-[#2a2e39]' : 'border-slate-200'
        }`}>
          <div>
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Cryptocurrency Quotes
            </h3>
            <p className="text-xs text-slate-400">Live prices from major decentralized & spot order books</p>
          </div>
          <span className="text-xs font-mono text-slate-400">24/7 Market</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b text-slate-400 font-medium ${
              isDarkMode ? 'bg-[#181b23] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
            }`}>
              <tr>
                <th className="py-2.5 pl-4 pr-3">Asset</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">24h Change</th>
                <th className="py-2.5 px-3 text-right hidden sm:table-cell">24h Volume</th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">Market Cap</th>
                <th className="py-2.5 px-3 text-center hidden sm:table-cell">Technical Rating</th>
                <th className="py-2.5 px-3 text-center hidden lg:table-cell">7D Trend</th>
                <th className="py-2.5 pr-4 pl-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-[#2a2e39]' : 'divide-slate-200'}`}>
              {cryptoAssets.map((crypto) => {
                const isPos = crypto.changePercent >= 0;
                const isSaved = watchlist.includes(crypto.symbol);

                return (
                  <tr
                    key={crypto.id}
                    onClick={() => onSelectCrypto(crypto)}
                    className={`cursor-pointer transition-colors group ${
                      isDarkMode ? 'hover:bg-[#252a37]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-2.5">
                        {crypto.logo ? (
                          <img
                            src={crypto.logo}
                            alt=""
                            className="w-6 h-6 rounded-full object-contain shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#f7931a]/20 text-[#f7931a] flex items-center justify-center font-bold text-[10px]">
                            {crypto.symbol.slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <div className={`font-mono font-bold text-sm group-hover:text-[#2962ff] transition-colors ${
                            isDarkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {crypto.symbol}
                          </div>
                          <div className="text-[11px] text-slate-400">{crypto.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                        ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: crypto.digits ?? 2, maximumFractionDigits: crypto.digits ?? 2 })}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <div className={`inline-flex items-center gap-1 font-semibold ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}>
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{isPos ? '+' : ''}{crypto.changePercent.toFixed(2)}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums hidden sm:table-cell text-slate-300">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        ${crypto.volume}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono tabular-nums hidden md:table-cell text-slate-300">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        ${crypto.marketCap}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                        crypto.rating === 'Strong Buy'
                          ? 'bg-[#089981]/20 text-[#089981]'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {crypto.rating}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center hidden lg:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={crypto.sparkline}
                          isPositive={isPos}
                          width={70}
                          height={22}
                          showGradient={false}
                        />
                      </div>
                    </td>

                    <td className="py-3 pr-4 pl-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(crypto.symbol);
                          }}
                          className={`p-1.5 rounded transition-colors ${
                            isSaved ? 'text-[#2962ff]' : 'text-slate-500 hover:text-white'
                          }`}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCrypto(crypto);
                          }}
                          className="p-1.5 rounded text-slate-500 hover:text-white"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
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
