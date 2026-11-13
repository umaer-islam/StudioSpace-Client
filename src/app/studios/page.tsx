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
        {/* Header */}
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

        {/* Filter Controls Bar */}
        <div className="mt-10 rounded-2xl border border-border bg-surface p-5 md:p-6 shadow-sm space-y-5">
          {/* Top row: Search input & Sort */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, location, or equipment..."
                className="w-full rounded-full border border-border bg-background py-2.5 pl-10 pr-10 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <X size={15} />
                </button>
              )}
            </form>

            <div className="flex flex-wrap items-center gap-3">
              {/* Price Filter inputs */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted">Price ($/hr):</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setLoading(true);
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
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
                  className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-muted" />
                <select
                  value={sort}
                  onChange={(e) => {
                    setLoading(true);
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:border-accent focus:outline-none"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-t border-border pt-4">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-foreground text-background shadow"
                      : "border border-border bg-background text-muted hover:border-accent hover:text-foreground"
                  }`}
                >
                  {cat === "All" ? "All Spaces" : cat}
                </button>
              );
            })}
          </div>
        </div>

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
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
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
