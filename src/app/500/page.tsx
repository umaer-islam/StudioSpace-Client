"use client";

import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { AnimatedContent } from "@/components/react-bits/animated-content";
import { BlurText } from "@/components/react-bits/blur-text";
import { HoldButton } from "@/components/react-bits/hold-button";

export default function Error500Page() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-14rem)] flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Ambient error glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20">
        <div className="h-96 w-96 rounded-full bg-red-500/20 blur-3xl" />
      </div>

      <div className="container-main relative z-10 max-w-2xl text-center">
        <AnimatedContent distance={35} duration={0.6} threshold={0.1}>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-red-600 dark:text-red-400 shadow-2xs">
            <AlertTriangle size={13} className="text-red-500 animate-pulse" />
            <span>ERROR 500 • PRODUCTION INTERRUPTION</span>
          </div>

          {/* Large Architectural 500 Watermark */}
          <div className="relative my-2 select-none">
            <span className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tighter text-foreground/10 leading-none">
              500
            </span>
          </div>

          {/* Animated Headline using BlurText */}
          <div className="-mt-8 sm:-mt-12 flex justify-center">
            <BlurText
              text="Our audio & stage systems hit a snag."
              effect="blur"
              animateBy="words"
              direction="bottom"
              staggerFrom="start"
              trigger="load"
              delay={40}
              stepDuration={0.4}
              blur={10}
              distance={25}
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground justify-center text-center leading-[1.15]"
            />
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted max-w-md mx-auto">
            An unexpected glitch occurred while rendering this session. Our engineering team has been automatically flagged.
          </p>

          {/* Action Area: Liquid Hold Button + Return Home */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <HoldButton
              onHold={handleReload}
              onTap={handleReload}
              holdTime={1000}
              backgroundColor="#18181b"
              fillColor="#d97745"
              textColor="#fafafa"
              fillTextColor="#ffffff"
              doneLabel="Reloading Session..."
              doneIcon={<RotateCcw size={15} className="animate-spin" />}
              icon={<RotateCcw size={15} />}
              radius={999}
              size="md"
              glow
            >
              Hold to Reload Stage
            </HoldButton>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors active:scale-[0.98]"
            >
              <Home size={15} className="text-muted" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
