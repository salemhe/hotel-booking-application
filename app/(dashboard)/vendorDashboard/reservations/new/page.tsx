"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useRouter } from "next/navigation";

interface ReservationForm {
  // Step 1: Reservation Details
  customerName: string;
  phoneNumber: string;
  date: string;
  time: string;
  guests: string;
  tablePreference: string;
  specialRequests: string;
  staffNotes: string;
  mealPreselected: boolean;

  // Step 2: Meal Selection (if preselected)
  selectedMeals: any[];

  // Step 3: Payment
  paymentMethod: "prepay" | "pay-at-restaurant";
}

const steps = [
  { id: 1, title: "Reservation Details", icon: Calendar },
  { id: 2, title: "Preselect meal", icon: Clock },
  { id: 3, title: "Payment", icon: Users },
];

const tablePreferences = [
  "Pick table preference",
  "Window seat",
  "Private booth",
  "Bar area",
  "Outdoor seating",
  "No preference",
];

const guestOptions = Array.from({ length: 10 }, (_, i) => i + 1);

export default function NewReservationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ReservationForm>({
    customerName: "",
    phoneNumber: "",
    date: "",
    time: "",
    guests: "",
    tablePreference: "",
    specialRequests: "",
    staffNotes: "",
    mealPreselected: false,
    selectedMeals: [],
    paymentMethod: "prepay",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      if (currentStep === 1 && !formData.mealPreselected) {
        setCurrentStep(3); // Skip meal selection
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 3 && !formData.mealPreselected) {
        setCurrentStep(1); // Skip meal selection when going back
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleSubmit = () => {
    console.log("Reservation form data:", formData);
    router.push("/vendorDashboard/reservations");
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-8 mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted =
          step.id < currentStep ||
          (step.id === 2 && !formData.mealPreselected && currentStep === 3);
        const isSkipped = step.id === 2 && !formData.mealPreselected;

        return (
          <div key={step.id} className="flex flex-col items-center">
            <div className="flex items-center">
              {index > 0 && (
                <div
                  className={`w-16 h-0.5 ${
                    isCompleted || (isSkipped && currentStep === 3)
                      ? "bg-teal-600"
                      : "bg-gray-300"
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : isCompleted || isSkipped
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {(isCompleted || isSkipped) && !isActive ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 ${
                    isCompleted || (isSkipped && currentStep === 3)
                      ? "bg-teal-600"
                      : "bg-gray-300"
                  }`}
                />
              )}
            </div>
            <span
              className={`text-sm mt-2 ${
                isActive ? "text-teal-600 font-medium" : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer name*
          </label>
          <Input
            value={formData.customerName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customerName: e.target.value }))
            }
            placeholder="Enter full name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Table Preference*
          </label>
          <select
            value={formData.tablePreference}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tablePreference: e.target.value,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            required
          >
            {tablePreferences.map((preference) => (
              <option key={preference} value={preference}>
                {preference}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone number
        </label>
        <Input
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
          }
          placeholder="Enter phone number"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date*
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time*
          </label>
          <Input
            type="time"
            value={formData.time}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, time: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No. of guests*
          </label>
          <select
            value={formData.guests}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, guests: e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            required
          >
            <option value="">Select number of guests</option>
            {guestOptions.map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests
        </label>
        <Textarea
          value={formData.specialRequests}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              specialRequests: e.target.value,
            }))
          }
          placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
          className="min-h-[80px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Requests
        </label>
        <Textarea
          value={formData.staffNotes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, staffNotes: e.target.value }))
          }
          placeholder="Add notes for staff (not visible to customers)"
          className="min-h-[80px]"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="meal-preselected"
          checked={formData.mealPreselected}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              mealPreselected: e.target.checked,
            }))
          }
          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
        />
        <label htmlFor="meal-preselected" className="text-sm">
          Customer is dining now, skip meal preselected
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Select meals for your reservation
        </h2>
        <p className="text-gray-600">
          Choose your preferred meals from our menu
        </p>
      </div>

      {/* Mock menu items */}
      <div className="space-y-6">
        {["Starters", "Main Courses", "Desserts"].map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category === "Starters" && (
                  <>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Calamari Fritti</h4>
                        <p className="text-sm text-gray-600">
                          Add extra lemon on the side
                        </p>
                        <p className="font-medium text-teal-600">₦15,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Qty: 2</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Caprese Salad</h4>
                        <p className="text-sm text-gray-600">
                          No special request
                        </p>
                        <p className="font-medium text-teal-600">₦15,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Qty: 2</p>
                      </div>
                    </div>
                  </>
                )}
                {category === "Main Courses" && (
                  <>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Spaghetti Carbonara</h4>
                        <p className="text-sm text-gray-600">
                          No special request
                        </p>
                        <p className="font-medium text-teal-600">₦15,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Qty: 2</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Calamari Fritti</h4>
                        <p className="text-sm text-gray-600">
                          Add extra lemon on the side
                        </p>
                        <p className="font-medium text-teal-600">₦15,000</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Qty: 2</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Choose your payment option
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Amount to pay: ₦42,000
        </label>

        <div className="space-y-3">
          <Button
            className={`w-full p-4 text-left justify-start ${
              formData.paymentMethod === "prepay"
                ? "bg-teal-600 hover:bg-teal-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
            onClick={() =>
              setFormData((prev) => ({ ...prev, paymentMethod: "prepay" }))
            }
          >
            Prepay Now
          </Button>

          <Button
            variant="outline"
            className={`w-full p-4 text-left justify-start ${
              formData.paymentMethod === "pay-at-restaurant"
                ? "border-teal-600 text-teal-600"
                : ""
            }`}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                paymentMethod: "pay-at-restaurant",
              }))
            }
          >
            Pay at Restaurant
          </Button>
        </div>
      </div>

      {formData.mealPreselected && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Starters</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Calamari Fritti</span>
                  <span>₦15,000</span>
                </div>
                <div className="text-sm text-gray-600">
                  Add extra lemon on the side
                </div>
                <div className="text-sm text-gray-600">Qty: 2</div>

                <div className="flex justify-between">
                  <span>Caprese Salad</span>
                  <span>₦15,000</span>
                </div>
                <div className="text-sm text-gray-600">No special request</div>
                <div className="text-sm text-gray-600">Qty: 2</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Main Courses</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Spaghetti Carbonara</span>
                  <span>₦15,000</span>
                </div>
                <div className="text-sm text-gray-600">No special request</div>
                <div className="text-sm text-gray-600">Qty: 2</div>

                <div className="flex justify-between">
                  <span>Calamari Fritti</span>
                  <span>₦15,000</span>
                </div>
                <div className="text-sm text-gray-600">
                  Add extra lemon on the side
                </div>
                <div className="text-sm text-gray-600">Qty: 2</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium">Desserts</h4>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Reservation
          </h1>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form Content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 max-w-2xl mx-auto">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? () => router.back() : handleBack}
        >
          {currentStep === 1 ? "Cancel" : "Back"}
        </Button>

        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={currentStep === 3 ? handleSubmit : handleNext}
        >
          {currentStep === 3
            ? formData.paymentMethod === "prepay"
              ? "Pay ₦42,000 now"
              : "Continue to Meal Selection"
            : currentStep === 1 && !formData.mealPreselected
              ? "Continue to Payment"
              : "Continue to Meal Selection"}
        </Button>
      </div>
    </div>
  );
}
