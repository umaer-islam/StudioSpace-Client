"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Search,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Star,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import DotGrid from "@/components/react-bits/dot-grid";

interface StudioSlide {
  id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  capacity: number;
  rating: number;
  reviews: number;
  sqft: string;
  image: string;
  features: string[];
}

const FEATURED_SLIDES: StudioSlide[] = [
  {
    id: "6af759833158a0c2b1057962",
    title: "Lumina Daylight & Cyc Wall Loft",
    category: "Photo Studio",
    location: "DUMBO · Brooklyn, NY",
    hourlyRate: 95,
    capacity: 25,
    rating: 4.98,
    reviews: 38,
    sqft: "2,200 sq ft",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=85",
    features: ["16ft White Cyclorama", "Corner Daylight", "Profoto D2 Lighting Kit"],
  },
  {
    id: "6af759833158a0c2b1057963",
    title: "The Industrial Sunlit Soundstage",
    category: "Film Stage",
    location: "Long Island City · Queens, NY",
    hourlyRate: 80,
    capacity: 35,
    rating: 4.88,
    reviews: 29,
    sqft: "3,800 sq ft",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
    features: ["South-Facing Windows", "Loading Dock", "200A Distro Power"],
  },
  {
    id: "6af759833158a0c2b1057964",
    title: "Minimalist Editorial Atelier",
    category: "Podcast & Music Suite",
    location: "SoHo · Manhattan, NY",
    hourlyRate: 110,
    capacity: 18,
    rating: 5.0,
    reviews: 42,
    sqft: "1,600 sq ft",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=85",
    features: ["Archival Designer Props", "12 Backdrop Colors", "Acoustic Isolation"],
  },
];

const CATEGORY_TABS = [
  { label: "All Spaces", value: "All" },
  { label: "Photo Studios", value: "Photo Studio" },
  { label: "Film Stages", value: "Film Stage" },
  { label: "Podcast Rooms", value: "Podcast Lounge" },
  { label: "Music Suites", value: "Music Suite" },
];

