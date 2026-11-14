"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  leftIcon,
  className = "",
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative w-full space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-muted">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`flex w-full items-center justify-between rounded-2xl border bg-surface px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 select-none ${
          isOpen
            ? "border-foreground/50 ring-2 ring-foreground/10 shadow-xs"
            : "border-border hover:border-foreground/30"
        } ${disabled ? "opacity-50 pointer-events-none bg-surface-secondary" : ""}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {leftIcon && <span className="text-muted shrink-0">{leftIcon}</span>}
          {selectedOption ? (
            <span className="text-foreground truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-muted/70 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={15}
          className={`text-muted transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-60 overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <ul role="listbox" className="space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? "bg-surface-secondary font-bold text-foreground"
                      : "text-muted hover:bg-surface-secondary/70 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {isSelected && (
                    <Check size={14} className="text-accent shrink-0 ml-2" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
