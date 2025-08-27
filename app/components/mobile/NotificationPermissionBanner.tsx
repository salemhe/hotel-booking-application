'use client';

import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { usePushNotifications } from '../../../lib/hooks/usePushNotifications';

export default function NotificationPermissionBanner() {
  const {
    permissionStatus,
    requestNotificationPermission,
    subscribeToPushNotifications,
    isSupported,
  } = usePushNotifications();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Check if banner should be shown
    const dismissed = localStorage.getItem('notificationBannerDismissed');
    
    if (
      isSupported &&
      permissionStatus === 'default' &&
      !dismissed &&
      !isDismissed
    ) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isSupported, permissionStatus, isDismissed]);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    
    try {
      const granted = await requestNotificationPermission();
      
      if (granted) {
        // Subscribe to push notifications
        await subscribeToPushNotifications();
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  if (!isVisible || permissionStatus !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
          <Bell className="h-5 w-5 text-teal-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Stay updated with notifications
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            Get notified about booking confirmations, reservation reminders, and special offers.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleRequestPermission}
              disabled={isRequesting}
              className="flex items-center space-x-1 bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors disabled:opacity-50"
            >
              {isRequesting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  <span>Enabling...</span>
                </>
              ) : (
                <>
                  <Check className="h-3 w-3" />
                  <span>Enable</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
