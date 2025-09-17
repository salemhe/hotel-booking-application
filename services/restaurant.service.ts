import { SearchResponse } from "@/types/user/restaurant";
import API from "../lib/api";

export const restaurantService = {
  searchRestaurants: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await API.get(`/users/restaurant-search?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching restaurants:', error);
      throw error;
    }
  }
}; 