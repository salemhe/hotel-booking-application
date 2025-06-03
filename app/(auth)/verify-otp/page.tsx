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



// "use client";
// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { AxiosError } from "axios";
// import { CheckCircle2 } from "lucide-react";

// export default function OTPVerificationPage() {
//   return (
//     <Suspense fallback={<div className="h-screen flex justify-center items-center">Loading...</div>}>
//       <OTPVerificationComponent />
//     </Suspense>
//   );
// }

// function OTPVerificationComponent() {
//   const [otpArray, setOtpArray] = useState(Array(6).fill(""));
//   const [email, setEmail] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const emailFromParams = searchParams.get("email");
//     if (emailFromParams) {
//       setEmail(emailFromParams);
//     }
//   }, [searchParams]);

//   const handleChange = (value: string, index: number) => {
//     if (!/^\d?$/.test(value)) return;

//     const newOtp = [...otpArray];
//     newOtp[index] = value;
//     setOtpArray(newOtp);

//     const nextInput = document.getElementById(`otp-${index + 1}`);
//     if (value && nextInput) nextInput.focus();
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
//     const pasteData = e.clipboardData.getData("Text").slice(0, 6);
//     if (!/^\d{6}$/.test(pasteData)) return;

//     const newOtp = pasteData.split("");
//     setOtpArray(newOtp);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const otp = otpArray.join("");

//     try {
//       const res = await fetch("/api/users/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data?.message || "Verification failed");
//       }

//       toast.success("Email verified successfully!");
//       router.push("/user-login");
//     } catch (error: unknown) {
//       const message =
//         error instanceof AxiosError
//           ? error.response?.data?.message || error.message
//           : (error as Error).message;
//       toast.error(message || "OTP verification failed");
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       const res = await fetch("/api/users/resend-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email }),
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         throw new Error(data?.message || "Resend failed");
//       }

//       toast.success("OTP resent successfully!");
//     } catch (error: unknown) {
//       const message =
//         error instanceof AxiosError
//           ? error.response?.data?.message || error.message
//           : (error as Error).message;
//       toast.error(message || "Failed to resend OTP");
//     }
//   };

//   const allFilled = otpArray.every((val) => val !== "");

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center px-4">
//       <div className="w-full max-w-md space-y-6">
//         <div className="text-center">
//           <h2 className="text-xl font-medium text-[#222]">Verify Your Email</h2>
//           <p className="text-sm text-[#444] mt-2">
//             Enter the 6-digit code sent to <span className="font-medium">{email}</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex justify-between gap-2" onPaste={handlePaste}>
//             {otpArray.map((digit, index) => (
//               <input
//                 key={index}
//                 id={`otp-${index}`}
//                 type="text"
//                 inputMode="numeric"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleChange(e.target.value, index)}
//                 className="w-12 h-12 text-center border border-gray-300 rounded-md text-[#6d727b] text-xl focus:outline-none focus:ring-2 focus:ring-[#0a646d]"
//               />
//             ))}
//             {allFilled && (
//               <CheckCircle2 className="text-[#E0B300] w-6 h-6 self-center ml-2" />
//             )}
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 text-white font-semibold rounded-md bg-[#0a646d] hover:opacity-90 transition"
//           >
//             Verify OTP
//           </button>

//           <button
//             type="button"
//             onClick={handleResendOTP}
//             className="text-sm text-gray-900 hover:underline text-center block w-full"
//           >
//             Resend OTP
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
