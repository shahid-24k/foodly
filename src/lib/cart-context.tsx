"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem } from "./types";

interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: Record<string, CartItem>;
}

interface CartContextType {
  cart: CartState;
  addItem: (restaurantId: string, restaurantName: string, item: CartItem) => boolean;
  changeQty: (itemId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextType | null>(null);
const EMPTY: CartState = { restaurantId: null, restaurantName: null, items: {} };

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(EMPTY);

  useEffect(() => {
    const saved = localStorage.getItem("foodly-cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("foodly-cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (restaurantId: string, restaurantName: string, item: CartItem) => {
    if (cart.restaurantId && cart.restaurantId !== restaurantId && Object.keys(cart.items).length > 0) {
      return false; // different restaurant — caller should confirm before clearing
    }
    setCart((prev) => {
      const items = { ...prev.items };
      items[item.id] = { ...item, qty: (items[item.id]?.qty || 0) + 1 };
      return { restaurantId, restaurantName, items };
    });
    return true;
  };

  const changeQty = (itemId: string, delta: number) => {
    setCart((prev) => {
      const items = { ...prev.items };
      if (!items[itemId]) return prev;
      const qty = items[itemId].qty + delta;
      if (qty <= 0) delete items[itemId];
      else items[itemId] = { ...items[itemId], qty };
      const hasItems = Object.keys(items).length > 0;
      return { restaurantId: hasItems ? prev.restaurantId : null, restaurantName: hasItems ? prev.restaurantName : null, items };
    });
  };

  const clearCart = () => setCart(EMPTY);

  const subtotal = Object.values(cart.items).reduce((a, b) => a + b.qty * b.price, 0);
  const deliveryFee = subtotal > 0 ? (subtotal > 399 ? 0 : 35) : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;
  const count = Object.values(cart.items).reduce((a, b) => a + b.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, changeQty, clearCart, subtotal, deliveryFee, tax, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
