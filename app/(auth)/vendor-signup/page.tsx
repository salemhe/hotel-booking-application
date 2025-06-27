// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/app/components/ui/button";
// import { Input } from "@/app/components/ui/input";
// import { Label } from "@/app/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
//   CardDescription,
// } from "@/app/components/ui/card";
// import {
//   Store,
//   Mail,
//   Lock,
//   // User,
//   Building2,
//   ArrowLeft,
//   // Phone,
//   MapPin,
//   GitBranch,
//   AlertCircle,
//   Globe,
//   // Building,
//   User2,
//   PhoneCall,
// } from "lucide-react";
// import Link from "next/link";
// import { AuthService } from "@/app/lib/api/services/auth.service";
// import { toast } from "sonner";
// import { FaStore } from "react-icons/fa6";

// export default function VendorSignupPage() {
//   const [formData, setFormData] = useState({
//     businessName: "",
//     businessType: "Hotel",
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     branch: "",
//     password: "",
//     role: "vendor" as "vendor" | "super-admin",
//     services: [] as string[],
//   });

//   const [loading, setLoading] = useState(false);
//   const [showOTPInput, setShowOTPInput] = useState(false);
//   const [otp, setOTP] = useState("");
//   const router = useRouter();

//   //Expanded errors state to accommodate all fields
//   const [errors, setErrors] = useState<Partial<typeof formData>>({});

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Clear error when user starts typing
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const validateForm = () => {
//     const newErrors: Partial<typeof formData> = {};

//     if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Please enter a valid email address.";
//     }

//     if (!formData.phone || !/^[0-9]{10,15}$/.test(formData.phone)) {
//       newErrors.phone = "Enter a valid phone number.";
//     }

//     if (!formData.password || formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters.";
//     }

//     if (!formData.name.trim()) {
//       newErrors.name = "Full name is required.";
//     }

//     if (!formData.businessName.trim()) {
//       newErrors.businessName = "Business name is required.";
//     }

//     if (!formData.address.trim()) {
//       newErrors.address = "Address is required.";
//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       await AuthService.register(formData);
//       setShowOTPInput(true);
//       toast.success("Please check your email for the OTP verification code.");
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Please try again");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOTPVerification = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await AuthService.verifyOTP(formData.email, otp);
//       toast.success("Your account has been verified. Please log in.");
//       router.push("/vendor-login");
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Please try again");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       await AuthService.resendOTP(formData.email);
//       toast.success("Please check your email for the new verification code.");
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Please try again");
//     }
//   };

//   return (
//     <>
//       <style jsx global>{`
//         @keyframes errorPop {
//           0% {
//             opacity: 0;
//             transform: scale(0.85);
//           }
//           100% {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
//         .animate-error-pop {
//           animation: errorPop 0.25s ease forwards;
//         }
//       `}</style>

//     <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xs">
//           <CardHeader className="space-y-3 pb-6 px-6">
//             <CardTitle className="text-2xl sm:text-3xl font-semibold text-center text-[#222]">
//               {showOTPInput ? "Verify Your Email" : "Create Business Account 🔐"}
//              <CardDescription className="mt-2 text-center text-gray-600 text-sm sm:text-base">
//                 Access your dashboard to manage bookings, monitor performance,
//                 and grow your hospitality business
//               </CardDescription>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="px-6">
//             {showOTPInput ? (
//               <form onSubmit={handleOTPVerification} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="otp">Enter Verification Code</Label>
//                   <Input
//                     id="otp"
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOTP(e.target.value)}
//                     placeholder="Enter OTP"
//                     required
//                     className="h-12"
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white h-12"
//                   disabled={loading}
//                 >
//                   {loading ? "Verifying..." : "Verify Email"}
//                 </Button>
//                 <div className="text-center">
//                   <button
//                     type="button"
//                     onClick={handleResendOTP}
//                     className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
//                   >
//                     {" Didn't receive code? Resend"}
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="businessName"
//                     className="text-sm font-light text-gray-700"
//                   >
//                     Business Name
//                   </Label>
//                   <div className="relative">
//                     <Building2 className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="businessName"
//                       name="businessName"
//                       type="text"
//                       placeholder="Enter your Business Name"
//                       value={formData.businessName}
//                       onChange={handleInputChange}
//                       aria-describedby={errors.businessName ? "businessName-error" : undefined}
//                       className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
//                         errors.businessName ? "border-red-600 ring-red-600" : ""
//                       }`}
//                     />
//                   </div>
//                   {errors.businessName && (
//                     <p id="businessName-error" className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.businessName}
//                     </p>
//                   )}
//                 </div>

