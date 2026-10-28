import React, { useState } from 'react';
import { CartItem, Restaurant, MenuItem } from '../../types';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, HeartHandshake } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  restaurant: Restaurant | null;
  onUpdateQuantity: (item: MenuItem, delta: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: (tipAmount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  restaurant,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout
}) => {
  const [tipRate, setTipRate] = useState<number | 'custom'>(0.18);
  const [customTip, setCustomTip] = useState<string>('5.00');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const deliveryFee = restaurant ? restaurant.delivery_fee : 3.50;

  // Calculate tip
  let tipAmount = 0;
  if (typeof tipRate === 'number') {
    tipAmount = Number((subtotal * tipRate).toFixed(2));
  } else {
    tipAmount = Math.max(0, parseFloat(customTip) || 0);
  }

  const total = Number((subtotal + tax + deliveryFee + tipAmount).toFixed(2));
  const minOrder = restaurant ? restaurant.min_order : 15.00;
  const meetsMinOrder = subtotal >= minOrder;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#202124]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-gray-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#202124] text-[#E53935] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-editorial text-lg font-bold text-[#202124]">Your Order Tray</h2>
                {restaurant && (
                  <p className="text-xs text-gray-500">{restaurant.name}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-[#202124] rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-[#F5F5F5] flex items-center justify-center text-gray-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-lg font-bold text-[#202124]">Your tray is empty</h3>
                <p className="mt-1 text-xs text-gray-500 max-w-xs">
                  Browse delicious courses, pizzas, or pastries from the menu and add them to your order.
                </p>
              </div>
            ) : (
              items.map((cartItem) => {
                const lineTotal = cartItem.menuItem.price * cartItem.quantity;
                return (
                  <div key={cartItem.menuItem.id} className="py-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-editorial text-sm font-bold text-[#202124] truncate">
                        {cartItem.menuItem.name}
                      </h4>
                      <div className="mt-0.5 text-xs text-gray-500 font-mono tabular-nums">
                        ${cartItem.menuItem.price.toFixed(2)} each
                      </div>
                      {cartItem.special_instructions && (
                        <p className="mt-1 text-[11px] text-[#E53935] italic bg-red-50 px-2 py-0.5 rounded-md">
                          "{cartItem.special_instructions}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-sm font-extrabold text-[#202124] tabular-nums font-mono">
                        ${lineTotal.toFixed(2)}
                      </span>
                      <div className="flex items-center bg-[#F5F5F5] rounded-xl p-0.5 border border-gray-200">
                        <button
                          onClick={() => onUpdateQuantity(cartItem.menuItem, -1)}
                          className="w-6 h-6 flex items-center justify-center text-[#202124] hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold tabular-nums font-mono text-[#202124]">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(cartItem.menuItem, 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#202124] hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer: Tip Selector & Bill Breakdown */}
          {items.length > 0 && (
            <div className="px-6 py-5 bg-[#F5F5F5] border-t border-gray-200 space-y-4 shadow-lg">
              {/* Tip Selection Module */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-[#202124]">
                  <span className="flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-[#E53935]" />
                    <span>Kitchen & Driver Gratuity</span>
                  </span>
                  <span className="font-mono tabular-nums text-[#202124] font-bold">
                    ${tipAmount.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 text-xs">
                  {[
                    { label: '15%', value: 0.15 },
                    { label: '18%', value: 0.18 },
                    { label: '20%', value: 0.20 },
                    { label: 'None', value: 0 },
                    { label: 'Custom', value: 'custom' }
                  ].map((btn) => {
                    const active = tipRate === btn.value;
                    return (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => setTipRate(btn.value as any)}
                        className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer text-center text-[11px] ${
                          active
                            ? 'bg-[#E53935] text-white shadow-xs'
                            : 'bg-white text-[#202124] border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>

                {tipRate === 'custom' && (
                  <div className="pt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-600">Custom Tip ($):</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                      className="w-24 px-2 py-1 text-xs border border-gray-300 rounded-md font-mono tabular-nums bg-white focus:outline-none focus:ring-1 focus:ring-[#E53935]"
                    />
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5f6368] pt-2 border-t border-gray-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-mono text-[#202124] font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="tabular-nums font-mono text-[#202124] font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="tabular-nums font-mono text-[#202124] font-semibold">${deliveryFee.toFixed(2)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Gratuity</span>
                    <span className="tabular-nums font-mono font-semibold">${tipAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2.5 border-t border-gray-200 flex justify-between text-base font-extrabold text-[#202124]">
                  <span className="font-editorial text-lg">Total</span>
                  <span className="tabular-nums font-mono text-[#E53935]">${total.toFixed(2)}</span>
                </div>
              </div>

              {!meetsMinOrder && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  Minimum order is ${minOrder.toFixed(2)}. Add ${(minOrder - subtotal).toFixed(2)} more to place order.
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClearCart}
                  className="p-2.5 text-gray-500 hover:text-[#202124] hover:bg-white rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                  title="Empty tray"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={!meetsMinOrder}
                  onClick={() => {
                    onClose();
                    onProceedToCheckout(tipAmount);
                  }}
                  className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                    meetsMinOrder
                      ? 'bg-[#E53935] hover:bg-[#D32F2F] cursor-pointer hover:shadow-lg'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
