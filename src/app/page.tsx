import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RestaurantCard from "@/components/RestaurantCard";
import { Restaurant } from "@/lib/types";
import { LOCAL_RESTAURANTS } from "@/lib/data";

const CUISINES = [
  { id: "biryani", name: "Biryani" },
  { id: "south", name: "South Indian" },
  { id: "north", name: "North Indian" },
  { id: "chinese", name: "Chinese" },
  { id: "pizza", name: "Pizza" },
  { id: "grill", name: "Grill & BBQ" },
  { id: "bakery", name: "Bakery" },
  { id: "cafe", name: "Cafe & Desserts" },
];

const MOODS = [
  { id: "comfort", name: "Comfort" },
  { id: "spicy", name: "Spicy & Hot" },
  { id: "grill", name: "Smoky BBQ" },
  { id: "sweet", name: "Sweet Treats" },
  { id: "quick", name: "Quick Bites" },
  { id: "feast", name: "Grand Feast" },
];

function Section({ title, items, subtitle }: { title: string; items: Restaurant[]; subtitle?: string }) {
  if (!items.length) return null;
  return (
    <div className="mb-9">
      <div className="flex items-baseline justify-between mb-3 px-4 md:px-0">
        <h2 className="font-display font-black text-lg md:text-xl text-charcoal dark:text-white">{title}</h2>
        {subtitle && <span className="text-xs text-[#9A9488] dark:text-[#8C8477]">{subtitle}</span>}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 px-4 md:px-0 scrollbar-hide">
        {items.map((r) => <RestaurantCard key={r.id} r={r} />)}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const supabase = createClient();
  let restaurants: Restaurant[] = [];

  try {
    const { data } = await supabase.from("restaurants").select("*");
    if (data && data.length > 0) {
      // Merge database records with local dataset so all 12 Krishnagiri restaurants are rendered
      const dbIds = new Set(data.map((r) => r.id));
      restaurants = [
        ...data,
        ...LOCAL_RESTAURANTS.filter((r) => !dbIds.has(r.id)),
      ];
    } else {
      restaurants = LOCAL_RESTAURANTS;
    }
  } catch {
    restaurants = LOCAL_RESTAURANTS;
  }

  const byRating = [...restaurants].sort((a, b) => b.rating - a.rating);
  const byTime = [...restaurants].sort((a, b) => a.delivery_time - b.delivery_time);

  return (
    <main className="pb-10">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden bg-white dark:bg-[#1C1A18] border-b border-line dark:border-[#332E28] px-4 md:px-8 pt-14 pb-16 md:pt-20 md:pb-24 transition-colors">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="eyebrow text-[11px] font-bold text-mango uppercase tracking-widest block mb-2">
              Krishnagiri · Kaveripattinam · Rayakottai Road
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-charcoal dark:text-white leading-[1.05] mb-4 tracking-tight">
              Good food.<br /><span className="text-mango">Your way.</span>
            </h1>
            <p className="text-[#55504A] dark:text-[#A8A095] text-base md:text-lg mb-7 max-w-md">
              From Sri Rajeshwari&apos;s biryani &amp; Saravana Bhavan meals to Belgium Bliss waffles — 12 authentic Krishnagiri spots, delivered fresh.
            </p>
            <form action="/restaurants" className="flex items-center gap-2 bg-white dark:bg-[#24201D] p-1.5 max-w-md border border-line dark:border-[#332E28] shadow-xs">
              <div className="flex items-center gap-1.5 px-3 text-sm font-medium border-r border-line dark:border-[#332E28] text-charcoal dark:text-white flex-shrink-0">
                Krishnagiri
              </div>
              <input
                name="q"
                placeholder="Search 'Biryani', 'Dosa', 'Momos'"
                className="flex-1 outline-none text-sm px-2 bg-transparent text-charcoal dark:text-white placeholder-[#9A9488]"
              />
              <button className="bg-mango hover:bg-maroon text-white px-4 py-2 text-sm font-bold transition-colors">
                Search
              </button>
            </form>
          </div>

          <div className="relative h-64 md:h-80 flex items-center justify-center">
            {/* Concentric Tiffin-Stack Structural Devices */}
            <div className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full border-2 border-ring dark:border-ring/30" />
            <div className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full border-2 border-ring dark:border-ring/30 translate-x-6 translate-y-4" />
            <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-mango bg-chip dark:bg-[#24201D] shadow-lg -translate-x-4 -translate-y-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/restaurants/r12.jpg" alt="Ambur Star Biryani" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-4 bg-white dark:bg-[#24201D] border border-line dark:border-[#332E28] px-3.5 py-2 text-xs shadow-sm">
              <span className="font-display font-bold text-charcoal dark:text-white block">24 min avg</span>
              <span className="text-[10px] text-[#9A9488] dark:text-[#8C8477] eyebrow uppercase tracking-wide">Live delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisines Grid */}
      <div className="max-w-6xl mx-auto mt-10 px-4 md:px-8">
        <h2 className="font-display font-black text-lg md:text-xl text-charcoal dark:text-white mb-3">What are you craving?</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CUISINES.map((c) => (
            <Link key={c.id} href={`/restaurants?cuisine=${c.id}`} className="flex-shrink-0 w-28 flex flex-col items-center gap-2 group">
              <div className="w-24 h-20 rounded-xl bg-chip dark:bg-[#24201D] border border-line dark:border-[#332E28] flex items-center justify-center text-xs font-bold text-charcoal dark:text-white group-hover:border-mango group-hover:bg-[#F0DCC8]/50 dark:group-hover:bg-mango/20 transition-all text-center px-2 shadow-xs">
                {c.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Grounded Human-crafted Mood Selector Card */}
      <div className="max-w-6xl mx-auto mt-10 px-4 md:px-8">
        <div className="rounded-2xl bg-charcoal dark:bg-[#24201D] p-6 md:p-8 border border-[#332E28] shadow-md relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="eyebrow text-[10px] font-bold text-mango uppercase tracking-widest block mb-1">
                Precision Food Matching
              </span>
              <h2 className="font-display font-black text-xl md:text-2xl text-white">What&apos;s your mood?</h2>
            </div>
            <p className="text-[#C9C0B3] text-xs max-w-xs">
              Tap any dining mood to instantly filter Krishnagiri&apos;s top rated menus.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {MOODS.map((m) => (
              <Link
                key={m.id}
                href={`/restaurants?cuisine=${m.id}`}
                className="flex flex-col items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl py-3.5 px-2 transition-all hover:border-mango text-center"
              >
                <span className="text-xs font-bold text-white">{m.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Listing Sections */}
      <div className="max-w-6xl mx-auto mt-10">
        <Section title="Top Rated Spots in Krishnagiri" items={byRating} subtitle="12 Real Restaurants" />
        <Section title="Fastest Delivery" items={byTime} subtitle="Under 35 min" />
      </div>
    </main>
  );
}
