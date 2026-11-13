"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Aperture,
  Menu,
  Moon,
  Sun,
  X,
  ArrowUpRight,
  LogOut,
  User,
  PlusCircle,
  Calendar,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

export function SiteHeader() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const user = session?.user as
    | { id: string; name: string; email: string; role?: "Creator" | "Host"; image?: string | null }
    | undefined;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

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

          {user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/bookings"
                className="flex items-center gap-1.5 text-xs font-semibold rounded-full border border-border px-3.5 py-1.5 hover:bg-surface-secondary transition-colors"
              >
                <Calendar size={14} /> Bookings
              </Link>

              {user.role === "Host" && (
                <Link
                  href="/studios/new"
                  className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  <PlusCircle size={14} /> List Space
                </Link>
              )}

              <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={12} />}
                </span>
                <span className="max-w-[100px] truncate text-xs font-semibold">
                  {user.name || user.email}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    user.role === "Host"
                      ? "bg-accent/15 text-accent"
                      : "bg-surface-secondary text-muted"
                  }`}
                >
                  {user.role || "Creator"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out"
                title="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
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
          )}

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

            {user ? (
              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                    </span>
                    <span className="text-sm font-semibold">{user.name || user.email}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      user.role === "Host"
                        ? "bg-accent/15 text-accent"
                        : "bg-surface-secondary text-muted"
                    }`}
                  >
                    {user.role || "Creator"}
                  </span>
                </div>

                {user.role === "Host" && (
                  <Link
                    href="/studios/new"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-accent/10 py-2.5 text-xs font-semibold text-accent"
                  >
                    <PlusCircle size={15} /> List a New Studio
                  </Link>
                )}

                <Link
                  href="/bookings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-surface-secondary"
                >
                  <Calendar size={15} /> My Reservations
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold text-muted hover:text-foreground"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            ) : (
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
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
