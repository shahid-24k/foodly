import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { Restaurant } from "@/lib/types";
import RestaurantMark from "./RestaurantMark";
import FavoriteButton from "./FavoriteButton";

export default function RestaurantCard({
  r,
  className = "",
}: {
  r: Restaurant;
  className?: string;
}) {
  // Clean locality to remove repetitive city suffixes
  const cleanLocality = r.locality
    ? r.locality
        .replace(/,\s*Krishnagiri/i, "")
        .replace(/Krishnagiri\s*Locality/i, "Central Town")
        .replace(/Krishnagiri\s*Town/i, "Town Center")
    : "Nearby";

  return (
    <Link
      href={`/restaurants/${r.id}`}
      className={`group text-left w-full min-w-0 rounded-[2rem] overflow-hidden bg-surface dark:bg-[#24201D] border border-gray-100/80 dark:border-[#332E28] hover:border-primary/30 transition-all duration-300 relative flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgb(0,0,0,0.12)] hover:-translate-y-1 ${className}`}
    >
      {/* Top Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-[#1A202C]">
        <RestaurantMark r={r} size="small" />
        <FavoriteButton restaurantId={r.id} />
        {r.offer && (
          <div className="absolute top-4 left-4 bg-white/95 dark:bg-[#1A202C]/90 backdrop-blur-md text-primary text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-md">
            {r.offer}
          </div>
        )}
      </div>

      {/* Card Info Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-text-main dark:text-white text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {r.name}
            </h3>
            <div className="flex-shrink-0 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              <Star size={12} className="fill-emerald-600 text-emerald-600 dark:fill-emerald-400 dark:text-emerald-400" />
              <span className="text-xs font-black">{r.rating}</span>
            </div>
          </div>

          <p className="text-xs font-medium text-text-muted dark:text-[#8C8477] line-clamp-1 mb-2">
            {r.cuisine}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-text-muted dark:text-[#8C8477]">
            <MapPin size={13} className="text-secondary flex-shrink-0" />
            <span className="truncate">{cleanLocality}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-gray-100 dark:border-[#332E28]/60">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-main dark:text-gray-200">
            <Clock size={14} className="text-secondary" />
            <span>{r.delivery_time} mins</span>
          </div>
          <span className="text-xs font-bold text-primary dark:text-secondary bg-primary/10 dark:bg-primary/20 px-2.5 py-1 rounded-full">
            {r.price_range === "₹" ? "Budget friendly" : r.price_range === "₹₹₹" ? "Premium" : "Popular price"}
          </span>
        </div>
      </div>
    </Link>
  );
}
