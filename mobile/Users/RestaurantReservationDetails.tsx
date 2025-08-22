'use client';

import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Edit3, Clock, Users, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import BottomNavigation from './BottomNavigation';

interface ReservationData {
  restaurant: {
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    image: string;
  };
  date: string;
  time: string;
  guests: number;
  table?: string;
  preferences: {
    occasion: string;
    seatingPreference: string;
    specialRequest: string;
  };
}

const RestaurantReservationDetails = () => {
  const [step, setStep] = useState<'details' | 'preferences' | 'form'>('details');
  const [reservation, setReservation] = useState<ReservationData>({
    restaurant: {
      name: 'Kapadoccia - Lagos, Nigeria',
      location: '16, Idowu Taylor Street, Victoria Island...',
      rating: 4.8,
      reviewCount: 1000,
      image: '/api/placeholder/60/60'
    },
    date: '23rd May, 2025',
    time: '07:30 pm',
    guests: 2,
    table: 'VIP Lounge',
    preferences: {
      occasion: '',
      seatingPreference: 'Indoor',
      specialRequest: ''
    }
  });

  const occasions = ['Birthday', 'Casual', 'Business', 'Anniversary', 'Others'];
  const seatingOptions = ['Indoor', 'Outdoor', 'No Preference'];

  const handlePreferenceChange = (field: string, value: string) => {
    setReservation(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

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
          <button onClick={() => setStep('preferences')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Make Reservation</h1>
          <button onClick={() => setStep('details')}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="px-4 py-6 space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Date</Label>
            <Input
              value="Pick date"
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Available Time</Label>
            <Input
              value="Select Time"
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Table</Label>
            <Input
              value="Select table"
              readOnly
              className="bg-gray-50 border-gray-200"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Guest</Label>
            <Input
              value="Select number"
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

  if (step === 'preferences') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center gap-3 border-b">
          <button onClick={() => setStep('details')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Reservation Details</h1>
        </div>

        {/* Restaurant Info */}
        <div className="bg-white px-4 py-4 border-b">
          <div className="flex gap-3">
            <img 
              src={reservation.restaurant.image}
              alt={reservation.restaurant.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">{reservation.restaurant.name}</h2>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{reservation.restaurant.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{reservation.restaurant.rating}</span>
                <span className="text-xs text-gray-500">({reservation.restaurant.reviewCount.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="px-4 py-6 space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Reservation Details</h3>
              <div className="space-y-3">
                <DetailRow 
                  label="Date" 
                  value={reservation.date}
                  onEdit={() => {}}
                />
                <DetailRow 
                  label="Available Time" 
                  value={reservation.time}
                  onEdit={() => {}}
                />
                <DetailRow 
                  label="Guest" 
                  value={`${reservation.guests} people`}
                  onEdit={() => {}}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
              
              {/* Special Occasion */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Special Occasion?</Label>
                <div className="space-y-2">
                  {occasions.map((occasion) => (
                    <button
                      key={occasion}
                      onClick={() => handlePreferenceChange('occasion', occasion)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        reservation.preferences.occasion === occasion
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {occasion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating Preference */}
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Seating Preference</Label>
                <RadioGroup 
                  value={reservation.preferences.seatingPreference}
                  onValueChange={(value) => handlePreferenceChange('seatingPreference', value)}
                  className="space-y-3"
                >
                  {seatingOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option} 
                        id={option}
                        className="text-teal-600"
                      />
                      <Label htmlFor={option} className="text-sm font-medium">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Special Request */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Special Request (Optional)
                </Label>
                <Textarea
                  placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                  value={reservation.preferences.specialRequest}
                  onChange={(e) => handlePreferenceChange('specialRequest', e.target.value)}
                  className="min-h-[100px] resize-none border-gray-200"
                />
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
            Continue
          </Button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Default details view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b">
        <button>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Reservation Details</h1>
      </div>

      {/* Restaurant Info */}
      <div className="bg-white px-4 py-4 border-b">
        <div className="flex gap-3">
          <img 
            src={reservation.restaurant.image}
            alt={reservation.restaurant.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{reservation.restaurant.name}</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{reservation.restaurant.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{reservation.restaurant.rating}</span>
              <span className="text-xs text-gray-500">({reservation.restaurant.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Details */}
      <div className="px-4 py-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Reservation Details</h3>
            <div className="space-y-3">
              <DetailRow 
                label="Date" 
                value={reservation.date}
                onEdit={() => {}}
              />
              <DetailRow 
                label="Available Time" 
                value={reservation.time}
                onEdit={() => {}}
              />
              <DetailRow 
                label="Guest" 
                value={`${reservation.guests} people`}
                onEdit={() => {}}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <Button 
          onClick={() => setStep('preferences')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
        >
          Continue
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default RestaurantReservationDetails;
