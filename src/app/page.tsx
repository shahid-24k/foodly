import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RestaurantCarousel from "@/components/RestaurantCarousel";
import { Restaurant } from "@/lib/types";
import { LOCAL_RESTAURANTS } from "@/lib/data";
import FoodFunFact from "@/components/FoodFunFact";
import {
  HeroReveal,
  HeroImageReveal,
  SectionReveal,
  CategoryStagger,
  CategoryItem,
  MoodStagger,
  MoodItem,
} from "@/components/HomeAnimations";

const CUISINES = [
  { id: "biryani", name: "Biryani", image: "/menu/chicken-biryani-0.jpg" },
  { id: "south", name: "South Indian", image: "/menu/masala-dosa-0.jpg" },
  { id: "north", name: "North Indian", image: "/menu/paneer-butter-masala-2.jpg" },
  { id: "chinese", name: "Chinese", image: "/menu/chicken-fried-rice-0.jpg" },
  { id: "pizza", name: "Pizza", image: "/menu/margherita-pizza-0.jpg" },
  { id: "grill", name: "Grill & BBQ", image: "/menu/bbq-chicken-wings-2.jpg" },
  { id: "bakery", name: "Bakery", image: "/menu/mysore-pak-0.jpg" },
  { id: "cafe", name: "Cafe & Sweets", image: "/menu/belgian-chocolate-waffle-0.jpg" },
];

const MOODS = [
  { id: "comfort", name: "Comfort" },
  { id: "spicy", name: "Spicy & Hot" },
  { id: "grill", name: "Smoky BBQ" },
  { id: "sweet", name: "Sweet Treats" },
  { id: "quick", name: "Quick Bites" },
  { id: "feast", name: "Grand Feast" },
];

