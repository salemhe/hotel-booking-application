"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/components/ui/card";
import { Store, Mail, Lock, ArrowRight } from "lucide-react";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { toast } from "sonner";

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // In your page.tsx handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Retrieve user role from localStorage (replace with API call in real apps)
      // const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      // if (storedUser.email === email) {
      //   localStorage.setItem("role", storedUser.role)
      //   router.push(storedUser.role === "super-admin" ? "/vendorDashboard/insights" : "/vendorDashboard")
      // }
      const response = await AuthService.login(email, password);

      toast.success(`Welcome back, ${response.profile.businessName}!`);
      router.push("/vendorDashboard"); // TODO replace with onboarding page
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Please check your credentials and try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xs">
          <CardHeader className="space-y-3 pb-6 md:pb-8 px-4 sm:px-6 md:px-8">
            <div className="flex justify-center mb-2">
              <Store className="h-12 w-12 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Vendor Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
              Welcome back! Please log in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 md:px-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="business@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/60"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/60"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-10 sm:h-12 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 border-t border-gray-200" />
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                OR
              </span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-sm">
              <Link
                href="/vendor-signup"
                className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium inline-flex items-center gap-2 group"
              >
                Create a vendor account
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/forgot-password"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
