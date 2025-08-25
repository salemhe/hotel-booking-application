'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Filter, User, Clock } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Badge } from '../../app/components/ui/badge';
import VendorBottomNavigation from './VendorBottomNavigation';

interface Reservation {
  id: string;
  customerName: string;
  customerId: string;
  date: string;
  time: string;
  guests: number;
  status: 'Paid' | 'Meal preselected' | 'Part Payment' | 'Pay at Restaurant';
  timeLeft: string;
}

const Reservations = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const reservations: Reservation[] = [
    {
      id: '#12345',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      status: 'Meal preselected',
      timeLeft: 'In 30 mins'
    },
    {
      id: '#12346',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      status: 'Part Payment',
      timeLeft: 'In 30 mins'
    },
    {
      id: '#12347',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      status: 'Pay at Restaurant',
      timeLeft: 'In 30 mins'
    },
    {
      id: '#12348',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      status: 'Paid',
      timeLeft: 'In 30 mins'
    },
    {
      id: '#12349',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      status: 'Paid',
      timeLeft: 'In 30 mins'
    },
    {
      id: '#12350',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      status: 'Paid',
      timeLeft: 'In 30 mins'
    },
    {
      id: '#12351',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      status: 'Paid',
      timeLeft: 'In 30 mins'
    },
    {
      id: '#12352',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      status: 'Paid',
      timeLeft: 'In 30 mins'
    }
  ];

  const tabs = ['All', 'Upcoming', 'Completed', 'Canceled', 'No shows'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Meal preselected': return 'bg-teal-100 text-teal-800';
      case 'Part Payment': return 'bg-yellow-100 text-yellow-800';
      case 'Pay at Restaurant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <h1 className="text-lg font-semibold text-gray-900">Reservations</h1>
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
            placeholder="Search reservation"
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

      {/* Reservations List */}
      <div className="px-4 py-4 space-y-3">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{reservation.customerName}</p>
                      <p className="text-xs text-gray-500">{reservation.customerId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{reservation.date}</p>
                      <p className="text-xs text-gray-500">Time: {reservation.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs px-2 py-1 ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </Badge>
                      <span className="text-xs text-gray-500">• {reservation.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{reservation.timeLeft}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <VendorBottomNavigation activeTab="Reservations" />
    </div>
  );
};

export default Reservations;
