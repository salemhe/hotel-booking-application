"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  CreditCard,
  CheckCircle,
  Info,
  SkipBackIcon as Skip,
  ChevronsRight,
  Loader2,
  Plus,
  Trash2,
  Star,
} from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import Image from "next/image";
import { getBanks, verifyBankAccount } from "@/app/lib/action";
import { BankCombobox } from "@/app/components/BankComboBox";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { toast } from "sonner";
import API from "@/app/lib/api/axios";
import { useRouter } from "next/navigation";

interface Room {
  roomNumber: string;
  roomType: string;
  price: number;
  capacity: number;
  features: string[];
  amenities: string[];
  roomImages: File[];
  roomDescription: string;
  isAvailable: boolean;
  maintenanceStatus: string;
  stars: number;
}

interface MenuItem {
  vendorId: string;
  addOns: string[];
  availabilityStatus: boolean;
  category: string;
  cuisineType: string;
  dietaryInfo: string[];
  discountPrice: number;
  dishName: string;
  description: string;
  dishImages: File[];
  maxOrderPerCustomer: number;
  portionSize: string;
  preparationTime: number;
  price: number;
  spiceLevel: string;
  stockQuantity: number;
  stars: number;
}

interface BusinessData {
  profileImages: File[];
  paymentVerified: boolean;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankAccountName: string;
  openTime: string;
  closeTime: string;
  businessDescription: string;
  address: string;
  city: string;
  state: string;
  country: string;
  website: string;
  rooms: Room[];
  menuItems: MenuItem[];
  // New fields for restaurants
  cuisines: string[];
  availableSlots: string[];
}

const ROOM_TYPES = [
  "Standard",
  "Deluxe",
  "Suite",
  "Presidential Suite",
  "Family Room",
  "Twin Room",
  "Single Room",
  "Double Room",
];

const ROOM_FEATURES = [
  "Air Conditioning",
  "Balcony",
  "City View",
  "Ocean View",
  "Mountain View",
  "Kitchenette",
  "Living Area",
  "Work Desk",
  "Safe",
  "Minibar",
];

const ROOM_AMENITIES = [
  "WiFi",
  "TV",
  "Room Service",
  "Housekeeping",
  "Laundry",
  "Concierge",
  "Gym Access",
  "Pool Access",
  "Spa Access",
  "Parking",
];

const MAINTENANCE_STATUS = ["Good", "Needs Attention", "Under Maintenance"];

const MENU_CATEGORIES = [
  "Appetizers",
  "Main Course",
  "Desserts",
  "Beverages",
  "Salads",
  "Soups",
  "Sides",
  "Specials",
];

const CUISINE_TYPES = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "Thai",
  "French",
  "American",
  "Mediterranean",
  "Greek",
  "Korean",
  "Vietnamese",
  "Lebanese",
  "Spanish",
  "German",
  "Brazilian",
  "Ethiopian",
  "Moroccan",
  "Turkish",
  "Caribbean",
  "Nigerian",
  "Ghanaian",
  "Kenyan",
  "South African",
];

const DIETARY_INFO = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Halal",
  "Kosher",
  "Low-Carb",
  "Keto",
  "Organic",
];

const SPICE_LEVELS = ["Mild", "Medium", "Hot", "Extra Hot"];

const ADDON_OPTIONS = [
  "Extra Cheese",
  "Extra Sauce",
  "Extra Vegetables",
  "Extra Meat",
  "Side Salad",
  "French Fries",
  "Garlic Bread",
  "Drink",
];

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      const displayTime = new Date(
        `2000-01-01T${timeString}`
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      times.push({ value: timeString, label: displayTime });
    }
  }
  return times;
};

