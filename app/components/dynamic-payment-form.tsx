"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Checkbox } from "@/app/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useReservation, type CardDetails } from "@/app/contexts/reservation-context"
import { LoadingSpinner } from "./loading-spinner"
import { PageTransition } from "./page-transition"
import { AlertCircle } from "lucide-react"

type FormErrors = {
  cardName?: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  email?: string
}

export default function DynamicPaymentForm() {
  const router = useRouter()
  const { reservationData, isLoading, error, processPayment } = useReservation()

  const [formData, setFormData] = useState<CardDetails>({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    email: "",
    saveCard: false,
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user types
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.cardName.trim()) {
      errors.cardName = "Name on card is required"
    }

    if (!formData.cardNumber.trim()) {
      errors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      errors.cardNumber = "Card number must be 16 digits"
    }

    if (!formData.expiryDate.trim()) {
      errors.expiryDate = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      errors.expiryDate = "Use MM/YY format"
    }

    if (!formData.cvv.trim()) {
      errors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      errors.cvv = "CVV must be 3 or 4 digits"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePayClick = async () => {
    if (validateForm()) {
      await processPayment(formData)
      if (!error) {
        router.push("/")
      }
    }
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  return (
    <PageTransition>
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

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName" className="text-gray-900 font-medium">
                      Name on Card
                    </Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      placeholder="John Doe"
                      className={`mt-1 ${formErrors.cardName ? "border-red-500" : ""}`}
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                    {formErrors.cardName && <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-900 font-medium">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      className={`mt-1 ${formErrors.cardNumber ? "border-red-500" : ""}`}
                      value={formData.cardNumber}
                      onChange={(e) => {
                        e.target.value = formatCardNumber(e.target.value)
                        handleInputChange(e)
                      }}
                      maxLength={19}
                    />
                    {formErrors.cardNumber && <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiryDate" className="text-gray-900 font-medium">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        className={`mt-1 ${formErrors.expiryDate ? "border-red-500" : ""}`}
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        maxLength={5}
                      />
                      {formErrors.expiryDate && <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-gray-900 font-medium">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="CVV"
                        className={`mt-1 ${formErrors.cvv ? "border-red-500" : ""}`}
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        type="password"
                      />
                      {formErrors.cvv && <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-900 font-medium">
                      Email Address (For receipt)
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      className={`mt-1 ${formErrors.email ? "border-red-500" : ""}`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveCard"
                      name="saveCard"
                      checked={formData.saveCard}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({
                          ...prev,
                          saveCard: checked === true,
                        }))
                      }}
                    />
                    <Label htmlFor="saveCard" className="text-sm text-gray-700">
                      Save card for future reservations
                    </Label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 h-12" onClick={() => router.back()} disabled={isLoading}>
                  Exit
                </Button>
                <Button
                  className="flex-1 bg-teal-700 hover:bg-teal-800 h-12"
                  onClick={handlePayClick}
                  disabled={isLoading}
                >
                  {isLoading ? <LoadingSpinner /> : <>Pay {formatCurrency(reservationData.totalAmount)} now</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  )
}
