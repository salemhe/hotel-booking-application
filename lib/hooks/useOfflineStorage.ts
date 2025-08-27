'use client';

import { useState, useEffect, useCallback } from 'react';

interface OfflineAction {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  timestamp: number;
  type: 'booking' | 'reservation' | 'payment' | 'update';
}

interface UseOfflineStorageReturn {
  offlineData: OfflineAction[];
  saveOfflineData: (action: Omit<OfflineAction, 'id' | 'timestamp'>) => void;
  clearOfflineData: () => void;
  syncData: () => Promise<void>;
  isOnline: boolean;
}

export function useOfflineStorage(): UseOfflineStorageReturn {
  const [offlineData, setOfflineData] = useState<OfflineAction[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Load offline data from localStorage on mount
    loadOfflineData();
    
    // Set initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    try {
      const stored = localStorage.getItem('offlineActions');
      if (stored) {
        setOfflineData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const saveOfflineData = useCallback((action: Omit<OfflineAction, 'id' | 'timestamp'>) => {
    const newAction: OfflineAction = {
      ...action,
      id: generateId(),
      timestamp: Date.now(),
    };

    setOfflineData(prev => {
      const updated = [...prev, newAction];
      localStorage.setItem('offlineActions', JSON.stringify(updated));
      return updated;
    });

    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(registration => {
        return registration.sync.register('background-sync');
      }).catch(error => {
        console.error('Background sync registration failed:', error);
      });
    }
  }, []);

  const clearOfflineData = useCallback(() => {
    setOfflineData([]);
    localStorage.removeItem('offlineActions');
  }, []);

  const syncData = useCallback(async () => {
    if (!isOnline || offlineData.length === 0) {
      return;
    }

    console.log(`Syncing ${offlineData.length} offline actions...`);

    const failedActions: OfflineAction[] = [];

    for (const action of offlineData) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: {
            'Content-Type': 'application/json',
            ...action.headers,
          },
          body: action.body ? JSON.stringify(action.body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`Successfully synced action ${action.id}`);
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        failedActions.push(action);
      }
    }

    // Update offline data with only failed actions
    setOfflineData(failedActions);
    localStorage.setItem('offlineActions', JSON.stringify(failedActions));

    if (failedActions.length === 0) {
      console.log('All offline actions synced successfully');
    } else {
      console.log(`${failedActions.length} actions failed to sync and will be retried`);
    }
  }, [isOnline, offlineData]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && offlineData.length > 0) {
      syncData();
    }
  }, [isOnline, syncData]);

  return {
    offlineData,
    saveOfflineData,
    clearOfflineData,
    syncData,
    isOnline,
  };
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Utility functions for specific data types
export const offlineStorageUtils = {
  saveBooking: (bookingData: any) => ({
    url: '/api/bookings',
    method: 'POST',
    headers: {},
    body: bookingData,
    type: 'booking' as const,
  }),

  saveReservation: (reservationData: any) => ({
    url: '/api/reservations',
    method: 'POST',
    headers: {},
    body: reservationData,
    type: 'reservation' as const,
  }),

  savePayment: (paymentData: any) => ({
    url: '/api/payments',
    method: 'POST',
    headers: {},
    body: paymentData,
    type: 'payment' as const,
  }),

  updateProfile: (profileData: any) => ({
    url: '/api/profile',
    method: 'PUT',
    headers: {},
    body: profileData,
    type: 'update' as const,
  }),
};
