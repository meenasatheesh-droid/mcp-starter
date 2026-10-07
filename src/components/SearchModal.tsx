import React, { useState, useEffect, useRef } from 'react';
import { MarketAsset } from '../types/market';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allAssets,
  onSelectAsset,
  isDarkMode,
}) => {
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAssets = allAssets.filter((asset) => {
    const matchQuery = 
      asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
      asset.name.toLowerCase().includes(query.toLowerCase());
    
    if (filterCat === 'all') return matchQuery;
    return matchQuery && asset.category === filterCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm">
      <div 
        className={`w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
          isDarkMode ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Search Input Box */}
        <div className={`p-4 border-b flex items-center gap-3 ${
          isDarkMode ? 'border-[#2a2e39]' : 'border-slate-200'
        }`}>
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search symbol, company name, crypto, forex pair..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full text-sm bg-transparent focus:outline-none ${
              isDarkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className={`px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto text-xs ${
          isDarkMode ? 'bg-[#181b23] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
        }`}>
          {['all', 'stocks', 'indices', 'crypto', 'forex', 'futures', 'bonds'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-2.5 py-1 rounded text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                filterCat === cat
                  ? 'bg-[#2962ff] text-white'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-[#2a2e39]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-neutral-700/20">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No matching financial symbols found for "{query}".
            </div>
          ) : (
            filteredAssets.map((asset) => {
              const isPos = asset.changePercent >= 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors group ${
                    isDarkMode ? 'hover:bg-[#252a37]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {asset.logo ? (
                      <img
                        src={asset.logo}
                        alt=""
                        className="w-6 h-6 rounded-full object-contain shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded bg-[#2a2e39] text-white flex items-center justify-center font-bold text-[10px]">
                        {asset.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-sm group-hover:text-[#2962ff] ${
                          isDarkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-medium">
                          {asset.exchange} · {asset.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-[280px]">
                        {asset.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <div className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      ${asset.price.toFixed(asset.digits ?? 2)}
                    </div>
                    <div className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}>
                      {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className={`px-4 py-2 border-t text-[11px] text-slate-500 flex justify-between ${
          isDarkMode ? 'bg-[#181b23] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
        }`}>
          <span>Search global financial instruments</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
