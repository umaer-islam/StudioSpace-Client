"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface ScenePreset {
  id: string;
  studioId: string;
  name: string;
  sceneName: string;
  category: string;
  location: string;
  rate: number;
  specs: {
    ceiling: string;
    light: string;
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
    name: "01 / DAYLIGHT & CYCLORAMA",
    sceneName: "Lumina Daylight Loft",
    category: "Photo & Daylight Stage",
    location: "DUMBO · Brooklyn, NY",
    rate: 95,
    specs: {
      ceiling: "16 ft Ceiling",
      light: "North-Facing Daylight",
      power: "3-Phase 100A",
      sound: "Acoustic Treated",
    },
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=90",
    tagline: "Natural sunlight sweeps across 2,200 sq ft of seamless white cyc wall.",
  },
  {
    id: "scene-cinema",
    studioId: "6af759833158a0c2b1057963",
    name: "02 / INDUSTRIAL SOUNDSTAGE",
    sceneName: "The Sunlit Warehouse",
    category: "Film Production Stage",
    location: "Long Island City · Queens, NY",
    rate: 80,
    specs: {
      ceiling: "22 ft Trusses",
      light: "Full Blackout Ready",
      power: "Distro Box 200A",
      sound: "Drive-In Soundstage",
    },
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=90",
    tagline: "Heavy-timber factory architecture converted into a cinema production playground.",
  },
  {
    id: "scene-music",
    studioId: "6af759833158a0c2b1057964",
    name: "03 / ANALOG AUDIO & SUITE",
    sceneName: "SoHo Editorial Atelier",
    category: "Music & Mixing Suite",
    location: "SoHo · Manhattan, NY",
    rate: 110,
    specs: {
      ceiling: "Vaulted Ceilings",
      light: "Warm Tungsten Grid",
      power: "Isolated Clean Audio",
      sound: "Floating Room Isolation",
    },
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=90",
    tagline: "Curated architectural furniture, archival backdrops, and acoustic clarity.",
  },
];

export function CinematicHero() {
  const router = useRouter();
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const activeScene = CINEMATIC_SCENES[activeSceneIndex];

  // Auto-advance scenes every 8 seconds if user is not interacting
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % CINEMATIC_SCENES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isHovered]);

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
      className="relative min-h-[92vh] w-full overflow-hidden flex flex-col justify-between -mt-24 sm:-mt-28 pt-32 sm:pt-36 pb-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cinematic Background Crossfade Images */}
      <div className="absolute inset-0 -z-20 overflow-hidden bg-black">
        {CINEMATIC_SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              activeSceneIndex === idx
                ? "opacity-60 scale-100"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <Image
              src={scene.image}
              alt={scene.sceneName}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Cinematic Film Vignette & Tone Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Main Content Stage */}
      <div className="container-main relative z-10 w-full flex-1 flex flex-col justify-center py-6 sm:py-10">
        <div className="max-w-3xl">
          {/* Top Cinema Slate & REC Indicator */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-[11px] font-bold tracking-wider backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-foreground tracking-[0.15em] uppercase">REC · LIVE AVAILABILITY</span>
            </div>

            <span className="hidden sm:inline-block text-xs font-medium text-muted">
              {activeScene.location}
            </span>

            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] font-mono text-white/80 backdrop-blur-sm">
              <ShieldCheck size={13} className="text-accent" />
              <span>MUTEX CONCURRENCY ENGINE</span>
            </div>
          </div>

          {/* Cinematic Editorial Headline */}
          <h1 className="text-balance text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
            Where Vision <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-accent to-foreground/80">
              Takes Form.
            </span>
          </h1>

          {/* Tagline for currently active scene */}
          <p className="mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-muted transition-opacity duration-500">
            {activeScene.tagline}
          </p>

          {/* Clean Floating Search & Discipline Bar */}
          <div className="mt-8 max-w-xl">
            <form
              onSubmit={handleSearchSubmit}
              className="group relative flex items-center rounded-full border border-border/90 bg-background/90 p-1.5 shadow-lg backdrop-blur-xl transition-all focus-within:border-accent"
            >
              <div className="flex flex-1 items-center gap-3 pl-4">
                <Search size={17} className="text-muted group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search studios by neighborhood, cyc wall, podcast..."
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-foreground placeholder:text-muted/60 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2.5 text-xs font-bold text-background transition-opacity hover:opacity-90 shrink-0"
              >
                <span>Search</span>
                <ArrowRight size={13} />
              </button>
            </form>

            {/* Quick Filter Tags */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="text-muted font-medium">Quick find:</span>
              <button
                type="button"
                onClick={() => router.push("/studios?category=Photo+Studio")}
                className="rounded-full border border-border/80 bg-surface/60 px-2.5 py-0.5 text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Photo Cycloramas
              </button>
              <button
                type="button"
                onClick={() => router.push("/studios?category=Film+Stage")}
                className="rounded-full border border-border/80 bg-surface/60 px-2.5 py-0.5 text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Film Stages
              </button>
              <button
                type="button"
                onClick={() => router.push("/studios?category=Podcast+Lounge")}
                className="rounded-full border border-border/80 bg-surface/60 px-2.5 py-0.5 text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Podcast Lounges
              </button>
              <button
                type="button"
                onClick={() => router.push("/studios?category=Music+Suite")}
                className="rounded-full border border-border/80 bg-surface/60 px-2.5 py-0.5 text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Music Suites
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Production Spec Bar & Scene Navigator */}
      <div className="container-main relative z-10 w-full pt-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-t border-border/70 pt-4">
          {/* Interactive Scene Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CINEMATIC_SCENES.map((scene, index) => {
              const isActive = activeSceneIndex === index;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveSceneIndex(index)}
                  className={`group flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
                    isActive
                      ? "bg-foreground text-background shadow-sm"
                      : "border border-border/80 bg-background/70 text-muted hover:text-foreground hover:border-foreground/40"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-accent" : "bg-muted/40 group-hover:bg-muted"
                    }`}
                  />
                  <span>{scene.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Soundstage Specs Slate */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted text-[11px] uppercase tracking-wider">Ceiling</span>
              <span className="font-bold text-foreground">{activeScene.specs.ceiling}</span>
            </div>
            <div className="h-3 w-px bg-border/60 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-muted text-[11px] uppercase tracking-wider">Lighting</span>
              <span className="font-bold text-foreground">{activeScene.specs.light}</span>
            </div>
            <div className="h-3 w-px bg-border/60 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="text-muted text-[11px] uppercase tracking-wider">Power</span>
              <span className="font-bold text-foreground">{activeScene.specs.power}</span>
            </div>
            <div className="h-3 w-px bg-border/60 hidden sm:block" />

            <Link
              href={`/studios/${activeScene.studioId}`}
              className="inline-flex items-center gap-1.5 font-bold text-accent hover:underline"
            >
              <span>Explore Space (${activeScene.rate}/hr)</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
