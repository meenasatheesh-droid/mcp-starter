import React, { useState, useMemo } from 'react';
import { MarketAsset, Candle, TechnicalRating } from '../types/market';
import { generateCandleData } from '../data/mockMarketData';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  LineChart as LineChartIcon, 
  Bookmark, 
  BookmarkCheck,
  CheckCircle,
  Activity,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

interface SymbolChartModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  isSavedWatchlist: boolean;
  onToggleWatchlist: (symbol: string) => void;
  isDarkMode: boolean;
}

type ChartType = 'candles' | 'area' | 'bars';
type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y';

export const SymbolChartModal: React.FC<SymbolChartModalProps> = ({
  asset,
  onClose,
  isSavedWatchlist,
  onToggleWatchlist,
  isDarkMode,
}) => {
  if (!asset) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [showMa20, setShowMa20] = useState(true);
  const [showMa50, setShowMa50] = useState(false);
  const [showRsi, setShowRsi] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Paper trading ticket state
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [sharesCount, setSharesCount] = useState(10);
  const [orderExecutedMsg, setOrderExecutedMsg] = useState<string | null>(null);

  // Generate dynamic candles based on timeframe
  const candles = useMemo(() => {
    return generateCandleData(asset, timeframe);
  }, [asset, timeframe]);

  // Compute stats from candles
  const minPrice = useMemo(() => Math.min(...candles.map((c) => c.low)), [candles]);
  const maxPrice = useMemo(() => Math.max(...candles.map((c) => c.high)), [candles]);
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = useMemo(() => Math.max(...candles.map((c) => c.volume)), [candles]);

  // Moving averages calculation
  const ma20Points = useMemo(() => {
    const period = 10;
    return candles.map((_, idx, arr) => {
      if (idx < period - 1) return null;
      const slice = arr.slice(idx - period + 1, idx + 1);
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / period;
      return avg;
    });
  }, [candles]);

  // RSI calculation (approximated for display)
  const rsiValues = useMemo(() => {
    return candles.map((c, i) => {
      const base = 50;
      const momentum = (c.close - c.open) / (c.open || 1) * 300;
      const val = Math.min(Math.max(base + momentum + Math.sin(i * 0.5) * 15, 18), 84);
      return Math.round(val);
    });
  }, [candles]);

  // SVG dimensions
  const svgWidth = 820;
  const svgHeight = 360;
  const paddingRight = 65; // for price axis
  const paddingBottom = 26; // for time axis
  const rsiHeight = 80;
  const chartHeight = showRsi ? svgHeight - rsiHeight - 15 : svgHeight - paddingBottom;
  const chartWidth = svgWidth - paddingRight;

  const candleStep = chartWidth / candles.length;
  const candleBodyWidth = Math.max(candleStep * 0.65, 3);

  // Convert price to Y coordinate
  const getY = (price: number) => {
    const ratio = (price - minPrice) / priceRange;
    return chartHeight - ratio * (chartHeight - 20) - 10;
  };

  // Active displayed candle (hovered or last)
  const activeCandle = hoveredCandle || candles[candles.length - 1];

  const handleExecutePaperTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const total = (sharesCount * asset.price).toFixed(2);
    setOrderExecutedMsg(
      `Filled: ${orderType} ${sharesCount} shares of ${asset.symbol} @ $${asset.price.toFixed(2)} (Total: $${total})`
    );
    setTimeout(() => setOrderExecutedMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div 
        className={`w-full max-w-[1240px] max-h-[94vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden transition-all my-auto ${
          isDarkMode ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Top Instrument Bar */}
        <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
          isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            {asset.logo ? (
              <img
                src={asset.logo}
                alt=""
                className="w-8 h-8 rounded-full object-contain shrink-0"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-8 h-8 rounded bg-[#2962ff] text-white font-bold flex items-center justify-center text-xs">
                {asset.symbol.slice(0, 2)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold font-mono tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {asset.symbol}
                </span>
                <span className="text-xs text-slate-400 uppercase font-medium">
                  {asset.exchange} · {asset.category}
                </span>
              </div>
              <p className="text-xs text-slate-400">{asset.name}</p>
            </div>

            <div className="hidden sm:block ml-4 pl-4 border-l border-neutral-700/40">
              <div className={`text-xl font-bold font-mono tabular-nums ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {asset.category === 'bonds' ? `${asset.price.toFixed(3)}%` : `$${asset.price.toFixed(asset.digits ?? 2)}`}
              </div>
              <div className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                asset.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
              }`}>
                {asset.changePercent >= 0 ? '+' : ''}${asset.change.toFixed(2)} ({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          {/* Quick interactive OHLC readout */}
          {activeCandle && (
            <div className="hidden lg:flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>O: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{activeCandle.open}</strong></span>
              <span>H: <strong className="text-[#089981]">{activeCandle.high}</strong></span>
              <span>L: <strong className="text-[#f23645]">{activeCandle.low}</strong></span>
              <span>C: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{activeCandle.close}</strong></span>
              <span>Vol: <strong className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{(activeCandle.volume / 1000).toFixed(1)}K</strong></span>
            </div>
          )}

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(asset.symbol)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                isSavedWatchlist
                  ? 'bg-[#2962ff] text-white border-[#2962ff]'
                  : isDarkMode
                  ? 'bg-[#131722] hover:bg-[#2a2e39] border-[#2a2e39] text-slate-300'
                  : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              {isSavedWatchlist ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSavedWatchlist ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-md text-slate-400 hover:text-white transition-colors ${
                isDarkMode ? 'hover:bg-[#2a2e39]' : 'hover:bg-slate-200'
              }`}
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar: Timeframe, Chart type, Indicators */}
        <div className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 text-xs select-none ${
          isDarkMode ? 'bg-[#181b23] border-[#2a2e39]' : 'bg-white border-slate-200'
        }`}>
          {/* Timeframe selector */}
          <div className="flex items-center gap-1">
            {(['1D', '5D', '1M', '6M', '1Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white'
                    : isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-[#2a2e39]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style */}
          <div className="flex items-center gap-1 pl-2 border-l border-neutral-700/30">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1.5 rounded transition-colors ${
                chartType === 'candles'
                  ? 'bg-[#2962ff] text-white'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Candlestick Chart"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded transition-colors ${
                chartType === 'area'
                  ? 'bg-[#2962ff] text-white'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Area Line Chart"
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Indicators toggles */}
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-700/30">
            <button
              onClick={() => setShowMa20(!showMa20)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                showMa20
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              MA (20)
            </button>
            <button
              onClick={() => setShowMa50(!showMa50)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                showMa50
                  ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              MA (50)
            </button>
            <button
              onClick={() => setShowRsi(!showRsi)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
                showRsi
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                  : 'text-slate-500 border-transparent hover:text-slate-300'
              }`}
            >
              RSI (14)
            </button>
          </div>
        </div>

        {/* Modal Body: Chart Canvas on Left, Side Panel on Right */}
        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
          
          {/* Main Interactive Chart Viewport */}
          <div className="flex-1 p-4 flex flex-col min-h-[420px]">
            <div className="relative w-full flex-1 bg-black/10 rounded-lg overflow-hidden border border-neutral-800/40">
              
              {/* SVG Chart Engine */}
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full cursor-crosshair select-none"
                onMouseLeave={() => {
                  setHoveredCandle(null);
                  setHoverIndex(null);
                }}
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                  const y = chartHeight * ratio;
                  const priceLabel = (maxPrice - ratio * priceRange).toFixed(asset.digits ?? 2);
                  return (
                    <g key={ratio}>
                      <line
                        x1="0"
                        y1={y}
                        x2={chartWidth}
                        y2={y}
                        stroke={isDarkMode ? '#232733' : '#e2e8f0'}
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={chartWidth + 8}
                        y={y + 4}
                        fill="#787b86"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {priceLabel}
                      </text>
                    </g>
                  );
                })}

                {/* Volume Histogram Bars */}
                {candles.map((candle, idx) => {
                  const x = idx * candleStep + candleStep / 2;
                  const volHeight = (candle.volume / maxVolume) * 50;
                  const volY = chartHeight - volHeight;
                  const isUp = candle.close >= candle.open;

                  return (
                    <rect
                      key={`vol-${idx}`}
                      x={x - candleBodyWidth / 2}
                      y={volY}
                      width={candleBodyWidth}
                      height={volHeight}
                      fill={isUp ? 'rgba(8, 153, 129, 0.25)' : 'rgba(242, 54, 69, 0.25)'}
                    />
                  );
                })}

                {/* Area Chart Mode */}
                {chartType === 'area' && (
                  <>
                    <path
                      d={`M 0,${chartHeight} ${candles
                        .map((c, i) => `L ${i * candleStep + candleStep / 2},${getY(c.close)}`)
                        .join(' ')} L ${chartWidth},${chartHeight} Z`}
                      fill="url(#areaGrad)"
                    />
                    <path
                      d={`M 0,${getY(candles[0].close)} ${candles
                        .map((c, i) => `L ${i * candleStep + candleStep / 2},${getY(c.close)}`)
                        .join(' ')}`}
                      fill="none"
                      stroke="#2962ff"
                      strokeWidth="2"
                    />
                  </>
                )}

                {/* Candlestick / Bar Chart Mode */}
                {chartType === 'candles' && (
                  candles.map((candle, idx) => {
                    const x = idx * candleStep + candleStep / 2;
                    const openY = getY(candle.open);
                    const closeY = getY(candle.close);
                    const highY = getY(candle.high);
                    const lowY = getY(candle.low);
                    const isUp = candle.close >= candle.open;
                    const color = isUp ? '#089981' : '#f23645';

                    const bodyTop = Math.min(openY, closeY);
                    const bodyHeight = Math.max(Math.abs(closeY - openY), 1.5);

                    return (
                      <g key={idx}>
                        {/* Wick */}
                        <line
                          x1={x}
                          y1={highY}
                          x2={x}
                          y2={lowY}
                          stroke={color}
                          strokeWidth="1.2"
                        />
                        {/* Body */}
                        <rect
                          x={x - candleBodyWidth / 2}
                          y={bodyTop}
                          width={candleBodyWidth}
                          height={bodyHeight}
                          fill={color}
                        />
                      </g>
                    );
                  })
                )}

                {/* MA 20 Line */}
                {showMa20 && (
                  <path
                    d={ma20Points
                      .map((val, idx) => {
                        if (val === null) return '';
                        const x = idx * candleStep + candleStep / 2;
                        const y = getY(val);
                        return `${idx === 9 ? 'M' : 'L'} ${x},${y}`;
                      })
                      .filter(Boolean)
                      .join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                  />
                )}

                {/* Hover Crosshair */}
                {hoverIndex !== null && (
                  <g>
                    {/* Vertical line */}
                    <line
                      x1={hoverIndex * candleStep + candleStep / 2}
                      y1="0"
                      x2={hoverIndex * candleStep + candleStep / 2}
                      y2={chartHeight}
                      stroke="#787b86"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    {/* Horizontal line */}
                    <line
                      x1="0"
                      y1={getY(candles[hoverIndex].close)}
                      x2={chartWidth}
                      y2={getY(candles[hoverIndex].close)}
                      stroke="#787b86"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                    {/* Price Marker on Right */}
                    <rect
                      x={chartWidth + 2}
                      y={getY(candles[hoverIndex].close) - 9}
                      width={58}
                      height={18}
                      fill="#2962ff"
                      rx="2"
                    />
                    <text
                      x={chartWidth + 6}
                      y={getY(candles[hoverIndex].close) + 4}
                      fill="#ffffff"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {candles[hoverIndex].close.toFixed(asset.digits ?? 2)}
                    </text>
                  </g>
                )}

                {/* Interactive Overlay for Hover Detection */}
                {candles.map((candle, idx) => (
                  <rect
                    key={`hit-${idx}`}
                    x={idx * candleStep}
                    y="0"
                    width={candleStep}
                    height={chartHeight}
                    fill="transparent"
                    onMouseEnter={() => {
                      setHoveredCandle(candle);
                      setHoverIndex(idx);
                    }}
                  />
                ))}

                {/* RSI Sub-Panel */}
                {showRsi && (
                  <g transform={`translate(0, ${chartHeight + 15})`}>
                    <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#363a45" strokeWidth="1" />
                    <text x="8" y="12" fill="#a855f7" fontSize="9" fontFamily="monospace">
                      RSI (14): {hoverIndex !== null ? rsiValues[hoverIndex] : rsiValues[rsiValues.length - 1]}
                    </text>
                    {/* 70 overbought & 30 oversold */}
                    <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="#f23645" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
                    <line x1="0" y1="55" x2={chartWidth} y2="55" stroke="#089981" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.6" />
                    
                    {/* RSI Curve */}
                    <path
                      d={rsiValues
                        .map((rsi, i) => {
                          const x = i * candleStep + candleStep / 2;
                          const y = 75 - (rsi / 100) * 55;
                          return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </svg>
            </div>

            {/* Time labels below chart */}
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 px-1">
              <span>{candles[0]?.time}</span>
              <span>{candles[Math.floor(candles.length / 2)]?.time}</span>
              <span>{candles[candles.length - 1]?.time} (Latest)</span>
            </div>
          </div>

          {/* Right Sidebar: Technical Gauge, Financial Stats, Paper Trading */}
          <div className={`w-full lg:w-[360px] p-4 border-t lg:border-t-0 lg:border-l space-y-4 overflow-y-auto ${
            isDarkMode ? 'bg-[#181b23] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
          }`}>
            
            {/* Technical Analysis Gauge / Speedometer */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-400">Technical Analysis</span>
                <span className="text-[11px] font-mono text-[#089981]">1-Day Gauge</span>
              </div>

              {/* Gauge Meter Display */}
              <div className="text-center my-3">
                <div className={`text-lg font-bold ${
                  asset.rating === 'Strong Buy'
                    ? 'text-[#089981]'
                    : asset.rating === 'Buy'
                    ? 'text-[#089981]'
                    : asset.rating === 'Sell'
                    ? 'text-[#f23645]'
                    : 'text-slate-400'
                }`}>
                  {asset.rating}
                </div>
                <p className="text-[11px] text-slate-500">Consensus from 26 Technical Indicators</p>
              </div>

              {/* Oscillators vs Moving Averages Counter */}
              <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] font-mono mt-3 pt-2.5 border-t border-neutral-700/20">
                <div className="p-1 rounded bg-[#f23645]/10 text-[#f23645]">
                  <div className="font-bold">2</div>
                  <div className="text-[9px] uppercase">Sell</div>
                </div>
                <div className="p-1 rounded bg-slate-500/10 text-slate-400">
                  <div className="font-bold">8</div>
                  <div className="text-[9px] uppercase">Neutral</div>
                </div>
                <div className="p-1 rounded bg-[#089981]/10 text-[#089981]">
                  <div className="font-bold">16</div>
                  <div className="text-[9px] uppercase">Buy</div>
                </div>
              </div>
            </div>

            {/* Key Statistics Grid */}
            <div className={`p-4 rounded-lg border text-xs ${
              isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
            }`}>
              <h4 className="font-bold text-slate-400 uppercase text-[11px] mb-3">Key Statistics</h4>
              <div className="space-y-2 font-mono tabular-nums">
                <div className="flex justify-between">
                  <span className="text-slate-400">Day's Range</span>
                  <span className="font-semibold text-slate-200">${asset.low} - ${asset.high}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Previous Close</span>
                  <span className="font-semibold text-slate-200">${asset.prevClose}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volume</span>
                  <span className="font-semibold text-slate-200">{asset.volume}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Market Cap</span>
                  <span className="font-semibold text-slate-200">{asset.marketCap || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">P/E Ratio</span>
                  <span className="font-semibold text-slate-200">{asset.peRatio ? asset.peRatio.toFixed(1) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dividend Yield</span>
                  <span className="font-semibold text-slate-200">{asset.dividendYield !== undefined ? `${asset.dividendYield}%` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Beta</span>
                  <span className="font-semibold text-slate-200">{asset.beta || '—'}</span>
                </div>
              </div>
            </div>

            {/* Live Paper Trading Simulator Panel */}
            <div className={`p-4 rounded-lg border ${
              isDarkMode ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5 mb-3">
                <ArrowRightLeft className="w-4 h-4 text-[#2962ff]" />
                <h4 className={`text-xs font-bold uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Paper Trading Simulator
                </h4>
              </div>

              <form onSubmit={handleExecutePaperTrade} className="space-y-3">
                {/* Buy vs Sell selector */}
                <div className="grid grid-cols-2 gap-1 p-0.5 rounded bg-black/20">
                  <button
                    type="button"
                    onClick={() => setOrderType('BUY')}
                    className={`py-1.5 text-xs font-bold rounded transition-colors ${
                      orderType === 'BUY' ? 'bg-[#089981] text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    BUY
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('SELL')}
                    className={`py-1.5 text-xs font-bold rounded transition-colors ${
                      orderType === 'SELL' ? 'bg-[#f23645] text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SELL
                  </button>
                </div>

                {/* Shares count input */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Order Quantity</span>
                    <span>Units</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={sharesCount}
                    onChange={(e) => setSharesCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`w-full text-xs px-3 py-1.5 font-mono rounded border focus:outline-none ${
                      isDarkMode
                        ? 'bg-[#131722] border-[#2a2e39] text-white focus:border-[#2962ff]'
                        : 'bg-white border-slate-300 text-slate-900 focus:border-[#2962ff]'
                    }`}
                  />
                </div>

                {/* Cost estimation */}
                <div className="flex justify-between items-center text-xs font-mono pt-1 text-slate-400">
                  <span>Est. Total:</span>
                  <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    ${(sharesCount * asset.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Execute order button */}
                <button
                  type="submit"
                  className={`w-full py-2 rounded text-xs font-bold text-white transition-opacity shadow ${
                    orderType === 'BUY' ? 'bg-[#089981] hover:bg-[#078873]' : 'bg-[#f23645] hover:bg-[#d82a39]'
                  }`}
                >
                  Place {orderType} Order
                </button>
              </form>

              {/* Order filled toast */}
              {orderExecutedMsg && (
                <div className="mt-2.5 p-2 rounded bg-[#089981]/20 border border-[#089981]/40 text-[#089981] text-[11px] font-mono flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{orderExecutedMsg}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
