"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-[#9A9488] dark:text-[#8C8477]">
        Loading…
      </div>
    );
  }

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
    <main className="pb-28 overflow-x-hidden">
      {/* Hero Banner Header */}
      <div className="h-64 md:h-80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
        <RestaurantMark r={restaurant} size="large" />
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-4 bg-white/20 hover:bg-white/40 border border-white/20 backdrop-blur-md rounded-full p-2.5 text-white transition-all shadow-lg z-20"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Restaurant Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto px-4 md:px-8 -mt-12 relative z-20"
      >
        <div className="bg-surface dark:bg-[#24201D] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-transparent p-6 md:p-8">
          <h1 className="font-black text-2xl md:text-3xl text-text-main dark:text-white">
            {restaurant.name}
          </h1>
          <p className="text-sm text-text-muted dark:text-[#8C8477] mt-2">
            {restaurant.cuisine} &middot; {restaurant.price_range} &middot; {restaurant.locality.replace(/,\s*Krishnagiri/i, "").replace(/Krishnagiri\s*Locality/i, "Town Center")}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-semibold">
            <span className="flex items-center gap-1 text-primary bg-primary/10 px-3 py-1 rounded-full">
              <Star size={14} className="fill-primary" /> {restaurant.rating}
            </span>
            <span className="flex items-center gap-1 text-text-muted dark:text-[#A8A095]">
              <Clock size={14} /> {restaurant.delivery_time} min
            </span>
            {restaurant.offer && (
              <span className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                {restaurant.offer}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Menu Search and Sticky Category Bar */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="flex-1 flex items-center gap-2 rounded-[2rem] px-4 py-3 bg-white dark:bg-[#24201D] shadow-sm border border-gray-100 dark:border-[#332E28] focus-within:border-primary/30 transition-colors">
            <Search size={18} className="text-text-muted" />
            <input
              value={dishQuery}
              onChange={(e) => setDishQuery(e.target.value)}
              placeholder={`Search dishes in ${restaurant.name}`}
              className="w-full text-sm outline-none bg-transparent text-text-main dark:text-white placeholder-text-muted"
            />
          </div>
          <button
            onClick={() => setVegOnly((v) => !v)}
            className={`px-5 py-3 rounded-[2rem] text-sm font-bold border flex items-center justify-center gap-2 transition-all shadow-sm ${
              vegOnly
                ? "bg-secondary text-white border-secondary"
                : "bg-white dark:bg-[#24201D] border-gray-100 dark:border-[#332E28] text-text-muted dark:text-white hover:border-secondary/30"
            }`}
          >
            <Leaf size={16} /> Veg only
          </button>
        </motion.div>

        {/* Sticky Category Tabs */}
        {categories.length > 0 && (
          <div className="sticky top-16 z-20 bg-background/95 dark:bg-[#1A202C]/95 backdrop-blur-md py-3 -mx-4 px-4 md:-mx-8 md:px-8 flex gap-3 overflow-x-auto scrollbar-hide mb-8 shadow-sm">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-bold flex-shrink-0 transition-all ${
                !activeCategory
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : "bg-white dark:bg-[#24201D] text-text-muted border border-gray-100 dark:border-[#332E28] hover:border-primary/30"
              }`}
            >
              All Items ({menu.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold flex-shrink-0 transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-white dark:bg-[#24201D] text-text-muted border border-gray-100 dark:border-[#332E28] hover:border-primary/30"
                }`}
              >
                {cat} ({menu.filter(m => m.category === cat).length})
              </button>
            ))}
          </div>
        )}

        {filteredMenu.length === 0 ? (
          <p className="text-center py-12 text-sm text-[#9A9488]">
            No dishes found matching &ldquo;{dishQuery}&rdquo;.
          </p>
        ) : (
          categories
            .filter((cat) => !activeCategory || activeCategory === cat)
            .map((cat) => {
              const itemsInCat = filteredMenu.filter((m) => m.category === cat);
              if (itemsInCat.length === 0) return null;
              return (
                <div key={cat} id={`cat-${cat}`} className="mb-8 scroll-mt-28">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, margin: "-30px" }}
                    transition={{ duration: 0.4 }}
                    className="font-bold text-xl text-text-main dark:text-white mb-4"
                  >
                    {cat}
                  </motion.h3>
                  <div className="grid gap-4">
                    {itemsInCat.map((item, itemIdx) => {
                      const inCart = cart.items[item.id];
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 25, scale: 0.98 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: false, margin: "-30px" }}
                          whileHover={{ y: -3, transition: { duration: 0.2 } }}
                          transition={{
                            duration: 0.4,
                            delay: Math.min(itemIdx * 0.04, 0.2),
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex items-center justify-between gap-4 py-4 px-4 bg-white dark:bg-[#24201D] rounded-2xl shadow-sm border border-gray-50 dark:border-transparent hover:shadow-md transition-all"
                        >
                          <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-sm border border-gray-100 dark:border-transparent">
                            <FoodImage
                              src={item.image_url}
                              id={item.id}
                              alt={item.name}
                              className="w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${
                                  item.is_veg ? "border-secondary" : "border-accent"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    item.is_veg ? "bg-secondary" : "bg-accent"
                                  }`}
                                />
                              </span>
                              <h4 className="font-bold text-base text-text-main dark:text-white">
                                {item.name}
                              </h4>
                            </div>
                            <p className="text-xs text-text-muted dark:text-[#8C8477] mb-2 max-w-sm line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-base font-bold text-primary dark:text-white">
                              {money(item.price)}
                            </p>
                          </div>
                          <div className="w-28 flex-shrink-0 flex justify-end self-center">
                            {inCart ? (
                              <div className="flex items-center gap-3 bg-primary text-white rounded-full px-3 py-2 shadow-md">
                                <button
                                  onClick={() => changeQty(item.id, -1)}
                                  className="hover:scale-110 transition-transform"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="text-sm font-bold w-4 text-center">
                                  {inCart.qty}
                                </span>
                                <button
                                  onClick={() => changeQty(item.id, 1)}
                                  className="hover:scale-110 transition-transform"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAdd(item)}
                                className="bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all shadow-sm active:scale-95"
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })
        )}
      </div>

      <AnimatePresence>
        {Object.keys(cart.items).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-30"
          >
            <Link
              href="/cart"
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-8 py-4 rounded-full shadow-[0_8px_30px_rgb(106,56,194,0.4)] hover:scale-105 transition-transform flex items-center gap-3"
            >
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {Object.values(cart.items).reduce((sum, item) => sum + item.qty, 0)}
              </span>
              View basket &rarr;
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
