import React, { useState } from 'react';
import { NewsItem, MarketAsset } from '../types/market';
import { Newspaper, ExternalLink } from 'lucide-react';

interface MarketNewsProps {
  news: NewsItem[];
  allAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const MarketNews: React.FC<MarketNewsProps> = ({
  news,
  allAssets,
  onSelectAsset,
  isDarkMode,
}) => {
  const [filter, setFilter] = useState<string>('All');

  const filteredNews = filter === 'All' 
    ? news 
    : news.filter((item) => item.category === filter);

  return (
    <div className={`p-5 rounded-lg border transition-colors ${
      isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-700/20">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2962ff]" />
          <h2 className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Financial News & Market Analysis
          </h2>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {['All', 'Stocks', 'Crypto', 'Commodities', 'Macro'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filter === cat
                  ? 'bg-[#2962ff] text-white'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-white hover:bg-[#2a2e39]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <article
            key={item.id}
            className={`p-3.5 rounded-lg border transition-all ${
              isDarkMode 
                ? 'bg-[#131722]/60 border-[#2a2e39] hover:border-[#2962ff]/40' 
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Metadata (Zero-Pill discipline: unboxed text with · separators) */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
              <span className="font-semibold text-[#2962ff]">{item.source}</span>
              <span aria-hidden="true">·</span>
              <span>{item.timeAgo}</span>
              <span aria-hidden="true">·</span>
              <span className={`font-medium ${
                item.sentiment === 'bullish'
                  ? 'text-[#089981]'
                  : item.sentiment === 'bearish'
                  ? 'text-[#f23645]'
                  : 'text-slate-400'
              }`}>
                {item.sentiment === 'bullish' ? '▲ Bullish Sentiment' : item.sentiment === 'bearish' ? '▼ Bearish Sentiment' : '■ Neutral Sentiment'}
              </span>
            </div>

            {/* Title */}
            <h3 className={`text-sm font-bold tracking-tight leading-snug ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {item.title}
            </h3>

            {/* Snippet */}
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {item.snippet}
            </p>

            {/* Related Symbols */}
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-neutral-700/20">
              <span className="text-[11px] text-slate-500">Related Symbols:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {item.relatedSymbols.map((sym) => {
                  const match = allAssets.find((a) => a.symbol === sym);

                  return (
                    <button
                      key={sym}
                      onClick={() => {
                        if (match) onSelectAsset(match);
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-semibold rounded border transition-colors ${
                        isDarkMode
                          ? 'bg-[#1e222d] border-[#2a2e39] text-white hover:border-[#2962ff]'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-[#2962ff]'
                      }`}
                    >
                      <span>{sym}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