export function HeroShowcase() {
  const router = useRouter();
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchLocation, setSearchLocation] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const currentStudio = FEATURED_SLIDES[activeSlide];

  // GSAP Entrance & ScrollTrigger Setup
  useGSAP(
    () => {
      // 1. Staggered Entrance Animation Timeline
      const tl = gsap.timeline();
      tl.fromTo(
        ".hero-anim-badge",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
        .fromTo(
          ".hero-anim-title",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-anim-subhead",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          ".hero-anim-dock",
          { opacity: 0, y: 25, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(
          ".hero-anim-card",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        );

      // 2. ScrollTrigger Parallax
      gsap.to(".hero-anim-card", {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: heroContainerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-left-block", {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: heroContainerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: heroContainerRef }
  );

  // Auto-slide every 6 seconds unless user pauses / interacts
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set("search", searchLocation.trim());
    if (activeCategory && activeCategory !== "All") params.set("category", activeCategory);
    const qs = params.toString();
    router.push(`/studios${qs ? `?${qs}` : ""}`);
  };

  return (
    <section
      ref={heroContainerRef}
      className="relative container-main py-10 md:py-16 lg:py-20 overflow-hidden rounded-3xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Interactive WebGL DotGrid Canvas (React Bits) */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-50 dark:opacity-40">
        <DotGrid
          baseColor="#9ca3af"
          activeColor="#d97745"
          shape="circle"
          dotSize={3}
          gap={24}
          proximity={130}
          strength={0.8}
          bounce={0.35}
          tension={0.3}
          returnDuration={1.2}
          shockRadius={300}
          shockStrength={4}
          swell={0.5}
          stretch={0.25}
          glow={0.3}
          fade={0.65}
          opacity={0.5}
          intro={true}
          mouseInteraction={true}
          clickShock={true}
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Headline & Interactive Filter Dock */}
        <div className="hero-left-block lg:col-span-7 flex flex-col justify-center">
          {/* Badge */}
          <div className="hero-anim-badge mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold text-foreground shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span>Creative Workspace Marketplace</span>
            <span className="text-muted">•</span>
            <span className="text-muted font-normal">New York & Brooklyn</span>
          </div>

          {/* Main Headline */}
          <h1 className="hero-anim-title text-balance text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-foreground">
            Find the space. <br />
            <span className="text-accent">Create the extraordinary.</span>
          </h1>

          <p className="hero-anim-subhead mt-5 max-w-xl text-base leading-relaxed text-muted">
            Book verified daylight lofts, cinema soundstages, and acoustic podcast rooms by the hour. Protected by atomic schedule mutex locking with zero double-bookings.
          </p>

          {/* Interactive Discipline Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const active = activeCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveCategory(tab.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    active
                      ? "bg-neutral-900 text-white shadow-xs font-bold scale-[1.02] dark:bg-white dark:text-neutral-900"
                      : "border border-border bg-surface text-muted hover:text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Floating Search Dock */}
          <form
            onSubmit={handleSearchSubmit}
            className="hero-anim-dock mt-4 rounded-3xl border border-border bg-surface p-2 shadow-md sm:rounded-full"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Location Input */}
              <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5">
                <MapPin size={17} className="text-accent shrink-0" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Neighborhood (DUMBO, SoHo, LIC...)"
                  className="w-full bg-transparent text-sm font-semibold text-foreground placeholder:text-muted/60 focus:outline-none"
                />
              </div>

              <div className="hidden h-6 w-px bg-border sm:block" />

              {/* Quick Preset City suggestions */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 text-[11px] text-muted">
                <button
                  type="button"
                  onClick={() => setSearchLocation("DUMBO")}
                  className="rounded-full bg-surface-secondary px-2.5 py-1 hover:text-foreground"
                >
                  DUMBO
                </button>
                <button
                  type="button"
                  onClick={() => setSearchLocation("SoHo")}
                  className="rounded-full bg-surface-secondary px-2.5 py-1 hover:text-foreground"
                >
                  SoHo
                </button>
                <button
                  type="button"
                  onClick={() => setSearchLocation("LIC")}
                  className="rounded-full bg-surface-secondary px-2.5 py-1 hover:text-foreground"
                >
                  LIC
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl sm:rounded-full bg-neutral-900 px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-black hover:shadow-md hover:scale-[1.02] active:scale-[0.97] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100 shrink-0"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full pointer-events-none" />
                <Search size={14} className="relative z-10 transition-transform duration-200 group-hover:scale-110" />
                <span className="relative z-10">Find Spaces</span>
              </button>
            </div>
          </form>

          {/* Trust Highlights */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 size={15} className="text-accent" />
              100% Conflict-Free Mutex Scheduling
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              4.95 Average Creator Rating
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              No Subscription · Pay Hourly
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Studio Showcase with Image Carousel */}
        <div className="hero-anim-card lg:col-span-5">
          <div
            ref={visualCardRef}
            className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-3 shadow-lg transition-all"
          >
            {/* Visual Frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-secondary">
              <Image
                src={currentStudio.image}
                alt={currentStudio.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover transition-all duration-700 group-hover:scale-105"
              />

              {/* Top Pill Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-bold backdrop-blur-md">
                  {currentStudio.category}
                </span>
                <span className="rounded-full bg-accent/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  ${currentStudio.hourlyRate}/hr
                </span>
              </div>

              {/* Rating Chip */}
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold backdrop-blur-md">
                <Star size={11} className="text-amber-500 fill-amber-500" />
                <span>{currentStudio.rating}</span>
                <span className="text-muted text-[10px]">({currentStudio.reviews})</span>
              </div>

              {/* Navigation Arrows on Hover */}
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous studio"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-md hover:bg-background transition-colors"
                >
                  <ArrowLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next studio"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-md hover:bg-background transition-colors"
                >
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Slide Progress Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {FEATURED_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlide === idx
                        ? "w-6 bg-accent"
                        : "w-1.5 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Studio Info & Action */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight text-foreground line-clamp-1">
                      {currentStudio.title}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-xs text-muted flex items-center gap-1">
                    <MapPin size={12} className="text-accent" />
                    <span>{currentStudio.location}</span>
                    <span>•</span>
                    <span>{currentStudio.sqft}</span>
                  </p>

                  {/* Feature Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {currentStudio.features.map((feature, fIdx) => (
                      <span
                        key={fIdx}
                        className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/studios/${currentStudio.id}`}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm transition-all duration-200 hover:bg-black hover:scale-110 hover:shadow-md active:scale-95 dark:bg-white dark:text-neutral-900"
                  aria-label={`Book ${currentStudio.title}`}
                >
                  <ChevronRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

