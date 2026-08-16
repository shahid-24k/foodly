"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Receipt, Heart, User } from "lucide-react";

const ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/restaurants", icon: Search, label: "Explore" },
  { href: "/orders", icon: Receipt, label: "Orders" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/account", icon: User, label: "Account" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-cream/95 dark:bg-[#1C1A18]/95 backdrop-blur border-t border-line dark:border-[#332E28] flex justify-around py-2 transition-colors">
      {ITEMS.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-bold ${pathname === href ? "text-mango" : "text-[#9A9488] dark:text-[#8C8477]"}`}>
          <Icon size={20} /> {label}
        </Link>
      ))}
    </nav>
  );
}
