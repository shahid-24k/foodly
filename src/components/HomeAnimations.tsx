"use client";

import { ReactNode } from "react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

export function HeroReveal({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal direction="up" duration={0.7} delay={0.1}>
      {children}
    </ScrollReveal>
  );
}

export function HeroImageReveal({ children }: { children: ReactNode }) {
  return (
    <ScrollReveal direction="right" duration={0.8} delay={0.3}>
      {children}
    </ScrollReveal>
  );
}

export function SectionReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <ScrollReveal direction="up" delay={delay} className={className}>
      {children}
    </ScrollReveal>
  );
}

export function CategoryStagger({ children }: { children: ReactNode }) {
  return (
    <StaggerContainer
      className="flex gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-hide px-1 -mx-1 flex-nowrap"
      staggerDelay={0.06}
    >
      {children}
    </StaggerContainer>
  );
}

export function CategoryItem({ children, className }: { children: ReactNode; className?: string }) {
  return <StaggerItem className={className}>{children}</StaggerItem>;
}

export function MoodStagger({ children }: { children: ReactNode }) {
  return (
    <StaggerContainer
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10"
      staggerDelay={0.07}
    >
      {children}
    </StaggerContainer>
  );
}

export function MoodItem({ children, className }: { children: ReactNode; className?: string }) {
  return <StaggerItem className={className}>{children}</StaggerItem>;
}
