'use client';

import React from 'react';
import { Check, MapPin, Clock, Mail, Info } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import BottomNavigation from './BottomNavigation';

interface BookingConfirmationProps {
  type: 'hotel' | 'restaurant';
}

const BookingConfirmation = ({ type = 'restaurant' }: BookingConfirmationProps) => {
  // Restaurant booking data
  const restaurantBooking = {
    confirmationId: '#RES12345',
    restaurant: 'Kapadoccia Restaurant',
    location: '16, Idowu Taylor Street, Victoria Island 101...',
    date: 'May 29, 2025',
    time: '7:30 PM',
    guests: 4,
    items: [
      { name: '2x Meze Platter', price: 30000 },
      { name: '1x Chicken Springrolls', price: 12000 }
    ],
    total: 42000,
    paymentStatus: 'paid', // or 'pending'
    paymentTime: '8:00 am. May 28, 2025'
  };

  // Hotel booking data
  const hotelBooking = {
    checkInDate: '23rd May, 2025',
    checkOutDate: '25th May, 2025',
    guests: 2,
    hotel: 'Eko Hotel & Suites',
    room: {
      name: 'Superion Deluxe Room',
      price: 150000,
      bedType: '1 master bed',
      guestsAllowed: 2
    },
    cancellation: 'Free cancellation until 24h before check-in'
  };

  if (type === 'hotel') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Success Icon */}
        <div className="text-center pt-12 pb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Your bookings is confirmed &<br />your payment received
          </h1>
          <p className="text-sm text-gray-600">
            Thank you for completing your booking<br />process, we look forward to seeing you
          </p>
        </div>

        {/* Booking Details */}
        <div className="px-4 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Reservation Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 block">Check In Date</span>
                  <span className="font-medium">{hotelBooking.checkInDate}</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Check Out Date</span>
                  <span className="font-medium">{hotelBooking.checkOutDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600 block">Guests Allowed</span>
                  <span className="font-medium">{hotelBooking.guests}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Room Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room name</span>
                  <span className="text-gray-600">Price per night</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{hotelBooking.room.name}</span>
                  <span className="font-semibold">#{hotelBooking.room.price.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Bed Type</span>
                  <span className="text-gray-600">Guests Allowed</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">{hotelBooking.room.bedType}</span>
                  <span className="font-medium">{hotelBooking.room.guestsAllowed}</span>
                </div>
                
                <div className="pt-2">
                  <p className="text-teal-600 text-xs">{hotelBooking.cancellation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Confirmation */}
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              You will receive a confirmation email with your reservation details
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-20 left-4 right-4 grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-teal-600 text-teal-600">
            Get Direction
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            Done
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Restaurant confirmation
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Icon */}
      <div className="text-center pt-12 pb-6">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Reservation Completed<br />Successfully
        </h1>
        <p className="text-sm text-gray-600">
          Thank you for completing your reservation<br />process, we look forward to seeing you
        </p>
      </div>

      {/* Reservation Details */}
      <div className="px-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Reservation Details</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600 block">Restaurant</span>
                <span className="font-medium">{restaurantBooking.restaurant}</span>
                <p className="text-xs text-gray-500">{restaurantBooking.location}</p>
              </div>
              
              <div>
                <span className="text-gray-600 block">Reservation ID</span>
                <span className="font-medium">{restaurantBooking.confirmationId}</span>
              </div>
              
              <div>
                <span className="text-gray-600 block">Date & Time</span>
                <span className="font-medium">{restaurantBooking.date} • {restaurantBooking.time}</span>
              </div>
              
              <div>
                <span className="text-gray-600 block">Guests</span>
                <span className="font-medium">{restaurantBooking.guests} Guests</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Your Selection ({restaurantBooking.items.length} items)</h3>
            
            <div className="space-y-3">
              {restaurantBooking.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">#{item.price.toLocaleString()}</span>
                </div>
              ))}
              
              <hr className="my-3" />
              
              <div className="flex justify-between font-semibold">
                <span>{restaurantBooking.paymentStatus === 'paid' ? 'Amount paid' : 'Amount to be paid'}</span>
                <span>#{restaurantBooking.total.toLocaleString()}</span>
              </div>
              
              {restaurantBooking.paymentStatus === 'paid' ? (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-green-600 font-medium">Paid</span>
                  <span className="text-gray-500">• Payment made at {restaurantBooking.paymentTime}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Pay at Restaurant
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              You will receive a confirmation email with your reservation details
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-800">
              Please, arrive 10 mins early
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-4 right-4 grid grid-cols-2 gap-3">
        <Button variant="outline" className="border-teal-600 text-teal-600">
          Get Direction
        </Button>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          Done
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default BookingConfirmation;
