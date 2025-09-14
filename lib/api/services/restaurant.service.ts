// import { userAxios } from '../userAxios';

import API from "../userAxios";

export interface MenuItem {
  _id: string;
  vendor: string;
  description: string;
  price: number;
  category: string;
  itemImage: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dishName: string;
}

export interface Restaurant {
  _id: string;
  businessName: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string | null;
  services: string[];
  createdAt: string;
  menus: MenuItem[];
}

export interface SearchResponse {
  message: string;
  data: Restaurant[];
}

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