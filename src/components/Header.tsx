"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, MapPin, User, Receipt, Flame, Heart, Sun, Moon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";

import FoodlyLogo from "@/components/FoodlyLogo";

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
    <header className="sticky top-0 z-30 bg-surface/90 dark:bg-[#1A202C]/95 backdrop-blur-md border-b border-gray-100 dark:border-[#2D3748] transition-colors">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <FoodlyLogo size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-1.5 text-sm text-text-muted dark:text-[#A8A095] font-medium">
          <MapPin size={16} className="text-secondary" /> Krishnagiri
        </div>

        <div className="flex items-center gap-3">
          {role === "restaurant" && <Link href="/restaurant/dashboard" className="text-sm font-bold text-text-muted dark:text-white hidden sm:block hover:text-primary transition-colors">Dashboard</Link>}
          {role === "admin" && <Link href="/admin/dashboard" className="text-sm font-bold text-text-muted dark:text-white hidden sm:block hover:text-primary transition-colors">Admin</Link>}
          <Link href="/favorites" className="hidden sm:block text-text-muted dark:text-[#A8A095] hover:text-accent dark:hover:text-white transition-colors"><Heart size={20} /></Link>
          <Link href="/orders" className="hidden sm:block text-text-muted dark:text-[#A8A095] hover:text-primary dark:hover:text-white transition-colors"><Receipt size={20} /></Link>
          <Link href={user ? "/account" : "/login"} className="hidden sm:block text-text-muted dark:text-[#A8A095] hover:text-primary dark:hover:text-white transition-colors"><User size={20} /></Link>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-gray-100 dark:border-[#2D3748] text-text-muted dark:text-white hover:bg-gray-50 dark:hover:bg-[#24201D] transition-colors"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={18} className="text-secondary" /> : <Moon size={18} className="text-text-muted" />}
          </button>

          <Link href="/cart" className="relative bg-primary text-white rounded-full p-2.5 hover:bg-primary-dark transition-colors shadow-sm">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-[10px] font-bold text-white rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
