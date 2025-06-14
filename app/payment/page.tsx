"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Checkbox } from "@/app/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function PaymentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePayClick = async () => {
    setIsLoading(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4 md:px-6 md:py-6">
      <div className="max-w-md mx-auto">
        <Card className="border border-gray-200">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">Make Payment</CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* Payment Method Tabs */}
            <div className="flex gap-1 mb-6">
              <Button
                variant="outline"
                className="flex-1 h-7 text-xs border border-teal-600 text-teal-600 bg-teal-50 font-medium"
              >
                Card Payment
              </Button>
              <Button variant="ghost" className="flex-1 h-7 text-xs text-gray-600 font-medium">
                Bank Transfer
              </Button>
              <Button variant="ghost" className="flex-1 h-7 text-xs text-gray-600 font-medium">
                Paystack
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName" className="text-sm font-medium text-gray-900 mb-1 block">
                    Name on Card
                  </Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    className="h-9 text-sm border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-900 mb-1 block">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    className="h-9 text-sm border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-1 block">Expiry Date</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="MM/YY" className="h-9 text-sm border-gray-300 focus:border-teal-500" />
                    <Input placeholder="CVV" className="h-9 text-sm border-gray-300 focus:border-teal-500" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900 mb-1 block">
                    Email Address (For receipt)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-9 text-sm border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox id="saveCard" className="w-4 h-4" />
                  <Label htmlFor="saveCard" className="text-sm text-gray-700">
                    Save card for future reservations
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <Button variant="outline" className="w-1/3 h-11 text-sm font-medium border-gray-300">
                Exit
              </Button>
              <Button
                className="w-2/3 h-11 text-sm font-medium bg-teal-700 hover:bg-teal-800"
                onClick={handlePayClick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  "Pay ₦42,000 now"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
