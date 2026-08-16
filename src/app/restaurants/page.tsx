"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Leaf, Utensils } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import RestaurantCard from "@/components/RestaurantCard";
import { Restaurant } from "@/lib/types";
import { LOCAL_RESTAURANTS } from "@/lib/data";

const CUISINES = [
  { id: "biryani", name: "Biryani" }, { id: "south", name: "South Indian" },
  { id: "north", name: "North Indian" }, { id: "chinese", name: "Chinese" },
  { id: "pizza", name: "Pizza" }, { id: "grill", name: "Grill & BBQ" },
  { id: "bakery", name: "Bakery" }, { id: "cafe", name: "Cafe & Sweets" },
];

function RestaurantsList() {
  const params = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(LOCAL_RESTAURANTS);
  const [cuisine, setCuisine] = useState<string | null>(params.get("cuisine"));
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<"rating" | "time">("rating");
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => {
    createClient().from("restaurants").select("*").then(({ data }) => {
      if (data && data.length > 0) {
        const dbIds = new Set(data.map((r) => r.id));
        setRestaurants([
          ...data,
          ...LOCAL_RESTAURANTS.filter((r) => !dbIds.has(r.id)),
        ]);
      }
    });
  }, []);

  const filtered = useMemo(() => {
    let list = [...restaurants];
    if (q.trim()) {
      const qq = q.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(qq) || r.cuisine.toLowerCase().includes(qq));
    }
    if (cuisine) list = list.filter((r) => r.tags?.includes(cuisine));
    if (vegOnly) list = list.filter((r) => r.is_veg);
    list.sort((a, b) => (sort === "rating" ? b.rating - a.rating : a.delivery_time - b.delivery_time));
    return list;
  }, [restaurants, q, cuisine, vegOnly, sort]);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 pb-24">
      <Link href="/" className="flex items-center gap-1 text-sm text-text-muted dark:text-[#8C8477] mb-5 hover:text-text-main dark:hover:text-white w-fit transition-colors">
        <ArrowLeft size={15} /> Back
      </Link>
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="font-bold text-2xl text-text-main dark:text-white">Restaurants near you</h1>
        <span className="text-sm font-medium text-text-muted dark:text-[#8C8477]">{filtered.length} spots</span>
      </div>
      <div className="flex items-center gap-2 mb-5 rounded-[2rem] px-4 py-3 bg-surface dark:bg-[#24201D] shadow-sm border border-gray-100 dark:border-[#332E28] focus-within:border-primary/30 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted flex-shrink-0">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search restaurants or cuisines..."
          className="w-full text-sm outline-none bg-transparent text-text-main dark:text-white placeholder-text-muted"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCuisine(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            !cuisine ? "bg-primary text-white shadow-md" : "bg-surface dark:bg-[#24201D] border border-gray-100 dark:border-[#332E28] text-text-muted hover:border-primary/30"
          }`}
        >
          All ({restaurants.length})
        </button>
        {CUISINES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCuisine(cuisine === c.id ? null : c.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              cuisine === c.id ? "bg-primary text-white shadow-md" : "bg-surface dark:bg-[#24201D] border border-gray-100 dark:border-[#332E28] text-text-muted hover:border-primary/30"
            }`}
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={() => setVegOnly((v) => !v)}
          className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-1.5 transition-all ${
            vegOnly ? "bg-secondary text-white border-secondary" : "bg-surface dark:bg-[#24201D] border-gray-100 dark:border-[#332E28] text-text-muted hover:border-secondary/30"
          }`}
        >
          <Leaf size={14} /> Veg only
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "rating" | "time")}
          className="px-4 py-2 rounded-full text-sm font-bold border border-gray-100 dark:border-[#332E28] text-text-muted dark:text-white bg-surface dark:bg-[#24201D] outline-none cursor-pointer"
        >
          <option value="rating">Sort: Rating</option>
          <option value="time">Sort: Delivery time</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <Utensils size={48} className="text-gray-200 dark:text-[#332E28] mx-auto mb-4" strokeWidth={1.5} />
          <p className="font-bold text-text-main dark:text-white text-lg mb-2">No results found</p>
          <p className="text-text-muted text-sm">Nothing matching &ldquo;{q}&rdquo; in your area.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((r) => <div key={r.id} className="!w-full"><RestaurantCard r={r} /></div>)}
        </div>
      )}
    </main>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-20 text-center text-[#9A9488] dark:text-[#8C8477]">Loading…</div>}>
      <RestaurantsList />
    </Suspense>
  );
}
