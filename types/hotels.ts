export interface HotelDashboardStats {
   occupancyRate: number; // 0-1
   revenue: number;
   activeReservations: number;
   totalRooms: number;
   bookedToday: number;
 }

 export interface HotelFormData {
  hotelName: string;
  phoneNumber: string;
  countryCode: string;
  emailAddress: string;
  address: string;
  additionalAddressDetail: string;
  branchCode: string;
  hotelType: 'Apartment' | 'Hotel' | 'Resort' | 'Villa';
  hotelCategory: 'Standard' | 'Luxury' | 'Business';
  logoImage?: File;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  images?: File[];
}

export type HotelCategory = 'Standard' | 'Luxury' | 'Business';
export type HotelType = 'Apartment' | 'Hotel' | 'Resort' | 'Villa';