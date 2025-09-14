"use client";
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, DollarSign, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Menu, 2: Add Menu Items, 3: Payment
  const [menuItemName, setMenuItemName] = useState("");
  const [menuItemPrice, setMenuItemPrice] = useState("");
  const [menuItems, setMenuItems] = useState<Array<Record<string, unknown>>>(
    []
  );
  const [paymentError] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [newMenu, setNewMenu] = useState<{
    dishName: string;
    description: string;
    type: string[];
    mealTypes: string[];
    showOnApp: boolean;
    branch: string;
    priceType: string;
    fixedPrice: string;
    items: Array<Record<string, unknown>>;
    itemImage: File | null;
    payment: { method: string; details: string };
  }>({
    dishName: "",
    description: "",
    type: [],
    mealTypes: [],
    showOnApp: true,
    branch: "",
    priceType: "fixed",
    fixedPrice: "",
    items: [],
    itemImage: null,
    payment: { method: "", details: "" },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [image, setImage ] = useState('');

  // File select handler for file upload
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // File change handler for file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        // setImage(ev.target?.result as string);
        setNewMenu({ ...newMenu, itemImage: file });
      };
      reader.readAsDataURL(file);
      // Handle file upload logic here
      console.log("File selected:", file);
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
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        // setImage(ev.target?.result as string);
        setNewMenu({ ...newMenu, itemImage: file });
      };
      reader.readAsDataURL(file);
      // Handle file upload logic here
      console.log("File dropped:", e.dataTransfer.files[0]);
    }
  };

  // Menu Step Handlers
  const handleMenuContinue = () => {
    if (newMenu) {
        setMenuItems([{ name: "Hello" }])
      setStep(2);
    }
  };

  function handleAddMenuItem(): void {
    throw new Error("Function not implemented.");
  }

