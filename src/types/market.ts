export type MarketTab = 
  | 'overview' 
  | 'indices' 
  | 'stocks' 
  | 'crypto' 
  | 'forex' 
  | 'futures' 
  | 'bonds' 
  | 'heatmap' 
  | 'news';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  category: 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  dividendYield?: number;
  beta?: number;
  rating: TechnicalRating;
  sparkline: number[];
  logo?: string;
  country?: string;
  sector?: string;
  subCategory?: string;
  digits?: number;
}

export interface SectorItem {
  id: string;
  name: string;
  weight: number; // percentage
  changePercent: number;
  marketCap: string;
  topStock: string;
  topStockChange: number;
  stocksCount: number;
  leaders: Array<{ symbol: string; name: string; change: number; marketCap: string }>;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'Stocks' | 'Crypto' | 'Macro' | 'Forex' | 'Commodities';
  sentiment: 'bullish' | 'bearish' | 'neutral';
  relatedSymbols: string[];
  snippet: string;
}

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalOscillators {
  rating: TechnicalRating;
  buy: number;
  neutral: number;
  sell: number;
  rsi: number;
  stochK: number;
  macdLevel: number;
  adx: number;
}

export interface TechnicalMovingAverages {
  rating: TechnicalRating;
  buy: number;
  neutral: number;
  sell: number;
  ema20: number;
  sma50: number;
  sma200: number;
}

export interface UserWatchlistItem {
  symbol: string;
  addedAt: string;
  alertPrice?: number;
}

export interface PaperTradePosition {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
}
