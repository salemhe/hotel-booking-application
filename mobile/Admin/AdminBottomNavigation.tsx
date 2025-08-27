'use client';

import React from 'react';
import { Search, Home, Users, BarChart3, Settings } from 'lucide-react';
import { useMobileNavigation, getCurrentTab } from '../../lib/hooks/useMobileNavigation';

interface AdminBottomNavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const AdminBottomNavigation = ({ activeTab, onTabChange }: AdminBottomNavigationProps) => {
  const { 
    navigateToAdminDashboard,
    navigateToAdminVendors,
    navigateToAdminPayments,
    currentPath
  } = useMobileNavigation();
  
  // Determine active tab from current path if not provided
  const currentActiveTab = activeTab || getCurrentTab(currentPath);

  const tabs = [
    {
      id: 'Search',
      label: 'Search',
      icon: Search,
      action: () => {
        // Navigate to admin search page when implemented
        console.log('Navigate to admin search');
      },
    },
    {
      id: 'Home',
      label: 'Home',
      icon: Home,
      action: navigateToAdminDashboard,
    },
    {
      id: 'Vendors',
      label: 'Vendors',
      icon: Users,
      action: navigateToAdminVendors,
    },
    {
      id: 'Analytics',
      label: 'Analytics',
      icon: BarChart3,
      action: navigateToAdminPayments,
    },
    {
      id: 'Settings',
      label: 'Settings',
      icon: Settings,
      action: () => {
        // Navigate to admin settings page when implemented
        console.log('Navigate to admin settings');
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = currentActiveTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
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
