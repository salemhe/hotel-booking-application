"use client"

import React, { useEffect, useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellDot, ChevronDown } from "lucide-react";
import { getTimeBasedGreeting } from "./timeGreeting";
import { api, setAuthToken } from "@/lib/axios-config";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
}

function Header() {
  const { timePhrase, greeting } = getTimeBasedGreeting();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token = localStorage.getItem("authToken");
        let userId = localStorage.getItem("userId");

        if (!token || !userId) {
          const sessionResponse = await api.get("/sessions/user");
          token = sessionResponse.data.token;
          userId = sessionResponse.data.userId;
          const expiresAt = sessionResponse.data.expiresAt;

          if (new Date(expiresAt) < new Date()) {
            router.push("/user-login");
            return;
          }

          if (token && userId) {
            localStorage.setItem("authToken", token);
            localStorage.setItem("userId", userId);
          }
        }

        setAuthToken(token);
        // console.log("Token Set in Axios:", api.defaults.headers.common["Authorization"]);

        const profileResponse = await api.get(`/users/profile/${userId}`);
        setProfile(profileResponse.data);
      } catch (error) {
        console.error("Session Fetch Error:", error);
        router.push("/user-login");
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    router.push("/user-login");
  };

  if (!profile) {
    return null;
  }

  return (
    <header className="flex h-20 items-center gap-2 w-full bg-white z-10 border-b border-gray-100 md:pr-64 group-has-data-[collapsible=icon]/sidebar-wrapper:pr-12 transition-[width,height] ease-linear fixed group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex items-center justify-between gap- px-4 w-full">
        <div className="flex items-center justify-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <div className="hidden md:block">
            <h3 className="font-semibold text-[20px]/[30px] tracking-[0.15px] text-[#0a0a0a]">
              {timePhrase}
            </h3>
            <p className="font-normal text-[14px]/[21px] tracking-[0.25px] text-[#757575]">
              {greeting}
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center gap-4">
          <BellDot />
          <div className="relative flex justify-center items-center gap-4 border-l-2 border-gray-300 px-4">
            <div className="bg-gray-500 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {profile.firstName?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-[16px]/[24px] tracking-[0.5px] text-[#0a0a0a]">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="font-normal text-[14px]/[18px] tracking-[0.4px] text-[#0a0a0a]">User</p>
            </div>
            <ChevronDown className="text-[#0a0a0a] w-6 h-6 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)} />
            {dropdownOpen && (
              <div className="absolute right-0 mt-16 w-48 bg-white border border-gray-200 rounded shadow-lg">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;