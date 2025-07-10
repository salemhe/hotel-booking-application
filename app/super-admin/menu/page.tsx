"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Download,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Calendar,
  MapPin,
  Menu as MenuIcon,
  CreditCard,
  Users,
  Settings,
  LogOut,
  UtensilsCrossed,
  Home,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/super-admin/dashboard" },
  { icon: Calendar, label: "Reservations", href: "/super-admin/reservations" },
  { icon: MapPin, label: "Branches", href: "/super-admin/branches" },
  { icon: UtensilsCrossed, label: "Menu Management", href: "/super-admin/menu" },
  { icon: CreditCard, label: "Payments", href: "/super-admin/payments" },
  { icon: Users, label: "Staff", href: "/super-admin/staff" },
  { icon: Settings, label: "Settings", href: "/super-admin/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

const menuItems = [
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
  const [activeMenuTab, setActiveMenuTab] = useState<'allMenu' | 'allMenuItems'>('allMenuItems');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const pathname = usePathname();

  // For the table view
  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create Menu form state
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [menuType, setMenuType] = useState("a-la-carte");
  const [mealTypes, setMealTypes] = useState<string[]>(["breakfast"]);
  const [showMenuOnApp, setShowMenuOnApp] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [priceType, setPriceType] = useState("fixed");
  const [fixedPrice, setFixedPrice] = useState("10,000");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMealTypeToggle = (mealType: string) => {
    setMealTypes((prev) => (prev.includes(mealType) ? prev.filter((type) => type !== mealType) : [...prev, mealType]));
  };
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload logic here
      console.log("File dropped:", e.dataTransfer.files[0]);
    }
  };
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload logic here
      console.log("File selected:", e.target.files[0]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-teal-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-teal-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-teal-800 font-bold text-sm">B</span>
            </div>
            <span className="font-semibold text-lg">Bookies</span>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 py-4">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center space-x-3 px-6 py-3 cursor-pointer transition-colors rounded-r-lg ${
                  isActive ? "bg-teal-700 border-r-4 border-white" : "hover:bg-teal-700"
                }`}
                prefetch={false}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Menu Management page</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search"
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>JE</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <div className="text-sm font-medium">Joseph Eyekowin</div>
                      <div className="text-xs text-gray-500">Admin</div>
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6">
          {showCreateMenu ? (
            // Create Menu Form
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">B</span>
                      </div>
                      <span className="text-xl font-semibold text-gray-900">Bookies</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-sm">Create Menu</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">JE</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Joseph Eyebolam</div>
                        <div className="text-gray-500">Admin</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              </header>
              {/* Progress Steps */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">1</span>
                    </div>
                    <span className="text-sm font-medium text-teal-600">Menu</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">2</span>
                    </div>
                    <span className="text-sm text-gray-600">Add menu items</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">3</span>
                    </div>
                    <span className="text-sm text-gray-600">Payment</span>
                  </div>
                </div>
              </div>
              {/* Main Content */}
              <div className="max-w-2xl mx-auto p-6">
                <div className="space-y-6">
                  {/* Menu Name */}
                  <div className="space-y-2">
                    <Label htmlFor="menu-name" className="text-sm font-medium text-gray-700">
                      Menu name*
                    </Label>
                    <div className="relative">
                      <Input
                        id="menu-name"
                        placeholder="e.g John Platter"
                        value={menuName}
                        onChange={(e) => setMenuName(e.target.value)}
                        maxLength={50}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                        {menuName.length}/50
                      </span>
                    </div>
                  </div>
                  {/* Cover Image */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Cover Image (Optional)</Label>
                    <Card
                      className={`border-2 border-dashed transition-colors ${dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300"}`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="space-y-4">
                          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Drag and drop an image here, or</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleFileSelect}
                              className="text-teal-600 border-teal-600 hover:bg-teal-50 bg-transparent"
                            >
                              Browse Files
                            </Button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </div>
                          <p className="text-xs text-gray-500">JPG, PNG OR 4 Max 5MB</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  {/* Menu Description */}
                  <div className="space-y-2">
                    <Label htmlFor="menu-description" className="text-sm font-medium text-gray-700">
                      Menu Description (Optional)
                    </Label>
                    <Textarea
                      id="menu-description"
                      placeholder="Add a short description or notes about this menu"
                      value={menuDescription}
                      onChange={(e) => setMenuDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  {/* Menu Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Menu Type</Label>
                    <RadioGroup value={menuType} onValueChange={setMenuType} className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="a-la-carte" id="a-la-carte" />
                        <Label htmlFor="a-la-carte" className="text-sm">A la Carte</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buffet" id="buffet" />
                        <Label htmlFor="buffet" className="text-sm">Buffet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="set-menu" id="set-menu" />
                        <Label htmlFor="set-menu" className="text-sm">Set Menu</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tasting-menu" id="tasting-menu" />
                        <Label htmlFor="tasting-menu" className="text-sm">Tasting Menu</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="takeaway" id="takeaway" />
                        <Label htmlFor="takeaway" className="text-sm">Takeaway</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* Menu Availability */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Menu Availability (Meal Type)</Label>
                    <div className="flex flex-wrap gap-3">
                      {["breakfast", "brunch", "lunch", "dinner", "late-night", "all-day"].map((mealType) => (
                        <Button
                          key={mealType}
                          variant={mealTypes.includes(mealType) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleMealTypeToggle(mealType)}
                          className={mealTypes.includes(mealType) ? "bg-teal-600 hover:bg-teal-700" : ""}
                        >
                          {mealType.charAt(0).toUpperCase() + mealType.slice(1).replace("-", " ")}
                        </Button>
                      ))}
                    </div>
                  </div>
                  {/* Menu Availability Toggle */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Menu Availability</Label>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-sm text-gray-900">Show menu on this app</div>
                        <div className="text-xs text-gray-600">Make this menu visible to customers</div>
                      </div>
                      <Switch checked={showMenuOnApp} onCheckedChange={setShowMenuOnApp} />
                    </div>
                  </div>
                  {/* Assign to Branches */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Assign to Branches</Label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branches" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="branch1">Branch 1</SelectItem>
                        <SelectItem value="branch2">Branch 2</SelectItem>
                        <SelectItem value="branch3">Branch 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Price */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">Price</Label>
                    <RadioGroup value={priceType} onValueChange={setPriceType} className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="fixed-price" />
                          <Label htmlFor="fixed-price" className="text-sm">Fixed Price</Label>
                        </div>
                        {priceType === "fixed" && (
                          <div className="ml-6">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">₦</span>
                              <Input
                                value={fixedPrice}
                                onChange={(e) => setFixedPrice(e.target.value)}
                                className="pl-8"
                                placeholder="10,000"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="per-item" id="per-item" />
                        <Label htmlFor="per-item" className="text-sm">Price per item</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
                    <Button variant="outline" className="px-8 bg-transparent" onClick={() => setShowCreateMenu(false)}>
                      Cancel
                    </Button>
                    <Button className="px-8 bg-teal-600 hover:bg-teal-700">Continue to Menu Item</Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Menu Management</h2>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </Button>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Menu Item</span>
                  </Button>
                  <Button className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700" onClick={() => setShowCreateMenu(true)}>
                    <Plus className="w-4 h-4" />
                    <span>Add Menu</span>
                  </Button>
                </div>
              </div>
              {/* Filters and Controls */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={activeMenuTab === 'allMenu' ? 'default' : 'outline'}
                    className={`text-teal-600 border-teal-600 bg-transparent ${activeMenuTab === 'allMenu' ? 'bg-teal-600 text-white' : ''}`}
                    onClick={() => setActiveMenuTab('allMenu')}
                  >
                    All Menu
                  </Button>
                  <Button
                    variant={activeMenuTab === 'allMenuItems' ? 'default' : 'ghost'}
                    className={activeMenuTab === 'allMenuItems' ? 'bg-teal-600 text-white' : ''}
                    onClick={() => setActiveMenuTab('allMenuItems')}
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
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Category">All Category</SelectItem>
                      <SelectItem value="A la Carte">A la Carte</SelectItem>
                      <SelectItem value="Buffet">Buffet</SelectItem>
                      <SelectItem value="Fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Advanced Filter */}
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
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
              {activeMenuTab === 'allMenu' ? (
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
                      {filteredItems.map((item) => (
                        <TableRow key={item.id} className="text-black">
                          <TableCell className="text-black">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium text-black">{item.name}</TableCell>
                          <TableCell className="text-black">₦{item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-black">{item.type}</TableCell>
                          <TableCell className="text-black">{item.mealTimes.join(", ")}</TableCell>
                          <TableCell className="text-black">{item.items}</TableCell>
                          <TableCell className="text-black">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs text-black">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs text-black">
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
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* Pagination */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">Page 1 of 30</div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600">
                        1
                      </Button>
                      <Button variant="outline" size="sm">
                        2
                      </Button>
                      <Button variant="outline" size="sm">
                        3
                      </Button>
                      <span className="text-gray-400">...</span>
                      <Button variant="outline" size="sm">
                        10
                      </Button>
                      <Button variant="outline" size="sm">
                        11
                      </Button>
                      <Button variant="outline" size="sm">
                        12
                      </Button>
                      <Button variant="outline" size="sm">
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
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-white/90">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mr-1" />
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg">{item.price}</span>
                          <Button variant="link" className="text-teal-600 p-0">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
