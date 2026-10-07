import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { 
  ArrowUpDown, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Filter
} from 'lucide-react';

interface MarketMoversTableProps {
  stocks: MarketAsset[];
  onSelectStock: (asset: MarketAsset) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  isDarkMode: boolean;
}

type MoversFilter = 'large_cap' | 'gainers' | 'losers' | 'most_active' | 'all';
type SortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCap';

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({
  stocks,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
  isDarkMode,
}) => {
  const [filter, setFilter] = useState<MoversFilter>('large_cap');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortAsc, setSortAsc] = useState(false);

  // Extract unique sectors
  const sectors = useMemo(() => {
    const list = new Set<string>();
    stocks.forEach((s) => {
      if (s.sector) list.add(s.sector);
    });
    return ['All', ...Array.from(list)];
  }, [stocks]);

  // Filtered & sorted data
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // Sub-category filter
    if (filter === 'gainers') {
      result = result.filter((s) => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    } else if (filter === 'losers') {
      result = result.filter((s) => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    } else if (filter === 'most_active') {
      result = [...result].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
    } else if (filter === 'large_cap') {
      // sort by trillion/billion market cap
      result = [...result].sort((a, b) => {
        const valA = a.marketCap?.includes('T') ? parseFloat(a.marketCap) * 1000 : parseFloat(a.marketCap || '0');
        const valB = b.marketCap?.includes('T') ? parseFloat(b.marketCap) * 1000 : parseFloat(b.marketCap || '0');
        return valB - valA;
      });
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }

    // Sector filter
    if (sectorFilter !== 'All') {
      result = result.filter((s) => s.sector === sectorFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'symbol') {
        comparison = a.symbol.localeCompare(b.symbol);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      } else if (sortField === 'changePercent') {
        comparison = a.changePercent - b.changePercent;
      } else if (sortField === 'volume') {
        comparison = parseFloat(a.volume) - parseFloat(b.volume);
      } else if (sortField === 'marketCap') {
        const valA = a.marketCap?.includes('T') ? parseFloat(a.marketCap) * 1000 : parseFloat(a.marketCap || '0');
        const valB = b.marketCap?.includes('T') ? parseFloat(b.marketCap) * 1000 : parseFloat(b.marketCap || '0');
        comparison = valA - valB;
      }
      return sortAsc ? comparison : -comparison;
    });

    return result;
  }, [stocks, filter, searchQuery, sectorFilter, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className={`rounded-lg border transition-colors ${
      isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
    }`}>
      {/* Table Header Controls */}
      <div className={`p-4 border-b flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 ${
        isDarkMode ? 'border-[#2a2e39]' : 'border-slate-200'
      }`}>
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'large_cap', label: 'Large Cap' },
            { id: 'gainers', label: 'Top Gainers' },
            { id: 'losers', label: 'Top Losers' },
            { id: 'most_active', label: 'Most Active' },
            { id: 'all', label: 'All Stocks' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as MoversFilter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-[#2962ff] text-white'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-[#2a2e39]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sector Filters */}
        <div className="flex items-center gap-2">
          {/* Live Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-md border focus:outline-none ${
                isDarkMode
                  ? 'bg-[#131722] border-[#2a2e39] text-white placeholder-slate-500 focus:border-[#2962ff]'
                  : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-[#2962ff]'
              }`}
            />
          </div>

          {/* Sector Select */}
          <div className="relative">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className={`text-xs px-2.5 py-1.5 rounded-md border focus:outline-none appearance-none pr-7 cursor-pointer ${
                isDarkMode
                  ? 'bg-[#131722] border-[#2a2e39] text-slate-300'
                  : 'bg-slate-50 border-slate-300 text-slate-700'
              }`}
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'All' ? 'All Sectors' : sec}
                </option>
              ))}
            </select>
            <Filter className="w-3 h-3 absolute right-2 top-2.5 pointer-events-none text-slate-400" />
          </div>
        </div>
      </div>

      {/* Responsive Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className={`border-b text-slate-400 font-medium ${
            isDarkMode ? 'bg-[#181b23] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
          }`}>
            <tr>
              <th className="py-2.5 pl-4 pr-3 font-semibold">
                <button
                  onClick={() => toggleSort('symbol')}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <span>Symbol & Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-right">
                <button
                  onClick={() => toggleSort('price')}
                  className="flex items-center justify-end gap-1 ml-auto hover:text-white transition-colors"
                >
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-right">
                <button
                  onClick={() => toggleSort('changePercent')}
                  className="flex items-center justify-end gap-1 ml-auto hover:text-white transition-colors"
                >
                  <span>Change %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-center hidden md:table-cell">Technical Rating</th>
              <th className="py-2.5 px-3 text-right hidden sm:table-cell">
                <button
                  onClick={() => toggleSort('volume')}
                  className="flex items-center justify-end gap-1 ml-auto hover:text-white transition-colors"
                >
                  <span>Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-right hidden lg:table-cell">
                <button
                  onClick={() => toggleSort('marketCap')}
                  className="flex items-center justify-end gap-1 ml-auto hover:text-white transition-colors"
                >
                  <span>Market Cap</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 text-right hidden xl:table-cell">P/E Ratio</th>
              <th className="py-2.5 px-3 text-center hidden sm:table-cell">24H Trend</th>
              <th className="py-2.5 pr-4 pl-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-[#2a2e39]' : 'divide-slate-200'}`}>
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-400">
                  No stocks match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredStocks.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                const isSaved = watchlist.includes(stock.symbol);

                return (
                  <tr
                    key={stock.id}
                    onClick={() => onSelectStock(stock)}
                    className={`transition-colors cursor-pointer group ${
                      isDarkMode 
                        ? 'hover:bg-[#252a37]' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Symbol & Name */}
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-2.5">
                        {stock.logo ? (
                          <img
                            src={stock.logo}
                            alt=""
                            className="w-6 h-6 rounded-full object-contain shrink-0"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isDarkMode ? 'bg-[#2a2e39] text-white' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {stock.symbol.slice(0, 2)}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-bold font-mono text-sm tracking-tight group-hover:text-[#2962ff] transition-colors ${
                              isDarkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              {stock.symbol}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase font-medium">
                              {stock.exchange}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                      <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                        ${stock.price.toFixed(stock.digits ?? 2)}
                      </span>
                    </td>

                    {/* Change % */}
                    <td className="py-3 px-3 text-right font-mono font-medium tabular-nums">
                      <div className={`inline-flex items-center gap-1 ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>
                          {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isPositive ? '+' : ''}${stock.change.toFixed(2)}
                      </div>
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                        stock.rating === 'Strong Buy'
                          ? 'bg-[#089981]/15 text-[#089981] border border-[#089981]/30'
                          : stock.rating === 'Buy'
                          ? 'bg-[#089981]/10 text-[#089981]'
                          : stock.rating === 'Sell'
                          ? 'bg-[#f23645]/15 text-[#f23645] border border-[#f23645]/30'
                          : 'bg-slate-500/10 text-slate-400'
                      }`}>
                        {stock.rating}
                      </span>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums hidden sm:table-cell">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        {stock.volume}
                      </span>
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums hidden lg:table-cell">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        {stock.marketCap || '—'}
                      </span>
                    </td>

                    {/* P/E Ratio */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums hidden xl:table-cell">
                      <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                        {stock.peRatio ? stock.peRatio.toFixed(1) : '—'}
                      </span>
                    </td>

                    {/* Sparkline */}
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
                      <div className="flex justify-center">
                        <Sparkline
                          data={stock.sparkline}
                          isPositive={isPositive}
                          width={72}
                          height={24}
                          showGradient={false}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 pr-4 pl-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWatchlist(stock.symbol);
                          }}
                          className={`p-1.5 rounded transition-colors ${
                            isSaved 
                              ? 'text-[#2962ff]' 
                              : isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                          }`}
                          title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStock(stock);
                          }}
                          className={`p-1.5 rounded transition-colors ${
                            isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                          }`}
                          title="Open Chart Screen"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
