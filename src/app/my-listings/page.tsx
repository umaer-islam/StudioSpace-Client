"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { fetchHostListings, deleteStudio, Studio } from "@/lib/api";
import {
  Building2,
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  MapPin,
  Users,
  AlertCircle,
  Loader2,
  ShieldAlert,
} from "lucide-react";

export default function MyListingsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user as
    | { id: string; name: string; email: string; role?: "Creator" | "Host" }
    | undefined;

  const [listings, setListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login?redirect=/my-listings");
      return;
    }
    if (!user) return;

    let isMounted = true;
    fetchHostListings()
      .then((res) => {
        if (!isMounted) return;
        setListings(res.data || []);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load your listings");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionLoading, user, router]);

  if (sessionLoading || (loading && user)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={36} />
      </div>
    );
  }

  if (user && user.role !== "Host") {
    return (
      <div className="container-main py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <ShieldAlert size={32} />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Host Dashboard Required</h1>
          <p className="mt-2 text-sm text-muted">
            The <strong>My Listings</strong> portal is only accessible to Host accounts.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/studios"
              className="rounded-full border border-border px-6 py-2.5 text-xs font-semibold hover:bg-surface-secondary"
            >
              Browse Studios
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background hover:opacity-90"
            >
              Register as Host
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleDelete = (studio: Studio) => {
    setActionError(null);
    startDeleteTransition(async () => {
      try {
        await deleteStudio(studio._id);
        setListings((prev) => prev.filter((s) => s._id !== studio._id));
        setDeletingId(null);
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : "Deletion failed");
      }
    });
  };

  return (
    <div className="container-main py-10 lg:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Studio Listings</h1>
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
              {listings.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Manage your spaces, update hourly rates, or list new creative studios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/host-reservations"
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-secondary"
          >
            View Reservations
          </Link>
          <Link
            href="/add-studio"
            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-black hover:shadow-md hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-neutral-900"
          >
            <PlusCircle size={15} /> Add Studio
          </Link>
        </div>
      </div>

      {actionError && (
        <div className="mb-6 flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-600 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-red-600">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
            <Building2 size={28} />
          </div>
          <h2 className="mt-4 text-xl font-bold">No studios listed yet</h2>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted">
            You haven&apos;t listed any creative workspaces yet. Add your first photo studio, music suite, podcast lounge, or film stage.
          </p>
          <div className="mt-6">
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-neutral-900"
            >
              <PlusCircle size={15} /> Create First Listing
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((studio) => (
            <div
              key={studio._id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all hover:border-foreground/30 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-secondary">
                <Image
                  src={
                    studio.imageUrl ||
                    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={studio.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-bold backdrop-blur-md">
                    {studio.category}
                  </span>
                </div>
                <div className="absolute right-3 top-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                      studio.status === "active"
                        ? "bg-green-500/20 text-green-700 dark:text-green-300"
                        : "bg-stone-500/20 text-stone-700 dark:text-stone-300"
                    }`}
                  >
                    {studio.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-1 text-base font-bold tracking-tight">
                  {studio.title}
                </h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                  <MapPin size={13} className="shrink-0 text-accent" />
                  <span className="truncate">{studio.location}</span>
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <div>
                    <span className="text-base font-extrabold text-foreground">
                      ${studio.hourlyRate}
                    </span>
                    <span className="text-muted">/hr</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted">
                    <Users size={13} />
                    <span>Up to {studio.maxCapacity}</span>
                  </div>
                </div>

                {/* Host Actions */}
                <div className="mt-5 grid grid-cols-3 gap-2 pt-2 border-t border-border">
                  <Link
                    href={`/studios/${studio._id}`}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-border py-2 text-[11px] font-semibold hover:bg-surface-secondary"
                  >
                    <ExternalLink size={12} /> View
                  </Link>

                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-border bg-surface-secondary py-2 text-[11px] font-semibold hover:bg-surface-secondary/80"
                  >
                    <Edit3 size={12} /> Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setDeletingId(studio._id)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-500/20 text-red-600 py-2 text-[11px] font-semibold hover:bg-red-500/10"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

              {/* Confirmation Modal overlay for deletion */}
              {deletingId === studio._id && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-3xl bg-background/95 p-6 text-center backdrop-blur-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                    <Trash2 size={24} />
                  </div>
                  <h4 className="mt-3 text-sm font-bold">Delete this studio?</h4>
                  <p className="mt-1 text-xs text-muted">
                    This action is permanent and cannot be undone.
                  </p>
                  <div className="mt-4 flex w-full gap-2">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setDeletingId(null)}
                      className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold hover:bg-surface-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(studio)}
                      className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
