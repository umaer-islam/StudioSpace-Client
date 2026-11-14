"use client";

import { useState, useEffect, useTransition, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import {
  fetchStudioById,
  updateStudio,
  CreateStudioPayload,
} from "@/lib/api";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomButton } from "@/components/ui/custom-button";
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

function EditStudioFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="animate-spin text-accent" size={36} />
    </div>
  );
}

function EditStudioContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
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
    amenities: [],
    overview: "",
  });

  const [status, setStatus] = useState<"active" | "inactive" | "maintenance">("active");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push(`/login?redirect=/studios/edit/${resolvedParams.id}`);
      return;
    }
    if (!user) return;

    let isMounted = true;
    fetchStudioById(resolvedParams.id)
      .then((res) => {
        if (!isMounted) return;
        const s = res.data;
        setFormData({
          title: s.title,
          category: s.category,
          hourlyRate: s.hourlyRate,
          securityDeposit: s.securityDeposit,
          maxCapacity: s.maxCapacity,
          location: s.location,
          address: s.address,
          imageUrl: s.imageUrl,
          amenities: s.amenities || [],
          overview: s.overview,
        });
        setSelectedAmenities(s.amenities || []);
        setStatus(s.status || "active");
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || "Failed to load studio details");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionLoading, user, resolvedParams.id, router]);

  if (sessionLoading || loading) {
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
            Only the registered Host who owns this listing can modify its details.
          </p>
          <div className="mt-6">
            <Link
              href="/my-listings"
              className="rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background hover:opacity-90"
            >
              Return to My Listings
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
    if (formData.hourlyRate <= 0) {
      setError("Hourly rate must be greater than 0");
      return;
    }

    startTransition(async () => {
      try {
        const payload: Partial<CreateStudioPayload> & { status: string } = {
          ...formData,
          amenities: selectedAmenities,
          status,
        };

        const res = await updateStudio(resolvedParams.id, payload);
        if (res.success) {
          toast.success("Studio listing updated successfully!");
          router.push("/my-listings");
        } else {
          toast.error(res.message || "Failed to update studio");
          setError(res.message || "Failed to update studio");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Studio update failed");
      }
    });
  };

  return (
    <div className="container-main py-10 lg:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/my-listings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground"
          >
            <ArrowLeft size={14} /> Back to My Listings
          </Link>
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-secondary px-3 py-1 text-xs font-semibold">
            Editing Studio #{resolvedParams.id.slice(-6)}
          </span>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-sm">
          <div className="border-b border-border pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Studio Details</h1>
            <p className="mt-1.5 text-sm text-muted">
              Update pricing, photos, equipment specifications, and listing status.
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            {/* Category & Status */}
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
                <CustomSelect
                  label="Listing Status *"
                  value={status}
                  options={[
                    { label: "Active (Available for booking)", value: "active" },
                    { label: "Inactive (Hidden from search)", value: "inactive" },
                    { label: "Maintenance", value: "maintenance" },
                  ]}
                  onChange={(val) =>
                    setStatus(val as "active" | "inactive" | "maintenance")
                  }
                />
              </div>
            </div>

            {/* Capacity & Rates */}
            <div className="grid gap-6 sm:grid-cols-3">
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

              <div>
                <label htmlFor="maxCapacity" className="block text-xs font-bold uppercase tracking-wider text-muted">
                  Max Guests *
                </label>
                <div className="relative mt-2">
                  <Users size={16} className="absolute left-3.5 top-3.5 text-muted" />
                  <input
                    id="maxCapacity"
                    type="number"
                    min={1}
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
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-xs font-bold uppercase tracking-wider text-muted">
                Studio Image URL
              </label>
              <div className="relative mt-2">
                <ImageIcon size={16} className="absolute left-3.5 top-3.5 text-muted" />
                <input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-surface-secondary pl-10 pr-4 py-3 text-sm focus:border-accent focus:outline-none"
                />
              </div>
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

              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add custom amenity..."
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
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary p-4 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/my-listings"
                className="flex-1 rounded-2xl border border-border py-3 text-center text-sm font-semibold hover:bg-surface-secondary"
              >
                Cancel
              </Link>
              <CustomButton
                type="submit"
                variant="primary"
                size="md"
                loading={isPending}
                className="flex-1"
              >
                Save Changes
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EditStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<EditStudioFallback />}>
      <EditStudioContent params={params} />
    </Suspense>
  );
}
