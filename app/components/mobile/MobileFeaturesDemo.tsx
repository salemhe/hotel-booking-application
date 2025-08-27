'use client';

import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Bell, 
  Download, 
  Smartphone, 
  MapPin,
  Check,
  X,
  RefreshCw
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useMobile } from '../../../lib/providers/MobileProvider';
import { usePushNotifications } from '../../../lib/hooks/usePushNotifications';

export default function MobileFeaturesDemo() {
  const { isOnline, offlineData, syncData } = useMobile();
  const { 
    pushNotificationsEnabled, 
    permissionStatus, 
    requestNotificationPermission,
    subscribeToPushNotifications 
  } = usePushNotifications();

  const [isSyncing, setIsSyncing] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await subscribeToPushNotifications();
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncData();
    setIsSyncing(false);
  };

  const sendTestNotification = async () => {
    try {
      await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test from your Bookie app!',
          data: { type: 'test' },
          userEmail: 'demo@example.com',
        }),
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  const features = [
    {
      icon: isOnline ? Wifi : WifiOff,
      title: 'Offline Support',
      description: 'Works without internet connection',
      status: isOnline ? 'Online' : 'Offline',
      color: isOnline ? 'green' : 'red',
      details: `${offlineData?.length || 0} actions queued for sync`,
    },
    {
      icon: Bell,
      title: 'Push Notifications',
      description: 'Get notified about bookings and updates',
      status: pushNotificationsEnabled ? 'Enabled' : 'Disabled',
      color: pushNotificationsEnabled ? 'green' : 'gray',
      details: `Permission: ${permissionStatus}`,
    },
    {
      icon: Smartphone,
      title: 'Native Experience',
      description: 'Install as mobile app',
      status: 'Available',
      color: 'blue',
      details: 'Add to home screen for app-like experience',
    },
    {
      icon: MapPin,
      title: 'Location-Based',
      description: 'Find nearby restaurants and hotels',
      status: 'Ready',
      color: 'purple',
      details: 'GPS and offline maps support',
    },
  ];

  return (
    <div className="p-6 max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Mobile Features
        </h2>
        <p className="text-gray-600 text-sm">
          Enhanced mobile experience with offline support
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-4">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-${feature.color}-100`}>
                    <IconComponent className={`h-5 w-5 text-${feature.color}-600`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <Badge 
                        variant="secondary"
                        className={`bg-${feature.color}-100 text-${feature.color}-800`}
                      >
                        {feature.status}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      {feature.description}
                    </p>
                    
                    <p className="text-xs text-gray-500">
                      {feature.details}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Offline Sync */}
        {!isOnline && offlineData && offlineData.length > 0 && (
          <Button 
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : `Sync ${offlineData.length} Actions`}
          </Button>
        )}

        {/* Enable Notifications */}
        {!pushNotificationsEnabled && permissionStatus === 'default' && (
          <Button 
            onClick={handleEnableNotifications}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Bell className="h-4 w-4 mr-2" />
            Enable Notifications
          </Button>
        )}

        {/* Test Notification */}
        {pushNotificationsEnabled && (
          <Button 
            onClick={sendTestNotification}
            variant="outline"
            className="w-full"
            disabled={testNotificationSent}
          >
            {testNotificationSent ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-600" />
                Notification Sent!
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Send Test Notification
              </>
            )}
          </Button>
        )}

        {/* Install Prompt */}
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => {
            // Trigger install prompt
            alert('Look for "Add to Home Screen" in your browser menu!');
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Install App
        </Button>
      </div>

      {/* Status Info */}
      <Card className="border-0 bg-gray-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-700">
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Connection:</span>
              <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Worker:</span>
              <span className="text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span>PWA Support:</span>
              <span className="text-green-600">Available</span>
            </div>
            <div className="flex justify-between">
              <span>Notifications:</span>
              <span className={pushNotificationsEnabled ? 'text-green-600' : 'text-gray-500'}>
                {pushNotificationsEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
