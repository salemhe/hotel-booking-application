"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Plus,
  Download,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

// Removed unused sidebarItems

// This will be our real-time menu list (simulate backend)
const initialMenuItems = [
  {
    id: 1,
    name: "Joe's Platter",
    price: 425000,
    type: "A la Carte",
    mealTimes: ["Lunch", "Dinner"],
    items: 6,
    tags: ["Grill order", "Sweet", "Savory"],
    status: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Weekend Buffet",
    price: 445000,
    type: "Buffet",
    mealTimes: ["Brunch", "Dinner"],
    items: 12,
    tags: ["Vegan Options", "Sweet", "Savory"],
    status: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "Kid's Happy Menu",
    price: 425000,
    type: "Fixed",
    mealTimes: ["All Day"],
    items: 4,
    tags: ["Kids", "Sweet", "Grill Bites"],
    status: true,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Chef's Special",
    price: 525000,
    type: "A la Carte",
    mealTimes: ["Lunch", "Dinner"],
    items: 6,
    tags: ["Grill order", "Sweet", "Savory"],
    status: true,
    image: "/placeholder.svg?height=40&width=40",
  },
];

const menuGridItems = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Move Platter",
  description: "Hummus, baba ghanoush, tzatziki, pita bread",
  price: "₹25,000",
  image: "/placeholder.svg?height=200&width=300",
}));

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeMenuTab, setActiveMenuTab] = useState<
    "allMenu" | "allMenuItems"
  >("allMenuItems");
  const [menuList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("superAdminMenus");
      if (saved) return JSON.parse(saved);
    }
    return initialMenuItems;
  });



  // For the table view
  const filteredItems = menuList.filter((item: { name: string }) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sidebar collapse logic

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar removed: now handled by layout.tsx */}
      {/* Main Content */}
      <div
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 w-full"
        style={{ marginLeft: 0 }}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Menu Management page
              </h1>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-2 md:p-6 overflow-x-auto">
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Menu Management
                </h2>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Menu Item</span>
                  </Button>
                  <Button
                    asChild
                    className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700"
                    // onClick={() => setShowCreateMenu(true)}
                  >
                    <Link href="/super-administrator/menu/create">
                      <Plus className="w-4 h-4" />
                      <span>Add Menu</span>
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Filters and Controls */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={
                      activeMenuTab === "allMenu" ? "default" : "secondary"
                    }
                    className={`text-teal-600 border-teal-600 bg-transparent ${
                      activeMenuTab === "allMenu"
                        ? "bg-teal-600 text-white"
                        : ""
                    }`}
                    onClick={() => setActiveMenuTab("allMenu")}
                  >
                    All Menu
                  </Button>
                  <Button
                    variant={
                      activeMenuTab === "allMenuItems" ? "default" : "ghost"
                    }
                    className={
                      activeMenuTab === "allMenuItems"
                        ? "bg-teal-600 text-white"
                        : ""
                    }
                    onClick={() => setActiveMenuTab("allMenuItems")}
                  >
                    All Menu Items
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Search Menu */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search menu"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-40 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <option value="All Category">All Category</option>
                    <option value="A la Carte">A la Carte</option>
                    <option value="Buffet">Buffet</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                  {/* Advanced Filter */}
                  <Button
                    variant="secondary"
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Advanced filter</span>
                  </Button>
                  {/* View Toggle */}
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-r-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-l-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* Tab Content */}
              {activeMenuTab === "allMenu" ? (
                <div className="bg-white rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="text-black">
                        <TableHead className="text-black">Image</TableHead>
                        <TableHead className="text-black">Menu name</TableHead>
                        <TableHead className="text-black">Price</TableHead>
                        <TableHead className="text-black">Menu Type</TableHead>
                        <TableHead className="text-black">Meal Times</TableHead>
                        <TableHead className="text-black">Items</TableHead>
                        <TableHead className="text-black">Tags</TableHead>
                        <TableHead className="text-black">Status</TableHead>
                        <TableHead className="text-black"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.map(
                        (item: {
                          id: number;
                          name: string;
                          price: number;
                          type: string;
                          mealTimes: string[];
                          items: number;
                          tags: string[];
                          status: boolean;
                          image: string;
                        }) => (
                          <TableRow key={item.id} className="text-black">
                            <TableCell className="text-black">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-black">
                              {item.name}
                            </TableCell>
                            <TableCell className="text-black">
                              ₦{item.price?.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-black">
                              {item.type}
                            </TableCell>
                            <TableCell className="text-black">
                              {Array.isArray(item.mealTimes)
                                ? item.mealTimes.join(", ")
                                : ""}
                            </TableCell>
                            <TableCell className="text-black">
                              {item.items || 0}
                            </TableCell>
                            <TableCell className="text-black">
                              <div className="flex flex-wrap gap-1">
                                {item.tags
                                  ?.slice(0, 2)
                                  .map((tag: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="text-xs text-black"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                {item.tags && item.tags.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs text-black"
                                  >
                                    +{item.tags.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-black">
                              <Switch checked={item.status} />
                            </TableCell>
                            <TableCell className="text-black">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                  {/* Pagination */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">Page 1 of 30</div>
                    <div className="flex items-center space-x-2">
                      <Button variant="secondary" size="sm" disabled>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-blue-50 text-blue-600"
                      >
                        1
                      </Button>
                      <Button variant="secondary" size="sm">
                        2
                      </Button>
                      <Button variant="secondary" size="sm">
                        3
                      </Button>
                      <span className="text-gray-400">...</span>
                      <Button variant="secondary" size="sm">
                        10
                      </Button>
                      <Button variant="secondary" size="sm">
                        11
                      </Button>
                      <Button variant="secondary" size="sm">
                        12
                      </Button>
                      <Button variant="secondary" size="sm">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                      : "flex flex-col gap-6 mb-8"
                  }
                >
                  {menuGridItems.map((item) => (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-white/90">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-1" />
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">
                            {item.price}
                          </span>
                          <Button variant="ghost" className="text-teal-600 p-0">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
        </main>
      </div>
    </div>
  );
}
