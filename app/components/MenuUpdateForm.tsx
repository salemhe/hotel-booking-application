"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle, Clock, AlertCircle, Save } from "lucide-react";

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

type MenuUpdateFormProps = {
  formData: any;
  menuId: string;
};

const STEPS = [
  {
    title: "Basic Information",
    description: "Name, category, and image",
    fields: ["dishName", "category", "cuisineType", "description"],
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

export function MenuUpdateForm({
  formData: initialData,
  menuId,
}: MenuUpdateFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [hasChanges, setHasChanges] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set([0, 1, 2, 3]),
  ); // All steps completed for edit
  const router = useRouter();

  useEffect(() => {
    // Check if form data has changed from initial data
    const hasFormChanges =
      JSON.stringify(formData) !== JSON.stringify(initialData);
    setHasChanges(hasFormChanges);
  }, [formData, initialData]);

  const handleNext = (stepData: any) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const save = async () => {
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      // Save as draft - you could implement a draft endpoint here
      const draftKey = `menuDraft_${menuId}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));

      toast.success("Changes saved as draft", {
        description: "Your changes have been saved locally.",
      });
    } catch (error) {
      toast.error("Failed to save draft");
    }
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

      // Create FormData for file upload if there's a new image
      let submitData: FormData | any;

      if (finalFormData.itemImage instanceof File) {
        submitData = new FormData();
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
      } else {
        // Regular JSON update if no new image
        submitData = finalFormData;
      }

      console.log("Updating menu item:", finalFormData);

      const headers: any = {};
      if (submitData instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await API.put(`/vendors/menus/${menuId}`, submitData, {
        headers,
      });

      // Clear draft after successful update
      localStorage.removeItem(`menuDraft_${menuId}`);

      toast.success("Menu item updated successfully!", {
        description: "Your changes are now live for customers.",
      });

      router.push("/vendorDashboard/menu");
    } catch (error: any) {
      console.error("Error updating menu item:", error);

      let errorMessage = "Failed to update menu item. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error("Update failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const discardChanges = () => {
    setFormData(initialData);
    setHasChanges(false);
    toast.info("Changes discarded", {
      description: "Form has been reset to original values.",
    });
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
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-300"
              >
                <Save className="w-3 h-3 mr-1" />
                Unsaved Changes
              </Badge>
            )}
            <Badge variant="outline" className="text-sm">
              {Math.round(progressPercentage)}% Complete
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        {hasChanges && (
          <div className="flex gap-2 mb-4">
            <Button size="sm" variant="outline" onClick={save}>
              Save Draft
            </Button>
            <Button size="sm" variant="ghost" onClick={discardChanges}>
              Discard Changes
            </Button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-3">
          <Progress value={progressPercentage} className="h-2" />

          {/* Step Indicators */}
          <div className="flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isCurrent = index === currentStep;

              return (
                <button
                  key={index}
                  onClick={() => jumpToStep(index)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                    isCurrent
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all ${
                      isCurrent
                        ? "border-primary bg-primary text-white"
                        : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-gray-300 bg-white"
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
              isEditing={true}
            />
          )}
        </div>

        {/* Changes Summary */}
        {hasChanges && currentStep === STEPS.length - 1 && (
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Review Your Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-amber-700 mb-3">
                The following changes will be applied to your menu item:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData).map((key) => {
                  const oldValue = initialData[key];
                  const newValue = formData[key];
                  const hasChanged =
                    JSON.stringify(oldValue) !== JSON.stringify(newValue);

                  if (
                    !hasChanged ||
                    key === "_id" ||
                    key === "vendor" ||
                    key === "createdAt" ||
                    key === "updatedAt"
                  ) {
                    return null;
                  }

                  return (
                    <div key={key} className="p-2 bg-white rounded border">
                      <span className="font-medium text-amber-800 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}:
                      </span>
                      <div className="text-amber-700 text-xs mt-1">
                        <div className="line-through opacity-60">
                          {Array.isArray(oldValue)
                            ? oldValue.join(", ")
                            : String(oldValue || "Not set")}
                        </div>
                        <div className="font-medium">
                          {Array.isArray(newValue)
                            ? newValue.join(", ")
                            : String(newValue || "Not set")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Summary in Final Step */}
        {currentStep === STEPS.length - 1 && !hasChanges && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Current Menu Item Details
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
      </CardContent>
    </div>
  );
}
