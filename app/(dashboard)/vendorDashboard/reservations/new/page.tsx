"use client";

import React, { useState } from "react";
import { ArrowLeft, Check, Calendar, Users, Clock } from "lucide-react";
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

interface ReservationFormData {
  customerName: string;
  phoneNumber: string;
  date: string;
  time: string;
  guests: string;
  tablePreference: string;
  specialRequests: string;
  staffNotes: string;
  skipMealPreselection: boolean;
}

export default function CreateReservationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ReservationFormData>({
    customerName: "",
    phoneNumber: "",
    date: "",
    time: "",
    guests: "",
    tablePreference: "",
    specialRequests: "",
    staffNotes: "",
    skipMealPreselection: false,
  });

  const steps = [
    { id: 1, title: "Reservation Details", icon: "1" },
    { id: 2, title: "Preselect meal", icon: "2" },
    { id: 3, title: "Payment", icon: "3" },
  ];

  const timeSlots = [
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
  ];

  const guestOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      console.log("Reservation created:", formData);
      router.push("/vendorDashboard/reservations");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
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

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Create New Reservation</h2>
        <p className="text-gray-600">Fill in the reservation details below</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Phone number
          </label>
          <Input
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
            placeholder="Enter phone number"
            type="tel"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date*
        </label>
        <div className="relative">
          <Input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time*
        </label>
        <div className="relative">
          <select
            value={formData.time}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, time: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            required
          >
            <option value="">Select time</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          No. of guests*
        </label>
        <div className="relative">
          <select
            value={formData.guests}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, guests: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            required
          >
            <option value="">Select number of guests</option>
            {guestOptions.map((number) => (
              <option key={number} value={number}>
                {number} {number === 1 ? "Guest" : "Guests"}
              </option>
            ))}
          </select>
          <Users className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>
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
          className="w-full p-3 border border-gray-300 rounded-lg bg-white"
        >
          <option value="">Pick table preference</option>
          <option value="window">Window Seat</option>
          <option value="private">Private Table</option>
          <option value="outdoor">Outdoor Seating</option>
          <option value="bar">Bar Seating</option>
          <option value="booth">Booth</option>
          <option value="no-preference">No Preference</option>
        </select>
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
          className="min-h-[80px] resize-none"
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
          className="min-h-[80px] resize-none"
        />
      </div>

      <div className="flex items-center space-x-2 p-4 border rounded-lg">
        <input
          type="checkbox"
          id="skip-meal"
          checked={formData.skipMealPreselection}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              skipMealPreselection: e.target.checked,
            }))
          }
          className="rounded border-gray-300"
        />
        <label htmlFor="skip-meal" className="text-sm">
          Customer is dining now, skip meal preselected
        </label>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Preselect Meal</h2>
      <p className="text-gray-600 mb-8">
        Choose meals for the customer's reservation
      </p>
      <Button
        className="bg-teal-600 hover:bg-teal-700 text-white"
        onClick={handleNext}
      >
        Continue to Meal Selection
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <p className="text-gray-600 mb-8">
        Set up payment details for this reservation
      </p>
      <Button
        className="bg-teal-600 hover:bg-teal-700 text-white"
        onClick={handleNext}
      >
        Complete Reservation
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Create New Reservation</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {renderStepIndicator()}

        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack}>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleNext}
            disabled={
              currentStep === 1 &&
              (!formData.customerName ||
                !formData.date ||
                !formData.time ||
                !formData.guests)
            }
          >
            {currentStep === 3
              ? "Complete Reservation"
              : "Continue to Meal Selection"}
          </Button>
        </div>
      </div>
    </div>
  );
}
