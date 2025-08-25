'use client';

import React, { useState } from 'react';
import { MoreVertical, Edit, Mail, Phone, Upload } from 'lucide-react';
import { Input } from '../../app/components/ui/input';
import { Button } from '../../app/components/ui/button';
import { Card, CardContent } from '../../app/components/ui/card';
import AdminBottomNavigation from './AdminBottomNavigation';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('Settings');
  const [selectedSettingTab, setSelectedSettingTab] = useState('General Info');
  const [businessName, setBusinessName] = useState("Joe's Platter");
  const [businessType, setBusinessType] = useState('Restaurant');
  const [supportEmail, setSupportEmail] = useState('support@bookings.com');
  const [supportPhone, setSupportPhone] = useState('+234 000 111 234');

  const settingTabs = [
    { id: 'General Info', label: 'General Info', icon: '🏠' },
    { id: 'Branch Settings', label: 'Branch Settings', icon: '🏢' },
    { id: 'Reservation', label: 'Reservation', icon: '📅' }
  ];

  const businessTypes = ['Restaurant', 'Hotel', 'Café', 'Bar', 'Fast Food'];

  const renderGeneralInfo = () => (
    <div className="p-4 space-y-6">
      {/* Business Information */}
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
            <button>
              <Edit className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pr-12"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {businessName.length}/50
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Type
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <button>
              <Edit className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Contact Email*
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="pr-10"
                />
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Phone Number*
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  className="pr-10"
                />
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Logo */}
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Business Logo</h3>
            <button>
              <Edit className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload a logo on your profile and customer facing pages
            </p>
            <Button variant="outline" className="w-full mb-2">
              Browse Files
            </Button>
            <p className="text-xs text-gray-500">
              Recommended size: 400×400px, Max file size: 2MB.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBranchSettings = () => (
    <div className="p-4">
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">Branch Settings</div>
            <div className="text-sm text-gray-500">Configure branch-specific settings here</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReservationSettings = () => (
    <div className="p-4">
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">Reservation Settings</div>
            <div className="text-sm text-gray-500">Configure reservation policies and settings</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Settings Tabs */}
        <div className="flex space-x-1 overflow-x-auto">
          {settingTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSettingTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                selectedSettingTab === tab.id
                  ? 'text-teal-600 border-teal-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {selectedSettingTab === 'General Info' && renderGeneralInfo()}
      {selectedSettingTab === 'Branch Settings' && renderBranchSettings()}
      {selectedSettingTab === 'Reservation' && renderReservationSettings()}

      <AdminBottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AdminSettings;
