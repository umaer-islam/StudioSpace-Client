"use client";

import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function ScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}

