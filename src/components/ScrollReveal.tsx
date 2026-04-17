"use client";

import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-in-up" | "fade-in" | "slide-in-left" | "slide-in-right";
  delay?: number;
}

export function ScrollReveal({
  children,
  className = "",
}: ScrollRevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
