'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import MobileFeaturesDemo from '../components/mobile/MobileFeaturesDemo';
import MobileProvider from '../../lib/providers/MobileProvider';

export default function MobileFeaturesPage() {
  return (
    <MobileProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Mobile Features Demo
              </h1>
              <p className="text-sm text-gray-600">
                Test offline support, notifications, and PWA features
              </p>
            </div>
          </div>
        </div>

        {/* Features Demo */}
        <MobileFeaturesDemo />

        {/* Quick Links */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="/mobile-demo"
                className="text-center p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
              >
                <div className="text-sm font-medium text-teal-900">User App</div>
                <div className="text-xs text-teal-600">Customer interface</div>
              </a>
              <a 
                href="/vendor-mobile-demo"
                className="text-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="text-sm font-medium text-blue-900">Vendor App</div>
                <div className="text-xs text-blue-600">Business management</div>
              </a>
              <a 
                href="/admin-mobile-demo"
                className="text-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="text-sm font-medium text-purple-900">Admin App</div>
                <div className="text-xs text-purple-600">Platform administration</div>
              </a>
              <a 
                href="/"
                className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">Web App</div>
                <div className="text-xs text-gray-600">Desktop interface</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MobileProvider>
  );
}
