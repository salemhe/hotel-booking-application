"use client";
import React from 'react';
import { useBookingData } from '../../../hooks/useBookingData';
import { Button } from '../../ui/button';
import { Calendar, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface BookingProgressProps {
  hotelId: string;
}

const BookingProgress: React.FC<BookingProgressProps> = ({ hotelId }) => {
  const { bookingData, hasBookingData } = useBookingData(hotelId);
  const router = useRouter();

  if (!hasBookingData() || !bookingData) {
    return null;
  }

  const checkInDate = new Date(bookingData.checkInDate);
  const checkOutDate = new Date(bookingData.checkOutDate);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleContinueBooking = () => {
    router.push(`/hotels/${hotelId}/payment`);
  };

  const handleEditBooking = () => {
    // Scroll to booking form
    const bookingForm = document.querySelector('[data-booking-form]');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Continue Your Booking
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(checkInDate, "MMM dd")} - {format(checkOutDate, "MMM dd, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{bookingData.guests} {parseInt(bookingData.guests) === 1 ? 'Guest' : 'Guests'}</span>
            </div>
            {bookingData.specialRequest && (
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>Special Request Added</span>
              </div>
            )}
          </div>
          <div className="mt-2 text-sm text-blue-700">
            {nights} {nights === 1 ? 'night' : 'nights'} • ₦{(bookingData.hotelInfo?.price || 150000) * nights} total
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditBooking}
            className="text-blue-700 border-blue-300 hover:bg-blue-100"
          >
            Edit
          </Button>
          <Button
            size="sm"
            onClick={handleContinueBooking}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingProgress; 