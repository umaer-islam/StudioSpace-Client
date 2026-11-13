import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Users, ArrowUpRight } from "lucide-react";
import { Studio } from "@/lib/api";

interface StudioCardProps {
  studio: Studio;
}

export function StudioCard({ studio }: StudioCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
      {/* Studio Image Header */}
      <Link
        href={`/studios/${studio._id}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-surface-secondary block"
      >
        <Image
          src={
            studio.imageUrl ||
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"
          }
          alt={studio.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          {studio.category}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span>{studio.rating.toFixed(1)}</span>
          <span className="text-muted text-[11px]">({studio.reviewCount})</span>
        </div>
      </Link>

      {/* Studio Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/studios/${studio._id}`}
            className="line-clamp-1 font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors"
          >
            {studio.title}
          </Link>
          <Link
            href={`/studios/${studio._id}`}
            aria-label={`View ${studio.title}`}
            className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
          >
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={14} className="shrink-0 text-accent" />
          <span className="line-clamp-1">{studio.location}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted">
          {studio.overview}
        </p>

        {/* Amenities Chips */}
        {studio.amenities && studio.amenities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {studio.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-md bg-surface-secondary px-2 py-0.5 text-[11px] text-muted"
              >
                {amenity}
              </span>
            ))}
            {studio.amenities.length > 3 && (
              <span className="rounded-md bg-surface-secondary px-1.5 py-0.5 text-[11px] text-muted">
                +{studio.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Card Footer: Price & Capacity */}
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1 text-xs text-muted">
            <Users size={14} />
            <span>Up to {studio.maxCapacity}</span>
          </div>

          <div className="text-right">
            <span className="text-base font-bold text-foreground">
              ${studio.hourlyRate}
            </span>
            <span className="text-xs text-muted font-normal"> / hr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
