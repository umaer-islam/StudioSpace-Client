"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
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
  Building2,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

function SiteHeaderFallback() {
  return (
    <header className="fixed top-4 inset-x-0 z-50 mx-auto w-[min(100%-28px,1240px)]">
      <div className="flex h-[64px] sm:h-[68px] items-center justify-between rounded-full border border-border/80 bg-background/85 px-4 sm:px-6 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-foreground text-background">
            <Aperture size={20} strokeWidth={2} />
          </span>
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            Studio<span className="text-accent">Space.</span>
          </span>
        </div>
      </div>
    </header>
  );
}

function SiteHeaderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const user = session?.user as
    | {
        id: string;
        name: string;
        email: string;
        role?: "Creator" | "Host";
        image?: string | null;
      }
    | undefined;

  // Track scroll position for subtle elevation change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    router.push("/");
    router.refresh();
  };

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-4 inset-x-0 z-50 mx-auto w-[min(100%-28px,1240px)] transition-all duration-300 ${
        scrolled ? "drop-shadow-md" : ""
      }`}
    >
      <div className="relative flex h-[64px] sm:h-[68px] items-center justify-between rounded-full border border-border/80 bg-background/85 px-4 sm:px-6 backdrop-blur-xl shadow-xs transition-all">
        {/* Logo with Aperture Studio Icon */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="StudioSpace home"
        >
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:rotate-45 duration-300">
            <Aperture size={20} strokeWidth={2} />
          </span>
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            Studio<span className="text-accent">Space.</span>
          </span>
        </Link>

        {/* Center Desktop Navigation with Active Route Indicators */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {navigation.map((item) => {
            const active = isActiveRoute(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 ${
                  active
                    ? "bg-surface-secondary text-foreground shadow-2xs font-bold"
                    : "text-muted hover:text-foreground hover:bg-surface-secondary/60"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle + Auth Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            aria-label="Toggle color theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
          >
            <Sun size={17} className="hidden dark:block" />
            <Moon size={17} className="block dark:hidden" />
          </button>

          {/* Authenticated State */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className="flex items-center gap-2 rounded-full border border-border bg-surface p-1 pr-2.5 transition-all hover:border-foreground/30 hover:shadow-xs focus:outline-none"
              >
                {/* Profile Photo / Avatar */}
                {user.image ? (
                  <div className="relative h-7 w-7 overflow-hidden rounded-full">
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                    {user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User size={13} />
                    )}
                  </span>
                )}

                <span className="hidden max-w-[110px] truncate text-xs font-semibold sm:inline-block">
                  {user.name ? user.name.split(" ")[0] : "Account"}
                </span>

                <ChevronDown
                  size={14}
                  className={`text-muted transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-3xl border border-border bg-surface p-2 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                  {/* User Profile Header */}
                  <div className="border-b border-border px-3.5 py-3">
                    <p className="text-xs font-bold truncate text-foreground">
                      {user.name || "StudioSpace User"}
                    </p>
                    <p className="text-[11px] truncate text-muted mt-0.5">
                      {user.email}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          user.role === "Host"
                            ? "bg-accent/15 text-accent"
                            : "bg-surface-secondary text-muted"
                        }`}
                      >
                        <Sparkles size={10} />
                        {user.role || "Creator"} Account
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Menu Items per Requirement Doc */}
                  <div className="space-y-1 py-1.5">
                    {/* Dashboard */}
                    <Link
                      href="/bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      <LayoutDashboard size={15} className="text-muted" />
                      <span>Dashboard</span>
                    </Link>

                    {/* Add New Studio */}
                    <Link
                      href="/add-studio"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      <PlusCircle size={15} className="text-accent" />
                      <span>Add New Studio</span>
                    </Link>

                    {/* My Studio Listings */}
                    <Link
                      href="/my-listings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      <Building2 size={15} className="text-muted" />
                      <span>My Studio Listings</span>
                    </Link>

                    {/* My Bookings */}
                    <Link
                      href="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-surface-secondary"
                    >
                      <Calendar size={15} className="text-muted" />
                      <span>My Bookings</span>
                    </Link>
                  </div>

                  {/* Sign Out Action */}
                  <div className="border-t border-border pt-1.5 mt-1">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut size={15} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Unauthenticated State: Displays Login and Register Action Buttons */
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-foreground"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90"
              >
                Register <ArrowUpRight size={14} />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden text-foreground hover:bg-surface-secondary transition-colors"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="mt-2 overflow-hidden rounded-3xl border border-border bg-background/95 p-5 backdrop-blur-2xl shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-surface-secondary text-foreground font-bold"
                      : "text-muted hover:text-foreground hover:bg-surface-secondary/60"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}

            {user ? (
              <div className="mt-3 border-t border-border pt-4 space-y-2">
                <div className="flex items-center justify-between px-2 py-1">
                  <div>
                    <p className="text-xs font-bold">{user.name}</p>
                    <p className="text-[11px] text-muted">{user.email}</p>
                  </div>
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent uppercase">
                    {user.role}
                  </span>
                </div>

                <Link
                  href="/bookings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold hover:bg-surface-secondary"
                >
                  <LayoutDashboard size={14} className="text-muted" /> Dashboard
                </Link>

                <Link
                  href="/add-studio"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-accent hover:bg-accent/10"
                >
                  <PlusCircle size={14} /> Add New Studio
                </Link>

                <Link
                  href="/my-listings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold hover:bg-surface-secondary"
                >
                  <Building2 size={14} className="text-muted" /> My Studio Listings
                </Link>

                <Link
                  href="/my-bookings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold hover:bg-surface-secondary"
                >
                  <Calendar size={14} className="text-muted" /> My Bookings
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/10"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-4">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-2xl border border-border py-2.5 text-xs font-semibold hover:bg-surface-secondary"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-2xl bg-foreground py-2.5 text-xs font-bold text-background hover:opacity-90"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteHeader() {
  return (
    <Suspense fallback={<SiteHeaderFallback />}>
      <SiteHeaderContent />
    </Suspense>
  );
}
