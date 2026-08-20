"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import { Restaurant } from "@/lib/types";

interface RestaurantCarouselProps {
  title: string;
  subtitle?: string;
  items: Restaurant[];
}

export default function RestaurantCarousel({
  title,
  subtitle,
  items,
}: RestaurantCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);

  const updateScrollBounds = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollBounds();

    // Attach scroll and resize listeners
    el.addEventListener("scroll", updateScrollBounds, { passive: true });
    window.addEventListener("resize", updateScrollBounds);

    return () => {
      el.removeEventListener("scroll", updateScrollBounds);
      window.removeEventListener("resize", updateScrollBounds);
    };
  }, [items, updateScrollBounds]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    // Scroll by ~75% of viewport container width for a smooth page-like scroll
    const scrollAmount = Math.max(320, Math.floor(el.clientWidth * 0.75));
    const target = direction === "left" ? -scrollAmount : scrollAmount;

    el.scrollBy({
      left: target,
      behavior: "smooth",
    });

    // Update bounds shortly after smooth scroll animation completes
    setTimeout(updateScrollBounds, 350);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    startScrollLeft.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.4; // Scroll multiplier
    scrollRef.current.scrollLeft = startScrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-12 relative">
      {/* Header with Title and Functional Arrow Controls */}
      <div className="flex items-center justify-between mb-5 px-4 md:px-0">
        <div>
          <h2 className="font-bold text-xl md:text-2xl text-text-main dark:text-white tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs md:text-sm font-medium text-text-muted mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Desktop Interactive Arrow Navigation */}
        <div className="hidden sm:flex items-center gap-2 select-none">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border shadow-sm ${
              canScrollLeft
                ? "bg-surface dark:bg-[#24201D] border-gray-200 dark:border-[#332E28] text-text-main dark:text-white hover:bg-primary hover:text-white hover:border-primary cursor-pointer active:scale-95"
                : "bg-gray-100/70 dark:bg-[#1A202C]/60 border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 border shadow-sm ${
              canScrollRight
                ? "bg-surface dark:bg-[#24201D] border-gray-200 dark:border-[#332E28] text-text-main dark:text-white hover:bg-primary hover:text-white hover:border-primary cursor-pointer active:scale-95"
                : "bg-gray-100/70 dark:bg-[#1A202C]/60 border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 px-4 md:px-0 scroll-smooth scrollbar-hide flex-nowrap cursor-grab active:cursor-grabbing select-none"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x proximity",
        }}
      >
        {items.map((r) => (
          <div key={r.id} style={{ scrollSnapAlign: "start" }} className="w-72 sm:w-80 flex-shrink-0">
            <RestaurantCard r={r} />
          </div>
        ))}
      </div>
    </section>
  );
}
