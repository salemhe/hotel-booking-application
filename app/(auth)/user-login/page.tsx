// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";
// import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { setAuthToken } from "@/lib/axios-config";
// import { toast } from "sonner";
// import { AxiosError } from "axios";
// import API from "@/utils/userAxios";
// import { AuthService } from "@/services/userAuth.services";


// interface DecodedToken {
//   id?: string;
//   exp?: number;
//   iat?: number;
// }

// const UserLoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const extractUserId = (decodedToken: DecodedToken): string => {
//     const userId = decodedToken.id;
//     if (!userId) throw new Error("Unable to extract user ID from token");
//     return userId;
//   };

//   // const storeAuthInfo = (token: string, decodedToken: DecodedToken) => {
//   //   localStorage.setItem("authToken", token);
//   //   const userId = extractUserId(decodedToken);
//   //   localStorage.setItem("userId", userId);
//   //   if (decodedToken.exp) {
//   //     localStorage.setItem("tokenExp", (decodedToken.exp * 1000).toString());
//   //   }
//   //   setAuthToken(token);
//   // };

//   const validateToken = (decodedToken: DecodedToken): boolean => {
//     if (!decodedToken.id || !decodedToken.exp) return false;
//     return decodedToken.exp * 1000 > Date.now() + 5000;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { data } = await API.post("/users/login", { email, password });
//       if (!data.token) throw new Error("No token received");

//       const decodedToken = jwtDecode(data.token);
//       if (!validateToken(decodedToken)) throw new Error("Invalid token");

//       const userId = extractUserId(decodedToken);
//       AuthService.setToken(data.token);
//       const response = await API.get(`/users/profile/${userId}`);
//       const user = response.data;
//       AuthService.setUser({
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         phone: user.phone,
//         profileImage: user.profileImage,
//         profile: user.profile,
//       });

//       toast.success("Welcome back!");
//       router.push("/userDashboard/search");
//     } catch (error: unknown) {
//       if (error instanceof AxiosError) {
//         toast.error(error.response?.data?.message || "Login failed");
//       } else if (error instanceof Error) {
//         toast.error(error.message || "Login failed");
//       } else {
//         toast.error("An unknown error occurred");
//       }

//       localStorage.removeItem("auth_token");
//       localStorage.removeItem("auth_user");
//       localStorage.removeItem("session_id");
//       localStorage.removeItem("userId");
//       localStorage.removeItem("tokenExp");
//       setAuthToken(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//      <div className="min-h-[100dvh] bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
//       <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-md">
//         <Card className="border rounded-lg shadow-md bg-white">
//           <CardHeader className="space-y-3 pb-6 md:pb-8 px-6 sm:px-8">
//             <CardTitle className="text-2xl sm:text-3xl font-light text-center text-[#222]">
//               Welcome back 
//             </CardTitle>
//             <CardDescription className="text-center text-[#6d727b] text-sm sm:text-base">
//               Enter your credentials to access your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="px-6 sm:px-8">
//             <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
//               <div className="space-y-1">
//                 <Label
//                   htmlFor="email"
//                   className="text-sm font-light text-[#6d727b]"
//                 >
//                   Email
//                 </Label>
//                 <div className="relative">
//                   <Mail
//                     className="absolute left-3 top-3.5 h-4 w-4 stroke-[1.25] text-[#8a8f9a]"
//                     strokeWidth={1.25}
//                   />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email address"
//                     className="pl-10 h-10 sm:h-12 rounded-md border border-gray-300 bg-white text-[#6d727b] placeholder-[#a0a3a8]
//                     focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <Label
//                   htmlFor="password"
//                   className="text-sm font-light text-[#6d727b]"
//                 >
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Lock
//                     className="absolute left-3 top-3.5 h-4 w-4 stroke-[1.25] text-[#8a8f9a]"
//                     strokeWidth={1.25}
//                   />
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="Enter your secure password"
//                     className="pl-10 h-10 sm:h-12 rounded-md border border-gray-300 bg-white text-[#6d727b] placeholder-[#a0a3a8]
//                     focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <Link
//                   href="/forgot-password"
//                   className="text-xs sm:text-sm text-[#6d727b] hover:text-[#0a646d] transition-colors inline-flex items-center gap-1 mt-1"
//                 >
//                   Forgot your password?
//                 </Link>
//               </div>
//               <Button
//                 type="submit"
//                 className="w-full h-10 sm:h-12 rounded-md bg-[#0a646d] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg hover:bg-[#127a87] transition-colors duration-300"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white" />
//                     Signing in...
//                   </>
//                 ) : (
//                   "Sign in"
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-5 sm:space-y-6 pb-6 sm:pb-8 px-6 sm:px-8">
//             <div className="flex items-center gap-3 w-full">
//               <div className="flex-1 border-t border-gray-300" />
//               <span className="text-xs sm:text-sm text-[#6d727b] font-light">
//                 OR
//               </span>
//               <div className="flex-1 border-t border-gray-300" />
//             </div>
//             <Link
//               href="/user-signup"
//               className="inline-flex items-center justify-center gap-2 text-[#0a646d] hover:text-[#094c52] transition-colors text-sm sm:text-base font-light group"
//             >
//               Create a new account
//               <ArrowRight className="h-4 w-4 stroke-[1.25] group-hover:translate-x-1 transition-transform stroke-[#0a646d]" />
//             </Link>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default UserLoginPage;


