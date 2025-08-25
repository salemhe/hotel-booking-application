'use client';

import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Edit3, Calendar, Users, Bed, X } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Textarea } from '../../app/components/ui/textarea';
import { Badge } from '../../app/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '../../app/components/ui/radio-group';
import { Label } from '../../app/components/ui/label';
import BottomNavigation from './BottomNavigation';

interface BookingData {
  hotel: {
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    image: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  room: {
    name: string;
    price: number;
    bedType: string;
    guestsAllowed: number;
    cancellation: string;
  };
  paymentPlan: 'full' | 'partial';
  specialRequest: string;
}

const HotelBookingDetails = () => {
  const [step, setStep] = useState<'booking' | 'form'>('booking');
  const [booking, setBooking] = useState<BookingData>({
    hotel: {
      name: 'Eko Hotel & Suites - Lagos, Nigeria',
      location: '16, Idowu Taylor Street, Victoria Island...',
      rating: 4.8,
      reviewCount: 1000,
      image: '/api/placeholder/60/60'
    },
    checkIn: '23rd May, 2025',
    checkOut: '25th May, 2025',
    guests: 2,
    room: {
      name: 'Superion Deluxe Room',
      price: 150000,
      bedType: '1 master bed',
      guestsAllowed: 2,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    paymentPlan: 'full',
    specialRequest: ''
  });

  const DetailRow = ({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-600 block mb-1">{label}</span>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
        {onEdit && (
          <button onClick={onEdit} className="p-2">
            <Edit3 className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </div>
  );

  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
          <button onClick={() => setStep('booking')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Make Booking</h1>
          <button onClick={() => setStep('booking')}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Price Header */}
        <div className="bg-white px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">#{booking.room.price.toLocaleString()}</span>
              <span className="text-sm text-gray-500 ml-1">/night</span>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              20% off
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-1">Prices includes all fees</p>
        </div>

        {/* Form Content */}
        <div className="px-4 py-6 space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Check In</Label>
            <Input
              value="Select date"
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Check Out</Label>
            <Input
              value="Select date"
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Guests/Rooms</Label>
            <Input
              value="Select room"
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Room Type</Label>
            <Input
              value="Select room type"
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Reserve Button */}
        <div className="fixed bottom-20 left-4 right-4">
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
            Reserve Table
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b">
        <button>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Booking Details</h1>
      </div>

      {/* Hotel Info */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex gap-3">
          <img 
            src={booking.hotel.image}
            alt={booking.hotel.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{booking.hotel.name}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{booking.hotel.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{booking.hotel.rating}</span>
              <span className="text-xs text-gray-500">({booking.hotel.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="px-4 py-6 space-y-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Reservation Details</h3>
            <div className="space-y-3">
              <DetailRow 
                label="Check In Date" 
                value={booking.checkIn}
                onEdit={() => {}}
              />
              <DetailRow 
                label="Check Out Date" 
                value={booking.checkOut}
                onEdit={() => {}}
              />
              <DetailRow 
                label="Guest" 
                value={`${booking.guests} people`}
                onEdit={() => {}}
              />
            </div>
          </CardContent>
        </Card>

        {/* Room Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Room Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Room name</span>
                <span className="text-sm font-medium">Price per night</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{booking.room.name}</span>
                <span className="font-semibold">#{booking.room.price.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Bed Type</span>
                <span className="text-sm text-gray-600">Guests Allowed</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{booking.room.bedType}</span>
                <span className="font-medium">{booking.room.guestsAllowed}</span>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-teal-600">{booking.room.cancellation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Request */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Special Request (Optional)</h3>
            <Textarea
              placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
              value={booking.specialRequest}
              onChange={(e) => setBooking(prev => ({ ...prev, specialRequest: e.target.value }))}
              className="min-h-[100px] resize-none border-gray-200"
            />
          </CardContent>
        </Card>

        {/* Payment Plan */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Choose Payment Plan</h3>
            <RadioGroup 
              value={booking.paymentPlan}
              onValueChange={(value: 'full' | 'partial') => setBooking(prev => ({ ...prev, paymentPlan: value }))}
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="full" id="full" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="full" className="font-medium cursor-pointer">
                    Pay #{booking.room.price.toLocaleString()} now
                  </Label>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="partial" id="partial" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="partial" className="font-medium cursor-pointer">
                    Pay part now, rest later
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Pay 75,000 now, and 75,000 on 23rd may, 2025. No extra fees
                  </p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Total */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Your Total</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Price Details</span>
                <span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">#{booking.room.price.toLocaleString()} /2 nights</span>
                <span className="font-semibold">#{(booking.room.price * 2).toLocaleString()}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Sub Total</span>
                <span>#{(booking.room.price * 2).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <Button 
          onClick={() => setStep('form')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
        >
          Continue to Payment
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HotelBookingDetails;
