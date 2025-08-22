'use client';

import React from 'react';
import { Home, Calendar, Search, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNavigation = ({ activeTab = 'Home', onTabChange }: BottomNavigationProps) => {
  const tabs = [
    {
      id: 'Home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'Moments',
      label: 'Moments',
      icon: Calendar
    },
    {
      id: 'Search',
      label: 'Search',
      icon: Search
    },
    {
      id: 'Profile',
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-teal-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon 
                className={`w-5 h-5 mb-1 ${
                  isActive ? 'fill-teal-600' : ''
                }`}
              />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-12 h-1 bg-teal-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
