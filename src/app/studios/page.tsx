"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  RefreshCcw,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Studio, fetchStudios } from "@/lib/api";
import { StudioCard } from "@/components/studios/studio-card";
import { StudioSkeleton } from "@/components/studios/studio-skeleton";
import { CustomSelect } from "@/components/ui/custom-select";
import { CustomInput } from "@/components/ui/custom-input";
import { CustomButton } from "@/components/ui/custom-button";
import RubberSegment from "@/components/react-bits/rubber-segment";
import AnimatedContent from "@/components/react-bits/animated-content";

const CATEGORIES = [
  "All",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

function StudiosListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get("category") || "All";
  const urlSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState(urlCategory);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [activeSearch, setActiveSearch] = useState(urlSearch);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const limit = 6;

  const [studios, setStudios] = useState<Studio[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    fetchStudios({
      search: activeSearch || undefined,
      category: category !== "All" ? category : undefined,
      minPrice: minPrice !== "" ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
      sort,
      page,
      limit,
    })
      .then((res) => {
        if (isCurrent) {
          setStudios(res.data);
          setTotal(res.pagination.total);
          setTotalPages(res.pagination.totalPages);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isCurrent) {
          setError(
            err instanceof Error ? err.message : "Failed to load studios."
          );
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [activeSearch, category, minPrice, maxPrice, sort, page, reloadKey]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActiveSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setLoading(true);
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  const handleCategoryChange = (newCat: string) => {
    setLoading(true);
    setCategory(newCat);
    setPage(1);
  };

  const handleResetFilters = () => {
    setLoading(true);
    setCategory("All");
    setSearchInput("");
    setActiveSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setPage(1);
    router.push("/studios");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen py-10 md:py-14 bg-background">
      <div className="container-main">
        {/* Animated Header & Filter Controls Bar */}
        <AnimatedContent distance={30} duration={0.6} trigger="mount">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              STUDIO DIRECTORY
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl text-foreground">
              Explore Creative Spaces
            </h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              Find and book photography lofts, sound stages, podcast rooms, and art workshops tailored to your production needs.
            </p>
          </div>
        </AnimatedContent>

        {/* Filter Controls Bar */}
        <AnimatedContent distance={35} duration={0.65} delay={0.1} trigger="mount">
          <div className="mt-10 rounded-3xl border border-border bg-surface p-5 md:p-6 shadow-xs space-y-5">
            {/* Top row: Custom Search Input, Price & Custom Dropdown Sort */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
                <CustomInput
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by title, location, equipment..."
                  leftIcon={<Search size={16} />}
                  clearable
                  onClear={handleClearSearch}
                />
              </form>

              <div className="flex flex-wrap items-center gap-3">
                {/* Price Filter inputs */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted font-semibold">Price ($/hr):</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setLoading(true);
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-16 rounded-xl border border-border bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus:border-foreground focus:outline-none transition-colors"
                  />
                  <span className="text-muted">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setLoading(true);
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-16 rounded-xl border border-border bg-background px-2.5 py-2 text-xs font-semibold text-foreground focus:border-foreground focus:outline-none transition-colors"
                  />
                </div>

                {/* Custom Animated Sort Dropdown */}
                <div className="w-48">
                  <CustomSelect
                    options={SORT_OPTIONS}
                    value={sort}
                    onChange={(val) => {
                      setLoading(true);
                      setSort(val);
                      setPage(1);
                    }}
                    leftIcon={<SlidersHorizontal size={14} />}
                  />
                </div>
              </div>
            </div>

            {/* Category Tabs with Kinetic Rubber Segment */}
            <div className="border-t border-border pt-4 max-w-full overflow-x-auto pb-1 scrollbar-none">
              <RubberSegment
                items={CATEGORIES.map((cat) => ({
                  value: cat,
                  label: cat === "All" ? "All Spaces" : cat,
                }))}
                value={category}
                onChange={(val) => handleCategoryChange(val)}
                equalSlots={false}
                size="sm"
                radius={9999}
                inset={3}
                stretch={80}
                squash={2.5}
                speed={1.1}
                draggable={true}
                className="border border-border shadow-2xs"
              />
            </div>
          </div>
        </AnimatedContent>

        {/* Results Bar */}
        <div className="mt-8 flex items-center justify-between text-xs text-muted">
          <span>
            {loading ? "Searching spaces..." : `Showing ${studios.length} of ${total} spaces`}
          </span>

          {(category !== "All" || activeSearch || minPrice || maxPrice) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="font-medium text-accent hover:underline flex items-center gap-1"
            >
              <RefreshCcw size={12} /> Clear all filters
            </button>
          )}
        </div>

        {/* Grid Content */}
        {loading && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudioSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <AlertCircle size={36} className="text-accent" />
            <h3 className="mt-4 font-semibold text-foreground">
              Unable to load creative spaces
            </h3>
            <p className="mt-2 text-xs text-muted max-w-sm">
              {error}
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:opacity-85 transition-opacity"
            >
              <RefreshCcw size={14} /> Retry
            </button>
          </div>
        )}

        {!loading && !error && studios.length === 0 && (
          <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-16 text-center">
            <p className="text-base font-semibold text-foreground">No creative spaces found</p>
            <p className="mt-2 text-xs text-muted max-w-sm">
              Try adjusting your search terms, changing the category, or expanding your price range.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:opacity-85 transition-opacity"
            >
              Reset all filters
            </button>
          </div>
        )}

        {!loading && !error && studios.length > 0 && (
          <AnimatedContent
            distance={40}
            duration={0.65}
            stagger={0.06}
            trigger="mount"
            className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </AnimatedContent>
        )}

        {/* Pagination Bar */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 200, behavior: "smooth" });
              }}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground disabled:opacity-40 hover:bg-surface-secondary transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const isCurrent = page === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setPage(p);
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  className={`h-9 min-w-9 px-3 rounded-lg text-xs font-semibold transition-colors ${
                    isCurrent
                      ? "bg-foreground text-background"
                      : "border border-border bg-surface text-foreground hover:bg-surface-secondary"
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 200, behavior: "smooth" });
              }}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground disabled:opacity-40 hover:bg-surface-secondary transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudiosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 container-main">
          <div className="h-8 w-48 rounded bg-surface-secondary animate-pulse mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <StudioSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <StudiosListContent />
    </Suspense>
  );
}
