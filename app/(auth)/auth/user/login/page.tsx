"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/slices/authSlice";
import { UserProfile } from "@/types/auth";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const getCurrentYear = () => new Date().getFullYear();

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleLogin = async () => {
    if (formValidation()) {
      setError({ email: "", password: "" });
      console.log("Logging in with:", formData);
    }
    try {
      setIsloading(true);
      const user = await AuthService.login(
        formData.email,
        formData.password,
        "user"
      );
      console.log(user);
      dispatch(loginSuccess(user?.user as UserProfile));
      toast.success("Welcome back!");
      router.push(redirectTo);
    } catch (err: unknown) {
      if (err instanceof AxiosError) toast.error(err.response?.data.message);
    } finally {
      setIsloading(false);
    }
  };

  const formValidation = () => {
    // Basic validation logic
    if (!formData.email) {
      setError((prev) => ({ ...prev, email: "Email is required." }));
      return false;
    }
    if (!formData.password) {
      setError((prev) => ({ ...prev, password: "Password is required." }));
      return false;
    }
    if (formData.password.length < 6) {
      setError((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters.",
      }));
      return false;
    }
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-white shadow-none p-0 border-none">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-6 h-6 bg-[#60A5FA] rounded-full flex items-center justify-center"></div>
            <span className="text-xl font-semibold text-gray-900">Rhace</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-600">
            We&apos;re glad to see you again. Please log in to your account.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full"
            />
            {error.email && (
              <p className="text-sm text-red-600 mt-1">{error.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                placeholder="********"
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error.password && (
              <p className="text-sm text-red-600 mt-1">{error.password}</p>
            )}
          </div>
          <div className="flex justify-end">
            <a
              href="/auth/user/forgot-password"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>
          <Button
            disabled={!formData.email || !formData.password || isLoading}
            onClick={handleLogin}
            className="w-full bg-[#0A6C6D] hover:bg-[#085253] text-white font-medium py-2.5 mt-6"
          >
            {isLoading ? (
              <span className="flex items-center gap-1">
                Loading <Loader2 className="animate-spin" />
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <p className="text-sm text-center text-gray-600">
            Don&apos;t Have An Account?{" "}
            <a
              href="/auth/user/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center w-full text-xs text-gray-500">
            <span>Copyright © {getCurrentYear()} Rhace Enterprises LTD.</span>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
