import type {
  SearchResponse,
  Restaurant,
} from "@/types/restaurant";
import API from "@/utils/axios";

class APIError extends Error {
  constructor(message: string, public status?: number, public data?: unknown) {
    super(message);
    this.name = "APIError";
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options?: {
    restaurantId: string;
    booking: {
      date: Date;
      time: string;
      guests: string;
    };
  }
): Promise<T> {
  try {
    if (options) {
      const response = await API.post(`${endpoint}`, { options });
      return await response.data;
    } else {
      const response = await API.get(`${endpoint}`);
      return await response.data;
    }
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

export async function searchRestaurants(
  search: string
): Promise<SearchResponse> {
  // Convert filters to URLSearchParams
  const params = new URLSearchParams();

  if (search) {
    params.set("businessName", search);
  }
  return fetchAPI<SearchResponse>(`/vendors${params.toString()}`);
}

export async function getRestaurant(id: string): Promise<Restaurant> {
  return fetchAPI<Restaurant>(`/restaurants/${id}`);
}

export async function createBooking(
  restaurantId: string,
  booking: {
    date: Date;
    time: string;
    guests: string;
  }
): Promise<{ success: boolean; error?: string }> {
  return fetchAPI("/bookings", {
    restaurantId,
    booking,
  });
}
