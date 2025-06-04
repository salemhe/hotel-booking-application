// "use client";
// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { api } from "@/lib/axios-config";
// import { toast } from "sonner";
// import { AxiosError } from "axios";

// const Loading = () => {
//   return (
//     <div className="flex items-center justify-center w-full h-screen">
//       <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
//     </div>
//   );
// };

// export default function OTPVerificationPage() {
//   return (
//     <Suspense fallback={<Loading />}>
//       <OTPVerificationComponent />
//     </Suspense>
//   );
// }

// function OTPVerificationComponent() {
//   const [otp, setOtp] = useState("");
//   const [email, setEmail] = useState("");
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const emailFromParams = searchParams.get("email");
//     if (emailFromParams) {
//       setEmail(emailFromParams);
//     } else {
//       // Redirect if no email is found
//       router.push("/user-signup");
//     }
//   }, [searchParams, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post("/users/verify-otp", { email, otp });

//       // Show success toast
//       toast.success("Email verified successfully!");

//       // Redirect to login page
//       router.push("/user-login");
//     } catch (error: unknown) {
//       if (error instanceof AxiosError) {
//         toast.error(
//           error.response?.data?.message || "OTP verification failed"
//         );
//       } else if (error instanceof Error) {
//         toast.error(error.message || "OTP verification failed");
//       } else {
//         toast.error("An unknown error occurred");
//       }
//     }
//   };

//   return (
//     <div className="container mx-auto py-10 px-4">
//       <Card className="max-w-md mx-auto">
//         <CardHeader>
//           <CardTitle>Verify Your Email</CardTitle>
//           <CardDescription>Enter the OTP sent to {email}</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit}>
//             <div className="grid w-full items-center gap-4">
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="otp">OTP</Label>
//                 <Input
//                   id="otp"
//                   placeholder="Enter 6-digit OTP"
//                   value={otp}
//                   onChange={(e) => setOtp(e.target.value)}
//                   maxLength={6}
//                   minLength={6}
//                   required
//                 />
//               </div>
//             </div>
//             <Button type="submit" className="w-full mt-4">
//               Verify OTP
//             </Button>
//           </form>
//           <Button
//             type="button"
//             className="w-full mt-4"
//             variant="link"
//             onClick={async () => {
//               try {
//                 await api.post("/users/resend-otp", { email });
//                 toast.success("OTP resent successfully!");
//               } catch (error: unknown) {
//                 if (error instanceof AxiosError) {
//                   toast.error(
//                     error.response?.data?.message || "Failed to resend OTP"
//                   );
//                 } else if (error instanceof Error) {
//                   toast.error(error.message || "Failed to resend OTP");
//                 } else {
//                   toast.error("An unknown error occurred");
//                 }
//               }
//             }}
//           >
//             Resend OTP
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




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

// fallback loader component
const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

// Main export
export default function OTPVerificationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <OTPVerificationComponent />
    </Suspense>
  );
}

// Actual OTP verification logic
function OTPVerificationComponent() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get email from query params
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

  const handleResend = async () => {
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-[#222]">
            OTP Verification
          </CardTitle>
        </CardHeader>

        {/* Message Box */}
        <div className="bg-[#d3f0e1] text-sm text-gray-800 px-4 py-3 mx-4 rounded-md mb-2">
          We've sent a verification code to your email address – <b>{email}</b>
        </div>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="otp" className="text-sm text-gray-700 mt-4">
                Enter verification code
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                minLength={6}
                required
              />
              <Button
                type="submit"
                className="mt-4 w-full bg-[#0a596d] text-white rounded-md hover:bg-[#117a8b]"
              >
                Submit
              </Button>
            </div>
          </form>

          <Button
            type="button"
            className="w-full mt-3 text-[#0a596d] hover:underline"
            variant="link"
            onClick={handleResend}
          >
            Resend OTP
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}



















// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import { api } from "@/lib/axios-config";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// const OTPVerificationPage = () => {
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [timer, setTimer] = useState(60);
//   const [email, setEmail] = useState("");
//   const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // This checks if the email is present in the search params
//   useEffect(() => {
//     const emailFromParams = searchParams.get("email");
//     if (emailFromParams) {
//       setEmail(emailFromParams);
//     } else {
//       // Redirect if no email is found
//       router.push("/user-signup");
//     }
//   }, [searchParams, router]);

//   // Timer countdown effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Handle digit input
//   const handleChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Move to next input if not last and input is valid
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   // Handle backspace navigation
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace" && otp[index] === "" && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   // Handle OTP submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const fullOtp = otp.join("");

//     if (fullOtp.length !== 6) {
//       toast.error("Please enter all 6 digits", {
//         style: { backgroundColor: "#e0b300", color: "#000" },
//       });
//       return;
//     }

//     try {
//       await api.post("/users/verify-otp", { email, otp: fullOtp });
//       toast.success("OTP verified successfully", {
//         style: { backgroundColor: "#fff", color: "#222" },
//       });
//       router.push("/user-login");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "OTP verification failed", {
//         style: { backgroundColor: "fff", color: "#222" },
//       });
//     }
//   };

//   // Handle resend OTP
//   const handleResend = async () => {
//     if (timer > 0) return;

//     try {
//       await api.post("/users/resend-otp", { email });
//       toast.success("OTP resent successfully", {
//         style: { backgroundColor: "#fff", color: "#222" },
//       });
//       setTimer(60);
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to resend OTP", {
//         style: { backgroundColor: "#fff", color: "#222" },
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-4">
//       <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl">
//         <CardHeader className="text-center space-y-2">
//           <CardTitle className="text-2xl font-semibold text-[#222]">OTP verification</CardTitle>
//           <CardDescription className="text-sm text-gray-500 leading-relaxed font-light">
//             Please enter the OTP (One-Time Password) sent to your registered email/phone number to complete your verification.
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* OTP Inputs */}
//             <div className="flex justify-center gap-3">
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleChange(index, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                   ref={(el) => (inputRefs.current[index] = el)}
//                   className="w-12 h-12 rounded-md border border-gray-300 text-center text-xl text-[#1c1544] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0a596d] transition"
//                   required
//                 />
//               ))}
//             </div>

//             {/* Timer and resend section */}
//             <div className="text-sm text-gray-500 flex justify-between mt-2 px-1 font-light">
//               {timer > 0 ? (
//                 <span>
//                   Remaining time:{" "}
//                   <span className="font-medium text-[#1c1544]">
//                     00:{timer < 10 ? `0${timer}` : timer}
//                   </span>
//                 </span>
//               ) : (
//                 <span className="invisible">Timer done</span>
//               )}
//               <span>
//                 Didn’t get the code?{" "}
//                 <button
//                   type="button"
//                   onClick={handleResend}
//                   disabled={timer > 0}
//                   className={`font-medium ${
//                     timer === 0
//                       ? "text-[#0a596d] hover:underline"
//                       : "text-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   Resend
//                 </button>
//               </span>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col gap-3 mt-4">
//               <button
//                 type="submit"
//                 className="w-full bg-[#0a596d] hover:bg-[#084b5c] text-white text-base rounded-md py-2 transition-colors"
//               >
//                 Verify
//               </button>
//               <button
//                 type="button"
//                 onClick={() => router.back()}
//                 className="w-full border border-[#0a596d] text-[#0a596d] text-base rounded-md py-2 hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>

//             {/* Learn More Link */}
//             <div className="text-xs text-center text-gray-400 mt-4 font-light">
//               Wondering how we use this code for verification?{" "}
//               <a href="#" className="text-[#0a596d] hover:underline font-medium">
//                 Know here
//               </a>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default OTPVerificationPage;
