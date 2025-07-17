"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

import { BasicInfo } from "./form-sections/BasicInfo";
import { PortionCustomization } from "./form-sections/PortionCustomization";
import { InventoryOrderSettings } from "./form-sections/InventoryOrderSettings";
import { PricingAvailability } from "./form-sections/PricingAvailability";
import API from "@/app/lib/api/axios";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

type MenuUploadFormProps = {
  formData: any;
  setFormData: (data: any) => void;
};

const STEPS = [
  {
    title: "Basic Information",
    description: "Name, category, and image",
    fields: ["dishName", "category", "cuisineType", "description", "itemImage"],
  },
  {
    title: "Pricing & Availability",
    description: "Price and preparation time",
    fields: ["price", "preparationTime", "availabilityStatus"],
  },
  {
    title: "Portion & Customization",
    description: "Portions, spice level, and add-ons",
    fields: ["portionSize", "spiceLevel", "addOns", "dietaryInfo"],
  },
  {
    title: "Inventory & Orders",
    description: "Stock and order limits",
    fields: ["stockQuantity", "maxOrderPerCustomer"],
  },
];

export function MenuUploadForm({ formData, setFormData }: MenuUploadFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const router = useRouter();

  useEffect(() => {
    // Check which steps are completed based on form data
    const completed = new Set<number>();
    STEPS.forEach((step, index) => {
      const hasAllFields = step.fields.every((field) => {
        const value = formData[field];
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "boolean") return true;
        return value !== undefined && value !== "" && value !== null;
      });
      if (hasAllFields) completed.add(index);
    });
    setCompletedSteps(completed);
  }, [formData]);

  const handleNext = (stepData: any) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);

    // Mark current step as completed
    setCompletedSteps((prev) => new Set([...prev, currentStep]));

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const save = () => {
    localStorage.setItem("menuFormData", JSON.stringify(formData));
    toast.success("Your menu item has been successfully saved as draft.", {
      description: "You can continue editing anytime from where you left off.",
    });
  };

  const handleSubmit = async (finalStepData: any) => {
    setIsSubmitting(true);
    const user = AuthService.getUser();

    if (!user?.profile?.id) {
      toast.error("Authentication required", {
        description: "Please log in to continue.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const finalFormData = { ...formData, ...finalStepData };

      // Create FormData for file upload
      const submitData = new FormData();

      // Add all form fields
      Object.keys(finalFormData).forEach((key) => {
        const value = finalFormData[key];
        if (key === "itemImage" && value instanceof File) {
          submitData.append(key, value);
        } else if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          submitData.append(key, value.toString());
        }
      });

      // Add vendor ID
      submitData.append("vendorId", user.profile.id);

      console.log("Submitting form data:", finalFormData);

      const response = await API.post("/vendors/create-menu", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Clear form data from localStorage after successful submission
      localStorage.removeItem("menuFormData");

      toast.success("Menu item published successfully!", {
        description: "Your new menu item is now available to customers.",
      });

      router.push("/vendorDashboard/menu");
    } catch (error: any) {
      console.error("Error submitting form:", error);

      let errorMessage = "Failed to publish menu item. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error("Publication failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
      setCurrentStep(stepIndex);
    }
  };

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;
  const currentStepData = STEPS[currentStep];

  return (
    <div className="w-full">
      {/* Progress Header */}
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-xl">
              Step {currentStep + 1} of {STEPS.length}: {currentStepData.title}
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              {currentStepData.description}
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            {Math.round(progressPercentage)}% Complete
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <Progress value={progressPercentage} className="h-2" />

          {/* Step Indicators */}
          <div className="flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isCurrent = index === currentStep;
              const isAccessible =
                index <= currentStep ||
                completedSteps.has(index - 1) ||
                index === 0;

              return (
                <button
                  key={index}
                  onClick={() => jumpToStep(index)}
                  disabled={!isAccessible}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    isCurrent
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                        ? "text-green-600 hover:bg-green-50"
                        : isAccessible
                          ? "text-gray-600 hover:bg-gray-50"
                          : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all ${
                      isCurrent
                        ? "border-primary bg-primary text-white"
                        : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : isAccessible
                            ? "border-gray-300 bg-white"
                            : "border-gray-200 bg-gray-100"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs text-center hidden sm:block max-w-20">
                    {step.title.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Form Steps */}
        <div className="min-h-[400px]">
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

        {/* Form Summary in Final Step */}
        {currentStep === STEPS.length - 1 && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Review Your Menu Item
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-green-800">Name:</span>
                  <span className="ml-2 text-green-700">
                    {formData.dishName || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Category:</span>
                  <span className="ml-2 text-green-700">
                    {formData.category || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Price:</span>
                  <span className="ml-2 text-green-700">
                    ₦{formData.price || 0}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-green-800">Prep Time:</span>
                  <span className="ml-2 text-green-700">
                    {formData.preparationTime || "Not set"} min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Warning for incomplete fields */}
        {currentStep < STEPS.length - 1 && !completedSteps.has(currentStep) && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">
                Complete all required fields to proceed
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
}
