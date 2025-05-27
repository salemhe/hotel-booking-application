"use client";

import { useState } from "react";
import { BasicInfo } from "./form-sections/BasicInfo";
import { PortionCustomization } from "./form-sections/PortionCustomization";
import { InventoryOrderSettings } from "./form-sections/InventoryOrderSettings";
import { PricingAvailability } from "./form-sections/PricingAvailability";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import API from "@/lib/api/axios";

type MenuUploadFormProps = {
  formData: object;
  setFormData: (data: object) => void
};

export function MenuUploadForm({ formData, setFormData }: MenuUploadFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  const handleNext = (stepData: object) => {
    setFormData((prev: object) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const save = () => {
    localStorage.setItem("menuFormData", JSON.stringify(formData));
    toast.success("Your new menu item has been successfully saved as Draft.")
  };

  const handleSubmit = async (finalStepData: object) => {
    setIsSubmitting(true);
    const finalFormData = { ...formData, ...finalStepData };
    console.log("Final form data:", finalFormData);

    try {
      // Simulate API call
      await API.post("/vendors/create-menu", finalFormData, {headers: { "Content-Type": "multipart/form-data", }})

      // Clear form data from localStorage after successful submission
      localStorage.removeItem("menuFormData");
      
      toast.success("Menu item added successfully")
      router.push("/vendorDashboard/menu")
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was a problem adding your menu item. Please try again.")
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative w-full">
      <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      {currentStep === 0 && (
        <BasicInfo onNext={handleNext} initialData={formData} />
      )}
      {currentStep === 1 && (
        <PricingAvailability
          onNext={handleNext}
          onBack={handleBack}
          initialData={formData}
        />
      )}
      {currentStep === 2 && (
        <PortionCustomization
          onNext={handleNext}
          onBack={handleBack}
          initialData={formData}
        />
      )}
      {currentStep === 3 && (
        <InventoryOrderSettings
          save={save}
          onSubmit={handleSubmit}
          onBack={handleBack}
          initialData={formData}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}