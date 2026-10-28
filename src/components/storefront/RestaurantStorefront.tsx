import React, { useState, useEffect } from 'react';
import { Restaurant, Category, MenuItem, CartItem, Order } from '../../types';
import { getCategories, getMenuItems } from '../../services/restaurantService';
import { FoodCard } from '../common/FoodCard';
import { CartDrawer } from '../common/CartDrawer';
import { CheckoutModal } from '../common/CheckoutModal';
import {
  Clock,
  Bike,
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Leaf,
  Flame,
  WheatOff,
  Store,
  ChevronRight,
  Info,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';

interface RestaurantStorefrontProps {
  restaurant: Restaurant;
  onOrderPlaced: (order: Order) => void;
  onNavigateHome: () => void;
  reorderOrder?: Order | null;
}

export const RestaurantStorefront: React.FC<RestaurantStorefrontProps> = ({
  restaurant,
  onOrderPlaced,
  onNavigateHome,
  reorderOrder
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [cats, items] = await Promise.all([
        getCategories(restaurant.id),
        getMenuItems(restaurant.id)
      ]);
      setCategories(cats);
      setMenuItems(items);

      // Pre-fill tray if reordering past meal
      if (reorderOrder && items.length > 0) {
        const reorderCartItems: CartItem[] = [];
        for (const orderItem of reorderOrder.items) {
          const matchedItem = items.find(
            m => m.id === orderItem.menu_item_id || m.name.toLowerCase() === orderItem.item_name.toLowerCase()
          );
          if (matchedItem) {
            reorderCartItems.push({
              menuItem: matchedItem,
              quantity: orderItem.quantity,
              special_instructions: orderItem.special_instructions
            });
          }
        }
        if (reorderCartItems.length > 0) {
          setCartItems(reorderCartItems);
          setIsCartOpen(true);
        }
      }
    }
    loadData();
  }, [restaurant.id, reorderOrder]);

  const handleAddToCart = (item: MenuItem, delta: number) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.menuItem.id === item.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter(ci => ci.menuItem.id !== item.id);
        }
        return prev.map(ci => ci.menuItem.id === item.id ? { ...ci, quantity: newQty } : ci);
      } else if (delta > 0) {
        return [...prev, { menuItem: item, quantity: delta }];
      }
      return prev;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    setSelectedTip(0);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  // Filter menu items
  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'all' && item.category_id !== selectedCategory) return false;
    if (dietaryFilter !== 'all' && !item.dietary_tags.includes(dietaryFilter as any)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] pb-28">
      {/* Immersive Cover Header with Dark Gradient Overlay */}
      <section className="bg-[#202124] text-white relative overflow-hidden border-b border-gray-800">
        {/* Subtle decorative culinary texture glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#202124] via-[#202124]/90 to-transparent z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#E53935]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-5 max-w-2xl">
              {/* Floating Monogram / Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#202124] text-[#E53935] border border-white/10 flex items-center justify-center font-editorial text-2xl sm:text-3xl font-black shadow-xl shrink-0">
                {restaurant.name.charAt(0)}
              </div>

              <div className="space-y-3">
                {/* Unboxed Metadata (Zero-Pill Rule) */}
                <div className="flex items-center gap-2 text-xs text-gray-300 flex-wrap font-medium">
                  <span className="font-bold text-[#E53935] uppercase tracking-wider">{restaurant.cuisine}</span>
                  <span>·</span>
                  <span className="text-gray-400">Artisanal Direct Kitchen</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">Open for Orders</span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {restaurant.name}
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                  {restaurant.description}
                </p>

                {/* Trust and timing badges */}
                <div className="pt-2 flex flex-wrap items-center gap-5 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#E53935]" />
                    <span className="font-mono tabular-nums text-white font-bold">{restaurant.prep_time_minutes} min</span> target prep
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bike className="w-4 h-4 text-[#E53935]" />
                    <span className="font-mono tabular-nums text-white font-bold">${restaurant.delivery_fee.toFixed(2)}</span> delivery
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{restaurant.address}, {restaurant.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-mono">{restaurant.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tray Preview Card on Desktop */}
            {cartCount > 0 && (
              <div className="hidden lg:flex flex-col bg-[#202124]/90 backdrop-blur-md rounded-3xl p-5 border border-white/10 w-72 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Your Order Tray</span>
                  <span className="tabular-nums font-mono font-bold text-[#E53935]">{cartCount} items</span>
                </div>
                <div className="text-2xl font-black font-mono tabular-nums mb-4 text-white">
                  ${cartSubtotal.toFixed(2)}
                </div>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-[#E53935] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Review Tray</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sticky Menu Navigation Bar & Search */}
      <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Categories Tab Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#202124] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#202124] hover:bg-[#F5F5F5]'
              }`}
            >
              Full Menu ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter(m => m.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#202124] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#202124] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Search & Dietary Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search dishes or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F5F5F5] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              {['all', 'vegetarian', 'spicy'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setDietaryFilter(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    dietaryFilter === tag
                      ? 'bg-[#202124] text-[#E53935] shadow-xs font-bold'
                      : 'text-gray-600 hover:text-[#202124] hover:bg-[#F5F5F5]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dishes Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center bg-[#F5F5F5] rounded-3xl border border-gray-200 p-8 max-w-md mx-auto shadow-sm">
            <Info className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="font-editorial text-xl font-bold text-[#202124]">No dishes found</h3>
            <p className="mt-1 text-xs text-gray-600">
              Try selecting another menu category or clearing your search keywords.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setDietaryFilter('all'); }}
              className="mt-5 px-5 py-2.5 text-xs font-bold text-white bg-[#202124] hover:bg-black rounded-xl transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredItems.map(item => {
              const inCart = cartItems.find(ci => ci.menuItem.id === item.id);
              return (
                <FoodCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                  cartQuantity={inCart ? inCart.quantity : 0}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Mobile Sticky Floating Tray Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-5 inset-x-0 z-40 max-w-md mx-auto px-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-4 px-6 rounded-2xl bg-[#202124] text-white shadow-2xl hover:bg-black transition-all flex items-center justify-between cursor-pointer border border-white/10 hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E53935] flex items-center justify-center text-white font-black text-xs tabular-nums shadow-xs">
                {cartCount}
              </div>
              <div className="text-left">
                <div className="font-editorial text-sm font-bold">Review Your Tray</div>
                <div className="text-[11px] text-gray-300">Tap to finalize order & tip</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-mono tabular-nums text-[#E53935]">
                ${cartSubtotal.toFixed(2)}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        restaurant={restaurant}
        onUpdateQuantity={handleAddToCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={(tip) => {
          setSelectedTip(tip);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        restaurant={restaurant}
        initialTip={selectedTip}
        onOrderSuccess={(order) => {
          setIsCheckoutOpen(false);
          setIsCartOpen(false);
          setCartItems([]);
          onOrderPlaced(order);
        }}
      />
    </div>
  );
};
