import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, MapPin, Edit2, Star } from 'lucide-react';

const BookingDetails = () => {
  const [selectedPayment, setSelectedPayment] = useState('full');

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
          <h1 className="text-lg font-semibold text-gray-900">Booking Details</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Step 1 of 4</span>
          <div className="w-16 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      <div className="p-6">
        {/* Hotel Information */}
        <div className="flex gap-4 mb-8">
          <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <Image 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=160&fit=crop" 
              alt="Eko Hotel & Suites" 
              width={96} height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Eko Hotel & Suites, Lagos, Nigeria</h2>
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>16, Idowu Taylor Street, Victoria Island</span>
            </div>
            <div className="text-sm text-gray-600">101241 Nigeria</div>
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">4.8 (1,000 reviews)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Booking Details</h3>
            
            {/* Date and Guest Selection */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Check In Date</div>
                <div className="font-medium text-gray-900 flex items-center justify-between">
                  23rd May, 2025
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Check Out Date</div>
                <div className="font-medium text-gray-900 flex items-center justify-between">
                  25th May, 2025
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Guest</div>
                <div className="font-medium text-gray-900 flex items-center justify-between">
                  2 people
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Room Summary */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Room Summary</h4>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Room name</div>
                    <div className="font-medium text-gray-900">Superior Deluxe Room</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Price per night</div>
                    <div className="font-medium text-gray-900">₦150,000</div>
                  </div>
                  <div></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Bed Type</div>
                    <div className="font-medium text-gray-900">1 master bed</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Guests Allowed</div>
                    <div className="font-medium text-gray-900">2</div>
                  </div>
                  <div></div>
                </div>
                <div className="mt-4 text-sm text-teal-600">
                  Free cancellation until 24h before check-in
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-900 mb-2">Special Request (Optional)</h4>
              <textarea 
                placeholder="Let us know if you have any special request"
                className="w-full border border-gray-200 rounded-lg p-4 text-sm text-gray-600 resize-none h-24"
              />
            </div>
          </div>

          {/* Right Column - Payment Plan */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Payment Plan</h3>
            
            {/* Payment Options */}
            <div className="space-y-4 mb-8">
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedPayment === 'full' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPayment('full')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Pay ₦150,000 now</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPayment === 'full' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                  }`}>
                    {selectedPayment === 'full' && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedPayment === 'partial' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPayment('partial')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Pay part now, rest later</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPayment === 'partial' ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                  }`}>
                    {selectedPayment === 'partial' && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Pay 75,000 now, and 75,000 on 23rd may, 2025. No extra fees
                </div>
              </div>
            </div>

            {/* Your Total */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Your Total</h4>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 mb-2">Price Details</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">₦150,000 / 2 nights</span>
                  <span className="font-medium text-gray-900">₦300,000</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Sub Total</span>
                  <span className="font-semibold text-gray-900">₦300,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Hotel Details Page
          </button>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;