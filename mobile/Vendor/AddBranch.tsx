'use client';

import React, { useState } from 'react';
import { X, MapPin, Search, ChevronDown, Clock } from 'lucide-react';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';

interface AddBranchProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AddBranch = ({ isOpen = true, onClose }: AddBranchProps) => {
  const [formData, setFormData] = useState({
    branchName: '',
    address: '',
    city: '',
    state: '',
    phoneNumber: '',
    countryCode: '+234',
    opensAt: '09:00',
    closesAt: '22:00',
    openingDays: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false
    },
    assignedManager: '',
    assignedMenu: '',
    importAllMenuItems: false
  });

  const countryCodes = ['+234', '+1', '+44', '+91', '+86'];
  const states = ['Select state', 'Lagos', 'Abuja', 'Kano', 'Rivers', 'Ogun'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      openingDays: {
        ...prev.openingDays,
        [day]: !prev.openingDays[day as keyof typeof prev.openingDays]
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1">
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold">Add New Branch</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Branch Name */}
        <div>
          <Label htmlFor="branchName" className="text-sm font-medium text-gray-700">
            Branch name*
          </Label>
          <Input
            id="branchName"
            placeholder="e.g. Joe's Chicken and Grill - Ikeja"
            value={formData.branchName}
            onChange={(e) => setFormData(prev => ({ ...prev, branchName: e.target.value }))}
            className="mt-1"
          />
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address" className="text-sm font-medium text-gray-700">
            Address*
          </Label>
          <div className="relative mt-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="address"
              placeholder="Start typing address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city" className="text-sm font-medium text-gray-700">
            City*
          </Label>
          <Input
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="mt-1"
          />
        </div>

        {/* State */}
        <div>
          <Label htmlFor="state" className="text-sm font-medium text-gray-700">
            State*
          </Label>
          <div className="relative mt-1">
            <select
              id="state"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 pr-10 appearance-none bg-white"
            >
              {states.map(state => (
                <option key={state} value={state === 'Select state' ? '' : state}>
                  {state}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
            Phone Number*
          </Label>
          <div className="flex gap-2 mt-1">
            <select
              value={formData.countryCode}
              onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
              className="w-20 border rounded-md px-2 py-2"
            >
              {countryCodes.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <Input
              id="phoneNumber"
              placeholder="7012345678"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="flex-1"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Operating Hours</h3>
          
          {/* Opening Days */}
          <div>
            <Label className="text-sm text-gray-600 mb-3 block">
              Opening Days (Select opening days)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map(day => (
                <div key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={day}
                    checked={formData.openingDays[day as keyof typeof formData.openingDays]}
                    onChange={() => handleDayToggle(day)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={day} className="text-sm text-gray-700">{day}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Time Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opensAt" className="text-sm text-gray-600 mb-2 block">
                Opens at
              </Label>
              <div className="relative">
                <Input
                  id="opensAt"
                  type="time"
                  value={formData.opensAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, opensAt: e.target.value }))}
                  className="pr-10"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <Label htmlFor="closesAt" className="text-sm text-gray-600 mb-2 block">
                Closes at
              </Label>
              <div className="relative">
                <Input
                  id="closesAt"
                  type="time"
                  value={formData.closesAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, closesAt: e.target.value }))}
                  className="pr-10"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Management & Menu */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">Management & Menu</h3>
          
          {/* Assign Manager */}
          <div>
            <Label htmlFor="assignManager" className="text-sm text-gray-600 mb-2 block">
              Assign Manager
            </Label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="assignManager"
                placeholder="Select manager"
                value={formData.assignedManager}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedManager: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Assign Menu */}
          <div>
            <Label htmlFor="assignMenu" className="text-sm text-gray-600 mb-2 block">
              Assign Menu
            </Label>
            <div className="relative mb-2">
              <Input
                id="assignMenu"
                placeholder="Search & Select menu"
                value={formData.assignedMenu}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedMenu: e.target.value }))}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="importAllMenuItems"
                checked={formData.importAllMenuItems}
                onChange={(e) => setFormData(prev => ({ ...prev, importAllMenuItems: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="importAllMenuItems" className="text-sm text-gray-600">
                Import all menu and menu items
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
            Save Branch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddBranch;
