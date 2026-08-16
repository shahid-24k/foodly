"use client";
import { useState } from "react";
import { Utensils } from "lucide-react";

export default function FoodImage({
  src, id, alt = "", className = "",
}: { src: string | null; id?: string; alt?: string; className?: string }) {
  const [step, setStep] = useState<"primary" | "fallback" | "failed">("primary");

  const primarySrc = src || (id ? `/menu/${id}.jpg` : null);
  const fallbackSrc = id && src && src !== `/menu/${id}.jpg` ? `/menu/${id}.jpg` : null;

  const currentSrc = step === "primary" ? primarySrc : fallbackSrc;

  if (step === "failed" || !currentSrc) {
    return (
      <div className={`${className} bg-chip border border-line flex items-center justify-center`}>
        <Utensils className="w-1/3 h-1/3 text-[#9A9488]" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (step === "primary" && fallbackSrc) {
          setStep("fallback");
        } else {
          setStep("failed");
        }
      }}
      className={`${className} object-cover`}
    />
  );
}
