import { RestaurantData } from "../auth";

export type Restaurant = {
  _id: string;
  name: string;
  businessName: string;
  businessDescription: string;
  email: string;
  phone: string;
  address: string;
  openingTime: string;
  closingTime: string;
  cuisines: string[];
  availableSlots: string[];
  rating: number;
  reviews: number;
  // branch: string;
  // role: string;
  profileImage?: string;
  priceRange: number;
  // services: string[];
  // price: string;
  // rating: number;
  businessType: string;
  branch: string;
  role: string;
  profileImages?: {
    id: string;
    url: string;
  }[];
  services: string[];

  paymentDetails: {
    bankAccountName: string;
    bankName: string;
    bankCode: string;
    accountNumber: string;
    recipientCode: string;
  };
  percentageCharge: number;
  balance: number;
  isVerified: boolean;
  createdAt: string;
};

export type Menu = {
  _id: string;
  vendor: string;
  addOns: string[];
  availabilityStatus: boolean;
  category: "Appetizer" | "Main Course" | "Dessert" | "Drinks";
  cuisineType: string;
  price: number;
  dishName: string;
}

export interface BookingDetails {
  businessName: string;
  guests: number;
  date: string;
  time: string;
  _id: string;
  location: string;
  specialRequest: string;
  totalPrice: number;
  meals: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    specialRequest: string;
    category: "Appetizer" | "Main Course" | "Dessert" | "Drinks";
  }[];
}

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


export interface SearchResponse {
  message: string;
  data: RestaurantData[];
}

export interface Combos {
  _id: string;
  image: string;
  title: string;
  price: number;
  offers: string[];
  specials: string;
  selected: boolean;
}

export interface Bottles {
  _id: string;
  image: string;
  category:
    | "Champagne"
    | "Vodka"
    | "WHisky"
    | "Cognac"
    | "Tequila"
    | "Drink Mixers";
  title: string;
  description: string;
  price: number;
  specials: string;
  selected: boolean;
  quantity: number;
}

export interface VIP {
  _id: string;
  title: string;
  description: string;
  price: number;
  selected: boolean;
}