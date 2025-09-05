export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  cuisine: string;
  priceRange: string;
  description?: string;
  isOpen: boolean;
  distance?: string;
}

export interface RestaurantsResponse {
  restaurants: Restaurant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
