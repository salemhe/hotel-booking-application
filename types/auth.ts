export interface AuthState {
  user:
    | UserProfile
    | RestaurantData
    | null;
  isAuthenticated: boolean;
}

export interface Restaurant {
  id: string;
  email: string;
}

export type VendorType = "hotel" | "restaurant" | "club";

export interface VendorState {
  type: VendorType | null;
  details: Restaurant;
}

export interface DecodedToken {
  id: string;
  exp?: number;
  iat?: number;
  role: "user" | "vendor" | "admin" | null;
  vendorType: string;
}

export interface VendorLoginResponse {
  message?: string;
  user?: {
    businessName?: string;
    businessType?: string;
    email?: string;
    address?: string;
    branch?: string;
    profileImages?: string;
    services?: string[];
    token?: string;
    onboarded?: boolean;
    role?: string;
    _id?: string;
  };
}

export interface UserLoginResponse {
  message?: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    profileImage?: string;
    isOnboarded?: boolean;
    isVerified?: boolean;
    role?: string;
    _id?: string;
  };
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  isOnboarded: boolean;
  isVerified: boolean;
  role: string;
  _id: string;
}

export interface RestaurantData {
  businessName: string;
  businessType: string;
  email: string;
  address: string;
  branch: string;
  profileImages: string;
  services: string[];
  onboarded: boolean;
  role: string;
  _id: string;
}

export interface RegisterData {
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: string;
  onboarded?: boolean;
}

export interface PaymentDetalsProps {
  accountNumber: string;
  bankAccountName: string;
  bankCode: string;
  bankName: string;
  paystackSubAccount: string;
  percentageCharge: number;
  recipientCode: string;
}

export interface AuthUser {
  email: string;
  role: string;
  token?: string;
  id: string;
  businessName?: string;
  businessType?: string;
  address?: string;
  branch?: string;
  profileImage?: string;
  onboarded?: boolean;
  profile: {
    id: string;
    businessName: string;
    businessType: string;
    email: string;
    address: string;
    branch: string;
    profileImage: string;
    phone: number;
    paymentDetails: PaymentDetalsProps;
    recipientCode: string;
    onboarded: boolean;
  };
}
