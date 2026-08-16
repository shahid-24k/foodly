"use client";
import { Restaurant } from "@/lib/types";

const MARKS: Record<string, string> = {
  r1: "SR", r2: "AC", r3: "SC", r4: "RR", r5: "FP", r6: "M&E", r7: "AS", r8: "BB",
  r9: "SB", r10: "TT", r11: "TM", r12: "AB",
};

const BRAND_THEMES: Record<string, { bg: string; ring: string; text: string; sub: string }> = {
  r1:  { bg: "bg-[#FDF6F0] dark:bg-[#251D18]", ring: "border-[#E86A2E]/30", text: "text-[#E86A2E]", sub: "text-[#8A3B18]" },
  r2:  { bg: "bg-[#F7F4EF] dark:bg-[#1E201B]", ring: "border-[#C24A1D]/30", text: "text-[#C24A1D]", sub: "text-[#6E2A10]" },
  r3:  { bg: "bg-[#F0F5F1] dark:bg-[#172019]", ring: "border-[#4C7A5A]/30", text: "text-[#4C7A5A]", sub: "text-[#2D4936]" },
  r4:  { bg: "bg-[#FAF0E6] dark:bg-[#241A14]", ring: "border-[#8A2B08]/30", text: "text-[#8A2B08]", sub: "text-[#591C05]" },
  r5:  { bg: "bg-[#FFF8F2] dark:bg-[#261E1A]", ring: "border-[#E86A2E]/30", text: "text-[#E86A2E]", sub: "text-[#8A3B18]" },
  r6:  { bg: "bg-[#FDF2EE] dark:bg-[#261B17]", ring: "border-[#C24A1D]/30", text: "text-[#C24A1D]", sub: "text-[#6E2A10]" },
  r7:  { bg: "bg-[#F3F7F4] dark:bg-[#1A221C]", ring: "border-[#4C7A5A]/30", text: "text-[#4C7A5A]", sub: "text-[#2D4936]" },
  r8:  { bg: "bg-[#FFF5F0] dark:bg-[#271D1A]", ring: "border-[#E86A2E]/30", text: "text-[#E86A2E]", sub: "text-[#8A3B18]" },
  r9:  { bg: "bg-[#F2F7F3] dark:bg-[#19221B]", ring: "border-[#4C7A5A]/30", text: "text-[#4C7A5A]", sub: "text-[#2D4936]" },
  r10: { bg: "bg-[#FDF3EE] dark:bg-[#271B16]", ring: "border-[#C24A1D]/30", text: "text-[#C24A1D]", sub: "text-[#6E2A10]" },
  r11: { bg: "bg-[#FFF6F0] dark:bg-[#261D18]", ring: "border-[#E86A2E]/30", text: "text-[#E86A2E]", sub: "text-[#8A3B18]" },
  r12: { bg: "bg-[#FAF0E8] dark:bg-[#261914]", ring: "border-[#8A2B08]/30", text: "text-[#8A2B08]", sub: "text-[#591C05]" },
};

export default function RestaurantMark({ r, size = "large" }: { r: Restaurant; size?: "large" | "small" }) {
  const big = size === "large";
  const mark = MARKS[r.id] || r.name.slice(0, 2).toUpperCase();
  const theme = BRAND_THEMES[r.id] || BRAND_THEMES.r1;

  return (
    <div className={`absolute inset-0 ${theme.bg} overflow-hidden flex items-center justify-center`}>
      {/* Signature Concentric Steel Tiffin Carrier Stack Rings */}
      <div className={`absolute rounded-full border-2 ${theme.ring} ${big ? "w-56 h-56" : "w-28 h-28"}`} />
      <div className={`absolute rounded-full border-2 ${theme.ring} ${big ? "w-36 h-36" : "w-18 h-18"}`} />
      <div className={`absolute rounded-full border ${theme.ring} scale-125 ${big ? "w-24 h-24" : "w-12 h-12"}`} />

      {/* Brand Logo Emblem Badge */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 p-2 text-center">
        <div className={`rounded-full bg-white dark:bg-[#24201D] border-2 border-mango shadow-md flex items-center justify-center ${
          big ? "w-16 h-16 md:w-20 md:h-20" : "w-11 h-11 md:w-12 md:h-12"
        }`}>
          <span className={`font-display font-black tracking-tighter ${theme.text} ${big ? "text-xl md:text-2xl" : "text-sm md:text-base"}`}>
            {mark}
          </span>
        </div>

        {big ? (
          <>
            <span className="eyebrow font-black text-charcoal dark:text-white uppercase tracking-widest text-xs md:text-sm px-4 mt-1">
              {r.name}
            </span>
            {r.since && (
              <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.sub}`}>
                {r.since} &middot; {r.locality.split(",")[0]}
              </span>
            )}
          </>
        ) : (
          <span className="eyebrow text-[9px] font-bold text-charcoal/80 dark:text-white/80 uppercase tracking-wider line-clamp-1 px-2">
            {r.name}
          </span>
        )}
      </div>
    </div>
  );
}
