"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { api } from "@/lib/axios-config"
import { toast } from "sonner"
import { AxiosError } from "axios"
import {  Mail, Phone, Lock, Loader2, ArrowLeft, User } from "lucide-react"

export default function UserSignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/register", { ...formData, isVerified: false });

      toast.success("Registration successful! Please verify your email.");
      router.push(`/verify-otp?email=${formData.email}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else if (error instanceof Error) {
        toast.error(error.message || "Registration failed");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const getInputIcon = (field: string) => {
    switch (field) {
      case 'firstName':
      case 'lastName':
        return <User className="h-4 w-4 text-gray-400" />;
      case 'email':
        return <Mail className="h-4 w-4 text-gray-400" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-gray-400" />;
      case 'password':
        return <Lock className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const formatLabel = (field: string) => {
    return field
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
     <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
  <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
    <Card className="bg-white rounded-xl shadow-md border border-gray-100">
      <CardHeader className="space-y-3 pb-6 md:pb-8 px-4 sm:px-6 md:px-8">
        <CardTitle className="text-2xl font-light text-center text-[#222]">
          Create Account
        </CardTitle>
        <CardDescription className="text-center text-[#6d727b] text-sm">
          Sign up for a new account to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 md:px-8">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["firstName", "lastName"].map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field} className="text-sm font-light text-[#6d727b]">
                  {formatLabel(field)}
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {getInputIcon(field)}
                  </div>
                  <Input
                    id={field}
                    name={field}
                    type="text"
                    required
                    onChange={handleChange}
                    placeholder={formatLabel(field)}
                    className="pl-10 h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8]
                    focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>
            ))}
          </div>

          {["email", "phone", "password"].map((field) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field} className="text-sm font-light text-[#6d727b]">
                {formatLabel(field)}
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {getInputIcon(field)}
                </div>
                <Input
                  id={field}
                  name={field}
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  required
                  onChange={handleChange}
                  placeholder={
                    field === "email"
                      ? "Enter your email address"
                      : field === "phone"
                      ? "Enter your phone number"
                      : "Enter your secure password"
                  }
                  className="pl-10 h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8]
                focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                />
              </div>
            </div>
          ))}

          <Button
            type="submit"
            className="w-full h-10 sm:h-11 rounded-md bg-[#0a646d] text-white text-sm font-light transition-transform duration-200 hover:shadow-lg hover:bg-[#127a87]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-5 pb-6 px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 border-t border-gray-200" />
          <span className="text-xs text-[#6d727b] font-light">OR</span>
          <div className="flex-1 border-t border-gray-200" />
        </div>
        <Link
          href="/user-login"
          className="inline-flex items-center justify-center gap-2 text-[#0a646d] hover:text-[#074f55] transition-all text-sm font-light group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-150" />
          Already have an account? Log in
        </Link>
      </CardFooter>
    </Card>
  </div>
</div>

  );
}


