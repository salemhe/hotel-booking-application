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
} from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import Image from "next/image";
import { getBanks, verifyBankAccount } from "@/app/lib/action";
import { BankCombobox } from "@/app/components/BankComboBox";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { toast } from "sonner";
import API from "@/app/lib/api/axios";
import { useRouter } from "next/navigation";

interface RestaurantData {
  profileImages: File[];
  paymentVerified: boolean;
  accountName: string;
  accountNumber: string;
  bankAccountName: string;
  bankCode: string;
  openingTime: string;
  closingTime: string;
  cuisines: string[];
  businessDescription: string;
  reservationSlots: string[];
  maxPartySize: number;
  advanceBookingDays: number;
  priceRange: number | "";
  website: string;
}

const CUISINES = [
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
      // Add explicit AM/PM
      const ampm = hour < 12 ? "AM" : "PM";
      times.push({ value: timeString, label: `${displayTime} ${ampm}` });
    }
  }
  return times;
};

const TIME_SLOTS = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
];

interface Bank {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export default function RestaurantProfileSetup() {
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
  const router = useRouter()

  const [formData, setFormData] = useState<RestaurantData>({
    profileImages: [],
    paymentVerified: false,
    accountName: "",
    accountNumber: "",
    bankCode: "",
    bankAccountName: "",
    openingTime: "",
    closingTime: "",
    cuisines: [],
    businessDescription: "",
    reservationSlots: [],
    maxPartySize: 8,
    advanceBookingDays: 30,
    priceRange: "",
    website: "",
  });

  const handleSlotToggle = (slot: string) => {
    const updatedSlots = formData.reservationSlots.includes(slot)
      ? formData.reservationSlots.filter((s) => s !== slot)
      : [...formData.reservationSlots, slot];
    updateFormData("reservationSlots", updatedSlots);
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

  const totalSteps = businessType === "restaurant" ? 6 : 5; // Skip reservations for hotels

  const updateFormData = <K extends keyof RestaurantData>(
    field: K,
    value: RestaurantData[K]
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
      setImages(Array.from(files).map((file) => URL.createObjectURL(file)));
    }
  };

  const removeImage = (index: number) => {
    const newImages = formData.profileImages.filter((_, i) => i !== index);
    updateFormData("profileImages", newImages);
    setImages(images.filter((_, i) => i !== index));
  };

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

  const getStepInfo = () => {
    const steps = [
      {
        title: `${
          businessType === "restaurant" ? "Restaurant" : "Hotel"
        } Images`,
        description: "Upload high-quality photos",
        required: true,
        guidance:
          "Upload at least 5 high-quality images showcasing your venue, food, and ambiance. First image will be your main photo.",
      },
      {
        title: "Payment Details",
        description: "Set up your payment information",
        required: true,
        guidance:
          "Verify your bank account to receive payments. We'll verify your account details for security.",
      },
      {
        title: "Opening Hours",
        description: "Set your business hours",
        required: true,
        guidance:
          "Set your regular operating hours. You can always update these later in settings.",
      },
      {
        title: "Cuisines",
        description: "Select your cuisine types",
        required: true,
        guidance:
          "Help customers find you by selecting the types of cuisine you offer. Choose all that apply.",
      },
      {
        title: `About Your ${
          businessType === "restaurant" ? "Restaurant" : "Hotel"
        }`,
        description: "Tell customers about your business",
        required: true,
        guidance:
          "Write a compelling description that highlights what makes your business special. Include your story, specialties, and unique features.",
      },
    ];

    if (businessType === "restaurant") {
      steps.push({
        title: "General Settings",
        description: "Configure booking options",
        required: true,
        guidance: "set up your minimum price and website url.",
      });
    }

    return steps[currentStep - 1];
  };

  const formatNaira = (value: number | "") =>
    value === "" ? "" : `₦${value.toLocaleString()}`;

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

      // Append files
      for (let i = 0; i < formData.profileImages.length; i++) {
        form.append("profileImages", formData.profileImages[i]); // ✅ this name must match backend
      }

