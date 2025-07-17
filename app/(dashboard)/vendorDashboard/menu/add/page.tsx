"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

import { MenuUploadForm } from "@/app/components/MenuUploadForm";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

interface FormData {
  dishName?: string;
  category?: string;
  cuisineType?: string;
  description?: string;
  itemImage?: File | string;
  price?: number;
  discountPrice?: number;
  preparationTime?: string;
  availabilityStatus?: boolean;
  portionSize?: string;
  spiceLevel?: string;
  addOns?: string[];
  dietaryInfo?: string[];
  stockQuantity?: number;
  maxOrderPerCustomer?: number;
}

export default function AddMenuPage() {
  const [formData, setFormData] = useState<FormData>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load saved form data from localStorage
    const savedFormData = localStorage.getItem("menuFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing saved form data:", error);
        localStorage.removeItem("menuFormData");
      }
    }
  }, []);

  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData((prev) => {
      const updated = { ...prev, ...newData };
      // Auto-save to localStorage
      localStorage.setItem("menuFormData", JSON.stringify(updated));
      return updated;
    });
  };

  const clearDraft = () => {
    localStorage.removeItem("menuFormData");
    setFormData({});
    router.push("/vendorDashboard/menu");
  };

  const hasExistingDraft = Object.keys(formData).length > 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/vendorDashboard/menu">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
            {hasExistingDraft && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Save className="w-3 h-3" />
                Draft Available
              </Badge>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Add New Menu Item
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new menu item for your restaurant. Fill in all the
              details to make it appealing to customers.
            </p>
          </div>
        </div>

        {/* Draft Notice */}
        {hasExistingDraft && (
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-amber-800 text-lg">
                    Draft Available
                  </CardTitle>
                  <CardDescription className="text-amber-700">
                    You have unsaved changes from a previous session. You can
                    continue editing or start fresh.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDraft}
                  className="border-amber-300 text-amber-800 hover:bg-amber-100"
                >
                  Clear Draft
                </Button>
              </div>
            </CardHeader>
            {formData.dishName && (
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm text-amber-700">
                  <span className="font-medium">Draft:</span>
                  <span>{formData.dishName}</span>
                  {formData.category && (
                    <Badge
                      variant="outline"
                      className="text-amber-700 border-amber-300"
                    >
                      {formData.category}
                    </Badge>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Start Guide</CardTitle>
            <CardDescription>
              Follow these steps to create your menu item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium text-sm">Basic Info</p>
                  <p className="text-xs text-gray-600">Name, category, image</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium text-sm">Pricing</p>
                  <p className="text-xs text-gray-600">Price & availability</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium text-sm">Customization</p>
                  <p className="text-xs text-gray-600">Portions & add-ons</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-sm">
                  4
                </div>
                <div>
                  <p className="font-medium text-sm">Inventory</p>
                  <p className="text-xs text-gray-600">Stock & limits</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Container */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <MenuUploadForm
              setFormData={handleFormDataChange}
              formData={formData}
            />
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-blue-700">
              <div className="flex gap-2">
                <span className="font-medium">📸</span>
                <span>
                  Use high-quality, well-lit images that showcase your food
                  attractively
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">📝</span>
                <span>
                  Write clear, appealing descriptions that highlight key
                  ingredients and preparation methods
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">💰</span>
                <span>
                  Set competitive prices and use discount pricing strategically
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">⏱️</span>
                <span>
                  Accurate preparation times help customers set proper
                  expectations
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">🏷️</span>
                <span>
                  Add dietary information to help customers with specific
                  requirements
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto-save Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            <Save className="w-4 h-4 inline mr-1" />
            Your progress is automatically saved as you fill out the form
          </p>
        </div>
      </div>
    </div>
  );
}
