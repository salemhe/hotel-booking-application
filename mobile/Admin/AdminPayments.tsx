'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter, Edit, TrendingUp, DollarSign, CreditCard } from 'lucide-react';
import { Input } from '../../app/components/ui/input';
import { Avatar } from '../../app/components/ui/avatar';
import { Card, CardContent } from '../../app/components/ui/card';
import AdminBottomNavigation from './AdminBottomNavigation';

const AdminPayments = () => {
  const [activeTab, setActiveTab] = useState('Analytics');
  const [selectedPaymentTab, setSelectedPaymentTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const paymentTabs = ['Overview', "Vendor's Earning", 'Payout History'];
  const filters = ['All', 'Pending', 'Completed', 'Failed'];

  // Mock earnings data
  const earningsData = {
    totalEarnings: '2,567,456.00',
    weeklyEarnings: '525,345.00',
    completedPayments: '372,556.00',
    pendingPayments: '372,556.00',
    availableBalance: '567,456.00',
    lastPaymentDate: 'May 31st, 2025'
  };

  // Mock bank account
  const bankAccount = {
    name: 'Zenith Bank',
    accountNumber: '****1234566',
    accountHolder: 'Joseph Eyebiokin',
    verified: true
  };

  // Mock earnings trend data (this would typically come from a chart library)
  const earningsTrendData = {
    currentWeek: '104',
    growth: '8% vs last week',
    branches: [
      { name: 'Restaurant 1 - HQ', active: true },
      { name: 'Ikeja branch', active: false },
      { name: 'Ketu branch', active: false }
    ]
  };

  // Mock payout history
  const payoutHistory = [
    {
      id: 1,
      transactionId: '22000056789',
      customerName: 'Emily Johnson',
      method: 'Bank Transfer',
      amount: '25,000',
      date: '12/7/2025',
      avatar: 'E'
    },
    {
      id: 2,
      transactionId: '22000056789',
      customerName: 'Emily Johnson',
      method: 'Bank Transfer',
      amount: '25,000',
      date: '12/7/2025',
      avatar: 'E'
    },
    {
      id: 3,
      transactionId: '22000056789',
      customerName: 'Emily Johnson',
      method: 'Bank Transfer',
      amount: '25,000',
      date: '12/7/2025',
      avatar: 'E'
    },
    {
      id: 4,
      transactionId: '22000056789',
      customerName: 'Emily Johnson',
      method: 'Bank Transfer',
      amount: '25,000',
      date: '12/7/2025',
      avatar: 'E'
    },
    {
      id: 5,
      transactionId: '22000056789',
      customerName: 'Emily Johnson',
      method: 'Bank Transfer',
      amount: '25,000',
      date: '12/7/2025',
      avatar: 'E'
    },
    {
      id: 6,
      transactionId: '22000056789',
      customerName: 'Emily Johnson',
      method: 'Bank Transfer',
      amount: '25,000',
      date: '12/7/2025',
      avatar: 'E'
    },
    {
      id: 7,
      transactionId: '22000056789',
      customerName: 'Emily Johnson',
      method: 'Bank Transfer',
      amount: '25,000',
      date: '12/7/2025',
      avatar: 'E'
    }
  ];

  const renderOverview = () => (
    <div className="p-4 space-y-6">
      {/* Earnings Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Total Earnings</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">#{earningsData.totalEarnings}</div>
            <div className="text-xs text-green-600">↑ 12% vs last week</div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Earnings This Week</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">#{earningsData.weeklyEarnings}</div>
            <div className="text-xs text-green-600">↑ 12% vs last week</div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-pink-100">
                <CreditCard className="h-5 w-5 text-pink-600" />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Completed Payment</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">#{earningsData.completedPayments}</div>
            <div className="text-xs text-green-600">↑ 12% vs last week</div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="p-0">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-yellow-100">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 mb-1">Pending Payment</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">#{earningsData.pendingPayments}</div>
            <div className="text-xs text-green-600">↑ 12% vs last week</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Balance */}
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Available Balance</h3>
              <p className="text-3xl font-bold text-gray-900">#{earningsData.availableBalance}</p>
              <p className="text-sm text-gray-500">Last payment processed on {earningsData.lastPaymentDate}</p>
            </div>
            <button className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
              <Plus className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Bank Account */}
          <div className="bg-gray-900 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-600 rounded-sm flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Z</span>
                </div>
                <span className="text-sm font-medium">{bankAccount.name}</span>
                {bankAccount.verified && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-400">Verified Account</span>
                  </div>
                )}
              </div>
              <button>
                <Edit className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <p className="text-lg font-mono tracking-wider mb-1">{bankAccount.accountNumber}</p>
            <p className="text-sm text-gray-300">{bankAccount.accountHolder}</p>
          </div>

          <button className="w-full mt-3 py-2 text-center text-teal-600 font-medium">
            <Plus className="h-4 w-4 inline mr-1" />
            Add Account
          </button>
        </CardContent>
      </Card>

      {/* Earnings Trends */}
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Earnings Trends</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Weekly</span>
              <select className="text-sm border-none bg-transparent">
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl font-bold text-gray-900">{earningsTrendData.currentWeek}</span>
              <span className="text-sm text-green-600">{earningsTrendData.growth}</span>
            </div>
            <div className="flex space-x-4 mb-4">
              {earningsTrendData.branches.map((branch, index) => (
                <div key={index} className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${branch.active ? 'bg-teal-600' : 'bg-gray-300'}`}></div>
                  <span className="text-xs text-gray-600">{branch.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simple Chart Representation */}
          <div className="h-32 bg-gradient-to-r from-teal-100 to-teal-200 rounded-lg flex items-end justify-center">
            <div className="text-center text-gray-600">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-teal-600" />
              <span className="text-sm">Chart visualization would go here</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPayoutHistory = () => (
    <div className="p-4">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search branches"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-12 py-2 border border-gray-300 rounded-lg"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Filter className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 overflow-x-auto pb-4 mb-4">
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

      {/* Payout List */}
      <div className="space-y-3">
        {payoutHistory.map((payout) => (
          <div key={payout.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-700 text-sm font-medium">{payout.avatar}</span>
                </div>
              </Avatar>
              <div>
                <div className="text-sm text-gray-600">ID: {payout.transactionId}</div>
                <div className="text-sm font-medium text-gray-900">{payout.customerName}</div>
                <div className="text-xs text-gray-500">{payout.method}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">#{payout.amount}</div>
              <div className="text-xs text-gray-500">{payout.date}</div>
            </div>
            <button>
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Payments & Earnings</h1>
          <div className="flex items-center space-x-2">
            <button className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </button>
            <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Payment Tabs */}
        <div className="flex space-x-1 overflow-x-auto">
          {paymentTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedPaymentTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                selectedPaymentTab === tab
                  ? 'text-teal-600 border-teal-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedPaymentTab === 'Overview' && renderOverview()}
      {selectedPaymentTab === "Vendor's Earning" && renderOverview()}
      {selectedPaymentTab === 'Payout History' && renderPayoutHistory()}

      <AdminBottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AdminPayments;
