'use client';

import React from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          You're Offline
        </h1>
        
        <p className="text-gray-600 mb-8">
          It looks like you've lost your internet connection. Please check your connection and try again.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={handleRetry}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button 
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Offline Features Available
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• View cached restaurant and hotel data</li>
            <li>• Browse your booking history</li>
            <li>• Prepare reservations for when you're back online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
