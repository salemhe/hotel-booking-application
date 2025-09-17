import { Room } from "@/types/rooms";
// import { fetcher } from "@/utils/api";
import useSWR from "swr";

export function useRooms(hotelId: string) {
  const { data, error, isLoading, mutate } = useSWR<Room[]>(`https://your-api-domain.com/api/hotels/${hotelId}/rooms`,);
  return { rooms: data || [], error, isLoading, mutate };
}