import Link from "next/link";
import { Aperture, ArrowUpRight } from "lucide-react";

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
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-main grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
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
            A space for every creative vision. Discover inspiring studios and
            bring your next great idea to life.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-border p-2.5 hover:text-accent"
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
              className="rounded-full border border-border p-2.5 hover:text-accent"
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
              className="rounded-full border border-border p-2.5 hover:text-accent"
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
            <a
              href="https://x.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="rounded-full border border-border p-2.5 hover:text-accent"
            >
              <span className="text-sm font-bold">𝕏</span>
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Quick Links</h3>
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

        <div>
          <h3 className="font-semibold">Studio Categories</h3>
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

        <div>
          <h3 className="font-semibold">Stay Inspired</h3>
          <p className="mt-5 text-sm leading-7 text-muted">
            Discover new creative spaces and inspiration for your next project.
          </p>
          <Link
            href="/studios"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            Explore Studios <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-main flex flex-col justify-between gap-4 py-6 text-xs text-muted sm:flex-row">
          <p>© 2026 StudioSpace. All rights reserved.</p>
          <p>Made for creators, by the creative community.</p>
        </div>
      </div>
    </footer>
  );
}
