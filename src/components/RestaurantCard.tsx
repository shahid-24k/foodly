import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Restaurant } from "@/lib/types";
import RestaurantMark from "./RestaurantMark";
import FavoriteButton from "./FavoriteButton";

export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <Link
      href={`/restaurants/${r.id}`}
      className="group text-left w-64 md:w-72 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-[#24201D] border border-line dark:border-[#332E28] hover:border-mango transition-all duration-200 relative block shadow-xs hover:shadow-md"
    >
      <div className="relative h-36 md:h-40 border-b border-line dark:border-[#332E28]">
        <RestaurantMark r={r} size="small" />
        <FavoriteButton restaurantId={r.id} />
        {r.offer && (
          <span className="absolute top-3 left-3 bg-white dark:bg-[#1C1A18] border border-line dark:border-[#332E28] eyebrow text-[10px] font-bold px-2 py-1 text-mango uppercase shadow-xs">
            {r.offer}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-charcoal dark:text-white text-sm leading-tight group-hover:text-mango transition-colors">
            {r.name}
          </h3>
          <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-mango bg-mango/10 flex items-center justify-center">
            <span className="text-[10px] font-black text-mango">{r.rating}</span>
          </div>
        </div>
        <p className="text-xs text-[#9A9488] dark:text-[#8C8477] mt-1 line-clamp-1">{r.cuisine}</p>
        <div className="flex items-center gap-1 mt-2 eyebrow text-[10px] font-semibold text-[#9A9488] dark:text-[#8C8477] uppercase">
          <MapPin size={11} className="text-mango" /> {r.locality}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-line dark:border-[#332E28]">
          <span className="flex items-center gap-1 text-xs font-medium text-[#9A9488] dark:text-[#8C8477]">
            <Clock size={12} className="text-mango" /> {r.delivery_time} min
          </span>
          <span className="text-xs font-bold text-charcoal dark:text-white">{r.price_range}</span>
        </div>
      </div>
    </Link>
  );
}