export default async function HomePage() {
  const supabase = createClient();
  let restaurants: Restaurant[] = [];

  try {
    const { data } = await supabase.from("restaurants").select("*");
    if (data && data.length > 0) {
      restaurants = data;
    } else {
      restaurants = LOCAL_RESTAURANTS;
    }
  } catch {
    restaurants = LOCAL_RESTAURANTS;
  }

  const byRating = [...restaurants].sort((a, b) => b.rating - a.rating);
  const byTime = [...restaurants].sort((a, b) => a.delivery_time - b.delivery_time);

  return (
    <main className="pb-16 overflow-x-hidden">
      {/* Soft Bubble Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-4 md:px-8 pt-8 pb-14 md:pt-14 md:pb-18 transition-colors">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          <HeroReveal>
            <div className="inline-flex items-center gap-2 mb-4 text-primary font-semibold text-xs md:text-sm bg-white/70 dark:bg-white/10 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Delivering near you &bull; 20-30 min
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-text-main dark:text-white leading-[1.1] mb-4 tracking-tight">
              Good food.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Your way.</span>
            </h1>
            <p className="text-text-muted dark:text-[#A8A095] text-base md:text-lg mb-8 max-w-md leading-relaxed">
              From signature biryanis and crispy dosas to sizzling grills — authentic flavors delivered fresh to your door.
            </p>
            
            <form action="/restaurants" className="flex items-center gap-2 bg-surface dark:bg-[#24201D] p-2 max-w-md rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 dark:border-[#332E28]">
              <div className="flex-1 px-3.5 flex items-center gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-text-muted flex-shrink-0">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  name="q"
                  placeholder="Search dishes or restaurants..."
                  className="w-full outline-none text-sm bg-transparent text-text-main dark:text-white placeholder-text-muted"
                />
              </div>
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95">
                Search
              </button>
            </form>
          </HeroReveal>

          <HeroImageReveal>
            <div className="relative h-64 md:h-88 flex items-center justify-center">
              {/* Soft Bubble Background Accent */}
              <div className="absolute w-[110%] h-[110%] bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full mix-blend-multiply opacity-70 pointer-events-none"></div>
              
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl rotate-2 border-4 border-white/80 dark:border-[#332E28] transition-transform duration-500 hover:rotate-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/restaurants/r12.jpg" alt="Featured Food" className="w-full h-full object-cover scale-105" />
              </div>
              
              <div className="absolute -bottom-3 -left-2 md:-left-4 bg-surface dark:bg-[#24201D] p-3.5 md:p-4 rounded-2xl shadow-[0_12px_36px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-[#332E28] flex items-center gap-3 animate-bounce" style={{ animationDuration: '3.5s' }}>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <span className="font-bold text-text-main dark:text-white block text-sm">24 min</span>
                  <span className="text-[11px] text-text-muted font-medium">Fast live delivery</span>
                </div>
              </div>
            </div>
          </HeroImageReveal>
        </div>
      </section>

      {/* Categories Section with Real Food Photos */}
      <div className="max-w-6xl mx-auto mt-12 px-4 md:px-8">
        <SectionReveal>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl md:text-2xl text-text-main dark:text-white tracking-tight">
              Explore Categories
            </h2>
            <Link href="/restaurants" className="text-xs md:text-sm font-semibold text-primary hover:underline">
              View all &rarr;
            </Link>
          </div>
        </SectionReveal>

        <CategoryStagger>
          {CUISINES.map((c) => (
            <CategoryItem key={c.id}>
              <Link
                href={`/restaurants?cuisine=${c.id}`}
                className="flex-shrink-0 flex flex-col items-center gap-2.5 group text-center"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-surface dark:bg-[#24201D] shadow-[0_4px_20px_rgb(0,0,0,0.06)] group-hover:shadow-[0_8px_30px_rgb(106,56,194,0.18)] flex items-center justify-center border border-transparent group-hover:border-primary/30 transition-all duration-300 overflow-hidden relative p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover rounded-[1.75rem] group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-xs font-bold text-text-muted group-hover:text-primary transition-colors max-w-[5rem] truncate">
                  {c.name}
                </span>
              </Link>
            </CategoryItem>
          ))}
        </CategoryStagger>
      </div>

      {/* Restaurant Carousel 1: Popular / Top Rated */}
      <div className="max-w-6xl mx-auto mt-12 px-4 md:px-8">
        <SectionReveal>
          <RestaurantCarousel
            title="Popular Restaurants"
            subtitle="Top rated spots near you"
            items={byRating}
          />
        </SectionReveal>
      </div>

      {/* Modern Mood Selector Card */}
      <div className="max-w-6xl mx-auto mt-6 mb-12 px-4 md:px-8">
        <SectionReveal>
          <div className="rounded-[2.5rem] bg-gradient-to-r from-primary to-primary-dark p-7 md:p-10 shadow-xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 relative z-10">
              <div>
                <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                  Smart Suggestions
                </span>
                <h2 className="text-2xl md:text-3xl font-black">What&apos;s your mood?</h2>
              </div>
              <p className="text-white/80 text-xs md:text-sm max-w-sm">
                Tap any dining mood to instantly filter the best menu picks.
              </p>
            </div>

            <MoodStagger>
              {MOODS.map((m) => (
                <MoodItem key={m.id}>
                  <Link
                    href={`/restaurants?cuisine=${m.id}`}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-2xl py-3.5 px-3 transition-all duration-200 hover:-translate-y-1 text-center block"
                  >
                    <span className="text-sm font-bold text-white block">{m.name}</span>
                  </Link>
                </MoodItem>
              ))}
            </MoodStagger>
          </div>
        </SectionReveal>
      </div>

      {/* Restaurant Carousel 2: Fastest Delivery */}
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <SectionReveal>
          <RestaurantCarousel
            title="Fastest Delivery"
            subtitle="Hot meals delivered in under 30 mins"
            items={byTime}
          />
        </SectionReveal>
      </div>

      {/* Dynamic Food Fun Fact (Updates on Scroll In/Out or Refresh) */}
      <FoodFunFact />
    </main>
  );
}
