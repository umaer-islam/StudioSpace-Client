"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}: ShinyTextProps) {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${
        disabled
          ? "text-muted"
          : "bg-gradient-to-r from-muted via-foreground to-muted dark:from-stone-400 dark:via-white dark:to-stone-400"
      } ${className}`}
      style={{
        backgroundSize: "200% 100%",
        animation: disabled ? "none" : `shiny-text-shimmer ${speed}s ease-in-out infinite`,
      }}
    >
      {text}
    </span>
  );
}

