import { Restaurant, Category, MenuItem, Order, OrderItem, OrderStatus, OwnerUser } from '../types';
import {
  getSupabaseClient,
  getLocalItems,
  setLocalItems,
  notifyOrderUpdated
} from '../lib/supabase';

// -------------------------------------------------------------
// Authentication Services
// -------------------------------------------------------------
export async function getCurrentOwner(): Promise<OwnerUser | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Owner'
      };
    }
  }

  // Fallback to local session
  const raw = localStorage.getItem('zesto_db_auth_user') || localStorage.getItem('tavola_db_auth_user');
  return raw ? JSON.parse(raw) : null;
}

export async function signInOwner(email: string): Promise<OwnerUser> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'password123' // or OTP
    });
    if (error) {
      console.warn('Supabase sign-in note:', error.message);
    }
  }

  // Find or create local owner
  const restaurants = getLocalItems<Restaurant>('restaurants');
  const matched = restaurants.find(r => r.email.toLowerCase() === email.toLowerCase());
  const ownerUser: OwnerUser = {
    id: matched ? matched.owner_id : 'owner-user-' + Math.random().toString(36).substring(2, 9),
    email: email.trim().toLowerCase(),
    full_name: matched ? matched.name + ' Manager' : email.split('@')[0]
  };

  localStorage.setItem('zesto_db_auth_user', JSON.stringify(ownerUser));
  return ownerUser;
}

export async function signUpOwner(name: string, email: string): Promise<OwnerUser> {
  const supabase = getSupabaseClient();
  let ownerId = 'owner-user-' + Math.random().toString(36).substring(2, 9);

  if (supabase) {
    const { data } = await supabase.auth.signUp({
      email,
      password: 'password123',
      options: { data: { full_name: name } }
    });
    if (data.user) {
      ownerId = data.user.id;
    }
  }

  const ownerUser: OwnerUser = {
    id: ownerId,
    email: email.trim().toLowerCase(),
    full_name: name.trim()
  };

  localStorage.setItem('zesto_db_auth_user', JSON.stringify(ownerUser));
  return ownerUser;
}

export async function signOutOwner(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('zesto_db_auth_user');
  localStorage.removeItem('tavola_db_auth_user');
}

// -------------------------------------------------------------
// Restaurant Services
// -------------------------------------------------------------
export async function getRestaurants(): Promise<Restaurant[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('restaurants').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  return getLocalItems<Restaurant>('restaurants');
}

export async function getRestaurantBySlug(slug: string): Promise<Restaurant | null> {
  const cleanSlug = slug.trim().toLowerCase();
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('restaurants').select('*').eq('slug', cleanSlug).single();
    if (!error && data) return data;
  }
  const all = getLocalItems<Restaurant>('restaurants');
  return all.find(r => r.slug.toLowerCase() === cleanSlug) || null;
}

export async function getOwnerRestaurants(ownerId: string): Promise<Restaurant[]> {
  const all = await getRestaurants();
  const matched = all.filter(r => r.owner_id === ownerId);
  return matched.length > 0 ? matched : [all[0]]; // fallback to first restaurant if demo
}

export async function createRestaurant(payload: Omit<Restaurant, 'id' | 'created_at'>): Promise<Restaurant> {
  const newRestaurant: Restaurant = {
    ...payload,
    id: 'rest-' + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString()
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('restaurants').insert([newRestaurant]);
  }

  const all = getLocalItems<Restaurant>('restaurants');
  all.push(newRestaurant);
  setLocalItems('restaurants', all);

  // Create default categories for the new restaurant
  const defaultCats: Category[] = [
    { id: 'cat-' + Math.random().toString(36).substring(2, 9), restaurant_id: newRestaurant.id, name: 'Chef Specials', sort_order: 1 },
    { id: 'cat-' + Math.random().toString(36).substring(2, 9), restaurant_id: newRestaurant.id, name: 'Main Courses', sort_order: 2 },
    { id: 'cat-' + Math.random().toString(36).substring(2, 9), restaurant_id: newRestaurant.id, name: 'Beverages', sort_order: 3 }
  ];
  const allCats = getLocalItems<Category>('categories');
  setLocalItems('categories', [...allCats, ...defaultCats]);

  return newRestaurant;
}

export async function updateRestaurant(id: string, updates: Partial<Restaurant>): Promise<Restaurant> {
  const all = getLocalItems<Restaurant>('restaurants');
  const index = all.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Restaurant not found');

  const updated: Restaurant = { ...all[index], ...updates };
  all[index] = updated;
  setLocalItems('restaurants', all);

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('restaurants').update(updates).eq('id', id);
  }

  return updated;
}

// -------------------------------------------------------------
// Category & Menu Services
// -------------------------------------------------------------
export async function getCategories(restaurantId: string): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('categories').select('*').eq('restaurant_id', restaurantId).order('sort_order', { ascending: true });
    if (!error && data && data.length > 0) return data;
  }
  const all = getLocalItems<Category>('categories');
  return all.filter(c => c.restaurant_id === restaurantId).sort((a, b) => a.sort_order - b.sort_order);
}

export async function createCategory(restaurantId: string, name: string): Promise<Category> {
  const all = getLocalItems<Category>('categories');
  const count = all.filter(c => c.restaurant_id === restaurantId).length;
  const newCat: Category = {
    id: 'cat-' + Math.random().toString(36).substring(2, 9),
    restaurant_id: restaurantId,
    name: name.trim(),
    sort_order: count + 1
  };

  all.push(newCat);
  setLocalItems('categories', all);

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('categories').insert([newCat]);
  }

  return newCat;
}

