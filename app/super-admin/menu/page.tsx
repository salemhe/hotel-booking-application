"use client";

import { useState, useRef } from "react";
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
    ImageIcon,
  Banknote,
  CreditCard as CardIcon,
  DollarSign,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const [activeMenuTab, setActiveMenuTab] = useState<'allMenu' | 'allMenuItems'>('allMenuItems');
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [step, setStep] = useState(1); // 1: Menu, 2: Add Menu Items, 3: Payment
  const [menuList] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('superAdminMenus');
      if (saved) return JSON.parse(saved);
    }
    return initialMenuItems;
  });
  const [newMenu, setNewMenu] = useState<Record<string, unknown>>({
    name: '',
    description: '',
    type: 'a-la-carte',
    mealTypes: [],
    showOnApp: true,
    branch: '',
    priceType: 'fixed',
    fixedPrice: '',
    items: [],
    payment: { method: '', details: '' },
  });
  const [menuItemName, setMenuItemName] = useState('');
  const [menuItemPrice, setMenuItemPrice] = useState('');
  const [menuItems, setMenuItems] = useState<Array<Record<string, unknown>>>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File select handler for file upload
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // File change handler for file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Handle file upload logic here
      console.log("File selected:", e.target.files[0]);
    }
  };

  // Drag and drop handlers for file upload
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

  // For the table view
  const filteredItems = menuList.filter((item: { name: string }) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Menu Step Handlers
  const handleMenuContinue = () => {
    setStep(2);
  };

  // Sidebar collapse logic

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar removed: now handled by layout.tsx */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 w-full" style={{ marginLeft: 0 }}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Menu Management page</h1>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-2 md:p-6 overflow-x-auto">
          {showCreateMenu ? (
            <div className="min-h-screen bg-gray-50">
              {/* Progress Steps */}
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-teal-600' : 'bg-gray-300'}`}> <span className={`text-sm ${step === 1 ? 'text-white' : 'text-gray-600'}`}>1</span> </div>
                    <span className={`text-sm font-medium ${step === 1 ? 'text-teal-600' : 'text-gray-600'}`}>Menu</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-teal-600' : 'bg-gray-300'}`}> <span className={`text-sm ${step === 2 ? 'text-white' : 'text-gray-600'}`}>2</span> </div>
                    <span className={`text-sm font-medium ${step === 2 ? 'text-teal-600' : 'text-gray-600'}`}>Add menu items</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 3 ? 'bg-teal-600' : 'bg-gray-300'}`}> <span className={`text-sm ${step === 3 ? 'text-white' : 'text-gray-600'}`}>3</span> </div>
                    <span className={`text-sm font-medium ${step === 3 ? 'text-teal-600' : 'text-gray-600'}`}>Payment</span>
                  </div>
                </div>
              </div>
              {/* Step Content */}
              <div className="max-w-2xl mx-auto p-6">
                {step === 1 && (
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
                          value={String(newMenu.name)}
                          onChange={e => setNewMenu({ ...newMenu, name: e.target.value })}
                          maxLength={50}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                          {String(newMenu.name).length}/50
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
                                variant="secondary"
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
                        value={String(newMenu.description)}
                        onChange={e => setNewMenu({ ...newMenu, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    {/* Menu Type */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Menu Type</Label>
                      <RadioGroup value={String(newMenu.type)} onValueChange={val => setNewMenu({ ...newMenu, type: val })} className="flex flex-wrap gap-4">
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
                            variant={(newMenu.mealTypes as string[]).includes(mealType) ? "default" : "secondary"}
                            size="sm"
                            onClick={() => {
                              setNewMenu({
                                ...newMenu,
                                mealTypes: (newMenu.mealTypes as string[]).includes(mealType)
                                  ? (newMenu.mealTypes as string[]).filter((type: string) => type !== mealType)
                                  : [...(newMenu.mealTypes as string[]), mealType],
                              });
                            }}
                            className={newMenu.mealTypes.includes(mealType) ? "bg-teal-600 hover:bg-teal-700" : ""}
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
                        <Switch checked={newMenu.showOnApp} onCheckedChange={val => setNewMenu({ ...newMenu, showOnApp: val })} />
                      </div>
                    </div>
                    {/* Assign to Branches */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Assign to Branches</Label>
                      <select
                        value={newMenu.branch}
                        onChange={e => setNewMenu({ ...newMenu, branch: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      >
                        <option value="">Select branches</option>
                        <option value="branch1">Branch 1</option>
                        <option value="branch2">Branch 2</option>
                        <option value="branch3">Branch 3</option>
                      </select>
                    </div>
                    {/* Price */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-gray-700">Price</Label>
                      <RadioGroup value={newMenu.priceType} onValueChange={val => setNewMenu({ ...newMenu, priceType: val })} className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fixed" id="fixed-price" />
                            <Label htmlFor="fixed-price" className="text-sm">Fixed Price</Label>
                          </div>
                          {newMenu.priceType === "fixed" && (
                            <div className="ml-6">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">₦</span>
                                <Input
                                  value={newMenu.fixedPrice}
                                  onChange={e => setNewMenu({ ...newMenu, fixedPrice: e.target.value })}
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
                      <Button variant="outline" className="px-8 bg-transparent" onClick={() => { setShowCreateMenu(false); setStep(1); setMenuItems([]); }}>
                        Cancel
                      </Button>
                      <Button className="px-8 bg-teal-600 hover:bg-teal-700" onClick={handleMenuContinue}>
                        Continue to Menu Item
                      </Button>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">Add Menu Items</h2>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Menu Item Name"
                        value={menuItemName}
                        onChange={e => setMenuItemName(e.target.value)}
                      />
                      <Input
                        placeholder="Price"
                        value={menuItemPrice}
                        onChange={e => setMenuItemPrice(e.target.value)}
                        type="number"
                      />
                      <Button onClick={handleAddMenuItem}>Add</Button>
                    </div>
                    <ul className="list-disc pl-6">
                      {menuItems.map((item, idx) => (
                        <li key={idx}>{item.name} - ₦{item.price}</li>
                      ))}
                    </ul>
                    <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
                      <Button variant="outline" className="px-8 bg-transparent" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button className="px-8 bg-teal-600 hover:bg-teal-700" onClick={handleMenuItemsContinue}>
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment</h2>
                    <Label className="text-base font-medium text-gray-700 mb-2 block">Select Payment Method</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className={`cursor-pointer border-2 transition-colors ${paymentMethod === 'transfer' ? 'border-teal-600 shadow-lg' : 'border-gray-200'}`}
                        onClick={() => setPaymentMethod('transfer')}>
                        <CardContent className="flex flex-col items-center p-6">
                          <Banknote className="w-8 h-8 text-teal-600 mb-2" />
                          <span className="font-semibold text-lg">Bank Transfer</span>
                          <span className="text-xs text-gray-500 mt-1">Pay via direct bank transfer</span>
                        </CardContent>
                      </Card>
                      <Card className={`cursor-pointer border-2 transition-colors ${paymentMethod === 'card' ? 'border-teal-600 shadow-lg' : 'border-gray-200'}`}
                        onClick={() => setPaymentMethod('card')}>
                        <CardContent className="flex flex-col items-center p-6">
                          <CardIcon className="w-8 h-8 text-teal-600 mb-2" />
                          <span className="font-semibold text-lg">Card Payment</span>
                          <span className="text-xs text-gray-500 mt-1">Pay with debit/credit card</span>
                        </CardContent>
                      </Card>
                      <Card className={`cursor-pointer border-2 transition-colors ${paymentMethod === 'cash' ? 'border-teal-600 shadow-lg' : 'border-gray-200'}`}
                        onClick={() => setPaymentMethod('cash')}>
                        <CardContent className="flex flex-col items-center p-6">
                          <DollarSign className="w-8 h-8 text-teal-600 mb-2" />
                          <span className="font-semibold text-lg">Cash</span>
                          <span className="text-xs text-gray-500 mt-1">Pay with cash at the venue</span>
                        </CardContent>
                      </Card>
                    </div>
                    {paymentMethod && (
                      <div className="space-y-2 mt-6">
                        <Label className="text-sm font-medium text-gray-700">Payment Details</Label>
                        <Input
                          placeholder={`Enter ${paymentMethod} details`}
                          value={paymentDetails}
                          onChange={e => setPaymentDetails(e.target.value)}
                        />
                      </div>
                    )}
                    {paymentError && <div className="text-red-600 text-sm font-medium">{paymentError}</div>}
                    <div className="flex justify-between pt-8 border-t border-gray-200 mt-8">
                      <Button variant="outline" className="px-8 bg-transparent" onClick={() => setStep(2)}>
                        Back
                      </Button>
                      <Button className="px-8 bg-teal-600 hover:bg-teal-700" onClick={handlePaymentSave}>
                        Save
                      </Button>
                    </div>
                  </div>
                )}
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
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-40 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <option value="All Category">All Category</option>
                    <option value="A la Carte">A la Carte</option>
                    <option value="Buffet">Buffet</option>
                    <option value="Fixed">Fixed</option>
                  </select>
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
                          <TableCell className="text-black">₦{item.price?.toLocaleString()}</TableCell>
                          <TableCell className="text-black">{item.type}</TableCell>
                          <TableCell className="text-black">{Array.isArray(item.mealTimes) ? item.mealTimes.join(", ") : ''}</TableCell>
                          <TableCell className="text-black">{item.items?.length || 0}</TableCell>
                          <TableCell className="text-black">
                            <div className="flex flex-wrap gap-1">
                              {item.tags?.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs text-black">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags && item.tags.length > 2 && (
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
