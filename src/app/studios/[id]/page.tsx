"use client";

import { useEffect, useState, use, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Clock,
  Sparkles,
  Info,
  Calendar,
  MessageSquare,
  Lock,
} from "lucide-react";
import { Studio, fetchStudioById } from "@/lib/api";
import { BookingWidget } from "@/components/studios/booking-widget";
import GradualBlur from "@/components/react-bits/gradual-blur";

interface StudioDetailPageProps {
  params: Promise<{ id: string }>;
}

function StudioDetailSkeleton() {
  return (
    <div className="min-h-screen py-10 container-main">
      <div className="h-5 w-40 rounded-full bg-surface-secondary animate-pulse mb-6" />
      <div className="aspect-[16/9] md:aspect-[21/9] w-full rounded-3xl bg-surface-secondary animate-pulse mb-8" />
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="h-10 w-3/4 rounded-2xl bg-surface-secondary animate-pulse" />
          <div className="h-5 w-1/2 rounded-full bg-surface-secondary animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-surface-secondary animate-pulse" />
            ))}
          </div>
          <div className="h-32 w-full rounded-2xl bg-surface-secondary animate-pulse" />
        </div>
        <div className="lg:col-span-5">
          <div className="h-96 rounded-3xl bg-surface-secondary animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function StudioDetailContent({ params }: StudioDetailPageProps) {
  const { id } = use(params);
  const containerRef = useRef<HTMLDivElement>(null);

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetchStudioById(id)
      .then((res) => {
        if (isCurrent) {
          setStudio(res.data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isCurrent) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load studio details."
          );
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  // GSAP Entrance Timeline on load
  useGSAP(
    () => {
      if (!studio) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".detail-anim-nav",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4 }
      )
        .fromTo(
          ".detail-anim-gallery",
          { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7 },
          "-=0.2"
        )
        .fromTo(
          ".detail-anim-header",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.4"
        )
        .fromTo(
          ".detail-spec-chip",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 },
          "-=0.3"
        )
        .fromTo(
          ".detail-anim-content",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3"
        )
        .fromTo(
          ".detail-anim-booking",
          { opacity: 0, x: 25 },
          { opacity: 1, x: 0, duration: 0.7 },
          "-=0.5"
        );
    },
    { scope: containerRef, dependencies: [studio] }
  );

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Studio link copied to clipboard", {
        description: "You can now share this creative space with your production team.",
      });
    }
  };

  const scrollToBooking = () => {
    const el = document.getElementById("booking-card");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (loading) {
    return <StudioDetailSkeleton />;
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen py-24 container-main flex flex-col items-center justify-center text-center">
        <AlertCircle size={44} className="text-accent" />
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          Studio Not Found
        </h1>
        <p className="mt-2 text-sm text-muted max-w-md">
          {error || "The requested creative workspace could not be located."}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/studios"
            className="rounded-full bg-neutral-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black transition-colors"
          >
            Back to Directory
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors"
          >
            <RefreshCcw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen py-8 md:py-12 bg-background pb-28 lg:pb-16">
      <div className="container-main">
        {/* Breadcrumb & Top Bar Navigation */}
        <div className="detail-anim-nav mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <Link href="/studios" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
              <ArrowLeft size={14} />
              <span>Studios</span>
            </Link>
            <span className="text-muted/50">/</span>
            <span className="text-muted font-normal">{studio.category}</span>
            <span className="text-muted/50">/</span>
            <span className="text-foreground font-bold truncate max-w-[220px] sm:max-w-xs">
              {studio.title}
            </span>
          </div>

          {/* Quick Share Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share studio link"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground shadow-2xs hover:bg-surface-secondary active:scale-95 transition-all"
            >
              <Share2 size={13} className="text-accent" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Hero Architectural Gallery Frame */}
        <div className="detail-anim-gallery relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border bg-surface-secondary shadow-lg">
          <Image
            src={
              studio.imageUrl ||
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=85"
            }
            alt={studio.title}
            fill
            unoptimized
            priority
            sizes="100vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />

          {/* Soft ambient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Gradual Blur Ramp at bottom of photography */}
          <GradualBlur
            position="bottom"
            height="16rem"
            strength={3}
            layers={12}
            curve="bezier"
            zIndex={2}
          />

          {/* Top Floating Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-full bg-black/75 px-3.5 py-1 text-xs font-bold text-white backdrop-blur-md shadow-xs">
              {studio.category}
            </span>
            <span className="rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-black backdrop-blur-md shadow-xs">
              ${studio.hourlyRate}/hr
            </span>
          </div>

          {/* Top Right Rating Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow-xs">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>{studio.rating.toFixed(1)}</span>
            <span className="text-white/70 text-[11px] font-normal">({studio.reviewCount} reviews)</span>
          </div>

          {/* Bottom Left Location Tag on Mobile Image */}
          <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1 text-xs text-white backdrop-blur-md">
            <MapPin size={13} className="text-accent" />
            <span>{studio.location}</span>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Comprehensive Storytelling & Specifications */}
          <div className="lg:col-span-7 space-y-10">
            {/* Title & Neighborhood Header */}
            <div className="detail-anim-header">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.12]">
                {studio.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <MapPin size={16} className="text-accent shrink-0" />
                  <span>{studio.address}, {studio.location}</span>
                </span>
                <span className="text-muted/40">•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Users size={16} className="text-muted shrink-0" />
                  <span>Up to {studio.maxCapacity} creators</span>
                </span>
              </div>
            </div>

            {/* Quick Architectural Specification Dock */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Discipline",
                  value: studio.category,
                  icon: Sparkles,
                },
                {
                  label: "Max Capacity",
                  value: `${studio.maxCapacity} Guests`,
                  icon: Users,
                },
                {
                  label: "Rate",
                  value: `$${studio.hourlyRate} / hour`,
                  icon: Clock,
                },
                {
                  label: "Scheduling",
                  value: "Atomic Mutex Lock",
                  icon: ShieldCheck,
                },
              ].map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={i}
                    className="detail-spec-chip rounded-2xl border border-border bg-surface p-4 shadow-2xs"
                  >
                    <Icon size={16} className="text-accent" />
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                      {spec.label}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-foreground truncate">
                      {spec.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Overview & Atmosphere */}
            <div className="detail-anim-content border-t border-border/80 pt-8 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                About the Workspace
              </h2>
              <p className="text-sm leading-relaxed text-muted sm:text-base sm:leading-8 whitespace-pre-line">
                {studio.overview}
              </p>
            </div>

            {/* Verified Amenities & Production Equipment */}
            {studio.amenities && studio.amenities.length > 0 && (
              <div className="detail-anim-content border-t border-border/80 pt-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    Included Gear & Amenities
                  </h2>
                  <span className="text-xs font-semibold text-muted">
                    {studio.amenities.length} Verified Items
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studio.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-2xs transition-all hover:border-foreground/30 hover:shadow-xs"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-accent group-hover:bg-foreground group-hover:text-background transition-colors">
                        <CheckCircle2 size={16} />
                      </div>
                      <span className="text-xs font-semibold text-foreground">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Production Logistics & Studio Guidelines */}
            <div className="detail-anim-content border-t border-border/80 pt-8 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                House Guidelines & Access
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Clock size={15} className="text-accent" />
                    <span>Arrival & Load-in</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Host or studio manager will be on-site to greet you and verify equipment check-in 15 minutes before your booked start time.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-4 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Lock size={15} className="text-accent" />
                    <span>Security & Noise Policy</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Respect fellow studio occupants. High-SPL live drums or amplified playback must conclude 15 minutes prior to session wrap.
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Host Card */}
            <div className="detail-anim-content border-t border-border/80 pt-8 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Hosted by {studio.hostName}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-neutral-900 text-white font-bold text-lg shadow-xs">
                    {studio.hostName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground text-base">{studio.hostName}</p>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Verified Host
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      Typically responds in less than 30 minutes
                    </p>
                  </div>
                </div>

                <a
                  href={`mailto:${studio.hostEmail}?subject=StudioSpace Inquiry: ${encodeURIComponent(studio.title)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-surface-secondary active:scale-95 transition-all self-start sm:self-auto"
                >
                  <MessageSquare size={14} className="text-accent" />
                  <span>Contact Host</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Interactive Booking Widget */}
          <div className="detail-anim-booking lg:col-span-5">
            <BookingWidget studio={studio} />
          </div>
        </div>
      </div>

      {/* Floating Bottom Booking Capsule for Mobile & Tablet (< 1024px) */}
      <div className="lg:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="flex items-center justify-between gap-4 rounded-full border border-border/90 bg-surface/95 px-5 py-3 shadow-2xl backdrop-blur-xl">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-foreground">
                ${studio.hourlyRate}
              </span>
              <span className="text-xs text-muted font-medium">/ hr</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{studio.rating.toFixed(1)}</span>
              <span>•</span>
              <span>{studio.category}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToBooking}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black active:scale-95 dark:bg-white dark:text-neutral-900"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full pointer-events-none" />
            <Calendar size={13} className="relative z-10" />
            <span className="relative z-10">Select Hours</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StudioDetailPage(props: StudioDetailPageProps) {
  return (
    <Suspense fallback={<StudioDetailSkeleton />}>
      <StudioDetailContent {...props} />
    </Suspense>
  );
}
