"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Lightbulb } from "lucide-react";

interface FoodFact {
  id: string;
  dish: string;
  emoji: string;
  category: string;
  fact: string;
  accentColor: string;
}

const FOOD_FACTS: FoodFact[] = [
  {
    id: "biryani",
    dish: "Royal Biryani",
    emoji: "🍗",
    category: "Indian Heritage",
    fact: "The word 'Biryani' originates from the Persian word 'Birian', meaning 'fried before cooking'. Over 2.5 million plates of biryani are ordered across India every day!",
    accentColor: "from-amber-500/20 to-orange-500/20 border-orange-500/30 text-orange-600 dark:text-orange-400",
  },
  {
    id: "dosa",
    dish: "Crispy Masala Dosa",
    emoji: "🥞",
    category: "South Indian Classic",
    fact: "Dosas date back over 2,000 years! Ancient Sangam Tamil literature (1st century AD) mentions early versions of dosas enjoyed as beloved breakfast staples.",
    accentColor: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "mysore-pak",
    dish: "Mysore Pak",
    emoji: "🍯",
    category: "Sweet Tradition",
    fact: "Mysore Pak was accidentally invented in 1935 by royal chef Kakasura Madappa in the Mysore Palace when he mixed hot sugar syrup, gram flour, and pure desi ghee.",
    accentColor: "from-yellow-400/20 to-amber-600/20 border-amber-400/30 text-amber-600 dark:text-amber-300",
  },
  {
    id: "filter-coffee",
    dish: "Filter Kaapi",
    emoji: "☕",
    category: "Brew Lore",
    fact: "The famous South Indian 'Meter Coffee' pour isn't just for show! Pouring between the tumbler and davarah aerates the brew, creating the signature rich velvety froth.",
    accentColor: "from-amber-700/20 to-yellow-900/20 border-amber-700/30 text-amber-700 dark:text-amber-400",
  },
  {
    id: "chillies",
    dish: "Indian Chillies",
    emoji: "🌶️",
    category: "Spice Secrets",
    fact: "Chillies weren't native to India until Portuguese merchants introduced them in the 1500s. Before that, black pepper was the king of spice in all curries!",
    accentColor: "from-red-500/20 to-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400",
  },
  {
    id: "pizza",
    dish: "Margherita Pizza",
    emoji: "🍕",
    category: "Italian Origin",
    fact: "The classic Margherita pizza was created in 1889 in Naples to represent the Italian flag: red tomatoes, white mozzarella cheese, and green basil leaves!",
    accentColor: "from-red-500/20 to-emerald-500/20 border-red-500/30 text-red-500 dark:text-red-400",
  },
  {
    id: "paneer",
    dish: "Tandoori Paneer",
    emoji: "🧀",
    category: "Dairy Marvel",
    fact: "Paneer is one of the very few natural cheeses in the world that will never melt, making it perfect for sizzling charcoal tandoors and bubbling curries.",
    accentColor: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "parotta",
    dish: "Flaky Parotta",
    emoji: "🫓",
    category: "Street Legend",
    fact: "The multi-layered flaky texture of a Tamil Nadu parotta comes from 'beating' the dough on stone counters and rolling it into spirals before grilling.",
    accentColor: "from-amber-500/20 to-teal-500/20 border-teal-500/30 text-teal-600 dark:text-teal-400",
  },
];

export default function FoodFunFact() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const hasBeenOutOfView = useRef(false);

  const getNextIndex = (prev: number) => {
    let next = Math.floor(Math.random() * FOOD_FACTS.length);
    if (next === prev) {
      next = (prev + 1) % FOOD_FACTS.length;
    }
    return next;
  };

  const handleNextFact = () => {
    setIsRotating(true);
    setCurrentIndex((prev) => getNextIndex(prev));
    setTimeout(() => setIsRotating(false), 500);
  };

  // When user scrolls away and comes back, change the fact dynamically
  const handleViewportEnter = () => {
    if (hasBeenOutOfView.current) {
      setCurrentIndex((prev) => getNextIndex(prev));
      hasBeenOutOfView.current = false;
    }
  };

  const handleViewportLeave = () => {
    hasBeenOutOfView.current = true;
  };

  const currentFact = FOOD_FACTS[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      onViewportEnter={handleViewportEnter}
      onViewportLeave={handleViewportLeave}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-4xl mx-auto px-4 md:px-8 mt-12 mb-6"
    >
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-white via-surface to-sky-50/40 dark:from-[#1A202C] dark:via-[#161B26] dark:to-[#12161F] border border-gray-200/80 dark:border-white/10 p-6 md:p-8 shadow-[0_12px_40px_rgb(0,0,0,0.08)] overflow-hidden transition-colors">
        {/* Subtle Background Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-secondary/15 to-primary/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#A78BFA]">
              <Lightbulb size={18} />
            </span>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary dark:text-[#A78BFA] block">
                Foodie Bite &bull; Did You Know?
              </span>
            </div>
          </div>

          <button
            onClick={handleNextFact}
            title="Discover another fact"
            className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gray-100 hover:bg-primary hover:text-white dark:bg-white/10 dark:hover:bg-primary text-text-muted dark:text-white transition-all shadow-sm active:scale-95"
          >
            <RefreshCw
              size={13}
              className={`transition-transform duration-500 ${
                isRotating ? "rotate-180" : "group-hover:rotate-45"
              }`}
            />
            <span>Next Fact</span>
          </button>
        </div>

        {/* Animated Fact Card Content */}
        <div className="relative min-h-[90px] flex items-center z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFact.id}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Emoji Dish Icon Badge */}
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-gray-100 to-white dark:from-white/10 dark:to-white/5 border border-gray-200/60 dark:border-white/10 shadow-sm text-3xl select-none">
                {currentFact.emoji}
              </div>

              {/* Text Description */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-base text-text-main dark:text-white">
                    {currentFact.dish}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-text-muted dark:text-gray-300">
                    {currentFact.category}
                  </span>
                </div>
                <p className="text-sm md:text-base text-text-muted dark:text-[#A0AEC0] leading-relaxed">
                  &ldquo;{currentFact.fact}&rdquo;
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer info tip */}
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-[11px] text-text-muted/80 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Sparkles size={12} className="text-secondary" />
            Scroll away and return anytime to discover a new dish fact!
          </span>
          <span className="hidden sm:inline font-medium">
            Fact #{currentIndex + 1} of {FOOD_FACTS.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
