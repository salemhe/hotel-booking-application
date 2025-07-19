"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Smartphone,
  Building,
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

interface PaymentFormData {
  paymentMethod: "card" | "bank-transfer" | "paystack";
  nameOnCard: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  emailAddress: string;
  saveCard: boolean;
}

export default function ReservationPaymentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(3); // Payment is step 3
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: "card",
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    emailAddress: "",
    saveCard: false,
  });

  const steps = [
    { id: 1, title: "Reservation Details", icon: "1" },
    { id: 2, title: "Preselect meal", icon: "2" },
    { id: 3, title: "Payment", icon: "3" },
  ];

  const orderSummary = [
    {
      category: "Starters",
      items: [
        {
          name: "Calamari Fritti",
          note: "Add extra sauce on the side",
          price: 15000,
          qty: 2,
        },
        { name: "Caprese Salad", note: "No onions", price: 15000, qty: 1 },
      ],
    },
    {
      category: "Main Courses",
      items: [
        {
          name: "Spaghetti Carbonara",
          note: "No special request",
          price: 15000,
          qty: 2,
        },
        {
          name: "Calamari Fritti",
          note: "Add extra sauce on the side",
          price: 15000,
          qty: 1,
        },
      ],
    },
    {
      category: "Desserts",
      items: [],
    },
  ];

  const totalAmount = 42000;

  const handlePayment = () => {
    console.log("Processing payment:", formData);
    router.push("/vendorDashboard/reservations/confirmation");
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step.id <= currentStep
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.id < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <span className="text-sm font-medium">{step.icon}</span>
            )}
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              step.id <= currentStep ? "text-teal-600" : "text-gray-600"
            }`}
          >
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-4 ${
                step.id < currentStep ? "bg-teal-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Create New Reservation</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {renderStepIndicator()}

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">
              Choose your payment option
            </h2>

            <div className="mb-6">
              <p className="text-lg font-medium mb-2">Amount to pay: ₦42,000</p>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4 mb-6">
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.paymentMethod === "card"
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, paymentMethod: "card" }))
                }
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === "card"
                        ? "border-teal-600 bg-teal-600"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.paymentMethod === "card" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Card Payment</span>
                </div>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.paymentMethod === "bank-transfer"
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: "bank-transfer",
                  }))
                }
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === "bank-transfer"
                        ? "border-teal-600 bg-teal-600"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.paymentMethod === "bank-transfer" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <Building className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Bank Transfer</span>
                </div>
              </div>

              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.paymentMethod === "paystack"
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: "paystack",
                  }))
                }
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      formData.paymentMethod === "paystack"
                        ? "border-teal-600 bg-teal-600"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.paymentMethod === "paystack" && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Paystack</span>
                </div>
              </div>
            </div>

            {/* Card Payment Form */}
            {formData.paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <Input
                    value={formData.nameOnCard}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        nameOnCard: e.target.value,
                      }))
                    }
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <Input
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cardNumber: e.target.value,
                      }))
                    }
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <Input
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          expiryDate: e.target.value,
                        }))
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <Input
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cvv: e.target.value,
                        }))
                      }
                      placeholder="CVV"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (for receipt)
                  </label>
                  <Input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailAddress: e.target.value,
                      }))
                    }
                    placeholder="your@email.com"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="save-card"
                    checked={formData.saveCard}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        saveCard: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="save-card" className="text-sm">
                    Save card for future reservations
                  </label>
                </div>
              </div>
            )}

            {/* Other payment methods would show different forms */}
            {formData.paymentMethod === "bank-transfer" && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Bank transfer details will be provided after confirmation
                </p>
              </div>
            )}

            {formData.paymentMethod === "paystack" && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  You will be redirected to Paystack to complete payment
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

            <div className="space-y-6">
              {orderSummary.map((category) => (
                <div key={category.category}>
                  <h4 className="font-medium text-gray-900 mb-3">
                    {category.category}
                  </h4>
                  {category.items.length > 0 ? (
                    <div className="space-y-3">
                      {category.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.note}
                            </div>
                            <div className="text-sm text-gray-500">
                              Qty: {item.qty}
                            </div>
                          </div>
                          <div className="font-medium">
                            ₦{item.price.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      No items selected
                    </div>
                  )}
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Amount paid</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white px-8"
            onClick={handlePayment}
          >
            Pay ₦{totalAmount.toLocaleString()} Now
          </Button>
        </div>
      </div>
    </div>
  );
}
