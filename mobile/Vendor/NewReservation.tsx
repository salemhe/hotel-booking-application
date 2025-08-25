'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, ChevronDown, Check, Plus, Minus } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Textarea } from '../../app/components/ui/textarea';

interface NewReservationProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

const NewReservation = ({ isOpen = true, onClose }: NewReservationProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    date: '17/6/2025',
    time: '',
    guests: '',
    tablePreference: '',
    specialRequests: '',
    staffNotes: '',
    isDining: false
  });

  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Calamari Fritti',
      description: 'Add extra lemon on the side',
      price: 0,
      quantity: 2,
      category: 'Appetizer'
    },
    {
      id: '2',
      name: 'Calamari Fritti',
      description: 'Add extra lemon on the side',
      price: 0,
      quantity: 1,
      category: 'Appetizer'
    }
  ]);

  const menuItems: MenuItem[] = [
    {
      id: '3',
      name: 'Meze Platter',
      description: 'Hummus, baba ghanoush, tzatziki, pit...',
      price: 15000,
      quantity: 2,
      category: 'Starters'
    },
    {
      id: '4',
      name: 'Meze Platter',
      description: 'Hummus, baba ghanoush, tzatziki, pit...',
      price: 15000,
      quantity: 2,
      category: 'Starters'
    }
  ];

  const updateQuantity = (id: string, change: number) => {
    setSelectedItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      )
    );
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const steps = [
    { number: 1, label: 'Reservation Details', active: currentStep === 1 },
    { number: 2, label: 'Preselect meal', active: currentStep === 2 },
    { number: 3, label: 'Payment', active: currentStep === 3 }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1">
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold">New Reservation</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.active ? 'bg-teal-600 text-white' : 
                currentStep > step.number ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-teal-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          {steps.map(step => (
            <span key={step.number} className="text-center flex-1">{step.label}</span>
          ))}
        </div>
      </div>

      {/* Step 1: Reservation Details */}
      {currentStep === 1 && (
        <div className="px-4 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="text-sm font-medium text-gray-700">
                Customer name*
              </Label>
              <Input
                id="customerName"
                placeholder="Enter full name"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                Phone number
              </Label>
              <Input
                id="phoneNumber"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Date*
              </Label>
              <div className="relative mt-1">
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                Time*
              </Label>
              <div className="relative mt-1">
                <Input
                  id="time"
                  placeholder="--:--"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="pr-10"
                />
                <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="guests" className="text-sm font-medium text-gray-700">
                No. of guests*
              </Label>
              <div className="relative mt-1">
                <select
                  id="guests"
                  value={formData.guests}
                  onChange={(e) => setFormData(prev => ({ ...prev, guests: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 pr-10 appearance-none bg-white"
                >
                  <option value="">Select number of guests</option>
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                  <option value="4">4 guests</option>
                  <option value="5">5 guests</option>
                  <option value="6">6+ guests</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDining"
                checked={formData.isDining}
                onChange={(e) => setFormData(prev => ({ ...prev, isDining: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isDining" className="text-sm text-gray-600">
                Customer is dining now, skip meal preselect
              </Label>
            </div>

            <div>
              <Label htmlFor="tablePreference" className="text-sm font-medium text-gray-700">
                Table Preference*
              </Label>
              <div className="relative mt-1">
                <select
                  id="tablePreference"
                  value={formData.tablePreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, tablePreference: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 pr-10 appearance-none bg-white"
                >
                  <option value="">Pick table preference</option>
                  <option value="window">Window seat</option>
                  <option value="private">Private area</option>
                  <option value="main">Main dining area</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div>
              <Label htmlFor="specialRequests" className="text-sm font-medium text-gray-700">
                Special Requests
              </Label>
              <Textarea
                id="specialRequests"
                placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="staffNotes" className="text-sm font-medium text-gray-700">
                Special Requests
              </Label>
              <Textarea
                id="staffNotes"
                placeholder="Add notes for staff (not visible to customers)"
                value={formData.staffNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, staffNotes: e.target.value }))}
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Preselect Meal */}
      {currentStep === 2 && (
        <div className="px-4 space-y-6">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {['Starters', 'Main Course', 'Appetizers', 'Desserts'].map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  category === 'Starters' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Card key={item.id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <p className="text-lg font-semibold text-gray-900">#{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">Special request (e.g. no garlic)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {currentStep === 3 && (
        <div className="px-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Choose your payment option</h2>
            <p className="text-sm text-gray-600 mb-4">Amount to pay: #{totalAmount.toLocaleString()}</p>
            
            <div className="space-y-3">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 py-3">
                Prepay Now
              </Button>
              <Button variant="outline" className="w-full py-3">
                Pay at Restaurant
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              
              {['Appetizer', 'Main Dish', 'Dessert'].map((category) => (
                <div key={category} className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                  {selectedItems.filter(item => item.category === category).map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-1">
                      <div>
                        <p className="text-sm text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              ))}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <div className="flex gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0 mt-0.5"></div>
                  <p className="text-sm text-yellow-800">
                    Special Request: One guest is allergic to garlic. Please consider this
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            className="flex-1"
            disabled={currentStep === 1}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewReservation;
