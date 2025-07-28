"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
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
import { toast } from "sonner";
import { AxiosError } from "axios";
import { AuthService } from "@/app/lib/api/services/userAuth.service";

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthService.login(email, password);
      
      if (response.token) {
        // Set token and get user profile
        AuthService.setToken(response.token);
        const userId = AuthService.extractUserId(response.token);
        
        if (userId) {
          const user = await AuthService.getUser(userId);
          AuthService.setUser(user);
        }
        
        toast.success("Welcome back!");
        router.push("/userDashboard/search");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Login failed");
      } else if (error instanceof Error) {
        toast.error(error.message || "Login failed");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
        <Card className="border rounded-lg shadow-md bg-white">
          <CardHeader className="space-y-3 pb-6 md:pb-8 px-6 sm:px-8">
            <CardTitle className="text-2xl sm:text-3xl font-light text-center text-[#222]">
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-[#6d727b] text-sm sm:text-base">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="space-y-1">
                <Label
                  htmlFor="email"
                  className="text-sm font-light text-[#6d727b]"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3.5 h-4 w-4 stroke-[1.25] text-[#8a8f9a]"
                    strokeWidth={1.25}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10 h-10 sm:h-12 rounded-md border border-gray-300 bg-white text-[#6d727b] placeholder-[#a0a3a8]
                    focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="password"
                  className="text-sm font-light text-[#6d727b]"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3.5 h-4 w-4 stroke-[1.25] text-[#8a8f9a]"
                    strokeWidth={1.25}
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-10 sm:h-12 rounded-md border border-gray-300 bg-white text-[#6d727b] placeholder-[#a0a3a8]
                    focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-12 bg-[#60a5fa] hover:bg-[#3b82f6] text-white font-light rounded-md
                transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="px-6 sm:px-8 pb-6 md:pb-8">
            <p className="w-full text-center text-sm text-[#6d727b]">
              Don&apos;t have an account?{" "}
              <Link
                href="/user-signup"
                className="text-[#60a5fa] hover:text-[#3b82f6] font-normal transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserLoginPage;
