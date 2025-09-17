"use client"

import { Check, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ReservationConfirmation() {
  const router = useRouter()

  const handleDoneClick = () => {
    router.push("/completed")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
            Your reservation is confirmed & your meal has been paid
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Your pre-selected meals have been confirmed for your upcoming reservation
          </p>
        </div>

        {/* Reservation Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                <p className="font-medium text-gray-900">Kapadoccia Restaurant</p>
                <p className="text-sm text-gray-600">16, Idowu Taylor Street, Victoria Island 101241 Nigeria</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                <p className="font-medium text-gray-900">#RES12345</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                <p className="font-medium text-gray-900">May 29, 2025 • 7:30 PM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Guests</p>
                <p className="font-medium text-gray-900">4 Guests</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Selection (2 items)</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-900">2x Meze Platter</span>
                <span className="font-medium text-gray-900">₦30,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-900">1x Chicken Springrolls</span>
                <span className="font-medium text-gray-900">₦12,000</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Amount paid</span>
                <span className="text-lg font-semibold text-green-700">₦42,000</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-green-600">Paid</span>
                <span className="text-gray-600 text-sm">• Payment made at 8:00 am, May 28, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="space-y-3 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 text-sm">
              You will receive a confirmation email with your reservation and meal details
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 text-sm">Please, arrive 10 mins early</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 h-12">
            Get Direction
          </Button>
          <Button className="flex-1 bg-teal-700 hover:bg-teal-800 h-12" onClick={handleDoneClick}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
