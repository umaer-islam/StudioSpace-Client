"use client";

import React, { useState } from "react";
import { Clock, Sun, Moon, Sunset, Check } from "lucide-react";
import RubberSegment from "@/components/react-bits/rubber-segment";

interface CustomTimePickerProps {
  startTime: string;
  endTime: string;
  onSelectRange: (start: string, end: string) => void;
  disabledSlots?: string[]; // array of slot times that are booked
  className?: string;
}

const ALL_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00"
];

const QUICK_DURATIONS = [
  { label: "2 Hours", hours: 2 },
  { label: "3 Hours", hours: 3 },
  { label: "4 Hours", hours: 4 },
  { label: "Full Day (8h)", hours: 8 },
];

export function CustomTimePicker({
  startTime,
  endTime,
  onSelectRange,
  disabledSlots = [],
  className = "",
}: CustomTimePickerProps) {
  const [activeTab, setActiveTab] = useState<"morning" | "afternoon" | "evening">("morning");

  const filterSlotsByPeriod = (period: "morning" | "afternoon" | "evening") => {
    return ALL_SLOTS.filter((time) => {
      const h = parseInt(time.split(":")[0], 10);
      if (period === "morning") return h >= 8 && h < 12;
      if (period === "afternoon") return h >= 12 && h < 17;
      return h >= 17 && h <= 22;
    });
  };

  const handleStartPick = (slot: string) => {
    // calculate default 2 hour end time
    const [h, m] = slot.split(":").map(Number);
    const endMinutes = h * 60 + m + 120;
    const endH = Math.min(22, Math.floor(endMinutes / 60));
    const endM = endMinutes % 60;
    const computedEnd = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    onSelectRange(slot, computedEnd);
  };

  const handleDurationClick = (hours: number) => {
    const [h, m] = startTime.split(":").map(Number);
    const endMinutes = h * 60 + m + hours * 60;
    const endH = Math.min(22, Math.floor(endMinutes / 60));
    const endM = endMinutes % 60;
    const computedEnd = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    onSelectRange(startTime, computedEnd);
  };

  return (
    <div className={`w-full rounded-2xl border border-border bg-surface p-4 shadow-xs space-y-4 ${className}`}>
      {/* Header with Clock Icon */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-accent" />
          <h4 className="text-sm font-bold text-foreground">Production Hours</h4>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
          <span className="font-bold text-foreground">{startTime}</span>
          <span>→</span>
          <span className="font-bold text-foreground">{endTime}</span>
        </div>
      </div>

      {/* Quick Duration Buttons */}
      <div>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
          Quick Duration
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_DURATIONS.map((dur) => (
            <button
              key={dur.label}
              type="button"
              onClick={() => handleDurationClick(dur.hours)}
              className="rounded-full border border-border bg-surface-secondary px-3 py-1 text-xs font-medium text-foreground hover:bg-foreground hover:text-background transition-colors active:scale-95"
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Period Tabs: Morning, Afternoon, Evening with Rubber Animation */}
      <div className="w-full">
        <RubberSegment
          items={[
            {
              value: "morning",
              label: (
                <span className="flex items-center gap-1.5">
                  <Sun size={13} />
                  <span>Morning</span>
                </span>
              ),
            },
            {
              value: "afternoon",
              label: (
                <span className="flex items-center gap-1.5">
                  <Sunset size={13} />
                  <span>Afternoon</span>
                </span>
              ),
            },
            {
              value: "evening",
              label: (
                <span className="flex items-center gap-1.5">
                  <Moon size={13} />
                  <span>Evening</span>
                </span>
              ),
            },
          ]}
          value={activeTab}
          onChange={(val) => setActiveTab(val as "morning" | "afternoon" | "evening")}
          equalSlots={true}
          size="sm"
          radius={12}
          inset={2}
          stretch={60}
          squash={2}
          className="w-full border border-border"
        />
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-4 gap-2">
        {filterSlotsByPeriod(activeTab).map((slot) => {
          const isStart = slot === startTime;
          const isEnd = slot === endTime;
          const isBooked = disabledSlots.includes(slot);

          return (
            <button
              key={slot}
              type="button"
              disabled={isBooked}
              onClick={() => handleStartPick(slot)}
              className={`flex items-center justify-center rounded-xl py-2 text-xs font-semibold transition-all active:scale-95 ${
                isStart
                  ? "bg-foreground text-background font-bold shadow-xs scale-105"
                  : isEnd
                  ? "border border-foreground bg-surface-secondary text-foreground font-bold"
                  : isBooked
                  ? "bg-surface-secondary text-muted/40 line-through cursor-not-allowed"
                  : "border border-border bg-surface text-foreground hover:bg-surface-secondary"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
