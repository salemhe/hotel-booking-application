'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter, Star } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Badge } from '../../app/components/ui/badge';
import VendorBottomNavigation from './VendorBottomNavigation';

interface Branch {
  id: string;
  name: string;
  location: string;
  reservations: number;
  rating: number;
  status: 'Opened' | 'Closed';
}

const Branches = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const branches: Branch[] = [
    {
      id: '1',
      name: 'Josh Chicken & Grill',
      location: 'Ikeja, Lagos',
      reservations: 28,
      rating: 4.8,
      status: 'Opened'
    },
    {
      id: '2',
      name: 'Josh Chicken & Grill',
      location: 'Ikeja, Lagos',
      reservations: 28,
      rating: 4.8,
      status: 'Opened'
    },
    {
      id: '3',
      name: 'Josh Chicken & Grill',
      location: 'Ikeja, Lagos',
      reservations: 28,
      rating: 4.8,
      status: 'Opened'
    },
    {
      id: '4',
      name: 'Josh Chicken & Grill',
      location: 'Ikeja, Lagos',
      reservations: 28,
      rating: 4.8,
      status: 'Opened'
    },
    {
      id: '5',
      name: 'Josh Chicken & Grill',
      location: 'Ikeja, Lagos',
      reservations: 28,
      rating: 4.8,
      status: 'Opened'
    }
  ];

  const tabs = ['All', 'Upcoming', 'Completed', 'Canceled', 'No shows'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Opened': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <h1 className="text-lg font-semibold text-gray-900">Branches</h1>
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
        <div className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
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

      {/* Branches List */}
      <div className="px-4 py-4 space-y-3">
        {branches.map((branch) => (
          <Card key={branch.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{branch.name}</h3>
                    <p className="text-sm text-gray-600">{branch.location}</p>
                  </div>
                  
                  <Badge className={`px-2 py-1 text-xs ${getStatusColor(branch.status)}`}>
                    • {branch.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {branch.reservations} reservations
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{branch.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <VendorBottomNavigation activeTab="Branches" />
    </div>
  );
};

export default Branches;
