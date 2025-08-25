'use client';

import React, { useState } from 'react';
import { 
  VendorDashboard,
  MenuManagement,
  Reservations,
  Branches,
  Payments,
  NewReservation,
  CreateMenu,
  AddBranch
} from '../../mobile/Vendor';

const DEMO_PAGES = [
  { id: 'dashboard', name: 'Vendor Dashboard', component: VendorDashboard },
  { id: 'menu-management', name: 'Menu Management', component: MenuManagement },
  { id: 'reservations', name: 'Reservations', component: Reservations },
  { id: 'branches', name: 'Branches', component: Branches },
  { id: 'payments', name: 'Payments & Earnings', component: Payments },
  { id: 'new-reservation', name: 'New Reservation', component: NewReservation },
  { id: 'create-menu', name: 'Create Menu', component: CreateMenu },
  { id: 'add-branch', name: 'Add Branch', component: AddBranch },
];

export default function VendorMobileDemoPage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  const CurrentComponent = DEMO_PAGES.find(page => page.id === currentPage)?.component || VendorDashboard;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Navigation */}
      <div className="bg-white shadow-sm border-b p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Mobile Components Demo</h1>
        <div className="flex flex-wrap gap-2">
          {DEMO_PAGES.map((page) => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentPage === page.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Component Container */}
      <div className="flex justify-center bg-gray-100 min-h-screen">
        <div className="w-full max-w-md bg-white shadow-lg">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
