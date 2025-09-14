import { HotelDashboardStats } from "@/lib/types/hotels";
import { fetcher } from "@/utils/api";
import useSWR from "swr";

/**
 * Hook to fetch real-time hotel dashboard statistics
 * @param hotelId The ID of the hotel to fetch dashboard stats for
 * @returns Hotel dashboard statistics with real-time updates
 */export function useHotelDashboard(hotelId: string) {
  // Configure SWR to refetch data at specified intervals for real-time updates
  const { data, error, isLoading, mutate } = useSWR<HotelDashboardStats>(
    `/api/hotels/${hotelId}/dashboard`,
    fetcher,
    {
      // Refresh every 5 seconds for more responsive real-time data
      refreshInterval: 5000,
      // Revalidate on focus to get the latest data when user returns to the tab
      revalidateOnFocus: true,
      // Revalidate on reconnect to get the latest data when network reconnects
      revalidateOnReconnect: true,
      // Dedupe requests within a short time window to avoid hammering the API
      dedupingInterval: 2000,
      // Keep old data when revalidating to avoid flickering
      keepPreviousData: true
    }
  );
  
  return { 
    stats: data, 
    error, 
    isLoading,
    // Expose the mutate function to allow manual refreshes if needed
    refresh: mutate
  };
}