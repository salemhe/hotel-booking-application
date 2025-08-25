'use client';

import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Info, X } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import BottomNavigation from './BottomNavigation';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  specialRequest?: string;
}

interface MealSelection {
  restaurant: string;
  date: string;
  time: string;
  guests: number;
  items: MenuItem[];
}

const MealPreSelection = () => {
  const [step, setStep] = useState<'selection' | 'checkout' | 'payment'>('selection');
  const [activeCategory, setActiveCategory] = useState('Starters');
  const [selection, setSelection] = useState<MealSelection>({
    restaurant: 'Kapadoccia',
    date: '23rd May, 2025',
    time: '7:30 pm',
    guests: 2,
    items: [
      {
        id: '1',
        name: 'Meze Platter',
        description: 'Hummus, baba ghanoush, tzatziki, pita...',
        price: 15000,
        image: '/api/placeholder/80/80',
        category: 'Starters',
        quantity: 2,
        specialRequest: 'no garlic'
      },
      {
        id: '2',
        name: 'Meze Platter',
        description: 'Hummus, baba ghanoush, tzatziki, pita...',
        price: 15000,
        image: '/api/placeholder/80/80',
        category: 'Starters',
        quantity: 2,
        specialRequest: 'no garlic'
      }
    ]
  });

  const categories = ['Starters', 'Main Course', 'Appetizers', 'Desserts'];

  const availableItems: MenuItem[] = [
    {
      id: '1',
      name: 'Meze Platter',
      description: 'Hummus, baba ghanoush, tzatziki, pita...',
      price: 15000,
      image: '/api/placeholder/80/80',
      category: 'Starters',
      quantity: 0
    },
    {
      id: '2',
      name: 'Meze Platter',
      description: 'Hummus, baba ghanoush, tzatziki, pita...',
      price: 15000,
      image: '/api/placeholder/80/80',
      category: 'Starters',
      quantity: 0
    },
    {
      id: '3',
      name: 'Meze Platter',
      description: 'Hummus, baba ghanoush, tzatziki, pita...',
      price: 15000,
      image: '/api/placeholder/80/80',
      category: 'Starters',
      quantity: 0
    },
    {
      id: '4',
      name: 'Meze Platter',
      description: 'Hummus, baba ghanoush, tzatziki, pita...',
      price: 15000,
      image: '/api/placeholder/80/80',
      category: 'Starters',
      quantity: 0
    }
  ];

  const updateQuantity = (id: string, change: number) => {
    setSelection(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    }));
  };

  const getTotalAmount = () => {
    return selection.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const getTotalItems = () => {
    return selection.items.reduce((total, item) => total + item.quantity, 0);
  };

  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b">
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Thank you for your meal<br />selection
            </h1>
            <p className="text-sm text-gray-600">
              Your pre-selected meals have been<br />confirmed for your upcoming reservation
            </p>
          </div>
        </div>

        {/* Payment Options */}
        <div className="px-4 py-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Would you like to pre-pay for your meal?</h3>
              <p className="text-sm text-blue-800">
                Payment is optional, but helps the restaurant prepare your meal ahead of time. Your payment is secure & refundable according to the restaurant's cancellation policy.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Choose your payment option</h3>
            <div className="text-center">
              <span className="text-2xl font-bold">#{getTotalAmount().toLocaleString()}</span>
              <p className="text-sm text-gray-600 mb-6">Amount to pay</p>
              
              <div className="space-y-3 mb-6">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3">
                  Prepay Now
                </Button>
                <Button variant="outline" className="w-full border-gray-300 text-gray-700 py-3">
                  Pay at Restaurant
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Appetizer</h4>
                {selection.items.filter(item => item.category === 'Starters').map(item => (
                  <div key={`appetizer-${item.id}`} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
                {selection.items.filter(item => item.category === 'Starters').map(item => (
                  <div key={`appetizer-note-${item.id}`} className="text-xs text-gray-600">
                    Add extra lemon on the side
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Main Dish</h4>
                {selection.items.filter(item => item.category === 'Main Course').map(item => (
                  <div key={`main-${item.id}`} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
                {selection.items.filter(item => item.category === 'Main Course').map(item => (
                  <div key={`main-note-${item.id}`} className="text-xs text-gray-600">
                    Add extra lemon on the side
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Dessert</h4>
                {selection.items.filter(item => item.category === 'Desserts').map(item => (
                  <div key={`dessert-${item.id}`} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                ))}
                {selection.items.filter(item => item.category === 'Desserts').map(item => (
                  <div key={`dessert-note-${item.id}`} className="text-xs text-gray-600">
                    Add extra lemon on the side
                  </div>
                ))}
              </div>
            </div>

            {/* Special Request Note */}
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <span className="font-medium text-yellow-900">Special Request:</span>
                  <span className="text-yellow-800 text-sm ml-1">One guest is allergic to garlic. Please consider this</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  if (step === 'checkout') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
          <button onClick={() => setStep('selection')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Your Selection</h1>
          <button onClick={() => setStep('selection')}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Reservation Info */}
        <div className="bg-white px-4 py-3 border-b">
          <p className="text-sm text-gray-600">
            Reservation Completed
          </p>
          <p className="font-medium">
            {selection.restaurant} • {selection.date} • {selection.time} • {selection.guests} guests
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-yellow-50 p-4 mx-4 mt-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-900 mb-1">Want to pre-select your meal?</h3>
              <p className="text-sm text-yellow-800">
                Pre-selecting your meal helps the restaurant prepare faster and ensures your favorite dishes are available. You can always make changes later
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 py-4">
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {availableItems.filter(item => item.category === activeCategory).map(item => (
              <Card key={item.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <span className="font-bold">#{item.price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-600">Special request (e.g. no garlic)</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-20 left-4 right-4">
            <Button 
              onClick={() => setStep('payment')}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
            >
              Checkout ({getTotalItems()} items) - #{getTotalAmount().toLocaleString()}
            </Button>
          </div>
        )}

        {/* Skip Option */}
        <div className="fixed bottom-6 left-4 right-4">
          <button 
            onClick={() => setStep('payment')}
            className="w-full text-gray-600 py-2"
          >
            Skip for now
          </button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // Default selection step
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3 border-b">
        <button>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Pre-Select Meals</h1>
      </div>

      {/* Reservation Info */}
      <div className="bg-white px-4 py-3 border-b">
        <p className="text-sm text-gray-600">Reservation Completed</p>
        <p className="font-medium">
          {selection.restaurant} • {selection.date} • {selection.time} • {selection.guests} guests
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 p-4 mx-4 mt-4 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">Want to pre-select your meal?</h3>
            <p className="text-sm text-yellow-800">
              Pre-selecting your meal helps the restaurant prepare faster and ensures your favorite dishes are available. You can always make changes later
            </p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-4">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-20">
          {availableItems.filter(item => item.category === activeCategory).map(item => (
            <Card key={item.id} className="bg-white">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <span className="font-bold">#{item.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-600">Special request (e.g. no garlic)</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-20 left-4 right-4 space-y-2">
        <Button 
          onClick={() => setStep('checkout')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3"
        >
          Continue
        </Button>
        <button 
          onClick={() => setStep('payment')}
          className="w-full text-gray-600 py-2"
        >
          Skip for now
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MealPreSelection;
