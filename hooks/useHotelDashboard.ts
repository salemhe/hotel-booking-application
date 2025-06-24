import { HotelDashboardStats } from "@/types/hotels";
import { fetcher } from "@/utils/api";
import useSWR from "swr";


export function useHotelDashboard(hotelId: string) {
  const { data, error, isLoading } = useSWR<HotelDashboardStats>(
    `https://your-api-domain.com/api/hotels/${hotelId}/dashboard`,
    fetcher
  );
  return { stats: data, error, isLoading };
}