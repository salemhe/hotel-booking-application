export interface Club {
  _id: string;
  address: string;
  openingTime: string;
  closingTime: string;
  dressCode: string[];
  businessDescription: string;
  priceRange: number;
  profileImages: {
    url: string;
  }[];
  businessName: string;
  rating: number;
  reviews: number
  phone: string
  email: string;
  ageLimit: number;
  slots: number;
  specials: string;
}