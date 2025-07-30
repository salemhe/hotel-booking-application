"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Users,
  MapPin,
  Star,
  ArrowLeft,
  Edit2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface RestaurantInfo {
  _id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
}

export default function ReservationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    date: searchParams.get('date') || '',
    time: searchParams.get('time') || '',
    guests: searchParams.get('guests') || '2',
    tablePreference: 'indoor',
    specialRequests: searchParams.get('request') || '',
    isPreMealSelected: false
  });

  const fetchRestaurant = useCallback(async () => {
    try {
      // Mock data for development
      const mockRestaurant: RestaurantInfo = {
        _id: params.id as string,
        name: 'Kapadoccia - Lagos, Nigeria',
        address: '16, Idowu Taylor Street, Victoria Island 101241 Nigeria',
        rating: 4.8,
        reviewCount: 1000,
        image: '/hero-bg.jpg'
      };
      
      setRestaurant(mockRestaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    // Validate required fields
    if (!formData.customerName || !formData.phoneNumber || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    // Navigate to meal selection or payment
    const params = new URLSearchParams({
      restaurant: restaurant?._id || '',
      customerName: formData.customerName,
      phoneNumber: formData.phoneNumber,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      tablePreference: formData.tablePreference,
      specialRequests: formData.specialRequests,
      isPreMealSelected: formData.isPreMealSelected.toString()
    });
    
    router.push(`/pre-select-meal?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h2>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href={`/restaurants/${restaurant._id}`}>
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create New Reservation</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-teal-600">Reservation Details</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">Preselect meal</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm text-gray-600">Payment</span>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{restaurant.name}</h2>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{restaurant.rating} ({restaurant.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservation Form */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-6">Reservation Details</h3>
            
            <div className="space-y-6">
              {/* Current Reservation Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Let&apos;s Plan For Your Visit</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Kindly provide answers to few questions below to enable us serve you better
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">Date</Label>
                    <div className="flex items-center justify-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="text-sm font-medium bg-transparent border-none focus:outline-none"
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Edit2 className="h-3 w-3 ml-2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">Available Time</Label>
                    <div className="flex items-center justify-center mt-1">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <select
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className="text-sm font-medium bg-transparent border-none focus:outline-none"
                      >
                        <option value="">Select time</option>
                        <option value="01:00 PM">01:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                        <option value="07:00 PM">07:00 PM</option>
                        <option value="08:00 PM">08:00 PM</option>
                      </select>
                      <Edit2 className="h-3 w-3 ml-2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Label className="text-sm text-gray-600">Guest</Label>
                    <div className="flex items-center justify-center mt-1">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <select
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', e.target.value)}
                        className="text-sm font-medium bg-transparent border-none focus:outline-none"
                      >
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="4">4 people</option>
                        <option value="6">6 people</option>
                        <option value="8">8+ people</option>
                      </select>
                      <Edit2 className="h-3 w-3 ml-2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer name*</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter full name"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Phone number*</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tablePreference">Table Preference*</Label>
                  <Select 
                    value={formData.tablePreference} 
                    onValueChange={(value) => handleInputChange('tablePreference', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pick table preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor</SelectItem>
                      <SelectItem value="outdoor">Outdoor</SelectItem>
                      <SelectItem value="no-preference">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Pre-meal Selection */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="preMealSelection"
                    checked={formData.isPreMealSelected}
                    onChange={(e) => handleInputChange('isPreMealSelected', e.target.checked.toString())}
                    className="mr-3"
                  />
                  <Label htmlFor="preMealSelection" className="font-medium">
                    Customer is dining now, skip meal preselect
                  </Label>
                </div>
              </div>

              {/* Special Requests for Staff */}
              <div>
                <Label htmlFor="staffNotes">Special Requests</Label>
                <Textarea
                  id="staffNotes"
                  placeholder="Add notes for staff (not visible to customers)"
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            onClick={handleContinue}
            className="bg-teal-600 hover:bg-teal-700 min-w-48"
          >
            Continue to Meal Selection
          </Button>
        </div>
      </div>
    </div>
  );
}
