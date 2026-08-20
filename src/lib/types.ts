export type Role = "customer" | "restaurant" | "admin";

export interface Restaurant {
  id: string;
  name: string;
  since: string | null;
  cuisine: string;
  locality: string;
  rating: number;
  delivery_time: number;
  price_range: string;
  is_veg: boolean;
  offer: string | null;
  tags: string[];
  gradient_from: string;
  gradient_to: string;
  hero_image: string | null;
  catalog_source?: "verified_public" | "restaurant_submitted" | "admin_verified";
  last_verified_at?: string;
  source_name?: string | null;
  source_url?: string | null;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: number;
  is_veg: boolean;
  category: string;
  image_url: string | null;
  last_verified_at?: string;
  source_name?: string | null;
  source_url?: string | null;
}

export interface CartItem extends MenuItem {
  qty: number;
}

export interface Address {
  label: string;
  name: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  pin: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  address: Address | null;
  payment_method: string;
  status_index: number;
  eta: number;
  created_at: string;
}

export const STATUS_STEPS = [
  "Order received",
  "Restaurant accepted",
  "Preparing",
  "Ready",
  "Out for delivery",
  "Delivered",
];

export const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
