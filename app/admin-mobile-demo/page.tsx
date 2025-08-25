'use client';

import React, { useState } from 'react';
import { 
  AdminDashboard,
  AdminVendorsList,
  AdminUserManagement,
  AdminReservations,
  AdminPayments,
  AdminSettings
} from '../../mobile/Admin';

const AdminMobileDemo = () => {
  const [currentComponent, setCurrentComponent] = useState('AdminDashboard');

  const components = [
    { id: 'AdminDashboard', name: 'Admin Dashboard', component: AdminDashboard },
    { id: 'AdminVendorsList', name: 'Vendors List', component: AdminVendorsList },
    { id: 'AdminUserManagement', name: 'User Management', component: AdminUserManagement },
    { id: 'AdminReservations', name: 'Reservations', component: AdminReservations },
    { id: 'AdminPayments', name: 'Payments & Earnings', component: AdminPayments },
    { id: 'AdminSettings', name: 'Settings', component: AdminSettings }
  ];

  const CurrentComponent = components.find(comp => comp.id === currentComponent)?.component || AdminDashboard;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Component Selector - Only visible on desktop */}
      <div className="hidden md:block bg-white border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Mobile Components Demo</h1>
        <div className="flex flex-wrap gap-2">
          {components.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setCurrentComponent(comp.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentComponent === comp.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {comp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile View Container */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm">
          {/* Mobile Frame */}
          <div className="bg-black rounded-[2.5rem] p-2 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden">
              {/* Status Bar */}
              <div className="bg-white px-6 py-2 flex items-center justify-between text-sm font-medium">
                <span>9:45</span>
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="w-6 h-3 border border-black rounded-sm">
                    <div className="w-4 h-1 bg-black rounded-sm ml-1 mt-0.5"></div>
                  </div>
                </div>
              </div>

              {/* Component Content */}
              <div className="h-[600px] overflow-hidden">
                <CurrentComponent />
              </div>
            </div>
          </div>

          {/* Component Info */}
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {components.find(comp => comp.id === currentComponent)?.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Admin mobile interface component
            </p>
          </div>

          {/* Mobile Component Selector */}
          <div className="md:hidden mt-4">
            <select
              value={currentComponent}
              onChange={(e) => setCurrentComponent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {components.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMobileDemo;
