export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten_free' | 'spicy';

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string;
  logo_url?: string;
  banner_url?: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postal_code: string;
  delivery_fee: number;
  min_order: number;
  prep_time_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  dietary_tags: DietaryTag[];
  created_at: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  special_instructions?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type OrderType = 'delivery' | 'pickup';

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  item_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  special_instructions?: string;
}

export interface Order {
  id: string;
  order_number: string;
  restaurant_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  order_type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  delivery_fee: number;
  tip?: number;
  total: number;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerUser {
  id: string;
  email: string;
  full_name: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}
