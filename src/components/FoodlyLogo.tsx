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
    sm: { icon: "w-7 h-7", text: "text-lg", height: 28 },
    md: { icon: "w-8 h-8", text: "text-xl", height: 34 },
    lg: { icon: "w-10 h-10", text: "text-2xl", height: 42 },
  }[size];

  // If user provided a centralized brand asset at /brand/foodly-logo.png or /brand/foodly-logo.svg
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {!useFallback ? (
        <div className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={variant === "icon" ? "/brand/foodly-icon.svg" : "/brand/foodly-icon.svg"}
            alt="Foodly"
            onError={() => setUseFallback(true)}
            className={`${dimensions.icon} rounded-xl shadow-sm object-contain`}
          />
        </div>
      ) : (
        <div
          className={`${dimensions.icon} rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm text-white`}
        >
          {/* Modern cloche / delivery mark */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 15h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3" />
            <path d="M6 15H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3" />
            <path d="M12 4v2" />
            <path d="M4 15a8 8 0 0 0 16 0" />
            <path d="M2 19h20" />
          </svg>
        </div>
      )}

      {variant === "full" && (
        <div className="flex items-baseline">
          <span className={`font-black tracking-tight text-text-main dark:text-white ${dimensions.text}`}>
            FOOD<span className="text-primary">LY</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary ml-0.5 self-center mb-1"></span>
        </div>
      )}
    </div>
  );
}
