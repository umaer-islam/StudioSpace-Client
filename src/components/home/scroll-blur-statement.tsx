"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STATEMENT_LINES = [
  {
    text: "Where daylight meets acoustic precision.",
    className: "text-foreground",
  },
  {
    text: "Booked hourly. Zero double reservations.",
    className: "text-foreground/80",
  },
  {
    text: "Built for creators who refuse to compromise.",
    className: "text-foreground/60",
  },
];

export function ScrollBlurStatement() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Respect user preference for reduced motion
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const lines = containerRef.current?.querySelectorAll<HTMLElement>(".scroll-blur-line");
      if (!lines || lines.length === 0) return;

      lines.forEach((line) => {
        // Scroll-responsive reveal and disappear timeline scrubbed directly to viewport position
        gsap
          .timeline({
            scrollTrigger: {
              trigger: line,
              start: "top 95%",
              end: "bottom 5%",
              scrub: 0.6,
            },
          })
          .fromTo(
            line,
            {
              opacity: 0.12,
              filter: "blur(14px)",
              y: 28,
            },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 0.4,
              ease: "power2.out",
            }
          )
          .to(line, {
            // Held at maximum clarity and contrast in the optical center
            duration: 0.25,
          })
          .to(line, {
            opacity: 0.1,
            filter: "blur(14px)",
            y: -28,
            duration: 0.4,
            ease: "power2.in",
          });
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="container-main py-16 sm:py-24 md:py-32 relative overflow-hidden"
      aria-label="StudioSpace Editorial Manifesto"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:gap-4 md:gap-5 font-sans">
        {STATEMENT_LINES.map((line, idx) => (
          <p
            key={idx}
            className={`scroll-blur-line text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight leading-[1.14] select-none will-change-[filter,opacity,transform] ${line.className}`}
          >
            {line.text}
          </p>
        ))}
      </div>
    </section>
  );
}
