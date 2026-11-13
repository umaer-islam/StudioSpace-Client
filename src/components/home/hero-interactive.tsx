"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  DollarSign,
  Camera,
} from "lucide-react";
import { SplitText } from "@/components/react-bits/split-text";
import { ShinyText } from "@/components/react-bits/shiny-text";
import { SpotlightCard } from "@/components/react-bits/spotlight-card";

const STUDIO_SHOWCASE_PRESETS = [
  {
    id: "6af759833158a0c2b1057962",
    tag: "Daylight Loft",
    title: "Lumina Daylight & Cyc Wall",
    location: "DUMBO, Brooklyn",
    hourlyRate: 95,
    maxCapacity: 25,
    rating: 4.98,
    reviews: 38,
    category: "Photo Studio",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=85",
    features: "16ft White Cyclorama · Corner Daylight",
  },
  {
    id: "6af759833158a0c2b1057963",
    tag: "Film Soundstage",
    title: "The Industrial Sunlit Warehouse",
    location: "Long Island City, Queens",
    hourlyRate: 80,
    maxCapacity: 35,
    rating: 4.88,
    reviews: 29,
    category: "Film Stage",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85",
    features: "Exposed Brick · Direct Loading Dock",
  },
  {
    id: "6af759833158a0c2b1057964",
    tag: "Editorial Atelier",
    title: "Minimalist Editorial Studio",
    location: "SoHo, Manhattan",
    hourlyRate: 110,
    maxCapacity: 18,
    rating: 5.0,
    reviews: 42,
    category: "Photo Studio",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85",
    features: "Designer Props · 12-Color Backdrops",
  },
];

const CATEGORIES = [
  "All Categories",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export function HeroInteractive() {
  const router = useRouter();
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const currentStudio = STUDIO_SHOWCASE_PRESETS[activePresetIndex];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) {
      params.set("search", searchLocation.trim());
    }
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    }
    const query = params.toString();
    router.push(`/studios${query ? `?${query}` : ""}`);
  };

  return (
    <section className="container-main pt-8 pb-14 sm:pt-12 sm:pb-20">
      {/* Upper Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Headline & Interactive Search Bar */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Badge */}
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-semibold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <ShinyText text="CURATED WORKSPACES · VERIFIED HOSTS" speed={3.5} />
          </div>

          {/* Staggered Animated Headline */}
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.08]">
            <SplitText text="Find the space." delay={0.1} /> <br />
            <span className="text-accent inline-block mt-1">
              <SplitText text="Create the extraordinary." delay={0.3} />
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-muted">
            On-demand daylight lofts, acoustic podcast rooms, and soundstages.
            Book verified creative workspaces with guaranteed double-booking mutex protection.
          </p>

          {/* Floating Search Dock */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 rounded-3xl border border-border bg-surface p-2.5 shadow-sm sm:p-3 sm:rounded-full"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              {/* Location Input */}
              <div className="flex flex-1 items-center gap-2.5 px-3 py-2 sm:py-1">
                <MapPin size={17} className="text-accent shrink-0" />
                <div className="w-full">
                  <label htmlFor="search-location" className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                    Location / Area
                  </label>
                  <input
                    id="search-location"
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="DUMBO, SoHo, LIC, Queens..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold placeholder:text-muted/60 focus:outline-none"
                  />
                </div>
              </div>

              <div className="hidden h-8 w-px bg-border sm:block" />

              {/* Category Dropdown */}
              <div className="flex flex-1 items-center gap-2.5 px-3 py-2 sm:py-1">
                <Camera size={17} className="text-accent shrink-0" />
                <div className="w-full">
                  <label htmlFor="search-category" className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                    Space Discipline
                  </label>
                  <select
                    id="search-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-surface text-foreground">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-xs font-bold text-background transition-opacity hover:opacity-90 sm:py-3 shrink-0"
              >
                <Search size={15} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Trust Guarantees */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-accent" />
              100% Mutex Concurrency
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Star size={15} className="text-amber-500 fill-amber-500" />
              4.95 Average Creator Rating
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <DollarSign size={15} className="text-accent" />
              Transparent Hourly Pricing
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Studio Showcase Preset */}
        <div className="lg:col-span-5">
          <SpotlightCard className="overflow-hidden p-3 shadow-md border-border/80">
            {/* Visual Frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-secondary">
              <Image
                src={currentStudio.image}
                alt={currentStudio.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-all duration-700 hover:scale-105"
              />

              {/* Top Pill Overlay */}
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-bold backdrop-blur-md">
                  {currentStudio.category}
                </span>
                <span className="rounded-full bg-accent/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  ${currentStudio.hourlyRate}/hr
                </span>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute right-3 top-3 animate-float-subtle">
                <div className="flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold backdrop-blur-md">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span>{currentStudio.rating}</span>
                  <span className="text-muted font-normal">({currentStudio.reviews})</span>
                </div>
              </div>

              {/* Bottom Feature Card Overlay */}
              <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/20 bg-background/90 p-3.5 backdrop-blur-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight text-foreground line-clamp-1">
                      {currentStudio.title}
                    </h3>
                    <p className="flex items-center gap-1 text-[11px] text-muted mt-0.5">
                      <MapPin size={11} className="text-accent" /> {currentStudio.location}
                    </p>
                    <p className="text-[11px] font-medium text-accent mt-1">
                      {currentStudio.features}
                    </p>
                  </div>

                  <Link
                    href={`/studios/${currentStudio.id}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shrink-0 hover:opacity-90 transition-opacity"
                    aria-label={`View ${currentStudio.title}`}
                  >
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Interactive Preset Switcher Pills */}
            <div className="mt-3 flex items-center justify-between gap-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Curated Spaces:
              </span>
              <div className="flex items-center gap-1.5">
                {STUDIO_SHOWCASE_PRESETS.map((preset, index) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setActivePresetIndex(index)}
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                      activePresetIndex === index
                        ? "bg-foreground text-background shadow-xs"
                        : "border border-border bg-surface text-muted hover:border-foreground/40"
                    }`}
                  >
                    {preset.tag}
                  </button>
                ))}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
