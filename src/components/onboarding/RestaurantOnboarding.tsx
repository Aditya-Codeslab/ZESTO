import React, { useState } from 'react';
import { Restaurant, OwnerUser } from '../../types';
import { createRestaurant, getRestaurants } from '../../services/restaurantService';
import { Store, Globe, ArrowRight, ArrowLeft, Check, Sparkles, Building, Phone, Mail, Clock, DollarSign } from 'lucide-react';

interface RestaurantOnboardingProps {
  currentUser: OwnerUser;
  onComplete: (restaurant: Restaurant) => void;
  onCancel: () => void;
}

export const RestaurantOnboarding: React.FC<RestaurantOnboardingProps> = ({
  currentUser,
  onComplete,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(currentUser.email || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('3.50');
  const [minOrder, setMinOrder] = useState('15.00');
  const [prepTime, setPrepTime] = useState('25');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your restaurant name');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Please enter a valid unique URL slug');
      return;
    }
    if (!cuisine.trim()) {
      setErrorMsg('Please specify your cuisine type (e.g. Italian Trattoria, Artisanal Burgers)');
      return;
    }

    setLoading(true);
    try {
      const existing = await getRestaurants();
      if (existing.some(r => r.slug.toLowerCase() === slug.toLowerCase())) {
        throw new Error(`The URL slug "/restaurant/${slug}" is already taken. Please choose another.`);
      }

      const newRest = await createRestaurant({
        owner_id: currentUser.id,
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim() || `${name} offers freshly prepared culinary dishes with authentic ingredients.`,
        cuisine: cuisine.trim(),
        phone: phone.trim() || '+1 (555) 234-5678',
        email: email.trim(),
        address: address.trim() || '100 Main St',
        city: city.trim() || 'San Francisco',
        postal_code: postalCode.trim() || '94103',
        delivery_fee: parseFloat(deliveryFee) || 3.50,
        min_order: parseFloat(minOrder) || 15.00,
        prep_time_minutes: parseInt(prepTime) || 25,
        is_active: true
      });

      onComplete(newRest);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register restaurant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-8 bg-[#F5F5F5] border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-[#202124] text-[#E53935] flex items-center justify-center mb-4">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#202124]">
            Launch Your Bespoke Storefront
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Configure your brand identity and claim your dedicated ZESTO storefront address in seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Brand & Slug */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
              1. Brand & Direct URL
            </h2>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Restaurant Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Biryani House"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Unique Storefront Web Address <span className="text-rose-500">*</span>
              </label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#E53935]/20 focus-within:border-[#E53935]">
                <span className="inline-flex items-center px-3.5 bg-[#F5F5F5] text-xs text-gray-500 border-r border-gray-200 select-none font-mono font-medium">
                  zesto.app/restaurant/
                </span>
                <input
                  type="text"
                  required
                  placeholder="royal-biryani"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-3 py-2 text-sm focus:outline-none font-mono text-[#202124]"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Diners order directly via this dedicated address with 0% platform commissions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cuisine Specialty <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dum Biryani, Artisanal Pizza, Specialty Roastery"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Restaurant Story & Description
              </label>
              <textarea
                rows={2}
                placeholder="Slow-cooked hand-spiced traditional recipes, aromatic ingredients, and hearth-baked specialties."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>
          </div>

          {/* Section 2: Contact & Location */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
              2. Location & Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Customer Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 789-0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Order Notification Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="kitchen@restaurant.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="450 Spice Route Lane"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="San Francisco"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  placeholder="94103"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Operations */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
              3. Delivery & Kitchen Settings
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prep Time (min)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] tabular-nums font-mono text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Delivery Fee ($)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] tabular-nums font-mono text-[#202124]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Min Order ($)
                </label>
                <input
                  type="number"
                  step="1.00"
                  min="0"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] tabular-nums font-mono text-[#202124]"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-[#202124] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Generating Storefront...</span>
              ) : (
                <>
                  <span>Create Venue & Open KDS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
