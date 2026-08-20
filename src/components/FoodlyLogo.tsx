"use client";
import React, { useState } from "react";

interface FoodlyLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
  href?: string;
}

export default function FoodlyLogo({
  size = "md",
  variant = "full",
  className = "",
}: FoodlyLogoProps) {
  const [useFallback, setUseFallback] = useState(false);

  // Size definitions
  const dimensions = {
    sm: { icon: "w-7 h-7", text: "text-2xl", height: 28 },
    md: { icon: "w-8 h-8", text: "text-3xl", height: 34 },
    lg: { icon: "w-11 h-11", text: "text-4xl", height: 44 },
  }[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {!useFallback ? (
        <div className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/foodly-icon.svg"
            alt="Foodly"
            onError={() => setUseFallback(true)}
            className={`${dimensions.icon} rounded-2xl shadow-sm object-contain hover:rotate-6 transition-transform`}
          />
        </div>
      ) : (
        <div
          className={`${dimensions.icon} rounded-2xl bg-gradient-to-br from-primary via-[#074D37] to-secondary flex items-center justify-center shadow-md text-white`}
        >
          {/* Food Cloche / Heart Mark */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3" />
            <path d="M6 15H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3" />
            <path d="M12 4v2" />
            <path d="M4 15a8 8 0 0 0 16 0" />
            <path d="M2 19h20" />
          </svg>
        </div>
      )}

      {variant === "full" && (
        <div className="flex items-baseline leading-none">
          <span
            className={`font-foodly font-bold tracking-wide text-text-main dark:text-white ${dimensions.text} transition-colors`}
          >
            FOOD<span className="text-primary dark:text-emerald-400">LY</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary ml-1 self-center animate-pulse" />
        </div>
      )}
    </div>
  );
}
