"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export function SplitText({
  text,
  className = "",
  delay = 0,
  duration = 0.6,
  stagger = 0.02,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const chars = containerRef.current?.querySelectorAll(".split-char");
      if (!chars || chars.length === 0) return;

      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: 18,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          stagger,
          delay,
          ease: "power2.out",
        }
      );
    },
    { scope: containerRef }
  );

  const words = text.split(" ");

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap">
          {word.split("").map((char, cIdx) => (
            <span key={cIdx} className="split-char inline-block">
              {char}
            </span>
          ))}
          {wIdx < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

