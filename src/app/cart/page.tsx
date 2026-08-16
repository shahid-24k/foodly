"use client";
import Link from "next/link";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { money } from "@/lib/types";
import RestaurantLogo from "@/components/RestaurantLogo";

export default function CartPage() {
  const { cart, changeQty, total, count } = useCart();

  return (
    <main className="max-w-2xl mx-auto px-4 md:px-8 py-6 pb-32">
      <Link href={cart.restaurantId ? `/restaurants/${cart.restaurantId}` : "/"} className="flex items-center gap-1 text-sm text-[#9A9488] dark:text-[#8C8477] mb-4 hover:text-charcoal dark:hover:text-white w-fit">
        <ArrowLeft size={15} /> Back
      </Link>
      <h1 className="font-display font-black text-2xl text-charcoal dark:text-white mb-5">Your basket</h1>
      {count === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] p-6">
          <p className="font-bold text-charcoal dark:text-white">Your basket is waiting for something delicious.</p>
          <Link href="/restaurants" className="inline-block mt-5 bg-mango text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-maroon transition-colors">
            Browse restaurants
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[#9A9488] dark:text-[#8C8477] uppercase mb-0.5">Ordering from</p>
              <p className="font-bold text-charcoal dark:text-white text-base">{cart.restaurantName}</p>
            </div>
            {cart.restaurantId && (
              <RestaurantLogo id={cart.restaurantId} name={cart.restaurantName || ""} size="md" />
            )}
          </div>

          <div className="bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] divide-y divide-line dark:divide-[#332E28] mb-4">
            {Object.values(cart.items).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold text-sm text-charcoal dark:text-white">{item.name}</p>
                  <p className="text-xs text-[#9A9488] dark:text-[#8C8477]">{money(item.price)}</p>
                </div>
                <div className="flex items-center gap-3 bg-chip dark:bg-[#1C1A18] rounded-xl px-2.5 py-1.5 border border-line dark:border-[#332E28]">
                  <button onClick={() => changeQty(item.id, -1)} className="text-charcoal dark:text-white"><Minus size={14} /></button>
                  <span className="text-sm font-bold w-3 text-center text-charcoal dark:text-white">{item.qty}</span>
                  <button onClick={() => changeQty(item.id, 1)} className="text-charcoal dark:text-white"><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#24201D] rounded-2xl border border-line dark:border-[#332E28] p-4 text-sm">
            <div className="flex justify-between font-bold text-charcoal dark:text-white text-base">
              <span>Total</span>
              <span className="text-mango">{money(total)}</span>
            </div>
          </div>

          <Link href="/checkout" className="fixed bottom-4 left-4 right-4 md:static md:mt-5 bg-mango hover:bg-maroon text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg">
            {money(total)} &middot; Continue to Checkout
          </Link>
        </>
      )}
    </main>
  );
}
