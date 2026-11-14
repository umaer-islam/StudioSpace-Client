"use client";

import React, { forwardRef, useState } from "react";
import { X, AlertCircle } from "lucide-react";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  clearable?: boolean;
  onClear?: () => void;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      leftIcon,
      rightElement,
      error,
      clearable = false,
      onClear,
      className = "",
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const hasValue = value !== undefined && value !== "";

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-muted">
            {label}
          </label>
        )}
        <div
          className={`relative flex items-center rounded-2xl border bg-surface transition-all duration-200 ${
            error
              ? "border-red-500/80 ring-2 ring-red-500/20"
              : focused
              ? "border-foreground/50 ring-2 ring-foreground/10 shadow-xs"
              : "border-border hover:border-foreground/30"
          } ${disabled ? "opacity-50 pointer-events-none bg-surface-secondary" : ""}`}
        >
          {leftIcon && (
            <div className="pl-3.5 pr-1 text-muted flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full bg-transparent py-2.5 text-xs sm:text-sm font-semibold text-foreground placeholder:text-muted/60 focus:outline-none ${
              leftIcon ? "pl-2" : "pl-4"
            } ${clearable || rightElement ? "pr-10" : "pr-4"} ${className}`}
            {...props}
          />

          <div className="absolute right-3 flex items-center gap-1.5">
            {clearable && hasValue && onClear && (
              <button
                type="button"
                onClick={onClear}
                aria-label="Clear field"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-secondary text-muted hover:text-foreground transition-colors"
              >
                <X size={12} />
              </button>
            )}
            {rightElement}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-red-500">
            <AlertCircle size={13} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
