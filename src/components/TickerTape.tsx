import React, { useEffect, useState } from 'react';
import { MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  isDarkMode: boolean;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  assets,
  onSelectAsset,
  isDarkMode,
}) => {
  const [liveAssets, setLiveAssets] = useState<MarketAsset[]>(assets);
  const [flashTickMap, setFlashTickMap] = useState<Record<string, 'up' | 'down'>>({});

  // Simulate subtle real-time financial market ticks
  useEffect(() => {
    setLiveAssets(assets);
  }, [assets]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * liveAssets.length);
      const target = liveAssets[randomIndex];
      if (!target) return;

      const isUp = Math.random() > 0.48;
      const tickDelta = (target.price * 0.0004) * (isUp ? 1 : -1);
      const newPrice = parseFloat((target.price + tickDelta).toFixed(target.digits ?? 2));
      const newChange = parseFloat((target.change + tickDelta).toFixed(target.digits ?? 2));
      const newChangePct = parseFloat(((newChange / target.prevClose) * 100).toFixed(2));

      setLiveAssets((prev) =>
        prev.map((item, idx) =>
          idx === randomIndex
            ? { ...item, price: newPrice, change: newChange, changePercent: newChangePct }
            : item
        )
      );

      setFlashTickMap((prev) => ({ ...prev, [target.id]: isUp ? 'up' : 'down' }));
      setTimeout(() => {
        setFlashTickMap((prev) => {
          const next = { ...prev };
          delete next[target.id];
          return next;
        });
      }, 900);
    }, 3200);

    return () => clearInterval(interval);
  }, [liveAssets]);

  // Duplicate list for infinite smooth marquee scroll or smooth horizontal ribbon
  return (
    <div className={`w-full overflow-x-auto border-b text-xs font-mono select-none scrollbar-none transition-colors ${
      isDarkMode 
        ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' 
        : 'bg-[#f0f3fa] border-slate-200 text-slate-800'
    }`}>
      <div className="flex items-center gap-0 min-w-max py-2">
        {liveAssets.map((asset) => {
          const isPositive = asset.changePercent >= 0;
          const flash = flashTickMap[asset.id];

          return (
            <button
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`flex items-center gap-2 px-3.5 py-1 border-r transition-all text-left group hover:opacity-80 ${
                isDarkMode ? 'border-[#2a2e39] hover:bg-[#2a2e39]/60' : 'border-slate-300 hover:bg-slate-200/60'
              } ${flash === 'up' ? 'flash-up' : flash === 'down' ? 'flash-down' : ''}`}
            >
              <div className="flex items-center gap-1.5">
                {asset.logo ? (
                  <img
                    src={asset.logo}
                    alt=""
                    className="w-4 h-4 rounded-full object-contain shrink-0"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0 ${
                    isDarkMode ? 'bg-[#2a2e39] text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {asset.symbol.slice(0, 2)}
                  </span>
                )}
                <span className={`font-semibold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {asset.symbol}
                </span>
              </div>

              <span className="tabular-nums font-medium">
                {asset.category === 'bonds' ? `${asset.price.toFixed(3)}%` : asset.price.toLocaleString(undefined, { minimumFractionDigits: asset.digits ?? 2, maximumFractionDigits: asset.digits ?? 2 })}
              </span>

              <div className={`flex items-center gap-0.5 text-[11px] font-medium tabular-nums ${
                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
