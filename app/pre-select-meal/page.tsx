"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Textarea } from '@/app/components/ui/textarea';
import { 
  ArrowLeft, 
  Plus, 
  Minus,
  Info,
  Star,
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  specialRequest: string;
}

export default function PreSelectMealPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [activeCategory, setActiveCategory] = useState('Starters');

  // Sample menu data
  const menuCategories = [
    'Starters',
    'Main Course', 
    'Appetizers',
    'Desserts',
    'Drinks'
  ];

  const menuItems: Omit<MenuItem, 'quantity' | 'specialRequest'>[] = [
    {
      _id: '1',
      name: 'Meze Platter',
      description: 'Hummus, baba ghanoush, tzatziki, pita bread',
      price: 15000,
      image: '/hero-bg.jpg',
      category: 'Starters'
    },
    {
      _id: '2',
      name: 'Chicken Springrolls',
      description: 'Chicken, garnished vegetables',
      price: 12000,
      image: '/hero-bg.jpg',
      category: 'Starters'
    },
    {
      _id: '3',
      name: 'Spaghetti Carbonara',
      description: 'Classic pasta with eggs, cheese, and pancetta',
      price: 18000,
      image: '/hero-bg.jpg',
      category: 'Main Course'
    },
    {
      _id: '4',
      name: 'Calamari Fritti',
      description: 'Crispy fried squid with marinara sauce',
      price: 16000,
      image: '/hero-bg.jpg',
      category: 'Appetizers'
    }
  ];

  const addToSelection = (item: Omit<MenuItem, 'quantity' | 'specialRequest'>) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(selected => selected._id === item._id);
      if (existingItem) {
        return prev.map(selected =>
          selected._id === item._id
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        );
      } else {
        return [...prev, { ...item, quantity: 1, specialRequest: '' }];
      }
    });
  };

  const removeFromSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(selected => selected._id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(selected =>
          selected._id === itemId
            ? { ...selected, quantity: selected.quantity - 1 }
            : selected
        );
      } else {
        return prev.filter(selected => selected._id !== itemId);
      }
    });
  };

  const updateSpecialRequest = (itemId: string, request: string) => {
    setSelectedItems(prev =>
      prev.map(item =>
        item._id === itemId ? { ...item, specialRequest: request } : item
      )
    );
  };

  const getItemQuantity = (itemId: string) => {
    const item = selectedItems.find(selected => selected._id === itemId);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleContinueToPayment = () => {
    const reservationData = {
      restaurant: searchParams.get('restaurant') || '',
      customerName: searchParams.get('customerName') || '',
      phoneNumber: searchParams.get('phoneNumber') || '',
      date: searchParams.get('date') || '',
      time: searchParams.get('time') || '',
      guests: searchParams.get('guests') || '',
      tablePreference: searchParams.get('tablePreference') || '',
      specialRequests: searchParams.get('specialRequests') || '',
      selectedItems: JSON.stringify(selectedItems),
      additionalNotes,
      totalPrice: getTotalPrice().toString()
    };

    const params = new URLSearchParams(reservationData);
    router.push(`/payment-selection?${params.toString()}`);
  };

  const reservationInfo = {
    restaurant: 'Kapadoccia',
    date: searchParams.get('date') || '23rd May, 2025',
    time: searchParams.get('time') || '7:30 pm',
    guests: searchParams.get('guests') || '2'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Pre-Select Your Meal
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Reservation Details</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-teal-600">Preselect meal</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Reservation Info */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reservation Completed</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <span className="font-medium">{reservationInfo.restaurant}</span>
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {reservationInfo.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {reservationInfo.time}
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {reservationInfo.guests} guests
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Want to pre-select your meal?</h4>
                  <p className="text-sm text-yellow-700">
                    Pre-selecting your meal helps the restaurant prepare faster and ensures your favorite dishes are
                    available. You can always make changes later
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Categories */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6">
                {menuCategories.map((category) => (
                  <TabsTrigger key={category} value={category} className="text-sm">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {menuCategories.map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="space-y-4">
                    {menuItems
                      .filter(item => item.category === category)
                      .map((item) => {
                        const quantity = getItemQuantity(item._id);
                        const selectedItem = selectedItems.find(selected => selected._id === item._id);
                        
                        return (
                          <Card key={item._id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                  {quantity > 0 && (
                                    <div className="absolute top-2 right-2">
                                      <Badge className="bg-teal-600 text-white">
                                        ✓
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 p-4">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-lg">{item.name}</h4>
                                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                      <p className="font-bold text-lg">₦{item.price.toLocaleString()}</p>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      {quantity > 0 ? (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => removeFromSelection(item._id)}
                                          >
                                            <Minus className="h-4 w-4" />
                                          </Button>
                                          <span className="font-medium min-w-[24px] text-center">{quantity}</span>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => addToSelection(item)}
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </>
                                      ) : (
                                        <Button
                                          size="sm"
                                          onClick={() => addToSelection(item)}
                                          className="bg-teal-600 hover:bg-teal-700"
                                        >
                                          <Plus className="h-4 w-4 mr-1" />
                                          Add
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {quantity > 0 && (
                                    <div className="mt-3">
                                      <input
                                        type="text"
                                        placeholder="Special request (e.g no garlic)"
                                        value={selectedItem?.specialRequest || ''}
                                        onChange={(e) => updateSpecialRequest(item._id, e.target.value)}
                                        className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Show More Button */}
            <div className="text-center mt-6">
              <Button variant="ghost" className="text-teal-600">
                Show more ↓
              </Button>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Your Selection ({selectedItems.length} items)</h3>
                
                {selectedItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No items selected yet</p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {selectedItems.map((item) => (
                      <div key={item._id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.quantity}x {item.name}</p>
                          {item.specialRequest && (
                            <p className="text-xs text-gray-600 italic">{item.specialRequest}</p>
                          )}
                        </div>
                        <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Sub Total</span>
                    <span className="font-bold text-lg">₦{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Additional note for the restaurant</label>
                  <Textarea
                    placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/payment-selection')}
                  >
                    Skip for now
                  </Button>
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700"
                    onClick={handleContinueToPayment}
                  >
                    Confirm Meal Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
