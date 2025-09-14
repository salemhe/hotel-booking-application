import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function PaymentForm() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">Make Payment</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Method Tabs */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-teal-600 text-teal-600 bg-teal-50">
                Card Payment
              </Button>
              <Button variant="ghost" className="flex-1 text-gray-600">
                Bank Transfer
              </Button>
              <Button variant="ghost" className="flex-1 text-gray-600">
                Paystack
              </Button>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardName" className="text-gray-900 font-medium">
                    Name on Card
                  </Label>
                  <Input id="cardName" placeholder="John Doe" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="cardNumber" className="text-gray-900 font-medium">
                    Card Number
                  </Label>
                  <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="mt-1" />
                </div>

                <div>
                  <Label className="text-gray-900 font-medium">Expiry Date</Label>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVV" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-900 font-medium">
                    Email Address (For receipt)
                  </Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="mt-1" />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="saveCard" />
                  <Label htmlFor="saveCard" className="text-sm text-gray-700">
                    Save card for future reservations
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1">
                Exit
              </Button>
              <Button className="flex-1 bg-teal-700 hover:bg-teal-800">Pay ₦42,000 now</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
