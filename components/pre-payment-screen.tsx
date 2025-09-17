import { ArrowLeft, Banknote, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PrePaymentScreen() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Payment</span>
          </div>
          <div className="text-sm text-gray-600">Step 3 of 4</div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">Thank you for your meal selection</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Your pre-selected meals have been confirmed for your upcoming reservation
          </p>
        </div>

        {/* Pre-payment Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Banknote className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Would you like to pre-pay for your meal?</h3>
                <p className="text-sm text-gray-600">
                  Payment is optional, but helps the restaurant prepare your meal ahead of time. Your payment is secure
                  & refundable according to the restaurant&apos;s cancellation policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Options */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Choose your payment option</h3>
          <p className="text-gray-900 mb-4">
            <span className="font-medium">Amount to pay:</span> ₦42,000
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button className="bg-teal-700 hover:bg-teal-800 h-12">Prepay Now</Button>
            <Button variant="outline" className="h-12">
              Pay at Restaurant
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            {/* Starters */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Starters</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Caprese Salad</p>
                    <p className="text-sm text-gray-600">No onions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Courses */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Main Courses</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Spaghetti Carbonera</p>
                    <p className="text-sm text-gray-600">No special request</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desserts */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Desserts</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">Calamari Fritti</p>
                    <p className="text-sm text-gray-600">Add extra lemon on the side</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₦15,000</p>
                    <p className="text-sm text-gray-600">Qty: 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">
                <strong>Special Request:</strong> One guest is allergic to garlic. Please consider this
              </p>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Sub Total</span>
                <span className="text-lg font-semibold text-gray-900">₦42,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
