"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function ReservationConfirmationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
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
        <Card>
          <CardHeader>
            <CardTitle>Reservation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Restaurant</h4>
                <p className="text-gray-900">Kapadoccia Restaurant</p>
                <p className="text-sm text-gray-600">
                  16, Idowu Taylor Street, Victoria Island 101...
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Reservation ID</h4>
                <p className="text-gray-900">#RES12345</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Date & Time</h4>
                <p className="text-gray-900">May 29, 2025 • 7:30 PM</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Guests</h4>
                <p className="text-gray-900">4 Guests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Selection (2 items)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>2x Meze Platter</span>
                <span className="font-medium">#30,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>1x Chicken Springrolls</span>
                <span className="font-medium">#12,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>1x Chicken Springrolls</span>
                <span className="font-medium">#12,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span>1x Chicken Springrolls</span>
                <span className="font-medium">#12,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Paid */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Amount paid</span>
              <span className="text-green-600">#42,000</span>
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
            Reservation List
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