//   function handlePaymentSave(): void {
//     throw new Error("Function not implemented.");
//   }

  return (
    <div>
      <div className="bg-white border-b sticky z-20 top-0 border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-8">Create Menu Header</div>
      </div>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6">
          <div className="px-6 w-full py-4">
            <div className="flex items-center space-x-3 max-w-2xl mx-auto">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 1 ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  {" "}
                  <span
                    className={`text-sm ${
                      step === 1 ? "text-white" : "text-gray-600"
                    }`}
                  >
                    1
                  </span>{" "}
                </div>
                <span
                  className={`text-sm font-medium hidden md:inline ${
                    step === 1 ? "text-teal-600" : "text-gray-600"
                  }`}
                >
                  Menu
                </span>
              </div>
              <div className="flex-1 h-1 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 2 ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  {" "}
                  <span
                    className={`text-sm ${
                      step === 2 ? "text-white" : "text-gray-600"
                    }`}
                  >
                    2
                  </span>{" "}
                </div>
                <span
                  className={`text-sm font-medium hidden md:inline ${
                    step === 2 ? "text-teal-600" : "text-gray-600"
                  }`}
                >
                  Add menu items
                </span>
              </div>
              <div className="flex-1 h-1 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 3 ? "bg-teal-600" : "bg-gray-300"
                  }`}
                >
                  {" "}
                  <span
                    className={`text-sm ${
                      step === 3 ? "text-white" : "text-gray-600"
                    }`}
                  >
                    3
                  </span>{" "}
                </div>
                <span
                  className={`text-sm font-medium hidden md:inline ${
                    step === 3 ? "text-teal-600" : "text-gray-600"
                  }`}
                >
                  Payment
                </span>
              </div>
            </div>
          </div>
          {step === 1 && (
            <div className="space-y-6 bg-white border p-6 md:rounded-2xl grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                {/* Menu Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="menu-name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Menu name*
                  </Label>
                  <div className="relative">
                    <Input
                      id="menu-name"
                      placeholder="e.g John Platter"
                      value={String(newMenu.dishName)}
                      onChange={(e) =>
                        setNewMenu({ ...newMenu, dishName: e.target.value })
                      }
                      maxLength={50}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                      {String(newMenu.dishName).length}/50
                    </span>
                  </div>
                </div>

                {/* Menu Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="menu-description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Menu Description (Optional)
                  </Label>
                  <Textarea
                    id="menu-description"
                    placeholder="Add a short description or notes about this menu"
                    value={String(newMenu.description)}
                    className="resize-none"
                    onChange={(e) =>
                      setNewMenu({
                        ...newMenu,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                  />
                </div>
                {/* Menu Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Menu Type
                  </Label>
                </div>
                <div className="flex flex-wrap gap-3 items-start">
                  {[
                    "A la Carte",
                    "Buffet",
                    "Set Menu",
                    "Tasting Menu",
                    "Take Away",
                  ].map((menuType, i) => (
                    <Label key={i} className="flex gap-2  items-start">
                      <Checkbox
                        checked={newMenu.type?.includes(menuType)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? setNewMenu({
                                ...newMenu,
                                type: [...newMenu.type, menuType],
                              })
                            : setNewMenu({
                                ...newMenu,
                                type: newMenu.type?.filter(
                                  (value) => value !== menuType
                                ),
                              });
                        }}
                      />
                      {menuType}
                    </Label>
                  ))}
                </div>
                {/* Menu Availability */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Menu Availability (Meal Time)
                  </Label>
                  <div className="flex flex-wrap gap-3 items-start">
                    {[
                      "Breakfast",
                      "Brunch",
                      "Lunch",
                      "Dinner",
                      "Late-night",
                      "All-day",
                    ].map((mealType, i) => (
                      <Label key={i} className="flex gap-2  items-start">
                        <Checkbox
                          checked={newMenu.mealTypes?.includes(mealType)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? setNewMenu({
                                  ...newMenu,
                                  mealTypes: [...newMenu.mealTypes, mealType],
                                })
                              : setNewMenu({
                                  ...newMenu,
                                  mealTypes: newMenu.mealTypes?.filter(
                                    (value) => value !== mealType
                                  ),
                                });
                          }}
                        />
                        {mealType}
                      </Label>
                    ))}
                  </div>
                  {/* Price */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Price
                    </Label>
                    <RadioGroup
                      defaultValue={String(newMenu.priceType)}
                      onValueChange={(val) => {
                        setNewMenu({ ...newMenu, priceType: val });
                        console.log(val, newMenu.priceType);
                      }}
                      className="space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fixed" id="fixed-price" />
                          <Label htmlFor="fixed-price" className="text-sm">
                            Fixed Price
                          </Label>
                        </div>
                        {newMenu.priceType === "fixed" && (
                          <div className="ml-6">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600">
                                ₦
                              </span>
                              <Input
                                value={String(newMenu.fixedPrice)}
                                onChange={(e) =>
                                  setNewMenu({
                                    ...newMenu,
                                    fixedPrice: e.target.value,
                                  })
                                }
                                disabled={newMenu.priceType !== "fixed"}
                                className="pl-8"
                                placeholder="10,000"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="per-item" id="per-item" />
                        <Label htmlFor="per-item" className="text-sm">
                          Price per item
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              {/* Cover Image */}
              <div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Cover Image (Optional)
                  </Label>
                  <Card
                    className={`border-2 border-dashed transition-colors ${
                      dragActive
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-300"
                    }`}
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
                          <p className="text-sm text-gray-600 mb-2">
                            Drag and drop an image here, or
                          </p>
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
                        {newMenu.itemImage ? (
                          <p className="text-xs text-gray-500">
                            {(newMenu.itemImage as File).name}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                            JPG, PNG OR 4 Max 5MB
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Menu Availability Toggle */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Menu Availability
                  </Label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm text-gray-900">
                        Show menu on this app
                      </div>
                      <div className="text-xs text-gray-600">
                        Make this menu visible to customers
                      </div>
                    </div>
                    <Switch
                      checked={Boolean(newMenu.showOnApp)}
                      onCheckedChange={(e) =>
                        setNewMenu({
                          ...newMenu,
                          showOnApp: e,
                        })
                      }
                    />
                  </div>
                </div>
                {/* Assign to Branches */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Assign to Branches
                  </Label>
                  <select
                    value={String(newMenu.branch)}
                    onChange={(e) =>
                      setNewMenu({ ...newMenu, branch: e.target.value })
                    }
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <option value="">Select branches</option>
                    <option value="branch1">Branch 1</option>
                    <option value="branch2">Branch 2</option>
                    <option value="branch3">Branch 3</option>
                  </select>
                </div>
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
                  onChange={(e) => setMenuItemName(e.target.value)}
                />
                <Input
                  placeholder="Price"
                  value={menuItemPrice}
                  onChange={(e) => setMenuItemPrice(e.target.value)}
                  type="number"
                />
                <Button onClick={handleAddMenuItem}>Add</Button>
              </div>
              <ul className="list-disc pl-6">
                {menuItems.map((item, idx) => (
                  <li key={idx}>
                    {String(item.name)} - ₦{String(item.price)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment</h2>
              <Label className="text-base font-medium text-gray-700 mb-2 block">
                Select Payment Method
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  className={`cursor-pointer border-2 transition-colors ${
                    paymentMethod === "transfer"
                      ? "border-teal-600 shadow-lg"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("transfer")}
                >
                  <CardContent className="flex flex-col items-center p-6">
                    <Banknote className="w-8 h-8 text-teal-600 mb-2" />
                    <span className="font-semibold text-lg">Bank Transfer</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Pay via direct bank transfer
                    </span>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer border-2 transition-colors ${
                    paymentMethod === "card"
                      ? "border-teal-600 shadow-lg"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CardContent className="flex flex-col items-center p-6">
                    {/* <CardIcon className="w-8 h-8 text-teal-600 mb-2" /> */}
                    <span className="font-semibold text-lg">Card Payment</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Pay with debit/credit card
                    </span>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer border-2 transition-colors ${
                    paymentMethod === "cash"
                      ? "border-teal-600 shadow-lg"
                      : "border-gray-200"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <CardContent className="flex flex-col items-center p-6">
                    <DollarSign className="w-8 h-8 text-teal-600 mb-2" />
                    <span className="font-semibold text-lg">Cash</span>
                    <span className="text-xs text-gray-500 mt-1">
                      Pay with cash at the venue
                    </span>
                  </CardContent>
                </Card>
              </div>
              {paymentMethod && (
                <div className="space-y-2 mt-6">
                  <Label className="text-sm font-medium text-gray-700">
                    Payment Details
                  </Label>
                  <Input
                    placeholder={`Enter ${paymentMethod} details`}
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                  />
                </div>
              )}
              {paymentError && (
                <div className="text-red-600 text-sm font-medium">
                  {paymentError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="bg-white border-b sticky bottom-0 border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-8 justify-between">
          {step === 1 ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  router.push("/super-administrator/menu");
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#0A6C6D] hover:bg-[#0A6C61] hover:cursor-pointer"
                onClick={() => {
                  handleMenuContinue();
                  console.log("Hi");
                }}
              >
                Continue to Menu Item
              </Button>
            </>
          ) : (
            <>
              {step === 2 ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push("/super-administrator/menu");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#0A6C6D] hover:bg-[#0A6C61] hover:cursor-pointer"
                    onClick={() => {
                      handleMenuContinue();
                      console.log("Hi");
                    }}
                  >
                    Continue to Menu Item
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push("/super-administrator/menu");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#0A6C6D] hover:bg-[#0A6C61] hover:cursor-pointer"
                    onClick={() => {
                      handleMenuContinue();
                      console.log("Hi");
                    }}
                  >
                    Continue to Menu Item
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
