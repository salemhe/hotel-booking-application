'use client';

import React, { useState } from 'react';
import { Plus, MoreHorizontal, User } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Badge } from '../../app/components/ui/badge';
import VendorBottomNavigation from './VendorBottomNavigation';

interface Transaction {
  id: string;
  customerName: string;
  customerId: string;
  amount: number;
  date: string;
  type: 'Bank Transfer';
}

const Payments = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const transactions: Transaction[] = [
    {
      id: '22000056789',
      customerName: 'Emily Johnson',
      customerId: 'ID: 22000056789',
      amount: 25000,
      date: '12/7/2025',
      type: 'Bank Transfer'
    },
    {
      id: '22000056790',
      customerName: 'Emily Johnson',
      customerId: 'ID: 22000056789',
      amount: 26000,
      date: '12/7/2025',
      type: 'Bank Transfer'
    },
    {
      id: '22000056791',
      customerName: 'Emily Johnson',
      customerId: 'ID: 22000056789',
      amount: 25000,
      date: '12/7/2025',
      type: 'Bank Transfer'
    },
    {
      id: '22000056792',
      customerName: 'Emily Johnson',
      customerId: 'ID: 22000056789',
      amount: 25000,
      date: '12/7/2025',
      type: 'Bank Transfer'
    },
    {
      id: '22000056793',
      customerName: 'Emily Johnson',
      customerId: 'ID: 22000056789',
      amount: 25000,
      date: '12/7/2025',
      type: 'Bank Transfer'
    },
    {
      id: '22000056794',
      customerName: 'Emily Johnson',
      customerId: 'ID: 22000056789',
      amount: 25000,
      date: '12/7/2025',
      type: 'Bank Transfer'
    },
    {
      id: '22000056795',
      customerName: 'Emily Johnson',
      customerId: 'ID: 22000056789',
      amount: 25000,
      date: '12/7/2025',
      type: 'Bank Transfer'
    }
  ];

  const formatAmount = (amount: number) => {
    return `#${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b">
        <h1 className="text-lg font-semibold text-gray-900">Payments & Earnings</h1>
        <div className="flex items-center gap-3">
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4" />
          </Button>
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex gap-4">
          {['Overview', 'Transaction History'].map((tab) => (
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

      {/* Transaction History */}
      <div className="px-4 py-4 space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.customerName}</p>
                      <p className="text-xs text-gray-500">{transaction.customerId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatAmount(transaction.amount)}</p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
                      {transaction.type}
                    </Badge>
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <VendorBottomNavigation activeTab="Payments" />
    </div>
  );
};

export default Payments;
