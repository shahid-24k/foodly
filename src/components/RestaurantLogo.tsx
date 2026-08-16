"use client";
import React from "react";

const MARKS: Record<string, string> = {
  r1: "SR", r2: "AC", r3: "SC", r4: "RR", r5: "FP", r6: "M&E", r7: "AS", r8: "BB",
  r9: "SB", r10: "TT", r11: "TM", r12: "AB",
};

interface RestaurantLogoProps {
  id: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export default function RestaurantLogo({ id, name = "", size = "md", className = "" }: RestaurantLogoProps) {
  const mark = MARKS[id] || name.slice(0, 2).toUpperCase() || "FL";

  const sizeClasses = {
    xs: "w-6 h-6 text-[9px] border",
    sm: "w-8 h-8 text-xs border-1.5",
    md: "w-10 h-10 text-sm border-2",
    lg: "w-14 h-14 text-base border-2",
  }[size];

  return (
    <div className={`relative rounded-full bg-white dark:bg-[#24201D] border-mango shadow-xs flex items-center justify-center flex-shrink-0 ${sizeClasses} ${className}`}>
      {/* Signature Tiffin Concentric Ring accent */}
      <div className="absolute inset-0 rounded-full border border-ring/80 dark:border-ring/40 scale-125 pointer-events-none" />
      <span className="font-display font-black tracking-tighter text-mango">
        {mark}
      </span>
    </div>
  );
}
