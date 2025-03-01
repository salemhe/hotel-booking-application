"use client";

import React, { useEffect, useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellDot, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { getTimeBasedGreeting } from "./timeGreeting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useRouter } from 'next/navigation';
import { useSession } from '@/components/UserSessionManager';
import { AuthService } from '@/services/auth.services';
import { UserProfile } from '../Navigation';

// export interface UserProfile {
//   email: string;
//   role: string;
//   token?: string;
//   firstName: string;
//   profile: {
//     id: string;
//     name: string;
//     businessName: string;
//     email: string;
//     address: string;
//     branch: string;
//     profileImage: string;
//     services: string[];
//     token: string;
//   };
// }

function Header() {
  const { timePhrase, greeting } = getTimeBasedGreeting();
  const { logout, isLoading } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  // const router = useRouter();

    useEffect(() => {
    const fetchUserData = async () => {
          setUser(AuthService.getUser());
    };

    fetchUserData();
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (isLoading ) {
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
            <div className="animate-pulse bg-gray-200 w-10 h-10 rounded-full" />
            <div className="animate-pulse">
              <div className="bg-gray-200 h-4 w-20 rounded mb-2"></div>
              <div className="bg-gray-200 h-3 w-12 rounded"></div>
            </div>
          </div>
        </div>
      </header>
    );
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
          <BellDot className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors" />
          <div className="relative flex justify-center items-center gap-4 border-l-2 border-gray-300 px-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar>
                    {user?.profileImage ? (
                      <AvatarImage src={user.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
                    ) : null}
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {user?.firstName?.charAt(0).toUpperCase() || "U"}
                      {user?.lastName?.charAt(0).toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-[16px]/[24px] tracking-[0.5px] text-[#0a0a0a]">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    {/* <p className="font-normal text-[14px]/[18px] tracking-[0.4px] text-[#0a0a0a]">
                      {user?.role || "User"}
                    </p> */}
                  </div>
                  <ChevronDown className="text-[#0a0a0a] w-4 h-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;