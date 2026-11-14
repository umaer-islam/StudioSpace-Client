"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, MapPin, ArrowRight, ShieldCheck, Star } from "lucide-react";

export function CleanHero() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category && category !== "All") params.set("category", category);
    const qs = params.toString();
    router.push(`/studios${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="container-main py-12 md:py-20 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Column: Clear, Honest Typography & Functional Search */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1 text-xs font-semibold text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>Creative Workspace Marketplace</span>
          </div>

          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
            Creative spaces for photos, film, and sound.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            Book daylight photography lofts, cinema soundstages, and podcast suites by the hour. Hosted by working creatives in New York and beyond.
          </p>

          {/* Clean Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-8 rounded-2xl border border-border bg-surface p-2 sm:rounded-full shadow-xs"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2.5 px-3 py-1.5">
                <MapPin size={16} className="text-muted shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Neighborhood (DUMBO, SoHo, LIC...)"
                  className="w-full bg-transparent text-sm font-medium placeholder:text-muted/60 focus:outline-none"
                />
              </div>

              <div className="hidden h-6 w-px bg-border sm:block" />

              <div className="flex flex-1 items-center px-3 py-1.5">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none cursor-pointer"
                >
                  <option value="All">All Space Types</option>
                  <option value="Photo Studio">Photo Studio</option>
                  <option value="Film Stage">Film Stage</option>
                  <option value="Podcast Lounge">Podcast Lounge</option>
                  <option value="Music Suite">Music Suite</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-foreground px-6 py-3 text-xs font-bold text-background transition-colors hover:opacity-90 shrink-0"
              >
                <Search size={14} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Honest Proof Points */}
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-accent" />
              Verified Host Spaces
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              4.95 Average Creator Rating
            </span>
            <span className="flex items-center gap-1.5">
              Hourly Booking · No Memberships
            </span>
          </div>
        </div>

        {/* Right Column: Grounded Architectural Studio Photograph */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-3xl border border-border bg-surface p-2 shadow-sm">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-secondary">
              <Image
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=85"
                alt="Lumina Daylight Loft in DUMBO"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover"
              />

              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                  Photo Studio
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                  $95/hr
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-foreground">
                    Lumina Daylight & Cyc Wall Loft
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    55 Washington Street, DUMBO · Brooklyn, NY
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    2,200 sq ft corner loft · 16ft cyclorama · Profoto D2 kit
                  </p>
                </div>

                <Link
                  href="/studios/6af759833158a0c2b1057962"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background hover:opacity-85 transition-opacity"
                  aria-label="View Lumina Daylight Loft"
                >
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
