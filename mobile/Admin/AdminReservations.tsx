'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter } from 'lucide-react';
import { Input } from '../../app/components/ui/input';
import { Avatar } from '../../app/components/ui/avatar';
import { Badge } from '../../app/components/ui/badge';
import AdminBottomNavigation from './AdminBottomNavigation';

const AdminReservations = () => {
  const [activeTab, setActiveTab] = useState('Reservations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Upcoming', 'Completed', 'Canceled', 'No shows'];

  // Mock reservation data
  const reservations = [
    {
      id: 1,
      reservationId: '#12345',
      customerName: 'Emily Johnson',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      mealStatus: 'Meal preselected',
      paymentStatus: 'Paid',
      timeRemaining: 'In 30 mins',
      avatar: 'E'
    },
    {
      id: 2,
      reservationId: '#12345',
      customerName: 'Emily Johnson',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      mealStatus: 'Meal preselected',
      paymentStatus: 'Part Payment',
      timeRemaining: 'In 30 mins',
      avatar: 'E'
    },
    {
      id: 3,
      reservationId: '#12345',
      customerName: 'Emily Johnson',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      mealStatus: 'Meal preselected',
      paymentStatus: 'Pay at Restaurant',
      timeRemaining: 'In 30 mins',
      avatar: 'E'
    },
    {
      id: 4,
      reservationId: '#12345',
      customerName: 'Emily Johnson',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      mealStatus: 'Meal preselected',
      paymentStatus: 'Paid',
      timeRemaining: 'In 30 mins',
      avatar: 'E'
    },
    {
      id: 5,
      reservationId: '#12345',
      customerName: 'Emily Johnson',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      mealStatus: 'Meal preselected',
      paymentStatus: 'Paid',
      timeRemaining: 'In 30 mins',
      avatar: 'E'
    },
    {
      id: 6,
      reservationId: '#12345',
      customerName: 'Emily Johnson',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      mealStatus: 'Meal preselected',
      paymentStatus: 'Paid',
      timeRemaining: 'In 30 mins',
      avatar: 'E'
    },
    {
      id: 7,
      reservationId: '#12345',
      customerName: 'Emily Johnson',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      mealStatus: 'Meal preselected',
      paymentStatus: 'Paid',
      timeRemaining: 'In 30 mins',
      avatar: 'E'
    },
    {
      id: 8,
      reservationId: '#12345',
      customerName: 'Emily Johnson',
      date: 'June 5, 2025',
      time: '7:30 pm',
      guests: 4,
      mealStatus: 'Meal preselected',
      paymentStatus: 'Paid',
      timeRemaining: 'In 30 mins',
      avatar: 'E'
    }
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Part Payment':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pay at Restaurant':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredReservations = reservations.filter(reservation =>
    reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.reservationId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Reservations</h1>
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </button>
            <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reservation"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 py-2 border border-gray-300 rounded-lg"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Filter className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFilter === filter
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      <div className="p-4">
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 text-lg font-semibold">{reservation.avatar}</span>
                  </div>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm text-gray-600">ID: {reservation.reservationId}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{reservation.date}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{reservation.guests} guests</span>
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">{reservation.customerName}</h3>
                      <p className="text-sm text-gray-600">Time: {reservation.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
                      {reservation.mealStatus}
                    </Badge>
                    <Badge className={`text-xs px-2 py-1 ${getPaymentStatusColor(reservation.paymentStatus)}`}>
                      {reservation.paymentStatus}
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-1">
                      {reservation.timeRemaining}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReservations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No reservations found</div>
            <div className="text-sm text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      <AdminBottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AdminReservations;
