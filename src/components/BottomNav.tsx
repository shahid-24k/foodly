"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-30 md:hidden bg-surface dark:bg-[#1A202C] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex justify-between items-center px-4 py-3">
      
      <Link href="/" className={`p-2 ${pathname === "/" ? "text-primary" : "text-text-muted hover:text-primary transition-colors"}`}>
        <Home size={24} />
      </Link>
      
      <Link href="/orders" className={`p-2 ${pathname.startsWith("/orders") ? "text-primary" : "text-text-muted hover:text-primary transition-colors"}`}>
        <Receipt size={24} />
      </Link>
      
      <Link href="/cart" className="relative -mt-8 flex items-center justify-center bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-primary/40 border-4 border-surface dark:border-[#1A202C]">
        <ShoppingBag size={24} />
        {count > 0 && (
          <span className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
      
      <Link href="/favorites" className={`p-2 ${pathname.startsWith("/favorites") ? "text-primary" : "text-text-muted hover:text-primary transition-colors"}`}>
        <Heart size={24} />
      </Link>
      
      <Link href="/account" className={`p-2 ${pathname.startsWith("/account") ? "text-primary" : "text-text-muted hover:text-primary transition-colors"}`}>
        <User size={24} />
      </Link>
      
    </nav>
  );
}
