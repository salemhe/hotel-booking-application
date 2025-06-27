// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Button } from "@/app/components/ui/button";
// import { Input } from "@/app/components/ui/input";
// import { Label } from "@/app/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/app/components/ui/card";
// import { Store, Mail, Lock, ArrowRight } from "lucide-react";
// import { AuthService } from "@/app/lib/api/services/auth.service";
// import { toast } from "sonner";

// export default function VendorLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // In your page.tsx handleSubmit function
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Retrieve user role from localStorage (replace with API call in real apps)
//       // const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
//       // if (storedUser.email === email) {
//       //   localStorage.setItem("role", storedUser.role)
//       //   router.push(storedUser.role === "super-admin" ? "/vendorDashboard/insights" : "/vendorDashboard")
//       // }
//       const response = await AuthService.login(email, password);

//       toast.success(`Welcome back, ${response.profile.businessName}!`);
//       router.push("/vendorDashboard"); // TODO replace with onboarding page
//     } catch (error) {
//       console.error("Submit error:", error);
//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Please check your credentials and try again"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-[100dvh] bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
//       <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
//         <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xs">
//           <CardHeader className="space-y-3 pb-6 md:pb-8 px-4 sm:px-6 md:px-8">
//             <div className="flex justify-center mb-2">
//               <Store className="h-12 w-12 text-emerald-600" />
//             </div>
//             <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
//               Vendor Login
//             </CardTitle>
//             <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
//               Welcome back! Please log in to your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="px-4 sm:px-6 md:px-8">
//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="email"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Email
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="business@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/60"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="password"
//                   className="text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className="pl-10 h-10 sm:h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white/60"
//                   />
//                 </div>
//               </div>
//               <Button
//                 type="submit"
//                 className="w-full h-10 sm:h-12 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                     <span>Logging in...</span>
//                   </div>
//                 ) : (
//                   "Sign in"
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
//             <div className="flex items-center gap-3 w-full">
//               <div className="flex-1 border-t border-gray-200" />
//               <span className="text-xs sm:text-sm text-gray-500 font-medium">
//                 OR
//               </span>
//               <div className="flex-1 border-t border-gray-200" />
//             </div>
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-sm">
//               <Link
//                 href="/vendor-signup"
//                 className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium inline-flex items-center gap-2 group"
//               >
//                 Create a vendor account
//                 <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
//               </Link>
//               <Link
//                 href="/forgot-password"
//                 className="text-gray-600 hover:text-emerald-600 transition-colors"
//               >
//                 Forgot password?
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }



// .................................................................................................
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
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { toast } from "sonner";

export default function VendorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [userNotExist, setUserNotExist] = useState(false);

  const router = useRouter();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Enter your email address";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (!password.trim()) {
      newErrors.password = "Enter your password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserNotExist(false);

    if (!validate()) return;
    setLoading(true);

    try {
      const response = await AuthService.login(email, password);
      await AuthService.setToken(response.profile.token)
      toast.success(`Welcome back, ${response.profile.businessName}!`);
      router.push("/vendorDashboard");
    } catch (error) {
      console.error("Submit error:", error);

      if (
        error instanceof Error &&
        (error.message.toLowerCase().includes("user does not exist") ||
          error.message.toLowerCase().includes("user not found"))
      ) {
        setUserNotExist(true);
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Please check your credentials and try again"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes errorPop {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-error-pop {
          animation: errorPop 0.25s ease forwards;
        }
      `}</style>

      <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xs">
            <CardHeader className="space-y-3 pb-6 md:pb-8 px-4 sm:px-6 md:px-8">
              <CardTitle className="text-2xl sm:text-3xl font-semibold text-center text-[#222]">
                Partner Login 🔓
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-sm sm:text-base">
                Access your dashboard to manage bookings, monitor performance,
                and grow your hospitality business
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 md:px-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6"
                noValidate
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-light text-gray-700"
                  >
                    Email address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your buisness email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-describedby="email-error"
                      className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
                        errors.email ? "border-red-600 ring-red-600" : ""
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-light text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-describedby="password-error"
                      className={`pl-10 pr-10 h-10 sm:h-12 rounded-md border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
                        errors.password ? "border-red-600 ring-red-600" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  )}
                  <div className="text-left">
                    <Link
                      href="/forgot-password"
                      className="text-xs sm:text-sm text-gray-600 hover:text-[#60A5FA] transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
                      </div>
                      <span className="ml-2">Signing you in...</span>
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>

              {userNotExist && (
                <div
                  className="mt-4 rounded-md p-3 italic"
                  style={{ backgroundColor: "#E8FFE1", color: "#222" }}
                  role="alert"
                >
                  This user doesn&apos;t exist.{" "}
                  <Link href="/vendor-signup" className="underline font-semibold">
                    Create an account
                  </Link>
                  .
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8">
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 border-t border-gray-200" />
                <span className="text-xs sm:text-sm text-gray-500 font-light">OR</span>
                <div className="flex-1 border-t border-gray-200" />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full text-sm">
                <Link
                  href="/vendor-signup"
                  className="text-[#60A5FA] hover:text-[#3B82F6] transition-colors font-light inline-flex items-center gap-2 group"
                >
                  Create a Business account
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
