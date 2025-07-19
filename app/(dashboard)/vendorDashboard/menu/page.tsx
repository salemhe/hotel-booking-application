"use client";

import React, { useState } from "react";
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
  Upload,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Tabs,
  TabsContent,
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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import { useRouter } from "next/navigation";

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

const mockMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Joe's Platter",
    description: "Hummus, baba ghanoush, tzatziki, pita bread",
    price: 25000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fa21d330fcea4493ebbafb7b5d8b57a14?format=webp&width=400",
    category: "main-dish",
    status: "available",
    orders: 6,
    menuType: "A la Carte",
    mealTimes: ["Lunch", "Dinner"],
    tags: ["Best seller", "Sweet", "Savory"],
    isActive: true,
    updatedDaysAgo: 3,
  },
  {
    id: "2",
    name: "Mezze Platter",
    description: "Hummus, baba ghanoush, tzatzaki, pita bread",
    price: 25000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fa21d330fcea4493ebbafb7b5d8b57a14?format=webp&width=400",
    category: "main-dish",
    status: "available",
    orders: 6,
    menuType: "A la Carte",
    mealTimes: ["Lunch", "Dinner"],
    tags: ["Best seller", "Sweet", "Savory"],
    isActive: true,
    updatedDaysAgo: 3,
  },
  {
    id: "3",
    name: "Weekend Buffet",
    description: "Weekend special buffet selection",
    price: 45000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fa21d330fcea4493ebbafb7b5d8b57a14?format=webp&width=400",
    category: "buffet",
    status: "available",
    orders: 12,
    menuType: "Buffet",
    mealTimes: ["Brunch", "Dinner"],
    tags: ["Vegan Options", "Sweet", "Savory"],
    isActive: true,
    updatedDaysAgo: 5,
  },
  {
    id: "4",
    name: "Kid's Happy Menu",
    description: "Special menu for children",
    price: 25000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fa21d330fcea4493ebbafb7b5d8b57a14?format=webp&width=400",
    category: "fixed",
    status: "available",
    orders: 4,
    menuType: "Fixed",
    mealTimes: ["All Day"],
    tags: ["Kids", "Sweet", "Small Bites"],
    isActive: true,
    updatedDaysAgo: 2,
  },
  {
    id: "5",
    name: "Chef's Special",
    description: "Daily chef special selection",
    price: 25000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fa21d330fcea4493ebbafb7b5d8b57a14?format=webp&width=400",
    category: "main-dish",
    status: "available",
    orders: 6,
    menuType: "A la Carte",
    mealTimes: ["Lunch", "Dinner"],
    tags: ["Best seller", "Sweet", "Savory"],
    isActive: true,
    updatedDaysAgo: 1,
  },
  {
    id: "6",
    name: "Grilled Salmon",
    description: "Fresh grilled salmon with herbs",
    price: 25000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fa21d330fcea4493ebbafb7b5d8b57a14?format=webp&width=400",
    category: "main-dish",
    status: "available",
    orders: 6,
    menuType: "Buffet, A la carte",
    mealTimes: ["Lunch", "Dinner"],
    tags: ["Best seller", "Sweet", "Savory"],
    isActive: true,
    updatedDaysAgo: 4,
  },
  {
    id: "7",
    name: "Chicken springrolls",
    description: "Crispy chicken spring rolls",
    price: 7000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fa21d330fcea4493ebbafb7b5d8b57a14?format=webp&width=400",
    category: "starters",
    status: "unavailable",
    orders: 0,
    menuType: "Set Menu, Buffet",
    mealTimes: ["All day"],
    tags: ["Sweet", "Savory"],
    isActive: false,
    updatedDaysAgo: 1,
  },
];

export default function MenuManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const categories = [
    { value: "all", label: "All Category" },
    { value: "main-dish", label: "Main Dish" },
    { value: "starters", label: "Starters" },
    { value: "desserts", label: "Desserts" },
    { value: "beverages", label: "Drinks" },
    { value: "sides", label: "Sides" },
  ];

  const filteredItems = mockMenuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getItemsByCategory = (category: string) => {
    if (category === "all") return filteredItems;
    return filteredItems.filter((item) => item.category === category);
  };

  const MenuItemCard = ({ item }: { item: MenuItem }) => {
    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-32 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center`;
            }}
          />
          <div className="absolute top-2 left-2">
            <Badge
              variant={item.status === "available" ? "default" : "secondary"}
              className={
                item.status === "available"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            >
              {item.status === "available" ? "Available" : "Unavailable"}
            </Badge>
          </div>
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
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ₦{item.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">
                {item.orders} orders
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items</p>
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => router.push("/vendorDashboard/menu/add")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search menu items..."
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

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {mockMenuItems.length}
              </div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  mockMenuItems.filter((item) => item.status === "available")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {
                  mockMenuItems.filter((item) => item.status === "unavailable")
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Unavailable</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mockMenuItems.reduce((sum, item) => sum + item.orders, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.value}
                  value={category.value}
                  className="text-xs"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent
                key={category.value}
                value={category.value}
                className="mt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getItemsByCategory(category.value).map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>

                {getItemsByCategory(category.value).length === 0 && (
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
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
