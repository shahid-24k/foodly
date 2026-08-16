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
      <Link href="/" className="flex items-center gap-1 text-sm text-[#9A9488] dark:text-[#8C8477] mb-4 hover:text-charcoal dark:hover:text-white w-fit">
        <ArrowLeft size={15} /> Back
      </Link>
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="font-display font-black text-2xl text-charcoal dark:text-white">Restaurants near you</h1>
        <span className="text-xs font-semibold text-[#9A9488] dark:text-[#8C8477]">{filtered.length} spots in Krishnagiri</span>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search dishes or restaurants (e.g. 'Biryani', 'Saravana', 'Momos')"
        className="w-full mb-4 text-sm border border-line dark:border-[#332E28] rounded-xl px-4 py-2.5 outline-none focus:border-mango bg-white dark:bg-[#24201D] text-charcoal dark:text-white placeholder-[#9A9488]"
      />
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCuisine(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
            !cuisine ? "bg-charcoal dark:bg-white text-white dark:text-charcoal border-charcoal dark:border-white" : "border-line dark:border-[#332E28] text-[#55504A] dark:text-[#A8A095] bg-white dark:bg-[#24201D]"
          }`}
        >
          All ({restaurants.length})
        </button>
        {CUISINES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCuisine(cuisine === c.id ? null : c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              cuisine === c.id ? "bg-mango text-white border-mango" : "border-line dark:border-[#332E28] text-[#55504A] dark:text-[#A8A095] bg-white dark:bg-[#24201D]"
            }`}
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={() => setVegOnly((v) => !v)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1 transition-colors ${
            vegOnly ? "bg-leaf text-white border-leaf" : "border-line dark:border-[#332E28] text-[#55504A] dark:text-[#A8A095] bg-white dark:bg-[#24201D]"
          }`}
        >
          <Leaf size={12} /> Veg only
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "rating" | "time")}
          className="px-3 py-1.5 rounded-full text-xs font-bold border border-line dark:border-[#332E28] text-[#55504A] dark:text-white bg-white dark:bg-[#24201D]"
        >
          <option value="rating">Sort: Rating</option>
          <option value="time">Sort: Delivery time</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Utensils size={36} className="text-line dark:text-[#332E28] mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-bold text-charcoal dark:text-white">Nothing delicious nearby matching &ldquo;{q}&rdquo;.</p>
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
