import { bookingStorage } from './bookingStorage';

export const bookingNavigation = {
  // Check if user can proceed to payment
  canProceedToPayment: (hotelId: string): boolean => {
    const bookingData = bookingStorage.getBookingDataForHotel(hotelId);
    return bookingData ? bookingStorage.validateBookingData(bookingData) : false;
  },

  // Get the next step in the booking flow
  getNextStep: (hotelId: string): string | null => {
    const bookingData = bookingStorage.getBookingDataForHotel(hotelId);
    if (!bookingData) {
      return null; // No booking started
    }
    
    if (!bookingStorage.validateBookingData(bookingData)) {
      return `/hotels/${hotelId}`; // Back to hotel page to complete booking
    }
    
    return `/hotels/${hotelId}/payment`; // Ready for payment
  },

  // Validate current step and redirect if necessary
  validateCurrentStep: (hotelId: string, currentStep: string): string | null => {
    const bookingData = bookingStorage.getBookingDataForHotel(hotelId);
    
    switch (currentStep) {
      case 'payment':
        if (!bookingData || !bookingStorage.validateBookingData(bookingData)) {
          return `/hotels/${hotelId}`; // Redirect to hotel page if no valid booking
        }
        break;
      case 'confirmation':
        if (!bookingData) {
          return `/hotels/${hotelId}`; // Redirect to hotel page if no booking data
        }
        break;
    }
    
    return null; // No redirect needed
  },

  // Get booking progress percentage
  getProgressPercentage: (hotelId: string): number => {
    const bookingData = bookingStorage.getBookingDataForHotel(hotelId);
    if (!bookingData) return 0;
    
    let progress = 0;
    if (bookingData.checkInDate) progress += 25;
    if (bookingData.checkOutDate) progress += 25;
    if (bookingData.guests) progress += 25;
    if (bookingData.specialRequest !== undefined) progress += 25;
    
    return progress;
  },

  // Get missing fields for booking completion
  getMissingFields: (hotelId: string): string[] => {
    const bookingData = bookingStorage.getBookingDataForHotel(hotelId);
    if (!bookingData) return ['checkInDate', 'checkOutDate', 'guests'];
    
    const missing: string[] = [];
    if (!bookingData.checkInDate) missing.push('Check-in Date');
    if (!bookingData.checkOutDate) missing.push('Check-out Date');
    if (!bookingData.guests) missing.push('Number of Guests');
    
    return missing;
  }
}; 