import React, { useState } from 'react';
import { Restaurant, Order, OrderStatus } from '../../types';
import {
  Bell,
  Clock,
  Bike,
  Store,
  Phone,
  MapPin,
  Check,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  FileText,
  HeartHandshake,
  ExternalLink
} from 'lucide-react';

interface OrdersTabProps {
  restaurant: Restaurant;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onRefreshOrders: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  restaurant,
  orders,
  onUpdateOrderStatus,
  onRefreshOrders
}) => {
  const [filterType, setFilterType] = useState<'all' | 'delivery' | 'pickup'>('all');

  const filteredOrders = orders.filter(o => {
    if (filterType !== 'all' && o.order_type !== filterType) return false;
    return true;
  });

  const pending = filteredOrders.filter(o => o.status === 'pending');
  const preparing = filteredOrders.filter(o => o.status === 'preparing');
  const ready = filteredOrders.filter(o => o.status === 'ready');
  const completed = filteredOrders.filter(o => o.status === 'delivered');

  return (
    <div className="space-y-8">
      {/* KDS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#202124]">
              Kitchen Display System (KDS)
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-[#F5F5F5] border border-emerald-300 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Realtime Synced
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Incoming direct dining tickets update live. Advance tickets through line stages to notify diners.
          </p>
        </div>

        {/* Filter controls + Storefront demo launch */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-white p-1 rounded-xl border border-gray-200 text-xs shadow-2xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-[#202124] text-white' : 'text-gray-600 hover:text-[#202124]'
              }`}
            >
              All Tickets
            </button>
            <button
              onClick={() => setFilterType('delivery')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'delivery' ? 'bg-[#202124] text-white' : 'text-gray-600 hover:text-[#202124]'
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => setFilterType('pickup')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                filterType === 'pickup' ? 'bg-[#202124] text-white' : 'text-gray-600 hover:text-[#202124]'
              }`}
            >
              Takeout
            </button>
          </div>

          <a
            href={`/restaurant/${restaurant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 text-xs font-bold text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Open customer storefront in a new window to place a test order"
          >
            <span>Live Storefront Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {/* Column 1: Pending */}
        <div className="bg-[#F5F5F5] rounded-3xl p-4 border border-gray-200 flex flex-col min-h-[520px]">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E53935]"></span>
              <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
                1. New / Pending
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#202124] bg-white px-2 py-0.5 rounded-md border border-gray-200 tabular-nums">
              {pending.length}
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {pending.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center text-xs text-gray-500 p-4">
                <CheckCircle2 className="w-6 h-6 mb-1 text-amber-600" />
                <span>No pending tickets</span>
              </div>
            ) : (
              pending.map(order => renderOrderCard(order, onUpdateOrderStatus))
            )}
          </div>
        </div>

        {/* Column 2: Preparing */}
        <div className="bg-[#F5F5F5] rounded-3xl p-4 border border-gray-200 flex flex-col min-h-[520px]">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
                2. In Preparation
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#202124] bg-white px-2 py-0.5 rounded-md border border-gray-200 tabular-nums">
              {preparing.length}
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {preparing.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center text-xs text-gray-500 p-4">
                <Flame className="w-6 h-6 mb-1 text-[#E53935]" />
                <span>Oven & prep lines clear</span>
              </div>
            ) : (
              preparing.map(order => renderOrderCard(order, onUpdateOrderStatus))
            )}
          </div>
        </div>

        {/* Column 3: Ready */}
        <div className="bg-[#F5F5F5] rounded-3xl p-4 border border-gray-200 flex flex-col min-h-[520px]">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
                3. Ready for Hand-off
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#202124] bg-white px-2 py-0.5 rounded-md border border-gray-200 tabular-nums">
              {ready.length}
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {ready.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center text-xs text-gray-500 p-4">
                <Check className="w-6 h-6 mb-1 text-emerald-600" />
                <span>Pickup counter empty</span>
              </div>
            ) : (
              ready.map(order => renderOrderCard(order, onUpdateOrderStatus))
            )}
          </div>
        </div>

        {/* Column 4: Delivered / Completed */}
        <div className="bg-[#F5F5F5] rounded-3xl p-4 border border-gray-200 flex flex-col min-h-[520px]">
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
              <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
                4. Completed
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#202124] bg-white px-2 py-0.5 rounded-md border border-gray-200 tabular-nums">
              {completed.length}
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {completed.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center text-xs text-gray-500 p-4">
                <span>No completed tickets today</span>
              </div>
            ) : (
              completed.slice(0, 10).map(order => renderOrderCard(order, onUpdateOrderStatus))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderOrderCard(
  order: Order,
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void
) {
  const elapsedMinutes = Math.max(0, Math.round((Date.now() - new Date(order.created_at).getTime()) / 60000));

  return (
    <div
      key={order.id}
      className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between gap-3"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-extrabold font-mono text-[#202124] tabular-nums">
            {order.order_number}
          </span>
          <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#E53935]" />
            <span>{elapsedMinutes}m ago</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          {order.order_type === 'delivery' ? (
            <span className="flex items-center gap-1 font-bold text-[#E53935]">
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 font-bold text-emerald-700">
              <Store className="w-3.5 h-3.5" />
              <span>Pickup</span>
            </span>
          )}
          <span className="text-gray-300">·</span>
          <span className="font-editorial font-bold text-[#202124] truncate">{order.customer_name}</span>
        </div>

        {order.order_type === 'delivery' && (
          <div className="text-[11px] text-gray-500 mb-2 line-clamp-1 flex items-start gap-1">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0 mt-0.5" />
            <span>{order.delivery_address}</span>
          </div>
        )}

        {/* Dishes list */}
        <div className="py-2.5 border-y border-gray-100 space-y-1.5 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start gap-2">
              <span className="text-[#202124] font-medium">
                <span className="font-bold text-[#E53935] font-mono tabular-nums">{item.quantity}x</span>{' '}
                {item.item_name}
              </span>
              <span className="font-mono text-gray-500 tabular-nums shrink-0">
                ${item.subtotal.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Gratuity Note if any */}
        {order.tip && order.tip > 0 ? (
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
            <HeartHandshake className="w-3 h-3" />
            <span>Kitchen Tip Included: ${order.tip.toFixed(2)}</span>
          </div>
        ) : null}

        {/* Special Instructions Note */}
        {order.special_instructions && (
          <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
            <span className="font-bold">Guest Note: </span>
            <span>"{order.special_instructions}"</span>
          </div>
        )}
      </div>

      {/* Footer Total & Action button */}
      <div className="pt-2.5 flex items-center justify-between border-t border-gray-100">
        <div>
          <span className="text-[10px] text-gray-500 uppercase font-bold font-mono">Total</span>
          <div className="text-sm font-extrabold font-mono text-[#202124] tabular-nums">
            ${order.total.toFixed(2)}
          </div>
        </div>

        {order.status === 'pending' && (
          <button
            onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span>Start Line</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {order.status === 'preparing' && (
          <button
            onClick={() => onUpdateOrderStatus(order.id, 'ready')}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span>Mark Ready</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        )}

        {order.status === 'ready' && (
          <button
            onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
            className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#202124] bg-[#F5F5F5] hover:bg-gray-200 border border-gray-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <span>Complete</span>
          </button>
        )}

        {order.status === 'delivered' && (
          <span className="text-xs font-bold text-gray-500">
            Delivered ✓
          </span>
        )}
      </div>
    </div>
  );
}