"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";
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
import API from "@/utils/userAxios";
import { AuthService } from "@/services/userAuth.services";

interface DecodedToken {
  id?: string;
  exp?: number;
  iat?: number;
}

const UserLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const extractUserId = (decodedToken: DecodedToken): string => {
    const userId = decodedToken.id;
    if (!userId) throw new Error("Unable to extract user ID from token");
    return userId;
  };

  const validateToken = (decodedToken: DecodedToken): boolean => {
    return !!decodedToken.id && !!decodedToken.exp && decodedToken.exp * 1000 > Date.now() + 5000;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError("");
    setPasswordError("");

    let hasError = false;
    if (!email.trim()) {
      setEmailError("Enter a valid email");
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError("Enter your password");
      hasError = true;
    }

    if (hasError) return;

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
        profileImage: user.profileImage,
        profile: user.profile,
      });

      toast.success("Welcome back!");
      router.push("/userDashboard/search");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Login failed");
      } else if (error instanceof Error) {
        toast.error(error.message || "Login failed");
      } else {
        toast.error("An unknown error occurred");
      }

      localStorage.clear();
      setAuthToken(null);
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
                <Label htmlFor="email" className="text-sm font-light text-[#6d727b]">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10 h-10 sm:h-12 rounded-md bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <div className="flex items-center gap-1 text-red-500 text-xs font-light mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{emailError}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-sm font-light text-[#6d727b]">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-[#8a8f9a]" strokeWidth={1.25} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your secure password"
                    className="pl-10 h-10 sm:h-12 rounded-md  border-gray-100 bg-gray-100 text-[#6d727b] text-sm placeholder-[#a0a3a8] focus:outline-none focus:border-[#60a5fa] focus:ring-1 focus:ring-[#60a5fa] transition-all duration-300 ease-in-out"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <div className="flex items-center gap-1 text-red-500 text-xs font-light mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{passwordError}</span>
                    </div>
                  )}
                </div>
                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-sm text-[#6d727b] hover:text-[#0a646d] transition-colors inline-flex items-center gap-1 mt-1"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-12 rounded-md bg-[#0a646d] text-white text-sm sm:text-base font-light shadow-md hover:shadow-lg hover:bg-[#127a87] transition-colors duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin text-white" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 sm:space-y-6 pb-6 sm:pb-8 px-6 sm:px-8">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 border-t border-gray-300" />
              <span className="text-xs sm:text-sm text-[#6d727b] font-light">OR</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>
            <Link
              href="/user-signup"
              className="inline-flex items-center justify-center gap-2 text-[#0a646d] hover:text-[#094c52] transition-colors text-sm sm:text-base font-light group"
            >
              Create a new account
              <ArrowRight className="h-4 w-4 stroke-[1.25] group-hover:translate-x-1 transition-transform stroke-[#0a646d]" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserLoginPage;
