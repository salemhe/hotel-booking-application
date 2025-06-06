"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/components/ui/card";
import {
  Store,
  Mail,
  Lock,
  User,
  Building2,
  ArrowLeft,
  Phone,
  MapPin,
  GitBranch,
} from "lucide-react";
import Link from "next/link";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { toast } from "sonner";

export default function VendorSignupPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Hotel", // Added businessType field with default value
    name: "",
    email: "",
    phone: "",
    address: "",
    branch: "", // Added branch field
    password: "",
    role: "vendor" as "vendor" | "super-admin",
    services: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.register(formData);
      setShowOTPInput(true);
      toast.success("Please check your email for the OTP verification code.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.verifyOTP(formData.email, otp);
      toast.success("Your account has been verified. Please log in.");
      router.push("/vendor-login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await AuthService.resendOTP(formData.email);
      toast.success("Please check your email for the new verification code.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xs">
          <CardHeader className="space-y-3 pb-6 px-6">
            <div className="flex justify-center mb-2">
              <Store className="h-12 w-12 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {showOTPInput ? "Verify Your Email" : "Create Vendor Account"}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6">
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      placeholder="Your Business Name"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="businessType"
                      name="businessType"
                      type="text"
                      placeholder="Hotel, Restaurant, etc."
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="business@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Your Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Business Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="branch"
                      name="branch"
                      type="text"
                      placeholder="Branch Location (if applicable)"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a secure password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Services Selection */}
                <div className="space-y-2">
                  <Label>Services Offered</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Hotel", "Restaurant"].map((service) => (
                      <Button
                        key={service}
                        type="button"
                        variant={
                          formData.services.includes(service)
                            ? "default"
                            : "outline"
                        }
                        className={`${
                          formData.services.includes(service)
                            ? "bg-emerald-600 text-white"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            services: prev.services.includes(service)
                              ? prev.services.filter((s) => s !== service)
                              : [...prev.services, service],
                          }));
                        }}
                      >
                        {service}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Account Type Selection */}
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, role: "vendor" }))
                      }
                      className={`w-1/2 flex items-center justify-center gap-2 ${
                        formData.role === "vendor"
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <Store className="h-4 w-4" />
                      Vendor
                    </Button>
                    <Button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          role: "super-admin",
                        }))
                      }
                      className={`w-1/2 flex items-center justify-center gap-2 ${
                        formData.role === "super-admin"
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Super Admin
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-linear-to-r from-emerald-600 to-teal-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-6 px-6">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs text-gray-500 font-medium">OR</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
            <Link
              href="/vendor-login"
              className="inline-flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium group"
            >
              <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
              Already have an account? Log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
