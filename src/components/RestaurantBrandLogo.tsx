"use client";
import React from "react";

interface BrandLogoProps {
  id: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function RestaurantBrandLogo({ id, size = "md", className = "" }: BrandLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-20 h-20 text-xl",
  }[size];

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 32,
    xl: 40,
  }[size];

  // Official Brand Logos with SVG vector emblems for all 12 Krishnagiri Restaurants
  const renderBrandSvg = () => {
    switch (id) {
      case "r1": // Hotel Sri Rajeshwari - Royal Crown
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#8A1C0E] to-[#C24A1D] border-2 border-[#FFD700] shadow-md flex items-center justify-center text-white ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 17l3-10 5 4 4-6 4 6 5-4 3 10H2z" fill="#FFD700" stroke="#FFD700" />
              <circle cx="12" cy="7" r="1" fill="white" />
              <circle cx="5" cy="10" r="1" fill="white" />
              <circle cx="19" cy="10" r="1" fill="white" />
            </svg>
          </div>
        );

      case "r2": // Annapoorna Classic - Brass Lamp
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#E86A2E] to-[#B33E0F] border-2 border-[#FFF0D4] shadow-md flex items-center justify-center text-white ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 6c-2 0-3.5 1.5-3.5 3.5 0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5C15.5 7.5 14 6 12 6z" fill="#FFE082" stroke="#FFE082" />
              <path d="M8 15h8v2H8zM10 17h4v4h-4z" fill="#FFE082" />
            </svg>
          </div>
        );

      case "r3": // Srirangam Cafe - Filter Coffee
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#2E5137] to-[#4C7A5A] border-2 border-[#F0DCC8] shadow-md flex items-center justify-center text-white ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 8h1a4 4 0 110 8h-1M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z" fill="#F0DCC8" stroke="#F0DCC8" />
              <path d="M6 2c1 1 1 2 0 3M10 2c1 1 1 2 0 3M14 2c1 1 1 2 0 3" stroke="#FFF" strokeLinecap="round" />
            </svg>
          </div>
        );

      case "r4": // Salem RR Biryani - Royal RR Crest
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#B32014] to-[#7A0D04] border-2 border-[#FFD700] shadow-md flex items-center justify-center text-[#FFD700] ${className}`}>
            <span className="font-display font-black tracking-tighter text-shadow">RR</span>
          </div>
        );

      case "r5": // Feast Pizza - Pizza Slice
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#D32F2F] to-[#9A0007] border-2 border-[#FFA000] shadow-md flex items-center justify-center text-[#FFA000] ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 22h20L12 2z" fill="#FFA000" stroke="#FFA000" />
              <circle cx="10" cy="14" r="1.5" fill="#D32F2F" />
              <circle cx="14" cy="17" r="1.5" fill="#D32F2F" />
              <circle cx="12" cy="10" r="1" fill="#D32F2F" />
            </svg>
          </div>
        );

      case "r6": // Meat And Eat - BBQ Flame Grill
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#1E1B18] to-[#38332E] border-2 border-[#FF6D00] shadow-md flex items-center justify-center text-[#FF6D00] ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" fill="#FF6D00" stroke="#FF6D00" />
            </svg>
          </div>
        );

      case "r7": // Anukrishna Sweets - Sweets Pot
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] border-2 border-[#FFC107] shadow-md flex items-center justify-center text-[#FFC107] ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3a4 4 0 00-4 4v2h8V7a4 4 0 00-4-4z" fill="#FFC107" />
              <path d="M4 11h16v6a4 4 0 01-4 4H8a4 4 0 01-4-4v-6z" fill="#FFC107" />
            </svg>
          </div>
        );

      case "r8": // Belgium Bliss - Waffle Grid
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#4E342E] to-[#2C1D1A] border-2 border-[#FFB74D] shadow-md flex items-center justify-center text-[#FFB74D] ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" fill="#FFB74D" />
              <path d="M4 10h16M4 14h16M10 4v16M14 4v16" stroke="#4E342E" strokeWidth="1.5" />
            </svg>
          </div>
        );

      case "r9": // Hotel Saravana Bhavan - Official Green Leaf
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] border-2 border-[#A5D6A7] shadow-md flex items-center justify-center text-white ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 20A7 7 0 014 13C4 8.5 7 3 12 2c5 1 8 6.5 8 11a7 7 0 01-7 7z" fill="#A5D6A7" stroke="#A5D6A7" />
              <path d="M12 2v18" stroke="#1B5E20" strokeWidth="1.5" />
            </svg>
          </div>
        );

      case "r10": // Hotel Tamilnadu TTDC - Gopuram Crest
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#A73A14] to-[#73240A] border-2 border-[#FFE082] shadow-md flex items-center justify-center text-[#FFE082] ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l3 4h-6l3-4zM7 7h10l-1 4H8L7 7zM5 12h14l-1 5H6l-1-5zM3 18h18v4H3v-4z" fill="#FFE082" />
            </svg>
          </div>
        );

      case "r11": // Tibetan Momos - Steam Dumpling
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#C62828] to-[#8E0000] border-2 border-[#FFD54F] shadow-md flex items-center justify-center text-[#FFD54F] ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 4c-5 0-9 4-9 8a5 5 0 005 5h8a5 5 0 005-5c0-4-4-8-9-8z" fill="#FFD54F" stroke="#FFD54F" />
              <path d="M12 4v4M9 5l3 3M15 5l-3 3" stroke="#C62828" strokeLinecap="round" />
            </svg>
          </div>
        );

      case "r12": // Ambur Star Biryani - Official Golden Star & Pot
        return (
          <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#6A040F] to-[#37000B] border-2 border-[#FFD700] shadow-md flex items-center justify-center text-[#FFD700] ${className}`}>
            <svg width={iconSizes} height={iconSizes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FFD700" stroke="#FFD700" />
            </svg>
          </div>
        );

      default:
        return (
          <div className={`${sizeClasses} rounded-full bg-mango text-white font-bold flex items-center justify-center ${className}`}>
            {id.toUpperCase()}
          </div>
        );
    }
  };

  return renderBrandSvg();
}
