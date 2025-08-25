'use client';

import React, { useState } from 'react';
import { ChevronDown, Bell, Users, DollarSign, TrendingUp, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Avatar } from '../../app/components/ui/avatar';
import AdminBottomNavigation from './AdminBottomNavigation';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Home');

  // Mock data for dashboard metrics
  const metrics = [
    {
      title: 'Active Vendors',
      value: '32',
      change: '+12% vs last week',
      icon: Users,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Registered Users',
      value: '23,245',
      change: '+12% vs last week',
      icon: Users,
      color: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Total Revenue',
      value: '#23,372,556.00',
      change: '+12% vs last week',
      icon: DollarSign,
      color: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Pending Payment',
      value: '#372,556.00',
      change: '+12% vs last week',
      icon: TrendingUp,
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  // Mock data for recent transactions
  const recentTransactions = [
    {
      id: 1,
      type: 'received',
      title: 'Payment Received',
      subtitle: 'From: Emily Johnson',
      amount: '+₦50,205.78',
      date: 'July 9, 2025',
      amountColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'sent',
      title: 'Payout Sent',
      subtitle: 'To: Grand Luxury Resort',
      amount: '-₦2,354.00',
      date: 'July 8, 2025',
      amountColor: 'text-red-600'
    },
    {
      id: 3,
      type: 'received',
      title: 'Payment Received',
      subtitle: 'From: Emily Johnson',
      amount: '+₦50,205.78',
      date: 'July 8, 2025',
      amountColor: 'text-green-600'
    },
    {
      id: 4,
      type: 'received',
      title: 'Payment Received',
      subtitle: 'From: Emily Johnson',
      amount: '+₦50,205.78',
      date: 'July 8, 2025',
      amountColor: 'text-green-600'
    },
    {
      id: 5,
      type: 'sent',
      title: 'Payout Sent',
      subtitle: 'To: Grand Luxury Resort',
      amount: '-₦2,354.00',
      date: 'July 5, 2025',
      amountColor: 'text-red-600'
    }
  ];

  // Mock data for today's reservations
  const todayReservations = [
    {
      id: 1,
      name: 'Emily Johnson',
      reservationId: '#12345',
      venue: 'Grand Luxury Resort',
      time: 'June 5, 2025 • Time: 7:30 pm',
      status: 'Active',
      avatar: 'E'
    },
    {
      id: 2,
      name: 'Emily Johnson',
      reservationId: '#12345',
      venue: 'Grand Luxury Resort',
      time: 'June 5, 2025 • Time: 7:30 pm',
      status: 'Active',
      avatar: 'E'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      reservationId: '#12345',
      venue: 'Grand Luxury Resort',
      time: 'June 5, 2025 • Time: 7:30 pm',
      status: 'Active',
      avatar: 'E'
    },
    {
      id: 4,
      name: 'Emily Johnson',
      reservationId: '#12345',
      venue: 'Grand Luxury Resort',
      time: 'June 5, 2025 • Time: 7:30 pm',
      status: 'Active',
      avatar: 'E'
    },
    {
      id: 5,
      name: 'Emily Johnson',
      reservationId: '#12345',
      venue: 'Grand Luxury Resort',
      time: 'June 5, 2025 • Time: 7:30 pm',
      status: 'Active',
      avatar: 'E'
    }
  ];

  // Mock hotel bookings
  const hotelBookings = [
    {
      id: 1,
      name: 'Kapadoccia Hotel',
      bookings: '1,243 Bookings',
      amount: '₦20,004,345.00',
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 2,
      name: 'Kapadoccia Hotel',
      bookings: '1,243 Bookings',
      amount: '₦20,004,345.00',
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 3,
      name: 'Kapadoccia Hotel',
      bookings: '1,243 Bookings',
      amount: '₦20,004,345.00',
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 4,
      name: 'Kapadoccia Hotel',
      bookings: '1,243 Bookings',
      amount: '₦20,004,345.00',
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 5,
      name: 'Kapadoccia Hotel',
      bookings: '1,243 Bookings',
      amount: '₦20,004,345.00',
      status: 'Active',
      avatar: 'K'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-teal-100 px-3 py-1 rounded-md">
              <span className="text-teal-700 text-sm font-medium">Restaurant 1 - HQ</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </div>
            </div>
            <Avatar className="h-8 w-8">
              <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm">A</span>
              </div>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">Welcome Back, Admin!</h1>
        <p className="text-gray-600 text-sm mt-1">Here's what is happening today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2 rounded-lg ${metric.color}`}>
                      <IconComponent className={`h-5 w-5 ${metric.iconColor}`} />
                    </div>
                  </div>
                  <div className="text-sm font-medium text-gray-600 mb-1">{metric.title}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-xs text-green-600">{metric.change}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transaction</h2>
          <button className="text-teal-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <ArrowUpDown className={`h-5 w-5 ${
                    transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{transaction.title}</div>
                  <div className="text-xs text-gray-500">{transaction.subtitle}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${transaction.amountColor}`}>
                  {transaction.amount}
                </div>
                <div className="text-xs text-gray-500">{transaction.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Reservations */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Reservation</h2>
          <button className="text-teal-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {todayReservations.map((reservation) => (
            <div key={reservation.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 text-sm font-medium">{reservation.avatar}</span>
                  </div>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    ID: {reservation.reservationId}
                  </div>
                  <div className="text-sm text-gray-900">{reservation.name}</div>
                  <div className="text-xs text-gray-500">{reservation.venue}</div>
                  <div className="text-xs text-gray-500">{reservation.time}</div>
                </div>
              </div>
              <div className="bg-teal-100 px-3 py-1 rounded-full">
                <span className="text-teal-700 text-xs font-medium">{reservation.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Bookings */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today's Reservation</h2>
          <button className="text-teal-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {hotelBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 text-sm font-medium">{booking.avatar}</span>
                  </div>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                  <div className="text-xs text-gray-500">{booking.bookings}</div>
                  <div className="text-sm font-medium text-gray-900">{booking.amount}</div>
                </div>
              </div>
              <div className="bg-teal-100 px-3 py-1 rounded-full">
                <span className="text-teal-700 text-xs font-medium">{booking.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdminBottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AdminDashboard;
