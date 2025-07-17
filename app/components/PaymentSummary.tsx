"use client";

import { useState } from "react";
import { ArrowLeft, AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface PaymentSummaryProps {
  reservationDetails: {
    restaurant: string;
    date: string;
    time: string;
    guests: number;
  };
  orderItems: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    quantity: number;
    category: string;
  }>;
  specialRequests?: string;
  onBack: () => void;
  onPrepayNow: () => void;
  onPayAtRestaurant: () => void;
}

export default function PaymentSummary({
  reservationDetails,
  orderItems,
  specialRequests,
  onBack,
  onPrepayNow,
  onPayAtRestaurant,
}: PaymentSummaryProps) {
  const [currentStep] = useState("Step 3 of 4");

  const getSubtotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  const groupItemsByCategory = () => {
    const grouped: { [key: string]: typeof orderItems } = {};
    orderItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const groupedItems = groupItemsByCategory();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">Payment</span>
        </div>
        <Badge variant="secondary">{currentStep}</Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Thank you message */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Thank you for your meal selection
          </h2>
          <p className="text-gray-600 text-sm">
            Your pre-selected meals have been confirmed for your upcoming
            reservation
          </p>
        </div>

        {/* Pre-payment info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  Would you like to pre-pay for your meal?
                </p>
                <p className="text-blue-800">
                  Payment is optional, but helps the restaurant prepare your
                  meal ahead of time. Your payment is secure & refundable
                  according to the restaurant's cancellation policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment options */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">
            Choose your payment option
          </h3>
          <div className="space-y-3">
            <div className="text-sm">
              <span className="text-gray-600">Amount to pay: </span>
              <span className="font-semibold">
                ₦{getSubtotal().toLocaleString()}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onPrepayNow}
                className="bg-teal-600 hover:bg-teal-700"
              >
                Prepay Now
              </Button>
              <Button variant="outline" onClick={onPayAtRestaurant}>
                Pay at Restaurant
              </Button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-4">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-700 mb-3">{category}</h4>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {item.name}
                          </div>
                          {item.description && (
                            <div className="text-sm text-gray-500">
                              {item.description}
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-semibold">
                            ₦{item.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Special Request */}
            {specialRequests && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 mr-2" />
                  <div className="text-sm">
                    <span className="font-medium text-yellow-800">
                      Special Request:{" "}
                    </span>
                    <span className="text-yellow-700">{specialRequests}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Sub Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ₦{getSubtotal().toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
