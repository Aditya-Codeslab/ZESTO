import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { SupabaseConfig, Restaurant, Category, MenuItem, Order, OrderStatus } from '../types';
import { SEED_RESTAURANTS, SEED_CATEGORIES, SEED_MENU_ITEMS, SEED_ORDERS } from './seedData';

const CONFIG_STORAGE_KEY = 'zesto_supabase_config';
const LOCAL_DB_PREFIX = 'zesto_db_';

// Initial check for Supabase config
export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, isConfigured: true };
  }

  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY) || localStorage.getItem('tavola_supabase_config');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url, anonKey: parsed.anonKey, isConfigured: true };
      }
    }
  } catch (e) {
    console.warn('Could not read Supabase config from localStorage', e);
  }

  return { url: '', anonKey: '', isConfigured: false };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() }));
  } catch (e) {
    console.error('Failed to save Supabase config', e);
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config.isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

// Event bus for simulated or bridged real-time updates
type OrderUpdateListener = (order: Order) => void;
const orderListeners: Set<OrderUpdateListener> = new Set();

export function subscribeToOrders(listener: OrderUpdateListener): () => void {
  orderListeners.add(listener);
  return () => {
    orderListeners.delete(listener);
  };
}

export function notifyOrderUpdated(order: Order): void {
  orderListeners.forEach(listener => {
    try {
      listener(order);
    } catch (err) {
      console.error('Order listener error:', err);
    }
  });
}

// Local storage seed initialization
export function initializeLocalStore(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(`${LOCAL_DB_PREFIX}restaurants`)) {
    localStorage.setItem(`${LOCAL_DB_PREFIX}restaurants`, JSON.stringify(SEED_RESTAURANTS));
  }
  if (!localStorage.getItem(`${LOCAL_DB_PREFIX}categories`)) {
    localStorage.setItem(`${LOCAL_DB_PREFIX}categories`, JSON.stringify(SEED_CATEGORIES));
  }
  if (!localStorage.getItem(`${LOCAL_DB_PREFIX}menu_items`)) {
    localStorage.setItem(`${LOCAL_DB_PREFIX}menu_items`, JSON.stringify(SEED_MENU_ITEMS));
  }
  if (!localStorage.getItem(`${LOCAL_DB_PREFIX}orders`)) {
    localStorage.setItem(`${LOCAL_DB_PREFIX}orders`, JSON.stringify(SEED_ORDERS));
  }
  if (!localStorage.getItem(`${LOCAL_DB_PREFIX}auth_user`)) {
    // Default logged in demo owner for convenience
    localStorage.setItem(`${LOCAL_DB_PREFIX}auth_user`, JSON.stringify({
      id: 'owner-seed-001',
      email: 'ciao@fornofuoco.com',
      full_name: 'Chef Marco Rossi'
    }));
  }
}

// Generic local database helpers
export function getLocalItems<T>(collection: string): T[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_DB_PREFIX}${collection}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(`Failed to parse local ${collection}`, e);
    return [];
  }
}

export function setLocalItems<T>(collection: string, items: T[]): void {
  try {
    localStorage.setItem(`${LOCAL_DB_PREFIX}${collection}`, JSON.stringify(items));
  } catch (e) {
    console.error(`Failed to write local ${collection}`, e);
  }
}

// Supabase PostgreSQL Schema & RLS SQL Definition
export const SUPABASE_SQL_SCHEMA = `-- PostgreSQL Schema & Row Level Security (RLS) for ZESTO Universal Restaurant Ordering Platform

-- 1. Restaurants Table
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  description text,
  cuisine text not null,
  logo_url text,
  banner_url text,
  phone text not null,
  email text not null,
  address text not null,
  city text not null,
  postal_code text not null,
  delivery_fee numeric(10,2) default 3.50 not null,
  min_order numeric(10,2) default 10.00 not null,
  prep_time_minutes integer default 25 not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  name text not null,
  sort_order integer default 0 not null
);

-- 3. Menu Items Table
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text,
  is_available boolean default true not null,
  dietary_tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Orders Table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  delivery_address text not null,
  order_type text check (order_type in ('delivery', 'pickup')) not null,
  status text check (status in ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')) default 'pending' not null,
  subtotal numeric(10,2) not null,
  tax numeric(10,2) not null,
  delivery_fee numeric(10,2) not null,
  total numeric(10,2) not null,
  special_instructions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Order Items Table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  menu_item_id uuid references public.menu_items(id) not null,
  item_name text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(10,2) not null,
  special_instructions text
);

-- 6. Enable Row Level Security (RLS)
alter table public.restaurants enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- 7. Public Read Policies (Allow customers to view menus and restaurants)
create policy "Public can view active restaurants"
  on public.restaurants for select
  using (is_active = true);

create policy "Public can view categories"
  on public.categories for select
  using (true);

create policy "Public can view available menu items"
  on public.menu_items for select
  using (is_available = true);

create policy "Anyone can insert an order"
  on public.orders for insert
  with check (true);

create policy "Anyone can insert order items"
  on public.order_items for insert
  with check (true);

create policy "Customers can view their placed order by id"
  on public.orders for select
  using (true);

create policy "Customers can view their order items"
  on public.order_items for select
  using (true);

-- 8. Restaurant Owner Isolated Management Policies
create policy "Owners manage own restaurant"
  on public.restaurants for all
  using (auth.uid() = owner_id);

create policy "Owners manage own categories"
  on public.categories for all
  using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = categories.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );

create policy "Owners manage own menu items"
  on public.menu_items for all
  using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = menu_items.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );

create policy "Owners manage own orders"
  on public.orders for all
  using (
    exists (
      select 1 from public.restaurants
      where restaurants.id = orders.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );

-- 9. Enable Realtime Publications
alter publication supabase_realtime add table public.orders;
`;
