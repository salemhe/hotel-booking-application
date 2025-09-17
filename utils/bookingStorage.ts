export interface HotelBookingData {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: string;
  specialRequest: string;
  hotelInfo?: {
    businessName: string;
    address: string;
    rating: number;
    reviews: number;
    profileImages: string[];
    price: number;
  };
  timestamp: number;
}

const BOOKING_STORAGE_KEY = 'hotel_booking_data';

export const bookingStorage = {
  // Save booking data to localStorage
  saveBookingData: (data: Omit<HotelBookingData, 'timestamp'>) => {
    try {
      const bookingData: HotelBookingData = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookingData));
      return true;
    } catch (error) {
      console.error('Error saving booking data:', error);
      return false;
    }
  },

  // Get booking data from localStorage
  getBookingData: (): HotelBookingData | null => {
    try {
      const data = localStorage.getItem(BOOKING_STORAGE_KEY);
      if (!data) {
        console.log("No data found in localStorage");
        return null;
      }
      
      const bookingData: HotelBookingData = JSON.parse(data);
      console.log("Retrieved booking data timestamp:", bookingData.timestamp);
      console.log("Current time:", Date.now());
      console.log("Time difference:", Date.now() - bookingData.timestamp);
      
      // Check if data is older than 24 hours (86400000 ms)
      const isExpired = Date.now() - bookingData.timestamp > 86400000;
      console.log("Is data expired:", isExpired);
      
      if (isExpired) {
        console.log("Data is expired, removing from localStorage");
        localStorage.removeItem(BOOKING_STORAGE_KEY);
        return null;
      }
      
      console.log("Data is valid, returning");
      return bookingData;
    } catch (error) {
      console.error('Error retrieving booking data:', error);
      return null;
    }
  },

  // Get booking data for a specific hotel
  getBookingDataForHotel: (hotelId: string): HotelBookingData | null => {
    console.log("getBookingDataForHotel called with hotelId:", hotelId);
    const data = bookingStorage.getBookingData();
    console.log("All booking data:", data);
    const result = data && data.hotelId === hotelId ? data : null;
    console.log("Filtered booking data for hotel:", result);
    return result;
  },

  // Clear booking data
  clearBookingData: () => {
    try {
      localStorage.removeItem(BOOKING_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing booking data:', error);
      return false;
    }
  },

  // Update specific fields in booking data
  updateBookingData: (updates: Partial<HotelBookingData>) => {
    try {
      const existingData = bookingStorage.getBookingData();
      if (!existingData) return false;

      const updatedData: HotelBookingData = {
        ...existingData,
        ...updates,
        timestamp: Date.now() // Update timestamp
      };

      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Error updating booking data:', error);
      return false;
    }
  },

  // Check if booking data exists
  hasBookingData: (): boolean => {
    return bookingStorage.getBookingData() !== null;
  },

  // Validate booking data
  validateBookingData: (data: HotelBookingData): boolean => {
    return !!(
      data.hotelId &&
      data.checkInDate &&
      data.checkOutDate &&
      data.guests
    );
  }
}; 