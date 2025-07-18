"use client";

import React from "react";
import { CheckCircle, Clock, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardContent className="p-8">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Your reservation is confirmed & your meal has been paid
              </h1>
              <p className="text-gray-600">
                Your pre-selected meals have been confirmed for your upcoming
                reservation
              </p>
            </div>

            {/* Reservation Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Reservation Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Restaurant
                      </h3>
                      <p className="text-gray-900">Kapadoccia Restaurant</p>
                      <p className="text-sm text-gray-600">
                        16, Idowu Taylor Street, Victoria Island 101241 Nigeria
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Date & Time
                      </h3>
                      <p className="text-gray-900">May 28, 2025 • 7:30 PM</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Reservation ID
                      </h3>
                      <p className="text-gray-900">#RE51234S</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700">
                        Guests
                      </h3>
                      <p className="text-gray-900">4 Guests</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meal Selection */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Selection (2 items)
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-900">2x Mezze Platter</span>
                    <span className="font-medium">₦30,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-900">
                      1x Chicken Springrolls
                    </span>
                    <span className="font-medium">₦12,000</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Amount paid</span>
                    <span>₦42,000</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600 font-medium">Paid</span>
                    <span className="text-gray-600">
                      • Payment made at 8:00 am, May 28, 2025
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Boxes */}
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      You will receive a confirmation email with your
                      reservation and meal details
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      Please, arrive 10 mins early
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/restaurants")}
                >
                  Get Direction
                </Button>
                <Button
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  onClick={() => router.push("/bookings")}
                >
                  Done
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
