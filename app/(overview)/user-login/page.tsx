"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { api, setAuthToken } from "@/lib/axios-config";
import { toast } from "sonner";

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

  const storeAuthInfo = (token: string, decodedToken: DecodedToken) => {
    localStorage.setItem("authToken", token);
    const userId = extractUserId(decodedToken);
    localStorage.setItem("userId", userId);
    if (decodedToken.exp) {
      localStorage.setItem("tokenExp", (decodedToken.exp * 1000).toString());
    }
    setAuthToken(token);
  };

  const validateToken = (decodedToken: DecodedToken): boolean => {
    if (!decodedToken.id || !decodedToken.exp) return false;
    return decodedToken.exp * 1000 > Date.now() + 5000;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/users/login', { email, password });
      if (!data.token) throw new Error("No token received");

      const decodedToken = jwtDecode(data.token);
      if (!validateToken(decodedToken)) throw new Error("Invalid token");

      storeAuthInfo(data.token, decodedToken);
      
      const userId = extractUserId(decodedToken);
      await api.get(`/users/profile/${userId}`);

      toast.success("Welcome back!");
      router.push("/userDashboard");
    } catch (error: any) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExp");
      setAuthToken(null);
      
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Link 
              href="/forgot-password"
              className="text-gray-500 hover:text-gray-600 transition-colors justify-self-end "
            >
              Forgot your password?
            </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="flex items-center space-x-2">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <div className="flex flex-col space-y-2 w-full text-sm">
            <Link 
              href="/user-signup"
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              Create a new account
            </Link>
           
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserLoginPage;