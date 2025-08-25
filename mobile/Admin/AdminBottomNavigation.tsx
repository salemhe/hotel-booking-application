'use client';

import React from 'react';
import { Search, Home, Users, BarChart3, Settings } from 'lucide-react';

interface AdminBottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminBottomNavigation = ({ activeTab = 'Home', onTabChange }: AdminBottomNavigationProps) => {
  const tabs = [
    {
      id: 'Search',
      label: 'Search',
      icon: Search
    },
    {
      id: 'Home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'Vendors',
      label: 'Vendors',
      icon: Users
    },
    {
      id: 'Analytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      id: 'Settings',
      label: 'Settings',
      icon: Settings
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                isActive 
                  ? 'text-teal-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <IconComponent className={`h-5 w-5 mb-1 ${
                isActive ? 'text-teal-600' : 'text-gray-500'
              }`} />
              <span className={`text-xs font-medium ${
                isActive ? 'text-teal-600' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBottomNavigation;