interface Bank {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export default function BusinessProfileSetup() {
  const user = AuthService.getUser();
  const timeOptions = generateTimeOptions();
  const [currentStep, setCurrentStep] = useState(1);
  const [businessType] = useState<"restaurant" | "hotel">(
    user?.profile.businessType.toLowerCase() as "restaurant" | "hotel"
  );
  const [skippedSections, setSkippedSections] = useState<number[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<BusinessData>({
    profileImages: [],
    paymentVerified: false,
    accountName: "",
    accountNumber: "",
    bankCode: "",
    bankAccountName: "",
    openTime: "",
    closeTime: "",
    businessDescription: "",
    address: "",
    city: "",
    state: "",
    country: "",
    website: "",
    rooms: [],
    menuItems: [],
    cuisines: [], // New field
    availableSlots: [], // New field
  });

  const handleRetry = async () => {
    try {
      setIsLoadingBanks(true);
      const banksList = await getBanks();
      setBanks(banksList);
    } catch (error) {
      console.error("Failed to load banks:", error);
      setError("Failed to load banks. Please refresh the page.");
    } finally {
      setIsLoadingBanks(false);
    }
  };

  useEffect(() => {
    async function loadBanks() {
      try {
        setIsLoadingBanks(true);
        const banksList = await getBanks();
        setBanks(banksList);
      } catch (error) {
        console.error("Failed to load banks:", error);
        setError("Failed to load banks. Please refresh the page.");
      } finally {
        setIsLoadingBanks(false);
      }
    }
    loadBanks();
  }, []);


  const totalSteps = 6;

  const updateFormData = <K extends keyof BusinessData>(
    field: K,
    value: BusinessData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipSection = () => {
    setSkippedSections((prev) => [...prev, currentStep]);
    nextStep();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      updateFormData(
        "profileImages",
        [...formData.profileImages, ...newImages].slice(0, 10)
      );
      setImages(prev => [...prev, ...newImages.map((file) => URL.createObjectURL(file))]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.profileImages.filter((_, i) => i !== index);
    updateFormData("profileImages", newImages);
    setImages(images.filter((_, i) => i !== index));
  };

  // Mock verification function
  async function verifyAccount() {
    setIsVerifying(true);
    setError(null);
    try {
      const result = await verifyBankAccount(
        formData.accountNumber,
        formData.bankCode
      );
      if (result.status) {
        updateFormData("accountName", result.data?.account_name || "");
        updateFormData("paymentVerified", true);
      } else {
        setError(result.message || "Could not verify account details");
      }
    } catch {
      setError(
        "An error occurred while verifying the account. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  }

  // Cuisine management functions
  const addCuisine = (cuisine: string) => {
    if (!formData.cuisines.includes(cuisine)) {
      updateFormData("cuisines", [...formData.cuisines, cuisine]);
    }
  };

  const removeCuisine = (cuisine: string) => {
    updateFormData(
      "cuisines",
      formData.cuisines.filter((c) => c !== cuisine)
    );
  };

  // Available slots management functions
  const addTimeSlot = (timeSlot: string) => {
    if (!formData.availableSlots.includes(timeSlot)) {
      updateFormData("availableSlots", [...formData.availableSlots, timeSlot]);
    }
  };

  const removeTimeSlot = (timeSlot: string) => {
    updateFormData(
      "availableSlots",
      formData.availableSlots.filter((slot) => slot !== timeSlot)
    );
  };

  // Room management functions
  const addRoom = () => {
    const newRoom: Room = {
      roomNumber: "",
      roomType: "",
      price: 0,
      capacity: 1,
      features: [],
      amenities: [],
      roomImages: [],
      roomDescription: "",
      isAvailable: true,
      maintenanceStatus: "Good",
      stars: 5,
    };
    updateFormData("rooms", [...formData.rooms, newRoom]);
  };

  const updateRoom = (
    index: number,
    field: keyof Room,
    value: Room[keyof Room]
  ) => {
    const updatedRooms = formData.rooms.map((room, i) =>
      i === index ? { ...room, [field]: value } : room
    );
    updateFormData("rooms", updatedRooms);
  };

  const removeRoom = (index: number) => {
    const updatedRooms = formData.rooms.filter((_, i) => i !== index);
    updateFormData("rooms", updatedRooms);
  };

  // Menu item management functions
  const addMenuItem = () => {
    const newMenuItem: MenuItem = {
      vendorId: user?.id || "",
      addOns: [],
      availabilityStatus: true,
      category: "",
      cuisineType: "",
      dietaryInfo: [],
      discountPrice: 0,
      dishName: "",
      description: "",
      dishImages: [],
      maxOrderPerCustomer: 10,
      portionSize: "",
      preparationTime: 15,
      price: 0,
      spiceLevel: "Mild",
      stockQuantity: 100,
      stars: 5,
    };
    updateFormData("menuItems", [...formData.menuItems, newMenuItem]);
  };

  const updateMenuItem = (
    index: number,
    field: keyof MenuItem,
    value: MenuItem[keyof MenuItem]
  ) => {
    const updatedItems = formData.menuItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateFormData("menuItems", updatedItems);
  };

  const removeMenuItem = (index: number) => {
    const updatedItems = formData.menuItems.filter((_, i) => i !== index);
    updateFormData("menuItems", updatedItems);
  };

  const getStepInfo = () => {
    const steps = [
      {
        title: `${
          businessType === "restaurant" ? "Restaurant" : "Hotel"
        } Images`,
        description: "Upload high-quality photos",
        required: true,
        guidance:
          "Upload at least 5 high-quality images showcasing your venue. First image will be your main photo.",
      },
      {
        title: "Payment Details",
        description: "Set up your payment information",
        required: true,
        guidance:
          "Verify your bank account to receive payments. We'll verify your account details for security.",
      },
      {
        title: "Location Details",
        description: "Set your business location",
        required: true,
        guidance:
          "Provide your complete business address so customers can find you easily.",
      },
      {
        title: "Operating Hours",
        description: "Set your business hours and availability",
        required: true,
        guidance:
          businessType === "restaurant"
            ? "Set your regular operating hours and available booking slots for customers."
            : "Set your regular operating hours. You can always update these later in settings.",
      },
      {
        title: `About Your ${
          businessType === "restaurant" ? "Restaurant" : "Hotel"
        }`,
        description:
          businessType === "restaurant"
            ? "Tell customers about your restaurant and cuisines"
            : "Tell customers about your business",
        required: true,
        guidance:
          businessType === "restaurant"
            ? "Write a compelling description and select the cuisines you offer to help customers find you."
            : "Write a compelling description that highlights what makes your business special.",
      },
      {
        title: businessType === "restaurant" ? "Menu Items" : "Room Details",
        description:
          businessType === "restaurant"
            ? "Add your menu items"
            : "Add your room types",
        required: true,
        guidance:
          businessType === "restaurant"
            ? "Add at least one menu item to get started. You can add more later."
            : "Add at least one room type to get started. You can add more later.",
      },
    ];
    return steps[currentStep - 1];
  };

  const isStepValid = () => {
    const stepInfo = getStepInfo();
    if (!stepInfo.required) return true;

    switch (currentStep) {
      case 1: // Images
        return formData.profileImages.length >= 5;
      case 2: // Payment
        return (
          formData.paymentVerified &&
          formData.accountName &&
          formData.accountNumber &&
          formData.bankAccountName
        );
      case 3: // Location
        return (
          formData.address &&
          formData.city &&
          formData.state &&
          formData.country
        );
      case 4: // Hours
        if (businessType === "restaurant") {
          return (
            formData.openTime &&
            formData.closeTime &&
            formData.availableSlots.length > 0
          );
        }
        return formData.openTime && formData.closeTime;
      case 5: // About
        if (businessType === "restaurant") {
          return (
            formData.businessDescription.length > 0 &&
            formData.cuisines.length > 0
          );
        }
        return formData.businessDescription.length > 0;
      case 6: // Business-specific
        return businessType === "restaurant"
          ? formData.menuItems.length > 0
          : formData.rooms.length > 0;
      default:
        return true;
    }
  };

  const stepInfo = getStepInfo();

  const handleSubmit = async () => {
    if (!isStepValid()) {
      toast.error("Please complete all required fields before submitting.");
      return;
    }

    try {
      setIsLoading(true);
      const form = new FormData();

      // Append profile images
      for (let i = 0; i < formData.profileImages.length; i++) {
        form.append("profileImages", formData.profileImages[i]);
      }
      for (let i = 0; i < formData.availableSlots.length; i++) {
        form.append("availableSlots", formData.availableSlots[i]);
      }
      for (let i = 0; i < formData.cuisines.length; i++) {
        form.append("cuisines", formData.cuisines[i]);
      }

      // Append basic fields
      form.append("accountName", formData.accountName);
      form.append("accountNumber", formData.accountNumber);
      form.append("bankCode", formData.bankCode);
      form.append("bankAccountName", formData.bankAccountName);
      form.append("openTime", formData.openTime);
      form.append("closeTime", formData.closeTime);
      form.append("businessDescription", formData.businessDescription);
      form.append("address", formData.address);
      form.append("city", formData.city);
      form.append("state", formData.state);
      form.append("country", formData.country);
      form.append("website", formData.website);

      // Append business-specific data
      if (businessType === "hotel") {
        form.append("rooms", JSON.stringify(formData.rooms));
        // Append room images
        formData.rooms.forEach((room, roomIndex) => {
          room.roomImages.forEach((image, imageIndex) => {
            form.append(`roomImages_${roomIndex}_${imageIndex}`, image);
          });
        });
      } else {
        form.append("menuItems", JSON.stringify(formData.menuItems));
        // Append dish images
        formData.menuItems.forEach((item, itemIndex) => {
          item.dishImages.forEach((image, imageIndex) => {
            form.append(`dishImages_${itemIndex}_${imageIndex}`, image);
          });
        });
      }

      const response = await API.post(`/vendors/onboard/${user?.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("Profile setup completed successfully!");
        router.push("/vendorDashboard");
      } else {
        toast.error(
          response.data?.message || "Failed to complete profile setup."
        );
      }
    } catch (error) {
      console.error("Error during profile setup:", error);
      toast.error("An error occurred while completing your profile setup.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
                (step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep
                        ? skippedSections.includes(step)
                          ? "bg-yellow-500 text-white"
                          : "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {skippedSections.includes(step) ? (
                      <Skip className="w-4 h-4" />
                    ) : (
                      step
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <CardTitle className="text-2xl font-bold">
              {stepInfo.title}
            </CardTitle>
            {stepInfo.required ? (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Optional
              </Badge>
            )}
          </div>
          <CardDescription>{stepInfo.description}</CardDescription>
          <Alert className="mt-4 text-left">
            <Info className="h-4 w-4" />
            <AlertDescription>{stepInfo.guidance}</AlertDescription>
          </Alert>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Images */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative h-32 group">
                    <Image
                      fill
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <Badge className="absolute bottom-2 left-2 text-xs">
                        Main Photo
                      </Badge>
                    )}
                  </div>
                ))}
                {formData.profileImages.length < 10 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Upload Image</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div className="text-sm text-gray-600">
                {formData.profileImages.length}/10 images uploaded (minimum 5
                required)
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {!formData.paymentVerified ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      placeholder="Enter your account number"
                      value={formData.accountNumber}
                      maxLength={10}
                      className="rounded-md h-12"
                      onChange={(e) =>
                        updateFormData("accountNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankAccountName">Bank Name *</Label>
                    <BankCombobox
                      banks={banks}
                      value={formData.bankCode}
                      retry={handleRetry}
                      onChange={(value, code) => {
                        updateFormData("bankCode", code);
                        updateFormData("bankAccountName", value);
                      }}
                      isLoading={isLoadingBanks}
                    />
                  </div>
                  <Button
                    onClick={verifyAccount}
                    disabled={
                      !formData.accountNumber ||
                      !formData.bankAccountName ||
                      isVerifying ||
                      isLoadingBanks
                    }
                    className="h-10 px-4 w-full bg-blue-600 hover:bg-blue-600/80"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4 mr-2" />
                    )}
                    Verify Account Details
                  </Button>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">
                      Account Verified Successfully
                    </span>
                  </div>
                  <div className="text-sm text-green-700">
                    <p>
                      <strong>Account Name:</strong> {formData.accountName}
                    </p>
                    <p>
                      <strong>Bank:</strong> {formData.bankAccountName}
                    </p>
                    <p>
                      <strong>Account:</strong> ****
                      {formData.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Location Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Business Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter your complete business address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="rounded-md h-12"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    className="rounded-md h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    className="rounded-md h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={(e) => updateFormData("country", e.target.value)}
                  className="rounded-md h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  value={formData.website}
                  onChange={(e) => updateFormData("website", e.target.value)}
                  className="rounded-md h-12"
                />
              </div>
            </div>
          )}

          {/* Step 4: Operating Hours */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening-time">Opening Time *</Label>
                  <Select
                    value={formData.openTime}
                    onValueChange={(value) => updateFormData("openTime", value)}
                  >
                    <SelectTrigger id="opening-time">
                      <SelectValue placeholder="Select opening time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closing-time">Closing Time *</Label>
                  <Select
                    value={formData.closeTime}
                    onValueChange={(value) =>
                      updateFormData("closeTime", value)
                    }
                  >
                    <SelectTrigger id="closing-time">
                      <SelectValue placeholder="Select closing time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Available Slots for Restaurants */}
              {businessType === "restaurant" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Available Booking Slots *</Label>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) => {
                          addTimeSlot(
                            timeOptions.find((t) => t.value === value)?.label ||
                              value
                          );
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add available time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions
                            .filter((time) => {
                              const timeLabel = time.label;
                              return !formData.availableSlots.includes(
                                timeLabel
                              );
                            })
                            .map((time) => (
                              <SelectItem key={time.value} value={time.value}>
                                {time.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.availableSlots.map((slot, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {slot}
                          <button
                            onClick={() => removeTimeSlot(slot)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.availableSlots.length} slots added (minimum 1
                      required)
                    </div>
                  </div>
                </div>
              )}

              {(formData.openTime || formData.closeTime) && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-medium">Current Selection:</h4>
                  {formData.openTime && (
                    <p className="text-sm">
                      <span className="font-medium">Opening:</span>{" "}
                      {
                        timeOptions.find((t) => t.value === formData.openTime)
                          ?.label
                      }
                    </p>
                  )}
                  {formData.closeTime && (
                    <p className="text-sm">
                      <span className="font-medium">Closing:</span>{" "}
                      {
                        timeOptions.find((t) => t.value === formData.closeTime)
                          ?.label
                      }
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 5: About */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="about">
                  About Your{" "}
                  {businessType === "restaurant" ? "Restaurant" : "Hotel"} *
                </Label>
                <Textarea
                  id="about"
                  placeholder={`Tell customers what makes your ${businessType} special. Include your story, specialties, atmosphere, and what guests can expect...`}
                  value={formData.businessDescription}
                  onChange={(e) =>
                    updateFormData("businessDescription", e.target.value)
                  }
                  className="min-h-[120px]"
                />
                <div className="text-sm text-gray-500">
                  {formData.businessDescription.length}/500 characters
                </div>
              </div>

              {/* Cuisines for Restaurants */}
              {businessType === "restaurant" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cuisines Offered *</Label>
                    <Select onValueChange={(value) => addCuisine(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add cuisine type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CUISINE_TYPES.filter(
                          (cuisine) => !formData.cuisines.includes(cuisine)
                        ).map((cuisine) => (
                          <SelectItem key={cuisine} value={cuisine}>
                            {cuisine}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.cuisines.map((cuisine, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {cuisine}
                          <button
                            onClick={() => removeCuisine(cuisine)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.cuisines.length} cuisines selected (minimum 1
                      required)
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Business-specific content */}
          {currentStep === 6 && (
            <div className="space-y-6">
              {businessType === "hotel" ? (
                // Hotel Rooms Management
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Room Types</h3>
                    <Button
                      onClick={addRoom}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Room
                    </Button>
                  </div>
                  {formData.rooms.map((room, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Room {index + 1}</h4>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeRoom(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Room Number *</Label>
                          <Input
                            placeholder="e.g., 101, A1"
                            value={room.roomNumber}
                            onChange={(e) =>
                              updateRoom(index, "roomNumber", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Room Type *</Label>
                          <Select
                            value={room.roomType}
                            onValueChange={(value) =>
                              updateRoom(index, "roomType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROOM_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Price per Night *</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={room.price}
                            onChange={(e) =>
                              updateRoom(index, "price", Number(e.target.value))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Capacity *</Label>
                          <Input
                            type="number"
                            placeholder="1"
                            value={room.capacity}
                            onChange={(e) =>
                              updateRoom(
                                index,
                                "capacity",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Maintenance Status</Label>
                          <Select
                            value={room.maintenanceStatus}
                            onValueChange={(value) =>
                              updateRoom(index, "maintenanceStatus", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MAINTENANCE_STATUS.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Star Rating</Label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => updateRoom(index, "stars", star)}
                                className={`p-1 ${
                                  star <= room.stars
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                <Star className="w-5 h-5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Features</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {ROOM_FEATURES.map((feature) => (
                              <div
                                key={feature}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${index}-feature-${feature}`}
                                  checked={room.features.includes(feature)}
                                  onCheckedChange={(checked) => {
                                    const updatedFeatures = checked
                                      ? [...room.features, feature]
                                      : room.features.filter(
                                          (f) => f !== feature
                                        );
                                    updateRoom(
                                      index,
                                      "features",
                                      updatedFeatures
                                    );
                                  }}
                                />
                                <Label
                                  htmlFor={`${index}-feature-${feature}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {feature}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Amenities</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {ROOM_AMENITIES.map((amenity) => (
                              <div
                                key={amenity}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${index}-amenity-${amenity}`}
                                  checked={room.amenities.includes(amenity)}
                                  onCheckedChange={(checked) => {
                                    const updatedAmenities = checked
                                      ? [...room.amenities, amenity]
                                      : room.amenities.filter(
                                          (a) => a !== amenity
                                        );
                                    updateRoom(
                                      index,
                                      "amenities",
                                      updatedAmenities
                                    );
                                  }}
                                />
                                <Label
                                  htmlFor={`${index}-amenity-${amenity}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {amenity}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Room Description</Label>
                          <Textarea
                            placeholder="Describe this room type..."
                            value={room.roomDescription}
                            onChange={(e) =>
                              updateRoom(
                                index,
                                "roomDescription",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${index}-available`}
                            checked={room.isAvailable}
                            onCheckedChange={(checked) =>
                              updateRoom(index, "isAvailable", checked)
                            }
                          />
                          <Label htmlFor={`${index}-available`}>
                            Room is available for booking
                          </Label>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {formData.rooms.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No rooms added yet. Click &quot;Add Room&quot; to get
                      started.
                    </div>
                  )}
                </div>
              ) : (
                // Restaurant Menu Items Management
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Menu Items</h3>
                    <Button
                      onClick={addMenuItem}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Menu Item
                    </Button>
                  </div>
                  {formData.menuItems.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Menu Item {index + 1}</h4>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMenuItem(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Dish Name *</Label>
                          <Input
                            placeholder="e.g., Margherita Pizza"
                            value={item.dishName}
                            onChange={(e) =>
                              updateMenuItem(index, "dishName", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category *</Label>
                          <Select
                            value={item.category}
                            onValueChange={(value) =>
                              updateMenuItem(index, "category", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {MENU_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Cuisine Type *</Label>
                          <Select
                            value={item.cuisineType}
                            onValueChange={(value) =>
                              updateMenuItem(index, "cuisineType", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select cuisine" />
                            </SelectTrigger>
                            <SelectContent>
                              {CUISINE_TYPES.map((cuisine) => (
                                <SelectItem key={cuisine} value={cuisine}>
                                  {cuisine}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Price *</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.price}
                            onChange={(e) =>
                              updateMenuItem(
                                index,
                                "price",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Discount Price</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={item.discountPrice}
                            onChange={(e) =>
                              updateMenuItem(
                                index,
                                "discountPrice",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Preparation Time (minutes)</Label>
                          <Input
                            type="number"
                            placeholder="15"
                            value={item.preparationTime}
                            onChange={(e) =>
                              updateMenuItem(
                                index,
                                "preparationTime",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Portion Size</Label>
                          <Input
                            placeholder="e.g., Large, 500g"
                            value={item.portionSize}
                            onChange={(e) =>
                              updateMenuItem(
                                index,
                                "portionSize",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Spice Level</Label>
                          <Select
                            value={item.spiceLevel}
                            onValueChange={(value) =>
                              updateMenuItem(index, "spiceLevel", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SPICE_LEVELS.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Stock Quantity</Label>
                          <Input
                            type="number"
                            placeholder="100"
                            value={item.stockQuantity}
                            onChange={(e) =>
                              updateMenuItem(
                                index,
                                "stockQuantity",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Max Order Per Customer</Label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={item.maxOrderPerCustomer}
                            onChange={(e) =>
                              updateMenuItem(
                                index,
                                "maxOrderPerCustomer",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Star Rating</Label>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  updateMenuItem(index, "stars", star)
                                }
                                className={`p-1 ${
                                  star <= item.stars
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                <Star className="w-5 h-5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Add-ons</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {ADDON_OPTIONS.map((addon) => (
                              <div
                                key={addon}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${index}-addon-${addon}`}
                                  checked={item.addOns.includes(addon)}
                                  onCheckedChange={(checked) => {
                                    const updatedAddons = checked
                                      ? [...item.addOns, addon]
                                      : item.addOns.filter((a) => a !== addon);
                                    updateMenuItem(
                                      index,
                                      "addOns",
                                      updatedAddons
                                    );
                                  }}
                                />
                                <Label
                                  htmlFor={`${index}-addon-${addon}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {addon}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Dietary Information</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {DIETARY_INFO.map((diet) => (
                              <div
                                key={diet}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`${index}-diet-${diet}`}
                                  checked={item.dietaryInfo.includes(diet)}
                                  onCheckedChange={(checked) => {
                                    const updatedDietary = checked
                                      ? [...item.dietaryInfo, diet]
                                      : item.dietaryInfo.filter(
                                          (d) => d !== diet
                                        );
                                    updateMenuItem(
                                      index,
                                      "dietaryInfo",
                                      updatedDietary
                                    );
                                  }}
                                />
                                <Label
                                  htmlFor={`${index}-diet-${diet}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {diet}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe this dish..."
                            value={item.description}
                            onChange={(e) =>
                              updateMenuItem(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${index}-available`}
                            checked={item.availabilityStatus}
                            onCheckedChange={(checked) =>
                              updateMenuItem(
                                index,
                                "availabilityStatus",
                                checked
                              )
                            }
                          />
                          <Label htmlFor={`${index}-available`}>
                            Item is available for order
                          </Label>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {formData.menuItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No menu items added yet. Click &quot;Add Menu Item&quot;
                      to get started.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex gap-2">
              {!stepInfo.required && !skippedSections.includes(currentStep) && (
                <Button
                  variant="ghost"
                  onClick={skipSection}
                  className="flex items-center gap-2"
                >
                  <ChevronsRight className="w-4 h-4" />
                  Skip
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  disabled={stepInfo.required && !isStepValid()}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={(stepInfo.required && !isStepValid()) || isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <span className="animate-spin">
                      <Loader2 className="w-4 h-4" />
                    </span>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
