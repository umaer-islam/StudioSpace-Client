"use client";

import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const CustomButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-tight rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-neutral-900 text-white shadow-sm hover:bg-black hover:shadow-md dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100",
      secondary:
        "bg-surface-secondary text-foreground border border-border hover:bg-surface-secondary/80 hover:border-foreground/20",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-surface-secondary hover:border-foreground/30",
      ghost:
        "bg-transparent text-foreground hover:bg-surface-secondary/70",
      danger:
        "bg-red-500 text-white shadow-xs hover:bg-red-600 hover:shadow-md",
    };

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-xs sm:text-sm gap-2",
      lg: "px-7 py-3.5 text-sm gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

CustomButton.displayName = "CustomButton";
