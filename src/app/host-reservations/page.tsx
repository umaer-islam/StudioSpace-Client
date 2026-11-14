"use client";

import { useEffect, useState, useTransition, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Building2,
  User,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  Booking,
  fetchHostReservations,
  confirmBooking,
  cancelBooking,
} from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function HostReservationsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user as
    | { id: string; name: string; email: string; role?: "Creator" | "Host" }
    | undefined;

  const [reservations, setReservations] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const currentTime = useSyncExternalStore(
    () => () => {},
    () => Date.now(),
    () => null
  );

  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionPending, startActionTransition] = useTransition();
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login?redirect=/host-reservations");
      return;
    }
    if (!user) return;

    let isMounted = true;
    fetchHostReservations({ limit: 50 })
      .then((res) => {
        if (!isMounted) return;
        setReservations(res.data);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load reservations");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionLoading, user, refreshTrigger, router]);

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
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Host Access Required</h1>
          <p className="mt-2 text-sm text-muted">
            The <strong>Reservations Management</strong> dashboard is reserved for Host accounts managing their studio bookings.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/my-bookings"
              className="rounded-full border border-border px-6 py-2.5 text-xs font-semibold hover:bg-surface-secondary"
            >
              My Creator Bookings
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

  const handleConfirm = (bookingId: string) => {
    setActionError(null);
    startActionTransition(async () => {
      try {
        await confirmBooking(bookingId);
        setRefreshTrigger((prev) => prev + 1);
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : "Confirmation failed");
      }
    });
  };

  const handleConfirmCancel = () => {
    if (!cancellingBooking) return;
    setActionError(null);
    startActionTransition(async () => {
      try {
        await cancelBooking(cancellingBooking._id, cancelReason.trim() || undefined);
        setCancellingBooking(null);
        setCancelReason("");
        setRefreshTrigger((prev) => prev + 1);
      } catch (err: unknown) {
        setActionError(err instanceof Error ? err.message : "Cancellation failed");
      }
    });
  };

  const isPendingExpired = (booking: Booking) => {
    if (booking.status !== "pending" || !currentTime) return false;
    const createdAtTime = new Date(booking.createdAt).getTime();
    return currentTime - createdAtTime > 24 * 60 * 60 * 1000;
  };

  const renderStatusBadge = (booking: Booking) => {
    if (isPendingExpired(booking)) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-stone-500/10 px-2.5 py-1 text-xs font-semibold text-stone-500">
          <Clock size={13} /> Expired Request
        </span>
      );
    }
    switch (booking.status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock size={13} /> Pending Host Review
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
            <XCircle size={13} /> Cancelled
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-500/10 px-2.5 py-1 text-xs font-semibold text-stone-600 dark:text-stone-400">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-main py-10 lg:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Host Reservations</h1>
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent">
              <Sparkles size={11} className="inline mr-1" />
              {reservations.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Review incoming booking requests, approve reservations, and monitor studio schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/my-listings"
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-secondary"
          >
            My Listings
          </Link>
          <Link
            href="/add-studio"
            className="rounded-full bg-neutral-900 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-black hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-neutral-900"
          >
            Add Studio
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
      ) : reservations.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-secondary text-muted">
            <Building2 size={28} />
          </div>
          <h2 className="mt-4 text-xl font-bold">No reservations yet</h2>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-muted">
            When creators request to book your studios, their reservations and schedule slots will appear here for your confirmation.
          </p>
          <div className="mt-6">
            <Link
              href="/my-listings"
              className="rounded-full border border-border px-6 py-2.5 text-xs font-semibold hover:bg-surface-secondary"
            >
              Check My Listings
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const expired = isPendingExpired(booking);
            const canConfirm = booking.status === "pending" && !expired;
            const canCancel =
              (booking.status === "pending" || booking.status === "confirmed") && !expired;

            return (
              <div
                key={booking._id}
                className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between shadow-sm hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-secondary">
                    <Image
                      src={
                        booking.studioImageUrl ||
                        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={booking.studioTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold tracking-tight">
                        {booking.studioTitle}
                      </h3>
                      {renderStatusBadge(booking)}
                    </div>

                    {/* Creator Details */}
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <User size={12} className="text-accent" />
                        {booking.creatorName}
                      </span>
                      <span>•</span>
                      <span>{booking.creatorEmail}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {start.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (
                        {booking.hours}h)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-2">
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-foreground">
                      ${booking.totalPrice}
                    </span>
                    <p className="text-[11px] text-muted">
                      ${booking.hourlyRate}/hr × {booking.hours}h
                      {booking.securityDeposit > 0 ? ` + $${booking.securityDeposit} deposit` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {canConfirm && (
                      <button
                        type="button"
                        disabled={isActionPending}
                        onClick={() => handleConfirm(booking._id)}
                        className="rounded-full bg-foreground px-4 py-1.5 text-xs font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    )}
                    {canCancel && (
                      <button
                        type="button"
                        disabled={isActionPending}
                        onClick={() => setCancellingBooking(booking)}
                        className="rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/20 dark:text-red-400"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation/Decline Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-xl">
            <h3 className="text-lg font-bold">Decline or Cancel Reservation?</h3>
            <p className="mt-1 text-xs text-muted">
              You are about to cancel {cancellingBooking.creatorName}&apos;s reservation for{" "}
              <strong>{cancellingBooking.studioTitle}</strong>.
            </p>
            <div className="mt-4">
              <label htmlFor="host-cancel-reason" className="block text-xs font-bold uppercase tracking-wider text-muted">
                Reason (optional)
              </label>
              <textarea
                id="host-cancel-reason"
                rows={3}
                placeholder="Studio undergoing urgent maintenance, schedule overlap..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-surface-secondary p-3 text-xs focus:border-accent focus:outline-none"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={isActionPending}
                onClick={() => {
                  setCancellingBooking(null);
                  setCancelReason("");
                }}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-secondary"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isActionPending}
                onClick={handleConfirmCancel}
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isActionPending ? "Declining..." : "Confirm Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
