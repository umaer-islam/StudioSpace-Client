"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Studio, createBooking, fetchStudioAvailability, OccupiedSlot } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import { CustomTimePicker } from "@/components/ui/custom-time-picker";
import { CustomButton } from "@/components/ui/custom-button";

interface BookingWidgetProps {
  studio: Studio;
}

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00"
];

export function BookingWidget({ studio }: BookingWidgetProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // Default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(defaultDateStr);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("13:00");
  const [notes, setNotes] = useState("");

  const [occupiedSlots, setOccupiedSlots] = useState<OccupiedSlot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load availability
  useEffect(() => {
    let isCurrent = true;
    fetchStudioAvailability(studio._id)
      .then((res) => {
        if (isCurrent) setOccupiedSlots(res.data);
      })
      .catch(() => {});
    return () => {
      isCurrent = false;
    };
  }, [studio._id]);

  // Calculate duration and prices
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  const durationMinutes = Math.max(0, endMinutes - startMinutes);
  const durationHours = durationMinutes / 60;
  const isValidDuration = durationHours >= 1 && durationMinutes % 30 === 0;

  const rentalFee = Math.round(durationHours * studio.hourlyRate);
  const deposit = studio.securityDeposit ?? 0;
  const totalPrice = rentalFee + deposit;

  // Check overlap with occupied slots for selected date
  const isOverlapping = checkOverlap(date, startTime, endTime, occupiedSlots);

  const isHostOfStudio = user?.id && studio.hostId && user.id === studio.hostId;

  function parseTimeToMinutes(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  }

  function checkOverlap(
    d: string,
    sTime: string,
    eTime: string,
    slots: OccupiedSlot[]
  ): boolean {
    if (!d || !sTime || !eTime) return false;
    const reqStart = new Date(`${d}T${sTime}:00.000Z`).getTime();
    const reqEnd = new Date(`${d}T${eTime}:00.000Z`).getTime();

    return slots.some((slot) => {
      const slotStart = new Date(slot.startTime).getTime();
      const slotEnd = new Date(slot.endTime).getTime();
      return reqStart < slotEnd && reqEnd > slotStart;
    });
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      router.push("/login");
      return;
    }

    if (isHostOfStudio) {
      setError("Hosts cannot book their own studio listings.");
      return;
    }

    if (!isValidDuration) {
      setError("Minimum booking duration is 1 hour in 30-minute increments.");
      return;
    }

    if (isOverlapping) {
      setError("The selected time slot overlaps with an existing reservation. Please select another time.");
      return;
    }

    startTransition(async () => {
      try {
        const startISO = new Date(`${date}T${startTime}:00.000Z`).toISOString();
        const endISO = new Date(`${date}T${endTime}:00.000Z`).toISOString();

        const res = await createBooking({
          studioId: studio._id,
          startTime: startISO,
          endTime: endISO,
          notes: notes.trim() || undefined,
        });

        if (res.success) {
          setSuccess("Reservation request submitted! The host has been notified.");
          // Refresh availability
          fetchStudioAvailability(studio._id).then((r) => setOccupiedSlots(r.data));
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while processing your booking."
        );
      }
    });
  };

  return (
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
            <span className="font-semibold text-foreground">${studio.securityDeposit}</span>
            <span> security dep.</span>
          </div>
        )}
      </div>

      {success ? (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-center space-y-3">
          <CheckCircle2 size={36} className="text-green-500 mx-auto" />
          <h3 className="font-semibold text-foreground text-sm">Booking Requested!</h3>
          <p className="text-xs text-muted leading-relaxed">{success}</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/bookings"
              className="rounded-full bg-foreground py-2.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
            >
              View My Bookings
            </Link>
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="text-xs text-muted hover:underline"
            >
              Book another slot
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 flex items-start gap-2"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isOverlapping && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>Selected slot overlaps with an existing booking.</span>
            </div>
          )}

          {/* Custom Date Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-muted">
              Production Date: <span className="text-foreground font-semibold">{date}</span>
            </label>
            <CustomCalendar
              selectedDate={date}
              onSelectDate={setDate}
              minDate={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Custom Visual Time & Hours Picker */}
          <CustomTimePicker
            startTime={startTime}
            endTime={endTime}
            onSelectRange={(start, end) => {
              setStartTime(start);
              setEndTime(end);
            }}
          />

          {/* Optional Notes */}
          <div>
            <label
              htmlFor="booking-notes"
              className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5"
            >
              Project Details (Optional)
            </label>
            <textarea
              id="booking-notes"
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 4-person portrait session with wardrobe changes..."
              className="w-full rounded-xl border border-border bg-background p-2.5 text-xs placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            />
          </div>

          {/* Pricing Calculation Breakdown */}
          {isValidDuration && (
            <div className="rounded-2xl border border-border bg-surface-secondary/50 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>
                  ${studio.hourlyRate} × {durationHours} {durationHours === 1 ? "hour" : "hours"}
                </span>
                <span className="font-medium text-foreground">${rentalFee}</span>
              </div>
              {deposit > 0 && (
                <div className="flex justify-between text-muted">
                  <span>Refundable Security Deposit</span>
                  <span className="font-medium text-foreground">${deposit}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground text-sm">
                <span>Total Estimated</span>
                <span className="text-accent">${totalPrice}</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          {user ? (
            <CustomButton
              type="submit"
              variant="primary"
              size="lg"
              loading={isPending}
              disabled={!isValidDuration || isOverlapping || Boolean(isHostOfStudio)}
              className="w-full"
            >
              {isHostOfStudio
                ? "You own this studio"
                : isOverlapping
                ? "Time Slot Unavailable"
                : "Request Reservation"}
            </CustomButton>
          ) : (
            <Link
              href="/login"
              className="block w-full rounded-full bg-foreground py-3.5 text-center text-sm font-semibold text-background hover:opacity-85 transition-opacity shadow-md"
            >
              Sign in to Book
            </Link>
          )}

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
        </form>
      )}
    </div>
  );
}
