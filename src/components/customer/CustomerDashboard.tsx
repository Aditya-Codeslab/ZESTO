import React, { useState, useEffect } from 'react';
import { Order, Restaurant, OrderStatus } from '../../types';
import { getAllOrders, getRestaurants } from '../../services/restaurantService';
import { subscribeToOrders } from '../../lib/supabase';
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  RotateCcw,
  Receipt,
  CheckCircle2,
  Bike,
  Store,
  ChevronRight,
  ExternalLink,
  Flame,
  PackageCheck,
  Search,
  Filter,
  X,
  Printer,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';

interface CustomerDashboardProps {
  onNavigateToStorefront: (slug: string) => void;
  onNavigateToTracking: (orderId: string) => void;
  onNavigateToDashboard: () => void;
  onReorder: (order: Order) => void;
  onBackToHome: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onNavigateToStorefront,
  onNavigateToTracking,
  onNavigateToDashboard,
  onReorder,
  onBackToHome
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

  // Load orders and restaurants on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [allOrders, allRestaurants] = await Promise.all([
        getAllOrders(),
        getRestaurants()
      ]);
      setOrders(allOrders);
      setRestaurants(allRestaurants);
      setLoading(false);
    }
    loadData();
  }, []);

  // Real-time synchronization for customer live order updates
  useEffect(() => {
    const unsubscribe = subscribeToOrders((updatedOrder) => {
      setOrders(prev => {
        const index = prev.findIndex(o => o.id === updatedOrder.id);
        if (index >= 0) {
          const next = [...prev];
          next[index] = updatedOrder;
          return next;
        }
        return [updatedOrder, ...prev];
      });

      // If viewing the receipt of this updated order, refresh it
      setSelectedReceiptOrder(prev => (prev?.id === updatedOrder.id ? updatedOrder : prev));
    });

    return () => unsubscribe();
  }, []);

  // Helper to resolve restaurant details
  const getRestaurantForOrder = (restaurantId: string): Restaurant | undefined => {
    return (
      restaurants.find(r => r.id === restaurantId) ||
      restaurants.find(r => restaurantId.includes(r.slug)) ||
      restaurants[0]
    );
  };

  // Order category splitting
  const activeOrders = orders.filter(
    o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing' || o.status === 'ready'
  );
  const pastOrders = orders.filter(
    o => o.status === 'delivered' || o.status === 'cancelled'
  );

  // Filter based on selected tab and search query
  const displayedOrders = orders.filter(o => {
    if (filterTab === 'active' && (o.status === 'delivered' || o.status === 'cancelled')) return false;
    if (filterTab === 'completed' && !(o.status === 'delivered' || o.status === 'cancelled')) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const rest = getRestaurantForOrder(o.restaurant_id);
      const matchOrderNum = o.order_number.toLowerCase().includes(q);
      const matchRestName = rest?.name.toLowerCase().includes(q);
      const matchItem = o.items.some(i => i.item_name.toLowerCase().includes(q));
      return matchOrderNum || matchRestName || matchItem;
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Order Received
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
            <Flame className="w-3.5 h-3.5 text-[#E53935]" />
            Kitchen Firing
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
            Ready for Hand-off
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const getProgressPercentage = (status: OrderStatus): number => {
    switch (status) {
      case 'pending':
        return 25;
      case 'preparing':
        return 60;
      case 'ready':
        return 90;
      case 'delivered':
        return 100;
      default:
        return 10;
    }
  };

  const defaultDemoSlug = restaurants[0]?.slug || 'forno-fuoco';

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202124] pb-24">
      {/* Teacher / Reviewer Fast-Switch Banner */}
      <div className="bg-[#202124] text-white border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E53935]"></span>
              Reviewer Portal
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-300">Quick-jump between platform environments:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToStorefront(defaultDemoSlug)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Public Storefront</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={onNavigateToDashboard}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Owner Dashboard</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <span>Diner Account</span>
                <span>·</span>
                <span className="text-[#E53935]">Live Order Tracking & History</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-black text-[#202124] tracking-tight">
                My Orders & Receipts
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                Track current dishes cooking in real-time, inspect itemized receipts, and instantly reorder from your favorite artisan kitchens.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateToStorefront(defaultDemoSlug)}
                className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Menu & Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* 1. ACTIVE LIVE ORDERS SECTION */}
        {activeOrders.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E53935] animate-ping"></span>
                <h2 className="font-editorial text-2xl font-black text-[#202124] tracking-tight">
                  Active Orders in Progress ({activeOrders.length})
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Realtime Kitchen Sync Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOrders.map(order => {
                const rest = getRestaurantForOrder(order.restaurant_id);
                const progress = getProgressPercentage(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-[#F5F5F5] rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="p-5 sm:p-6 bg-white border-b border-gray-200 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-1">
                          <span className="font-bold text-[#E53935]">{order.order_number}</span>
                          <span>·</span>
                          <span className="capitalize">{order.order_type}</span>
                          <span>·</span>
                          <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <h3 className="font-editorial text-xl font-black text-[#202124]">
                          {rest?.name || 'Artisan Restaurant'}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {order.delivery_address}
                        </p>
                      </div>

                      {getStatusBadge(order.status)}
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 py-4 bg-white border-b border-gray-100">
                      <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>Preparation Progress</span>
                        <span className="text-[#E53935] font-mono">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#E53935] h-full transition-all duration-700 ease-out rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 mt-2 font-mono">
                        <span className={progress >= 25 ? 'text-[#202124] font-bold' : ''}>Confirmed</span>
                        <span className={progress >= 60 ? 'text-[#202124] font-bold' : ''}>Firing</span>
                        <span className={progress >= 90 ? 'text-[#202124] font-bold' : ''}>Ready</span>
                        <span className={progress >= 100 ? 'text-[#202124] font-bold' : ''}>Complete</span>
                      </div>
                    </div>

                    {/* Items Overview */}
                    <div className="p-6 space-y-3 flex-1">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Dishes in Oven & Line
                      </div>
                      <div className="space-y-1.5">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-[#202124] font-medium">
                              <span className="font-mono font-bold text-[#E53935] mr-1">{item.quantity}x</span>
                              {item.item_name}
                            </span>
                            <span className="font-mono text-gray-600 tabular-nums">
                              ${item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-semibold">Total Paid</span>
                        <span className="font-mono text-base font-extrabold text-[#202124] tabular-nums">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions footer */}
                    <div className="p-4 sm:p-5 bg-white border-t border-gray-200 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedReceiptOrder(order)}
                        className="px-3.5 py-2 text-xs font-bold text-gray-700 hover:text-[#202124] bg-[#F5F5F5] hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-gray-200"
                      >
                        <Receipt className="w-3.5 h-3.5 text-gray-500" />
                        <span>View Receipt</span>
                      </button>

                      <button
                        onClick={() => onNavigateToTracking(order.id)}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Live Status Tracker</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. ORDER HISTORY & FILTER CONTROLS */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <div>
              <h2 className="font-editorial text-2xl font-black text-[#202124] tracking-tight">
                Order History & Past Receipts
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Detailed archive of your dining history across all platform venues.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-[#202124] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#202124] bg-[#F5F5F5] border border-gray-200'
                }`}
              >
                All Orders ({orders.length})
              </button>
              <button
                onClick={() => setFilterTab('active')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  filterTab === 'active'
                    ? 'bg-[#202124] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#202124] bg-[#F5F5F5] border border-gray-200'
                }`}
              >
                Active ({activeOrders.length})
              </button>
              <button
                onClick={() => setFilterTab('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  filterTab === 'completed'
                    ? 'bg-[#202124] text-white shadow-xs'
                    : 'text-gray-600 hover:text-[#202124] bg-[#F5F5F5] border border-gray-200'
                }`}
              >
                Completed ({pastOrders.length})
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by restaurant, dish name, or order ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F5F5F5] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
            />
          </div>

          {/* List of Orders */}
          {loading ? (
            <div className="py-16 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#E53935] border-t-transparent rounded-full animate-spin"></span>
              <span>Loading order records...</span>
            </div>
          ) : displayedOrders.length === 0 ? (
            <div className="bg-[#F5F5F5] rounded-3xl p-10 text-center border border-gray-200 max-w-md mx-auto space-y-4">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#202124]">No orders found</h3>
                <p className="text-xs text-gray-600 mt-1">
                  {searchQuery
                    ? 'No orders match your search term.'
                    : 'You have not placed any orders matching this category yet.'}
                </p>
              </div>
              <button
                onClick={() => onNavigateToStorefront(defaultDemoSlug)}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Explore Restaurant Menus
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedOrders.map(order => {
                const rest = getRestaurantForOrder(order.restaurant_id);
                const isPast = order.status === 'delivered' || order.status === 'cancelled';

                return (
                  <div
                    key={order.id}
                    className="bg-[#F5F5F5] rounded-2xl border border-gray-200 p-5 sm:p-6 transition-all hover:border-gray-300 flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    {/* Left: Restaurant Info & Summary */}
                    <div className="flex items-start gap-4">
                      {/* Monogram Badge */}
                      <div className="w-12 h-12 rounded-xl bg-[#202124] text-[#E53935] flex items-center justify-center font-editorial text-xl font-bold shrink-0 shadow-xs">
                        {rest?.name.charAt(0) || 'R'}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-editorial text-lg font-black text-[#202124]">
                            {rest?.name || 'Artisan Kitchen'}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono flex-wrap">
                          <span className="font-bold text-[#E53935]">{order.order_number}</span>
                          <span>·</span>
                          <span>
                            {new Date(order.created_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span>·</span>
                          <span className="capitalize">{order.order_type}</span>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-1 max-w-xl">
                          {order.items.map(i => `${i.quantity}x ${i.item_name}`).join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Right: Price & Quick Action Buttons */}
                    <div className="flex flex-row md:flex-col items-end justify-between md:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-200">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Amount</span>
                        <span className="font-mono text-xl font-black text-[#202124] tabular-nums">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Itemized Receipt */}
                        <button
                          onClick={() => setSelectedReceiptOrder(order)}
                          className="px-3 py-1.5 text-xs font-bold text-gray-700 hover:text-[#202124] bg-white hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5 border border-gray-200 cursor-pointer shadow-xs"
                          title="View detailed itemized receipt breakdown"
                        >
                          <Receipt className="w-3.5 h-3.5 text-gray-500" />
                          <span>Receipt</span>
                        </button>

                        {/* Track Live if not completed */}
                        {!isPast ? (
                          <button
                            onClick={() => onNavigateToTracking(order.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>Live Track</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          /* Quick Reorder Action */
                          <button
                            onClick={() => onReorder(order)}
                            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md"
                            title="Re-populate tray with these items and reorder"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reorder Meal</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 3. ITEMIZED RECEIPT MODAL */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#202124] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#E53935]">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-white leading-tight">
                    Itemized Order Receipt
                  </h3>
                  <p className="text-[11px] font-mono text-gray-400">
                    {selectedReceiptOrder.order_number} · {new Date(selectedReceiptOrder.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Restaurant & Customer metadata */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Restaurant</span>
                  <div className="font-editorial text-base font-bold text-[#202124]">
                    {getRestaurantForOrder(selectedReceiptOrder.restaurant_id)?.name || 'ZESTO Artisan Kitchen'}
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    {getRestaurantForOrder(selectedReceiptOrder.restaurant_id)?.address}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Customer</span>
                  <div className="font-bold text-[#202124]">{selectedReceiptOrder.customer_name}</div>
                  <div className="text-gray-500 font-mono text-[11px]">{selectedReceiptOrder.customer_phone}</div>
                  <div className="text-gray-500 truncate text-[11px]">{selectedReceiptOrder.delivery_address}</div>
                </div>
              </div>

              {/* Status and Fulfillment */}
              <div className="flex items-center justify-between bg-[#F5F5F5] p-3 rounded-xl border border-gray-200">
                <span className="font-semibold text-gray-600">Fulfillment Method</span>
                <div className="flex items-center gap-2">
                  <span className="capitalize font-bold text-[#202124]">{selectedReceiptOrder.order_type}</span>
                  {getStatusBadge(selectedReceiptOrder.status)}
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 pb-1 border-b border-gray-200">
                  Itemized Line Breakdown
                </div>
                {selectedReceiptOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-bold text-[#202124]">
                        <span className="text-[#E53935] font-mono mr-1.5">{item.quantity}x</span>
                        {item.item_name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        ${item.unit_price.toFixed(2)} each
                      </div>
                      {item.special_instructions && (
                        <div className="text-[11px] text-amber-800 italic bg-amber-50 px-2 py-0.5 rounded mt-0.5 border border-amber-200">
                          "{item.special_instructions}"
                        </div>
                      )}
                    </div>
                    <span className="font-mono font-bold text-[#202124] tabular-nums">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="pt-4 border-t border-gray-200 space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Food & Beverage Subtotal</span>
                  <span className="font-mono tabular-nums text-[#202124] font-semibold">
                    ${selectedReceiptOrder.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (8%)</span>
                  <span className="font-mono tabular-nums text-[#202124] font-semibold">
                    ${selectedReceiptOrder.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery & Dispatch Fee</span>
                  <span className="font-mono tabular-nums text-[#202124] font-semibold">
                    ${selectedReceiptOrder.delivery_fee.toFixed(2)}
                  </span>
                </div>
                {selectedReceiptOrder.tip && selectedReceiptOrder.tip > 0 ? (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Kitchen Gratuity & Tip</span>
                    <span className="font-mono tabular-nums">
                      ${selectedReceiptOrder.tip.toFixed(2)}
                    </span>
                  </div>
                ) : null}

                <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-baseline font-black text-[#202124]">
                  <span className="font-editorial text-base">Grand Total Paid</span>
                  <span className="font-mono text-xl tabular-nums text-[#E53935]">
                    ${selectedReceiptOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {selectedReceiptOrder.special_instructions && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">Order Instructions</span>
                  {selectedReceiptOrder.special_instructions}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 bg-[#F5F5F5] border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-bold text-gray-700 hover:text-[#202124] bg-white hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5 border border-gray-200 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-gray-500" />
                <span>Print Receipt</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const ord = selectedReceiptOrder;
                    setSelectedReceiptOrder(null);
                    onReorder(ord);
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder This Meal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
