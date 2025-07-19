"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import { useRouter } from "next/navigation";

interface MenuFormData {
  name: string;
  description: string;
  image: File | null;
  imagePreview: string;
  menuType: string[];
  mealTimes: string[];
  price: string;
  priceType: "fixed" | "per-item";
  availability: boolean;
  branches: string[];
}

export default function CreateMenuPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MenuFormData>({
    name: "",
    description: "",
    image: null,
    imagePreview: "",
    menuType: [],
    mealTimes: [],
    price: "",
    priceType: "fixed",
    availability: true,
    branches: [],
  });

  const steps = [
    { id: 1, title: "Menu", icon: "1" },
    { id: 2, title: "Add menu items", icon: "2" },
    { id: 3, title: "Payment", icon: "3" },
  ];

  const menuTypes = [
    "A la Carte",
    "Buffet",
    "Set Menu",
    "Tasting Menu",
    "Takeaway",
  ];

  const mealTimes = [
    "Breakfast",
    "Brunch",
    "Lunch",
    "Dinner",
    "Late Night",
    "All Day",
  ];

  const branches = [
    "Main Branch",
    "Victoria Island",
    "Lekki Branch",
    "Ikeja Branch",
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const toggleMenuType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      menuType: prev.menuType.includes(type)
        ? prev.menuType.filter((t) => t !== type)
        : [...prev.menuType, type],
    }));
  };

  const toggleMealTime = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      mealTimes: prev.mealTimes.includes(time)
        ? prev.mealTimes.filter((t) => t !== time)
        : [...prev.mealTimes, time],
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      console.log("Form submitted:", formData);
      router.push("/vendorDashboard/menu");
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
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu name*
            </label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g Joe's Platter"
              className="bg-gray-50"
            />
            <div className="text-right text-sm text-gray-500 mt-1">0/50</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menu Description (Optional)
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Add a short description or notes about this menu"
              className="bg-gray-50 min-h-[120px] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Menu Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {menuTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={type}
                    checked={formData.menuType.includes(type)}
                    onChange={() => toggleMenuType(type)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={type} className="text-sm">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Menu Availability (Meal Time)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {mealTimes.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={time}
                    checked={formData.mealTimes.includes(time)}
                    onChange={() => toggleMealTime(time)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={time} className="text-sm">
                    {time}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Price*
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="fixed-price"
                  name="price-type"
                  value="fixed"
                  checked={formData.priceType === "fixed"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceType: e.target.value as "fixed",
                    }))
                  }
                />
                <label htmlFor="fixed-price" className="text-sm font-medium">
                  Fixed Price
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium">₦</span>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="10,000"
                  className="w-32"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="per-item"
                  name="price-type"
                  value="per-item"
                  checked={formData.priceType === "per-item"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      priceType: e.target.value as "per-item",
                    }))
                  }
                />
                <label htmlFor="per-item" className="text-sm">
                  Price per Item
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Menu cover"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        image: null,
                        imagePreview: "",
                      }))
                    }
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop an image here, or
                  </p>
                  <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                    Browse Files
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF • Max 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Menu Availability
            </label>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Show menu on this app</div>
                <div className="text-sm text-gray-600">
                  Make this menu visible to customers
                </div>
              </div>
              <Switch
                checked={formData.availability}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, availability: checked }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Branches
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg bg-white">
              <option>Select branches</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Add Menu Items</h2>
      <p className="text-gray-600 mb-8">
        Configure the items that will be available in this menu
      </p>
      <Button
        className="bg-teal-600 hover:bg-teal-700 text-white"
        onClick={handleNext}
      >
        Continue to Menu Item
      </Button>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto text-center py-12">
      <h2 className="text-2xl font-bold mb-4">Payment Setup</h2>
      <p className="text-gray-600 mb-8">
        Configure payment options for this menu
      </p>
      <Button
        className="bg-teal-600 hover:bg-teal-700 text-white"
        onClick={handleNext}
      >
        Complete Setup
      </Button>
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
            <h1 className="text-xl font-semibold">Create Menu</h1>
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
          <Button
            variant="outline"
            onClick={() =>
              currentStep > 1 ? setCurrentStep(currentStep - 1) : router.back()
            }
          >
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleNext}
          >
            {currentStep === 3 ? "Complete Setup" : "Continue to Menu Item"}
          </Button>
        </div>
      </div>
    </div>
  );
}
