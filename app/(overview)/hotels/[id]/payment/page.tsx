"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, MapPin, Edit2, Star } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import BookingGuard from '../../../../../components/BookingGuard';
import { useBookingData } from '@/hooks/useBookingData';

const BookingDetails = () => {
  const [selectedPayment, setSelectedPayment] = useState('full');
  const router = useRouter();
  const params = useParams();
  const hotelId = params.id as string;
  const { bookingData, isLoading } = useBookingData(hotelId);

  useEffect(() => {
    // Redirect back to hotel page if no booking data exists
    if (!isLoading && !bookingData) {
      router.push(`/hotels/${hotelId}`);
    }
  }, [bookingData, isLoading, hotelId, router]);

  const handleDoneClick = () => {
    // Store booking data in localStorage before navigating to confirmation
    if (bookingData) {
      localStorage.setItem('hotelBookingData', JSON.stringify(bookingData));
    }
    router.push(`/hotel-confirmation`);
  };

  const handleBackClick = () => {
    router.push(`/hotels/${hotelId}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="mx-auto bg-white min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No booking data found</p>
          <button 
            onClick={handleBackClick}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
          >
            Back to Hotel
          </button>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(bookingData.checkInDate);
  const checkOutDate = new Date(bookingData.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const pricePerNight = bookingData.hotelInfo?.price || 150000;
  const totalPrice = pricePerNight * nights;

  return (
    <div className="mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 lg:px-24 py-4 border-b gap-4 sm:gap-3">
        <div className="flex items-center gap-3">
          <ArrowLeft 
            className="w-5 h-5 text-gray-600 cursor-pointer" 
            onClick={handleBackClick}
          />
          <h1 className="text-base sm:text-lg font-semibold text-gray-900">Booking Details</h1>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <span>Step 1 of 4</span>
          <div className="w-12 sm:w-16 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-24 py-6 sm:py-8 lg:py-16">
        {/* Hotel Information */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:mb-8">
          <div className="w-full sm:w-24 h-40 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image 
              src={bookingData.hotelInfo?.profileImages?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=160&fit=crop"} 
              alt={bookingData.hotelInfo?.businessName || "Hotel"} 
              width={384} height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {bookingData.hotelInfo?.businessName || "Hotel"}, Lagos, Nigeria
            </h2>
            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mb-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="line-clamp-2">{bookingData.hotelInfo?.address || "Address not available"}</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mb-2">101241 Nigeria</div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-sm font-medium">
                {bookingData.hotelInfo?.rating || 4.8} ({bookingData.hotelInfo?.reviews?.toLocaleString() || 1000} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Booking Details */}
          <div className="xl:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Booking Details</h3>
            
            {/* Date and Guest Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Check In Date</div>
                <div className="font-medium text-gray-900 flex items-center justify-between text-sm sm:text-base">
                  <span className="truncate">{format(checkInDate, "do MMM, yyyy")}</span>
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Check Out Date</div>
                <div className="font-medium text-gray-900 flex items-center justify-between text-sm sm:text-base">
                  <span className="truncate">{format(checkOutDate, "do MMM, yyyy")}</span>
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-gray-600 mb-1">Guest</div>
                <div className="font-medium text-gray-900 flex items-center justify-between text-sm sm:text-base">
                  <span className="truncate">{bookingData.guests} {parseInt(bookingData.guests) === 1 ? 'person' : 'people'}</span>
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>
              </div>
            </div>

            {/* Room Summary */}
            <div className="mb-6 sm:mb-8">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Room Summary</h4>
              <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Room name</div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">Superior Deluxe Room</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Price per night</div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">₦{pricePerNight.toLocaleString()}</div>
                  </div>
                  <div className="hidden lg:block"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Bed Type</div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">1 master bed</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">Guests Allowed</div>
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{bookingData.guests}</div>
                  </div>
                  <div className="hidden lg:block"></div>
                </div>
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-teal-600">
                  Free cancellation until 24h before check-in
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div className="mb-6 sm:mb-8">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Special Request (Optional)</h4>
              <textarea 
                value={bookingData.specialRequest || ""}
                readOnly
                placeholder="No special requests"
                className="w-full border border-gray-200 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600 resize-none h-20 sm:h-24 bg-gray-50"
              />
            </div>
          </div>

          {/* Right Column - Payment Plan */}
          <div className="xl:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Choose Payment Plan</h3>
            
            {/* Payment Options */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div 
                className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                  selectedPayment === 'full' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPayment('full')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Pay ₦{totalPrice.toLocaleString()} now</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    selectedPayment === 'full' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                  }`}>
                    {selectedPayment === 'full' && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-colors ${
                  selectedPayment === 'partial' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPayment('partial')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">Pay part now, rest later</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                    selectedPayment === 'partial' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                  }`}>
                    {selectedPayment === 'partial' && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Pay ₦{(totalPrice / 2).toLocaleString()} now, and ₦{(totalPrice / 2).toLocaleString()} on {format(checkInDate, "do MMM, yyyy")}. No extra fees
                </div>
              </div>
            </div>

            {/* Your Total */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
              <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Your Total</h4>
              <div className="space-y-2">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">Price Details</div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-900">₦{pricePerNight.toLocaleString()} / {nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">₦{totalPrice.toLocaleString()}</span>
                </div>
                <hr className="my-2 sm:my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">Sub Total</span>
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-24 py-4 sm:py-6 border-t gap-4 sm:gap-0">
        <button 
          onClick={handleBackClick}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm sm:text-base order-2 sm:order-1"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Back to Hotel Details Page</span>
          <span className="sm:hidden">Back to Hotel</span>
        </button>
        <button 
          onClick={handleDoneClick} 
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium w-full sm:w-auto text-sm sm:text-base order-1 sm:order-2"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default function PaymentPageWrapper() {
  const params = useParams();
  const hotelId = params.id as string;
  return (
    <BookingGuard hotelId={hotelId} requiredStep="payment">
      <BookingDetails />
    </BookingGuard>
  );
}