'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { useMobile } from '../../../lib/providers/MobileProvider';

export default function OfflineIndicator() {
  const { isOnline, syncData, offlineData } = useMobile();
  const [isVisible, setIsVisible] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Show indicator when offline or when there's offline data to sync
    setIsVisible(!isOnline || (offlineData && offlineData.length > 0));
  }, [isOnline, offlineData]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncData();
    } catch (error) {
      console.error('Manual sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      !isOnline ? 'bg-red-600' : 'bg-orange-500'
    }`}>
      <div className="flex items-center justify-between px-4 py-2 text-white text-sm">
        <div className="flex items-center space-x-2">
          {!isOnline ? (
            <>
              <WifiOff className="h-4 w-4" />
              <span>You're offline</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              <span>
                {offlineData?.length || 0} {offlineData?.length === 1 ? 'action' : 'actions'} pending sync
              </span>
            </>
          )}
        </div>
        
        {isOnline && offlineData && offlineData.length > 0 && (
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="text-xs">
              {isSyncing ? 'Syncing...' : 'Sync now'}
            </span>
          </button>
        )}
      </div>
      
      {!isOnline && (
        <div className="px-4 pb-2">
          <p className="text-xs text-white/80">
            You can continue using the app. Your actions will be saved and synced when you're back online.
          </p>
        </div>
      )}
    </div>
  );
}
