"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  ArrowLeft,
  CreditCard,
  Building2,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('prepay');
  
  const totalAmount = searchParams.get('totalPrice') || '42000';

  const handlePaymentContinue = () => {
    if (selectedPaymentMethod === 'prepay') {
      router.push(`/payment-details?amount=${totalAmount}&method=prepay`);
    } else {
      router.push(`/payment-success?amount=${totalAmount}&method=restaurant`);
    }
  };

  // Parse selected items if available
  const selectedItemsStr = searchParams.get('selectedItems');
  const selectedItems = selectedItemsStr ? JSON.parse(selectedItemsStr) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Payment
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Reservation Details</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Preselect meal</span>
            </div>
            <div className="h-px w-16 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-teal-600">Payment</span>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Thank you for your meal selection</h1>
          <p className="text-gray-600">Your pre-selected meals have been confirmed for your upcoming reservation</p>
        </div>

        {/* Pre-pay Option */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <Smartphone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-800 mb-1">Would you like to pre-pay for your meal?</h4>
              <p className="text-sm text-blue-700">
                Payment is optional but helps the restaurant prepare your meal ahead of time. Your payment is
                secure & refundable according to the restaurant's cancellation policy.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Choose your payment option</h3>
            <p className="text-gray-600 mb-6">Amount to pay: ₦{parseInt(totalAmount).toLocaleString()}</p>

            <div className="space-y-4">
              {/* Prepay Now */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPaymentMethod === 'prepay' 
                    ? 'border-teal-600 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod('prepay')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mr-4">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Prepay Now</h4>
                      <p className="text-sm text-gray-600">Secure payment with card or bank transfer</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPaymentMethod === 'prepay' 
                      ? 'border-teal-600 bg-teal-600' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === 'prepay' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pay at Restaurant */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPaymentMethod === 'restaurant' 
                    ? 'border-teal-600 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPaymentMethod('restaurant')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mr-4">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Pay at Restaurant</h4>
                      <p className="text-sm text-gray-600">Pay when you arrive at the restaurant</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPaymentMethod === 'restaurant' 
                      ? 'border-teal-600 bg-teal-600' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPaymentMethod === 'restaurant' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            
            {selectedItems.length > 0 ? (
              <div className="space-y-3">
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700 mb-2">Starters</h4>
                  {selectedItems
                    .filter((item: any) => item.category === 'Starters')
                    .map((item: any) => (
                      <div key={item._id} className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.specialRequest && (
                            <p className="text-sm text-gray-600">{item.specialRequest}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-700 mb-2">Main Courses</h4>
                  {selectedItems
                    .filter((item: any) => item.category === 'Main Course')
                    .map((item: any) => (
                      <div key={item._id} className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.specialRequest && (
                            <p className="text-sm text-gray-600">{item.specialRequest}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Special Request Warning */}
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                    <p className="text-sm text-yellow-700">
                      Special Request: One guest is allergic to garlic. Please consider this
                    </p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Sub Total</span>
                    <span className="font-bold text-xl">₦{parseInt(totalAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No items selected</p>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button 
            onClick={handlePaymentContinue}
            className="bg-teal-600 hover:bg-teal-700 min-w-48"
          >
            {selectedPaymentMethod === 'prepay' 
              ? `Pay ₦${parseInt(totalAmount).toLocaleString()} now` 
              : 'Complete Reservation'
            }
          </Button>
        </div>
      </div>
    </div>
  );
}
