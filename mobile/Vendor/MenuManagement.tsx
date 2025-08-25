'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Badge } from '../../app/components/ui/badge';
import VendorBottomNavigation from './VendorBottomNavigation';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  type: string;
  image: string;
  isActive: boolean;
}

const MenuManagement = () => {
  const [activeTab, setActiveTab] = useState('All Menu');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Grilled Salmon',
      price: 7000,
      category: 'Main Dish',
      type: 'Buffet, A la carte',
      image: '/api/placeholder/60/60',
      isActive: true
    },
    {
      id: '2',
      name: 'Chicken Spring roll',
      price: 25000,
      category: 'Main Dish',
      type: 'Buffet, A la carte',
      image: '/api/placeholder/60/60',
      isActive: true
    },
    {
      id: '3',
      name: 'Meze Pizza',
      price: 25000,
      category: 'Main Dish',
      type: 'Buffet, A la carte',
      image: '/api/placeholder/60/60',
      isActive: true
    },
    {
      id: '4',
      name: 'Chicken Burger',
      price: 25000,
      category: 'Main Dish',
      type: 'Buffet, A la carte',
      image: '/api/placeholder/60/60',
      isActive: true
    },
    {
      id: '5',
      name: 'Cheese Cake',
      price: 25000,
      category: 'Main Dish',
      type: 'Buffet, A la carte',
      image: '/api/placeholder/60/60',
      isActive: true
    },
    {
      id: '6',
      name: 'Josh Chicken & Grill',
      price: 25000,
      category: 'Main Dish',
      type: 'Buffet, A la carte',
      image: '/api/placeholder/60/60',
      isActive: true
    }
  ];

  const formatPrice = (price: number) => {
    return `#${price.toLocaleString()}`;
  };

  const toggleItemStatus = (itemId: string) => {
    // Toggle logic would go here
    console.log('Toggle item:', itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <h1 className="text-lg font-semibold text-gray-900">Menu Management</h1>
        <div className="flex items-center gap-3">
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4" />
          </Button>
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search branches"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex gap-4">
          {['All Menu', 'Menu Items'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items List */}
      <div className="px-4 py-4 space-y-3">
        {menuItems.map((item) => (
          <Card key={item.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{item.category}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{item.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Toggle Switch */}
                      <button
                        onClick={() => toggleItemStatus(item.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.isActive ? 'bg-teal-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <VendorBottomNavigation activeTab="Menu" />
    </div>
  );
};

export default MenuManagement;
