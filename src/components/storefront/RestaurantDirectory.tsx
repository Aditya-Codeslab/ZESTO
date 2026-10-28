import React, { useState } from 'react';
import { Restaurant } from '../../types';
import { Store, Search, ArrowRight, MapPin, Clock, Bike, UtensilsCrossed } from 'lucide-react';

interface RestaurantDirectoryProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (slug: string) => void;
  onBackToLanding: () => void;
}

export const RestaurantDirectory: React.FC<RestaurantDirectoryProps> = ({
  restaurants,
  onSelectRestaurant,
  onBackToLanding
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = restaurants.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-gray-200">
          <div>
            <div className="text-xs font-bold text-[#E53935] uppercase tracking-widest font-mono mb-1">
              ZESTO Culinary Network
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-[#202124]">
              Partner Restaurant Directory
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Order directly from independent artisanal kitchens with 0% platform markups.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by restaurant or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 rounded-2xl bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
            />
          </div>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(restaurant => (
            <article
              key={restaurant.id}
              className="bg-[#F5F5F5] rounded-3xl border border-gray-200 p-7 shadow-xs hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px]">
                    {restaurant.cuisine}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                    /restaurant/{restaurant.slug}
                  </span>
                </div>

                <h2 className="font-editorial text-2xl font-bold text-[#202124] group-hover:text-[#E53935] transition-colors">
                  {restaurant.name}
                </h2>

                <p className="mt-2 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                  {restaurant.description}
                </p>

                <div className="mt-5 pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{restaurant.address}, {restaurant.city}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#E53935]" />
                      <span className="font-mono tabular-nums text-[#202124]">{restaurant.prep_time_minutes}m target prep</span>
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Bike className="w-3.5 h-3.5 text-[#E53935]" />
                      <span className="font-mono tabular-nums text-[#202124]">${restaurant.delivery_fee.toFixed(2)} delivery</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 pt-4 border-t border-gray-200 flex items-center justify-end">
                <button
                  onClick={() => onSelectRestaurant(restaurant.slug)}
                  className="w-full py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-[#202124] group-hover:bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Open Restaurant Menu</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
