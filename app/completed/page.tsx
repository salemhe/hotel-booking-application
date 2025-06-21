"use client"

import { Check, Mail, Clock } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { useRouter } from "next/navigation"

export default function CompletedPage() {
  const router = useRouter()

  const handleDoneClick = () => {
    router.push("/pre-payment")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-[#37703F] rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-[#111827] mb-2">Reservation Completed Successfully</h1>
          <p className="text-[#6B7280] text-sm">
            Thank you for completing your reservation process, we look forward to seeing you
          </p>
        </div>

        {/* Reservation Details */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="">
            <h2 className="text-lg font-semibold text-gray-900 p-4">Reservation Details</h2>

            {/* HR tag after Reservation Details */}
            <hr className="border-gray-200 mb-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 px-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                <p className="font-medium text-gray-900">May 29, 2025 • 7:30 PM</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Guests</p>
                <p className="font-medium text-gray-900">4 Guests</p>
              </div>
            </div>
          </div>

          {/* Line after Reservation Details */}
          <div className="border-t border-gray-200"></div>
        </div>

        {/* Info Cards - Changed to green background */}
        <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-lg p-4 mb-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                You will receive a confirmation email with your reservation details
              </p>  
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#0A6C6D] mt-0.5 flex-shrink-0" />
              <p className="text-sm">Please, arrive 10 mins early</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 h-10 text-sm rounded-xl font-medium px-6 border-gray-300">
            Get Direction
          </Button>
          <Button
            className="flex-1 h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-teal-800"
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
