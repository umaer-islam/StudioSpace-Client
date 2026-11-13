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

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  _id: string;
  studioId: string;
  creatorId: string;
  hostId: string;
  startTime: string;
  endTime: string;
  hours: number;
  hourlyRate: number;
  securityDeposit: number;
  rentalFee: number;
  totalPrice: number;
  currency: "BDT" | string;
  studioTitle: string;
  studioLocation: string;
  studioImageUrl: string;
  creatorName: string;
  creatorEmail: string;
  hostName: string;
  hostEmail: string;
  status: BookingStatus;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: "creator" | "host";
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  success: boolean;
  data: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OccupiedSlot {
  startTime: string;
  endTime: string;
  status: BookingStatus;
}

export async function createBooking(input: {
  studioId: string;
  startTime: string;
  endTime: string;
  notes?: string;
}): Promise<{ success: boolean; data: Booking; message?: string }> {
  const res = await fetch(`${getApiBaseUrl()}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Booking failed with status ${res.status}`);
  }

  return data;
}

export async function fetchMyBookings(filters: {
  page?: number;
  limit?: number;
  status?: string;
} = {}): Promise<BookingsResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status && filters.status !== "all") params.set("status", filters.status);

  const queryString = params.toString();
  const url = `${getApiBaseUrl()}/bookings/my-bookings${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch bookings (${res.status})`);
  }

  return res.json();
}

export async function fetchHostReservations(filters: {
  page?: number;
  limit?: number;
  status?: string;
} = {}): Promise<BookingsResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.status && filters.status !== "all") params.set("status", filters.status);

  const queryString = params.toString();
  const url = `${getApiBaseUrl()}/bookings/host-reservations${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch host reservations (${res.status})`);
  }

  return res.json();
}

export async function fetchStudioAvailability(
  studioId: string
): Promise<{ success: boolean; data: OccupiedSlot[] }> {
  const res = await fetch(`${getApiBaseUrl()}/studios/${studioId}/availability`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch availability (${res.status})`);
  }

  return res.json();
}

export async function confirmBooking(bookingId: string): Promise<Booking> {
  const res = await fetch(`${getApiBaseUrl()}/bookings/${bookingId}/confirm`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to confirm booking (${res.status})`);
  }

  return data.data;
}

export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<Booking> {
  const res = await fetch(`${getApiBaseUrl()}/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reason }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to cancel booking (${res.status})`);
  }

  return data.data;
}

export async function completeBooking(bookingId: string): Promise<Booking> {
  const res = await fetch(`${getApiBaseUrl()}/bookings/${bookingId}/complete`, {
    method: "PATCH",
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Failed to complete booking (${res.status})`);
  }

  return data.data;
}