//                 {/* Business Type */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="businessType"
//                     className="text-sm font-light text-gray-700"
//                   >
//                     Business Type
//                   </Label>
//                   <div className="relative">
//                     <Store className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="businessType"
//                       name="businessType"
//                       type="text"
//                       placeholder="What type of business do you run ?"
//                       value={formData.businessType}
//                       onChange={handleInputChange}
//                       aria-describedby={errors.businessType ? "businessType-error" : undefined}
//                       className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
//                         errors.businessType ? "border-red-600 ring-red-600" : ""
//                       }`}
//                     />
//                   </div>
//                     {errors.businessType && (
//                     <p id="businessType-error" className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.businessType}
//                     </p>
//                   )}
//                 </div>

//                 {/* Full name */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="name"
//                     className="text-sm font-light text-gray-700"
//                   >
//                     Full Name
//                   </Label>
//                   <div className="relative">
//                     <User2 className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="name"
//                       name="name"
//                       type="text"
//                       placeholder="Your Full Name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       aria-describedby={errors.name ? "name-error" : undefined}
//                       className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
//                         errors.name ? "border-red-600 ring-red-600" : ""
//                       }`}
//                     />
//                   </div>
//                     {errors.name && (
//                     <p id="businessType-error" className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.name}
//                     </p>
//                   )}
//                 </div>

//                 {/* business email */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="email"
//                     className="text-sm font-light text-gray-700"
//                   >
//                     Business Email
//                   </Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       placeholder="Enter your buisness email address"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       aria-describedby={errors.email ? "email-error" : undefined}
//                       className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
//                         errors.email ? "border-red-600 ring-red-600" : ""
//                       }`}
//                     />
//                   </div>
//                   {errors.email && (
//                     <p
//                       id="email-error"
//                       className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.email}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="phone"
//                     className="text-sm font-light text-gray-700"
//                   >
//                     Phone Number
//                   </Label>

//                   <div className="relative">
//                     <PhoneCall className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       placeholder="Enter your Phone Number"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       aria-describedby={errors.phone ? "phone-error" : undefined}
//                       className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
//                         errors.phone ? "border-red-600 ring-red-600" : ""
//                       }`}
//                     />
//                   </div>
//                   {errors.phone && (
//                     <p
//                       id="phone-error"
//                       className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.phone}
//                     </p>
//                   )}
//                 </div>

//                 {/* buiness address */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="address"
//                     className="text-sm font-light text-gray-700"
//                   >
//                     Business Address
//                   </Label>
//                   <div className="relative">
//                     <MapPin className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="address"
//                       name="address"
//                       type="text"
//                       placeholder="Enter your business Address"
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       aria-describedby={errors.address ? "address-error" : undefined}
//                       className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
//                         errors.phone ? "border-red-600 ring-red-600" : ""
//                       }`}
//                     />
//                   </div>
//                   {errors.address && (
//                     <p
//                       id="email-error"
//                       className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.address}
//                     </p>
//                   )}
//                 </div>

//                 {/* branch */}
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="branch"
//                     className="text-sm font-light text-gray-700"
//                   >
//                     Branch
//                   </Label>
//                   <div className="relative">
//                     <GitBranch className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="branch"
//                       name="branch"
//                       type="text"
//                       placeholder="Branch Location (if applicable)"
//                       value={formData.branch}
//                       onChange={handleInputChange}
//                       aria-describedby={errors.branch ? "branch-error" : undefined}
//                       className="pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
//                     />
//                   </div>
//                     {errors.branch && (
//                     <p id="branch-error" className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.branch}
//                     </p>
//                   )}
//                 </div>

