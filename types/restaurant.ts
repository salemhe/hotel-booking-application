export type SearchFilters = {
  query: string;
  cuisines?: string[];
  prices?: string[];
  rating?: number;
  location?: string;
  page?: number;
  sortBy?: "rating" | "price" | "name";
  sortOrder?: "asc" | "desc";
};

export type SearchResponse = [
  {
    // restaurants: Restaurant[]
    // total: number
    // page: number
    // totalPages: number
    _id: string;
    name: string;
    // email: string;
    // phone: string;
    address: string;
    // branch: string;
    // role: string;
    profileImage: string;
    // services: string[];
    // price: string;
    // rating: number;
  }
];

export type Restaurant = {
  _id: string;
  name: string;
  businessName: string;
  // email: string;
  // phone: string;
  address: string;
  // branch: string;
  // role: string;
  profileImage: string;
  // services: string[];
  // price: string;
  // rating: number;
};
