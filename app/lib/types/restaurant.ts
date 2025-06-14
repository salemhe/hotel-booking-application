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
  profileImage: string;
  // services: string[];
  // price: string;
  // rating: number;
  businessType: string;
  branch: string;
  role: string;
  profileImages: {
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
