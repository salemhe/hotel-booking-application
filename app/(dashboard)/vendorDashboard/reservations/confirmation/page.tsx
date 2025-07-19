"use client";

import React from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReservationConfirmationPage() {
  const router = useRouter();

  const reservationDetails = {
    restaurant: "Kapadoccia Restaurant",
    address: "16, Idowu Taylor Street, Victoria Island 101241, Lagos",
    reservationId: "#RES12345",
    date: "May 29, 2025",
    time: "7:30 PM",
    guests: 4,
  };

  const selectedItems = [
    { name: "Mezze Platter", quantity: 2, price: 30000 },
    { name: "Chicken Springrolls", quantity: 1, price: 12000 },
    { name: "Chicken Springrolls", quantity: 1, price: 12000 },
    { name: "Chicken Springrolls", quantity: 1, price: 12000 },
  ];

  const totalAmount = 42000;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your reservation is confirmed & your meal has been paid
          </h1>
          <p className="text-gray-600">
            Your pre-selected meals have been confirmed for your upcoming
            reservation
          </p>
        </div>

        {/* Reservation Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Reservation Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Restaurant</h3>
                <p className="text-gray-600">{reservationDetails.restaurant}</p>
                <p className="text-gray-500 text-sm">
                  {reservationDetails.address}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  Reservation ID
                </h3>
                <p className="text-gray-600">
                  {reservationDetails.reservationId}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">Date & Time</h3>
                <p className="text-gray-600">
                  {reservationDetails.date} • {reservationDetails.time}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-1">Guests</h3>
                <p className="text-gray-600">
                  {reservationDetails.guests} Guests
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Your Selection (2 items)
            </h2>

            <div className="space-y-3">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex-1">
                    <span className="font-medium">
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                  <div className="font-medium">
                    ₦{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Amount paid</span>
                <span>₦{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/vendorDashboard/reservations")}
          >
            Reversation List
          </Button>
          <Button
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => router.push("/vendorDashboard/reservations/new")}
          >
            Create New Reservation
          </Button>
        </div>
      </div>
    </div>
  );
}
