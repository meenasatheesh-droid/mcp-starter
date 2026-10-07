import React from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { X, Trash2, ExternalLink, Bookmark } from 'lucide-react';

interface WatchlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  allAssets: MarketAsset[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  allAssets,
  onRemoveFromWatchlist,
  onSelectAsset,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const savedAssets = allAssets.filter((a) => watchlistSymbols.includes(a.symbol));

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 shadow-2xl flex flex-col border-l animate-in slide-in-from-right duration-200">
      <div className={`h-full flex flex-col ${
        isDarkMode ? 'bg-[#181b23] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'border-[#2a2e39]' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#2962ff]" />
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Watchlist ({savedAssets.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-700/20">
          {savedAssets.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p>Your watchlist is currently empty.</p>
              <p className="text-[11px] text-slate-500">
                Click the bookmark icon on any stock, index, or cryptocurrency to track it here.
              </p>
            </div>
          ) : (
            savedAssets.map((asset) => {
              const isPos = asset.changePercent >= 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className={`p-3 flex items-center justify-between cursor-pointer transition-colors group ${
                    isDarkMode ? 'hover:bg-[#1e222d]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono font-bold text-xs tracking-tight group-hover:text-[#2962ff] ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {asset.symbol}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">
                        {asset.exchange}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[120px]">
                      {asset.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right font-mono tabular-nums">
                      <div className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        ${asset.price.toFixed(asset.digits ?? 2)}
                      </div>
                      <div className={`text-[11px] font-semibold ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}>
                        {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(asset.symbol);
                      }}
                      className="p-1 text-slate-500 hover:text-[#f23645] transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className={`p-3 border-t text-[11px] text-slate-400 flex justify-between ${
          isDarkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
        }`}>
          <span>Syncs in real-time</span>
          <span className="font-mono text-slate-500">TradingView Hub</span>
        </div>
      </div>
    </div>
  );
};
