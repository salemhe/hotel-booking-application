"use client";

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
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Textarea } from "@/app/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  MapPin,
  Phone,
  Store,
  Users,
  Lock,
  Shield,
  AlertCircle,
} from "lucide-react";
// import Link from "next/link";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
// import { FaStore } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type BusinessType = "restaurant" | "hotel" | "club" | "";
type AdminType = "vendor" | "super-admin" | "";

interface FormData {
  businessName: string;
  email: string;
  address: string;
  phone: string;
  businessType: BusinessType;
  adminType: AdminType;
  password: string;
  confirmPassword: string;
  role: AdminType;
}

export default function VendorRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    email: "",
    address: "",
    phone: "",
    businessType: "",
    adminType: "",
    password: "",
    confirmPassword: "",
    role: "vendor",
  });
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const router = useRouter();
  const { login: contextLogin } = useAuth();
  //Expanded errors state to accommodate all fields
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone || !/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    // if (!formData.name.trim()) {
    //   newErrors.name = "Full name is required.";
    // }
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }
    setErrors(newErrors);
    console.log("validateForm called", { formData, newErrors, valid: Object.keys(newErrors).length === 0 });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called", { currentStep, formData });
    if (!validateForm()) {
      console.log("Validation failed");
      return;
    }
    setLoading(true);
    try {
      const dataToSend = { ...formData, role: formData.adminType };
      console.log("Submitting registration", dataToSend);
      const data = await AuthService.register(dataToSend);
      console.log("Registration response", data);
      if (data.success !== false) {
        setShowOTPInput(true);
        toast.success("Please check your email for the OTP verification code.")
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.verifyOTP(formData.email, otp);
      toast.success("Your account has been verified.");
      // Automatically log in the user after verification
      const loginResponse = await AuthService.login(formData.email, formData.password);
      const token = loginResponse.token || (loginResponse.profile && loginResponse.profile.token);
       const userId = loginResponse.profile?.id;
      if (token) {
        await AuthService.setToken(token);
        localStorage.setItem("auth_token", token);
      }
      // Fetch real user profile from backend and store it
      let realProfile = null;
      if (userId) {
        realProfile = await AuthService.fetchMyProfile(userId);
        if (realProfile) {
          AuthService.setUser({
            ...realProfile,
            email: realProfile.email,
            role: realProfile.role,
            id: realProfile.id,
            businessName: realProfile.businessName ?? "",
            businessType: realProfile.businessType ?? "",
            address: realProfile.address ?? "",
            branch: realProfile.branch ?? "",
            profileImage: realProfile.profileImage ?? "",
            profile: {
              id: realProfile.id,
              businessName: realProfile.businessName ?? "",
              businessType: realProfile.businessType ?? "",
              email: realProfile.email ?? "",
              address: realProfile.address ?? "",
              branch: realProfile.branch ?? "",
              profileImage: realProfile.profileImage ?? "",
              phone: typeof realProfile.phone === "number" ? realProfile.phone : 0,
              paymentDetails: typeof realProfile.paymentDetails === "object" && realProfile.paymentDetails !== null
                ? realProfile.paymentDetails
                : {
                    accountNumber: "",
                    bankAccountName: "",
                    bankCode: "",
                    bankName: "",
                    paystackSubAccount: "",
                    percentageCharge: 0,
                    recipientCode: "",
                  },
              recipientCode: typeof realProfile.recipientCode === "string" ? realProfile.recipientCode : "",
              onboarded: typeof realProfile.onboarded === "boolean" ? realProfile.onboarded : false,
            },
          });
        }
      }
      // Route based on account type
      if (formData.adminType === "super-admin") {
        // Set AuthContext for auto-login
        if (realProfile) {
          contextLogin({
            id: realProfile.id ?? "",
            name: realProfile.businessName ?? realProfile.email ?? "",
            email: realProfile.email ?? "",
            role: realProfile.role ?? "super-admin"
          });
          // Wait a tick to ensure context is set before redirect
          setTimeout(() => {
            router.push("/super-administrator/dashboard");
          }, 150);
        } else {
          router.push("/super-administrator/dashboard");
        }
      } else {
        router.push("/vendor-dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await AuthService.resendOTP(formData.email);
      toast.success("Please check your email for the new verification code.");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Please try again");
      }
    }
  };

  // Removed unused handleOTPVerification and handleResendOTP to fix ESLint errors

  const totalSteps = 4;
  const updateFormData = (field: keyof FormData, value: string) => {
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
  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Information";
      case 2:
        return "Business Type";
      case 3:
        return "Account Type";
      case 4:
        return "Security Setup";
      default:
        return "Registration";
    }
  };
  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about your business";
      case 2:
        return "What type of business do you operate?";
      case 3:
        return "Choose your account management level";
      case 4:
        return "Set up your account security";
      default:
        return "Complete your registration";
    }
  };
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.businessName &&
          formData.email &&
          formData.address &&
          formData.phone
        );
      case 2:
        return formData.businessType !== "";
      case 3:
        return formData.adminType !== "";
      case 4:
        return (
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl pb-6 px-2 sm:px-4">
        <CardHeader className="space-y-3 pb-6 px-6">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-center text-[#222]">
            {showOTPInput ? "Verify Your Email" : "Create Business Account 🔐"}
            <CardDescription className="mt-2 text-center text-gray-600 text-sm sm:text-base">
              Access your dashboard to manage bookings, monitor performance, and
              grow your hospitality business
            </CardDescription>
          </CardTitle>
        </CardHeader>
        {showOTPInput ? (
          <form onSubmit={handleOTPVerification} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="Enter OTP"
                required
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white h-12"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                {" Didn't receive code? Resend"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                {getStepTitle()}
              </CardTitle>
              <CardDescription>{getStepDescription()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="businessName"
                      className="flex items-center gap-2 text-sm font-light text-gray-700"
                    >
                      Business Name
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                      <Input
                        id="businessName"
                        placeholder="Enter your business name"
                        value={formData.businessName}
                        onChange={(e) =>
                          updateFormData("businessName", e.target.value)
                        }
                        aria-describedby={
                          errors.businessName ? "name-error" : undefined
                        }
                        className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
                          errors.businessName
                            ? "border-red-600 ring-red-600"
                            : ""
                        }`}
                      />
                    </div>
                    {errors.businessName && (
                      <p
                        id="businessType-error"
                        className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="businessEmail"
                      className="flex items-center gap-2 text-sm font-light text-gray-700"
                    >
                      Business Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                      <Input
                        id="businessEmail"
                        type="email"
                        placeholder="business@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        aria-describedby={
                          errors.email ? "name-error" : undefined
                        }
                        className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
                          errors.email ? "border-red-600 ring-red-600" : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p
                        id="businessType-error"
                        className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="businessAddress"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Business Address
                    </Label>
                    <Textarea
                      id="businessAddress"
                      placeholder="Enter your complete business address"
                      value={formData.address}
                      onChange={(e) =>
                        updateFormData("address", e.target.value)
                      }
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="businessPhone"
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Business Phone Number
                    </Label>
                    <Input
                      id="businessPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                  </div>
                </div>
              )}
              {/* Step 2: Business Type */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <RadioGroup
                    value={formData.businessType}
                    onValueChange={(value) =>
                      updateFormData("businessType", value)
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="restaurant" id="restaurant" />
                      <Label
                        htmlFor="restaurant"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">Restaurant</div>
                        <div className="text-sm text-gray-600">
                          Food service establishment
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="hotel" id="hotel" />
                      <Label htmlFor="hotel" className="flex-1 cursor-pointer">
                        <div className="font-medium">Hotel</div>
                        <div className="text-sm text-gray-600">
                          Hospitality and accommodation
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="club" id="club" />
                      <Label htmlFor="club" className="flex-1 cursor-pointer">
                        <div className="font-medium">Club</div>
                        <div className="text-sm text-gray-600">
                          Entertainment and social venue
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              {/* Step 3: Account Type */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <RadioGroup
                    value={formData.adminType}
                    onValueChange={(value) =>
                      updateFormData("adminType", value)
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label htmlFor="vendor" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 font-medium">
                          <Store className="w-5 h-5" />
                          Vendor Account
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Perfect for single location businesses. Manage one
                          location with full control over menus, orders, and
                          operations.
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="super-admin" id="super-admin" />
                      <Label
                        htmlFor="super-admin"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 font-medium">
                          <Users className="w-5 h-5" />
                          Super Admin Account
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Ideal for business chains and franchises. Manage
                          multiple locations, upload menus across various
                          branches, and get consolidated analytics.
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              {/* Step 4: Security Setup */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateFormData("confirmPassword", e.target.value)
                      }
                    />
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-red-600">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                  {formData.adminType === "super-admin" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                        <Users className="w-4 h-4" />
                        Super Admin Benefits
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Add and manage multiple business locations</li>
                        <li>• Upload menus across all your branches</li>
                        <li>• View consolidated analytics and reports</li>
                        <li>• Manage staff accounts for each location</li>
                      </ul>
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
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      console.log("Button clicked", { currentStep, formData });
                      handleSubmit();
                    }}
                    disabled={!isStepValid() || loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
                        </div>
                        <span className="ml-2">Creating your account...</span>
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
