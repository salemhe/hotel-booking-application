"use client";

import { ArrowLeft, Banknote, AlertTriangle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { useRouter } from "next/navigation";

export default function PrePaymentPage() {
  const router = useRouter();

  const handlePrepayClick = () => {
    router.push("/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Payment</span>
          </div>
          <div className="text-sm text-gray-600">Step 3 of 4</div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Thank you for your meal selection
          </h1>
          <p className="text-gray-600 text-sm">
            Your pre-selected meals have been confirmed for your upcoming
            reservation
          </p>
        </div>

        {/* Pre-payment Info - With background */}
        <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-xl p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="">
              <Banknote className="size-10 text-[#0A6C6D]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Would you like to pre-pay for your meal?
              </h3>
              <p className="text-sm text-gray-600">
                Payment is optional, but helps the restaurant prepare your meal
                ahead of time. Your payment is secure & refundable according to
                the restaurant&apos;s cancellation policy.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="">
              <h3 className="font-semibold text-gray-900 mb-3">
                Choose your payment option
              </h3>
              <p className="text-gray-900 mb-4 font-bold">
                <span className="">Amount to pay:</span> ₦42,000
              </p>

              <div className="flex gap-3">
                <Button
                  className="flex-1 h-10 text-sm font-medium px-6 bg-[#0A6C6D] rounded-xl hover:bg-[#0A6C6D]/90 text-white"
                  onClick={handlePrepayClick}
                >
                  Prepay Now
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-sm font-medium px-6 rounded-xl border-gray-300"
                >
                  Pay at Restaurant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            {/* Starters with background */}
            <div className="bg-gray-50 rounded-xl border mb-4">
              <h4 className="font-medium text-gray-700 p-3">Starters</h4>
              <hr className="border-gray-200" />
              <div className="space-y-3 p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">
                      Add extra lemon on the side
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Caprese Salad</p>
                    <p className="text-sm text-gray-600">No onions</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Courses with background - space maintained, no line between */}
            <div className="bg-gray-50 rounded-xl border mb-4">
              <h4 className="font-medium text-gray-700 p-3">Main Courses</h4>
              <hr className="border-gray-200" />
              <div className="space-y-3 p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Spaghetti Carbonera
                    </p>
                    <p className="text-sm text-gray-600">No special request</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">
                      Add extra lemon on the side
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desserts with background - space maintained, no line between */}
            <div className="bg-gray-50 rounded-xl border mb-4">
              <h4 className="font-medium text-gray-700 p-3">Desserts</h4>
              <hr className="border-gray-200" />
              <div className="space-y-3 p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">
                      Add extra lemon on the side
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">
                      Add extra lemon on the side
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">
                <span className="font-medium">Special Request:</span> One guest
                is allergic to garlic. Please consider this
              </p>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Sub Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ₦42,000
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
