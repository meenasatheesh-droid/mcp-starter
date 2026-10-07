import React from 'react';
import { 
  LayoutGrid, 
  LineChart, 
  Layers, 
  Coins, 
  RefreshCw, 
  Flame, 
  Landmark, 
  Grid3X3, 
  Newspaper 
} from 'lucide-react';
import { MarketTab } from '../types/market';

interface NavigationTabsProps {
  activeTab: MarketTab;
  onSelectTab: (tab: MarketTab) => void;
  isDarkMode: boolean;
}

interface TabConfig {
  id: MarketTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'indices', label: 'Indices', icon: LineChart },
  { id: 'stocks', label: 'Stocks', icon: Layers },
  { id: 'crypto', label: 'Crypto', icon: Coins },
  { id: 'forex', label: 'Forex', icon: RefreshCw },
  { id: 'futures', label: 'Futures & Commodities', icon: Flame },
  { id: 'bonds', label: 'Bonds & Yields', icon: Landmark },
  { id: 'heatmap', label: 'Sector Heatmap', icon: Grid3X3 },
  { id: 'news', label: 'Market News', icon: Newspaper },
];

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  isDarkMode,
}) => {
  return (
    <div className={`w-full border-b transition-colors ${
      isDarkMode ? 'bg-[#131722] border-[#2a2e39]' : 'bg-white border-slate-200'
    }`}>
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : isDarkMode
                    ? 'text-slate-300 hover:text-white hover:bg-[#1e222d]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
