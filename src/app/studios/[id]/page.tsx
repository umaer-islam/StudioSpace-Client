"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { Studio, fetchStudioById } from "@/lib/api";

interface StudioDetailPageProps {
  params: Promise<{ id: string }>;
}

function StudioDetailSkeleton() {
  return (
    <div className="min-h-screen py-12 container-main">
      <div className="h-6 w-32 rounded bg-surface-secondary animate-pulse mb-8" />
      <div className="aspect-[21/9] w-full rounded-3xl bg-surface-secondary animate-pulse mb-10" />
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 w-2/3 rounded bg-surface-secondary animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-surface-secondary animate-pulse" />
          <div className="h-28 w-full rounded bg-surface-secondary animate-pulse" />
        </div>
        <div className="h-64 rounded-2xl bg-surface-secondary animate-pulse" />
      </div>
    </div>
  );
}

function StudioDetailContent({ params }: StudioDetailPageProps) {
  const { id } = use(params);

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

  if (loading) {
    return <StudioDetailSkeleton />;
  }

  if (error || !studio) {
    return (
      <div className="min-h-screen py-24 container-main flex flex-col items-center justify-center text-center">
        <AlertCircle size={44} className="text-accent" />
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Studio Not Found
        </h1>
        <p className="mt-2 text-sm text-muted max-w-md">
          {error || "The requested creative workspace could not be located."}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/studios"
            className="rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background hover:opacity-85 transition-opacity"
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
    <div className="min-h-screen py-10 md:py-14 bg-background">
      <div className="container-main">
        {/* Back Link */}
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-accent transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to all studios
        </Link>

        {/* Hero Image Showcase */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-border bg-surface-secondary shadow-lg">
          <Image
            src={
              studio.imageUrl ||
              "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80"
            }
            alt={studio.title}
            fill
            unoptimized
            priority
            className="object-cover"
          />
          <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3.5 py-1 text-xs font-bold backdrop-blur-md">
            {studio.category}
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span>{studio.rating.toFixed(1)}</span>
            <span className="text-muted text-[11px]">({studio.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="mt-10 grid gap-12 lg:grid-cols-3">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Location Header */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground">
                {studio.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-accent" />
                  <span>{studio.address}, {studio.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={16} />
                  <span>Accommodates up to {studio.maxCapacity} people</span>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div className="border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground">About the Space</h2>
              <p className="mt-4 text-sm leading-8 text-muted whitespace-pre-line">
                {studio.overview}
              </p>
            </div>

            {/* Amenities Section */}
            {studio.amenities && studio.amenities.length > 0 && (
              <div className="border-t border-border pt-8">
                <h2 className="text-lg font-semibold text-foreground">Included Equipment & Amenities</h2>
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {studio.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-surface p-3.5 text-xs text-foreground"
                    >
                      <CheckCircle2 size={16} className="shrink-0 text-accent" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Host Profile */}
            <div className="border-t border-border pt-8">
              <h2 className="text-lg font-semibold text-foreground">Hosted by {studio.hostName}</h2>
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white font-bold text-base">
                  {studio.hostName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{studio.hostName}</p>
                  <p className="text-xs text-muted">Verified StudioSpace Host</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reservation Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-lg space-y-6">
              <div className="flex items-baseline justify-between border-b border-border pb-6">
                <div>
                  <span className="text-3xl font-bold text-foreground">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-sm text-muted"> / hour</span>
                </div>
                {studio.securityDeposit > 0 && (
                  <div className="text-right text-xs text-muted">
                    <span>${studio.securityDeposit} dep.</span>
                  </div>
                )}
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-accent" />
                  <span>2-hour minimum booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-accent" />
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-accent" />
                  <span>Verified studio guarantee</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="w-full rounded-full bg-foreground py-3.5 text-center text-sm font-semibold text-background hover:opacity-85 transition-opacity shadow-md"
              >
                Request Reservation
              </button>

              <p className="text-center text-[11px] text-muted">
                You won&apos;t be charged until the host approves your session.
              </p>

              <div className="rounded-xl bg-surface-secondary p-4 text-xs space-y-1.5 text-muted">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Sparkles size={14} className="text-accent" /> Creator Protection
                </div>
                <p className="text-[11px] leading-4">
                  Full refund available up to 48 hours before scheduled production start time.
                </p>
              </div>
            </div>
          </div>
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
