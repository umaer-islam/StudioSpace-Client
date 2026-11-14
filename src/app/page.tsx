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
import { CinematicHero } from "@/components/home/cinematic-hero";

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
      {/* CINEMATIC HERO */}
      <CinematicHero />

      {/* CATEGORIES */}
      <section className="section-padding">
        <div className="container-main">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                EXPLORE POSSIBILITIES
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Find your kind of space.
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                From photography to music production, discover a space made for
                your craft.
              </p>
            </div>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 text-sm font-semibold hover:text-accent"
            >
              Browse all studios <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  href={`/studios?category=${encodeURIComponent(category.category)}`}
                  className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-secondary text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <Icon size={23} />
                  </div>
                  <h3 className="mt-6 font-semibold">{category.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {category.description}
                  </p>
                  <ArrowUpRight
                    size={18}
                    className="mt-5 text-muted transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED STUDIOS (API INTEGRATED) */}
      <FeaturedStudios />

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="section-padding bg-surface-secondary"
      >
        <div className="container-main">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              SIMPLE BY DESIGN
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your next project, four steps away.
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Finding and booking your ideal creative workspace should be
              effortless.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number}>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-light tracking-tight text-accent/70">
                      {step.number}
                    </span>
                    <Icon size={25} className="text-muted" />
                  </div>
                  <h3 className="mt-7 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOST GUARANTEE */}
      <section id="about" className="section-padding">
        <div className="container-main">
          <div className="grid items-center gap-12 rounded-[28px] border border-border bg-surface p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                BUILT FOR CREATORS
              </p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Your creativity deserves the right environment.
              </h2>
              <p className="mt-5 text-sm leading-8 text-muted">
                StudioSpace brings hosts and creators together through a simple
                workspace discovery and booking experience.
              </p>
              <Link
                href="/studios"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-4 text-sm font-semibold text-background hover:opacity-85"
              >
                Discover Spaces <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: ShieldCheck,
                  title: "Trusted Profiles",
                  text: "Build confidence through host and creator profiles.",
                },
                {
                  icon: CalendarCheck,
                  title: "Easy Booking",
                  text: "Manage reservations in one convenient place.",
                },
                {
                  icon: Users,
                  title: "Creator Community",
                  text: "Connect people with spaces for their craft.",
                },
                {
                  icon: Camera,
                  title: "Creative Spaces",
                  text: "Explore studios across different creative disciplines.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-surface-secondary p-5"
                  >
                    <Icon size={23} className="text-accent" />
                    <h3 className="mt-5 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-muted">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
