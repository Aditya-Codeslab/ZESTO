import React, { useState } from 'react';
import { Restaurant } from '../../types';
import {
  UtensilsCrossed,
  ArrowRight,
  TrendingDown,
  Store,
  ChefHat,
  BellRing,
  ShieldCheck,
  Check,
  ExternalLink,
  QrCode,
  HeartHandshake
} from 'lucide-react';

interface LandingPageProps {
  restaurants: Restaurant[];
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onNavigateToStorefront: (slug: string) => void;
  onNavigateToDashboard: () => void;
  isLoggedIn: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  restaurants,
  onOpenAuth,
  onNavigateToStorefront,
  onNavigateToDashboard,
  isLoggedIn
}) => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(35000);
  const marketplaceCut = monthlyRevenue * 0.30;
  const annualSavings = marketplaceCut * 12;

  const featured = restaurants[0] || {
    id: 'rest-forno-fuoco-001',
    name: 'Forno & Fuoco Trattoria',
    slug: 'forno-fuoco',
    cuisine: 'Wood-Fired Pizza & Handmade Pasta',
    prep_time_minutes: 25,
    delivery_fee: 3.50,
    city: 'San Francisco'
  };

  return (
    <div className="bg-white text-[#202124]">
      {/* Hero Section: High-Impact Editorial Layout */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Bold Typography & Pitch */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Unboxed Kicker */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                <span className="text-[#E53935]">ZESTO Hospitality Platform</span>
                <span>·</span>
                <span>Direct Digital Dining</span>
                <span>·</span>
                <span>0% Commission</span>
              </div>

              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-black text-[#202124] tracking-tight leading-[1.08] text-balance">
                Elevate your kitchen with <span className="text-[#E53935] italic">bespoke online ordering</span>.
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl font-normal">
                Give your culinary brand the prestigious digital presence it deserves. Eliminate the 30% marketplace cut, receive live orders straight to your kitchen line, and curate direct relationships with loyal diners.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                {isLoggedIn ? (
                  <button
                    onClick={onNavigateToDashboard}
                    className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-white bg-[#202124] hover:bg-black rounded-2xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-[#E53935]" />
                    <span>Open Owner Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onOpenAuth('signup')}
                      className="px-7 py-4 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-2xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Claim Your Restaurant Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigateToStorefront(featured.slug)}
                      className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#202124] hover:text-black bg-[#F5F5F5] hover:bg-gray-200 border border-gray-200 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                    >
                      <span>Explore Live Showcase</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Zero platform transaction cut
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Custom direct URL slug
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Instant kitchen ticket dispatch
                </span>
              </div>
            </div>

            {/* Right Column: Floating Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-[#F5F5F5] rounded-3xl p-6 border border-gray-200 shadow-xl transition-transform hover:-translate-y-1 duration-500">
                {/* Floating pill badge */}
                <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-[#202124] text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#E53935] animate-pulse"></span>
                  <span>Live Storefront Preview</span>
                </div>

                {/* Restaurant Brand header */}
                <div className="flex items-center gap-3.5 pb-4 border-b border-gray-200">
                  <div className="w-12 h-12 rounded-2xl bg-[#202124] text-[#E53935] flex items-center justify-center font-editorial text-xl font-bold shadow-xs">
                    F&F
                  </div>
                  <div>
                    <h2 className="font-editorial text-lg font-bold text-[#202124]">
                      Forno & Fuoco Trattoria
                    </h2>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1 font-mono">
                      <span>/restaurant/forno-fuoco</span>
                      <span className="text-amber-500">★★★★★</span>
                    </div>
                  </div>
                </div>

                {/* Sample items preview */}
                <div className="py-4 space-y-3">
                  <div className="p-3 rounded-2xl bg-white border border-gray-200 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#202124] font-editorial">Margherita D.O.P.</div>
                      <div className="text-[11px] text-gray-500 line-clamp-1">San Marzano tomatoes, fresh buffalo mozzarella, sweet basil</div>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#202124] shrink-0">$18.50</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-gray-200 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#202124] font-editorial">Tagliolini al Tartufo</div>
                      <div className="text-[11px] text-gray-500 line-clamp-1">Alpine butter, 24-month parmigiano, shaved black truffles</div>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#202124] shrink-0">$24.00</span>
                  </div>
                </div>

                {/* Order simulation card */}
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#E53935]">Direct Kitchen Order #1084</div>
                    <div className="text-[10px] text-gray-600">0% commission retained by chef</div>
                  </div>
                  <button
                    onClick={() => onNavigateToStorefront('forno-fuoco')}
                    className="px-3.5 py-1.5 text-[11px] font-bold text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-colors cursor-pointer"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI Delivery Savings Calculator */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#202124] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-gray-700">
            {/* Ambient red glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E53935]/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 text-center max-w-xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-bold text-[#E53935] uppercase tracking-widest font-mono">
                The ZESTO Advantage
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-extrabold tracking-tight">
                Calculate your delivery freedom
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Third-party delivery apps siphon 25% to 30% of your hard-earned sales. With ZESTO, 100% of your food revenue stays in your restaurant.
              </p>
            </div>

            <div className="relative z-10 space-y-8">
              {/* Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-200 mb-3">
                  <span>Your Estimated Monthly Delivery & Takeout Sales:</span>
                  <span className="text-xl font-bold font-mono text-[#E53935] tabular-nums">
                    ${monthlyRevenue.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="120000"
                  step="5000"
                  value={monthlyRevenue}
                  onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                  className="w-full accent-[#E53935] cursor-pointer h-2.5 bg-gray-700 rounded-lg"
                />
              </div>

              {/* Comparison Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#2b2c30] border border-gray-700 space-y-1">
                  <div className="text-xs text-gray-400">Aggregator Commission Lost (30%)</div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-red-400 tabular-nums">
                    -${marketplaceCut.toLocaleString()} <span className="text-xs text-gray-400">/ mo</span>
                  </div>
                  <div className="text-[11px] text-gray-400">Wasted fees on your own loyal customers</div>
                </div>

                <div className="p-5 rounded-2xl bg-[#E53935]/15 border border-[#E53935]/30 space-y-1">
                  <div className="text-xs text-red-200">Annual Revenue Retained with ZESTO</div>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#E53935] tabular-nums">
                    +${annualSavings.toLocaleString()} <span className="text-xs text-red-200">/ yr</span>
                  </div>
                  <div className="text-[11px] text-red-200">Reinvested into ingredients, staff, & profit</div>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-2xl transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.01]"
                >
                  Start Saving With ZESTO Today →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento-Box Feature Grid */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-[#E53935] uppercase tracking-widest">
              Hospitality Architecture
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#202124]">
              A complete suite for culinary entrepreneurs
            </h2>
            <p className="text-xs text-gray-500">
              Designed from the ground up for fine dining trattorias, specialty roasteries, and artisanal bakeries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bento Card 1: Live Kitchen Display (Span 7) */}
            <div className="md:col-span-7 bg-[#F5F5F5] rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#202124] text-[#E53935] flex items-center justify-center mb-5">
                  <BellRing className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#202124] mb-2">
                  Live Kitchen Display System (KDS)
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                  Incoming tickets appear instantly in real-time. Kitchen line cooks can advance tickets with single-tap transitions (*Pending* $\to$ *Oven/Prep* $\to$ *Ready for Pickup*), synchronizing live with the customer's tracking screen.
                </p>
              </div>

              {/* Visual preview */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-2xl border border-gray-200 text-xs">
                <div className="p-2.5 rounded-xl bg-[#F5F5F5] border border-gray-200 text-center">
                  <div className="font-bold text-[#E53935]">1. New</div>
                  <div className="font-mono text-[10px] text-gray-500 mt-1">ORD-1084</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F5F5] border border-gray-200 text-center">
                  <div className="font-bold text-blue-700">2. In Oven</div>
                  <div className="font-mono text-[10px] text-gray-500 mt-1">ORD-1082</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F5F5] border border-gray-200 text-center">
                  <div className="font-bold text-emerald-700">3. Ready</div>
                  <div className="font-mono text-[10px] text-gray-500 mt-1">ORD-1083</div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Custom URL Slug & Direct Access (Span 5) */}
            <div className="md:col-span-5 bg-[#F5F5F5] rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#202124] text-amber-400 flex items-center justify-center mb-5">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#202124] mb-2">
                  Dedicated Brand URL
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  Print custom QR codes on tables, packaging, and Instagram bios. Diners order straight from <code className="text-[#E53935] font-bold">/restaurant/:slug</code> without installing heavy app store downloads.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-gray-200 flex items-center gap-3">
                <Store className="w-5 h-5 text-[#E53935] shrink-0" />
                <div className="text-xs font-mono font-bold text-[#202124] truncate">
                  zesto.app/restaurant/{featured.slug}
                </div>
              </div>
            </div>

            {/* Bento Card 3: Canonical Price Security & Tips (Span 5) */}
            <div className="md:col-span-5 bg-[#F5F5F5] rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#202124] text-emerald-400 flex items-center justify-center mb-5">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#202124] mb-2">
                  Staff Gratuity & Price Integrity
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Support kitchen and delivery staff with 15%, 18%, 20%, or custom tip selections. All orders are validated against canonical backend price tables to prevent tampering.
                </p>
              </div>
            </div>

            {/* Bento Card 4: Supabase Row Level Security (Span 7) */}
            <div className="md:col-span-7 bg-[#F5F5F5] rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#202124] text-[#E53935] flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-[#202124] mb-2">
                  Supabase PostgreSQL & Tenant Isolation
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Enterprise-grade tenant security. Every restaurant's menu, sales reports, and customer orders are isolated through PostgreSQL Row Level Security (RLS) policies.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                <span>PostgreSQL 15</span>
                <span>·</span>
                <span>Supabase Realtime WebSockets</span>
                <span>·</span>
                <span>Automatic Offline Resiliency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Restaurants Showcase Grid */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#E53935] uppercase tracking-widest font-mono">
                Featured Establishments
              </span>
              <h2 className="font-editorial text-3xl font-extrabold text-[#202124] mt-1">
                Explore Active Partner Menus
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map(rest => (
              <div
                key={rest.id}
                className="bg-[#F5F5F5] rounded-3xl p-7 border border-gray-200 shadow-2xs hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="font-bold text-[#E53935] uppercase tracking-wider text-[11px]">
                      {rest.cuisine}
                    </span>
                    <span className="font-mono text-[11px] text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                      /restaurant/{rest.slug}
                    </span>
                  </div>

                  <h3 className="font-editorial text-2xl font-bold text-[#202124] group-hover:text-[#E53935] transition-colors">
                    {rest.name}
                  </h3>

                  <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {rest.description}
                  </p>

                  <div className="mt-5 pt-3.5 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-500">
                    <span className="tabular-nums font-mono">{rest.prep_time_minutes}m target prep</span>
                    <span>·</span>
                    <span className="tabular-nums font-mono">${rest.delivery_fee.toFixed(2)} delivery</span>
                    <span>·</span>
                    <span>{rest.city}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-end">
                  <button
                    onClick={() => onNavigateToStorefront(rest.slug)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Browse Live Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-14 bg-[#202124] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E53935] text-white flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="font-editorial text-lg font-bold text-white tracking-tight">
              ZESTO
            </span>
            <span className="text-gray-600">·</span>
            <span>Premium Hospitality Ordering Platform</span>
          </div>

          <div>
            Built with React 19, TypeScript & Supabase Cloud
          </div>
        </div>
      </footer>
    </div>
  );
};
