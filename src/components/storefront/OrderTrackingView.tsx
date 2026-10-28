import React, { useState, useEffect } from 'react';
import { Order, Restaurant, OrderStatus } from '../../types';
import { getRestaurantBySlug, getOrderById, updateOrderStatus } from '../../services/restaurantService';
import { subscribeToOrders } from '../../lib/supabase';
import {
  CheckCircle2,
  Clock,
  Bike,
  Store,
  Phone,
  MapPin,
  ChevronLeft,
  ArrowRight,
  Flame,
  ChefHat,
  PackageCheck,
  Sparkles,
  RefreshCw,
  HeartHandshake
} from 'lucide-react';

interface OrderTrackingViewProps {
  orderId: string;
  onBackToMenu: () => void;
  onNavigateToOrders?: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orderId,
  onBackToMenu,
  onNavigateToOrders
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial order data
  useEffect(() => {
    async function load() {
      setLoading(true);
      const o = await getOrderById(orderId);
      if (o) {
        setOrder(o);
        const r = await getRestaurantBySlug(o.restaurant_id.replace('rest-', ''));
        if (r) {
          setRestaurant(r);
        }
      }
      setLoading(false);
    }
    load();
  }, [orderId]);

  // Subscribe to real-time order updates
  useEffect(() => {
    const unsubscribe = subscribeToOrders((updatedOrder) => {
      if (updatedOrder.id === orderId) {
        setOrder(updatedOrder);
      }
    });
    return () => unsubscribe();
  }, [orderId]);

  // Advance simulation for tester convenience
  const handleSimulateNextStage = async () => {
    if (!order) return;
    const stages: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered'];
    const currentIndex = stages.indexOf(order.status);
    if (currentIndex < stages.length - 1) {
      const nextStatus = stages[currentIndex + 1];
      await updateOrderStatus(order.id, nextStatus);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <RefreshCw className="w-4 h-4 animate-spin text-[#E53935]" />
          <span>Connecting to kitchen live display...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
        <div className="bg-[#F5F5F5] rounded-3xl p-8 border border-gray-200 text-center max-w-md shadow-lg">
          <h2 className="font-editorial text-xl font-bold text-[#202124]">Order Not Found</h2>
          <p className="mt-1 text-xs text-gray-600">
            We could not retrieve this order ticket.
          </p>
          <button
            onClick={onBackToMenu}
            className="mt-5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#202124] hover:bg-black rounded-xl cursor-pointer"
          >
            Back to Restaurant
          </button>
        </div>
      </div>
    );
  }

  const stages: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'pending',
      label: 'Order Confirmed',
      desc: 'Transmitted directly to kitchen POS',
      icon: CheckCircle2
    },
    {
      key: 'preparing',
      label: 'Kitchen Firing',
      desc: 'Dishes in wood-fired oven & line preparation',
      icon: Flame
    },
    {
      key: 'ready',
      label: order.order_type === 'delivery' ? 'Courier Dispatched' : 'Ready at Counter',
      desc: order.order_type === 'delivery' ? 'Driver en route with insulated transport' : 'Sealed & packaged for customer pickup',
      icon: PackageCheck
    },
    {
      key: 'delivered',
      label: order.order_type === 'delivery' ? 'Delivered' : 'Picked Up',
      desc: 'Order complete. Buon Appetito!',
      icon: ChefHat
    }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === order.status);
  const activeStage = stages[currentStageIndex] || stages[0];

  return (
    <div className="min-h-screen bg-[#FFFFFF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation & Simulator */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMenu}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#202124] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#E53935]" />
              <span>Return to Storefront</span>
            </button>

            {onNavigateToOrders && (
              <>
                <span className="text-gray-300">·</span>
                <button
                  onClick={onNavigateToOrders}
                  className="text-xs font-bold text-[#E53935] hover:text-[#D32F2F] transition-colors cursor-pointer"
                >
                  My Orders Portal
                </button>
              </>
            )}
          </div>

          {/* Tester Helper for Live Kitchen Advance */}
          {order.status !== 'delivered' && (
            <button
              onClick={handleSimulateNextStage}
              className="text-[11px] font-bold text-[#E53935] hover:text-[#D32F2F] bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Kitchen Next Stage</span>
            </button>
          )}
        </div>

        {/* Live Status Tracker Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Top dark banner */}
          <div className="p-6 sm:p-8 bg-[#202124] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 font-mono">
                <span className="font-bold text-[#E53935]">{order.order_number}</span>
                <span>·</span>
                <span>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <span>·</span>
                <span className="capitalize text-white">{order.order_type}</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-black tracking-tight text-white">
                {activeStage.label}
              </h1>
              <p className="text-xs text-gray-300 mt-1">
                {activeStage.desc}
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-emerald-400 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300">Live Realtime Sync</span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="p-6 sm:p-8 border-b border-gray-200 bg-[#F5F5F5]">
            <div className="grid grid-cols-4 gap-2 relative">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const IconComponent = stage.icon;

                return (
                  <div key={stage.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all mb-2.5 ${
                        isCurrent
                          ? 'bg-[#E53935] text-white ring-4 ring-[#E53935]/20 shadow-md'
                          : isPassed
                          ? 'bg-[#202124] text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-bold leading-tight ${isPassed ? 'text-[#202124]' : 'text-gray-400'}`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Address */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-gray-200 space-y-1">
                <div className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                  Diner Information
                </div>
                <div className="font-editorial text-sm font-bold text-[#202124]">{order.customer_name}</div>
                <div className="font-mono text-gray-600">{order.customer_phone}</div>
                <div className="text-gray-500 truncate">{order.customer_email}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-gray-200 space-y-1">
                <div className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                  {order.order_type === 'delivery' ? 'Delivery Destination' : 'Pickup Location'}
                </div>
                <div className="font-bold text-[#202124]">
                  {order.delivery_address}
                </div>
                {order.special_instructions && (
                  <div className="text-amber-800 italic text-[11px] bg-amber-50 p-2 rounded-lg mt-1 border border-amber-200">
                    "{order.special_instructions}"
                  </div>
                )}
              </div>
            </div>

            {/* Itemized Receipt Table */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
              <div className="px-5 py-3.5 bg-[#F5F5F5] border-b border-gray-200 text-xs font-bold text-[#202124] uppercase tracking-wider">
                Itemized Receipt
              </div>
              <div className="p-5 divide-y divide-gray-100 text-xs space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex justify-between items-start">
                    <div>
                      <div className="font-editorial text-sm font-bold text-[#202124]">
                        <span className="font-mono font-bold text-[#E53935] text-xs mr-1">{item.quantity}x</span> {item.item_name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-mono">
                        ${item.unit_price.toFixed(2)} each
                      </div>
                    </div>
                    <span className="font-mono font-bold text-[#202124] tabular-nums">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="pt-4 space-y-1.5 text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono tabular-nums text-[#202124] font-semibold">${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax (8%)</span>
                    <span className="font-mono tabular-nums text-[#202124] font-semibold">${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-mono tabular-nums text-[#202124] font-semibold">${order.delivery_fee.toFixed(2)}</span>
                  </div>
                  {order.tip && order.tip > 0 ? (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Kitchen Gratuity</span>
                      <span className="font-mono tabular-nums">${order.tip.toFixed(2)}</span>
                    </div>
                  ) : null}
                  <div className="pt-3 border-t border-gray-200 flex justify-between font-extrabold text-[#202124] text-base">
                    <span className="font-editorial text-lg">Total Paid</span>
                    <span className="font-mono tabular-nums text-[#E53935]">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