//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="password"
//                     className="text-sm font-light text-gray-700"
//                   >
//                     Password
//                   </Label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="password"
//                       name="password"
//                       type="password"
//                       placeholder="Create a secure password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       aria-describedby={errors.password ? "password-error" : undefined}
//                       className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${errors.password ? "border-red-600 ring-red-600" : ""}`}
//                     />
//                   </div>
//                   {errors.password && (
//                     <p id="password-error" className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop">
//                       <AlertCircle className="w-4 h-4" />
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>

//                 {/* Services Selection */}
//                 <div className="space-y-2">
//                   <Label>Services Offered</Label>
//                   <div className="flex flex-wrap gap-2">
//                     {["Hotel", "Restaurant"].map((service) => (
//                       <Button
//                         key={service}
//                         type="button"
//                         variant={
//                           formData.services.includes(service)
//                             ? "default"
//                             : "outline"
//                         }
//                         className={`${
//                           formData.services.includes(service)
//                             ? "bg-[#60A5FA] text-white"
//                             : "text-gray-700"
//                         }`}
//                         onClick={() => {
//                           setFormData((prev) => ({
//                             ...prev,
//                             services: prev.services.includes(service)
//                               ? prev.services.filter((s) => s !== service)
//                               : [...prev.services, service],
//                           }));
//                         }}
//                       >
//                         {service}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Account Type Selection */}
//                 <div className="space-y-2">
//                   <Label className="text-base font-medium mb-2">Account Type</Label>
//                   <div className="flex flex-col gap-4">
//                     {/* Vendor Option */}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setFormData((prev) => ({ ...prev, role: "vendor" }))
//                       }
//                       className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ease-in-out backdrop-blur-sm hover:backdrop-blur-md transform-gpu hover:scale-[1.02] ${
//                         formData.role === "vendor"
//                           ? "bg-[#60A5FA] text-white font-light border-[#60A5FA]"
//                           : "bg-gray-100 text-black font-light border-gray-300 hover:bg-[#e0f0ff] hover:border-[#60A5FA] hover:text-[#1d4ed8] hover:shadow-md hover:shadow-blue-100"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2 mb-1">
//                         <FaStore className="w-5 h-5" />
//                         <span className="font-semibold text-base">Vendor</span>
//                       </div>
//                       <p className="text-sm opacity-80">
//                         For single-location businesses. Easily manage your reservations and daily operations from one simple, powerful dashboard.
//                       </p>
//                     </button>

//                     {/* Super Admin Option */}
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setFormData((prev) => ({ ...prev, role: "super-admin" }))
//                       }
//                       className={`w-full text-left rounded-xl border p-4 transition-all duration-300 ease-in-out backdrop-blur-sm hover:backdrop-blur-md transform-gpu hover:scale-[1.02] ${
//                         formData.role === "super-admin"
//                           ? "bg-[#60A5FA] text-white font-light border-[#60A5FA]"
//                           : "bg-gray-100 text-black font-light border-gray-300 hover:bg-[#e0f0ff]/60 hover:border-[#60A5FA] hover:text-[#1d4ed8] hover:shadow-md hover:shadow-blue-100"
//                       }`}
//                     >
//                       <div className="flex items-center gap-2 mb-1">
//                         <Globe className="w-5 h-5" />
//                         <span className="font-semibold text-base">Super Admin</span>
//                       </div>
//                       <p className="text-sm opacity-80">
//                         For businesses with multiple locations (like restaurant or hotel chains). Manage all your branches across Lagos from one dashboard — track data, handle reservations, and stay in control.
//                       </p>
//                     </button>
//                   </div>
//                 </div>

//                 <Button
//                   type="submit"
//                   className="w-full h-10 sm:h-12 bg-[#60A5FA] hover:bg-[#3B82F6] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg transition-all duration-200"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="flex gap-1">
//                         <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
//                         <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
//                         <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
//                       </div>
//                       <span className="ml-2">Creating your account...</span>
//                     </div>
//                   ) : (
//                     "Create Account"
//                   )}
//                 </Button>
//               </form>
//             )}
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4 pb-6 px-6">
//             <div className="flex items-center gap-3 w-full">
//               <div className="flex-1 border-t border-gray-200" />
//               <span className="text-xs text-gray-500 font-medium">OR</span>
//               <div className="flex-1 border-t border-gray-200" />
//             </div>
//             <Link
//               href="/vendor-login"
//               className="text-[#60A5FA] hover:text-[#3B82F6] transition-colors font-light inline-flex items-center gap-2 group"
//             >
//               <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
//               Already have an account? Log in
//             </Link>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Textarea } from "@/app/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  MapPin,
  Phone,
  Store,
  Users,
  Lock,
  Shield,
  AlertCircle,
} from "lucide-react";
// import Link from "next/link";
import { AuthService } from "@/app/lib/api/services/auth.service";
import { toast } from "sonner";
// import { FaStore } from "react-icons/fa6";
import { useRouter } from "next/navigation";

