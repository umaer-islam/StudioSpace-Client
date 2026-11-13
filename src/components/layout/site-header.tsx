"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Aperture, Menu, Moon, Sun, X, ArrowUpRight } from "lucide-react";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="container-main flex h-[76px] items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="StudioSpace home"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
            <Aperture size={23} strokeWidth={1.8} />
          </span>
          <span className="text-xl font-bold tracking-tight">
            Studio<span className="text-accent">Space.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle color theme"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface-secondary"
          >
            <Sun size={19} className="hidden dark:block" />
            <Moon size={19} className="block dark:hidden" />
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="text-sm font-semibold transition-colors hover:text-accent"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all hover:opacity-85"
            >
              Get Started <ArrowUpRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background px-5 py-5 lg:hidden">
          <nav className="container-main flex flex-col gap-5">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-muted hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-4 border-t border-border pt-5">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-accent"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
