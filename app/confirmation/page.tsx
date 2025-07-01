"use client"

import { Check, Mail, Clock } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { useRouter } from "next/navigation"

export default function ConfirmationPage() {
  const router = useRouter()

  const handleDoneClick = () => {
    router.push("/bookings")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#37703F1A] rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#37703F] rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-[22px] font-bold text-[#111827] mb-2">
            Your reservation is confirmed & your meal has been paid
          </h1>
          <p className="text-gray-600">
            Your pre-selected meals have been confirmed for your upcoming reservation
          </p>
        </div>

        {/* Reservation Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                <p className="text-base font-medium text-gray-900 mb-1">Kapadoccia Restaurant</p>
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

        {/* Space between Reservation Details and Your Selection */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Selection (2 items)</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">2x Meze Platter</span>
                <span className="font-medium text-gray-900">₦30,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">1x Chicken Springrolls</span>
                <span className="font-medium text-gray-900">₦12,000</span>
              </div>
            </div>

            {/* Space/padding/margin before Amount paid */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900">Amount paid</span>
                <span className="text-lg font-semibold text-[#37703F]">₦42,000</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#37703F] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-[#37703F]">Paid</span>
                <span className="text-gray-600 text-sm">• Payment made at 8:00 am, May 28, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards - Changed to green background */}
        <div className="bg-[#E9EBF3] border border-[#B9C2DB] rounded-lg p-4 mb-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
              <p className=" text-sm">
                You will receive a confirmation email with your reservation and meal details
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
              <p className=" text-sm">Please, arrive 10 mins early</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-10 text-sm font-medium rounded-xl px-6 border-gray-300">
            Get Direction
          </Button>
          <Button
            className="flex-1 h-10 text-sm font-medium px-6 rounded-xl bg-[#0A6C6D] hover:bg-teal-800"
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