export async function deleteCategory(id: string): Promise<void> {
  const all = getLocalItems<Category>('categories');
  setLocalItems('categories', all.filter(c => c.id !== id));

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('categories').delete().eq('id', id);
  }
}

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId);
    if (!error && data && data.length > 0) return data;
  }
  const all = getLocalItems<MenuItem>('menu_items');
  return all.filter(m => m.restaurant_id === restaurantId);
}

export async function createMenuItem(item: Omit<MenuItem, 'id' | 'created_at'>): Promise<MenuItem> {
  const newItem: MenuItem = {
    ...item,
    id: 'item-' + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString()
  };

  const all = getLocalItems<MenuItem>('menu_items');
  all.push(newItem);
  setLocalItems('menu_items', all);

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('menu_items').insert([newItem]);
  }

  return newItem;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
  const all = getLocalItems<MenuItem>('menu_items');
  const index = all.findIndex(m => m.id === id);
  if (index === -1) throw new Error('Menu item not found');

  const updated: MenuItem = { ...all[index], ...updates };
  all[index] = updated;
  setLocalItems('menu_items', all);

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('menu_items').update(updates).eq('id', id);
  }

  return updated;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const all = getLocalItems<MenuItem>('menu_items');
  setLocalItems('menu_items', all.filter(m => m.id !== id));

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('menu_items').delete().eq('id', id);
  }
}

export async function toggleMenuItemAvailability(id: string): Promise<MenuItem> {
  const all = getLocalItems<MenuItem>('menu_items');
  const item = all.find(m => m.id === id);
  if (!item) throw new Error('Item not found');
  return updateMenuItem(id, { is_available: !item.is_available });
}

// -------------------------------------------------------------
// Order Services & Kitchen Management
// -------------------------------------------------------------
export async function getOrders(restaurantId: string): Promise<Order[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('orders').select('*').eq('restaurant_id', restaurantId).order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  const all = getLocalItems<Order>('orders');
  return all.filter(o => o.restaurant_id === restaurantId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getAllOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  }
  const all = getLocalItems<Order>('orders');
  return all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (!error && data) return data;
  }
  const all = getLocalItems<Order>('orders');
  return all.find(o => o.id === orderId) || null;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const all = getLocalItems<Order>('orders');
  const index = all.findIndex(o => o.id === orderId);
  if (index === -1) throw new Error('Order not found');

  const updated: Order = {
    ...all[index],
    status,
    updated_at: new Date().toISOString()
  };
  all[index] = updated;
  setLocalItems('orders', all);

  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('orders').update({ status, updated_at: updated.updated_at }).eq('id', orderId);
  }

  // Broadcast real-time event to customers and kitchen
  notifyOrderUpdated(updated);
  return updated;
}

export interface PlaceOrderInput {
  restaurantId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  orderType: 'delivery' | 'pickup';
  specialInstructions?: string;
  tip?: number;
  items: {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
  }[];
}

/**
 * Creates an order with strict server-style price calculation.
 * Client-submitted prices are discarded; item prices are fetched directly
 * from canonical database records to guarantee payment and total integrity.
 */
export async function createOrder(input: PlaceOrderInput): Promise<Order> {
  const restaurant = (await getRestaurants()).find(r => r.id === input.restaurantId);
  if (!restaurant) throw new Error('Restaurant not found');

  const menuItems = await getMenuItems(input.restaurantId);
  const menuMap = new Map(menuItems.map(m => [m.id, m]));

  const orderId = 'order-' + Math.random().toString(36).substring(2, 9);
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `ORD-${randNum}`;

  let subtotal = 0;
  const orderItems: OrderItem[] = [];

  for (const itemInput of input.items) {
    const itemDef = menuMap.get(itemInput.menuItemId);
    if (!itemDef) throw new Error(`Menu item ${itemInput.menuItemId} does not exist`);
    if (!itemDef.is_available) throw new Error(`Item "${itemDef.name}" is currently sold out`);

    const itemSubtotal = itemDef.price * itemInput.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      id: 'oi-' + Math.random().toString(36).substring(2, 9),
      order_id: orderId,
      menu_item_id: itemDef.id,
      item_name: itemDef.name,
      unit_price: itemDef.price,
      quantity: itemInput.quantity,
      subtotal: Number(itemSubtotal.toFixed(2)),
      special_instructions: itemInput.specialInstructions
    });
  }

  const tax = Number((subtotal * 0.08).toFixed(2));
  const deliveryFee = input.orderType === 'delivery' ? restaurant.delivery_fee : 0;
  const tipAmount = Number(input.tip || 0);
  const total = Number((subtotal + tax + deliveryFee + tipAmount).toFixed(2));

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    restaurant_id: input.restaurantId,
    customer_name: input.customerName.trim(),
    customer_phone: input.customerPhone.trim(),
    customer_email: input.customerEmail.trim(),
    delivery_address: input.orderType === 'delivery' ? input.deliveryAddress.trim() : 'Pickup in store',
    order_type: input.orderType,
    status: 'pending',
    items: orderItems,
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    delivery_fee: deliveryFee,
    tip: tipAmount,
    total,
    special_instructions: input.specialInstructions?.trim() || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Persist locally
  const allOrders = getLocalItems<Order>('orders');
  allOrders.unshift(newOrder);
  setLocalItems('orders', allOrders);

  // Sync to Supabase if configured
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.from('orders').insert([newOrder]);
    await supabase.from('order_items').insert(orderItems);
  }

  // Broadcast real-time notification
  notifyOrderUpdated(newOrder);

  return newOrder;
}
