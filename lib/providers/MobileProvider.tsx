'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { useOfflineStorage } from '../hooks/useOfflineStorage';
import { usePushNotifications } from '../hooks/usePushNotifications';
import OfflineIndicator from '../../app/components/mobile/OfflineIndicator';
import NotificationPermissionBanner from '../../app/components/mobile/NotificationPermissionBanner';

interface MobileContextType {
  isOnline: boolean;
  isServiceWorkerReady: boolean;
  pushNotificationsEnabled: boolean;
  requestNotificationPermission: () => Promise<boolean>;
  syncData: () => Promise<void>;
  offlineData: any;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};

interface MobileProviderProps {
  children: React.ReactNode;
}

export default function MobileProvider({ children }: MobileProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  
  const { 
    isServiceWorkerReady, 
    updateAvailable, 
    updateServiceWorker 
  } = useServiceWorker();
  
  const { 
    offlineData, 
    syncData,
    saveOfflineData,
    clearOfflineData 
  } = useOfflineStorage();
  
  const {
    pushNotificationsEnabled,
    requestNotificationPermission,
    subscribeToPushNotifications
  } = usePushNotifications();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync offline data when coming back online
      syncData();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial state
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncData]);

  // Register service worker on mount
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  const contextValue: MobileContextType = {
    isOnline,
    isServiceWorkerReady,
    pushNotificationsEnabled,
    requestNotificationPermission,
    syncData,
    offlineData,
  };

  return (
    <MobileContext.Provider value={contextValue}>
      {children}
      <OfflineIndicator />
      <NotificationPermissionBanner />
      {updateAvailable && (
        <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
          <p className="text-sm mb-2">A new version is available!</p>
          <button
            onClick={updateServiceWorker}
            className="bg-white text-blue-600 px-4 py-2 rounded font-medium text-sm"
          >
            Update Now
          </button>
        </div>
      )}
    </MobileContext.Provider>
  );
}
