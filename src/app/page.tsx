import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Mic2,
  Music2,
  Palette,
  Video,
  ShieldCheck,
  Users,
  CalendarCheck,
} from "lucide-react";
import { FeaturedStudios } from "@/components/home/featured-studios";
import { HeroShowcase } from "@/components/home/hero-showcase";
import { AnimatedContent } from "@/components/react-bits/animated-content";

const categories = [
  {
    name: "Photo Studios",
    description: "Perfect lighting for every frame.",
    icon: Camera,
    category: "Photo Studio",
  },
  {
    name: "Film Stages",
    description: "Bring cinematic visions to life.",
    icon: Video,
    category: "Film Stage",
  },
  {
    name: "Podcast Rooms",
    description: "Where meaningful conversations begin.",
    icon: Mic2,
    category: "Podcast Lounge",
  },
  {
    name: "Music Suites",
    description: "Create your next masterpiece.",
    icon: Music2,
    category: "Music Suite",
  },
  {
    name: "Art Workshops",
    description: "Room to explore your creativity.",
    icon: Palette,
    category: "Workshop",
  },
];

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description: "Explore inspiring studios that match your creative vision.",
    icon: Camera,
  },
  {
    number: "02",
    title: "Select Your Hours",
    description: "Choose your preferred date and available time slot.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Book Your Space",
    description: "Reserve your studio and manage your booking easily.",
    icon: ShieldCheck,
  },
  {
    number: "04",
    title: "Create & Produce",
    description: "Walk in, create something extraordinary and make it yours.",
    icon: Users,
  },
];

export default function Home() {
  return (
    <>
      {/* ANIMATED CINEMATIC HERO SHOWCASE */}
      <HeroShowcase />

      {/* CATEGORIES */}
      <section className="section-padding">
        <div className="container-main">
          <AnimatedContent distance={35} duration={0.7} threshold={0.15}>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  EXPLORE POSSIBILITIES
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                  Find your kind of space.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  From corner daylight lofts to broadcast podcast studios, discover spaces built for your craft.
                </p>
              </div>
              <Link
                href="/studios"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground hover:text-accent transition-colors"
              >
                Browse all studios <ArrowRight size={15} />
              </Link>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={45}
            duration={0.7}
            stagger={0.08}
            threshold={0.1}
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/studios?category=${encodeURIComponent(category.category)}`}
                  className="group relative flex flex-col justify-between rounded-3xl border border-border bg-surface p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg active:scale-[0.98]"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-secondary text-accent transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:scale-105">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 font-bold tracking-tight text-foreground text-base">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {category.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                    <span className="text-[11px] font-semibold text-muted group-hover:text-foreground transition-colors">
                      Explore spaces
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                  </div>
                </Link>
              );
            })}
          </AnimatedContent>
        </div>
      </section>

      {/* FEATURED STUDIOS (API INTEGRATED) */}
      <FeaturedStudios />

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="section-padding bg-surface-secondary/70 border-y border-border"
      >
        <div className="container-main">
          <AnimatedContent distance={35} duration={0.7} threshold={0.15}>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                SIMPLE BY DESIGN
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                Your next project, four steps away.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Discover verified spaces, lock in your exact hours with zero double bookings, and start creating.
              </p>
            </div>
          </AnimatedContent>

          <AnimatedContent
            distance={45}
            duration={0.7}
            stagger={0.1}
            threshold={0.1}
            className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Desktop progress rail line */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute top-7 left-12 right-12 h-px bg-border -z-0"
            />

            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="group relative z-10 flex flex-col justify-between rounded-3xl border border-border/80 bg-surface p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-secondary text-sm font-bold font-mono text-accent border border-border/80">
                        {step.number}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-secondary text-muted transition-colors group-hover:text-foreground">
                        <Icon size={18} />
                      </span>
                    </div>
                    <h3 className="mt-6 text-base font-bold text-foreground tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground/80 dark:text-zinc-300">
                      {step.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span>Step {step.number} of 04</span>
                  </div>
                </div>
              );
            })}
          </AnimatedContent>
        </div>
      </section>

      {/* HOST GUARANTEE & VALUE PROPOSITION */}
      <section id="about" className="section-padding">
        <div className="container-main">
          <AnimatedContent distance={40} duration={0.8} threshold={0.15}>
            <div className="grid items-center gap-10 rounded-[32px] border border-border bg-surface p-8 sm:p-12 lg:grid-cols-12 lg:p-16 shadow-xs">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-3.5 py-1 text-xs font-semibold text-accent">
                  <span>BUILT FOR CREATORS & HOSTS</span>
                </div>
                <h2 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl text-foreground">
                  Your creativity deserves the right environment.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  StudioSpace eliminates double bookings through database mutex locking, provides verified audio/lighting specs, and lets you book by the hour with instant confirmation.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/studios"
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-neutral-900 px-6 py-3.5 text-xs font-bold text-white shadow-sm transition-all duration-200 hover:bg-black hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full pointer-events-none" />
                    <span className="relative z-10">Explore Studios</span>
                    <ArrowRight size={15} className="relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/add-studio"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-xs font-semibold text-foreground hover:bg-surface-secondary transition-colors active:scale-[0.98]"
                  >
                    <span>List Your Space</span>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Conflict-Free Scheduling",
                    text: "Protected by atomic version mutexes. Zero double bookings, guaranteed.",
                  },
                  {
                    icon: CalendarCheck,
                    title: "Hourly Flexibility",
                    text: "Book only the exact hours you need. No monthly minimums or subscriptions.",
                  },
                  {
                    icon: Users,
                    title: "Direct Host Access",
                    text: "Coordinate load-in, gear requests, and logistics directly with the host.",
                  },
                  {
                    icon: Camera,
                    title: "Verified Production Gear",
                    text: "Detailed lighting, acoustic, and electrical specs validated before you walk in.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="group rounded-3xl border border-border/80 bg-surface-secondary/50 p-6 transition-all duration-300 hover:border-foreground/20 hover:bg-surface hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface border border-border text-accent transition-transform duration-200 group-hover:scale-110">
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 text-sm font-bold text-foreground tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedContent>
        </div>
      </section>
    </>
  );
}
