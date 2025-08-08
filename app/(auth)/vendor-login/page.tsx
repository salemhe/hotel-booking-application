"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";
import API from "@/app/lib/api/axios";

interface VendorProfile {
  id?: string;
  _id?: string;
  email?: string;
  role?: string;
  token?: string;
  businessName?: string;
  businessType?: string;
  address?: string;
  branch?: string;
  profileImage?: string;
  onboarded?: boolean;
  [key: string]: unknown;
}

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [userNotExist, setUserNotExist] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>("");

  const router = useRouter();
  const { login: contextLogin } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Enter your email address";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (!password.trim()) {
      newErrors.password = "Enter your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // For direct API testing
  const testDirectApi = async () => {
    try {
      setApiResponse("Testing direct API connection...");
      setLoading(true);
      
      const BASE_URL = "https://hotel-booking-app-backend-30q1.onrender.com";
      console.log(`Testing direct API: ${BASE_URL}/api/vendors/login`);
      
      const response = await fetch(`${BASE_URL}/api/vendors/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });
      
      const responseText = await response.text();
      console.log("Direct API test response:", {
        status: response.status,
        body: responseText
      });
      
      setApiResponse(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        body: responseText
      }, null, 2));
    } catch (error) {
      console.error("Direct API test error:", error);
      setApiResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserNotExist(false);
    setApiResponse("");
    console.log("Starting login process with:", { email, password: "[REDACTED]", length: password.length });

    if (!validate()) return;
    setLoading(true);

    try {
      // Use AuthService directly for consistency
      const loginResponse = await AuthService.login(email, password);
      console.log("Login response:", loginResponse);
      
      if (!loginResponse || !loginResponse.profile) {
        throw new Error("Login failed - invalid response");
      }
      
      // Get profile and token from the response
      const authToken = loginResponse.profile.token || loginResponse.token;
      let vendorProfile: VendorProfile = loginResponse.profile as VendorProfile;
      
      if (authToken) {
        // Store token in localStorage
        localStorage.setItem("auth_token", authToken);
        
        // Try to get more profile details if possible
        try {
          const userId = loginResponse.profile?.id || (loginResponse.profile as VendorProfile)?._id || "";
          if (userId) {
            const fetchedProfile = await API.get(`/vendors/${userId}`, { withCredentials: true });
            if (fetchedProfile && fetchedProfile.data) {
              vendorProfile = fetchedProfile.data as VendorProfile;
            }
          }
        } catch (profileError) {
          console.error("Could not fetch detailed profile, using login profile", profileError);
        }
      }

      if (vendorProfile) {
        contextLogin({
          id: vendorProfile.id ?? vendorProfile._id ?? "",
          name: vendorProfile.businessName ?? vendorProfile.email ?? "",
          email: vendorProfile.email ?? "",
          role: vendorProfile.role ?? "vendor"
        });
      }

      toast.success(`Welcome back, ${vendorProfile?.businessName || "Vendor"}!`);
      localStorage.setItem("accountType", vendorProfile?.businessType || "");

      // Added a short delay to ensure context is set before redirecting
      // Use safe property access to prevent undefined errors
      const userRole = vendorProfile?.role || "vendor";
      const businessType = vendorProfile?.businessType || "";
      const isOnboarded = vendorProfile?.onboarded || false;

      if (userRole === "super-admin") {
        if (businessType === "hotel") {
          setTimeout(() => router.push("/super-admin/hotel"), 150);
        } else if (businessType === "restaurant") {
          setTimeout(() => router.push("/super-admin/restaurant"), 150);
        } else if (businessType === "club") {
          setTimeout(() => router.push("/super-admin/club"), 150);
        } else {
          setTimeout(() => router.push("/super-admin/dashboard"), 150);
        }
      } else {
        // Vendor logic
        if (isOnboarded) {
          if (businessType === "hotel") {
            setTimeout(() => router.push("/vendor-dashboard/hotel/dashboard"), 150);
          } else if (businessType === "restaurant") {
            setTimeout(() => router.push("/vendor-dashboard/restaurant/dashboard"), 150);
          } else if (businessType === "club") {
            setTimeout(() => router.push("/vendor-dashboard/club"), 150);
          } else {
            setTimeout(() => router.push("/vendorDashboard"), 150);
          }
        } else {
          setTimeout(() => router.push("/onboarding"), 150);
        }
      }
    } catch (error) {
      console.error("Login error details:", error);
      
      // TypeScript-safe error handling for Axios
      interface AxiosErrorData {
        isAxiosError?: boolean;
        response?: {
          data?: {
            message?: string;
          };
          status?: number;
        };
        message?: string;
      }
      
      const axiosError = error as AxiosErrorData;
      console.log("Error structure:", {
        isAxiosError: axiosError.isAxiosError,
        status: axiosError.response?.status,
        message: axiosError.response?.data?.message || axiosError.message
      });
      
      if (axiosError.isAxiosError && axiosError.response && axiosError.response.data) {
        toast.error(axiosError.response.data?.message || "Login failed");
      } else if (
        error instanceof Error &&
        (error.message.toLowerCase().includes("user does not exist") ||
          error.message.toLowerCase().includes("user not found"))
      ) {
        setUserNotExist(true);
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Please check your credentials and try again"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes errorPop {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-error-pop {
          animation: errorPop 0.25s ease forwards;
        }
      `}</style>

      <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xs">
            <CardHeader className="space-y-3 pb-6 md:pb-8 px-4 sm:px-6 md:px-8">
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-center text-[#222]">
                Partner Login 🔓
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
                Access your dashboard to manage bookings, monitor performance,
                and grow your hospitality business
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 md:px-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6"
                noValidate
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-light text-gray-700"
                  >
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your business email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-describedby="email-error"
                      className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
                        errors.email ? "border-red-600 ring-red-600" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-light text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your secure password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      aria-describedby="password-error"
                      className={`pl-10 pr-10 h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
                        errors.password ? "border-red-600 ring-red-600" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                  <div className="text-left">
                    <Link
                      href="/forgot-password"
                      className="text-xs sm:text-sm text-gray-600 hover:text-[#60A5FA] transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
                      </div>
                      <span className="ml-2">Signing you in...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              {userNotExist && (
                <div
                  className="mt-4 rounded-md p-3 italic"
                  style={{ backgroundColor: "#E8FFE1", color: "#222" }}
                  role="alert"
                >
                  This user doesn&apos;t exist.{" "}
                  <Link
                    href="/vendor-signup"
                    className="underline font-semibold"
                  >
                    Create an account
                  </Link>
                  .
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs sm:text-sm text-gray-500 font-light">
                  OR
                </span>
                <div className="flex-1 border-t border-gray-200" />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full text-sm">
                <Link
                  href="/vendor-signup"
                  className="text-[#60A5FA] hover:text-[#3B82F6] transition-colors font-light inline-flex items-center gap-2 group"
                >
                  Create a Business account
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardFooter>
            
            {/* Debug Mode Toggle */}
            <div className="mt-4 border-t pt-4 px-6">
              <button 
                type="button" 
                onClick={() => setDebugMode(!debugMode)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {debugMode ? "Hide Debug Tools" : "Show Debug Tools"}
              </button>
              
              {debugMode && (
                <div className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={testDirectApi}
                      className="text-xs bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
                      disabled={loading}
                    >
                      Test Direct API
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.clear();
                        setApiResponse("Local storage cleared");
                      }}
                      className="text-xs bg-gray-100 px-3 py-2 rounded hover:bg-gray-200"
                    >
                      Clear Local Storage
                    </button>
                  </div>
                  
                  {apiResponse && (
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">API Response:</p>
                      <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                        {apiResponse}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}