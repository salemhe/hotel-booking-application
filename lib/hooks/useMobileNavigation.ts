'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface UseMobileNavigationReturn {
  navigateToHome: () => void;
  navigateToRestaurant: (id: string) => void;
  navigateToHotel: (id: string) => void;
  navigateToBooking: (type: 'restaurant' | 'hotel', id?: string) => void;
  navigateToPayment: (data?: any) => void;
  navigateToConfirmation: (type?: 'restaurant' | 'hotel') => void;
  navigateToVendorDashboard: () => void;
  navigateToVendorMenu: () => void;
  navigateToVendorReservations: () => void;
  navigateToAdminDashboard: () => void;
  navigateToAdminVendors: () => void;
  navigateToAdminPayments: () => void;
  goBack: () => void;
  currentPath: string;
  isUserApp: boolean;
  isVendorApp: boolean;
  isAdminApp: boolean;
}

export function useMobileNavigation(): UseMobileNavigationReturn {
  const router = useRouter();
  const pathname = usePathname();

  const isUserApp = pathname.startsWith('/(mobile)/user') || pathname.startsWith('/mobile-demo');
  const isVendorApp = pathname.startsWith('/(mobile)/vendor') || pathname.startsWith('/vendor-mobile-demo');
  const isAdminApp = pathname.startsWith('/(mobile)/admin') || pathname.startsWith('/admin-mobile-demo');

  // User navigation functions
  const navigateToHome = useCallback(() => {
    router.push('/(mobile)/user');
  }, [router]);

  const navigateToRestaurant = useCallback((id: string) => {
    router.push(`/(mobile)/user/restaurant/${id}`);
  }, [router]);

  const navigateToHotel = useCallback((id: string) => {
    router.push(`/(mobile)/user/hotel/${id}`);
  }, [router]);

  const navigateToBooking = useCallback((type: 'restaurant' | 'hotel', id?: string) => {
    const query = id ? `?id=${id}` : '';
    router.push(`/(mobile)/user/booking/${type}${query}`);
  }, [router]);

  const navigateToPayment = useCallback((data?: any) => {
    // Store payment data in sessionStorage for retrieval on payment page
    if (data) {
      sessionStorage.setItem('paymentData', JSON.stringify(data));
    }
    router.push('/(mobile)/user/payment');
  }, [router]);

  const navigateToConfirmation = useCallback((type?: 'restaurant' | 'hotel') => {
    if (type) {
      sessionStorage.setItem('confirmationType', type);
    }
    router.push('/(mobile)/user/confirmation');
  }, [router]);

  // Vendor navigation functions
  const navigateToVendorDashboard = useCallback(() => {
    router.push('/(mobile)/vendor');
  }, [router]);

  const navigateToVendorMenu = useCallback(() => {
    router.push('/(mobile)/vendor/menu');
  }, [router]);

  const navigateToVendorReservations = useCallback(() => {
    router.push('/(mobile)/vendor/reservations');
  }, [router]);

  // Admin navigation functions
  const navigateToAdminDashboard = useCallback(() => {
    router.push('/(mobile)/admin');
  }, [router]);

  const navigateToAdminVendors = useCallback(() => {
    router.push('/(mobile)/admin/vendors');
  }, [router]);

  const navigateToAdminPayments = useCallback(() => {
    router.push('/(mobile)/admin/payments');
  }, [router]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    navigateToHome,
    navigateToRestaurant,
    navigateToHotel,
    navigateToBooking,
    navigateToPayment,
    navigateToConfirmation,
    navigateToVendorDashboard,
    navigateToVendorMenu,
    navigateToVendorReservations,
    navigateToAdminDashboard,
    navigateToAdminVendors,
    navigateToAdminPayments,
    goBack,
    currentPath: pathname,
    isUserApp,
    isVendorApp,
    isAdminApp,
  };
}

// Helper function to get current active tab for bottom navigation
export function getCurrentTab(pathname: string): string {
  if (pathname.includes('/restaurant') || pathname.includes('/hotel')) {
    return 'Search';
  }
  if (pathname.includes('/booking') || pathname.includes('/payment') || pathname.includes('/confirmation')) {
    return 'Booking';
  }
  if (pathname.includes('/menu')) {
    return 'Menu';
  }
  if (pathname.includes('/reservations')) {
    return 'Reservations';
  }
  if (pathname.includes('/vendors')) {
    return 'Vendors';
  }
  if (pathname.includes('/payments')) {
    return 'Analytics';
  }
  if (pathname.includes('/settings')) {
    return 'Settings';
  }
  
  // Default to Home for dashboard pages
  return 'Home';
}

// Navigation utilities for offline support
export const navigationUtils = {
  // Store navigation intent for offline sync
  storeNavigationIntent: (destination: string, data?: any) => {
    const intent = {
      destination,
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem('pendingNavigation', JSON.stringify(intent));
  },

  // Execute pending navigation when online
  executePendingNavigation: (router: any) => {
    const pending = sessionStorage.getItem('pendingNavigation');
    if (pending) {
      try {
        const intent = JSON.parse(pending);
        router.push(intent.destination);
        sessionStorage.removeItem('pendingNavigation');
      } catch (error) {
        console.error('Failed to execute pending navigation:', error);
      }
    }
  },

  // Check if current route requires online access
  requiresOnline: (pathname: string): boolean => {
    const onlineRequiredRoutes = [
      '/payment',
      '/confirmation',
      '/admin/payments',
      '/vendor/reservations',
    ];
    
    return onlineRequiredRoutes.some(route => pathname.includes(route));
  },
};
