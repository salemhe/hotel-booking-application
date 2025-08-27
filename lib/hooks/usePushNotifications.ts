'use client';

import { useState, useEffect, useCallback } from 'react';

interface UsePushNotificationsReturn {
  pushNotificationsEnabled: boolean;
  permissionStatus: NotificationPermission;
  requestNotificationPermission: () => Promise<boolean>;
  subscribeToPushNotifications: () => Promise<boolean>;
  unsubscribeFromPushNotifications: () => Promise<boolean>;
  isSupported: boolean;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setPermissionStatus(Notification.permission);
      
      // Check if already subscribed
      checkSubscriptionStatus();
    }
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setPushNotificationsEnabled(!!subscription);
    } catch (error) {
      console.error('Failed to check subscription status:', error);
    }
  };

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Push notifications are not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        return true;
      } else {
        console.warn('Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }, [isSupported]);

  const subscribeToPushNotifications = useCallback(async (): Promise<boolean> => {
    if (!isSupported || permissionStatus !== 'granted') {
      console.warn('Cannot subscribe: notifications not supported or permission not granted');
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        // Subscribe to push notifications
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(getVapidPublicKey()),
        });
      }

      if (subscription) {
        // Send subscription to server
        await sendSubscriptionToServer(subscription);
        setPushNotificationsEnabled(true);
        
        // Store subscription locally
        localStorage.setItem('pushSubscription', JSON.stringify(subscription.toJSON()));
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }, [isSupported, permissionStatus]);

  const unsubscribeFromPushNotifications = useCallback(async (): Promise<boolean> => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Unsubscribe from push notifications
        await subscription.unsubscribe();
        
        // Remove subscription from server
        await removeSubscriptionFromServer(subscription);
        
        setPushNotificationsEnabled(false);
        localStorage.removeItem('pushSubscription');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }, []);

  return {
    pushNotificationsEnabled,
    permissionStatus,
    requestNotificationPermission,
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    isSupported,
  };
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getVapidPublicKey(): string {
  // In a real application, this would be your VAPID public key
  // For demo purposes, using a placeholder
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BMqSvZM8mpx8GfvJZqp_ZzZDUCi-K3TgIEJNQrH6iZRr7C8bEZEqGmjr3c4Q8T8_2zNSl7cXHrfJ5v1Bw1Nz0';
}

async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('Subscription sent to server successfully');
  } catch (error) {
    console.error('Failed to send subscription to server:', error);
    // In offline mode, save subscription for later sync
    const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
    offlineActions.push({
      id: Date.now().toString(),
      url: '/api/push/subscribe',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
      type: 'subscription',
    });
    localStorage.setItem('offlineActions', JSON.stringify(offlineActions));
  }
}

async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
  try {
    const response = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription.toJSON(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('Subscription removed from server successfully');
  } catch (error) {
    console.error('Failed to remove subscription from server:', error);
  }
}

// Utility functions for sending notifications
export const pushNotificationUtils = {
  sendBookingConfirmation: async (bookingId: string, userEmail: string) => {
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Booking Confirmed',
          body: `Your booking #${bookingId} has been confirmed!`,
          data: { type: 'booking', bookingId },
          userEmail,
        }),
      });
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
    }
  },

  sendReservationReminder: async (reservationId: string, userEmail: string, time: string) => {
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Reservation Reminder',
          body: `Your reservation is in 30 minutes at ${time}`,
          data: { type: 'reminder', reservationId },
          userEmail,
        }),
      });
    } catch (error) {
      console.error('Failed to send reservation reminder:', error);
    }
  },

  sendPaymentNotification: async (amount: string, userEmail: string) => {
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Payment Processed',
          body: `Your payment of ${amount} has been processed successfully`,
          data: { type: 'payment' },
          userEmail,
        }),
      });
    } catch (error) {
      console.error('Failed to send payment notification:', error);
    }
  },
};
