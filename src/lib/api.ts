export interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  address: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  hostId?: string;
  hostName: string;
  hostEmail: string;
  rating: number;
  reviewCount: number;
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  updatedAt: string;
}

export interface StudiosResponse {
  success: boolean;
  data: Studio[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StudioDetailResponse {
  success: boolean;
  data: Studio;
}

export interface StudioFilters {
  search?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sort?: string;
  page?: number;
  limit?: number;
}

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return (
    process.env.INTERNAL_API_URL
      ? `${process.env.INTERNAL_API_URL}/api`
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  );
}

export async function fetchStudios(
  filters: StudioFilters = {}
): Promise<StudiosResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category && filters.category !== "All")
    params.set("category", filters.category);
  if (filters.minPrice !== undefined && filters.minPrice !== "")
    params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined && filters.maxPrice !== "")
    params.set("maxPrice", String(filters.maxPrice));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));

  const queryString = params.toString();
  const url = `${getApiBaseUrl()}/studios${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch studios (${res.status} ${res.statusText})`);
  }

  return res.json();
}

export async function fetchStudioById(
  id: string
): Promise<StudioDetailResponse> {
  const url = `${getApiBaseUrl()}/studios/${id}`;
  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch studio (${res.status} ${res.statusText})`);
  }

  return res.json();
}

