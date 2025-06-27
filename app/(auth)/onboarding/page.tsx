"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Badge } from "@/app/components/ui/badge"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { ChevronLeft, ChevronRight, Upload, X, CreditCard, CheckCircle, Info, SkipBackIcon as Skip } from "lucide-react"
import { Alert, AlertDescription } from "@/app/components/ui/alert"

interface RestaurantData {
  images: string[]
  paymentVerified: boolean
  accountName: string
  accountNumber: string
  bankName: string
  routingNumber: string
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean }
  }
  cuisines: string[]
  about: string
  reservationSlots: string[]
  maxPartySize: number
  advanceBookingDays: number
}

const CUISINES = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "Thai",
  "French",
  "American",
  "Mediterranean",
  "Greek",
  "Korean",
  "Vietnamese",
  "Lebanese",
  "Spanish",
  "German",
  "Brazilian",
  "Ethiopian",
  "Moroccan",
  "Turkish",
  "Caribbean",
]

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const TIME_SLOTS = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
]

export default function RestaurantProfileSetup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [businessType] = useState<"restaurant" | "hotel">("restaurant")
  const [skippedSections, setSkippedSections] = useState<number[]>([])

  const [formData, setFormData] = useState<RestaurantData>({
    images: [],
    paymentVerified: false,
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
    openingHours: DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { open: "9:00 AM", close: "10:00 PM", closed: false },
      }),
      {},
    ),
    cuisines: [],
    about: "",
    reservationSlots: [],
    maxPartySize: 8,
    advanceBookingDays: 30,
  })

  const totalSteps = businessType === "restaurant" ? 6 : 5 // Skip reservations for hotels

  const updateFormData = <K extends keyof RestaurantData>(field: K, value: RestaurantData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipSection = () => {
    setSkippedSections((prev) => [...prev, currentStep])
    nextStep()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      updateFormData("images", [...formData.images, ...newImages].slice(0, 10))
    }
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    updateFormData("images", newImages)
  }

  const verifyPaymentDetails = async () => {
    // Simulate account verification
    setTimeout(() => {
      updateFormData("paymentVerified", true)
      updateFormData("accountName", "John's Restaurant LLC") // Mock verified name
    }, 2000)
  }

  const getStepInfo = () => {
    const steps = [
      {
        title: `${businessType === "restaurant" ? "Restaurant" : "Hotel"} Images`,
        description: "Upload high-quality photos",
        required: true,
        guidance:
          "Upload at least 5 high-quality images showcasing your venue, food, and ambiance. First image will be your main photo.",
      },
      {
        title: "Payment Details",
        description: "Set up your payment information",
        required: true,
        guidance: "Verify your bank account to receive payments. We'll verify your account details for security.",
      },
      {
        title: "Opening Hours",
        description: "Set your business hours",
        required: false,
        guidance: "Set your regular operating hours. You can always update these later in settings.",
      },
      {
        title: "Cuisines",
        description: "Select your cuisine types",
        required: false,
        guidance: "Help customers find you by selecting the types of cuisine you offer. Choose all that apply.",
      },
      {
        title: `About Your ${businessType === "restaurant" ? "Restaurant" : "Hotel"}`,
        description: "Tell customers about your business",
        required: false,
        guidance:
          "Write a compelling description that highlights what makes your business special. Include your story, specialties, and unique features.",
      },
    ]

    if (businessType === "restaurant") {
      steps.push({
        title: "Reservation Settings",
        description: "Configure table booking options",
        required: false,
        guidance: "Set up your reservation system. Define available time slots, party sizes, and booking policies.",
      })
    }

    return steps[currentStep - 1]
  }

  const isStepValid = () => {
    const stepInfo = getStepInfo()
    if (!stepInfo.required) return true

    switch (currentStep) {
      case 1: // Images
        return formData.images.length >= 5
      case 2: // Payment
        return formData.paymentVerified && formData.accountName && formData.accountNumber && formData.bankName
      default:
        return true
    }
  }

  const stepInfo = getStepInfo()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? skippedSections.includes(step)
                        ? "bg-yellow-500 text-white"
                        : "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {skippedSections.includes(step) ? <Skip className="w-4 h-4" /> : step}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-2xl font-bold">{stepInfo.title}</CardTitle>
            {stepInfo.required ? (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Optional
              </Badge>
            )}
          </div>

          <CardDescription>{stepInfo.description}</CardDescription>

          <Alert className="mt-4 text-left">
            <Info className="h-4 w-4" />
            <AlertDescription>{stepInfo.guidance}</AlertDescription>
          </Alert>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Images */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && <Badge className="absolute bottom-2 left-2 text-xs">Main Photo</Badge>}
                  </div>
                ))}

                {formData.images.length < 10 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Image</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>

              <div className="text-sm text-gray-600">
                {formData.images.length}/10 images uploaded (minimum 5 required)
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {!formData.paymentVerified ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter your account number"
                      value={formData.accountNumber}
                      onChange={(e) => updateFormData("accountNumber", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number *</Label>
                    <Input
                      id="routingNumber"
                      placeholder="Enter your routing number"
                      value={formData.routingNumber}
                      onChange={(e) => updateFormData("routingNumber", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      placeholder="Enter your bank name"
                      value={formData.bankName}
                      onChange={(e) => updateFormData("bankName", e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={verifyPaymentDetails}
                    disabled={!formData.accountNumber || !formData.routingNumber || !formData.bankName}
                    className="w-full"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Verify Account Details
                  </Button>
                </>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Account Verified Successfully</span>
                  </div>
                  <div className="text-sm text-green-700">
                    <p>
                      <strong>Account Name:</strong> {formData.accountName}
                    </p>
                    <p>
                      <strong>Bank:</strong> {formData.bankName}
                    </p>
                    <p>
                      <strong>Account:</strong> ****{formData.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Opening Hours */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-24 font-medium">{day}</div>

                  <Checkbox
                    checked={formData.openingHours[day].closed}
                    onCheckedChange={(checked) => {
                      updateFormData("openingHours", {
                        ...formData.openingHours,
                        [day]: { ...formData.openingHours[day], closed: !!checked },
                      })
                    }}
                  />
                  <Label className="text-sm">Closed</Label>

                  {!formData.openingHours[day].closed && (
                    <>
                      <Select
                        value={formData.openingHours[day].open}
                        onValueChange={(value) => {
                          updateFormData("openingHours", {
                            ...formData.openingHours,
                            [day]: { ...formData.openingHours[day], open: value },
                          })
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-gray-500">to</span>

                      <Select
                        value={formData.openingHours[day].close}
                        onValueChange={(value) => {
                          updateFormData("openingHours", {
                            ...formData.openingHours,
                            [day]: { ...formData.openingHours[day], close: value },
                          })
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Cuisines */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CUISINES.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={cuisine}
                      checked={formData.cuisines.includes(cuisine)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData("cuisines", [...formData.cuisines, cuisine])
                        } else {
                          updateFormData(
                            "cuisines",
                            formData.cuisines.filter((c) => c !== cuisine),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={cuisine} className="text-sm cursor-pointer">
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600">
                Selected: {formData.cuisines.length} cuisine{formData.cuisines.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* Step 5: About */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about">About Your {businessType === "restaurant" ? "Restaurant" : "Hotel"}</Label>
                <Textarea
                  id="about"
                  placeholder={`Tell customers what makes your ${businessType} special. Include your story, specialties, atmosphere, and what guests can expect...`}
                  value={formData.about}
                  onChange={(e) => updateFormData("about", e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="text-sm text-gray-500">{formData.about.length}/500 characters</div>
              </div>
            </div>
          )}

          {/* Step 6: Reservations (Restaurant only) */}
          {currentStep === 6 && businessType === "restaurant" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxPartySize">Maximum Party Size</Label>
                  <Select
                    value={formData.maxPartySize.toString()}
                    onValueChange={(value) => updateFormData("maxPartySize", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} people
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advanceBooking">Advance Booking (Days)</Label>
                  <Select
                    value={formData.advanceBookingDays.toString()}
                    onValueChange={(value) => updateFormData("advanceBookingDays", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                      <SelectItem value="60">2 months</SelectItem>
                      <SelectItem value="90">3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Available Reservation Time Slots</Label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {TIME_SLOTS.filter((time) => {
                    const hour = Number.parseInt(time.split(":")[0])
                    const isPM = time.includes("PM")
                    const hour24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour
                    return hour24 >= 11 && hour24 <= 22 // 11 AM to 10 PM
                  }).map((time) => (
                    <div key={time} className="flex items-center space-x-2">
                      <Checkbox
                        id={time}
                        checked={formData.reservationSlots.includes(time)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData("reservationSlots", [...formData.reservationSlots, time])
                          } else {
                            updateFormData(
                              "reservationSlots",
                              formData.reservationSlots.filter((t) => t !== time),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={time} className="text-sm cursor-pointer">
                        {time}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">Selected: {formData.reservationSlots.length} time slots</div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {!stepInfo.required && !skippedSections.includes(currentStep) && (
                <Button variant="ghost" onClick={skipSection} className="flex items-center gap-2">
                  <Skip className="w-4 h-4" />
                  Skip
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={stepInfo.required && !isStepValid()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => alert("Profile setup complete!")}
                  disabled={stepInfo.required && !isStepValid()}
                  className="flex items-center gap-2"
                >
                  Complete Setup
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
