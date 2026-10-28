import React, { useState } from 'react';
import { Restaurant } from '../../types';
import { updateRestaurant } from '../../services/restaurantService';
import { Store, Save, CheckCircle2, Database, ExternalLink, Sparkles, Copy, Check } from 'lucide-react';

interface SettingsTabProps {
  restaurant: Restaurant;
  onRestaurantUpdated: (restaurant: Restaurant) => void;
  onOpenConfig: () => void;
  isSupabaseConnected: boolean;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  restaurant,
  onRestaurantUpdated,
  onOpenConfig,
  isSupabaseConnected
}) => {
  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description);
  const [cuisine, setCuisine] = useState(restaurant.cuisine);
  const [phone, setPhone] = useState(restaurant.phone);
  const [email, setEmail] = useState(restaurant.email);
  const [address, setAddress] = useState(restaurant.address);
  const [city, setCity] = useState(restaurant.city);
  const [postalCode, setPostalCode] = useState(restaurant.postal_code);
  const [deliveryFee, setDeliveryFee] = useState(restaurant.delivery_fee.toString());
  const [minOrder, setMinOrder] = useState(restaurant.min_order.toString());
  const [prepTime, setPrepTime] = useState(restaurant.prep_time_minutes.toString());
  const [isActive, setIsActive] = useState(restaurant.is_active);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic public storefront link for teacher / evaluator demonstration
  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
  const publicStorefrontUrl = `${origin}/restaurant/${restaurant.slug || 'forno-fuoco'}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicStorefrontUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    try {
      const updated = await updateRestaurant(restaurant.id, {
        name: name.trim(),
        description: description.trim(),
        cuisine: cuisine.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        postal_code: postalCode.trim(),
        delivery_fee: parseFloat(deliveryFee) || 3.50,
        min_order: parseFloat(minOrder) || 15.00,
        prep_time_minutes: parseInt(prepTime) || 25,
        is_active: isActive
      });

      onRestaurantUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update restaurant settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-[#202124]">
          Restaurant Settings & Dispatch Operations
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your digital storefront profile, delivery fees, kitchen prep expectations, and backend storage.
        </p>
      </div>

      {/* Teacher Demo Quick Link Banner Card */}
      <div className="bg-[#F5F5F5] rounded-3xl p-6 border-2 border-[#E53935]/30 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-[#E53935] font-mono">
                <Sparkles className="w-3 h-3" />
                Teacher Demo Quick Link
              </span>
              <span className="text-xs text-gray-500 font-medium">· Evaluator Fast Track</span>
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#202124]">
              Live Public Customer Storefront
            </h3>
            <p className="text-xs text-gray-600 max-w-xl">
              Instant one-click access for reviewers to test menu browsing, cart management, checkout, and live order transmission to this kitchen display in a separate window.
            </p>
          </div>

          <a
            href={publicStorefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-md hover:shadow-lg"
          >
            <span>Launch Storefront</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Read-only URL box with copy button */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex rounded-xl border border-gray-300 bg-white overflow-hidden shadow-2xs">
            <span className="inline-flex items-center px-3 bg-[#F5F5F5] text-xs text-gray-500 border-r border-gray-200 select-none font-mono font-medium">
              Public URL:
            </span>
            <input
              type="text"
              readOnly
              value={publicStorefrontUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="flex-1 px-3 py-2 text-xs font-mono text-[#202124] bg-white focus:outline-none select-all"
            />
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-gray-500" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 text-xs font-semibold text-emerald-800 bg-[#F5F5F5] border border-emerald-300 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Restaurant settings saved and published to your storefront!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl">
          {errorMsg}
        </div>
      )}

      {/* Supabase Integration Card */}
      <div className="bg-[#F5F5F5] rounded-3xl p-6 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#202124] text-white flex items-center justify-center shrink-0">
            <Database className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-editorial text-base font-bold text-[#202124]">
              Database Backend: {isSupabaseConnected ? 'Live Supabase Cloud' : 'Local Storage Fallback'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isSupabaseConnected
                ? 'Your kitchen records and customer orders are securely synchronized with Supabase PostgreSQL.'
                : 'Operating on high-performance local storage. Connect your live Supabase credentials anytime.'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenConfig}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#202124] bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer shrink-0 shadow-2xs"
        >
          Configure Supabase
        </button>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-gray-200 shadow-xs divide-y divide-gray-100">
        {/* Section 1: Storefront Profile */}
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
            1. Restaurant Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cuisine Genre</label>
              <input
                type="text"
                required
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Storefront Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Storefront Direct URL Path (Read-Only)
            </label>
            <div className="flex rounded-xl border border-gray-200 bg-[#F5F5F5] px-3.5 py-2 text-xs font-mono text-gray-700 select-all">
              https://zesto.app/restaurant/{restaurant.slug}
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Address */}
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
            2. Contact & Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Notification Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] text-[#202124]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Kitchen & Delivery Settings */}
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="text-xs font-bold text-[#202124] uppercase tracking-wider font-mono">
            3. Kitchen & Delivery Settings
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Fee ($)</label>
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Minimum Order ($)</label>
              <input
                type="number"
                step="1.00"
                min="0"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] tabular-nums font-mono text-[#202124]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Target Prep Time (min)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] tabular-nums font-mono text-[#202124]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-[#E53935] focus:ring-[#E53935]/20"
              />
              <span className="text-xs font-bold text-[#202124]">
                Online Ordering Active (Diners can submit orders to kitchen)
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:p-8 bg-[#F5F5F5] flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#E53935] hover:bg-[#D32F2F] rounded-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <Save className="w-4 h-4 text-white" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
