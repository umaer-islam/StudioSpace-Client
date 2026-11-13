"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCcw, AlertCircle, Sparkles } from "lucide-react";
import { Studio, fetchStudios } from "@/lib/api";
import { StudioCard } from "@/components/studios/studio-card";
import { StudioSkeleton } from "@/components/studios/studio-skeleton";

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    fetchStudios({ limit: 6, sort: "rating" })
      .then((res) => {
        if (isCurrent) {
          setStudios(res.data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isCurrent) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load featured creative spaces."
          );
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-main">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <Sparkles size={14} />
              FEATURED SPACES
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">
              Top-rated studios for your craft.
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Handpicked creative environments verified for production excellence and acoustics.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
          >
            Explore all spaces <ArrowRight size={16} />
          </Link>
        </div>

        {/* Content State */}
        {loading && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudioSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-surface">
            <AlertCircle size={36} className="text-accent" />
            <h3 className="mt-4 font-semibold text-foreground">
              Unable to load studios
            </h3>
            <p className="mt-2 text-xs text-muted max-w-sm">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:opacity-85 transition-opacity"
            >
              <RefreshCcw size={14} /> Try again
            </button>
          </div>
        )}

        {!loading && !error && studios.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center bg-surface">
            <p className="text-sm text-muted">No studios are currently listed.</p>
          </div>
        )}

        {!loading && !error && studios.length > 0 && (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
