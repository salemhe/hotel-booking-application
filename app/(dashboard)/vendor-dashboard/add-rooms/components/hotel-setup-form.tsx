"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, MapPin, Info } from 'lucide-react';
import { HotelCategory, HotelFormData } from '@/types/hotels';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HotelSetupFormProps {
  onSubmit: (data: HotelFormData) => void;
}

export function HotelSetupForm({ onSubmit }: HotelSetupFormProps) {
  const [formData, setFormData] = useState<HotelFormData>({
    hotelName: '',
    phoneNumber: '7012345678',
    countryCode: '+234',
    emailAddress: '',
    address: '',
    additionalAddressDetail: '',
    branchCode: 'HTL - 12345',
    hotelType: 'Apartment',
    hotelCategory: 'Standard',
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: keyof HotelFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (category: HotelCategory) => {
    setFormData(prev => ({ ...prev, hotelCategory: category }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFormData(prev => ({ ...prev, logoImage: file }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, logoImage: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6 rounded-lg  border p-8 bg-white">
          {/* Hotel Name */}
          <div className="space-y-2">
            <Label htmlFor="hotelName" className="text-sm font-medium text-gray-700">
              Hotel name<span className="text-red-500">*</span> 
            </Label>
            <Input
              id="hotelName"
              placeholder="Enter hotel name"
              value={formData.hotelName}
              onChange={(e) => handleInputChange('hotelName', e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">This name will be displayed to customers</p>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Phone Number<span className="text-red-500">*</span> 
            </Label>
            <div className="flex flex-row gap-2 items-stretch">
              <Select
                value={formData.countryCode}
                onValueChange={(value) => handleInputChange("countryCode", value)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+234">+234</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+91">+91</SelectItem>
                </SelectContent>
              </Select>

              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className="flex-1"
              />
            </div>

          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="emailAddress" className="text-sm font-medium text-gray-700">
              Email Address<span className="text-red-500">*</span> 
            </Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="Enter email address"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address<span className="text-red-500">*</span> 
            </Label>
            <div className="relative">
              <Input
                id="address"
                placeholder="Search for address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full pr-10"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Additional Address Detail */}
          <div className="space-y-2">
            <Textarea
              placeholder="Additional address detail"
              value={formData.additionalAddressDetail}
              onChange={(e) => handleInputChange('additionalAddressDetail', e.target.value)}
              className="w-full min-h-[80px] resize-none"
            />
          </div>

          {/* Branch Code */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="branchCode" className="text-sm font-medium text-gray-700">
                Branch Code <span className="text-red-500">*</span> 
              </Label>
              <Info className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="branchCode"
                value={formData.branchCode}
                onChange={(e) => handleInputChange('branchCode', e.target.value)}
                className="flex-1"
                readOnly
              />
              <Button type="button" variant="outline" size="default" onClick={() => handleInputChange('branchCode', `HTL-${Math.floor(Math.random() * 100000)}`)}>
                Edit
              </Button>
            </div>
            <p className="text-xs text-gray-500">This name will be displayed to customers</p>
          </div>

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Logo/Cover Image <span className="text-gray-400">(Optional)</span>
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">Drag and drop an image here, or</p>
                  <Button type="button" variant="ghost" size="sm" onClick={() => document.getElementById('fileInput')?.click()}>
                    Browse Files
                  </Button>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-gray-500">JPG, PNG OR GIF • Max 5MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 rounded-lg shadow- border p-8 bg-white h-max">
          {/* Hotel Classification */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Hotel Classification</h3>
            
            {/* Hotel Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Hotel Type</Label>
              <Select value={formData.hotelType} onValueChange={(value) => handleInputChange('hotelType', value)}>
                <SelectTrigger className="w-full flex-1 flex-grow items-stretch">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Resort">Resort</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hotel Category */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Hotel category</Label>
              <div className="flex gap-2">
                {(['Standard', 'Luxury', 'Business'] as HotelCategory[]).map((category) => (
                  <Button
                    key={category}
                    type="button"
                    variant={formData.hotelCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategorySelect(category)}
                    className={`px-4 py-2 ${
                      formData.hotelCategory === category
                        ? 'bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-100'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}