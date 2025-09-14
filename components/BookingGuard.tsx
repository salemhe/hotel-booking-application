"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingData } from '../hooks/useBookingData';
import { bookingNavigation } from '../utils/bookingNavigation';

interface BookingGuardProps {
  hotelId: string;
  children: React.ReactNode;
  requiredStep?: 'payment' | 'confirmation';
}

const BookingGuard: React.FC<BookingGuardProps> = ({ 
  hotelId, 
  children, 
  requiredStep = 'payment' 
}) => {
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const { bookingData, isLoading } = useBookingData(hotelId);

  useEffect(() => {
    if (!isLoading) {
      console.log("BookingGuard: Checking booking data for hotel:", hotelId);
      console.log("BookingGuard: Current booking data:", bookingData);
      
      const redirectUrl = bookingNavigation.validateCurrentStep(hotelId, requiredStep);
      console.log("BookingGuard: Validation result - redirect URL:", redirectUrl);
      
      if (redirectUrl) {
        console.log("BookingGuard: Redirecting to:", redirectUrl);
        router.push(redirectUrl);
        return;
      }
      
      console.log("BookingGuard: Validation passed, showing content");
      setIsValid(true);
      setIsChecking(false);
    }
  }, [bookingData, isLoading, hotelId, requiredStep, router]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating booking...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Booking</h2>
          <p className="text-gray-600 mb-4">
            {requiredStep === 'payment' 
              ? 'Please complete your booking details before proceeding to payment.'
              : 'No booking data found.'
            }
          </p>
          <button
            onClick={() => router.push(`/hotels/${hotelId}`)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Hotel
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BookingGuard; 