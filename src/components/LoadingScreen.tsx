"use client";

import { useEffect, useState } from "react";
import { HandwritingSvg } from "@/components/ui/handwriting-svg";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
    const removeTimer = setTimeout(() => setVisible(false), 3600);
    const safetyTimer = setTimeout(() => setVisible(false), 4200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-out select-none ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={fadeOut}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center">
        <HandwritingSvg
          text="FOODLY"
          width={320}
          height={80}
          fontSize={64}
          strokeWidth={1.6}
          duration={2.6}
          delay={0.2}
          className="text-white"
        />
      </div>
    </div>
  );
}
