"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, MapPin, User, Receipt, Flame, Heart, Sun, Moon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { count } = useCart();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Read theme preference
    const savedTheme = localStorage.getItem("foodly-theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
        setRole(profile?.role ?? "customer");
      }
    });
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("foodly-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("foodly-theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-cream/90 dark:bg-[#1C1A18]/95 backdrop-blur-md border-b border-line dark:border-[#332E28] transition-colors">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-mango to-[#C24A1D] flex items-center justify-center">
            <Flame size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-black tracking-tight text-charcoal dark:text-white text-xl">FOODLY</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-sm text-[#55504A] dark:text-[#A8A095]">
          <MapPin size={16} className="text-mango" /> Krishnagiri
        </div>

        <div className="flex items-center gap-3">
          {role === "restaurant" && <Link href="/restaurant/dashboard" className="text-sm font-bold text-charcoal dark:text-white hidden sm:block">Dashboard</Link>}
          {role === "admin" && <Link href="/admin/dashboard" className="text-sm font-bold text-charcoal dark:text-white hidden sm:block">Admin</Link>}
          <Link href="/favorites" className="hidden sm:block text-[#55504A] dark:text-[#A8A095] hover:text-charcoal dark:hover:text-white"><Heart size={20} /></Link>
          <Link href="/orders" className="hidden sm:block text-[#55504A] dark:text-[#A8A095] hover:text-charcoal dark:hover:text-white"><Receipt size={20} /></Link>
          <Link href={user ? "/account" : "/login"} className="hidden sm:block text-[#55504A] dark:text-[#A8A095] hover:text-charcoal dark:hover:text-white"><User size={20} /></Link>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-line dark:border-[#332E28] text-charcoal dark:text-white hover:bg-chip dark:hover:bg-[#24201D] transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} className="text-mango" /> : <Moon size={18} className="text-charcoal" />}
          </button>

          <Link href="/cart" className="relative bg-charcoal dark:bg-white text-white dark:text-charcoal rounded-full p-2.5 hover:bg-[#1E1B18] transition-colors">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-mango text-[10px] font-bold text-white rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
