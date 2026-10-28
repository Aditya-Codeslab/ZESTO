import React from 'react';
import { Restaurant, OwnerUser } from '../../types';
import {
  LayoutDashboard,
  Utensils,
  BellRing,
  Settings,
  ExternalLink,
  LogOut,
  ChevronRight,
  Database,
  Plus,
  UtensilsCrossed,
  Receipt
} from 'lucide-react';

interface DashboardLayoutProps {
  restaurant: Restaurant;
  ownerRestaurants: Restaurant[];
  currentRestaurant: Restaurant;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onNewRestaurant: () => void;
  currentUser: OwnerUser;
  activeTab: 'overview' | 'menu' | 'orders' | 'settings';
  onSelectTab: (tab: 'overview' | 'menu' | 'orders' | 'settings') => void;
  pendingOrdersCount: number;
  onViewStorefront: (slug: string) => void;
  onSignOut: () => void;
  onOpenConfig: () => void;
  isSupabaseConnected: boolean;
  onNavigateToCustomerDashboard?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  restaurant,
  ownerRestaurants,
  currentRestaurant,
  onSelectRestaurant,
  onNewRestaurant,
  currentUser,
  activeTab,
  onSelectTab,
  pendingOrdersCount,
  onViewStorefront,
  onSignOut,
  onOpenConfig,
  isSupabaseConnected,
  onNavigateToCustomerDashboard,
  children
}) => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col md:flex-row">
      {/* 260px Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Brand & Restaurant Selector */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-[#202124] flex items-center justify-center text-[#E53935]">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
            <span className="font-editorial text-lg font-black tracking-tight text-[#202124]">
              ZESTO
            </span>
          </div>

          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 font-mono">
            Active Restaurant
          </div>
          <div className="relative">
            <select
              value={currentRestaurant.id}
              onChange={(e) => {
                const found = ownerRestaurants.find(r => r.id === e.target.value);
                if (found) onSelectRestaurant(found);
              }}
              className="w-full pl-3 pr-8 py-2 text-xs font-bold text-[#202124] bg-[#F5F5F5] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] cursor-pointer appearance-none truncate"
            >
              {ownerRestaurants.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            onClick={onNewRestaurant}
            className="mt-2 w-full py-1.5 px-2 text-[11px] font-bold text-gray-600 hover:text-[#202124] hover:bg-[#F5F5F5] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer border border-gray-200"
          >
            <Plus className="w-3 h-3 text-[#E53935]" />
            <span>Add Restaurant Venue</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-1">
          <button
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-[#202124] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#202124] hover:bg-[#F5F5F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#202124] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#202124] hover:bg-[#F5F5F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BellRing className="w-4 h-4" />
              <span>Kitchen KDS</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 bg-[#E53935] text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-xs">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('menu')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-[#202124] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#202124] hover:bg-[#F5F5F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Utensils className="w-4 h-4" />
              <span>Menu Catalog</span>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#202124] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#202124] hover:bg-[#F5F5F5]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </button>
        </nav>

        {/* Quick Links: Storefront & Customer Portal */}
        <div className="p-3.5 border-t border-gray-200 space-y-2">
          {onNavigateToCustomerDashboard && (
            <button
              onClick={onNavigateToCustomerDashboard}
              className="w-full p-2.5 rounded-xl border border-gray-200 hover:border-[#202124] hover:bg-[#F5F5F5] text-[#202124] text-xs font-bold flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Receipt className="w-4 h-4 text-[#E53935] shrink-0" />
                <span className="truncate">Customer Portal / Orders</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}

          <button
            onClick={() => onViewStorefront(currentRestaurant.slug)}
            className="w-full p-2.5 rounded-xl border border-gray-200 hover:border-[#E53935] hover:bg-red-50/50 text-[#202124] text-xs font-bold flex items-center justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2 truncate">
              <ExternalLink className="w-4 h-4 text-[#E53935] shrink-0" />
              <div className="truncate text-left">
                <div className="truncate font-editorial">View Storefront</div>
                <div className="text-[10px] text-gray-500 font-mono font-normal truncate">
                  /restaurant/{currentRestaurant.slug}
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#E53935] transition-colors" />
          </button>
        </div>

        {/* User Account & Database Status */}
        <div className="p-3.5 border-t border-gray-200 bg-[#F5F5F5] space-y-2.5">
          <button
            onClick={onOpenConfig}
            className="w-full flex items-center justify-between text-[11px] text-gray-600 hover:text-[#202124] p-1 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-medium">
              <Database className="w-3.5 h-3.5 text-gray-500" />
              <span>Storage Mode</span>
            </div>
            <span className={`font-bold ${isSupabaseConnected ? 'text-emerald-700' : 'text-gray-500'}`}>
              {isSupabaseConnected ? 'Supabase' : 'Local Fallback'}
            </span>
          </button>

          <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#202124] truncate">
                {currentUser.full_name}
              </div>
              <div className="text-[11px] text-gray-500 truncate">
                {currentUser.email}
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 text-gray-400 hover:text-[#E53935] rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header with Breadcrumbs */}
        <header className="h-18 bg-white border-b border-gray-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-bold text-[#202124]">ZESTO</span>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-[#202124]">{currentRestaurant.name}</span>
            <span className="text-gray-300">/</span>
            <span className="capitalize font-bold text-[#E53935]">{activeTab}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {onNavigateToCustomerDashboard && (
              <button
                onClick={onNavigateToCustomerDashboard}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#202124] bg-[#F5F5F5] hover:bg-gray-200 border border-gray-200 rounded-xl transition-all cursor-pointer shadow-xs"
                title="Switch to customer dashboard with live order tracking and past receipts"
              >
                <Receipt className="w-3.5 h-3.5 text-[#E53935]" />
                <span className="hidden sm:inline">Customer Portal</span>
                <span className="sm:hidden">Orders</span>
              </button>
            )}

            <a
              href={`/restaurant/${currentRestaurant.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
              title="Open customer storefront in a new tab for demonstration"
            >
              <span>Live Storefront Demo</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
