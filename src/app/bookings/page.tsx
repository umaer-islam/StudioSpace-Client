"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Loader2,
  Building2,
  CalendarDays,
  User,
  ArrowRight,
} from "lucide-react";
import {
  Booking,
  BookingStatus,
  fetchMyBookings,
  fetchHostReservations,
  confirmBooking,
  cancelBooking,
} from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export default function BookingsPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user as
    | { id: string; name: string; email: string; role?: "Creator" | "Host" }
    | undefined;

  const [activeTab, setActiveTab] = useState<"creator" | "host">("creator");
  const [creatorBookings, setCreatorBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [actionError, setActionError] = useState<string | null>(null);
  const [isActionPending, startActionTransition] = useTransition();

  // Selected booking for cancellation modal
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const isHost = user?.role === "Host";

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    let isMounted = true;
    const promises = [fetchMyBookings({ limit: 30 })];
    if (user.role === "Host") {
      promises.push(fetchHostReservations({ limit: 30 }));
    }

    Promise.all(promises)
      .then(([myRes, hostRes]) => {
        if (!isMounted) return;
        setCreatorBookings(myRes.data);
        if (hostRes) setHostBookings(hostRes.data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load bookings");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionLoading, user, router, refreshTrigger]);

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

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-600 dark:text-green-400">
            <CheckCircle2 size={13} /> Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock size={13} /> Awaiting Approval
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <CheckCircle2 size={13} /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400">
            <XCircle size={13} /> Cancelled
          </span>
        );
    }
  };

  const currentList = activeTab === "creator" ? creatorBookings : hostBookings;

  return (
    <div className="container-main min-h-screen py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reservations Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage your creative workspace bookings and studio calendar
          </p>
        </div>

        {/* Tab Controls */}
        {isHost && (
          <div className="flex rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setActiveTab("creator")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "creator"
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              My Bookings ({creatorBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("host")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === "host"
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Incoming Studio Requests ({hostBookings.length})
            </button>
          </div>
        )}
      </div>

      {actionError && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Content List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <Loader2 size={32} className="animate-spin text-muted" />
          <p className="mt-3 text-xs text-muted">Loading reservations...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center">
          <AlertCircle size={36} className="text-red-500 mx-auto" />
          <p className="mt-3 text-sm text-foreground">{error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setRefreshTrigger((prev) => prev + 1);
            }}
            className="mt-4 rounded-full border border-border px-4 py-2 text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : currentList.length === 0 ? (
        <div className="py-24 text-center">
          <CalendarDays size={48} className="text-muted/60 mx-auto" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            {activeTab === "creator"
              ? "No reservations found"
              : "No incoming studio reservation requests"}
          </h3>
          <p className="mt-2 text-xs text-muted max-w-sm mx-auto">
            {activeTab === "creator"
              ? "You haven't booked any creative studios yet. Explore our curated spaces to get started."
              : "When creators request your spaces, they will appear here for your review and approval."}
          </p>
          {activeTab === "creator" && (
            <Link
              href="/studios"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background hover:opacity-85"
            >
              Explore Studios <ArrowRight size={14} />
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {currentList.map((booking) => {
            const start = new Date(booking.startTime);
            const end = new Date(booking.endTime);
            const formattedDate = start.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const formattedTime = `${start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} - ${end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`;

            return (
              <div
                key={booking._id}
                className="rounded-2xl border border-border bg-surface p-5 sm:p-6 transition-all hover:border-muted/50 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  {booking.studioImageUrl ? (
                    <div className="relative h-20 w-24 sm:h-24 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-surface-secondary">
                      <Image
                        src={booking.studioImageUrl}
                        alt={booking.studioTitle}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-xl bg-surface-secondary text-muted">
                      <Building2 size={24} />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="font-bold text-foreground hover:text-accent transition-colors"
                      >
                        {booking.studioTitle}
                      </Link>
                      {renderStatusBadge(booking.status)}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} /> {formattedTime} ({booking.hours}h)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted">
                      <MapPin size={13} /> {booking.studioLocation}
                    </div>

                    {activeTab === "host" && (
                      <div className="flex items-center gap-1.5 text-xs text-muted pt-1">
                        <User size={13} /> Requested by:{" "}
                        <span className="font-semibold text-foreground">
                          {booking.creatorName}
                        </span>
                      </div>
                    )}

                    {booking.notes && (
                      <p className="text-xs text-muted italic bg-surface-secondary/50 rounded-lg p-2 mt-1">
                        &quot;{booking.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-border pt-4 md:pt-0 gap-4">
                  <div className="text-left md:text-right">
                    <div className="text-lg font-bold text-foreground">
                      ${booking.totalPrice} BDT
                    </div>
                    <div className="text-[11px] text-muted">
                      (${booking.hourlyRate}/h + ${booking.securityDeposit} dep)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Host action buttons */}
                    {activeTab === "host" && booking.status === "pending" && (
                      <button
                        type="button"
                        disabled={isActionPending}
                        onClick={() => handleConfirm(booking._id)}
                        className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-85 transition-opacity disabled:opacity-50"
                      >
                        Accept Booking
                      </button>
                    )}

                    {/* Cancellation button */}
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <button
                        type="button"
                        onClick={() => setCancellingBooking(booking)}
                        className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted hover:text-red-500 hover:border-red-500/40 transition-colors"
                      >
                        {activeTab === "host" ? "Decline" : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-foreground">
              {activeTab === "host" ? "Decline Reservation Request" : "Cancel Your Reservation"}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {activeTab === "host"
                ? "Please provide a reason to the creator for declining this booking."
                : "Are you sure you want to cancel? The reserved slot will be released back to the calendar."}
            </p>

            <form onSubmit={handleCancelSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="cancel-reason"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
                >
                  Reason
                </label>
                <textarea
                  id="cancel-reason"
                  rows={3}
                  required
                  maxLength={300}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Studio undergoing maintenance, schedule conflict..."
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCancellingBooking(null);
                    setCancelReason("");
                  }}
                  className="w-1/2 rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-surface-secondary"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={isActionPending}
                  className="w-1/2 rounded-full bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isActionPending ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
