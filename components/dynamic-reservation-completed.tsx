"use client"

import { Check, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useReservation } from "@/app/contexts/reservation-context"
import { LoadingSpinner } from "./loading-spinner"
import { PageTransition } from "./page-transition"
import { useState } from "react"

export default function DynamicReservationCompleted() {
  const router = useRouter()
  const { reservationData } = useReservation()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleDoneClick = async () => {
    setIsNavigating(true)
    // Simulate a short delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/pre-payment")
  }

  return (
    <PageTransition>
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
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Reservation Completed Successfully</h1>
            <p className="text-gray-600 text-sm md:text-base">
              Thank you for completing your reservation process, we look forward to seeing you
            </p>
          </div>

          {/* Reservation Details */}
          <Card className="mb-6 border border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reservation Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                  <p className="font-medium text-gray-900">{reservationData.restaurant.name}</p>
                  <p className="text-sm text-gray-600">{reservationData.restaurant.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Reservation ID</p>
                  <p className="font-medium text-gray-900">{reservationData.reservationId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {reservationData.date} • {reservationData.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Guests</p>
                  <p className="font-medium text-gray-900">{reservationData.guests} Guests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="space-y-3 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-blue-800 text-sm">
                You will receive a confirmation email with your reservation details
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
            <Button
              className="flex-1 bg-teal-700 hover:bg-teal-800 h-12"
              onClick={handleDoneClick}
              disabled={isNavigating}
            >
              {isNavigating ? <LoadingSpinner /> : "Done"}
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
