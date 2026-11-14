"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import RubberSegment from "@/components/react-bits/rubber-segment";

interface CustomCalendarProps {
  selectedDate: string; // "YYYY-MM-DD"
  onSelectDate: (dateStr: string) => void;
  minDate?: string; // "YYYY-MM-DD"
  className?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CustomCalendar({
  selectedDate,
  onSelectDate,
  minDate,
  className = "",
}: CustomCalendarProps) {
  // Parse initial view year and month
  const initialDate = selectedDate ? new Date(selectedDate) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const todayStr = new Date().toISOString().split("T")[0];
  const minAllowed = minDate || todayStr;

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const getWeekendStr = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = (6 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split("T")[0];
  };

  const tomorrowStr = getTomorrowStr();
  const weekendStr = getWeekendStr();

  const currentPreset =
    selectedDate === todayStr
      ? "today"
      : selectedDate === tomorrowStr
      ? "tomorrow"
      : selectedDate === weekendStr
      ? "weekend"
      : "custom";

  const handlePresetChange = (preset: string) => {
    let target = "";
    if (preset === "today") target = todayStr;
    else if (preset === "tomorrow") target = tomorrowStr;
    else if (preset === "weekend") target = weekendStr;
    if (target) {
      onSelectDate(target);
      const parsed = new Date(target);
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
    }
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Days calculations
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; isDisabled: boolean }[] = [];

  // Previous month padding days
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const m = viewMonth === 0 ? 12 : viewMonth;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    const dStr = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    days.push({
      dateStr: dStr,
      dayNum: day,
      isCurrentMonth: false,
      isDisabled: true,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isDisabled = dStr < minAllowed;
    days.push({
      dateStr: dStr,
      dayNum: d,
      isCurrentMonth: true,
      isDisabled,
    });
  }

  return (
    <div className={`w-full rounded-2xl border border-border bg-surface p-4 shadow-xs space-y-3.5 ${className}`}>
      {/* Quick Date Presets with Kinetic Rubber Segment */}
      <div className="w-full">
        <RubberSegment
          items={[
            { value: "today", label: "Today" },
            { value: "tomorrow", label: "Tomorrow" },
            { value: "weekend", label: "Weekend" },
            { value: "custom", label: "Custom" },
          ]}
          value={currentPreset}
          onChange={handlePresetChange}
          equalSlots={true}
          size="sm"
          radius={10}
          inset={2}
          stretch={50}
          squash={2}
          className="w-full border border-border"
        />
      </div>

      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-accent" />
          <h4 className="text-sm font-bold text-foreground">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h4>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-surface-secondary hover:text-foreground transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="mt-3 grid grid-cols-7 text-center">
        {WEEKDAY_NAMES.map((w) => (
          <span key={w} className="text-[11px] font-bold uppercase text-muted py-1">
            {w}
          </span>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="mt-1 grid grid-cols-7 gap-1 text-center">
        {days.map((item, idx) => {
          const isSelected = item.dateStr === selectedDate;
          const isToday = item.dateStr === todayStr;

          if (!item.isCurrentMonth) {
            return (
              <div
                key={idx}
                className="flex h-9 items-center justify-center text-xs text-muted/30 select-none pointer-events-none"
              >
                {item.dayNum}
              </div>
            );
          }

          if (item.isDisabled) {
            return (
              <div
                key={idx}
                className="flex h-9 items-center justify-center text-xs text-muted/40 line-through select-none pointer-events-none"
              >
                {item.dayNum}
              </div>
            );
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(item.dateStr)}
              className={`relative flex h-9 items-center justify-center rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95 ${
                isSelected
                  ? "bg-foreground text-background font-bold shadow-xs scale-105"
                  : "text-foreground hover:bg-surface-secondary"
              }`}
            >
              <span>{item.dayNum}</span>
              {isToday && !isSelected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
