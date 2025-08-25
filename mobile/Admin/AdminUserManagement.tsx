'use client';

import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter } from 'lucide-react';
import { Input } from '../../app/components/ui/input';
import { Avatar } from '../../app/components/ui/avatar';
import AdminBottomNavigation from './AdminBottomNavigation';

const AdminUserManagement = () => {
  const [activeTab, setActiveTab] = useState('Vendors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Upcoming', 'Completed', 'Canceled', 'No shows'];

  // Mock user data
  const users = [
    {
      id: 1,
      name: 'Kapadoccia',
      email: 'staffname@gma...',
      phone: '+234 102 345 6...',
      lastActive: '25/6/2025',
      reservations: 28,
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 2,
      name: 'Kapadoccia',
      email: 'staffname@gma...',
      phone: '+234 102 345 6...',
      lastActive: '25/6/2025',
      reservations: 28,
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 3,
      name: 'Kapadoccia',
      email: 'staffname@gma...',
      phone: '+234 102 345 6...',
      lastActive: '25/6/2025',
      reservations: 28,
      status: 'Active',
      avatar: 'K'
    },
    {
      id: 4,
      name: 'Kapadoccia',
      email: 'staffname@gma...',
      phone: '+234 102 345 6...',
      lastActive: '25/6/2025',
      reservations: 28,
      status: 'Active',
      avatar: 'K'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
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

      {/* Users List */}
      <div className="p-4">
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-start space-x-3">
                <Avatar className="h-12 w-12">
                  <div className="w-full h-full bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 text-lg font-semibold">{user.avatar}</span>
                  </div>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    </div>
                    <div className="bg-teal-100 px-3 py-1 rounded-full">
                      <span className="text-teal-700 text-xs font-medium">{user.status}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="text-sm text-gray-600">
                      Last Active: <span className="font-medium">{user.lastActive}</span>
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{user.reservations}</span> reservations
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No users found</div>
            <div className="text-sm text-gray-500">Try adjusting your search or filters</div>
          </div>
        )}
      </div>

      <AdminBottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AdminUserManagement;