      // Append other fields
      form.append("accountName", formData.accountName);
      form.append("accountNumber", formData.accountNumber);
      form.append("bankCode", formData.bankCode);
      form.append("bankAccountName", formData.bankAccountName);
      form.append("openingTime", formData.openingTime);
      form.append("closingTime", formData.closingTime);
      form.append("businessDescription", formData.businessDescription);
      form.append("priceRange", String(formData.priceRange));
      form.append("website", formData.website);
      form.append("maxPartySize", String(formData.maxPartySize));
      form.append("advanceBookingDays", String(formData.advanceBookingDays));

      // Append cuisines (array)
      formData.cuisines.forEach((cuisine) => {
        form.append("cuisines", cuisine); // backend should expect this as an array
      });

      // Append reservationSlots (array)
      formData.reservationSlots.forEach((slot) => {
        form.append("availableSlots", slot); // backend uses `availableSlots`
      });

      const response = await API.patch(`/vendors/onboard/${user?.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        toast.success("Profile setup completed successfully!");
        router.push("/vendorDashboard/menu/add")
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
                    <CreditCard className="w-4 h-4 mr-2" />
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

          {/* Step 3: Opening Hours */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening-time">Opening Time</Label>
                  <Select
                    value={formData.openingTime}
                    onValueChange={(value) =>
                      updateFormData("openingTime", value)
                    }
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
                  <Label htmlFor="closing-time">Closing Time</Label>
                  <Select
                    value={formData.closingTime}
                    onValueChange={(value) =>
                      updateFormData("closingTime", value)
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

              {/* Available Time Slots */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">
                    Available Time Slots
                  </Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.reservationSlots.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <div key={slot} className="flex items-center space-x-2">
                      <Checkbox
                        id={slot}
                        checked={formData.reservationSlots.includes(slot)}
                        onCheckedChange={() => handleSlotToggle(slot)}
                      />
                      <Label
                        htmlFor={slot}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {slot}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Summary */}
              {(formData.openingTime ||
                formData.closingTime ||
                formData.reservationSlots.length > 0) && (
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <h4 className="font-medium">Current Selection:</h4>
                  {formData.openingTime && (
                    <p className="text-sm">
                      <span className="font-medium">Opening:</span>{" "}
                      {
                        timeOptions.find(
                          (t) => t.value === formData.openingTime
                        )?.label
                      }
                    </p>
                  )}
                  {formData.closingTime && (
                    <p className="text-sm">
                      <span className="font-medium">Closing:</span>{" "}
                      {
                        timeOptions.find(
                          (t) => t.value === formData.closingTime
                        )?.label
                      }
                    </p>
                  )}
                  {formData.reservationSlots.length > 0 && (
                    <p className="text-sm">
                      <span className="font-medium">Available Slots:</span>{" "}
                      {formData.reservationSlots.join(", ")}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Cuisines */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CUISINES.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={cuisine}
                      checked={formData.cuisines.includes(cuisine)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFormData("cuisines", [
                            ...formData.cuisines,
                            cuisine,
                          ]);
                        } else {
                          updateFormData(
                            "cuisines",
                            formData.cuisines.filter((c) => c !== cuisine)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={cuisine} className="text-sm cursor-pointer">
                      {cuisine}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="text-sm text-gray-600">
                Selected: {formData.cuisines.length} cuisine
                {formData.cuisines.length !== 1 ? "s" : ""}
              </div>
            </div>
          )}

          {/* Step 5: About */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about">
                  About Your{" "}
                  {businessType === "restaurant" ? "Restaurant" : "Hotel"}
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
            </div>
          )}

          {/* Step 6: Reservations (Restaurant only) */}
          {currentStep === 6 && businessType === "restaurant" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range form:</Label>
                  <Input
                    id="priceRange"
                    placeholder="e.g ₦20,000"
                    value={formatNaira(formData.priceRange)}
                    onChange={(e) => {
                      // Remove non-digit characters
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      updateFormData("priceRange", raw ? Number(raw) : "");
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="rounded-md h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">website Url</Label>
                  <Input
                    id="website"
                    placeholder="myrestaurant.com"
                    value={formData.website}
                    onChange={(e) => {
                      updateFormData("website", e.target.value);
                    }}
                    className="rounded-md h-12"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
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
