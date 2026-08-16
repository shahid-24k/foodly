"use client";
import React, { useState } from "react";
import { Utensils } from "lucide-react";

interface RestaurantLogoProps {
  id: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export default function RestaurantLogo({ id, name = "", size = "md", className = "" }: RestaurantLogoProps) {
  const [imgError, setImgError] = useState(false);
  const imgSrc = `/restaurants/${id}.jpg`;

  const sizeClasses = {
    xs: "w-6 h-6 text-[9px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  }[size];

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 shadow-sm flex items-center justify-center flex-shrink-0 border border-white dark:border-[#2D3748] ${sizeClasses} ${className}`}
    >
      {!imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={name || "Restaurant"}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
          <Utensils size={size === "lg" ? 20 : size === "md" ? 16 : 12} />
        </div>
      )}
    </div>
  );
}
