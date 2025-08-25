'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star, Heart, Users, Calendar, Clock } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import BottomNavigation from './BottomNavigation';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string[];
  location: string;
  isRecommended?: boolean;
}

interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: number;
  isRecommended?: boolean;
}

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Restaurant');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('Pick date');
  const [selectedTime, setSelectedTime] = useState('Select Time');
  const [guestCount, setGuestCount] = useState('Select number');

  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Kapadoccia',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      reviewCount: 1000,
      cuisine: ['International', 'Turkish', 'Mediterranean'],
      location: 'Lagos, Ikeja',
      isRecommended: true
    },
    {
      id: '2',
      name: 'Kapadoccia',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      reviewCount: 1000,
      cuisine: ['International', 'Turkish', 'Mediterranean'],
      location: 'Lagos, Ikeja',
      isRecommended: true
    }
  ];

  const hotels: Hotel[] = [
    {
      id: '1',
      name: 'Hotel De Grande',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      reviewCount: 1000,
      location: 'Lagos, Ikeja',
      price: 150000,
      isRecommended: true
    },
    {
      id: '2',
      name: 'Hotel De Grande',
      image: '/api/placeholder/300/200',
      rating: 4.8,
      reviewCount: 1000,
      location: 'Lagos, Ikeja',
      price: 150000,
      isRecommended: true
    }
  ];

  const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-white text-black shadow-sm' 
          : 'text-white/80 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <Card className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-32 object-cover"
        />
        {restaurant.isRecommended && (
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
            Guest's Recommended
          </div>
        )}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4" />
        </button>
        <button className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4" />
        </button>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{restaurant.rating}</span>
          <span className="text-xs text-gray-500">({restaurant.reviewCount.toLocaleString()} reviews)</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
        <p className="text-xs text-gray-600 mb-1">{restaurant.cuisine.join(', ')}</p>
        <p className="text-xs text-gray-500">{restaurant.location}</p>
      </CardContent>
    </Card>
  );

  const HotelCard = ({ hotel }: { hotel: Hotel }) => (
    <Card className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="relative">
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-32 object-cover"
        />
        {hotel.isRecommended && (
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
            Guest's Recommended
          </div>
        )}
        <button className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4" />
        </button>
        <button className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
          <Users className="w-4 h-4" />
        </button>
      </div>
      <CardContent className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{hotel.rating}</span>
          <span className="text-xs text-gray-500">({hotel.reviewCount.toLocaleString()} reviews)</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{hotel.name}</h3>
        <p className="text-xs text-gray-500 mb-1">{hotel.location}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold">#{hotel.price.toLocaleString()}</span>
          <span className="text-xs text-gray-500">/night</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="relative h-96 bg-gradient-to-b from-slate-900 to-slate-800">
        {/* Background video overlay */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Header content */}
        <div className="relative z-10 px-4 pt-12">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">B</span>
              </div>
              <span className="text-white font-medium">Bookies</span>
            </div>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-400 rounded-full" />
            </div>
          </div>

          {/* Main heading */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {activeTab === 'Restaurant' ? 'Find your Perfect Table' : 'Start Living Your Dream'}
            </h1>
            <p className="text-white/80 text-sm">
              {activeTab === 'Restaurant' 
                ? 'Discover and reserve the best restaurants in your city'
                : 'Discover and reserve the best hotels in your city'
              }
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center gap-2 mb-6">
            <TabButton 
              label="Restaurant" 
              isActive={activeTab === 'Restaurant'} 
              onClick={() => setActiveTab('Restaurant')} 
            />
            <TabButton 
              label="Hotels" 
              isActive={activeTab === 'Hotels'} 
              onClick={() => setActiveTab('Hotels')} 
            />
            <TabButton 
              label="Clubs" 
              isActive={activeTab === 'Clubs'} 
              onClick={() => setActiveTab('Clubs')} 
            />
          </div>

          {/* Search form */}
          <div className="bg-white rounded-lg p-4 mx-4 shadow-lg">
            <div className="space-y-3">
              <div>
                <Input
                  placeholder="Enter Restaurant or Cuisine"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-gray-200"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                  <div className="relative">
                    <Input
                      value={selectedDate}
                      readOnly
                      className="border-gray-200 bg-gray-50"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Time</label>
                  <div className="relative">
                    <Input
                      value={selectedTime}
                      readOnly
                      className="border-gray-200 bg-gray-50"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Guest</label>
                <div className="relative">
                  <Input
                    value={guestCount}
                    readOnly
                    className="border-gray-200 bg-gray-50"
                  />
                  <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 bg-white">
        {/* Popular section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'Restaurant' ? 'Popular Restaurants' : 'Popular Hotels'}
            </h2>
            <button className="text-teal-600 text-sm font-medium">View all</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {activeTab === 'Restaurant' 
              ? restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))
              : hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))
            }
          </div>
        </div>

        {/* Top-Rated section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {activeTab === 'Restaurant' ? 'Top-Rated Restaurants' : 'Top-Rated Hotels'}
            </h2>
            <button className="text-teal-600 text-sm font-medium">View all</button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {activeTab === 'Restaurant' 
              ? restaurants.map((restaurant) => (
                  <RestaurantCard key={`top-${restaurant.id}`} restaurant={restaurant} />
                ))
              : hotels.map((hotel) => (
                  <HotelCard key={`top-${hotel.id}`} hotel={hotel} />
                ))
            }
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
