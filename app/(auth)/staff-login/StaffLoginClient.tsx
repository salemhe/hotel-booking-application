"use client";

import { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
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
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";
import API from "@/lib/api/axios";

interface StaffProfile {
  id?: string;
  _id?: string;
  staffName?: string;
  email?: string;
  phone?: string;
  branch?: string;
  jobTitle?: string;
  jobRole?: string;
  vendorId?: string;
  profileImage?: string;
  role?: string; // derived from jobRole
  token?: string;
  [key: string]: unknown;
}

export default function StaffLoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [userNotExist, setUserNotExist] = useState(false);

  const { login: contextLogin } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserNotExist(false);

    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vendors/staff-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // same as withCredentials: true
      body: JSON.stringify({ email, password }),
    });

      const data = await res.json();
      console.log(data)
      const staffProfile: StaffProfile = data?.profile;
      const authToken = staffProfile?.token || data?.token;

      if (!staffProfile || !authToken) {
        throw new Error("Login failed - invalid response");
      }

      // store token and profile
      localStorage.setItem("auth_token", authToken);
      localStorage.setItem("user_role", staffProfile.jobRole || "staff");
      localStorage.setItem("accountType", "staff");
      if (staffProfile.id || staffProfile._id) {
        localStorage.setItem("userId", staffProfile.id ?? staffProfile._id ?? "");
      }

      // update auth context
      contextLogin(
        {
          id: staffProfile.id ?? staffProfile._id ?? "",
          name: staffProfile.staffName ?? staffProfile.email ?? "",
          email: staffProfile.email ?? "",
          role: staffProfile.jobRole ?? "staff",
        },
        authToken
      );

      toast.success(`Welcome back, ${staffProfile.staffName || "Staff"}!`);

      // redirect to vendor dashboard (depending on vendor's businessType later)
      const redirectTo = searchParams.get("redirect");
      let redirectUrl = "/vendor-dashboard/hotel/dashboard"; // default
      if (staffProfile.vendorId) {
        // Optionally fetch vendor to know its businessType
        try {
          const vendor = await API.get(`/vendors/${staffProfile.vendorId}`, { withCredentials: true });
          const vendorType = vendor.data?.businessType;
          if (vendorType === "restaurant") redirectUrl = "/vendor-dashboard/restaurant/dashboard";
          if (vendorType === "club") redirectUrl = "/vendor-dashboard/club";
        } catch (err) {
          console.error("Could not fetch vendor for staff:", err);
        }
      }

      setTimeout(() => {
        router.push(redirectTo || redirectUrl);
      }, 300);
    } catch (error) {
      console.error("Login error:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.data?.message) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error((error as any).response.data.message);
      } else {
        toast.error(error instanceof Error ? error.message : "Check credentials and try again");
      }
      setUserNotExist(true);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xs">
                <CardHeader className="space-y-3 pb-6 md:pb-8 px-4 sm:px-6 md:px-8">
                    <CardTitle className="text-2xl sm:text-3xl font-semibold text-center text-[#222]">
                    Staff Login 🔑
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
                    Access your vendor&apos;s dashboard with your assigned permissions
                    </CardDescription>
                </CardHeader>

                <CardContent className="px-4 sm:px-6 md:px-8">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-light text-gray-700">
                        Email address
                        </Label>
                        <div className="relative">
                        <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your staff email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`pl-10 h-10 sm:h-12 ${
                            errors.email ? "border-red-600 ring-red-600" : ""
                            }`}
                        />
                        </div>
                        {errors.email && (
                        <p className="mt-1 text-xs text-red-600 font-light flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                        </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-light text-gray-700">
                        Password
                        </Label>
                        <div className="relative">
                        <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your secure password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`pl-10 pr-10 h-10 sm:h-12 ${
                            errors.password ? "border-red-600 ring-red-600" : ""
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        </div>
                        {errors.password && (
                        <p className="mt-1 text-xs text-red-600 font-light flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.password}
                        </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-10 sm:h-12 bg-[#60A5FA] hover:bg-[#3B82F6] text-white"
                        disabled={loading}
                    >
                        {loading ? "Signing you in..." : "Sign in"}
                    </Button>
                    </form>

                    {userNotExist && (
                    <div className="mt-4 rounded-md p-3 italic bg-red-50 text-red-700" role="alert">
                        Staff account not found. Contact your vendor admin.
                    </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center text-sm text-gray-500">
                    <p>
                    Need access? Ask your vendor admin to add you as a staff member.
                    </p>
                </CardFooter>
                </Card>
            </div>
        </div>
  );
}
