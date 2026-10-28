/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Restaurant, Order, OwnerUser, OrderStatus, Category, MenuItem } from './types';
import {
  initializeLocalStore,
  getStoredSupabaseConfig,
  subscribeToOrders
} from './lib/supabase';
import {
  getRestaurants,
  getRestaurantBySlug,
  getCurrentOwner,
  signOutOwner,
  getOrders,
  getCategories,
  getMenuItems,
  updateOrderStatus
} from './services/restaurantService';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { RestaurantStorefront } from './components/storefront/RestaurantStorefront';
import { RestaurantDirectory } from './components/storefront/RestaurantDirectory';
import { OrderTrackingView } from './components/storefront/OrderTrackingView';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { RestaurantOnboarding } from './components/onboarding/RestaurantOnboarding';
import { SupabaseConfigModal } from './components/common/SupabaseConfigModal';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { MenuManagementTab } from './components/dashboard/MenuManagementTab';
import { OrdersTab } from './components/dashboard/OrdersTab';
import { SettingsTab } from './components/dashboard/SettingsTab';

export default function App() {
  // App navigation state
  const [currentView, setCurrentView] = useState<'landing' | 'storefront' | 'order-tracking' | 'dashboard' | 'onboarding' | 'restaurants-list' | 'customer-orders'>('landing');
  const [storefrontSlug, setStorefrontSlug] = useState<string>('forno-fuoco');
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [reorderOrder, setReorderOrder] = useState<Order | null>(null);

  // Dashboard tab state
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'menu' | 'orders' | 'settings'>('overview');

  // Domain data
  const [currentUser, setCurrentUser] = useState<OwnerUser | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initial boot: initialize storage, check Supabase config, load restaurants & owner
  useEffect(() => {
    initializeLocalStore();

    const config = getStoredSupabaseConfig();
    setIsSupabaseConnected(config.isConfigured);

    async function boot() {
      const [allRestaurants, owner] = await Promise.all([
        getRestaurants(),
        getCurrentOwner()
      ]);
      setRestaurants(allRestaurants);
      setCurrentUser(owner);

      if (allRestaurants.length > 0) {
        setActiveRestaurant(allRestaurants[0]);
      }

      // Check URL path or hash for deep linking (e.g. /restaurant/forno-fuoco or #/restaurant/forno-fuoco)
      const path = window.location.pathname;
      const hash = window.location.hash;

      if (path.startsWith('/restaurant/') || hash.startsWith('#/restaurant/')) {
        const slug = (path.startsWith('/restaurant/') ? path.replace('/restaurant/', '') : hash.replace('#/restaurant/', '')).split('/')[0];
        if (slug) {
          setStorefrontSlug(slug);
          setCurrentView('storefront');
        }
      } else if (path.startsWith('/order/') || hash.startsWith('#/order/')) {
        const oid = (path.startsWith('/order/') ? path.replace('/order/', '') : hash.replace('#/order/', '')).split('/')[0];
        if (oid) {
          setTrackingOrderId(oid);
          setCurrentView('order-tracking');
        }
      } else if (path.startsWith('/customer') || hash.startsWith('#/customer')) {
        setCurrentView('customer-orders');
      }
    }

    boot();
  }, []);

  // 2. Load active restaurant details (categories, items, orders)
  const refreshRestaurantData = async () => {
    if (!activeRestaurant) return;
    const [cats, items, ords] = await Promise.all([
      getCategories(activeRestaurant.id),
      getMenuItems(activeRestaurant.id),
      getOrders(activeRestaurant.id)
    ]);
    setCategories(cats);
    setMenuItems(items);
    setOrders(ords);
  };

  useEffect(() => {
    refreshRestaurantData();
  }, [activeRestaurant?.id]);

  // 3. Real-time order synchronization
  useEffect(() => {
    const unsubscribe = subscribeToOrders((updatedOrder) => {
      // If the order belongs to currently active restaurant, update the order list
      if (activeRestaurant && updatedOrder.restaurant_id === activeRestaurant.id) {
        setOrders(prev => {
          const index = prev.findIndex(o => o.id === updatedOrder.id);
          if (index >= 0) {
            const next = [...prev];
            next[index] = updatedOrder;
            return next;
          }
          return [updatedOrder, ...prev];
        });

        // Show toast alert to kitchen if new incoming order
        if (updatedOrder.status === 'pending') {
          showToast(`🔔 New Order received: ${updatedOrder.order_number} ($${updatedOrder.total.toFixed(2)})`);
        }
      }
    });

    return () => unsubscribe();
  }, [activeRestaurant?.id]);

  // Navigation router handler
  const handleNavigate = (view: string, param?: string) => {
    if (view === 'storefront') {
      const slug = param || (activeRestaurant ? activeRestaurant.slug : 'forno-fuoco');
      setStorefrontSlug(slug);
      window.history.pushState(null, '', `/restaurant/${slug}`);
      setCurrentView('storefront');
    } else if (view === 'order-tracking' && param) {
      setTrackingOrderId(param);
      window.history.pushState(null, '', `/order/${param}`);
      setCurrentView('order-tracking');
    } else if (view === 'customer-orders') {
      window.history.pushState(null, '', '/customer/orders');
      setCurrentView('customer-orders');
    } else if (view === 'dashboard') {
      if (!currentUser) {
        setAuthMode('signin');
        setIsAuthModalOpen(true);
        return;
      }
      window.history.pushState(null, '', '/dashboard');
      setCurrentView('dashboard');
    } else if (view === 'onboarding') {
      if (!currentUser) {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
        return;
      }
      setCurrentView('onboarding');
    } else if (view === 'restaurants-list') {
      window.history.pushState(null, '', '/restaurants');
      setCurrentView('restaurants-list');
    } else {
      window.history.pushState(null, '', '/');
      setCurrentView('landing');
    }
  };

  const handleReorder = (order: Order) => {
    const rest = restaurants.find(r => r.id === order.restaurant_id) ||
                 restaurants.find(r => order.restaurant_id.includes(r.slug)) ||
                 restaurants[0];
    const slug = rest ? rest.slug : 'forno-fuoco';
    setReorderOrder(order);
    setStorefrontSlug(slug);
    window.history.pushState(null, '', `/restaurant/${slug}`);
    setCurrentView('storefront');
    showToast(`Reordering from ${rest?.name || 'Restaurant'}. Tray populated!`);
  };

  const handleSignOut = async () => {
    await signOutOwner();
    setCurrentUser(null);
    setCurrentView('landing');
    showToast('Signed out of restaurant dashboard');
  };

  const handleAuthSuccess = (user: OwnerUser) => {
    setCurrentUser(user);
    showToast(`Welcome back, ${user.full_name}!`);
    setCurrentView('dashboard');
  };

  const handleOnboardingComplete = (newRest: Restaurant) => {
    setRestaurants(prev => [newRest, ...prev]);
    setActiveRestaurant(newRest);
    showToast(`🎉 Restaurant "${newRest.name}" registered successfully!`);
    setCurrentView('dashboard');
    setDashboardTab('menu');
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Order ${updated.order_number} marked as ${status}`);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Get active storefront restaurant
  const currentStorefrontRestaurant = restaurants.find(
    r => r.slug.toLowerCase() === storefrontSlug.toLowerCase()
  ) || activeRestaurant || restaurants[0];

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#202124] flex flex-col font-sans">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce bg-[#202124] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#E53935]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      {currentView !== 'dashboard' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onOpenAuth={() => { setAuthMode('signin'); setIsAuthModalOpen(true); }}
          onOpenConfig={() => setIsConfigModalOpen(true)}
          isSupabaseConnected={isSupabaseConnected}
          storefrontSlug={storefrontSlug || (activeRestaurant ? activeRestaurant.slug : 'forno-fuoco')}
        />
      )}

      {/* View Routing */}
      {currentView === 'landing' && (
        <LandingPage
          restaurants={restaurants}
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'signup');
            setIsAuthModalOpen(true);
          }}
          onNavigateToStorefront={(slug) => handleNavigate('storefront', slug)}
          onNavigateToDashboard={() => handleNavigate('dashboard')}
          isLoggedIn={!!currentUser}
        />
      )}

      {currentView === 'storefront' && currentStorefrontRestaurant && (
        <RestaurantStorefront
          restaurant={currentStorefrontRestaurant}
          reorderOrder={reorderOrder}
          onOrderPlaced={(placedOrder) => {
            setReorderOrder(null);
            showToast(`Order ${placedOrder.order_number} received by kitchen!`);
            handleNavigate('order-tracking', placedOrder.id);
          }}
          onNavigateHome={() => {
            setReorderOrder(null);
            handleNavigate('landing');
          }}
        />
      )}

      {currentView === 'order-tracking' && (
        <OrderTrackingView
          orderId={trackingOrderId}
          onBackToMenu={() => handleNavigate('storefront', storefrontSlug)}
          onNavigateToOrders={() => handleNavigate('customer-orders')}
        />
      )}

      {currentView === 'customer-orders' && (
        <CustomerDashboard
          onNavigateToStorefront={(slug) => {
            setReorderOrder(null);
            handleNavigate('storefront', slug);
          }}
          onNavigateToTracking={(oid) => handleNavigate('order-tracking', oid)}
          onNavigateToDashboard={() => handleNavigate('dashboard')}
          onReorder={handleReorder}
          onBackToHome={() => handleNavigate('landing')}
        />
      )}

      {currentView === 'restaurants-list' && (
        <RestaurantDirectory
          restaurants={restaurants}
          onSelectRestaurant={(slug) => {
            setReorderOrder(null);
            handleNavigate('storefront', slug);
          }}
          onBackToLanding={() => handleNavigate('landing')}
        />
      )}

      {currentView === 'onboarding' && currentUser && (
        <RestaurantOnboarding
          currentUser={currentUser}
          onComplete={handleOnboardingComplete}
          onCancel={() => handleNavigate('dashboard')}
        />
      )}

      {currentView === 'dashboard' && activeRestaurant && currentUser && (
        <DashboardLayout
          restaurant={activeRestaurant}
          ownerRestaurants={restaurants}
          currentRestaurant={activeRestaurant}
          onSelectRestaurant={(r) => setActiveRestaurant(r)}
          onNewRestaurant={() => handleNavigate('onboarding')}
          currentUser={currentUser}
          activeTab={dashboardTab}
          onSelectTab={setDashboardTab}
          pendingOrdersCount={pendingOrdersCount}
          onViewStorefront={(slug) => handleNavigate('storefront', slug)}
          onNavigateToCustomerDashboard={() => handleNavigate('customer-orders')}
          onSignOut={handleSignOut}
          onOpenConfig={() => setIsConfigModalOpen(true)}
          isSupabaseConnected={isSupabaseConnected}
        >
          {dashboardTab === 'overview' && (
            <OverviewTab
              restaurant={activeRestaurant}
              orders={orders}
              onNavigateTab={(tab) => setDashboardTab(tab)}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {dashboardTab === 'menu' && (
            <MenuManagementTab
              restaurant={activeRestaurant}
              categories={categories}
              menuItems={menuItems}
              onRefreshData={refreshRestaurantData}
            />
          )}

          {dashboardTab === 'orders' && (
            <OrdersTab
              restaurant={activeRestaurant}
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onRefreshOrders={refreshRestaurantData}
            />
          )}

          {dashboardTab === 'settings' && (
            <SettingsTab
              restaurant={activeRestaurant}
              onRestaurantUpdated={(updated) => {
                setActiveRestaurant(updated);
                setRestaurants(prev => prev.map(r => r.id === updated.id ? updated : r));
              }}
              onOpenConfig={() => setIsConfigModalOpen(true)}
              isSupabaseConnected={isSupabaseConnected}
            />
          )}
        </DashboardLayout>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* Supabase Database Config Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onConfigSaved={() => {
          const config = getStoredSupabaseConfig();
          setIsSupabaseConnected(config.isConfigured);
          showToast(config.isConfigured ? 'Connected to Supabase PostgreSQL!' : 'Saved configuration');
        }}
      />
    </div>
  );
}
