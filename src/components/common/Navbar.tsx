import React from 'react';
import { UtensilsCrossed, Database, Store, ShoppingBag, ExternalLink, Receipt } from 'lucide-react';
import { OwnerUser } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  currentUser: OwnerUser | null;
  onOpenAuth: () => void;
  onOpenConfig: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  isSupabaseConnected?: boolean;
  storefrontSlug?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenConfig,
  cartCount = 0,
  onOpenCart,
  isSupabaseConnected = false,
  storefrontSlug = 'forno-fuoco'
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in editorial serif) */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E53935] rounded-lg py-1"
        >
          <div className="w-8 h-8 rounded-lg bg-[#202124] flex items-center justify-center text-[#E53935] shadow-xs group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="font-editorial text-2xl font-black tracking-tight text-[#202124] whitespace-nowrap shrink-0 flex items-center">
            ZESTO
            <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] ml-1 mb-1 inline-block"></span>
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Text Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold text-[#202124]/75">
          <button
            onClick={() => onNavigate('storefront', storefrontSlug)}
            className={`hover:text-[#202124] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'storefront' ? 'text-[#202124] font-bold border-b-2 border-[#E53935] pb-0.5' : ''
            }`}
          >
            Live Storefront
          </button>
          <button
            onClick={() => onNavigate('customer-orders')}
            className={`flex items-center gap-1.5 hover:text-[#202124] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'customer-orders' ? 'text-[#202124] font-bold border-b-2 border-[#E53935] pb-0.5' : ''
            }`}
          >
            <span>My Orders</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]"></span>
          </button>
          <button
            onClick={() => onNavigate('restaurants-list')}
            className={`hover:text-[#202124] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'restaurants-list' ? 'text-[#202124] font-bold border-b-2 border-[#E53935] pb-0.5' : ''
            }`}
          >
            Partner Directory
          </button>
          <button
            onClick={() => onNavigate('landing')}
            className={`hover:text-[#202124] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'landing' ? 'text-[#202124] font-bold border-b-2 border-[#E53935] pb-0.5' : ''
            }`}
          >
            Platform Overview
          </button>
          <button
            onClick={onOpenConfig}
            className="flex items-center gap-1.5 hover:text-[#202124] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-[#5f6368]"
          >
            <Database className="w-3.5 h-3.5 text-[#5f6368]" />
            <span>Database</span>
            {isSupabaseConnected ? (
              <span className="text-[10px] text-emerald-700 font-bold">· Supabase</span>
            ) : (
              <span className="text-[10px] text-gray-500 font-normal">· Local</span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions + High-Visibility Quick-Access Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Diner Account / My Orders button */}
          <button
            onClick={() => onNavigate('customer-orders')}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer border ${
              currentView === 'customer-orders'
                ? 'bg-[#202124] text-white border-[#202124]'
                : 'text-[#202124] bg-[#F5F5F5] hover:bg-gray-200 border-gray-200 shadow-xs'
            }`}
            title="View customer orders, active tracking, and receipts"
          >
            <Receipt className="w-3.5 h-3.5 text-[#E53935]" />
            <span className="hidden sm:inline">My Orders</span>
          </button>
          {/* Cart Icon button if viewing storefront */}
          {currentView === 'storefront' && onOpenCart && (
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-[#202124] hover:bg-[#F5F5F5] rounded-xl transition-colors cursor-pointer border border-gray-200"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E53935] text-white text-[11px] font-bold rounded-full flex items-center justify-center tabular-nums shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Direct Demonstration Quick-Access Button for Teacher/Reviewer */}
          <a
            href={`/restaurant/${storefrontSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-bold text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md tracking-wide"
            title="Open live public customer ordering storefront in a new tab"
          >
            <span>Live Storefront Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {currentUser ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-2 text-xs font-bold text-[#202124] bg-[#F5F5F5] hover:bg-gray-200 border border-gray-200 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Store className="w-3.5 h-3.5 text-[#E53935]" />
              <span className="hidden sm:inline">Owner Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 text-xs font-bold text-[#202124] bg-[#F5F5F5] hover:bg-gray-200 border border-gray-200 rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-xs tracking-wide"
            >
              <span className="hidden sm:inline">Restaurant Portal</span>
              <span className="sm:hidden">Portal</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
