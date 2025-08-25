'use client';

import React, { useState } from 'react';
import { 
  HomePage, 
  RestaurantProfile, 
  HotelProfile,
  PaymentPage,
  BookingConfirmation,
  RestaurantReservationDetails,
  HotelBookingDetails,
  ReservationSummary,
  MealPreSelection
} from '../../mobile/Users';

const DEMO_PAGES = [
  { id: 'home', name: 'Home Page', component: HomePage },
  { id: 'restaurant-profile', name: 'Restaurant Profile', component: RestaurantProfile },
  { id: 'restaurant-reservation', name: 'Restaurant Reservation', component: RestaurantReservationDetails },
  { id: 'reservation-summary', name: 'Reservation Summary', component: ReservationSummary },
  { id: 'meal-selection', name: 'Meal Pre-Selection', component: MealPreSelection },
  { id: 'hotel-profile', name: 'Hotel Profile', component: HotelProfile },
  { id: 'hotel-booking', name: 'Hotel Booking', component: HotelBookingDetails },
  { id: 'payment', name: 'Payment Page', component: PaymentPage },
  { id: 'confirmation', name: 'Booking Confirmation', component: BookingConfirmation },
];

export default function MobileDemoPage() {
  const [currentPage, setCurrentPage] = useState('home');
  
  const CurrentComponent = DEMO_PAGES.find(page => page.id === currentPage)?.component || HomePage;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Navigation */}
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Mobile Components Demo</h1>
        <div className="flex flex-wrap gap-2">
          {DEMO_PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentPage === page.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Component Container */}
      <div className="flex justify-center bg-gray-100 min-h-screen">
        <div className="w-full max-w-md bg-white shadow-lg">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
