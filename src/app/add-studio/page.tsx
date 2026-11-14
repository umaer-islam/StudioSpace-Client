"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { createStudio, CreateStudioPayload } from "@/lib/api";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomButton } from "@/components/ui/custom-button";
import AnimatedContent from "@/components/react-bits/animated-content";
import {
  DollarSign,
  Users,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const COMMON_AMENITIES = [
  "High-Speed WiFi",
  "Air Conditioning",
  "Freight Elevator",
  "Hair & Makeup Vanity",
  "Soundproof Isolation",
  "Profoto Lighting Kit",
  "Private Dressing Room",
  "Kitchenette & Espresso Bar",
  "C-Stands & Sandbags",
  "Green Room Lounge",
  "Ground Floor Loading Bay",
  "4K / Multi-Cam Setup",
];

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const user = session?.user as
    | { id: string; name: string; email: string; role?: "Creator" | "Host" }
    | undefined;

  const [formData, setFormData] = useState<CreateStudioPayload>({
    title: "",
    category: "Photo Studio",
    hourlyRate: 75,
    securityDeposit: 100,
    maxCapacity: 15,
    location: "",
    address: "",
    imageUrl: "",
    amenities: ["High-Speed WiFi"],
    overview: "",
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "High-Speed WiFi",
  ]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login?redirect=/add-studio");
    }
  }, [sessionLoading, user, router]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={36} />
      </div>
    );
  }

  if (user && user.role !== "Host") {
    return (
      <div className="container-main py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <ShieldAlert size={32} />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">Host Access Required</h1>
          <p className="mt-2 text-sm text-muted">
            Your current account is registered as a <strong>Creator</strong>. Listing spaces on StudioSpace is reserved for Host accounts.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/studios"
              className="rounded-full border border-border px-6 py-2.5 text-xs font-semibold hover:bg-surface-secondary"
            >
              Explore Studios
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background hover:opacity-90"
            >
              Register as Host
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmenity.trim()) return;
    if (!selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities((prev) => [...prev, customAmenity.trim()]);
    }
    setCustomAmenity("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Please provide a studio title");
      return;
    }
    if (!formData.location.trim()) {
      setError("Please specify the city/neighborhood (e.g. Brooklyn, NY or Dhanmondi, Dhaka)");
      return;
    }
    if (!formData.address.trim()) {
      setError("Please specify the street address");
      return;
    }
    if (formData.hourlyRate <= 0) {
      setError("Hourly rate must be greater than 0");
      return;
    }
    if (!formData.overview.trim() || formData.overview.trim().length < 20) {
      setError("Please write an overview description of at least 20 characters");
      return;
    }

    startTransition(async () => {
      try {
        const payload: CreateStudioPayload = {
          ...formData,
          amenities: selectedAmenities,
          imageUrl:
            (formData.imageUrl || "").trim() ||
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
        };

        const res = await createStudio(payload);
        if (res.success && res.data) {
          toast.success("Studio published successfully!");
          router.push("/my-listings");
        } else {
          toast.error(res.message || "Failed to create studio listing");
          setError(res.message || "Failed to create studio listing");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Studio creation failed");
      }
    });
  };

  return (
    <div className="container-main py-10 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <AnimatedContent distance={30} duration={0.65} trigger="mount">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/my-listings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground"
            >
              <ArrowLeft size={14} /> Back to My Listings
            </Link>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles size={13} /> Host Dashboard
            </span>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-sm">
          <div className="border-b border-border pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Add a New Studio</h1>
            <p className="mt-1.5 text-sm text-muted">
              List your creative workspace for photographers, filmmakers, musicians, and creators.
            </p>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-600 dark:text-red-400">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-muted">
                Studio Title *
              </label>
              <input
                id="title"
                type="text"
                required
                placeholder="e.g. Lumina Daylight Loft & Cyc Wall"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            {/* Category & Capacity */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <CustomSelect
                  label="Category *"
                  value={formData.category}
                  options={CATEGORIES.map((c) => ({ label: c, value: c }))}
                  onChange={(val) => setFormData({ ...formData, category: val })}
                />
              </div>

              <div>
                <label htmlFor="maxCapacity" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Max Capacity (Guests) *
                </label>
                <div className="relative mt-2">
                  <Users size={16} className="absolute left-3.5 top-3.5 text-muted" />
                  <input
                    id="maxCapacity"
                    type="number"
                    min={1}
                    max={500}
                    required
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({ ...formData, maxCapacity: Number(e.target.value) || 1 })
                    }
                    className="w-full rounded-2xl border border-border bg-surface-secondary pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="hourlyRate" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Hourly Rate ($) *
                </label>
                <div className="relative mt-2">
                  <DollarSign size={16} className="absolute left-3.5 top-3.5 text-muted" />
                  <input
                    id="hourlyRate"
                    type="number"
                    min={1}
                    required
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, hourlyRate: Number(e.target.value) || 0 })
                    }
                    className="w-full rounded-2xl border border-border bg-surface-secondary pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="securityDeposit" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Security Deposit ($)
                </label>
                <div className="relative mt-2">
                  <DollarSign size={16} className="absolute left-3.5 top-3.5 text-muted" />
                  <input
                    id="securityDeposit"
                    type="number"
                    min={0}
                    value={formData.securityDeposit}
                    onChange={(e) =>
                      setFormData({ ...formData, securityDeposit: Number(e.target.value) || 0 })
                    }
                    className="w-full rounded-2xl border border-border bg-surface-secondary pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Location & Address */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Area / Neighborhood *
                </label>
                <div className="relative mt-2">
                  <MapPin size={16} className="absolute left-3.5 top-3.5 text-muted" />
                  <input
                    id="location"
                    type="text"
                    required
                    placeholder="e.g. DUMBO, Brooklyn"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-2xl border border-border bg-surface-secondary pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Full Street Address *
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  placeholder="e.g. 55 Washington Street, Suite 402"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-xs font-bold uppercase tracking-wider text-muted">
                Studio Image URL (Unsplash or CDN link)
              </label>
              <div className="relative mt-2">
                <ImageIcon size={16} className="absolute left-3.5 top-3.5 text-muted" />
                <input
                  id="imageUrl"
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-surface-secondary pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <p className="mt-1 text-[11px] text-muted">
                Leave blank to use our default curated creative studio cover photo.
              </p>
            </div>

            {/* Amenities Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                Amenities & Equipment
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {COMMON_AMENITIES.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity);
                  return (
                    <button
                      type="button"
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-foreground text-background shadow-sm"
                          : "border border-border bg-surface-secondary text-muted hover:border-foreground/40"
                      }`}
                    >
                      <CheckCircle2 size={13} className={isSelected ? "text-accent" : "opacity-30"} />
                      {amenity}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amenity input */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add custom amenity (e.g. 8K Red Monstro)..."
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  className="flex-1 rounded-2xl border border-border bg-surface-secondary px-3.5 py-2 text-xs focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  className="rounded-2xl border border-border px-4 py-2 text-xs font-semibold hover:bg-surface-secondary"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Overview Description */}
            <div>
              <label htmlFor="overview" className="block text-xs font-bold uppercase tracking-wider text-muted">
                Studio Overview & Specs *
              </label>
              <textarea
                id="overview"
                rows={4}
                required
                placeholder="Describe lighting orientation, ceiling height, blackout capabilities, sound damping, and house rules..."
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary p-4 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-4">
              <CustomButton
                type="submit"
                variant="primary"
                size="lg"
                loading={isPending}
                className="w-full"
              >
                Publish Studio Listing
              </CustomButton>
            </div>
          </form>
        </div>
      </AnimatedContent>
    </div>
  </div>
);
}
