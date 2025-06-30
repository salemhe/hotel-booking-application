import { useState, useEffect, useCallback } from 'react';
import { bookingStorage, HotelBookingData } from '../lib/utils/bookingStorage';

export const useBookingData = (hotelId: string) => {
  const [bookingData, setBookingData] = useState<HotelBookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load booking data from localStorage
  const loadBookingData = useCallback(() => {
    const data = bookingStorage.getBookingDataForHotel(hotelId);
    setBookingData(data);
    setIsLoading(false);
  }, [hotelId]);

  // Save booking data to localStorage
  const saveBookingData = useCallback((data: Omit<HotelBookingData, 'timestamp'>) => {
    const success = bookingStorage.saveBookingData(data);
    if (success) {
      const newBookingData = { ...data, timestamp: Date.now() };
      setBookingData(newBookingData);
    }
    return success;
  }, []);

  // Update specific fields in booking data
  const updateBookingData = useCallback((updates: Partial<HotelBookingData>) => {
    const success = bookingStorage.updateBookingData(updates);
    if (success) {
      const updatedData = bookingStorage.getBookingDataForHotel(hotelId);
      setBookingData(updatedData);
    }
    return success;
  }, [hotelId]);

  // Clear booking data
  // const clearBookingData = useCallback(() => {
  //   const success = bookingStorage.clearBookingData();
  //   if (success) {
  //     setBookingData(null);
  //   }
  //   return success;
  // }, []);

  // Check if booking data exists
  const hasBookingData = useCallback(() => {
    return bookingStorage.hasBookingData();
  }, []);

  // Validate current booking data
  const validateBookingData = useCallback(() => {
    return bookingData ? bookingStorage.validateBookingData(bookingData) : false;
  }, [bookingData]);

  // Load data on mount
  useEffect(() => {
    loadBookingData();
  }, [loadBookingData]);

  return {
    bookingData,
    isLoading,
    loadBookingData,
    saveBookingData,
    updateBookingData,
    // clearBookingData,
    hasBookingData,
    validateBookingData,
  };
}; 