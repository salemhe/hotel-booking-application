"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Check,
  CreditCard,
  Building,
  Smartphone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Reservation Details", icon: Calendar },
  { id: 2, title: "Preselect meal", icon: Clock },
  { id: 3, title: "Payment", icon: Users },
];

const paymentMethods = [
  { id: "card", label: "Card Payment", icon: CreditCard, active: true },
  { id: "bank", label: "Bank Transfer", icon: Building, active: false },
  { id: "paystack", label: "Paystack", icon: Smartphone, active: false },
];

export default function ReservationPaymentPage() {
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [saveCard, setSaveCard] = useState(false);
  const [paymentData, setPaymentData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process payment
    console.log("Payment data:", paymentData);
    router.push("/vendorDashboard/reservations/confirmation");
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-8 mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === 3;
        const isCompleted = step.id < 3;

        return (
          <div key={step.id} className="flex flex-col items-center">
            <div className="flex items-center">
              {index > 0 && (
                <div
                  className={`w-16 h-0.5 ${
                    isCompleted ? "bg-teal-600" : "bg-gray-300"
                  }`}
                />
              )}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive
                    ? "bg-teal-600 text-white"
                    : isCompleted
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted && !isActive ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 ${
                    isCompleted ? "bg-teal-600" : "bg-gray-300"
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

      {/* Payment Form */}
      <div className="max-w-2xl mx-auto">
        {/* Payment Method Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                selectedPaymentMethod === method.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <method.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{method.label}</span>
            </button>
          ))}
        </div>

        {/* Card Payment Form */}
        {selectedPaymentMethod === "card" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name on Card
              </label>
              <Input
                value={paymentData.nameOnCard}
                onChange={(e) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    nameOnCard: e.target.value,
                  }))
                }
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <Input
                value={paymentData.cardNumber}
                onChange={(e) =>
                  setPaymentData((prev) => ({
                    ...prev,
                    cardNumber: e.target.value,
                  }))
                }
                placeholder="0000 0000 0000 0000"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <Input
                  value={paymentData.expiryDate}
                  onChange={(e) =>
                    setPaymentData((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <Input
                  value={paymentData.cvv}
                  onChange={(e) =>
                    setPaymentData((prev) => ({ ...prev, cvv: e.target.value }))
                  }
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address (For receipt)
              </label>
              <Input
                type="email"
                value={paymentData.email}
                onChange={(e) =>
                  setPaymentData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="save-card"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="save-card" className="text-sm text-gray-600">
                Save card for future reservations
              </label>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Back
              </Button>

              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Pay ₦42,000 now
              </Button>
            </div>
          </form>
        )}

        {/* Other payment methods can be implemented similarly */}
        {selectedPaymentMethod !== "card" && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {
                paymentMethods.find((m) => m.id === selectedPaymentMethod)
                  ?.label
              }{" "}
              payment method coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
