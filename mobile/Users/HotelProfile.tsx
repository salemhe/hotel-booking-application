'use client';

import React, { useState } from 'react';
import { ArrowLeft, Share, Heart, MapPin, Clock, Phone, Mail, Star, ChevronRight, Wifi, Users, Bed, Car, Eye, Coffee } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import BottomNavigation from './BottomNavigation';

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  bedType: string;
  guests: number;
  amenities: string[];
  images: string[];
  discount?: number;
  roomsLeft?: number;
  cancellation: string;
}

interface HotelInfo {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  website: string;
  description: string;
  images: string[];
}

const HotelProfile = () => {
  const [activeTab, setActiveTab] = useState('Details');
  const [selectedRoomType, setSelectedRoomType] = useState('Superion Standard Room');

  const hotel: HotelInfo = {
    id: '1',
    name: 'Eko Hotel & Suites',
    location: '16, Idowu Taylor Street, Victoria Island 101241 Nigeria',
    rating: 4.8,
    reviewCount: 1000,
    phone: '+23412345678',
    email: 'Kapadoccia@gmail.com',
    website: 'Restaurant website',
    description: 'Escape to luxury at Oceanview Grand Hotel, a 5-star seaside retreat in the heart of Victoria Island. Designed for both business and leisure travelers, this elegant property offers breathtaking ocean views, modern interiors, and exceptional service.',
    images: ['/api/placeholder/400/300']
  };

  const rooms: Room[] = [
    {
      id: '1',
      name: 'Superior Single Room',
      description: 'Super comfortable room with single bed and a top view',
      price: 150000,
      originalPrice: 160000,
      bedType: '1 master bed',
      guests: 2,
      amenities: ['Free WiFi', 'Free Breakfast', 'Free Parking', 'City View'],
      images: ['/api/placeholder/300/200'],
      discount: 10,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    {
      id: '2',
      name: 'Superior Double Room',
      description: 'Super comfortable room with single bed and a top view',
      price: 150000,
      originalPrice: 160000,
      bedType: '2 Twin Bed',
      guests: 2,
      amenities: ['Free WiFi', 'Free Breakfast', 'Free Parking', 'City View'],
      images: ['/api/placeholder/300/200'],
      discount: 10,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    },
    {
      id: '3',
      name: 'Superior Twin Bed Room',
      description: 'Super comfortable room with single bed and a top view',
      price: 150000,
      originalPrice: 160000,
      bedType: '2 Twin Bed',
      guests: 2,
      amenities: ['Free WiFi', 'Free Breakfast', 'Free Parking', 'City View'],
      images: ['/api/placeholder/300/200'],
      discount: 10,
      roomsLeft: 3,
      cancellation: 'Free cancellation until 24h before check-in'
    }
  ];

  const tabs = ['Details', 'Rooms', 'Policies', 'Reviews', 'Messages'];
  const roomTypes = ['Superion Standard Room', 'Superion Luxury Room'];

  const AmenityIcon = ({ amenity }: { amenity: string }) => {
    const iconMap: { [key: string]: any } = {
      'Free WiFi': Wifi,
      'Free Breakfast': Coffee,
      'Free Parking': Car,
      'City View': Eye
    };
    
    const Icon = iconMap[amenity] || MapPin;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-64">
        <img 
          src={hotel.images[0]} 
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Header Actions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
              <Share className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
          <div className="w-2 h-2 bg-white rounded-full" />
          <div className="w-2 h-2 bg-white/50 rounded-full" />
          <div className="w-2 h-2 bg-white/50 rounded-full" />
        </div>
      </div>

      {/* Hotel Info */}
      <div className="px-4 py-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-gray-900">{hotel.name}</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Opened
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{hotel.rating}</span>
          <span className="text-xs text-gray-500">({hotel.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'text-teal-600 border-teal-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mb-20">
        {activeTab === 'Details' && (
          <div className="space-y-4">
            {/* About Hotel */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">About Hotel</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                {hotel.description}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose from spacious deluxe rooms, executive suites, or penthouse options — all equipped with high-speed Wi-Fi, smart TVs, plush bedding, and 24-hour room service.
              </p>
              <button className="text-teal-600 text-sm font-medium mt-2 flex items-center gap-1">
                Show more
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-semibold text-gray-900">Map</h3>
                <button className="text-sm text-teal-600">
                  Satellite
                </button>
              </div>
              <div className="h-48 bg-green-100 relative">
                {/* Map placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900">Location</h3>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{hotel.location}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 pt-2">Contact Information</h3>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{hotel.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{hotel.email}</span>
              </div>
              <div className="text-sm text-teal-600 font-medium">
                {hotel.website}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Rooms' && (
          <div className="space-y-4">
            {/* Room Type Selector */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Select Room Type</h3>
              <div className="flex gap-2">
                {roomTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedRoomType(type)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedRoomType === type
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Cards */}
            <div className="space-y-4">
              {rooms.map((room) => (
                <Card key={room.id} className="bg-white overflow-hidden">
                  <div className="relative">
                    <img 
                      src={room.images[0]} 
                      alt={room.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 right-2 flex justify-between">
                      <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{room.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{room.description}</p>
                    
                    {/* Room Details */}
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-gray-400" />
                        <span className="text-xs">Free WiFi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs">{room.guests} Adults</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-gray-400" />
                        <span className="text-xs">{room.bedType}</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {room.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-1">
                          <AmenityIcon amenity={amenity} />
                          <span className="text-xs text-gray-600">{amenity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2 mb-4">
                      <button className="text-teal-600 text-sm font-medium flex items-center gap-1">
                        Show more amenities
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      
                      {room.discount && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {room.discount}% Discount
                          </Badge>
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-600 rounded-full" />
                            {room.roomsLeft} rooms left
                          </span>
                        </div>
                      )}
                      
                      <p className="text-xs text-teal-600">{room.cancellation}</p>
                    </div>

                    {/* Price and Book */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">#{room.price.toLocaleString()}</span>
                          {room.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              #{room.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-sm text-gray-500">/night</span>
                        </div>
                      </div>
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6">
                        Reserve Room
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center mt-2">You won't be charged yet</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

// Missing ArrowRight icon - let's define it
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default HotelProfile;
