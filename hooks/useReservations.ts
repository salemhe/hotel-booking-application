import { Reservation, ReservationStatus } from "@/lib/types/reservation";
import { fetcher } from "@/utils/api";
import useSWR from "swr";

interface ReservationFilters {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

function buildQuery(filters: ReservationFilters) {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  return params.toString() ? `?${params}` : "";
}

export function useReservations(hotelId: string, filters: ReservationFilters = {}) {
  const query = buildQuery(filters);
  const { data, error, isLoading, mutate } = useSWR<Reservation[]>(
    `https://your-api-domain.com/api/hotels/${hotelId}/reservations${query}`,
    fetcher
  );
  return { reservations: data || [], error, isLoading, mutate };
}