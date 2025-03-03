"use client";
import { useState, useEffect, Suspense } from "react";
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
} from "@/components/ui/card";
import { api } from "@/lib/axios-config";
import { toast } from "sonner";
import { AxiosError } from "axios";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default function OTPVerificationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OTPVerificationComponent />
    </Suspense>
  );
}

function OTPVerificationComponent() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    } else {
      // Redirect if no email is found
      router.push("/user-signup");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users/verify-otp", { email, otp });

      // Show success toast
      toast.success("Email verified successfully!");

      // Redirect to login page
      router.push("/user-login");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data?.message || "OTP verification failed"
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "OTP verification failed");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>Enter the OTP sent to {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  minLength={6}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              Verify OTP
            </Button>
          </form>
          <Button
            type="button"
            className="w-full mt-4"
            variant="link"
            onClick={async () => {
              try {
                await api.post("/users/resend-otp", { email });
                toast.success("OTP resent successfully!");
              } catch (error: unknown) {
                if (error instanceof AxiosError) {
                  toast.error(
                    error.response?.data?.message || "Failed to resend OTP"
                  );
                } else if (error instanceof Error) {
                  toast.error(error.message || "Failed to resend OTP");
                } else {
                  toast.error("An unknown error occurred");
                }
              }
            }}
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
