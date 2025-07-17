"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { MenuUpdateForm } from "@/app/components/MenuUpdateForm";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import API from "@/app/lib/api/axios";
import { AuthService } from "@/app/lib/api/services/auth.service";

interface MenuItemData {
  _id: string;
  dishName: string;
  category: string;
  cuisineType: string;
  description: string;
  itemImage: string;
  price: number;
  discountPrice?: number;
  preparationTime: string;
  availabilityStatus: boolean;
  portionSize: string;
  spiceLevel: string;
  addOns: string[];
  dietaryInfo: string[];
  stockQuantity: number;
  maxOrderPerCustomer: number;
  vendor: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditMenuPage() {
  const [menuData, setMenuData] = useState<MenuItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const menuId = params.id as string;

  const user = AuthService.getUser();

  useEffect(() => {
    if (menuId) {
      fetchMenuData();
    }
  }, [menuId]);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.profile?.id) {
        throw new Error("User not authenticated");
      }

      // Fetch specific menu item
      const response = await API.get(`/vendors/menus/${menuId}`);
      const data = response.data.menu;

      // Verify ownership
      if (data.vendor !== user.profile.id) {
        throw new Error("You don't have permission to edit this menu item");
      }

      setMenuData(data);
      console.log("Menu data loaded:", data);
    } catch (error: any) {
      console.error("Error fetching menu data:", error);

      let errorMessage = "Failed to load menu item";
      if (error.response?.status === 404) {
        errorMessage = "Menu item not found";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto py-6 px-4 max-w-4xl">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <Skeleton className="h-9 w-32" />
            </div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Form Skeleton */}
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-2 w-full mt-4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto py-6 px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/vendorDashboard/menu">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
            </Link>
          </div>

          {/* Error Card */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Error Loading Menu Item
              </CardTitle>
              <CardDescription className="text-red-700">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={fetchMenuData} variant="outline">
                  <Loader2 className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/vendorDashboard/menu">
                  <Button>Return to Menu</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Edit Menu Item
            </h1>
            <p className="text-gray-600 mt-1">
              Update "{menuData.dishName}" details and settings
            </p>
          </div>
        </div>

        {/* Menu Info Summary */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 text-lg">
              Current Menu Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Name:</span>
                <p className="text-blue-700">{menuData.dishName}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Category:</span>
                <p className="text-blue-700">{menuData.category}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Price:</span>
                <p className="text-blue-700">₦{menuData.price}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Status:</span>
                <p
                  className={`font-medium ${menuData.availabilityStatus ? "text-green-700" : "text-red-700"}`}
                >
                  {menuData.availabilityStatus ? "Available" : "Unavailable"}
                </p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Cuisine:</span>
                <p className="text-blue-700">{menuData.cuisineType}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Prep Time:</span>
                <p className="text-blue-700">{menuData.preparationTime} min</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Stock:</span>
                <p className="text-blue-700">{menuData.stockQuantity}</p>
              </div>
              <div>
                <span className="font-medium text-blue-800">Last Updated:</span>
                <p className="text-blue-700">
                  {new Date(menuData.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Container */}
        <Card className="shadow-lg">
          <CardContent className="p-0">
            <MenuUpdateForm formData={menuData} menuId={menuId} />
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 text-lg">Edit Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex gap-2">
                <span className="font-medium">💡</span>
                <span>
                  Changes will be reflected immediately for new orders
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">⚠️</span>
                <span>Price changes may affect existing pending orders</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">🔄</span>
                <span>
                  You can save as draft to preview changes before publishing
                </span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium">📱</span>
                <span>
                  Changes will sync across all customer-facing platforms
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
