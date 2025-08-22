'use client';

import React, { useState } from 'react';
import { ArrowLeft, Share, Heart, MapPin, Clock, Phone, Mail, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import BottomNavigation from './BottomNavigation';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

interface RestaurantInfo {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  openingHours: string;
  cuisine: string[];
  priceRange: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  images: string[];
}

const RestaurantProfile = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showMap, setShowMap] = useState(true);

  const restaurant: RestaurantInfo = {
    id: '1',
    name: 'Kapadoccia - Lagos, Nigeria',
    location: '16, Idowu Taylor Street, Victoria Island 101241 Nigeria',
    rating: 4.8,
    reviewCount: 1000,
    openingHours: '12:00 PM - 11:00 PM Daily',
    cuisine: ['Middle Eastern', 'Turkish', 'Mediterranean'],
    priceRange: 'From ₦20,000',
    phone: '+2341234567',
    email: 'Kapadoccia@gmail.com',
    website: 'Restaurant website',
    description: 'Kapadoccia Restaurant is a fine-dining destination inspired by the majestic caves and textures of Cappadocia, Turkey. Located in the heart of Abuja, Nigeria, the restaurant offers an immersive dining experience with cave-like interiors, ambient lighting, and an exotic fusion menu that blends Middle Eastern, Mediterranean, and African flavors.',
    images: ['/api/placeholder/400/300']
  };

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Grilled Lamb Kofta with Couscous',
      description: '',
      price: 15000,
      category: 'MAIN COURSE'
    },
    {
      id: '2',
      name: 'Grilled Lamb Kofta with Couscous',
      description: '',
      price: 15000,
      category: 'MAIN COURSE'
    },
    {
      id: '3',
      name: 'Grilled Lamb Kofta with Couscous',
      description: '',
      price: 15000,
      category: 'MAIN COURSE'
    },
    {
      id: '4',
      name: 'Grilled Lamb Kofta with Couscous',
      description: '',
      price: 15000,
      category: 'MAIN COURSE'
    },
    {
      id: '5',
      name: 'Grilled Lamb Kofta with Couscous',
      description: '',
      price: 15000,
      category: 'MAIN COURSE'
    },
    {
      id: '6',
      name: 'Grilled Lamb Kofta with Couscous',
      description: '',
      price: 15000,
      category: 'MAIN COURSE'
    }
  ];

  const tabs = ['Overview', 'Menu', 'Available Reservation Slots', 'Reviews'];
  const menuCategories = ['All', 'Main Course', 'Appetizers', 'Desserts', 'Drinks'];

  const InfoCard = ({ title, value, icon: Icon, color }: any) => (
    <div className={`p-3 rounded-lg ${color}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium text-gray-600">{title}</span>
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-64">
        <img 
          src={restaurant.images[0]} 
          alt={restaurant.name}
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

      {/* Restaurant Info */}
      <div className="px-4 py-4 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-lg font-bold text-gray-900">{restaurant.name}</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Opened
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{restaurant.rating}</span>
          <span className="text-xs text-gray-500">({restaurant.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
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
      <div className="px-4">
        {activeTab === 'Overview' && (
          <div className="space-y-4">
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                title="Opening Hours"
                value={restaurant.openingHours}
                icon={Clock}
                color="bg-green-50"
              />
              <InfoCard
                title="Location"
                value="16, Idowu Taylor Street, Victoria Islan..."
                icon={MapPin}
                color="bg-blue-50"
              />
              <InfoCard
                title="Cuisine"
                value={restaurant.cuisine.join(', ') + '...'}
                icon={MapPin}
                color="bg-orange-50"
              />
              <InfoCard
                title="Price Range"
                value={restaurant.priceRange}
                icon={MapPin}
                color="bg-purple-50"
              />
            </div>

            {/* About Section */}
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">About this Place</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {restaurant.description}
              </p>
              <button className="text-teal-600 text-sm font-medium mt-2 flex items-center gap-1">
                Show more
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Map */}
            {showMap && (
              <div className="bg-white rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b">
                  <h3 className="font-semibold text-gray-900">Map</h3>
                  <button 
                    onClick={() => setShowMap(!showMap)}
                    className="text-sm text-teal-600"
                  >
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
            )}

            {/* Contact Info */}
            <div className="bg-white p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900">Location</h3>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{restaurant.location}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 pt-2">Contact Information</h3>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{restaurant.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">{restaurant.email}</span>
              </div>
              <div className="text-sm text-teal-600 font-medium">
                {restaurant.website}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Menu' && (
          <div className="space-y-4">
            {/* Menu Categories */}
            <div className="bg-white p-4 rounded-lg">
              <div className="flex gap-2 mb-4">
                {menuCategories.map((category) => (
                  <button
                    key={category}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      category === 'All'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                {menuItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="text-xs text-gray-500 mb-1">{item.category}</div>
                    <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                    <div className="font-semibold text-gray-900">#{item.price.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reserve Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
          Reserve Table
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default RestaurantProfile;
