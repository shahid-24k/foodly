"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Sun, Moon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import FoodlyLogo from "@/components/FoodlyLogo";

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Read theme preference
    const savedTheme = localStorage.getItem("foodly-theme");
    const isDark =
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
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
    <header className="sticky top-0 z-30 bg-surface/90 dark:bg-[#12161F]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <FoodlyLogo size="md" />
        </Link>

        {/* Center Locality */}
        <div className="flex items-center gap-1.5 text-sm text-text-muted dark:text-[#A8A095] font-medium bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-100 dark:border-white/5">
          <MapPin size={15} className="text-secondary" /> Krishnagiri
        </div>

        {/* Right Area: Clean & Minimal (Only Dashboard link if owner/admin & Theme Toggle) */}
        <div className="flex items-center gap-2">
          {role === "restaurant" && (
            <Link
              href="/restaurant/dashboard"
              className="text-xs font-bold bg-primary/10 text-primary dark:text-[#A78BFA] px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
            >
              Dashboard
            </Link>
          )}
          {role === "admin" && (
            <Link
              href="/admin/dashboard"
              className="text-xs font-bold bg-primary/10 text-primary dark:text-[#A78BFA] px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all"
            >
              Admin
            </Link>
          )}

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-gray-100 dark:border-white/10 text-text-muted dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle Theme"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun size={17} className="text-secondary" />
            ) : (
              <Moon size={17} className="text-text-muted" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
