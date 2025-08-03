"use client";

import useSWR from "swr";
import React, { useState } from "react";
import { apiFetcher } from "@/app/lib/fetcher";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  MoreHorizontal,
  ArrowLeft,
  Grid3X3,
  List,
  // Upload,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  // CardHeader,
  // CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Tabs,
  // TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Switch } from "@/app/components/ui/switch";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/app/components/ui/avatar";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  status: "available" | "unavailable";
  orders: number;
  menuType: string;
  mealTimes: string[];
  tags: string[];
  isActive: boolean;
  updatedDaysAgo: number;
}

import { useEffect } from "react";

export default function MenuManagementPage() {
  const router = useRouter();
  const { data: menuItems = [], mutate } = useSWR<MenuItem[]>("/vendor/menus", apiFetcher, { refreshInterval: 5000 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const categories = [
    { value: "all", label: "All Category" },
    { value: "main-dish", label: "Main Dish" },
    { value: "starters", label: "Starters" },
    { value: "desserts", label: "Desserts" },
    { value: "beverages", label: "Drinks" },
    { value: "sides", label: "Sides" },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // const getItemsByCategory = (category: string) => {
  //   if (category === "all") return filteredItems;
  //   return filteredItems.filter((item) => item.category === category);
  // };

  const MenuItemCard = ({ item }: { item: MenuItem }) => {
    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <Image
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center`;
            }}
            fill
          />
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/vendorDashboard/menu/${item.id}`)
                  }
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(`/vendorDashboard/menu/${item.id}/edit`)
                  }
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.menuType}</p>
              <p className="text-xs text-gray-500">{item.orders} items</p>
              <p className="text-xs text-gray-500">
                Updated {item.updatedDaysAgo} days ago
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ₦{item.price.toLocaleString()}
              </span>
              <Button variant="ghost" size="sm" className="text-teal-600">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const MenuItemTableRow = ({ item }: { item: MenuItem }) => {
    return (
      <TableRow>
        <TableCell>
          <div className="flex items-center w-12 h-12 relative space-x-3">
            <Image
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded object-cover"
              fill
            />
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-500">{item.description}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>₦{item.price.toLocaleString()}</TableCell>
        <TableCell>{item.category}</TableCell>
        <TableCell>{item.menuType}</TableCell>
        <TableCell>{item.mealTimes.join(", ")}</TableCell>
        <TableCell>{item.orders}</TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </TableCell>
        <TableCell>
          <Badge
            variant={item.status === "available" ? "default" : "secondary"}
            className={
              item.status === "available"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {item.status === "available" ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        <TableCell>
          <Switch checked={item.isActive} />
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Menu Management
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            size="sm"
            onClick={() => router.push("/vendorDashboard/menu/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Menu
          </Button>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search menu"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filter
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={
                    viewMode === "table" ? "bg-gray-900 text-white" : ""
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-gray-900 text-white" : ""
                  }
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items */}
      <div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="text-sm"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {viewMode === "table" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Menu name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Menu Type</TableHead>
                      <TableHead>Meal Times</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <MenuItemTableRow key={item.id} item={item} />
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">No items found</div>
              <Button
                variant="outline"
                onClick={() => router.push("/vendorDashboard/menu/add")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </div>
          )}
        </Tabs>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Page 1 of 30</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <div className="flex space-x-1">
            {[1, 2, 3, "...", 10, 11, 12].map((page, index) => (
              <Button
                key={index}
                variant={page === 1 ? "default" : "ghost"}
                size="sm"
                className={page === 1 ? "bg-teal-600 hover:bg-teal-700" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
