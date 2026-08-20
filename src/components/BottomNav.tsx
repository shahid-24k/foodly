"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Receipt, ShoppingBag, Heart, User, LucideIcon } from "lucide-react";
import { useCart } from "@/lib/cart-context";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  match: (pathname: string) => boolean;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Home",
      href: "/",
      icon: Home,
      match: (p) => p === "/",
    },
    {
      id: "orders",
      label: "Orders",
      href: "/orders",
      icon: Receipt,
      match: (p) => p.startsWith("/orders"),
    },
    {
      id: "cart",
      label: "Cart",
      href: "/cart",
      icon: ShoppingBag,
      badge: count,
      match: (p) => p === "/cart" || p.startsWith("/checkout"),
    },
    {
      id: "favorites",
      label: "Favorites",
      href: "/favorites",
      icon: Heart,
      match: (p) => p.startsWith("/favorites"),
    },
    {
      id: "account",
      label: "Account",
      href: "/account",
      icon: User,
      match: (p) => p.startsWith("/account") || p.startsWith("/login") || p.startsWith("/signup"),
    },
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center z-40 px-4 pointer-events-none">
      <nav
        role="navigation"
        aria-label="Floating Navigation"
        className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full bg-white/90 dark:bg-[#12161F]/90 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 shadow-[0_12px_40px_rgb(0,0,0,0.12)] transition-all select-none"
      >
        {navItems.map((item, index) => {
          const isActive = item.match(pathname);
          const Icon = item.icon;

          return (
            <div key={item.id} className="flex items-center">
              {/* Subtle divider before the last 2 items */}
              {index === 3 && (
                <div className="h-5 w-[1px] bg-gray-200 dark:bg-white/10 mx-1" />
              )}

              <Link
                href={item.href}
                className="relative rounded-full focus:outline-none"
              >
                <motion.div
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                  className={`relative flex items-center justify-center gap-2 rounded-full transition-colors ${
                    isActive
                      ? "bg-gray-100 dark:bg-white/15 text-text-main dark:text-white px-4 py-2 shadow-sm font-semibold text-sm"
                      : "p-2.5 text-text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-white/5"
                  }`}
                >
                  {/* Icon */}
                  <div className="relative flex items-center justify-center">
                    <Icon size={19} className={isActive ? "text-primary dark:text-[#A78BFA]" : ""} />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-accent text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Active expanded text label */}
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap leading-none pr-0.5"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
