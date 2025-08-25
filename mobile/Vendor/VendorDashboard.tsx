'use client';

import React, { useState } from 'react';
import { ChevronDown, Bell, User, TrendingUp, Calendar, DollarSign, Users, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
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

interface StatCard {
  label: string;
  value: number | string;
  change: string;
  color: string;
  icon: React.ElementType;
}

const VendorDashboard = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState('Restaurant 1 - HQ');
  const [customerFrequency, setCustomerFrequency] = useState('Weekly');
  const [reservationSource, setReservationSource] = useState('Weekly');
  const [revenueCategory, setRevenueCategory] = useState('Weekly');

  const stats: StatCard[] = [
    {
      label: 'Reservations made today',
      value: 32,
      change: '↑ 12% vs last week',
      color: 'bg-blue-50 text-blue-600',
      icon: Calendar
    },
    {
      label: 'Prepaid Reservations',
      value: 16,
      change: '↑ 8% vs last week',
      color: 'bg-green-50 text-green-600',
      icon: DollarSign
    },
    {
      label: 'Expected Guests',
      value: 80,
      change: '↑ 5% vs last week',
      color: 'bg-purple-50 text-purple-600',
      icon: Users
    },
    {
      label: 'Pending Payments',
      value: '$2,456.00',
      change: '↑ 12% vs last week',
      color: 'bg-yellow-50 text-yellow-600',
      icon: DollarSign
    }
  ];

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
      status: 'Paid',
      timeLeft: 'In 30 mins'
    },
    {
      id: '#12347',
      customerName: 'Emily Johnson',
      customerId: 'ID: #12345',
      date: 'June 5, 2025',
      time: '7:35 pm',
      guests: 4,
      status: 'Part Payment',
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
    }
  ];

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
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-teal-600 px-2">
            {selectedRestaurant}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-gray-600" />
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="px-4 py-4 bg-white">
        <h1 className="text-xl font-bold text-gray-900">Welcome Back, Joseph!</h1>
        <p className="text-sm text-gray-600">Here's what is happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Reservations */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Today's Reservations</h2>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
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
      </div>

      {/* Customer Frequency Chart */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Customer Frequency</h3>
          <div className="flex items-center gap-2">
            <select 
              value={customerFrequency} 
              onChange={(e) => setCustomerFrequency(e.target.value)}
              className="text-sm border-0 bg-transparent text-gray-600"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="50" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
                  <circle cx="64" cy="64" r="50" stroke="#0891b2" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${45 * 3.14159} ${(100-45) * 3.14159}`} />
                  <circle cx="64" cy="64" r="50" stroke="#fbbf24" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${55 * 3.14159} ${(100-55) * 3.14159}`}
                    strokeDashoffset={`${-45 * 3.14159}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm font-medium text-gray-900">Total Customer</p>
                  <p className="text-xl font-bold text-gray-900">100</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                <span className="text-xs text-gray-600">New Customers</span>
                <span className="text-xs font-medium">45%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-xs text-gray-600">Returning Customers</span>
                <span className="text-xs font-medium">55%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservation Source */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Reservation Source</h3>
          <div className="flex items-center gap-2">
            <select 
              value={reservationSource} 
              onChange={(e) => setReservationSource(e.target.value)}
              className="text-sm border-0 bg-transparent text-gray-600"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="50" stroke="#e5e7eb" strokeWidth="8" fill="transparent" />
                  <circle cx="64" cy="64" r="50" stroke="#0891b2" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${50 * 3.14159} ${(100-50) * 3.14159}`} />
                  <circle cx="64" cy="64" r="50" stroke="#fbbf24" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${30 * 3.14159} ${(100-30) * 3.14159}`}
                    strokeDashoffset={`${-50 * 3.14159}`} />
                  <circle cx="64" cy="64" r="50" stroke="#60a5fa" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${20 * 3.14159} ${(100-20) * 3.14159}`}
                    strokeDashoffset={`${-80 * 3.14159}`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm font-medium text-gray-900">Total Reservation</p>
                  <p className="text-xl font-bold text-gray-900">100</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                  <span className="text-xs text-gray-600">50 websites</span>
                </div>
                <span className="text-xs font-medium">50%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <span className="text-xs text-gray-600">30 mobile</span>
                </div>
                <span className="text-xs font-medium">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-xs text-gray-600">20 walk-in</span>
                </div>
                <span className="text-xs font-medium">20%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Menu Category */}
      <div className="px-4 py-2 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">Revenue (Menu Category)</h3>
          <div className="flex items-center gap-2">
            <select 
              value={revenueCategory} 
              onChange={(e) => setRevenueCategory(e.target.value)}
              className="text-sm border-0 bg-transparent text-gray-600"
            >
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-1 mb-4">
              <p className="text-2xl font-bold text-gray-900">#220,500</p>
              <p className="text-sm text-green-600">↑ 8% vs last week</p>
            </div>
            
            {/* Progress bars */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Main Dish</span>
                <span className="text-sm font-medium">50% (#110,000)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{width: '50%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Drinks</span>
                <span className="text-sm font-medium">22.7% (#50,000)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '22.7%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Starters</span>
                <span className="text-sm font-medium">13.6% (#30,000)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '13.6%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Desserts</span>
                <span className="text-sm font-medium">9.3% (#20,500)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{width: '9.3%'}}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sides</span>
                <span className="text-sm font-medium">4.7% (#10,000)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '4.7%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <VendorBottomNavigation activeTab="Home" />
    </div>
  );
};

export default VendorDashboard;
