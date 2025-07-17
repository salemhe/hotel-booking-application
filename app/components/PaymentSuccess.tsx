"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ReservationDetails {
  restaurant: string;
  address: string;
  reservationId: string;
  date: string;
  guests: number;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  paymentTime: string;
}

interface PaymentSuccessProps {
  reservationDetails: ReservationDetails;
  onGetDirections: () => void;
  onDone: () => void;
  showMealSelection?: boolean;
}

export default function PaymentSuccess({
  reservationDetails,
  onGetDirections,
  onDone,
  showMealSelection = false,
}: PaymentSuccessProps) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg p-6">
      {/* Success Icon */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {showMealSelection
            ? "Reservation Completed Successfully"
            : "Your reservation is confirmed & your meal has been paid"}
        </h2>
        <p className="text-gray-600 text-sm">
          {showMealSelection
            ? "Thank you for completing your reservation process, we look forward to seeing you"
            : "Your pre-selected meals have been confirmed for your upcoming reservation"}
        </p>
      </div>

      {/* Reservation Details */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">
            Reservation Details
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Restaurant</span>
              <div className="text-right">
                <div className="font-medium">
                  {reservationDetails.restaurant}
                </div>
                <div className="text-gray-500">
                  {reservationDetails.address}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">{reservationDetails.date}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Guests</span>
              <span className="font-medium">
                {reservationDetails.guests} Guests
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Reservation ID</span>
              <span className="font-medium">
                {reservationDetails.reservationId}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Selection (if applicable) */}
      {showMealSelection && reservationDetails.items && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Your Meal Selection
            </h3>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Appetizer</h4>
                {reservationDetails.items
                  .filter((item) => item.name.includes("Calamari Fritti"))
                  .map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-500">
                          Add extra lemon on the side
                        </div>
                      </div>
                      <span className="text-gray-600">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Main Courses</h4>
                {reservationDetails.items
                  .filter((item) => !item.name.includes("Calamari Fritti"))
                  .map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-500">
                          Add extra lemon on the side
                        </div>
                      </div>
                      <span className="text-gray-600">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Desserts</h4>
                {reservationDetails.items
                  .filter((item) => item.name.includes("Calamari Fritti"))
                  .map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-500">
                          Add extra lemon on the side
                        </div>
                      </div>
                      <span className="text-gray-600">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Special Request Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5 mr-2">
                  <span className="text-yellow-800 text-xs">!</span>
                </div>
                <p className="text-sm text-yellow-800">
                  <strong>Special Request:</strong> One guest is allergic to
                  garlic. Please consider this
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Details (if not meal selection) */}
      {!showMealSelection && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Your Selection (2 items)
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>2x Mezze Platter</span>
                <span>₦30,000</span>
              </div>
              <div className="flex justify-between">
                <span>1x Chicken Springrolls</span>
                <span>₦12,000</span>
              </div>
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-semibold">
                <span>Amount paid</span>
                <span>₦{reservationDetails.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-green-600 mt-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>
                  Paid • Payment made at 8:00 am,{" "}
                  {reservationDetails.paymentTime}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-blue-800">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs">✓</span>
            </div>
            <span>
              You will receive a confirmation email with your reservation{" "}
              {showMealSelection ? "details" : "and meal details"}
            </span>
          </div>
          <div className="flex items-center text-sm text-blue-800">
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs">⏰</span>
            </div>
            <span>Please, arrive 10 mins early</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button variant="outline" onClick={onGetDirections} className="flex-1">
          Get Direction
        </Button>
        <Button
          onClick={onDone}
          className="flex-1 bg-teal-600 hover:bg-teal-700"
        >
          Done
        </Button>
      </div>
    </div>
  );
}
