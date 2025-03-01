"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
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
import { setAuthToken } from "@/lib/axios-config";
import { toast } from "sonner";
import { AxiosError } from "axios";
import API from "@/utils/axios";
import { AuthService } from "@/services/auth.services";

interface DecodedToken {
  id?: string;
  exp?: number;
  iat?: number;
}

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const extractUserId = (decodedToken: DecodedToken): string => {
    const userId = decodedToken.id;
    if (!userId) throw new Error("Unable to extract user ID from token");
    return userId;
  };

  // const storeAuthInfo = (token: string, decodedToken: DecodedToken) => {
  //   localStorage.setItem("authToken", token);
  //   const userId = extractUserId(decodedToken);
  //   localStorage.setItem("userId", userId);
  //   if (decodedToken.exp) {
  //     localStorage.setItem("tokenExp", (decodedToken.exp * 1000).toString());
  //   }
  //   setAuthToken(token);
  // };

  const validateToken = (decodedToken: DecodedToken): boolean => {
    if (!decodedToken.id || !decodedToken.exp) return false;
    return decodedToken.exp * 1000 > Date.now() + 5000;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/users/login", { email, password });
      if (!data.token) throw new Error("No token received");

      const decodedToken = jwtDecode(data.token);
      if (!validateToken(decodedToken)) throw new Error("Invalid token");

      const userId = extractUserId(decodedToken);
      AuthService.setToken(data.token);
      const response = await API.get(`/users/profile/${userId}`);
      const user = response.data;
      AuthService.setUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
      });

      toast.success("Welcome back!");
      router.push("/userDashboard");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Login failed");
      } else if (error instanceof Error) {
        toast.error(error.message || "Login failed");
      } else {
        toast.error("An unknown error occurred");
      }

      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExp");
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xs">
          <CardHeader className="space-y-3 pb-6 md:pb-8 px-4 sm:px-6 md:px-8">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
              Enter your credentials to access your account
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
                    placeholder="name@example.com"
                    className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/60"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/60"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1 mt-1"
                >
                  Forgot your password?
                </Link>
              </div>
              <Button
                type="submit"
                className="w-full h-10 sm:h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    Signing in...
                  </>
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
            <Link
              href="/user-signup"
              className="inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm sm:text-base font-medium group"
            >
              Create a new account
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserLoginPage;