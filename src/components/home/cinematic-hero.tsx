"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Search,
  ChevronRight,
  ShieldCheck,
  Star,
  Activity,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScenePreset {
  id: string;
  studioId: string;
  number: string;
  title: string;
  location: string;
  hourlyRate: number;
  capacity: number;
  rating: number;
  reviews: number;
  aspectRatio: string;
  specs: {
    dimensions: string;
    daylight: string;
    power: string;
    sound: string;
  };
  image: string;
  tagline: string;
}

const CINEMATIC_SCENES: ScenePreset[] = [
  {
    id: "scene-daylight",
    studioId: "6af759833158a0c2b1057962",
    number: "01",
    title: "Lumina Daylight & Cyc Wall",
    location: "DUMBO · Brooklyn, NY",
    hourlyRate: 95,
    capacity: 25,
    rating: 4.98,
    reviews: 38,
    aspectRatio: "2.39:1 Anamorphic",
    specs: {
      dimensions: "2,200 sq ft · 16ft Cyc",
      daylight: "North-Facing Daylight",
      power: "3-Phase 100A Camlock",
      sound: "NRC 0.85 Acoustic Baffles",
    },
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=90",
    tagline: "Natural sunlight sweeps across 2,200 sq ft of seamless white cyc wall in historic DUMBO.",
  },
  {
    id: "scene-cinema",
    studioId: "6af759833158a0c2b1057963",
    number: "02",
    title: "Industrial Cinema Soundstage",
    location: "Long Island City · Queens, NY",
    hourlyRate: 80,
    capacity: 35,
    rating: 4.88,
    reviews: 29,
    aspectRatio: "1.85:1 Widescreen",
    specs: {
      dimensions: "3,800 sq ft · 22ft Trusses",
      daylight: "100% Blackout Capable",
      power: "Distro Box 200A",
      sound: "Drive-In Loading & Silent HVAC",
    },
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=90",
    tagline: "Heavy-timber factory architecture converted into a sprawling cinema production soundstage.",
  },
  {
    id: "scene-music",
    studioId: "6af759833158a0c2b1057964",
    number: "03",
    title: "SoHo Minimalist Atelier",
    location: "SoHo · Manhattan, NY",
    hourlyRate: 110,
    capacity: 18,
    rating: 5.0,
    reviews: 42,
    aspectRatio: "16:9 Digital Cinema",
    specs: {
      dimensions: "1,600 sq ft · Archival Props",
      daylight: "Direct Afternoon Sun",
      power: "Isolated Clean Studio Audio",
      sound: "Double-Wall Sound Isolation",
    },
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2000&q=90",
    tagline: "Curated architectural furniture, archival paper backdrops, and gallery-level aesthetic.",
  },
];

export function CinematicHero() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const slateCardRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [isAudioActive, setIsAudioActive] = useState(false);

  const activeScene = CINEMATIC_SCENES[activeIdx];

  // GSAP Animations: ScrollTrigger Parallax, Text Blur Reveal & Entry Timelines
  useGSAP(
    () => {
      // 1. Initial Load Editorial Text Reveal (Blur -> Sharp + Staggered Rise)
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: -15, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
      )
        .fromTo(
          ".hero-title-word",
          { opacity: 0, y: 35, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.5"
        )
        .fromTo(
          ".hero-subhead",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-search-dock",
          { opacity: 0, y: 25, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-slate-card",
          { opacity: 0, x: 40, filter: "blur(8px)" },
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
          "-=0.6"
        );

      // 2. ScrollTrigger Parallax Scrub
      gsap.to(".hero-parallax-bg", {
        y: 160,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-left-content", {
        y: -90,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-slate-card", {
        y: -140,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: heroRef }
  );

  // 3D Parallax Tilt Handler for the Production Slate Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    setMousePos({ x: clientX, y: clientY });

    if (slateCardRef.current) {
      const rect = slateCardRef.current.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      const rotateX = ((clientY - cardCenterY) / (rect.height / 2)) * -8;
      const rotateY = ((clientX - cardCenterX) / (rect.width / 2)) * 8;
      setCardTilt({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/studios");
      return;
    }
    router.push(`/studios?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[96vh] w-full overflow-hidden flex flex-col justify-between -mt-24 sm:-mt-28 pt-28 sm:pt-36 pb-10"
    >
      {/* Interactive Radial Spotlight (React Bits Spotlight effect) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(217, 119, 69, 0.15), transparent 60%)`,
        }}
      />

      {/* Cinematic Parallax Background Layer with Anamorphic Crossfade */}
      <div className="hero-parallax-bg absolute inset-0 -z-20 overflow-hidden bg-black">
        {CINEMATIC_SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              activeIdx === idx
                ? "opacity-60 scale-100 filter-none"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <Image
              src={scene.image}
              alt={scene.title}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Cinematic Film Vignette & Multi-gradient Tone Falloff */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Main Content Stage */}
      <div className="container-main relative z-10 w-full flex-1 flex flex-col justify-center py-6 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Editorial Headline & Floating Search Dock */}
          <div className="hero-left-content lg:col-span-7 flex flex-col justify-center">
            {/* Top Cinema Slate & REC Indicator */}
            <div className="hero-badge mb-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/85 px-3.5 py-1 text-[11px] font-bold tracking-wider backdrop-blur-md shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-foreground tracking-[0.16em] uppercase">REC · LIVE SOUNDSTAGE INVENTORY</span>
              </div>

              <span className="hidden sm:inline-block text-xs font-semibold text-muted">
                {activeScene.location}
              </span>

              {/* Interactive Audio Spectrum Simulation Button */}
              <button
                type="button"
                onClick={() => setIsAudioActive(!isAudioActive)}
                className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-mono transition-all ${
                  isAudioActive
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border/80 bg-background/60 text-muted hover:text-foreground"
                }`}
                title="Toggle ambient acoustics visualizer"
              >
                <Activity size={12} className={isAudioActive ? "animate-pulse text-accent" : ""} />
                <span>{isAudioActive ? "ACOUSTICS ACTIVE" : "STC-65 ISOLATION"}</span>
                {/* Micro audio bars */}
                <span className="flex items-end gap-0.5 h-3 ml-1">
                  <span className={`w-0.5 rounded-full bg-current transition-all ${isAudioActive ? "h-3 animate-bounce" : "h-1"}`} />
                  <span className={`w-0.5 rounded-full bg-current transition-all ${isAudioActive ? "h-2.5 animate-pulse" : "h-1.5"}`} />
                  <span className={`w-0.5 rounded-full bg-current transition-all ${isAudioActive ? "h-3.5 animate-bounce" : "h-2"}`} />
                </span>
              </button>
            </div>

            {/* GSAP Staggered Blur Reveal Headline */}
            <h1 className="text-balance text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.04]">
              <span className="hero-title-word inline-block mr-3">Where</span>
              <span className="hero-title-word inline-block mr-3">Vision</span>
              <br />
              <span className="hero-title-word inline-block text-transparent bg-clip-text bg-gradient-to-r from-foreground via-accent to-foreground/90">
                Takes Form.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subhead mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-muted">
              {activeScene.tagline}
            </p>

            {/* Clean Interactive Floating Search Dock */}
            <div className="hero-search-dock mt-8 max-w-xl">
              <form
                onSubmit={handleSearchSubmit}
                className="group relative flex items-center rounded-full border border-border/90 bg-background/95 p-1.5 shadow-xl backdrop-blur-2xl transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20"
              >
                <div className="flex flex-1 items-center gap-3 pl-4">
                  <Search size={17} className="text-muted group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search daylight lofts, cyc walls, soundstages..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground placeholder:text-muted/60 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-xs font-bold text-background transition-transform active:scale-95 hover:opacity-90 shrink-0"
                >
                  <span>Explore</span>
                  <ArrowRight size={13} />
                </button>
              </form>

              {/* Quick Preset Filter Pills */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-muted font-bold uppercase tracking-wider text-[10px]">Filter:</span>
                <button
                  type="button"
                  onClick={() => router.push("/studios?category=Photo+Studio")}
                  className="rounded-full border border-border/80 bg-surface/80 px-2.5 py-0.5 text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  Photo Cycloramas
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/studios?category=Film+Stage")}
                  className="rounded-full border border-border/80 bg-surface/80 px-2.5 py-0.5 text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  Film Soundstages
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/studios?category=Podcast+Lounge")}
                  className="rounded-full border border-border/80 bg-surface/80 px-2.5 py-0.5 text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  Podcast Rooms
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/studios?category=Music+Suite")}
                  className="rounded-full border border-border/80 bg-surface/80 px-2.5 py-0.5 text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  Music Suites
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Production Slate Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={slateCardRef}
              style={{
                transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                transition: "transform 0.15s ease-out",
              }}
              className="hero-slate-card relative w-full max-w-md rounded-3xl border border-white/20 bg-background/90 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-surface/90"
            >
              {/* Slate Header Tape */}
              <div className="flex items-center justify-between border-b border-border pb-3 text-[11px] font-mono uppercase tracking-widest text-muted">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  <span>SCENE SLATE: {activeScene.number}</span>
                </div>
                <span>FPS: 24 · 35MM</span>
              </div>

              {/* Aspect Ratio Preview Window */}
              <div className="relative mt-3.5 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-secondary border border-border/80">
                <Image
                  src={activeScene.image}
                  alt={activeScene.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Aspect Overlay Label */}
                <div className="absolute top-2.5 left-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-mono text-white/90 backdrop-blur-xs">
                  {activeScene.aspectRatio}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur-md">
                  <Star size={11} className="text-amber-500 fill-amber-500" />
                  <span>{activeScene.rating}</span>
                  <span className="text-muted text-[10px]">({activeScene.reviews})</span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2.5 inset-x-2.5 rounded-xl border border-white/15 bg-black/60 p-2.5 text-white backdrop-blur-md">
                  <p className="text-xs font-bold line-clamp-1">{activeScene.title}</p>
                  <p className="text-[10px] text-white/70 line-clamp-1 mt-0.5">{activeScene.specs.dimensions}</p>
                </div>
              </div>

              {/* Dynamic Technical Specs Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-border bg-surface-secondary/60 p-2.5">
                  <p className="text-[10px] font-mono text-muted uppercase">Natural Light</p>
                  <p className="text-xs font-bold text-foreground mt-0.5 truncate">{activeScene.specs.daylight}</p>
                </div>

                <div className="rounded-xl border border-border bg-surface-secondary/60 p-2.5">
                  <p className="text-[10px] font-mono text-muted uppercase">Production Power</p>
                  <p className="text-xs font-bold text-foreground mt-0.5 truncate">{activeScene.specs.power}</p>
                </div>

                <div className="rounded-xl border border-border bg-surface-secondary/60 p-2.5">
                  <p className="text-[10px] font-mono text-muted uppercase">Acoustic Isolation</p>
                  <p className="text-xs font-bold text-foreground mt-0.5 truncate">{activeScene.specs.sound}</p>
                </div>

                <div className="rounded-xl border border-accent/20 bg-accent/10 p-2.5">
                  <p className="text-[10px] font-mono text-accent uppercase">Hourly Rate</p>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">
                    ${activeScene.hourlyRate}
                    <span className="text-[10px] text-muted font-normal"> / hour</span>
                  </p>
                </div>
              </div>

              {/* Direct Booking Link CTA */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-muted">
                  <ShieldCheck size={14} className="text-accent" />
                  <span>Instant Confirmation</span>
                </div>

                <Link
                  href={`/studios/${activeScene.studioId}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90"
                >
                  <span>Book Space</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Interactive Soundstage Scene Navigator */}
      <div className="container-main relative z-10 w-full pt-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border/70 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted">
              SELECT SOUNDSTAGE:
            </span>
            <div className="flex items-center gap-1.5">
              {CINEMATIC_SCENES.map((scene, index) => {
                const isActive = activeIdx === index;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => setActiveIdx(index)}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold font-mono transition-all ${
                      isActive
                        ? "bg-foreground text-background shadow-sm"
                        : "border border-border/80 bg-background/80 text-muted hover:text-foreground hover:border-foreground/40"
                    }`}
                  >
                    <span>{scene.number}</span>
                    <span className="hidden md:inline font-sans font-medium text-[11px]">
                      {scene.title.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-muted">
            <Link
              href="/studios"
              className="inline-flex items-center gap-1 font-bold text-accent hover:underline"
            >
              <span>Explore All 12 Curated Studios</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
