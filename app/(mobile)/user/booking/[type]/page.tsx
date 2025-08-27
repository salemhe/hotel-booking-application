'use client';

import { RestaurantReservationDetails, HotelBookingDetails } from '../../../../../mobile/Users';

interface BookingPageProps {
  params: {
    type: 'restaurant' | 'hotel';
  };
  searchParams: {
    id?: string;
  };
}

export default function BookingPage({ params, searchParams }: BookingPageProps) {
  if (params.type === 'restaurant') {
    return <RestaurantReservationDetails restaurantId={searchParams.id} />;
  }
  
  return <HotelBookingDetails hotelId={searchParams.id} />;
}
