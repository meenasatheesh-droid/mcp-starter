import React from 'react';
import { Search, Sun, Moon, Bookmark, Globe, ChevronDown } from 'lucide-react';
import { MarketTab } from '../types/market';

interface HeaderProps {
  activeTab: MarketTab;
  onSelectTab: (tab: MarketTab) => void;
  onOpenSearch: () => void;
  watchlistCount: number;
  onToggleWatchlist: () => void;
  isWatchlistOpen: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
  region: string;
  onChangeRegion: (reg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSearch,
  watchlistCount,
  onToggleWatchlist,
  isWatchlistOpen,
  isDarkMode,
  onToggleDarkMode,
  currency,
  onChangeCurrency,
  region,
  onChangeRegion,
}) => {
  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
      isDarkMode 
        ? 'bg-[#131722]/95 border-[#2a2e39] text-[#d1d4dc]' 
        : 'bg-white/95 border-slate-200 text-slate-800'
    }`}>
      {/* Primary Top Bar adhering to 3-zone contract */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single element Brand Zone */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2 group text-left focus:outline-none"
            aria-label="TradingView Markets Home"
          >
            {/* Iconic TradingView Brand Icon */}
            <div className="w-8 h-8 rounded bg-[#2962ff] flex items-center justify-center shadow-sm group-hover:bg-[#1e53e5] transition-colors">
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 2.5V11.5M7 1V13M13 3.5V10.5M19 0.5V13.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-base font-bold tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                TradingView
              </span>
              <span className={`text-[10px] uppercase font-semibold tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Markets Hub
              </span>
            </div>
          </button>

          {/* Quick status indicator */}
          <div className="hidden lg:flex items-center gap-1.5 ml-4 pl-4 border-l border-neutral-700/40 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#089981] animate-pulse"></span>
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>US Market Open</span>
            <span className="text-slate-500 text-[11px]">· NYSE / NASDAQ</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('overview')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeTab === 'overview' ? 'text-[#2962ff] font-semibold' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectTab('stocks')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeTab === 'stocks' ? 'text-[#2962ff] font-semibold' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => onSelectTab('crypto')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeTab === 'crypto' ? 'text-[#2962ff] font-semibold' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => onSelectTab('forex')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeTab === 'forex' ? 'text-[#2962ff] font-semibold' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Forex
          </button>
          <button
            onClick={() => onSelectTab('futures')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeTab === 'futures' ? 'text-[#2962ff] font-semibold' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Futures
          </button>
          <button
            onClick={() => onSelectTab('heatmap')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeTab === 'heatmap' ? 'text-[#2962ff] font-semibold' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Heatmap
          </button>
          <button
            onClick={() => onSelectTab('news')}
            className={`transition-colors hover:text-[#2962ff] ${
              activeTab === 'news' ? 'text-[#2962ff] font-semibold' : isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            News
          </button>
        </nav>

        {/* Zone 3: Actions (Search, Region, Watchlist, Theme) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-all ${
              isDarkMode
                ? 'bg-[#1e222d] hover:bg-[#2a2e39] border-[#2a2e39] text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title="Search symbols (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline font-normal">Search symbols, markets...</span>
            <kbd className={`hidden md:inline text-[10px] font-mono px-1.5 py-0.5 rounded border ${
              isDarkMode ? 'bg-[#131722] border-[#363a45] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              Ctrl K
            </kbd>
          </button>

          {/* Region Selector */}
          <div className="relative hidden md:block">
            <select
              value={region}
              onChange={(e) => onChangeRegion(e.target.value)}
              className={`text-xs rounded-md px-2.5 py-1.5 border appearance-none pr-7 cursor-pointer focus:outline-none ${
                isDarkMode
                  ? 'bg-[#1e222d] border-[#2a2e39] text-slate-300 hover:border-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <option value="World">🌍 World</option>
              <option value="US">🇺🇸 United States</option>
              <option value="Europe">🇪🇺 Europe</option>
              <option value="Asia">🇯🇵 Asia-Pac</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* Currency Toggle */}
          <div className="relative hidden sm:block">
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              className={`text-xs rounded-md px-2 py-1.5 border appearance-none pr-6 font-mono font-medium cursor-pointer focus:outline-none ${
                isDarkMode
                  ? 'bg-[#1e222d] border-[#2a2e39] text-slate-300 hover:border-slate-500'
                  : 'bg-slate-50 border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
              <option value="JPY">JPY ¥</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-1.5 top-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* Watchlist Drawer Toggle */}
          <button
            onClick={onToggleWatchlist}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
              isWatchlistOpen
                ? 'bg-[#2962ff] text-white border-[#2962ff]'
                : isDarkMode
                ? 'bg-[#1e222d] hover:bg-[#2a2e39] border-[#2a2e39] text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title="Toggle Watchlist"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className={`text-[10px] font-mono px-1 rounded-full ${
                isWatchlistOpen ? 'bg-white/30 text-white' : 'bg-[#2962ff] text-white'
              }`}>
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-md border transition-colors ${
              isDarkMode
                ? 'bg-[#1e222d] hover:bg-[#2a2e39] border-[#2a2e39] text-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            aria-label="Toggle dark/light mode"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
