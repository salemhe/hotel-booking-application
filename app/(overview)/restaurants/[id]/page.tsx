"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Star,
  MapPin,
  Clock,
  Share,
  Heart,
  Camera,
  Phone,
  Mail,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useAvailability } from '@/app/hooks/useAvailability';

interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  location: string;
  address: string;
  images: string[];
  openHours: string;
  priceRange: string;
  description: string;
  features: string[];
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  isOpen: boolean;
  availableSlots: string[];
}

const ReserveWidget = ({ restaurant }: { restaurant: Restaurant }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize with URL parameters if available
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '');
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '');
  const [guestCount, setGuestCount] = useState(searchParams.get('guests') || '2');
  const [specialRequest, setSpecialRequest] = useState('');

  // Real-time availability
  const {
    availability,
    loading: availabilityLoading,
    error: availabilityError,
    checkAvailability,
    validateBookingTime
  } = useAvailability(restaurant._id);

  // Check availability when date changes
  useEffect(() => {
    if (selectedDate) {
      checkAvailability(selectedDate);
    }
  }, [selectedDate, checkAvailability]);

  const handleReservation = () => {
    // Validate required fields
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    if (!selectedTime) {
      alert('Please select a time');
      return;
    }

    // Validate booking time with real-time availability
    if (availability) {
      const validation = validateBookingTime(selectedDate, selectedTime);
      if (!validation.valid) {
        alert(validation.reason || 'This time slot is not available');
        return;
      }
    }

    // Navigate to reservation page with context
    const params = new URLSearchParams({
      date: selectedDate,
      time: selectedTime,
      guests: guestCount,
      request: specialRequest
    });

    router.push(`/restaurants/${restaurant._id}/reservations?${params.toString()}`);
  };

  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-4">Reserve your Table</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Available Time
              {availabilityLoading && (
                <span className="text-xs text-gray-500 ml-2">(Checking availability...)</span>
              )}
            </label>
            {availability ? (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {availability.timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`p-2 text-sm border rounded-lg transition-colors ${
                      selectedTime === slot.time
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : slot.available
                        ? 'border-gray-200 hover:border-gray-300 bg-white'
                        : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-medium">{slot.time}</div>
                    {slot.available ? (
                      <div className="text-xs text-green-600">
                        {slot.remaining} spots left
                      </div>
                    ) : (
                      <div className="text-xs text-red-500">Fully booked</div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Select Time</option>
                {restaurant.availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            )}
            {availabilityError && (
              <p className="text-xs text-amber-600 mt-1">{availabilityError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Guest</label>
            <select
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="4">4 Guests</option>
              <option value="6">6 Guests</option>
              <option value="8">8+ Guests</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Special request</label>
            <textarea
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              rows={4}
            />
          </div>

          <Button 
            onClick={handleReservation}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-teal-600 hover:bg-teal-700 py-3"
          >
            Reserve Table
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function RestaurantPage() {
  const params = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchRestaurant();
  }, [params.id, fetchRestaurant]);

  const fetchRestaurant = useCallback(async () => {
    try {
      // Mock data for development
      const mockRestaurant: Restaurant = {
        _id: params.id as string,
        name: 'Kapadoccia - Lagos, Nigeria',
        cuisine: 'International, Turkish, Contemporary',
        rating: 4.8,
        reviewCount: 1000,
        location: 'Lagos, Nigeria',
        address: '16, Idowu Taylor Street, Victoria Island 101241 Nigeria',
        images: [
          '/hero-bg.jpg',
          '/hero-bg.jpg',
          '/hero-bg.jpg',
          '/hero-bg.jpg'
        ],
        openHours: '12:00 PM - 11:00 PM Daily',
        priceRange: '₦₦₦',
        description: 'Experience authentic Turkish cuisine in the heart of Lagos...',
        features: ['Outdoor seating', 'Indoor seating', 'Vegan options', 'Free WiFi', 'Parking', 'Credit Cards'],
        contact: {
          phone: '+2342345678',
          email: 'Kapadoccia@gmail.com',
          website: 'Restaurant website'
        },
        isOpen: true,
        availableSlots: ['01:00 PM', '03:00 PM', '05:00 PM', '07:00 PM', '08:00 PM']
      };
      
      setRestaurant(mockRestaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">← Back</Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{restaurant.cuisine}</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>{restaurant.rating} ({restaurant.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src={restaurant.images[selectedImageIndex]}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
              <Button 
                className="absolute bottom-4 right-4 bg-white text-gray-900 hover:bg-gray-100"
                size="sm"
              >
                <Camera className="h-4 w-4 mr-2" />
                See more photos
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {restaurant.images.slice(1, 3).map((image, index) => (
              <div 
                key={index} 
                className="relative h-44 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedImageIndex(index + 1)}
              >
                <Image
                  src={image}
                  alt={`${restaurant.name} ${index + 2}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="slots">Available Reservation Slots</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Clock className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-green-600">Opening Hours</span>
                    </div>
                    <p className="text-gray-700">{restaurant.openHours}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Check out available reservation slots for today</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {restaurant.availableSlots.map((slot) => (
                        <Button 
                          key={slot} 
                          variant="outline" 
                          size="sm"
                          className="text-teal-600 border-teal-600 hover:bg-teal-50"
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="menu">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Menu</h3>
                    <p className="text-gray-600">Menu details will be displayed here...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="slots">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Available Reservation Slots</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {restaurant.availableSlots.map((slot) => (
                        <div key={slot} className="p-4 border rounded-lg text-center hover:bg-gray-50">
                          <Clock className="h-5 w-5 mx-auto mb-2 text-teal-600" />
                          <p className="font-medium">{slot}</p>
                          <Button size="sm" className="mt-2">Select</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Reviews</h3>
                    <p className="text-gray-600">Reviews will be displayed here...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ReserveWidget restaurant={restaurant} />

            {/* Map Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Location</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">{restaurant.address}</span>
                  </div>
                  
                  {/* Map placeholder */}
                  <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Map</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm">{restaurant.contact.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm">{restaurant.contact.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-teal-600 cursor-pointer">{restaurant.contact.website}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
