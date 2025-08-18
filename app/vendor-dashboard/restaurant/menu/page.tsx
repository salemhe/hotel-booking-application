"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
} from "@/app/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Tabs,
  // TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { AuthService } from "@/app/lib/api/services/auth.service";
import SocketService from "@/app/lib/socket";
import {
  Copy,
  // Upload,
  Download,
  Edit,
  Eye,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/app/components/ui/avatar";
import Image from "next/image";
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
  const [selectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Initialize websocket connection for real-time updates
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const user = AuthService.getUser();
        if (user?.profile?.id) {
          SocketService.connect(user.profile.id, 'vendor');
          SocketService.joinVendorRoom(user.profile.id);

          // Listen for real-time reservation updates
          SocketService.onNewReservation((data) => {
            console.log('New reservation received:', data);
            // You can add a toast notification here
          });

          SocketService.onReservationUpdate((data) => {
            console.log('Reservation updated:', data);
          });

          // Listen for menu updates
          SocketService.onMenuUpdate((data) => {
            console.log('Menu update received:', data);
          });
        }
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();

    return () => {
      const user = AuthService.getUser();
      if (user?.profile?.id) {
        SocketService.leaveVendorRoom(user.profile.id);
      }
      SocketService.removeListener('new_reservation');
      SocketService.removeListener('reservation_updated');
      SocketService.removeListener('menu_updated');
    };
  }, []);

  const categories = [
    { value: "all", label: "All Category" },
    { value: "main-dish", label: "Main Dish" },
    { value: "starters", label: "Starters" },
    // { value: "desserts", label: "Desserts" },
    // { value: "beverages", label: "Drinks" },
    // { value: "sides", label: "Sides" },
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

  // const getItemsByCategory = (category: string) => {
  //   if (category === "all") return filteredItems;
  //   return filteredItems.filter((item) => item.category === category);
  // };

  const MenuItemCard = ({ item }: { item: MenuItem }) => {
    return (
      <Card className="overflow-hidden">
        <div className="relative bg-amber-600">
          <Image
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover"
            width={400}
            height={200}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop&crop=center`;
            }}
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
              {/* <p className="text-xs text-gray-500">{item.orders} items</p>
              <p className="text-xs text-gray-500">
                Updated {item.updatedDaysAgo} days ago
              </p> */}
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
        <TableCell className="text-sm text-gray-600">
 <Image
              src={item.image}
              alt={item.name}
              className="w-12 h-12 rounded object-cover"
              width={48}
              height={48}
            />
        </TableCell>
        <TableCell>
          <div className="flex items-center w-12 h-12 relative space-x-3">
           
            <div>
              <div className="font-medium">{item.name}</div>
              {/* <div className="text-sm text-gray-500">{item.description}</div> */}
            </div>
          </div>
        </TableCell>
        <TableCell>₦{item.price.toLocaleString()}</TableCell>
        {/* <TableCell>{item.category}</TableCell> */}
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
    <div className="space-y-6 p-6 mt-20">
      {/* Header */}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button> */}
          <div>
            {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Restaurant 1 - HQ</span>
              <span className="text-gray-400">•</span>
              <span>2</span>
            </div> */}
            <h1 className="text-2xl font-bold text-gray-900">
              Menu Management
            </h1>
          </div>
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
      {/* <Card> */}
        
      {/* </Card> */}

      {/* Menu Items */}
      <div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex justify-between items-center">

            <TabsList className="grid  grid-cols-3 h-10.5">
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

          <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 ">
              <div className="relative ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search menu"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10.5"
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

              <Button variant="outline" className="p-2 h-10.5">
                <Filter className="w-4 h-4 mr-2 " />
                Advanced Filter
              </Button>

              <div className="flex border rounded-md p-1">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={
                    viewMode === "table" ? "bg-white text-[#606368]" : ""
                  }
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid" ? "bg-white text-[#606368]" : ""
                  }
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
          </div>

          {viewMode === "table" ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Menu name</TableHead>
                      <TableHead>Price</TableHead>
                      {/* <TableHead>Category</TableHead> */}
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
