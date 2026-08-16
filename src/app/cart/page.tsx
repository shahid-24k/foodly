"use client";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { money } from "@/lib/types";
import RestaurantLogo from "@/components/RestaurantLogo";
import FoodImage from "@/components/FoodImage";

export default function CartPage() {
  const { cart, changeQty, total, count } = useCart();

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-6 pb-40">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative">
        <Link
          href={cart.restaurantId ? `/restaurants/${cart.restaurantId}` : "/"}
          className="bg-surface dark:bg-[#24201D] border border-gray-100 dark:border-[#332E28] rounded-full p-2.5 shadow-sm text-text-muted hover:text-text-main dark:hover:text-white transition-all z-10"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-bold text-xl text-text-main dark:text-white absolute left-1/2 -translate-x-1/2">
          Your Cart
        </h1>
        <div className="w-10" aria-hidden="true" />
      </div>

      {count === 0 ? (
        /* ── Empty state ── */
        <div className="text-center py-24 bg-surface dark:bg-[#24201D] rounded-[2.5rem] border border-gray-50 dark:border-[#332E28] shadow-sm p-8">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <p className="font-bold text-xl text-text-main dark:text-white mb-2">Your cart is empty</p>
          <p className="text-text-muted mb-8">Add some delicious items to get started.</p>
          <Link href="/restaurants" className="inline-block bg-primary text-white font-bold text-sm px-8 py-3.5 rounded-full hover:bg-primary-dark transition-all shadow-md">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        /* ── Filled state ── */
        <div className="space-y-5">
          {/* Restaurant Banner */}
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-[2rem] p-5 shadow-lg flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-white/70 uppercase tracking-widest mb-0.5">Ordering from</p>
                <p className="font-bold text-lg leading-tight">{cart.restaurantName}</p>
              </div>
            </div>
            {cart.restaurantId && (
              <div className="bg-white rounded-xl p-1 shadow-sm flex-shrink-0">
                <RestaurantLogo id={cart.restaurantId} name={cart.restaurantName || ""} size="md" />
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            {Object.values(cart.items).map((item) => (
              <div
                key={item.id}
                className="bg-surface dark:bg-[#24201D] rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.06)] border border-gray-50 dark:border-transparent overflow-hidden"
              >
                {/* Food Image + Delete */}
                <div className="relative h-32 bg-gray-100 dark:bg-[#1A202C]">
                  <FoodImage src={item.image_url} id={item.id} alt={item.name} className="w-full h-full" />
                  <button
                    onClick={() => changeQty(item.id, -999)}
                    className="absolute top-3 right-3 bg-accent/90 text-white rounded-full p-2 hover:bg-accent transition-colors shadow-md"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Item details + qty control */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-text-main dark:text-white truncate">{item.name}</p>
                    <p className="text-sm text-text-muted mt-0.5">{money(item.price)} each</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      className="bg-gray-100 dark:bg-[#1A202C] text-text-main dark:text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-5 text-center text-text-main dark:text-white tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-primary-dark transition-colors shadow-sm"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="font-bold text-base text-primary ml-2 tabular-nums w-16 text-right">
                      {money(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-surface dark:bg-[#24201D] rounded-[2rem] p-6 shadow-sm border border-gray-50 dark:border-transparent">
            <h2 className="font-bold text-base text-text-main dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm text-text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-text-main dark:text-white font-medium">{money(total)}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-dashed border-gray-200 dark:border-[#332E28]">
                <span>Delivery Fee</span>
                <span className="text-secondary font-semibold">Free</span>
              </div>
            </div>
            <div className="flex justify-between font-black text-text-main dark:text-white text-xl mt-4">
              <span>Total</span>
              <span className="text-primary">{money(total)}</span>
            </div>
          </div>

          {/* Checkout CTA — fixed on mobile, inline on desktop */}
          <Link
            href="/checkout"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-30
                       md:static md:w-full md:translate-x-0 md:left-auto
                       bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-full
                       flex items-center justify-center gap-2 transition-all
                       shadow-[0_8px_30px_rgb(106,56,194,0.35)] hover:shadow-[0_12px_40px_rgb(106,56,194,0.5)] hover:scale-[1.02]"
          >
            Proceed to Checkout &rarr;
          </Link>
        </div>
      )}
    </main>
  );
}
