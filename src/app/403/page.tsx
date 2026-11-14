"use client";

import Link from "next/link";
import { Lock, ArrowLeft, LogIn, Compass, ShieldAlert } from "lucide-react";
import { AnimatedContent } from "@/components/react-bits/animated-content";
import { BlurText } from "@/components/react-bits/blur-text";

export default function Forbidden403Page() {
  return (
    <div className="relative min-h-[calc(100vh-14rem)] flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Ambient security glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 dark:opacity-20">
        <div className="h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
      </div>

      <div className="container-main relative z-10 max-w-2xl text-center">
        <AnimatedContent distance={35} duration={0.6} threshold={0.1}>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 shadow-2xs">
            <ShieldAlert size={13} className="text-amber-500" />
            <span>ERROR 403 • ACCESS RESTRICTED</span>
          </div>

          {/* Large Architectural 403 Watermark */}
          <div className="relative my-2 select-none">
            <span className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tighter text-foreground/10 leading-none">
              403
            </span>
          </div>

          {/* Animated Headline using BlurText */}
          <div className="-mt-8 sm:-mt-12 flex justify-center">
            <BlurText
              text="Host clearance or sign-in required."
              effect="tilt"
              animateBy="words"
              direction="bottom"
              staggerFrom="start"
              trigger="load"
              delay={40}
              stepDuration={0.4}
              blur={10}
              distance={25}
              fromColor="#d97745"
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground justify-center text-center leading-[1.15]"
            />
          </div>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted max-w-md mx-auto">
            You don&apos;t have host privileges or permissions to access this private creative workspace, reservation ledger, or listing control room.
          </p>

          {/* Action Area */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              <LogIn size={15} />
              <span>Sign In with Host Account</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors active:scale-[0.98]"
            >
              <ArrowLeft size={15} className="text-muted" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors active:scale-[0.98]"
            >
              <Compass size={15} className="text-accent" />
              <span>Explore Public Studios</span>
            </Link>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
