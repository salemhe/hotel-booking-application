"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  CheckCircle,
  Calendar,
  Clock,
  Users,
  MapPin,
  Mail,
  Info
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '42000';
  const method = searchParams.get('method') || 'card';
  
  const [reservationId] = useState('RES12345');

  // Mock reservation data
  const reservationData = {
    restaurant: 'Kapadoccia Restaurant',
    address: '16, Idowu Taylor Street, Victoria Island 101241 Nigeria',
    date: 'May 29, 2025',
    time: '7:30 PM',
    guests: 4,
    meals: [
      { name: 'Meze Platter', quantity: 2, price: 30000 },
      { name: 'Chicken Springrolls', quantity: 1, price: 12000 },
      { name: 'Chicken Springrolls', quantity: 1, price: 12000 },
      { name: 'Chicken Springrolls', quantity: 1, price: 12000 }
    ]
  };

  const handleCreateNewReservation = () => {
    router.push('/');
  };

  const handleViewReservations = () => {
    router.push('/bookings');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {method === 'card' 
              ? 'Your reservation is confirmed & your meal has been paid'
              : 'Reservation Completed Successfully'
            }
          </h1>
          <p className="text-gray-600">
            {method === 'card' 
              ? 'Your pre-selected meals have been confirmed for your upcoming reservation'
              : 'Thank you for completing your reservation process, we look forward to seeing you'
            }
          </p>
        </div>

        {/* Reservation Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Reservation Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-700">Restaurant</h4>
                  <p className="font-semibold">{reservationData.restaurant}</p>
                  <p className="text-sm text-gray-600">{reservationData.address}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Date & Time</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{reservationData.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{reservationData.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-700">Reservation ID</h4>
                  <p className="font-semibold">#{reservationId}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Guests</h4>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{reservationData.guests} Guests</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details (if meals were pre-selected) */}
        {method === 'card' && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Your Selection (2 items)</h3>
              
              <div className="space-y-3">
                {reservationData.meals.map((meal, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{meal.quantity}x {meal.name}</p>
                    </div>
                    <p className="font-medium">#{meal.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Amount paid</span>
                  <span className="font-bold text-xl text-green-600">#{parseInt(amount).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Confirmation (if paid) */}
        {method === 'card' && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-800">Paid</p>
                <p className="text-sm text-green-700">Payment made at 8:00 am, May 28, 2025</p>
              </div>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8">
          <div className="flex items-start">
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-700">
                  You will receive a confirmation email with your reservation {method === 'card' ? 'and meal ' : ''}details
                </span>
              </div>
              <div className="flex items-center">
                <Info className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-blue-700">
                  Please, arrive 10 mins early
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={handleViewReservations}
            className="w-full"
          >
            Reversation List
          </Button>
          <Button 
            onClick={handleCreateNewReservation}
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            Create New Reservation
          </Button>
        </div>

        {/* Additional Info for meal selection */}
        {method === 'card' && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Your Meal Selection</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Appetizer</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calamari Fritti</span>
                      <span>Qty: 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calamari Fritti</span>
                      <span>Qty: 1</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Main Courses</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calamari Fritti</span>
                      <span>Qty: 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calamari Fritti</span>
                      <span>Qty: 1</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Desserts</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Calamari Fritti</span>
                      <span>Qty: 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Calamari Fritti</span>
                      <span>Qty: 1</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Special Request */}
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mt-4">
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                  <p className="text-sm text-yellow-700">
                    Special Request: One guest is allergic to garlic. Please consider this
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
