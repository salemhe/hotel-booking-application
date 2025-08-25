'use client';

import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Edit3, ChevronLeft, ChevronRight, Plus, Minus, Info } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import BottomNavigation from './BottomNavigation';

interface AddOn {
  id: string;
  name: string;
  description: string[];
  price: number;
  image: string;
  category: 'combo' | 'bottle';
  isPopular?: boolean;
  isMostOrdered?: boolean;
  quantity: number;
}

interface ReservationSummary {
  restaurant: {
    name: string;
    location: string;
    rating: number;
    reviewCount: number;
    image: string;
  };
  date: string;
  time: string;
  table: string;
  guests: number;
  addOns: AddOn[];
}

const ReservationSummary = () => {
  const [activeCategory, setActiveCategory] = useState('All Bottles');
  const [reservation, setReservation] = useState<ReservationSummary>({
    restaurant: {
      name: 'Eko Hotel & Suites - Lagos, Nigeria',
      location: '16, Idowu Taylor Street, Victoria Island...',
      rating: 4.8,
      reviewCount: 1000,
      image: '/api/placeholder/60/60'
    },
    date: '23rd May, 2025',
    time: '07:30 pm',
    table: 'VIP Lounge',
    guests: 2,
    addOns: [
      {
        id: '1',
        name: 'Big Ballers Set',
        description: ['1x Azul Tequila', '2x Ciroc Vodka', 'Premium Fruit Platter', 'LED Table Display'],
        price: 280000,
        image: '/api/placeholder/150/100',
        category: 'combo',
        isPopular: true,
        quantity: 0
      },
      {
        id: '2',
        name: 'Big Ballers Set',
        description: ['1x Azul Tequila', '2x Ciroc Vodka', 'Premium Fruit Platter', 'LED Table Display'],
        price: 280000,
        image: '/api/placeholder/150/100',
        category: 'combo',
        isPopular: true,
        quantity: 0
      },
      {
        id: '3',
        name: 'Moet & Chandon',
        description: ['Brut Imperial'],
        price: 280000,
        image: '/api/placeholder/150/100',
        category: 'bottle',
        isMostOrdered: true,
        quantity: 2
      },
      {
        id: '4',
        name: 'Moet & Chandon',
        description: ['Brut Imperial'],
        price: 280000,
        image: '/api/placeholder/150/100',
        category: 'bottle',
        isMostOrdered: true,
        quantity: 2
      },
      {
        id: '5',
        name: 'Moet & Chandon',
        description: ['Brut Imperial'],
        price: 280000,
        image: '/api/placeholder/150/100',
        category: 'bottle',
        isMostOrdered: true,
        quantity: 0
      },
      {
        id: '6',
        name: 'Moet & Chandon',
        description: ['Brut Imperial'],
        price: 280000,
        image: '/api/placeholder/150/100',
        category: 'bottle',
        isMostOrdered: true,
        quantity: 0
      }
    ]
  });

  const categories = ['All Bottles', 'Champagne', 'Vodka', 'Whiskey'];

  const updateQuantity = (id: string, change: number) => {
    setReservation(prev => ({
      ...prev,
      addOns: prev.addOns.map(addon => 
        addon.id === id 
          ? { ...addon, quantity: Math.max(0, addon.quantity + change) }
          : addon
      )
    }));
  };

  const getFilteredAddOns = () => {
    if (activeCategory === 'All Bottles') {
      return reservation.addOns;
    }
    return reservation.addOns.filter(addon => 
      activeCategory.toLowerCase() === addon.category || 
      addon.name.toLowerCase().includes(activeCategory.toLowerCase())
    );
  };

  const getTotalAmount = () => {
    const tableBaseFee = 50000;
    const bottleServiceFee = 300000;
    const addOnsTotal = reservation.addOns.reduce((total, addon) => 
      total + (addon.quantity * addon.price), 0
    );
    
    return tableBaseFee + bottleServiceFee + addOnsTotal;
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

  const AddOnCard = ({ addOn }: { addOn: AddOn }) => (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={addOn.image}
          alt={addOn.name}
          className="w-full h-24 object-cover"
        />
        {addOn.isPopular && (
          <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
            Most Popular
          </Badge>
        )}
        {addOn.isMostOrdered && (
          <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">
            Most Ordered
          </Badge>
        )}
        <div className="absolute top-2 right-2 text-white text-xs bg-black/20 px-1 rounded">
          {addOn.category === 'bottle' ? 'Champagne' : 'Combo'}
        </div>
      </div>
      
      <CardContent className="p-3">
        <h4 className="font-medium text-gray-900 mb-1">{addOn.name}</h4>
        <div className="space-y-1 mb-2">
          {addOn.description.map((item, index) => (
            <div key={index} className="flex items-center text-xs text-gray-600">
              <span className="w-1 h-1 bg-green-500 rounded-full mr-2" />
              {item}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-bold">#{addOn.price.toLocaleString()}</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => updateQuantity(addOn.id, -1)}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
              disabled={addOn.quantity === 0}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-medium">{addOn.quantity}</span>
            <button 
              onClick={() => updateQuantity(addOn.id, 1)}
              className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b">
        <button>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Reservation Summary</h1>
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
                label="Time" 
                value={reservation.time}
                onEdit={() => {}}
              />
              <DetailRow 
                label="Table" 
                value={reservation.table}
                onEdit={() => {}}
              />
              <DetailRow 
                label="Guest" 
                value={reservation.guests.toString()}
                onEdit={() => {}}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Ons Section */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Let's Plan For Your Arrival</h3>
            <button className="text-teal-600 text-sm flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Add more
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Would you like to add any extras to enhance your night?
          </p>

          {/* Premium Combos */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Premium Combos</h4>
              <div className="flex gap-2">
                <button className="p-1 rounded-full bg-gray-100">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-full bg-gray-100">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {reservation.addOns.filter(addon => addon.category === 'combo').map(addon => (
                <AddOnCard key={addon.id} addOn={addon} />
              ))}
            </div>
          </div>

          {/* Premium Bottles */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Premium Bottles</h4>
            
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Bottles Grid */}
            <div className="grid grid-cols-2 gap-3">
              {getFilteredAddOns().filter(addon => addon.category === 'bottle').map(addon => (
                <AddOnCard key={addon.id} addOn={addon} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
          Next
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ReservationSummary;
