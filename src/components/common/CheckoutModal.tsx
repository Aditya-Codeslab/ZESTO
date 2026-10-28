import React, { useState } from 'react';
import { CartItem, Restaurant, Order } from '../../types';
import { createOrder } from '../../services/restaurantService';
import { X, ShieldCheck, Bike, Store, CreditCard, Banknote } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  restaurant: Restaurant;
  initialTip?: number;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  restaurant,
  initialTip = 0,
  onOrderSuccess
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [tip, setTip] = useState(initialTip);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, curr) => acc + curr.menuItem.price * curr.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const deliveryFee = orderType === 'delivery' ? restaurant.delivery_fee : 0;
  const total = Number((subtotal + tax + deliveryFee + tip).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter a phone number so the kitchen can reach you');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      setErrorMsg('Please enter a delivery address');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({
        restaurantId: restaurant.id,
        customerName: name,
        customerPhone: phone,
        customerEmail: email || `${name.toLowerCase().replace(/\s+/g, '.')}@guest.com`,
        deliveryAddress: address,
        orderType,
        specialInstructions: notes,
        tip,
        items: items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          specialInstructions: item.special_instructions
        }))
      });

      onOrderSuccess(order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between bg-[#F5F5F5]">
          <div>
            <h2 className="font-editorial text-xl font-bold text-[#202124]">Complete Your Order</h2>
            <p className="text-xs text-gray-500">Direct to {restaurant.name} with zero aggregator markups</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-[#202124] rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Delivery or Pickup Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#202124] mb-2">
              Dispatch Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-3.5 px-4 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'border-[#E53935] bg-red-50 text-[#E53935] ring-2 ring-[#E53935]/20'
                    : 'border-gray-200 bg-[#F5F5F5] text-[#202124] hover:border-gray-300'
                }`}
              >
                <Bike className="w-4 h-4 text-[#E53935]" />
                <span>Delivery (${restaurant.delivery_fee.toFixed(2)})</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-3.5 px-4 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'border-[#E53935] bg-red-50 text-[#E53935] ring-2 ring-[#E53935]/20'
                    : 'border-gray-200 bg-[#F5F5F5] text-[#202124] hover:border-gray-300'
                }`}
              >
                <Store className="w-4 h-4 text-[#E53935]" />
                <span>Store Pickup (Free)</span>
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              1. Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marco Rossi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F5F5F5] border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F5F5F5] border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email for Receipt (optional)
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#F5F5F5] border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
            </div>
          </div>

          {/* Delivery Location */}
          {orderType === 'delivery' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
                2. Delivery Address
              </h3>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Street Address, Apt / Suite <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#F5F5F5] border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
                />
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Kitchen or Courier Notes (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Buzz #401, extra parmigiano, sauce on the side"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#F5F5F5] border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
            />
          </div>

          {/* Payment Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#202124] uppercase tracking-wider">
              3. Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs font-bold text-left transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#E53935] bg-red-50 text-[#202124] ring-2 ring-[#E53935]/20'
                    : 'border-gray-200 bg-[#F5F5F5] text-[#202124] hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-5 h-5 text-[#E53935] shrink-0" />
                <div>
                  <div>Card on Arrival</div>
                  <div className="text-[10px] text-gray-500 font-normal">Contactless terminal</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 text-xs font-bold text-left transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-[#E53935] bg-red-50 text-[#202124] ring-2 ring-[#E53935]/20'
                    : 'border-gray-200 bg-[#F5F5F5] text-[#202124] hover:border-gray-300'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div>Cash on Hand</div>
                  <div className="text-[10px] text-gray-500 font-normal">Pay exact or request change</div>
                </div>
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-[#F5F5F5] rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
            <div className="font-editorial text-sm font-bold text-[#202124] pb-1.5 border-b border-gray-200">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="tabular-nums font-mono text-[#202124]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Sales Tax (8%)</span>
              <span className="tabular-nums font-mono text-[#202124]">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Store Pickup'}</span>
              <span className="tabular-nums font-mono text-[#202124]">${deliveryFee.toFixed(2)}</span>
            </div>
            {tip > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Gratuity</span>
                <span className="tabular-nums font-mono">${tip.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2.5 border-t border-gray-200 flex justify-between text-base font-extrabold text-[#202124]">
              <span className="font-editorial">Total Due</span>
              <span className="tabular-nums font-mono text-[#E53935]">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>ZESTO Direct Security: 0% marketplace commission. Sent straight to kitchen.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-[#202124] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Transmitting to Kitchen...</span>
              ) : (
                <span>Confirm & Place Order (${total.toFixed(2)})</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
