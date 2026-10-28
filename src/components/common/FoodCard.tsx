import React from 'react';
import { MenuItem } from '../../types';
import { Plus, Minus, Check, Flame, Leaf, WheatOff } from 'lucide-react';

interface FoodCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  cartQuantity?: number;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onAddToCart, cartQuantity = 0 }) => {
  const [qty, setQty] = React.useState(1);
  const [justAdded, setJustAdded] = React.useState(false);

  const handleAdd = () => {
    if (!item.is_available) return;
    onAddToCart(item, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group flex flex-col bg-[#F5F5F5] rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Visual Media Container with Zero-Broken-Image Policy */}
      <div className="relative aspect-[4/3] w-full bg-white flex items-center justify-center overflow-hidden border-b border-gray-200">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : null}

        {/* Elegant Culinary Emblem Fallback */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none select-none bg-gradient-to-br from-gray-50 to-[#F5F5F5]">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-xs border border-gray-200 flex items-center justify-center text-[#202124] mb-2 group-hover:scale-110 transition-transform">
            {item.dietary_tags.includes('spicy') ? (
              <Flame className="w-6 h-6 text-[#E53935]" />
            ) : item.dietary_tags.includes('vegetarian') ? (
              <Leaf className="w-6 h-6 text-emerald-600" />
            ) : (
              <svg className="w-7 h-7 text-[#5f6368]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
            {item.dietary_tags.length > 0 ? item.dietary_tags[0].replace('_', ' ') : 'Freshly Prepared'}
          </span>
        </div>

        {/* Sold Out Overlay */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-[#202124]/75 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-[11px] font-bold text-white tracking-widest uppercase px-3.5 py-1.5 bg-[#202124] rounded-lg border border-white/20">
              Sold Out Today
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#F5F5F5]">
        <div>
          {/* Unboxed Metadata (Zero-Pill Rule) */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1.5 flex-wrap">
            {item.dietary_tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 font-semibold capitalize text-[#202124]/80">
                {tag === 'vegetarian' && <Leaf className="w-3 h-3 text-emerald-600 inline" />}
                {tag === 'spicy' && <Flame className="w-3 h-3 text-[#E53935] inline" />}
                {tag === 'gluten_free' && <WheatOff className="w-3 h-3 text-amber-600 inline" />}
                {tag.replace('_', ' ')}
                <span className="text-gray-300 ml-1">·</span>
              </span>
            ))}
            <span className="text-gray-400">Crafted to order</span>
          </div>

          <h3 className="font-editorial text-lg font-bold text-[#202124] group-hover:text-[#E53935] transition-colors leading-snug">
            {item.name}
          </h3>

          <p className="mt-1.5 text-xs text-[#5f6368] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer: Price & Add Controls */}
        <div className="mt-5 pt-3.5 border-t border-gray-200/80 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Price</span>
            <span className="text-lg font-extrabold text-[#202124] tabular-nums font-mono">
              ${item.price.toFixed(2)}
            </span>
          </div>

          {item.is_available ? (
            <div className="flex items-center gap-1.5">
              {cartQuantity > 0 ? (
                <div className="flex items-center bg-white rounded-xl p-1 border border-gray-300 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onAddToCart(item, -1)}
                    className="w-7 h-7 flex items-center justify-center text-[#202124] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 text-xs font-bold tabular-nums font-mono text-[#202124]">
                    {cartQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onAddToCart(item, 1)}
                    className="w-7 h-7 flex items-center justify-center text-[#202124] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs ${
                    justAdded
                      ? 'bg-emerald-600 scale-95'
                      : 'bg-[#E53935] hover:bg-[#D32F2F] active:scale-95 shadow-sm hover:shadow-md'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-400 italic">Sold Out</span>
          )}
        </div>
      </div>
    </article>
  );
};
