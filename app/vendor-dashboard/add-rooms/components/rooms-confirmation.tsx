'use client';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Separator } from '@/app/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Amenities } from '@/public/icons/icons';
import {
   Bed,
   Building,
   Camera,
   Car,
   Coffee,
   Edit,
   Home,
   Mail,
   MapPin,
   MoreHorizontal,
   Phone,
   Users,
   Wifi
} from 'lucide-react';
import React, { useState } from 'react';

interface HotelInfo {
  name: string;
  category: string;
  type: string;
  location: string;
  address: string;
  branchCode: string;
  contactEmail: string;
  contactPhone: string;
}

interface RoomType {
  id: string;
  name: string;
  category: string;
  price: number;
  adults: number;
  children: number;
  rooms: number;
  amenities: string[];
  photoCount: number;
}

interface BookingSettings {
  checkInTime: string;
  checkOutTime: string;
  bookingLeadTime: string;
  maximumBookingWindow: string;
  cancellationPolicy: string;
  paymentOptions: string[];
  paymentInstructions: string;
  confirmed: boolean;
}

const initialHotelInfo: HotelInfo = {
  name: "Grand Marine Hotel",
  category: "Luxury five Star Hotel",
  type: "Apartment",
  location: "Nigeria",
  address: "123 Boulevard Centre, Ikeja, Lagos State",
  branchCode: "GM- 234556",
  contactEmail: "Grandmarine@gmail.com",
  contactPhone: "+234 70 123 4567"
};

const initialRoomTypes: RoomType[] = [
  {
    id: "deluxe",
    name: "Deluxe Room",
    category: "Luxury five Star Hotel",
    price: 150000,
    adults: 2,
    children: 1,
    rooms: 10,
    amenities: ["Free Breakfast", "Free Parking", "City View", "Free WiFi"],
    photoCount: 3
  },
  {
    id: "executive",
    name: "Executive Suite",
    category: "Luxury five Star Hotel",
    price: 250000,
    adults: 2,
    children: 1,
    rooms: 10,
    amenities: ["Free Breakfast", "Free Parking", "City View", "Free WiFi"],
    photoCount: 3
  }
];

const initialBookingSettings: BookingSettings = {
  checkInTime: "From 12:00 PM",
  checkOutTime: "Until 2:00 PM",
  bookingLeadTime: "At least 24 hours in advance",
  maximumBookingWindow: "365 days in advance",
  cancellationPolicy: "Free cancellation up to 48 hours before check-in. Cancellations made within 48 hours of check-in are subject to a charge equal to 100% of the first night's stay.",
  paymentOptions: ["Visa", "Mastercard", "American Express", "Cash"],
  paymentInstructions: "For cash payments, a security deposit of ₦100 is required upon check-in. This will be refunded upon check-out after room inspection.",
  confirmed: true
};

const amenityIcons: { [key: string]: React.ReactNode } = {
  "Free Breakfast": <Coffee className="w-4 h-4" />,
  "Free Parking": <Car className="w-4 h-4" />,
  "City View": <Building className="w-4 h-4" />,
  "Free WiFi": <Wifi className="w-4 h-4" />
};

export default function HotelBookingInterface() {
  const [hotelInfo] = useState<HotelInfo>(initialHotelInfo);
  const [roomTypes] = useState<RoomType[]>(initialRoomTypes);
  const [bookingSettings] = useState<BookingSettings>(initialBookingSettings);

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Hotel Information Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b space-y-0 pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">Hotel Information</CardTitle>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{hotelInfo.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{hotelInfo.category}</p>
                
                <div className="flex flex-wrap gap-y-4 gap-x-14">
                  {/* <div className="space-y-3"> */}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hotel Type</label>
                      <p className="text-sm text-gray-900">{hotelInfo.type}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-500">Branch Code</label>
                      <p className="text-sm text-gray-900">{hotelInfo.branchCode}</p>
                    </div>
                  
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Email</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {hotelInfo.contactEmail}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {hotelInfo.contactPhone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {hotelInfo.location}
                      </p>
                    </div>
                     <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-sm text-gray-900">{hotelInfo.address}</p>
                    </div>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Type Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">Room Type</CardTitle>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {roomTypes.map((room) => (
              <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="relative w-20 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex-shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded flex items-center">
                      <Camera className="w-3 h-3 mr-1" />
                      +{room.photoCount} more photos
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{room.name}</h4>
                        <p className="text-sm text-gray-600">{room.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{formatPrice(room.price)}</p>
                        <p className="text-sm text-gray-500">/night</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {room.adults} Adults
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {room.children} Child
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center">
                        <Home className="w-4 h-4 mr-1" />
                        {room.rooms} rooms
                      </Badge>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center">
                            {amenityIcons[amenity]}
                            <span className="ml-1">{amenity}</span>
                          </Badge>
                        ))}
                        <Badge variant="outline" className="text-gray-600">
                          <MoreHorizontal className="w-4 h-4 mr-1" />
                          3 more
                        </Badge>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 p-0">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Booking & Policy Settings Section */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center border-b justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-medium text-gray-900">Booking & Policy Settings</CardTitle>
            <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Check-In Time</label>
                  <p className="text-sm text-gray-900 mt-1">{bookingSettings.checkInTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Booking Lead Time</label>
                  <p className="text-sm text-gray-900 mt-1">{bookingSettings.bookingLeadTime}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Check-Out Time</label>
                  <p className="text-sm text-gray-900 mt-1">{bookingSettings.checkOutTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Maximum Booking Window</label>
                  <p className="text-sm text-gray-900 mt-1">{bookingSettings.maximumBookingWindow}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Cancellation Policy</label>
              <p className="text-sm text-gray-900 leading-relaxed">{bookingSettings.cancellationPolicy}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-gray-500 mb-3 block">Payment Options</label>
              <div className="flex flex-wrap gap-3 mb-4">
                {bookingSettings.paymentOptions.map((option) => (
                  <Badge key={option} variant="outline" className="px-3 py-1.5 flex item-center justify-center text-sm">
                     {option === "Cash" && <Amenities color="#067463"/>}
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Payment Instructions</label>
              <p className="text-sm text-gray-900 leading-relaxed">{bookingSettings.paymentInstructions}</p>
            </div>
            
            {/* <Separator /> */}
            
            <div className="flex items-start space-x-3 p-4  rounded-lg border ">
               <Checkbox
                    className=""
                    id="payAtHotel"
                  //   checked={formData.paymentOptions.payAtHotel}
                  //   onCheckedChange={(checked) => handlePaymentOptionChange('payAtHotel', checked as boolean)}
                  />
                  <Label htmlFor="payAtHotel" className="text-sm text-gray-700">
                     I confirm all hotel details are correct and I understand that once published, this hotel will be visible to customers for booking.
                  </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}