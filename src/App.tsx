/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MarketTab, MarketAsset } from './types/market';
import { 
  GLOBAL_INDICES, 
  ALL_STOCKS, 
  CRYPTO_ASSETS, 
  FOREX_PAIRS, 
  FUTURES_COMMODITIES, 
  BONDS_RATES, 
  SECTORS, 
  NEWS_FEED 
} from './data/mockMarketData';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { NavigationTabs } from './components/NavigationTabs';
import { IndicesSummary } from './components/IndicesSummary';
import { MarketMoversTable } from './components/MarketMoversTable';
import { SectorHeatmap } from './components/SectorHeatmap';
import { CryptoSnapshot } from './components/CryptoSnapshot';
import { ForexMatrix } from './components/ForexMatrix';
import { FuturesCommodities } from './components/FuturesCommodities';
import { BondsYields } from './components/BondsYields';
import { WorldStockMarkets } from './components/WorldStockMarkets';
import { MarketNews } from './components/MarketNews';
import { SymbolChartModal } from './components/SymbolChartModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistSidebar } from './components/WatchlistSidebar';

export default function App() {
  const [activeTab, setActiveTab] = useState<MarketTab>('overview');
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>([
    'NVDA', 
    'BTC/USD', 
    'S&P 500', 
    'AAPL', 
    'EUR/USD',
    'GC1!'
  ]);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [region, setRegion] = useState('World');

  // Combined asset pool for search & ticker tape
  const allAssets = useMemo(() => {
    return [
      ...GLOBAL_INDICES,
      ...ALL_STOCKS,
      ...CRYPTO_ASSETS,
      ...FOREX_PAIRS,
      ...FUTURES_COMMODITIES,
      ...BONDS_RATES,
    ];
  }, []);

  // Filter assets by selected region when applicable
  const displayIndices = useMemo(() => {
    if (region === 'US') {
      return GLOBAL_INDICES.filter((i) => i.country === 'United States');
    }
    if (region === 'Europe') {
      return GLOBAL_INDICES.filter((i) => i.country === 'Germany' || i.country === 'United Kingdom' || i.country === 'European Union');
    }
    if (region === 'Asia') {
      return GLOBAL_INDICES.filter((i) => i.country === 'Japan' || i.country === 'Hong Kong');
    }
    return GLOBAL_INDICES;
  }, [region]);

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      isDarkMode ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-[#f8f9fc] text-slate-900'
    }`}>
      {/* 1. Global Navigation Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        watchlistCount={watchlist.length}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        isWatchlistOpen={isWatchlistOpen}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currency={currency}
        onChangeCurrency={setCurrency}
        region={region}
        onChangeRegion={setRegion}
      />

      {/* 2. Real-Time Ticker Ribbon */}
      <TickerTape
        assets={allAssets.slice(0, 16)}
        onSelectAsset={setSelectedAsset}
        isDarkMode={isDarkMode}
      />

      {/* 3. Category Subnav Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDarkMode={isDarkMode}
      />

      {/* 4. Main Viewport Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* VIEW: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* World Indices Bento Grid */}
            <IndicesSummary
              indices={displayIndices}
              onSelectIndex={setSelectedAsset}
              isDarkMode={isDarkMode}
            />

            {/* Market Movers & Screener Data Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Stock Market Movers
                  </h2>
                  <p className="text-xs text-slate-400">
                    Highest volume, top gainers, and most active securities across US exchanges
                  </p>
                </div>
              </div>

              <MarketMoversTable
                stocks={ALL_STOCKS}
                onSelectStock={setSelectedAsset}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* S&P 500 Sector Heatmap */}
            <SectorHeatmap
              sectors={SECTORS}
              stocks={ALL_STOCKS}
              onSelectStock={setSelectedAsset}
              isDarkMode={isDarkMode}
            />

            {/* Two-column Bento: World Exchanges & Crypto Snapshot */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <WorldStockMarkets
                indices={GLOBAL_INDICES}
                onSelectIndex={setSelectedAsset}
                isDarkMode={isDarkMode}
              />
              <CryptoSnapshot
                cryptoAssets={CRYPTO_ASSETS}
                onSelectCrypto={setSelectedAsset}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Currencies & Commodities Preview */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ForexMatrix
                forexPairs={FOREX_PAIRS}
                onSelectForex={setSelectedAsset}
                isDarkMode={isDarkMode}
              />
              <FuturesCommodities
                futures={FUTURES_COMMODITIES}
                onSelectFuture={setSelectedAsset}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Market News Stream */}
            <MarketNews
              news={NEWS_FEED}
              allAssets={allAssets}
              onSelectAsset={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: INDICES */}
        {activeTab === 'indices' && (
          <div className="space-y-6">
            <IndicesSummary
              indices={GLOBAL_INDICES}
              onSelectIndex={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
            <WorldStockMarkets
              indices={GLOBAL_INDICES}
              onSelectIndex={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: STOCKS */}
        {activeTab === 'stocks' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Stocks Screener & Quotes
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Scan global equities with real-time indicators, multiples, and performance rankings
              </p>
            </div>
            <MarketMoversTable
              stocks={ALL_STOCKS}
              onSelectStock={setSelectedAsset}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              isDarkMode={isDarkMode}
            />
            <SectorHeatmap
              sectors={SECTORS}
              stocks={ALL_STOCKS}
              onSelectStock={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: CRYPTO */}
        {activeTab === 'crypto' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Cryptocurrency Markets
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Track Bitcoin, Ethereum, layer-1 tokens, and decentralized market volume 24/7
              </p>
            </div>
            <CryptoSnapshot
              cryptoAssets={CRYPTO_ASSETS}
              onSelectCrypto={setSelectedAsset}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: FOREX */}
        {activeTab === 'forex' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Forex Rates & Currency Pairs
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitor live bid/ask spreads, foreign exchange liquidity, and pip fluctuations
              </p>
            </div>
            <ForexMatrix
              forexPairs={FOREX_PAIRS}
              onSelectForex={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: FUTURES */}
        {activeTab === 'futures' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Futures & Commodities Hub
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Energy, precious metals, agriculture, and index futures quotes
              </p>
            </div>
            <FuturesCommodities
              futures={FUTURES_COMMODITIES}
              onSelectFuture={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: BONDS */}
        {activeTab === 'bonds' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Bonds & Sovereign Yield Curves
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                US Treasuries, European Bunds, and global benchmark sovereign interest rates
              </p>
            </div>
            <BondsYields
              bonds={BONDS_RATES}
              onSelectBond={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: HEATMAP */}
        {activeTab === 'heatmap' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Sector Performance Treemap
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Visual representation of equity market breadth weighted by company capitalization
              </p>
            </div>
            <SectorHeatmap
              sectors={SECTORS}
              stocks={ALL_STOCKS}
              onSelectStock={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* VIEW: NEWS */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Financial Market News & Real-Time Intelligence
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified reporting from Bloomberg, Reuters, Financial Times, and CoinDesk
              </p>
            </div>
            <MarketNews
              news={NEWS_FEED}
              allAssets={allAssets}
              onSelectAsset={setSelectedAsset}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

      </main>

      {/* 5. Minimalist Financial Terminal Footer */}
      <footer className={`mt-auto border-t py-6 text-xs transition-colors ${
        isDarkMode ? 'bg-[#181b23] border-[#2a2e39] text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#2962ff] flex items-center justify-center text-white font-bold text-[10px]">
              TV
            </div>
            <span className="font-semibold text-slate-300">TradingView Markets</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Financial Quotes & Analytical Charts</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Market Data delayed by 15 minutes unless specified</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Chart Engine</span>
          </div>
        </div>
      </footer>

      {/* 6. TradingView Interactive Symbol Chart Modal */}
      {selectedAsset && (
        <SymbolChartModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          isSavedWatchlist={watchlist.includes(selectedAsset.symbol)}
          onToggleWatchlist={handleToggleWatchlist}
          isDarkMode={isDarkMode}
        />
      )}

      {/* 7. Quick Search (Ctrl+K) Dialog */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allAssets={allAssets}
        onSelectAsset={setSelectedAsset}
        isDarkMode={isDarkMode}
      />

      {/* 8. Slide-Over Watchlist Drawer */}
      <WatchlistSidebar
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlist}
        allAssets={allAssets}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onSelectAsset={setSelectedAsset}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
