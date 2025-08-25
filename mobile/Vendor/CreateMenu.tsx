'use client';

import React, { useState } from 'react';
import { X, Upload, Check, Plus } from 'lucide-react';
import { Card, CardContent } from '../../app/components/ui/card';
import { Button } from '../../app/components/ui/button';
import { Input } from '../../app/components/ui/input';
import { Label } from '../../app/components/ui/label';
import { Textarea } from '../../app/components/ui/textarea';
import { Badge } from '../../app/components/ui/badge';

interface CreateMenuProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
}

const CreateMenu = ({ isOpen = true, onClose }: CreateMenuProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    menuName: '',
    description: '',
    menuType: [] as string[],
    mealTime: [] as string[],
    price: '',
    priceType: 'fixed',
    showOnApp: true,
    branches: [] as string[]
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Buffalo wings',
      description: 'Description (If Available)',
      price: 30000,
      category: 'Starters',
      tags: ['Spicy', 'Popular', 'Savory']
    },
    {
      id: '2',
      name: 'Signature Burger',
      description: 'Description (If Available)',
      price: 30000,
      category: 'Starters',
      tags: ['Spicy', 'Popular', 'Savory']
    }
  ]);

  const [newItemData, setNewItemData] = useState({
    name: '',
    description: '',
    category: 'Starters',
    tags: [] as string[],
    menuAssignment: "Joe's Platter",
    showOnMenu: true
  });

  const steps = [
    { number: 1, label: 'Reservation Details', active: currentStep === 1 },
    { number: 2, label: 'Preselect meal', active: currentStep === 2 },
    { number: 3, label: 'Payment', active: currentStep === 3 }
  ];

  const menuTypes = ['A la Carte', 'Buffet', 'Set Menu', 'Takeaway', 'Tasting Menu'];
  const mealTimes = ['Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Late Night', 'All Day'];
  const categories = ['Starters', 'Main Dish', 'Dessert', 'Drink'];
  const availableTags = ['Spicy', 'Popular', 'Savory'];

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
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
          <h1 className="text-lg font-semibold">Create Menu</h1>
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

      {/* Step 1: Menu Details */}
      {currentStep === 1 && (
        <div className="px-4 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="menuName" className="text-sm font-medium text-gray-700">
                Menu name*
              </Label>
              <Input
                id="menuName"
                placeholder="e.g Joe's Platter"
                value={formData.menuName}
                onChange={(e) => setFormData(prev => ({ ...prev, menuName: e.target.value }))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">0/50</p>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Menu Description (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Add a short description or notes about this menu"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Menu Type
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {menuTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleArrayItem(formData.menuType, type, (value) => 
                      setFormData(prev => ({ ...prev, menuType: value }))
                    )}
                    className={`p-3 text-sm border rounded-lg text-left ${
                      formData.menuType.includes(type)
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Menu Availability (Meal Time)
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {mealTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => toggleArrayItem(formData.mealTime, time, (value) => 
                      setFormData(prev => ({ ...prev, mealTime: value }))
                    )}
                    className={`p-3 text-sm border rounded-lg text-left ${
                      formData.mealTime.includes(time)
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Price*
              </Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="fixedPrice"
                    name="priceType"
                    checked={formData.priceType === 'fixed'}
                    onChange={() => setFormData(prev => ({ ...prev, priceType: 'fixed' }))}
                    className="rounded"
                  />
                  <Label htmlFor="fixedPrice" className="text-sm">Fixed Price</Label>
                </div>
                
                {formData.priceType === 'fixed' && (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">#</span>
                    <Input
                      placeholder="10,000"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="pricePerItem"
                    name="priceType"
                    checked={formData.priceType === 'perItem'}
                    onChange={() => setFormData(prev => ({ ...prev, priceType: 'perItem' }))}
                    className="rounded"
                  />
                  <Label htmlFor="pricePerItem" className="text-sm">Price per item</Label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Cover Image (Optional)
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Drag and drop an image here, or</p>
                <Button variant="outline" size="sm">Browse Files</Button>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG OR GIF • Max 5MB</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Menu Availability
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showOnApp"
                  checked={formData.showOnApp}
                  onChange={(e) => setFormData(prev => ({ ...prev, showOnApp: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="showOnApp" className="text-sm">Show menu on this app</Label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Make this menu visible to customers</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">
                Assign to Branches
              </Label>
              <div className="relative">
                <select className="w-full border rounded-md px-3 py-2 appearance-none bg-white">
                  <option>Select branches</option>
                  <option>Branch 1</option>
                  <option>Branch 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Menu Items */}
      {currentStep === 2 && (
        <div className="px-4 space-y-6">
          {/* Add Menu Item Tabs */}
          <div className="flex gap-4">
            {['Add Existing Menu Item', 'Create New Menu Item'].map((tab, index) => (
              <button
                key={tab}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  index === 1 ? 'bg-gray-200 text-gray-900' : 'text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Category */}
          <div className="flex gap-2">
            <Input placeholder="Search menu items" className="flex-1" />
            <select className="border rounded-md px-3 py-2">
              <option>All Category</option>
              <option>Starters</option>
              <option>Main Dish</option>
              <option>Desserts</option>
            </select>
          </div>

          {/* New Item Form */}
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="itemName" className="text-sm font-medium text-gray-700">
                    Menu Item name*
                  </Label>
                  <Input
                    id="itemName"
                    placeholder="e.g Buffalo wings"
                    value={newItemData.name}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">0/50</p>
                </div>

                <div>
                  <Label htmlFor="itemDescription" className="text-sm font-medium text-gray-700">
                    Menu Description (Optional)
                  </Label>
                  <Textarea
                    id="itemDescription"
                    placeholder="Add a short description or notes about this menu"
                    value={newItemData.description}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1 min-h-[60px]"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Categorization
                  </Label>
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">Menu Category*</Label>
                    <div className="flex gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setNewItemData(prev => ({ ...prev, category }))}
                          className={`px-3 py-2 text-sm border rounded-lg ${
                            newItemData.category === category
                              ? 'border-teal-600 bg-teal-50 text-teal-700'
                              : 'border-gray-200 bg-white text-gray-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Menu Availability (Meal Time)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {mealTimes.map((time) => (
                      <button
                        key={time}
                        className="p-2 text-sm border rounded-lg text-left border-gray-200 bg-white text-gray-700"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Menu Assignment*</Label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">{newItemData.menuAssignment}</p>
                    <p className="text-xs text-yellow-600">Current menu - Item will be displayed here</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Tags*</Label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Select tags</option>
                    {availableTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 mt-2">
                    {availableTags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Images</Label>
                  <p className="text-xs text-gray-500 mb-3">You can add up to 3 images</p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img src="/api/placeholder/100/100" alt="Menu item" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Plus className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <Plus className="h-6 w-6 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG OR GIF • Max 5MB</p>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Add-ons & Variants</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="enableAddons"
                      className="rounded"
                    />
                    <Label htmlFor="enableAddons" className="text-sm">Enable Add-ons</Label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Menu Availability</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showItemOnMenu"
                      checked={newItemData.showOnMenu}
                      onChange={(e) => setNewItemData(prev => ({ ...prev, showOnMenu: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="showItemOnMenu" className="text-sm">Show item on menu</Label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Make this menu item visible to customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Success */}
      {currentStep === 3 && (
        <div className="px-4 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Menu Successfully Created</h2>
            <p className="text-gray-600">Your pre-selected meals have been confirmed for your upcoming reservation</p>
          </div>

          <Card>
            <CardContent className="p-4 text-left">
              <h3 className="font-medium text-gray-900 mb-3">Reservation Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Menu Name</span>
                  <span className="text-gray-900">Joe's Platter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meal Time</span>
                  <span className="text-gray-900">All Day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Menu Type</span>
                  <span className="text-gray-900">A la Carte, Buffet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">No of Items</span>
                  <span className="text-gray-900">4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date Created</span>
                  <span className="text-gray-900">20/7/2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-left">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Joe's Platter Menu List</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Drag to reorder items in your menu</p>
              
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg">
                    <div className="flex flex-col gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                      <p className="text-lg font-semibold text-gray-900">#{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          {currentStep === 3 ? (
            <>
              <Button variant="outline" className="flex-1">
                Back
              </Button>
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                Create New Menu
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                Continue
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateMenu;
