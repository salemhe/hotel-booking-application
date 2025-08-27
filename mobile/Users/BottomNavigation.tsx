'use client';

import React from 'react';
import { Home, Calendar, Search, User } from 'lucide-react';
import { useMobileNavigation, getCurrentTab } from '../../lib/hooks/useMobileNavigation';

interface BottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { 
    navigateToHome, 
    currentPath,
    isUserApp 
  } = useMobileNavigation();
  
  // Determine active tab from current path if not provided
  const currentActiveTab = activeTab || getCurrentTab(currentPath);

  const tabs = [
    {
      id: 'Home',
      label: 'Home',
      icon: Home,
      action: navigateToHome,
    },
    {
      id: 'Moments',
      label: 'Moments',
      icon: Calendar,
      action: () => {
        // Navigate to moments/bookings page when implemented
        console.log('Navigate to moments');
      },
    },
    {
      id: 'Search',
      label: 'Search',
      icon: Search,
      action: () => {
        // Navigate to search page when implemented
        console.log('Navigate to search');
      },
    },
    {
      id: 'Profile',
      label: 'Profile',
      icon: User,
      action: () => {
        // Navigate to profile page when implemented
        console.log('Navigate to profile');
      },
    }
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    // Execute navigation action
    tab.action();
    
    // Call external onTabChange if provided
    onTabChange?.(tab.id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom z-50">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentActiveTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
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
