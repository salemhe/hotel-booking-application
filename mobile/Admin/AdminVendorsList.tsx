'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter } from 'lucide-react';
import { Input } from '../../app/components/ui/input';
import { Avatar } from '../../app/components/ui/avatar';
import AdminBottomNavigation from './AdminBottomNavigation';

const AdminVendorsList = () => {
  const [activeTab, setActiveTab] = useState('Vendors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Upcoming', 'Completed', 'Canceled', 'No shows'];

  // Mock vendor data
  const vendors = [
    {
      id: 1,
      name: 'Kapadoccia',
      type: 'Fine Dining',
      contact: 'Ronald James',
      email: 'restaurantinfo@...',
      branches: 12,
      reservations: 28,
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 2,
      name: 'Kapadoccia',
      type: 'Fine Dining',
      contact: 'Ronald James',
      email: 'restaurantinfo@...',
      branches: 12,
      reservations: 28,
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 3,
      name: 'Kapadoccia',
      type: 'Fine Dining',
      contact: 'Ronald James',
      email: 'restaurantinfo@...',
      branches: 12,
      reservations: 28,
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 4,
      name: 'Kapadoccia',
      type: 'Fine Dining',
      contact: 'Ronald James',
      email: 'restaurantinfo@...',
      branches: 12,
      reservations: 28,
      status: 'Active',
      avatar: 'K'
    }
  ];

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Vendor's List</h1>
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

      {/* Vendors List */}
      <div className="p-4">
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 text-lg font-semibold">{vendor.avatar}</span>
                  </div>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                      <p className="text-sm text-gray-600">{vendor.type}</p>
                    </div>
                    <div className="bg-teal-100 px-3 py-1 rounded-full">
                      <span className="text-teal-700 text-xs font-medium">{vendor.status}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">{vendor.contact}</p>
                    <p className="text-sm text-gray-500">{vendor.email}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{vendor.branches}</span> branches
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{vendor.reservations}</span> reservations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No vendors found</div>
            <div className="text-sm text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      <AdminBottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AdminVendorsList;