type BusinessType = "restaurant" | "hotel" | "";
type AdminType = "vendor" | "super-admin" | "";

interface FormData {
  businessName: string;
  email: string;
  address: string;
  phone: string;
  businessType: BusinessType;
  adminType: AdminType;
  password: string;
  confirmPassword: string;
  role: AdminType;
}

export default function VendorRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    email: "",
    address: "",
    phone: "",
    businessType: "",
    adminType: "",
    password: "",
    confirmPassword: "",
    role: "vendor",
  });

  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOTP] = useState("");
  const router = useRouter();

  //Expanded errors state to accommodate all fields
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone || !/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // if (!formData.name.trim()) {
    //   newErrors.name = "Full name is required.";
    // }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await AuthService.register(formData);
      setShowOTPInput(true);
      toast.success("Please check your email for the OTP verification code.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.verifyOTP(formData.email, otp);
      toast.success("Your account has been verified. Please log in.");
      router.push("/vendor-login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await AuthService.resendOTP(formData.email);
      toast.success("Please check your email for the new verification code.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again");
    }
  };

  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Information";
      case 2:
        return "Business Type";
      case 3:
        return "Account Type";
      case 4:
        return "Security Setup";
      default:
        return "Registration";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Tell us about your business";
      case 2:
        return "What type of business do you operate?";
      case 3:
        return "Choose your account management level";
      case 4:
        return "Set up your account security";
      default:
        return "Complete your registration";
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.businessName &&
          formData.email &&
          formData.address &&
          formData.phone
        );
      case 2:
        return formData.businessType !== "";
      case 3:
        return formData.adminType !== "";
      case 4:
        return (
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl pb-6 px-2 sm:px-4">
        <CardHeader className="space-y-3 pb-6 px-6">
          <CardTitle className="text-2xl sm:text-3xl font-semibold text-center text-[#222]">
            {showOTPInput ? "Verify Your Email" : "Create Business Account 🔐"}
            <CardDescription className="mt-2 text-center text-gray-600 text-sm sm:text-base">
              Access your dashboard to manage bookings, monitor performance, and
              grow your hospitality business
            </CardDescription>
          </CardTitle>
        </CardHeader>
        {showOTPInput ? (
          <form onSubmit={handleOTPVerification} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Enter Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="Enter OTP"
                required
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-linear-to-r from-emerald-600 to-teal-600 text-white h-12"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                {" Didn't receive code? Resend"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">
                {getStepTitle()}
              </CardTitle>
              <CardDescription>{getStepDescription()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="businessName"
                      className="flex items-center gap-2 text-sm font-light text-gray-700"
                    >
                      Business Name
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-4 h-4 w-4 text-gray-400" />
                      <Input
                        id="businessName"
                        placeholder="Enter your business name"
                        value={formData.businessName}
                        onChange={(e) =>
                          updateFormData("businessName", e.target.value)
                        }
                        aria-describedby={
                          errors.businessName ? "name-error" : undefined
                        }
                        className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
                          errors.businessName
                            ? "border-red-600 ring-red-600"
                            : ""
                        }`}
                      />
                    </div>
                    {errors.businessName && (
                      <p
                        id="businessType-error"
                        className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="businessEmail"
                      className="flex items-center gap-2 text-sm font-light text-gray-700"
                    >
                      Business Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-4 h-4 w-4 text-gray-400" />

                      <Input
                        id="businessEmail"
                        type="email"
                        placeholder="business@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          updateFormData("email", e.target.value)
                        }
                        aria-describedby={
                          errors.email ? "name-error" : undefined
                        }
                        className={`pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out ${
                          errors.email ? "border-red-600 ring-red-600" : ""
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p
                        id="businessType-error"
                        className="mt-1 text-xs text-red-600 font-light flex items-center gap-1 animate-error-pop"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="businessAddress"
                      className="flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Business Address
                    </Label>
                    <Textarea
                      id="businessAddress"
                      placeholder="Enter your complete business address"
                      value={formData.address}
                      onChange={(e) =>
                        updateFormData("address", e.target.value)
                      }
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="businessPhone"
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Business Phone Number
                    </Label>
                    <Input
                      id="businessPhone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Business Type */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <RadioGroup
                    value={formData.businessType}
                    onValueChange={(value) =>
                      updateFormData("businessType", value)
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="restaurant" id="restaurant" />
                      <Label
                        htmlFor="restaurant"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium">Restaurant</div>
                        <div className="text-sm text-gray-600">
                          Food service establishment
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="hotel" id="hotel" />
                      <Label htmlFor="hotel" className="flex-1 cursor-pointer">
                        <div className="font-medium">Hotel</div>
                        <div className="text-sm text-gray-600">
                          Hospitality and accommodation
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="club" id="club" />
                      <Label htmlFor="club" className="flex-1 cursor-pointer">
                        <div className="font-medium">Club</div>
                        <div className="text-sm text-gray-600">
                          Entertainment and social venue
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Step 3: Account Type */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <RadioGroup
                    value={formData.adminType}
                    onValueChange={(value) =>
                      updateFormData("adminType", value)
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="vendor" id="vendor" />
                      <Label htmlFor="vendor" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2 font-medium">
                          <Store className="w-5 h-5" />
                          Vendor Account
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Perfect for single location businesses. Manage one
                          location with full control over menus, orders, and
                          operations.
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="super-admin" id="super-admin" />
                      <Label
                        htmlFor="super-admin"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 font-medium">
                          <Users className="w-5 h-5" />
                          Super Admin Account
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Ideal for business chains and franchises. Manage
                          multiple locations, upload menus across various
                          branches, and get consolidated analytics.
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Step 4: Security Setup */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateFormData("confirmPassword", e.target.value)
                      }
                    />
                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="text-sm text-red-600">
                          Passwords do not match
                        </p>
                      )}
                  </div>

                  {formData.adminType === "super-admin" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                        <Users className="w-4 h-4" />
                        Super Admin Benefits
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Add and manage multiple business locations</li>
                        <li>• Upload menus across all your branches</li>
                        <li>• View consolidated analytics and reports</li>
                        <li>• Manage staff accounts for each location</li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepValid()}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
                        </div>
                        <span className="ml-2">Creating your account...</span>
                      </div>
                    ) : (
                      "Complete Registration"
                    )}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

//----------------------idea 2----------------------------------------------
// "use client"
// import React, { useState } from "react";
// // import { Card, CardContent } from "@/components/ui/card";
// import { Card, CardContent } from "@/app/components/ui/card";
// // import { Button } from "@/components/ui/button";
// import { Button } from "@/app/components/ui/button";
// // import { Input } from "@/components/ui/input";
// import { Input } from "@/app/components/ui/input";
// // import { Label } from "@/components/ui/label";
// import { Label } from "@/app/components/ui/label";
// // import { cn } from "@/lib/utils";
// import { cn } from "@/app/lib/utils";
// import { ArrowRight, ArrowLeft } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const steps = ["business", "contact", "security"];

// const SignupForm = () => {
//   const [step, setStep] = useState("business");
//   const [formData, setFormData] = useState({
//     businessName: "",
//     businessType: "",
//     role: "",
//     fullName: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   const handleChange = (field: string, value: string) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const renderBusinessStep = () => (
//     <motion.div
//       key="business"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -30 }}
//       transition={{ duration: 0.4 }}
//     >
//       <div className="space-y-4">
//         <div>
//           <Label>Business Name</Label>
//           <Input
//             value={formData.businessName}
//             onChange={(e) => handleChange("businessName", e.target.value)}
//           />
//         </div>

//         <div>
//           <Label>Business Type</Label>
//           <div className="flex gap-2 mt-2">
//             {["restaurant", "hotel", "club"].map((type) => (
//               <button
//                 key={type}
//                 onClick={() => handleChange("businessType", type)}
//                 className={cn(
//                   "px-4 py-2 rounded-md border",
//                   formData.businessType === type
//                     ? "bg-black text-white border-black"
//                     : "bg-white text-black border-gray-300"
//                 )}
//               >
//                 {type.charAt(0).toUpperCase() + type.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div>
//           <Label>Account Type</Label>
//           <div className="mt-2 space-y-2">
//             <div className="border rounded-md p-3 cursor-pointer transition-all" onClick={() => handleChange("role", "super-admin")}
//               style={{ backgroundColor: formData.role === "super-admin" ? "#f3f3f3" : "white" }}>
//               <p className="font-semibold">Super Admin</p>
//               <p className="text-sm text-muted-foreground">
//                 Manage multiple vendors, view platform-wide analytics, and oversee operations.
//               </p>
//             </div>
//             <div className="border rounded-md p-3 cursor-pointer transition-all" onClick={() => handleChange("role", "vendor")}
//               style={{ backgroundColor: formData.role === "vendor" ? "#f3f3f3" : "white" }}>
//               <p className="font-semibold">Vendor</p>
//               <p className="text-sm text-muted-foreground">
//                 Manage your own restaurant, hotel, or club listings, view bookings, and control settings.
//               </p>
//             </div>
//           </div>
//         </div>

//         <Button className="mt-4 w-full" onClick={() => setStep("contact")}>Next <ArrowRight className="ml-2 w-4 h-4" /></Button>
//       </div>
//     </motion.div>
//   );

//   const renderContactStep = () => (
//     <motion.div
//       key="contact"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -30 }}
//       transition={{ duration: 0.4 }}
//     >
//       <div className="space-y-4">
//         <div>
//           <Label>Full Name</Label>
//           <Input
//             value={formData.fullName}
//             onChange={(e) => handleChange("fullName", e.target.value)}
//           />
//         </div>
//         <div>
//           <Label>Email Address</Label>
//           <Input
//             type="email"
//             value={formData.email}
//             onChange={(e) => handleChange("email", e.target.value)}
//           />
//         </div>
//         <div>
//           <Label>Phone Number</Label>
//           <Input
//             type="tel"
//             value={formData.phone}
//             onChange={(e) => handleChange("phone", e.target.value)}
//           />
//         </div>
//         <div className="flex justify-between mt-4">
//           <Button variant="ghost" onClick={() => setStep("business")}> <ArrowLeft className="mr-2 w-4 h-4" /> Back </Button>
//           <Button onClick={() => setStep("security")}>Next <ArrowRight className="ml-2 w-4 h-4" /></Button>
//         </div>
//       </div>
//     </motion.div>
//   );

//   const renderSecurityStep = () => (
//     <motion.div
//       key="security"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -30 }}
//       transition={{ duration: 0.4 }}
//     >
//       <div className="space-y-4">
//         <div>
//           <Label>Password</Label>
//           <Input
//             type="password"
//             value={formData.password}
//             onChange={(e) => handleChange("password", e.target.value)}
//           />
//         </div>
//         <div className="flex justify-between mt-4">
//           <Button variant="ghost" onClick={() => setStep("contact")}> <ArrowLeft className="mr-2 w-4 h-4" /> Back </Button>
//           <Button className="bg-black text-white">Sign Up</Button>
//         </div>
//       </div>
//     </motion.div>
//   );

//   return (
//     <div className="w-full max-w-md mx-auto p-4">
//       <Card className="p-6">
//         <CardContent>
//           <h2 className="text-2xl font-bold mb-4 text-center">Create your account</h2>
//           <AnimatePresence mode="wait">
//             {step === "business" && renderBusinessStep()}
//             {step === "contact" && renderContactStep()}
//             {step === "security" && renderSecurityStep()}
//           </AnimatePresence>
//           <div className="mt-6 text-sm text-center text-muted-foreground">
//             or
//             <p className="mt-2">
//               Already have an account? <a href="/login" className="underline">Login here</a>
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SignupForm;
