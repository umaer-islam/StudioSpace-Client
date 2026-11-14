"use client";

import { useState } from "react";
import Link from "next/link";
import { Aperture, ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import { toast } from "sonner";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
];

const categories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export function SiteFooter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to StudioSpace dispatch!");
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-main grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand & Mission Statement */}
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
              <Aperture size={23} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              Studio<span className="text-accent">Space.</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-muted">
            A peer-to-peer marketplace for creative spaces. Discover inspiring studios, book verified hours, and bring your visions to life.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-border p-2.5 text-foreground hover:text-accent transition-colors"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-border p-2.5 text-foreground hover:text-accent transition-colors"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-full border border-border p-2.5 text-foreground hover:text-accent transition-colors"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            {/* Modern X logo instead of old Twitter bird per specification */}
            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="rounded-full border border-border p-2.5 text-foreground hover:text-accent transition-colors"
            >
              <span className="text-sm font-bold">𝕏</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-foreground">Quick Links</h3>
          <ul className="mt-5 space-y-4">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Studio Categories */}
        <div>
          <h3 className="font-semibold text-foreground">Studio Categories</h3>
          <ul className="mt-5 space-y-4">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/studios?category=${encodeURIComponent(category)}`}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Subscription per Specification */}
        <div>
          <h3 className="font-semibold text-foreground">Studio Dispatch</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Weekly curated daylight lofts, audio gear drops, and creator availability.
          </p>

          <form onSubmit={handleSubscribe} className="mt-5 space-y-2">
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@studiospace.com"
                className="w-full rounded-2xl border border-border bg-background py-2.5 pl-10 pr-4 text-xs text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-black active:scale-[0.98] dark:bg-white dark:text-neutral-900"
            >
              <span>Subscribe to Dispatch</span>
              <ArrowRight size={13} />
            </button>
          </form>
        </div>
      </div>

      {/* Copyright & Terms Notice */}
      <div className="border-t border-border">
        <div className="container-main flex flex-col justify-between gap-4 py-6 text-xs text-muted sm:flex-row">
          <p>© 2026 StudioSpace. All rights reserved. • Peer-to-peer creative studio marketplace.</p>
          <div className="flex items-center gap-4">
            <Link href="/#about" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/#how-it-works" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
