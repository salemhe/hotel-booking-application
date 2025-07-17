"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import Link from "next/link";

import MenuItem from "@/app/components/MenuItem";
import { MenuPopup } from "@/app/components/MenuPopup";
import { AuthService } from "@/app/lib/api/services/auth.service";
import API from "@/app/lib/api/axios";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

interface MenuItemType {
  _id: string;
  vendor: string;
  dishName: string;
  description: string;
  price: number;
  category: string;
  itemImage: string;
  cuisineType?: string;
  availabilityStatus?: boolean;
  preparationTime?: string;
  stockQuantity?: number;
}

export default function VendorMenuPage() {
  const [data, setData] = useState<MenuItemType[]>([]);
  const [filteredData, setFilteredData] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);

  const user = AuthService.getUser();

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [data, searchTerm, categoryFilter]);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.profile?.id) {
        throw new Error("User not authenticated");
      }

      const menuResponse = await API.get(
        `/vendors/menus?vendorId=${user.profile.id}`,
      );
      const menuData = menuResponse.data.menus || [];
      setData(menuData);
      console.log("menu", menuData);
    } catch (error) {
      console.error("menu fetch error", error);
      let errorMessage = "Failed to fetch menu items";

      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let filtered = data;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }

    setFilteredData(filtered);
  };

  const handleRefresh = () => {
    fetchMenu();
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await API.delete(`/vendors/menus/${itemId}`);
      setData((prev) => prev.filter((item) => item._id !== itemId));
      toast.success("Menu item deleted successfully");
    } catch (error) {
      console.error("Delete error", error);
      toast.error("Failed to delete menu item");
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(data.map((item) => item.category))),
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your menu items...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Menu</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRefresh} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Menu
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your restaurant's menu items ({data.length} total)
          </p>
        </div>
        <MenuPopup />
      </div>

      {/* Filters and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Items Display */}
      {filteredData.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-400 mb-4">
              <Plus className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {data.length === 0
                ? "No menu items yet"
                : "No items match your search"}
            </h3>
            <p className="text-gray-600 mb-4">
              {data.length === 0
                ? "Start building your menu by adding your first item"
                : "Try adjusting your search terms or filters"}
            </p>
            {data.length === 0 && (
              <Link href="/vendorDashboard/menu/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Menu Item
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredData.map((menuItem) => (
            <MenuItem
              key={menuItem._id}
              data={menuItem}
              onDelete={handleDeleteItem}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {data.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Total Items: {data.length}</span>
            <span>Showing: {filteredData.length}</span>
            <span>
              Available:{" "}
              {data.filter((item) => item.availabilityStatus !== false).length}
            </span>
            <span>Categories: {categories.length - 1}</span>
          </div>
        </div>
      )}
    </div>
  );
}
