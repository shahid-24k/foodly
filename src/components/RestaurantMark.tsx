"use client";
import { useState } from "react";
import { Restaurant } from "@/lib/types";
import { Utensils } from "lucide-react";

export default function RestaurantMark({
  r,
  size = "large",
  className = "",
}: {
  r: Restaurant;
  size?: "large" | "small";
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const imgSrc = r.hero_image || `/restaurants/${r.id}.jpg`;

  if (imageError || !imgSrc) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-primary/15 via-secondary/10 to-primary/5 flex flex-col items-center justify-center p-4 text-center ${className}`}
      >
        <div className="w-12 h-12 rounded-full bg-white/80 dark:bg-black/50 shadow-sm flex items-center justify-center text-primary mb-1">
          <Utensils size={20} />
        </div>
        <span className="font-bold text-xs text-text-main dark:text-white line-clamp-1">
          {r.name}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-gray-100 dark:bg-[#1A202C] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={r.name}
        loading="lazy"
        onError={() => setImageError(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 pointer-events-none" />
    </div>
  );
}
