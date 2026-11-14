"use client";

import Link from "next/link";
import { ArrowLeft, Compass, Camera, Video, Mic2, Music2, Home } from "lucide-react";
import { AnimatedContent } from "@/components/react-bits/animated-content";
import { BlurText } from "@/components/react-bits/blur-text";

const categories = [
  { name: "Photo Studios", icon: Camera, href: "/studios?category=Photo%20Studio" },
  { name: "Film Stages", icon: Video, href: "/studios?category=Film%20Stage" },
  { name: "Podcast Lounges", icon: Mic2, href: "/studios?category=Podcast%20Lounge" },
  { name: "Music Suites", icon: Music2, href: "/studios?category=Music%20Suite" },
];

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-14rem)] flex items-center justify-center py-16 px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40 dark:opacity-20">
        <div className="h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container-main relative z-10 max-w-2xl text-center">
        <AnimatedContent distance={35} duration={0.6} threshold={0.1}>
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-accent shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
            <span>ERROR 404 • UNCHARTED SPACE</span>
          </div>

          {/* Large Architectural 404 Watermark */}
          <div className="relative my-2 select-none">
            <span className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tighter text-foreground/10 leading-none">
              404
            </span>
          </div>

          {/* Animated Headline using BlurText */}
          <div className="-mt-8 sm:-mt-12 flex justify-center">
            <BlurText
              text="This creative space is off the grid."
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
            The studio, soundstage, or reservation link you navigated to doesn&apos;t exist or may have been relocated by the host.
          </p>

          {/* Quick Category Discovery Pills */}
          <div className="mt-8 border-y border-border/60 py-6">
            <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3.5">
              Explore Available Categories
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground hover:border-foreground/30 hover:bg-surface-secondary transition-all"
                  >
                    <Icon size={14} className="text-accent" />
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/studios"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors active:scale-[0.98]"
            >
              <Compass size={15} className="text-accent" />
              <span>Browse All Studios</span>
            </Link>
          </div>
        </AnimatedContent>
      </div>
    </div>
  );
}
