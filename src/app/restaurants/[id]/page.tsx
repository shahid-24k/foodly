"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Clock, Plus, Minus, Search, Leaf } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";
import RestaurantMark from "@/components/RestaurantMark";
import FoodImage from "@/components/FoodImage";
import { Restaurant, MenuItem, money } from "@/lib/types";
import { LOCAL_RESTAURANTS, LOCAL_MENU_ITEMS } from "@/lib/data";

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [dishQuery, setDishQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { cart, addItem, changeQty } = useCart();

  useEffect(() => {
    const supabase = createClient();
    supabase.from("restaurants").select("*").eq("id", id).single().then(({ data }) => {
      const found = data || LOCAL_RESTAURANTS.find(r => r.id === id) || null;
      setRestaurant(found);
    });
    supabase.from("menu_items").select("*").eq("restaurant_id", id).then(({ data }) => {
      const items = (data && data.length > 0) ? data : (LOCAL_MENU_ITEMS[id] || []);
      setMenu(items);
    });
  }, [id]);

  const filteredMenu = useMemo(() => {
    let list = [...menu];
    if (dishQuery.trim()) {
      const q = dishQuery.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q)));
    }
    if (vegOnly) list = list.filter((m) => m.is_veg);
    if (activeCategory) list = list.filter((m) => m.category === activeCategory);
    return list;
  }, [menu, dishQuery, vegOnly, activeCategory]);

  if (!restaurant) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#9A9488] dark:text-[#8C8477]">Loading…</div>;

  const categories = [...new Set(menu.map((m) => m.category))];

  const handleAdd = (item: MenuItem) => {
    const ok = addItem(restaurant.id, restaurant.name, { ...item, qty: 1 });
    if (!ok && confirm(`Your basket has items from another restaurant. Start a new basket for ${restaurant.name}?`)) {
      Object.keys(cart.items).forEach((id2) => changeQty(id2, -999));
      addItem(restaurant.id, restaurant.name, { ...item, qty: 1 });
    }
  };

  const scrollToCategory = (cat: string) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
      return;
    }
    setActiveCategory(cat);
    const el = document.getElementById(`cat-${cat}`);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="pb-28">
      <div className="h-48 md:h-64 relative">
        <RestaurantMark r={restaurant} size="large" />
        <button onClick={() => router.back()} className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 rounded-full p-2 backdrop-blur text-charcoal dark:text-white">
          <ArrowLeft size={18} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-6 relative">
        <div className="bg-white dark:bg-[#24201D] rounded-2xl shadow-lg border border-line dark:border-[#332E28] p-5">
          <h1 className="font-display font-black text-2xl text-charcoal dark:text-white">{restaurant.name}</h1>
          <p className="text-sm text-[#9A9488] dark:text-[#8C8477] mt-1">{restaurant.cuisine} &middot; {restaurant.price_range} &middot; {restaurant.locality}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-semibold">
            <span className="flex items-center gap-1 text-leaf"><Star size={14} className="fill-leaf" /> {restaurant.rating}</span>
            <span className="flex items-center gap-1 text-[#55504A] dark:text-[#A8A095]"><Clock size={14} /> {restaurant.delivery_time} min</span>
            {restaurant.offer && <span className="bg-[#FBEADD] dark:bg-maroon/20 text-maroon dark:text-mango text-xs font-bold px-2.5 py-1 rounded-full">{restaurant.offer}</span>}
          </div>
        </div>
      </div>

      {/* Menu Search and Sticky Category Bar */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 border border-line dark:border-[#332E28] rounded-xl px-3 py-2.5 bg-white dark:bg-[#24201D]">
            <Search size={15} className="text-[#9A9488]" />
            <input
              value={dishQuery}
              onChange={(e) => setDishQuery(e.target.value)}
              placeholder={`Search dishes in ${restaurant.name}`}
              className="w-full text-sm outline-none bg-transparent text-charcoal dark:text-white placeholder-[#9A9488]"
            />
          </div>
          <button
            onClick={() => setVegOnly((v) => !v)}
            className={`px-3 py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors ${
              vegOnly ? "bg-leaf text-white border-leaf" : "bg-white dark:bg-[#24201D] border-line dark:border-[#332E28] text-[#55504A] dark:text-white"
            }`}
          >
            <Leaf size={14} /> Veg only
          </button>
        </div>

        {/* Sticky Category Tabs */}
        {categories.length > 0 && (
          <div className="sticky top-16 z-20 bg-cream/95 dark:bg-[#1C1A18]/95 backdrop-blur py-2 border-b border-line dark:border-[#332E28] -mx-4 px-4 md:-mx-8 md:px-8 flex gap-2 overflow-x-auto scrollbar-hide mb-6">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 transition-colors ${
                !activeCategory ? "bg-charcoal dark:bg-white text-white dark:text-charcoal border-charcoal dark:border-white" : "border-line dark:border-[#332E28] text-[#55504A] dark:text-[#A8A095]"
              }`}
            >
              All Items ({menu.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0 transition-colors ${
                  activeCategory === cat ? "bg-mango text-white border-mango" : "border-line dark:border-[#332E28] text-[#55504A] dark:text-[#A8A095] bg-white dark:bg-[#24201D]"
                }`}
              >
                {cat} ({menu.filter(m => m.category === cat).length})
              </button>
            ))}
          </div>
        )}

        {filteredMenu.length === 0 ? (
          <p className="text-center py-12 text-sm text-[#9A9488]">No dishes found matching &ldquo;{dishQuery}&rdquo;.</p>
        ) : (
          categories
            .filter((cat) => !activeCategory || activeCategory === cat)
            .map((cat) => {
              const itemsInCat = filteredMenu.filter((m) => m.category === cat);
              if (itemsInCat.length === 0) return null;
              return (
                <div key={cat} id={`cat-${cat}`} className="mb-8 scroll-mt-28">
                  <h3 className="font-bold text-lg text-charcoal dark:text-white mb-3">{cat}</h3>
                  <div className="divide-y divide-line dark:divide-[#332E28]">
                    {itemsInCat.map((item) => {
                      const inCart = cart.items[item.id];
                      return (
                        <div key={item.id} className="flex items-center justify-between gap-4 py-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                            <FoodImage src={item.image_url} id={item.id} alt={item.name} className="w-full h-full" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${item.is_veg ? "border-leaf" : "border-maroon"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${item.is_veg ? "bg-leaf" : "bg-maroon"}`} />
                              </span>
                              <h4 className="font-bold text-sm text-charcoal dark:text-white">{item.name}</h4>
                            </div>
                            <p className="text-xs text-[#9A9488] dark:text-[#8C8477] mt-1 max-w-sm">{item.description}</p>
                            <p className="text-sm font-bold text-charcoal dark:text-white mt-1.5">{money(item.price)}</p>
                          </div>
                          <div className="w-24 flex-shrink-0 flex justify-end self-end">
                            {inCart ? (
                              <div className="flex items-center gap-3 bg-mango text-white rounded-xl px-2 py-1.5 shadow">
                                <button onClick={() => changeQty(item.id, -1)}><Minus size={14} /></button>
                                <span className="text-sm font-bold w-3 text-center">{inCart.qty}</span>
                                <button onClick={() => changeQty(item.id, 1)}><Plus size={14} /></button>
                              </div>
                            ) : (
                              <button onClick={() => handleAdd(item)} className="border-2 border-mango text-mango font-bold text-xs px-4 py-2 rounded-xl hover:bg-mango hover:text-white transition-colors">+ Add</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
        )}
      </div>

      {Object.keys(cart.items).length > 0 && (
        <Link href="/cart" className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-30 bg-gradient-to-r from-mango to-[#C24A1D] text-white font-bold px-6 py-3.5 rounded-full shadow-xl">
          View basket &rarr;
        </Link>
      )}
    </main>
  );
}
