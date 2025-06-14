import { Check, Mail, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"

export default function DetailedReservation() {
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
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Reservation Completed Successfully</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Thank you for completing your reservation process, we look forward to seeing you
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

        {/* Meal Selection */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Meal Selection</h2>

            {/* Appetizer */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Appetizer</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    Qty: 2
                  </Badge>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    Qty: 1
                  </Badge>
                </div>
              </div>
            </div>

            {/* Main Courses */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Main Courses</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    Qty: 2
                  </Badge>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    Qty: 1
                  </Badge>
                </div>
              </div>
            </div>

            {/* Desserts */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Desserts</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    Qty: 2
                  </Badge>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <Badge variant="secondary" className="bg-gray-100">
                    Qty: 1
                  </Badge>
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">
                <strong>Special Request:</strong> One guest is allergic to garlic. Please consider this
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="space-y-3 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 text-sm">You will receive a confirmation email with your reservation details</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-blue-800 text-sm">Please, arrive 10 mins early</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1">
            Get Direction
          </Button>
          <Button className="flex-1 bg-teal-700 hover:bg-teal-800">Done</Button>
        </div>
      </div>
    </div>
  )
}
