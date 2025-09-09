"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/sammys-ui/button";
import { Input } from "@/app/components/sammys-ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/sammys-ui/card";
import { Switch } from "@/app/components/sammys-ui/switch";
import { CheckCircle, XCircle, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/super-administrator/ThemeContext";
import Link from "next/link";
import { usePathname } from "next/navigation"

export default function RestaurantSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: ""
  });
  const { theme, setTheme } = useTheme();
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [themeMsg, setThemeMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { AuthService } = await import("@/app/lib/api/services/auth.service");
        const user = AuthService.getUser();
        if (user && user.id) {
          const realProfile = await AuthService.fetchMyProfile(user.id, user.role);
          if (realProfile) {
            setProfile({
              name: realProfile.businessName || realProfile.name || "",
              email: realProfile.email || "",
              phone: realProfile.phone || "",
              profileImage: realProfile.profileImage || ""
            });
          }
        }
      } catch {
        setProfile({ name: "", email: "", phone: "", profileImage: "" });
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSavingProfile(true);
    setProfileMsg("");
    setProfileError("");
    setTimeout(() => {
      if (field === "email" && !value.includes("@")) {
        setSavingProfile(false);
        setProfileError("Invalid email address.");
        return;
      }
      setSavingProfile(false);
      setProfileMsg("Profile updated!");
    }, 900);
  };

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setThemeMsg("");
    setTimeout(() => {
      setThemeMsg(`Theme set to ${theme === "light" ? "Dark" : "Light"} Mode!`);
    }, 400);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    if (password.new.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (password.new !== password.confirm) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPassword({ current: "", new: "", confirm: "" });
      setPasswordMsg("Password changed successfully!");
    }, 1200);
  };

  const [businessName, setBusinessName] = useState("Joe's Platter");

  //   const validate = () => {
  //   let newErrors = { email: "", phone: "" };

  //   // email validation
  //   if (!email) {
  //     newErrors.email = "Support email is required.";
  //   } else if (!/\S+@\S+\.\S+/.test(email)) {
  //     newErrors.email = "Enter a valid email address.";
  //   }

  //   // phone validation
  //   if (!phone) {
  //     newErrors.phone = "Support phone number is required.";
  //   } else if (!/^\+?[0-9\s-]{7,15}$/.test(phone)) {
  //     newErrors.phone = "Enter a valid phone number.";
  //   }

  //   setErrors(newErrors);
  //   return !newErrors.email && !newErrors.phone;
  // };

  // const handleSubmit = () => {
  //   if (validate()) {
  //     alert("Form is valid ✅");
  //   }
  // };

  return (
    <div className="max-w-[1440px]">
      <div className="flex top-0 w-full h-[64px] px-[32px] py-[12px] flex-col items-start gap-2 shrink-0 bg-white">
        {/* inner row to place search + profile on the same line */}
        <div className="w-full flex items-center justify-between">
          {/* search */}
          <div className="flex justify-center items-center w-[520px] px-3 py-2 gap-2 rounded-lg border border-[#DAE9E9] bg-[#F9FAFB]">
            {/* random search svg */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_1224_81)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75003 1.66667C7.62052 1.66676 6.50741 1.93697 5.50358 2.45474C4.49974 2.97252 3.63427 3.72285 2.97939 4.64313C2.32451 5.56341 1.8992 6.62696 1.73895 7.74504C1.5787 8.86312 1.68815 10.0033 2.05818 11.0705C2.4282 12.1377 3.04807 13.1009 3.86606 13.8798C4.68405 14.6587 5.67645 15.2306 6.76046 15.548C7.84446 15.8654 8.98865 15.9189 10.0975 15.7041C11.2064 15.4893 12.2479 15.0125 13.135 14.3133L16.1784 17.3567C16.3355 17.5085 16.546 17.5925 16.7645 17.5906C16.983 17.5887 17.192 17.501 17.3465 17.3465C17.501 17.192 17.5887 16.983 17.5906 16.7645C17.5925 16.546 17.5085 16.3355 17.3567 16.1783L14.3134 13.135C15.1367 12.0905 15.6493 10.8353 15.7926 9.5131C15.9359 8.19088 15.704 6.85502 15.1235 5.65841C14.5431 4.4618 13.6374 3.4528 12.5103 2.74686C11.3831 2.04092 10.08 1.66658 8.75003 1.66667ZM3.33336 8.75C3.33336 7.31341 3.90404 5.93566 4.91987 4.91984C5.93569 3.90402 7.31344 3.33333 8.75003 3.33333C10.1866 3.33333 11.5644 3.90402 12.5802 4.91984C13.596 5.93566 14.1667 7.31341 14.1667 8.75C14.1667 10.1866 13.596 11.5643 12.5802 12.5802C11.5644 13.596 10.1866 14.1667 8.75003 14.1667C7.31344 14.1667 5.93569 13.596 4.91987 12.5802C3.90404 11.5643 3.33336 10.1866 3.33336 8.75Z" fill="#606368"/>
                </g>
                <defs>
                  <clipPath id="clip0_1224_81">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
            </svg>
            <input 
              placeholder="Search"
              className="w-full h-full outline-none text-sm placeholder:text-gray-400"
            />
          </div>

          {/* profile area */}
          <div className="flex items-center gap-4">
            {/* bell */}
            <button className="w-10 h-10 grid place-items-center rounded-full bg-white border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 2.66667C13.5246 2.66667 11.1507 3.65 9.40034 5.40034C7.65 7.15068 6.66667 9.52465 6.66667 12V16.704C6.66686 16.9108 6.61893 17.1149 6.52667 17.3L4.23733 21.8773C4.1255 22.101 4.0727 22.3495 4.08393 22.5992C4.09517 22.849 4.17007 23.0918 4.30153 23.3045C4.43298 23.5171 4.61663 23.6927 4.83502 23.8144C5.05342 23.9362 5.2993 24 5.54933 24H26.4507C26.7007 24 26.9466 23.9362 27.165 23.8144C27.3834 23.6927 27.567 23.5171 27.6985 23.3045C27.8299 23.0918 27.9048 22.849 27.9161 22.5992C27.9273 22.3495 27.8745 22.101 27.7627 21.8773L25.4747 17.3C25.3819 17.115 25.3336 16.9109 25.3333 16.704V12C25.3333 9.52465 24.35 7.15068 22.5997 5.40034C20.8493 3.65 18.4754 2.66667 16 2.66667ZM16 28C15.1725 28.0002 14.3653 27.7439 13.6895 27.2663C13.0138 26.7888 12.5027 26.1134 12.2267 25.3333H19.7733C19.4973 26.1134 18.9862 26.7888 18.3105 27.2663C17.6347 27.7439 16.8275 28.0002 16 28Z" fill="#111827"/>
              </svg>
            </button> 


            {/* avatar + name */}
             <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-300" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  Joseph Eyebiokin
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div>  
      </div>



      {/* B. INFO SECTIONS & LINKS */}
      <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">

              <Link
              href="/vendor-dashboard/restaurant/dashboard"
              className="inline-flex items-center gap-1 rounded-md bg-[#E7F0F0] border border-[#B3D1D2] px-2.5 py-1 text-xs text-[#111827]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_2107_1934)">
                    <path d="M11.0233 2.23983C10.7308 2.01224 10.3707 1.88867 10 1.88867C9.62933 1.88867 9.26924 2.01224 8.97667 2.23983L1.99 7.67316C1.36333 8.16233 1.70833 9.16649 2.5025 9.16649H3.33333V15.8332C3.33333 16.2752 3.50893 16.6991 3.82149 17.0117C4.13405 17.3242 4.55797 17.4998 5 17.4998H8.33333V12.4998C8.33333 12.0578 8.50893 11.6339 8.82149 11.3213C9.13405 11.0088 9.55797 10.8332 10 10.8332C10.442 10.8332 10.866 11.0088 11.1785 11.3213C11.4911 11.6339 11.6667 12.0578 11.6667 12.4998V17.4998H15C15.442 17.4998 15.8659 17.3242 16.1785 17.0117C16.4911 16.6991 16.6667 16.2752 16.6667 15.8332V9.16649H17.4975C18.2908 9.16649 18.6375 8.16233 18.01 7.67399L11.0233 2.23983Z" fill="#111827"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_1934">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                General Info
              </Link>


              <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-[#606368]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_2107_1941)">
                    <path d="M2.49999 15.833H3.33332V5.29968C3.33335 5.03729 3.41594 4.78157 3.56939 4.56874C3.72285 4.3559 3.93938 4.19676 4.18832 4.11384L10.855 1.89218C11.0429 1.8296 11.2429 1.81256 11.4387 1.84245C11.6345 1.87235 11.8203 1.94832 11.981 2.06413C12.1416 2.17993 12.2724 2.33224 12.3627 2.50851C12.4529 2.68479 12.5 2.87998 12.5 3.07801V15.833H13.3333V8.32468C13.3334 8.26305 13.3471 8.20221 13.3734 8.14652C13.3998 8.09084 13.4382 8.04169 13.4859 8.00264C13.5336 7.96358 13.5893 7.93558 13.6491 7.92066C13.7089 7.90574 13.7712 7.90427 13.8317 7.91634L15.6617 8.28301C15.9449 8.33963 16.1998 8.4926 16.383 8.71593C16.5663 8.93925 16.6665 9.21914 16.6667 9.50801V15.833H17.5C17.721 15.833 17.933 15.9208 18.0892 16.0771C18.2455 16.2334 18.3333 16.4453 18.3333 16.6663C18.3333 16.8874 18.2455 17.0993 18.0892 17.2556C17.933 17.4119 17.721 17.4997 17.5 17.4997H2.49999C2.27898 17.4997 2.06701 17.4119 1.91073 17.2556C1.75445 17.0993 1.66666 16.8874 1.66666 16.6663C1.66666 16.4453 1.75445 16.2334 1.91073 16.0771C2.06701 15.9208 2.27898 15.833 2.49999 15.833Z" fill="#606368"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_1941">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Branch Settings 
              </button>


              <Link
              href="/vendor-dashboard/restaurant/reservations"
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-[#606368]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_2107_1949)">
                    <path d="M17.5 10V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V10H17.5ZM13.3333 2.5C13.5543 2.5 13.7663 2.5878 13.9226 2.74408C14.0789 2.90036 14.1667 3.11232 14.1667 3.33333V4.16667H15.8333C16.2754 4.16667 16.6993 4.34226 17.0118 4.65482C17.3244 4.96738 17.5 5.39131 17.5 5.83333V8.33333H2.5V5.83333C2.5 5.39131 2.67559 4.96738 2.98816 4.65482C3.30072 4.34226 3.72464 4.16667 4.16667 4.16667H5.83333V3.33333C5.83333 3.11232 5.92113 2.90036 6.07741 2.74408C6.23369 2.5878 6.44565 2.5 6.66667 2.5C6.88768 2.5 7.09964 2.5878 7.25592 2.74408C7.4122 2.90036 7.5 3.11232 7.5 3.33333V4.16667H12.5V3.33333C12.5 3.11232 12.5878 2.90036 12.7441 2.74408C12.9004 2.5878 13.1123 2.5 13.3333 2.5Z" fill="#606368"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_1949">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Reservation Rules
              </Link>


              <Link
              href="/vendor-dashboard/restaurant/staff"
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-[#606368]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_2107_1969)">
                    <path d="M9.99998 10C11.5608 10 12.975 10.5167 14.0125 11.2392C14.9983 11.9267 15.8333 12.9483 15.8333 14.0475C15.8333 14.6508 15.5758 15.1508 15.17 15.5225C14.7883 15.8733 14.29 16.1008 13.7766 16.2558C12.7508 16.5667 11.4 16.6667 9.99998 16.6667C8.59998 16.6667 7.24915 16.5667 6.22331 16.2558C5.70998 16.1008 5.21165 15.8733 4.82915 15.5225C4.42498 15.1517 4.16665 14.6517 4.16665 14.0483C4.16665 12.9492 5.00165 11.9275 5.98748 11.24C7.02498 10.5167 8.43915 10 9.99998 10ZM15.8333 10.8333C16.7033 10.8333 17.4933 11.1208 18.0775 11.5275C18.6108 11.9 19.1666 12.5192 19.1666 13.2742C19.1666 13.705 18.9791 14.0625 18.7 14.3183C18.445 14.5525 18.13 14.69 17.8425 14.7767C17.4508 14.895 16.9883 14.9558 16.5083 14.9825C16.61 14.695 16.6666 14.3825 16.6666 14.0475C16.6666 12.7683 15.8675 11.6817 14.9733 10.9275C15.2557 10.865 15.5441 10.8334 15.8333 10.8333ZM4.16665 10.8333C4.46415 10.8333 4.75248 10.8667 5.02665 10.9275C4.13331 11.6817 3.33331 12.7683 3.33331 14.0475C3.33331 14.3825 3.38998 14.695 3.49165 14.9825C3.01165 14.9558 2.54998 14.895 2.15748 14.7767C1.86998 14.69 1.55498 14.5525 1.29915 14.3183C1.15238 14.1871 1.03501 14.0263 0.95473 13.8465C0.874451 13.6666 0.833075 13.4719 0.833314 13.275C0.833314 12.5208 1.38831 11.9008 1.92248 11.5283C2.5831 11.0752 3.36554 10.8329 4.16665 10.8333ZM15.4166 5.83333C15.9692 5.83333 16.4991 6.05283 16.8898 6.44353C17.2805 6.83423 17.5 7.36413 17.5 7.91667C17.5 8.4692 17.2805 8.99911 16.8898 9.38981C16.4991 9.78051 15.9692 10 15.4166 10C14.8641 10 14.3342 9.78051 13.9435 9.38981C13.5528 8.99911 13.3333 8.4692 13.3333 7.91667C13.3333 7.36413 13.5528 6.83423 13.9435 6.44353C14.3342 6.05283 14.8641 5.83333 15.4166 5.83333ZM4.58331 5.83333C5.13585 5.83333 5.66575 6.05283 6.05645 6.44353C6.44715 6.83423 6.66665 7.36413 6.66665 7.91667C6.66665 8.4692 6.44715 8.99911 6.05645 9.38981C5.66575 9.78051 5.13585 10 4.58331 10C4.03078 10 3.50088 9.78051 3.11017 9.38981C2.71947 8.99911 2.49998 8.4692 2.49998 7.91667C2.49998 7.36413 2.71947 6.83423 3.11017 6.44353C3.50088 6.05283 4.03078 5.83333 4.58331 5.83333ZM9.99998 2.5C10.884 2.5 11.7319 2.85119 12.357 3.47631C12.9821 4.10143 13.3333 4.94928 13.3333 5.83333C13.3333 6.71739 12.9821 7.56524 12.357 8.19036C11.7319 8.81548 10.884 9.16667 9.99998 9.16667C9.11593 9.16667 8.26808 8.81548 7.64296 8.19036C7.01784 7.56524 6.66665 6.71739 6.66665 5.83333C6.66665 4.94928 7.01784 4.10143 7.64296 3.47631C8.26808 2.85119 9.11593 2.5 9.99998 2.5Z" fill="#606368"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_1969">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Staff Access
              </Link>


              <Link 
                href="/vendor-dashboard/restaurant/payments"
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-[#606368]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 1.66699C14.6025 1.66699 18.3334 5.39783 18.3334 10.0003C18.3334 14.6028 14.6025 18.3337 10 18.3337C5.39752 18.3337 1.66669 14.6028 1.66669 10.0003C1.66669 5.39783 5.39752 1.66699 10 1.66699ZM8.33335 5.00033H7.91669C7.69567 5.00033 7.48371 5.08812 7.32743 5.2444C7.17115 5.40068 7.08335 5.61264 7.08335 5.83366V8.33366H6.66669C6.44567 8.33366 6.23371 8.42146 6.07743 8.57774C5.92115 8.73402 5.83335 8.94598 5.83335 9.16699C5.83335 9.38801 5.92115 9.59997 6.07743 9.75625C6.23371 9.91253 6.44567 10.0003 6.66669 10.0003H7.08335V10.8337H6.66669C6.44567 10.8337 6.23371 10.9215 6.07743 11.0777C5.92115 11.234 5.83335 11.446 5.83335 11.667C5.83335 11.888 5.92115 12.1 6.07743 12.2562C6.23371 12.4125 6.44567 12.5003 6.66669 12.5003H7.08335V14.167C7.08335 14.388 7.17115 14.6 7.32743 14.7562C7.48371 14.9125 7.69567 15.0003 7.91669 15.0003C8.1377 15.0003 8.34966 14.9125 8.50594 14.7562C8.66222 14.6 8.75002 14.388 8.75002 14.167V12.5003H10.1025L10.8934 14.4762C10.9551 14.6308 11.0618 14.7634 11.1997 14.8568C11.3375 14.9502 11.5002 15.0002 11.6667 15.0003H12.0834C12.3044 15.0003 12.5163 14.9125 12.6726 14.7562C12.8289 14.6 12.9167 14.388 12.9167 14.167V12.5003H13.3334C13.5544 12.5003 13.7663 12.4125 13.9226 12.2562C14.0789 12.1 14.1667 11.888 14.1667 11.667C14.1667 11.446 14.0789 11.234 13.9226 11.0777C13.7663 10.9215 13.5544 10.8337 13.3334 10.8337H12.9167V10.0003H13.3334C13.5544 10.0003 13.7663 9.91253 13.9226 9.75625C14.0789 9.59997 14.1667 9.38801 14.1667 9.16699C14.1667 8.94598 14.0789 8.73402 13.9226 8.57774C13.7663 8.42146 13.5544 8.33366 13.3334 8.33366H12.9167V5.83366C12.9167 5.61264 12.8289 5.40068 12.6726 5.2444C12.5163 5.08812 12.3044 5.00033 12.0834 5.00033C11.8623 5.00033 11.6504 5.08812 11.4941 5.2444C11.3378 5.40068 11.25 5.61264 11.25 5.83366V8.33366H10.2309L9.10752 5.52449C9.04569 5.36973 8.93887 5.23705 8.80087 5.14362C8.66286 5.05018 8.50001 5.00026 8.33335 5.00033ZM11.25 10.0003V10.8337H11.2309L10.8975 10.0003H11.25ZM9.10252 10.0003L9.43585 10.8337H8.75002V10.0003H9.10252Z" fill="#606368"/>
                </svg>
                Payment & Payouts 
              </Link>



              <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-[#606368]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clip-path="url(#clip0_2107_1969)">
                    <path d="M9.99998 10C11.5608 10 12.975 10.5167 14.0125 11.2392C14.9983 11.9267 15.8333 12.9483 15.8333 14.0475C15.8333 14.6508 15.5758 15.1508 15.17 15.5225C14.7883 15.8733 14.29 16.1008 13.7766 16.2558C12.7508 16.5667 11.4 16.6667 9.99998 16.6667C8.59998 16.6667 7.24915 16.5667 6.22331 16.2558C5.70998 16.1008 5.21165 15.8733 4.82915 15.5225C4.42498 15.1517 4.16665 14.6517 4.16665 14.0483C4.16665 12.9492 5.00165 11.9275 5.98748 11.24C7.02498 10.5167 8.43915 10 9.99998 10ZM15.8333 10.8333C16.7033 10.8333 17.4933 11.1208 18.0775 11.5275C18.6108 11.9 19.1666 12.5192 19.1666 13.2742C19.1666 13.705 18.9791 14.0625 18.7 14.3183C18.445 14.5525 18.13 14.69 17.8425 14.7767C17.4508 14.895 16.9883 14.9558 16.5083 14.9825C16.61 14.695 16.6666 14.3825 16.6666 14.0475C16.6666 12.7683 15.8675 11.6817 14.9733 10.9275C15.2557 10.865 15.5441 10.8334 15.8333 10.8333ZM4.16665 10.8333C4.46415 10.8333 4.75248 10.8667 5.02665 10.9275C4.13331 11.6817 3.33331 12.7683 3.33331 14.0475C3.33331 14.3825 3.38998 14.695 3.49165 14.9825C3.01165 14.9558 2.54998 14.895 2.15748 14.7767C1.86998 14.69 1.55498 14.5525 1.29915 14.3183C1.15238 14.1871 1.03501 14.0263 0.95473 13.8465C0.874451 13.6666 0.833075 13.4719 0.833314 13.275C0.833314 12.5208 1.38831 11.9008 1.92248 11.5283C2.5831 11.0752 3.36554 10.8329 4.16665 10.8333ZM15.4166 5.83333C15.9692 5.83333 16.4991 6.05283 16.8898 6.44353C17.2805 6.83423 17.5 7.36413 17.5 7.91667C17.5 8.4692 17.2805 8.99911 16.8898 9.38981C16.4991 9.78051 15.9692 10 15.4166 10C14.8641 10 14.3342 9.78051 13.9435 9.38981C13.5528 8.99911 13.3333 8.4692 13.3333 7.91667C13.3333 7.36413 13.5528 6.83423 13.9435 6.44353C14.3342 6.05283 14.8641 5.83333 15.4166 5.83333ZM4.58331 5.83333C5.13585 5.83333 5.66575 6.05283 6.05645 6.44353C6.44715 6.83423 6.66665 7.36413 6.66665 7.91667C6.66665 8.4692 6.44715 8.99911 6.05645 9.38981C5.66575 9.78051 5.13585 10 4.58331 10C4.03078 10 3.50088 9.78051 3.11017 9.38981C2.71947 8.99911 2.49998 8.4692 2.49998 7.91667C2.49998 7.36413 2.71947 6.83423 3.11017 6.44353C3.50088 6.05283 4.03078 5.83333 4.58331 5.83333ZM9.99998 2.5C10.884 2.5 11.7319 2.85119 12.357 3.47631C12.9821 4.10143 13.3333 4.94928 13.3333 5.83333C13.3333 6.71739 12.9821 7.56524 12.357 8.19036C11.7319 8.81548 10.884 9.16667 9.99998 9.16667C9.11593 9.16667 8.26808 8.81548 7.64296 8.19036C7.01784 7.56524 6.66665 6.71739 6.66665 5.83333C6.66665 4.94928 7.01784 4.10143 7.64296 3.47631C8.26808 2.85119 9.11593 2.5 9.99998 2.5Z" fill="#606368"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_2107_1969">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                Security
              </button>
            </div>
          </div>
      </div>
      


      {/* C. THIRD SECTION OF THE APP */} 
      <div className="w-full self-stretch flex flex-wrap items-center justify-between gap-5 px-4">
          {/* First box */}
          <div className="flex-1 w-[180px]  rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
          <div className="flex w-full px-5 py-5 flex-col items-start gap-4">
            {/* Header */}
            <div className="w-full flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#111827]">
                Business Information
              </h2>
              <button className="inline-flex items-center gap-1 text-sm text-[#0A6C6D] hover:underline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.9366 2.52509C13.6241 2.21264 13.2002 2.03711 12.7583 2.03711C12.3164 2.03711 11.8925 2.21264 11.58 2.52509L2.98498 11.1201C2.67239 11.4326 2.49674 11.8564 2.49664 12.2984V16.6593C2.49664 17.1234 2.87414 17.5009 3.33831 17.5009L16.6666 17.5001C16.8877 17.5001 17.0996 17.4123 17.2559 17.256C17.4122 17.0997 17.5 16.8878 17.5 16.6668C17.5 16.4457 17.4122 16.2338 17.2559 16.0775C17.0996 15.9212 16.8877 15.8334 16.6666 15.8334H10.0566L17.4725 8.41759C17.7849 8.10504 17.9605 7.68119 17.9605 7.23925C17.9605 6.79731 17.7849 6.37347 17.4725 6.06092L13.9366 2.52509ZM7.69998 15.8334L16.2941 7.23925L12.7583 3.70342L4.16331 12.2984V15.8334H7.69998Z"
                    fill="#606368"
                  />
                </svg>
              </button>
            </div>

            {/* Business Name */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-xs text-[#374151]">Business name</label>
              <div className="relative">
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  maxLength={50}
                  className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#0A6C6D]"
                />
                <span className="absolute right-3 top-2 text-xs text-[#9CA3AF]">
                  {businessName.length}/50
                </span>
              </div>
            </div>

            {/* Business Type */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-xs text-[#374151]">Business Type</label>
              <select
                defaultValue="Restaurant"
                className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#0A6C6D]"
              >
                <option>Restaurant</option>
                <option>Hotel</option>
                <option>Club</option>
              </select>
            </div>
          </div>
        </div>



        {/* Second Box*/}
          <div className="flex-1 w-[180px]  rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
          <div className="flex w-full px-5 py-5 flex-col items-start gap-4">
            {/* Header */}
            <div className="w-full flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#111827]">
                Contact Information
              </h2>
              <button className="inline-flex items-center gap-1 text-sm text-[#0A6C6D] hover:underline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.9366 2.52509C13.6241 2.21264 13.2002 2.03711 12.7583 2.03711C12.3164 2.03711 11.8925 2.21264 11.58 2.52509L2.98498 11.1201C2.67239 11.4326 2.49674 11.8564 2.49664 12.2984V16.6593C2.49664 17.1234 2.87414 17.5009 3.33831 17.5009L16.6666 17.5001C16.8877 17.5001 17.0996 17.4123 17.2559 17.256C17.4122 17.0997 17.5 16.8878 17.5 16.6668C17.5 16.4457 17.4122 16.2338 17.2559 16.0775C17.0996 15.9212 16.8877 15.8334 16.6666 15.8334H10.0566L17.4725 8.41759C17.7849 8.10504 17.9605 7.68119 17.9605 7.23925C17.9605 6.79731 17.7849 6.37347 17.4725 6.06092L13.9366 2.52509ZM7.69998 15.8334L16.2941 7.23925L12.7583 3.70342L4.16331 12.2984V15.8334H7.69998Z"
                    fill="#606368"
                  />
                </svg>
              </button>
            </div>

            {/* Business Name */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-xs text-[#374151]">Support Contact Email <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="@example.com"
                  className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#0A6C6D]"
                />
                <span className="absolute right-3 top-2 text-xs text-[#9CA3AF]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clip-path="url(#clip0_2111_2699)">
                      <path d="M1.72329 4.56801L9.11913 11.9647C9.33792 12.1836 9.63016 12.3136 9.93928 12.3295C10.2484 12.3453 10.5524 12.2459 10.7925 12.0505L10.8875 11.9647L18.2783 4.57301C18.3025 4.66467 18.3183 4.75801 18.3266 4.85384L18.3333 4.99967V14.9997C18.3334 15.4202 18.1746 15.8251 17.8887 16.1335C17.6028 16.4418 17.2109 16.6306 16.7916 16.6622L16.6666 16.6663H3.33329C2.91281 16.6665 2.50782 16.5077 2.1995 16.2218C1.89118 15.9359 1.70233 15.544 1.67079 15.1247L1.66663 14.9997V4.99967C1.66663 4.89967 1.67496 4.80301 1.69163 4.70801L1.72329 4.56801ZM16.6666 3.33301C16.7675 3.33301 16.8666 3.34134 16.9625 3.35884L17.1041 3.39134L10.0041 10.4913L2.90163 3.38967C2.99329 3.36467 3.08829 3.34801 3.18496 3.33967L3.33329 3.33301H16.6666Z" fill="#606368"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2111_2699">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>

            {/* Business Type */}
            <div className="w-full flex flex-col gap-1">
              <label className="text-xs text-[#374151]">Support Phone Number <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+234 000 111 234"
                  className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#0A6C6D]"
                />
                <span className="absolute right-3 top-2 text-xs text-[#9CA3AF]">
                  {/* {businessName.length}/50 */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clip-path="url(#clip0_2111_2713)">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7934 18.4442C12.5934 18.4001 9.19254 17.9301 5.63087 14.3692C2.07004 10.8076 1.60087 7.40756 1.55587 6.20672C1.48921 4.37672 2.89087 2.59922 4.51004 1.90506C4.70502 1.82086 4.91854 1.78881 5.12965 1.81204C5.34076 1.83527 5.5422 1.91298 5.71421 2.03756C7.04754 3.00922 7.96754 4.47922 8.75754 5.63506C8.93136 5.889 9.00568 6.19801 8.96634 6.50322C8.927 6.80843 8.77674 7.0885 8.54421 7.29006L6.91837 8.49756C6.83983 8.55428 6.78453 8.63758 6.76277 8.73199C6.74101 8.8264 6.75425 8.92551 6.80004 9.01089C7.16837 9.68006 7.82337 10.6767 8.57337 11.4267C9.32421 12.1767 10.3675 12.8751 11.0834 13.2851C11.1731 13.3354 11.2788 13.3495 11.3786 13.3244C11.4784 13.2993 11.5648 13.2369 11.62 13.1501L12.6784 11.5392C12.8729 11.2808 13.16 11.1076 13.4794 11.056C13.7987 11.0045 14.1257 11.0785 14.3917 11.2626C15.5642 12.0742 16.9325 12.9784 17.9342 14.2609C18.0689 14.4341 18.1546 14.6404 18.1823 14.8581C18.21 15.0758 18.1787 15.2969 18.0917 15.4984C17.3942 17.1259 15.6292 18.5117 13.7934 18.4442Z" fill="#606368"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_2111_2713">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
              </div>
          </div>
        </div>
      </div>


      
      {/* <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-3xl font-bold mb-2">
          {profile.name.trim().length > 0 ? profile.name.split(" ").map(n => n[0]).join("") : "?"}
        </div>
        <div className="text-lg font-semibold">{profile.name || <span className='text-gray-400'>No Name</span>}</div>
        <div className="text-sm text-gray-600">{profile.email || <span className='text-gray-400'>No Email</span>}</div>
        <div className="text-sm text-gray-600">{profile.phone || <span className='text-gray-400'>No Phone</span>}</div>
      </div>
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="w-full"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="w-full"
              type="email"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              value={profile.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
              className="w-full"
              type="tel"
              autoComplete="tel"
            />
          </div>
          <div className="flex items-center gap-2 mt-2 min-h-[24px]">
            {savingProfile && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {profileMsg && <span className="flex items-center text-green-600 text-sm"><CheckCircle className="w-4 h-4 mr-1" />{profileMsg}</span>}
            {profileError && <span className="flex items-center text-red-600 text-sm"><XCircle className="w-4 h-4 mr-1" />{profileError}</span>}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Sun className="w-5 h-5 text-yellow-400" /> Light
          </span>
          <Switch checked={theme === "dark"} onChange={handleThemeToggle} />
          <span className="flex items-center gap-2 text-sm font-medium">
            <Moon className="w-5 h-5 text-gray-700" /> Dark
          </span>
          {themeMsg && <span className="flex items-center text-green-600 text-sm ml-2"><CheckCircle className="w-4 h-4 mr-1" />{themeMsg}</span>}
        </CardContent>
      </Card>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <Input
                  value={password.current}
                  onChange={e => setPassword({ ...password, current: e.target.value })}
                  type="password"
                  className="w-full"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">New Password</label>
                <Input
                  value={password.new}
                  onChange={e => setPassword({ ...password, new: e.target.value })}
                  type="password"
                  className="w-full"
                  required
                  autoComplete="new-password"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <Input
                  value={password.confirm}
                  onChange={e => setPassword({ ...password, confirm: e.target.value })}
                  type="password"
                  className="w-full"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={savingPassword}>
              {savingPassword ? <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" /> : null}
              Change Password
            </Button>
            <div className="min-h-[24px] text-center">
              {passwordMsg && <span className="flex items-center justify-center text-green-600 text-sm"><CheckCircle className="w-4 h-4 mr-1" />{passwordMsg}</span>}
              {passwordError && <span className="flex items-center justify-center text-red-600 text-sm"><XCircle className="w-4 h-4 mr-1" />{passwordError}</span>}
            </div>
          </form>
        </CardContent>
      </Card> */}
    </div>
  );
}
