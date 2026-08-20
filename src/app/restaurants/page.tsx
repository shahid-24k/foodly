"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Leaf, Utensils } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import RestaurantCard from "@/components/RestaurantCard";
import { Restaurant, MenuItem } from "@/lib/types";
import { LOCAL_RESTAURANTS, LOCAL_MENU_ITEMS } from "@/lib/data";

const CUISINES = [
  { id: "biryani", name: "Biryani" },
  { id: "south", name: "South Indian" },
  { id: "north", name: "North Indian" },
  { id: "chinese", name: "Chinese" },
  { id: "pizza", name: "Pizza" },
  { id: "grill", name: "Grill & BBQ" },
  { id: "bakery", name: "Bakery" },
  { id: "cafe", name: "Cafe & Sweets" },
];

function RestaurantsList() {
  const params = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(LOCAL_RESTAURANTS);
  const [menuItemsMap, setMenuItemsMap] = useState<Record<string, MenuItem[]>>(LOCAL_MENU_ITEMS);
  const [cuisine, setCuisine] = useState<string | null>(params.get("cuisine"));
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<"rating" | "time">("rating");
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("restaurants").select("*").then(({ data }) => {
      if (data && data.length > 0) {
        setRestaurants(data);
      }
    });
    supabase.from("menu_items").select("*").then(({ data }) => {
      if (data && data.length > 0) {
        const map: Record<string, MenuItem[]> = {};
        data.forEach((item) => {
          if (!map[item.restaurant_id]) {
            map[item.restaurant_id] = [];
          }
          map[item.restaurant_id].push(item);
        });
        setMenuItemsMap(map);
      }
    });
  }, []);

  useEffect(() => {
    const urlQ = params.get("q");
    if (urlQ !== null) setQ(urlQ);
    const urlCuisine = params.get("cuisine");
    if (urlCuisine !== null) setCuisine(urlCuisine);
  }, [params]);

  const filtered = useMemo(() => {
    let list = [...restaurants];
    const qq = q.trim().toLowerCase();

    // 1. Text search across restaurant names, cuisines, locality, tags, and menu items
    if (qq) {
      list = list.filter((r) => {
        if (r.name.toLowerCase().includes(qq)) return true;
        if (r.cuisine && r.cuisine.toLowerCase().includes(qq)) return true;
        if (r.locality && r.locality.toLowerCase().includes(qq)) return true;
        if (r.tags && r.tags.some((t) => t.toLowerCase().includes(qq))) return true;

        const items = menuItemsMap[r.id] || [];
        const hasMatchingDish = items.some(
          (m) =>
            m.name.toLowerCase().includes(qq) ||
            (m.description && m.description.toLowerCase().includes(qq)) ||
            (m.category && m.category.toLowerCase().includes(qq))
        );
        if (hasMatchingDish) return true;

        return false;
      });
    }

    // 2. Cuisine filter
    if (cuisine) {
      list = list.filter(
        (r) =>
          r.tags?.includes(cuisine) ||
          r.cuisine?.toLowerCase().includes(cuisine.toLowerCase())
      );
    }

    // 3. Veg only filter
    if (vegOnly) {
      list = list.filter((r) => r.is_veg);
    }

    // 4. Sort
    list.sort((a, b) =>
      sort === "rating" ? b.rating - a.rating : a.delivery_time - b.delivery_time
    );

    return list;
  }, [restaurants, menuItemsMap, q, cuisine, vegOnly, sort]);

  const resultCountText = useMemo(() => {
    if (filtered.length === 0) return "No restaurants found";
    if (filtered.length === 1) return "1 spot";
    return `${filtered.length} spots`;
  }, [filtered.length]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 w-full">
      <Link
        href="/"
        className="flex items-center gap-1 text-sm text-text-muted dark:text-[#8C8477] mb-5 hover:text-text-main dark:hover:text-white w-fit transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </Link>
      <div className="flex items-baseline justify-between mb-5">
        <h1 className="font-bold text-2xl text-text-main dark:text-white">Restaurants near you</h1>
        <span className="text-sm font-medium text-text-muted dark:text-[#8C8477]">
          {resultCountText}
        </span>
      </div>
      <div className="flex items-center gap-2 mb-5 rounded-[2rem] px-4 py-3 bg-surface dark:bg-[#24201D] shadow-sm border border-gray-100 dark:border-[#332E28] focus-within:border-primary/30 transition-colors">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-muted flex-shrink-0"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search restaurants, cuisines, or dishes (e.g. biryani, pizza, dosa)..."
          className="w-full text-sm outline-none bg-transparent text-text-main dark:text-white placeholder-text-muted"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ("")}
            className="text-text-muted hover:text-text-main dark:hover:text-white text-xs font-bold px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#332E28] transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCuisine(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            !cuisine
              ? "bg-primary text-white shadow-md"
              : "bg-surface dark:bg-[#24201D] border border-gray-100 dark:border-[#332E28] text-text-muted hover:border-primary/30"
          }`}
        >
          All ({restaurants.length})
        </button>
        {CUISINES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCuisine(cuisine === c.id ? null : c.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              cuisine === c.id
                ? "bg-primary text-white shadow-md"
                : "bg-surface dark:bg-[#24201D] border border-gray-100 dark:border-[#332E28] text-text-muted hover:border-primary/30"
            }`}
          >
            {c.name}
          </button>
        ))}
        <button
          onClick={() => setVegOnly((v) => !v)}
          className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-1.5 transition-all ${
            vegOnly
              ? "bg-secondary text-white border-secondary"
              : "bg-surface dark:bg-[#24201D] border-gray-100 dark:border-[#332E28] text-text-muted hover:border-secondary/30"
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
        <div className="text-center py-20 bg-surface dark:bg-[#24201D] rounded-3xl border border-gray-100 dark:border-[#332E28] p-8 mt-4 shadow-sm">
          <Utensils
            size={44}
            className="text-text-muted/40 dark:text-[#8C8477]/40 mx-auto mb-3"
            strokeWidth={1.5}
          />
          <p className="font-bold text-text-main dark:text-white text-lg mb-1">
            No restaurants found
          </p>
          <p className="text-text-muted dark:text-[#8C8477] text-sm max-w-md mx-auto">
            {q.trim()
              ? `No restaurants or dishes matching "${q.trim()}". Try a different restaurant name, cuisine, or food item.`
              : "No restaurants match the selected filters. Try changing or clearing your filters."}
          </p>
          {(q || cuisine || vegOnly) && (
            <button
              onClick={() => {
                setQ("");
                setCuisine(null);
                setVegOnly(false);
              }}
              className="mt-5 px-5 py-2.5 rounded-full text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-sm active:scale-95"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filtered.map((r) => (
            <div key={r.id} className="w-full min-w-0 flex">
              <RestaurantCard r={r} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function RestaurantsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#9A9488] dark:text-[#8C8477]">
          Loading…
        </div>
      }
    >
      <RestaurantsList />
    </Suspense>
  );
}
