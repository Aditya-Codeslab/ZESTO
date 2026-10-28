import React from 'react';
import { Restaurant, Order, OrderStatus } from '../../types';
import { DollarSign, ShoppingBag, Clock, TrendingUp, ArrowRight, AlertCircle, HeartHandshake } from 'lucide-react';

interface OverviewTabProps {
  restaurant: Restaurant;
  orders: Order[];
  onNavigateTab: (tab: 'menu' | 'orders' | 'settings') => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  restaurant,
  orders,
  onNavigateTab,
  onUpdateOrderStatus
}) => {
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const relevantOrders = todayOrders.length > 0 ? todayOrders : orders;

  const totalRevenue = relevantOrders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const avgTicket = relevantOrders.length > 0 ? totalRevenue / relevantOrders.length : 0;

  return (
    <div className="space-y-8">
      {/* Pending Urgent Orders Banner if any */}
      {pendingOrders.length > 0 && (
        <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#E53935] text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-base font-bold text-[#202124]">
                {pendingOrders.length} New Incoming {pendingOrders.length === 1 ? 'Order' : 'Orders'} Awaiting Kitchen Confirmation
              </h3>
              <p className="text-xs text-red-700">
                Diner is waiting for confirmation. Open the Kitchen Display to begin food preparation.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#202124] hover:bg-black rounded-xl transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            Open Kitchen Board
          </button>
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-[#F5F5F5] rounded-3xl p-6 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2 font-mono text-[11px] uppercase font-bold">
            <span>Gross Sales</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-extrabold text-[#202124] tabular-nums font-mono">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-gray-500 font-medium">
            100% direct revenue retained
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#F5F5F5] rounded-3xl p-6 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2 font-mono text-[11px] uppercase font-bold">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#E53935]" />
          </div>
          <div className="text-3xl font-extrabold text-[#202124] tabular-nums font-mono">
            {orders.length}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {activeOrders.length} active in pipeline
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#F5F5F5] rounded-3xl p-6 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2 font-mono text-[11px] uppercase font-bold">
            <span>Average Ticket</span>
            <TrendingUp className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-3xl font-extrabold text-[#202124] tabular-nums font-mono">
            ${avgTicket.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Direct guest basket average
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#F5F5F5] rounded-3xl p-6 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2 font-mono text-[11px] uppercase font-bold">
            <span>Target Line Prep</span>
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-3xl font-extrabold text-[#202124] tabular-nums font-mono">
            {restaurant.prep_time_minutes} min
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Configured in operations
          </div>
        </div>
      </div>

      {/* Recent Orders High-Density Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
          <div>
            <h2 className="font-editorial text-lg font-bold text-[#202124]">Recent Dining Orders</h2>
            <p className="text-xs text-gray-500">Live order stream & instant status transitions</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#E53935] hover:text-[#D32F2F] flex items-center gap-1 cursor-pointer"
          >
            <span>View Kitchen Board</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#F5F5F5] text-[11px] font-bold text-gray-500 uppercase tracking-wider font-mono">
                <th className="py-3.5 px-5">Ticket #</th>
                <th className="py-3.5 px-5">Guest</th>
                <th className="py-3.5 px-5">Type</th>
                <th className="py-3.5 px-5">Dishes Ordered</th>
                <th className="py-3.5 px-5 text-right">Total</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No orders placed yet. Open your public storefront to test your first direct dining ticket!
                  </td>
                </tr>
              ) : (
                orders.slice(0, 8).map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-[#F5F5F5]/60 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-[#202124]">
                        {order.order_number}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-editorial font-bold text-[#202124] text-sm">{order.customer_name}</div>
                        <div className="text-[11px] text-gray-500 font-mono">{order.customer_phone}</div>
                      </td>
                      <td className="py-4 px-5 capitalize">
                        <span className="text-gray-600 font-semibold">
                          {order.order_type}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-600 max-w-xs truncate">
                        {order.items.map(i => `${i.quantity}x ${i.item_name}`).join(', ')}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-extrabold text-[#202124] tabular-nums">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center text-[11px] font-bold capitalize ${
                          order.status === 'pending'
                            ? 'text-[#E53935]'
                            : order.status === 'preparing'
                            ? 'text-blue-700'
                            : order.status === 'ready'
                            ? 'text-emerald-700'
                            : order.status === 'delivered'
                            ? 'text-gray-500'
                            : 'text-rose-700'
                        }`}>
                          {order.status === 'pending' && '⏳ '}
                          {order.status === 'preparing' && '🔥 '}
                          {order.status === 'ready' && '✅ '}
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'preparing')}
                            className="px-3 py-1.5 text-[11px] font-bold text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-lg transition-colors cursor-pointer"
                          >
                            Accept & Prep
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                            className="px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                            className="px-3 py-1.5 text-[11px] font-bold text-[#202124] bg-[#F5F5F5] hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Complete
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span className="text-[11px] text-gray-400">Delivered ✓</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
