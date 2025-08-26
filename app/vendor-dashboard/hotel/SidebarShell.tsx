"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/super-administrator/ThemeContext";
import { BranchProvider, useBranchContext } from "../restaurant/branches/BranchContext";
import {
  ChevronLeft,
  Menu as MenuIcon,
  Home,
  Calendar,
  CreditCard,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { MdRoomService } from "react-icons/md";

const mainSidebarItems = [
  { icon: Home, label: "Dashboard", href: "/vendor-dashboard/hotel/dashboard" },
  { icon: Calendar, label: "Reservations", href: "/vendor-dashboard/hotel/reservations" },
  { icon: CreditCard, label: "Payments", href: "/vendor-dashboard/hotel/payments" },
  { icon: MdRoomService, label: "Room Management", href: "/vendor-dashboard/hotel/rooms-management" },
  { icon: Users, label: "Staff", href: "/vendor-dashboard/hotel/staff" },
];
const bottomSidebarItems = [
  { icon: Settings, label: "Settings", href: "/vendor-dashboard/hotel/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

function BranchNameDisplay() {
  const { selectedBranch } = useBranchContext();
  if (!selectedBranch) return null;
  return (
    <div className="mb-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold text-lg">
      {selectedBranch.branchName}
    </div>
  );
}

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarWidth = sidebarCollapsed ? "w-16" : "w-64";

  return (
    <ThemeProvider>
      <BranchProvider>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <div className={`fixed z-30 top-0 left-0 h-full flex flex-col bg-gradient-to-b from-teal-900 via-teal-800 to-teal-700 text-white shadow-xl border-r border-teal-700 transition-all duration-300 ${sidebarWidth}`} style={{ minWidth: sidebarCollapsed ? '4rem' : '16rem', width: sidebarCollapsed ? '4rem' : '16rem' }}>
            {/* Logo and Collapse Button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-teal-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-teal-800 font-extrabold text-lg">B</span>
                </div>
                {!sidebarCollapsed && (
                  <span className="text-2xl font-extrabold tracking-wide transition-all duration-300">Bookies</span>
                )}
              </div>
              {!sidebarCollapsed && (
                <button
                  className="ml-2 p-2 rounded-full hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Vendor Name Display (not editable) */}
                {!sidebarCollapsed && (
                  <BranchNameDisplay />
                )}
                <ul className="space-y-1">
                  {mainSidebarItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-lg transition-all duration-200 w-full text-left font-medium text-base gap-3
                            ${isActive ? "bg-white/10 text-white shadow-inner" : "text-teal-100 hover:bg-white/10 hover:text-white"}
                          `}
                          prefetch={false}
                        >
                          <span className="flex justify-center items-center w-8 h-8">
                            <Icon className="w-5 h-5" />
                          </span>
                          {!sidebarCollapsed && (
                            <span className="ml-1 transition-all duration-300 group-hover:font-semibold">{item.label}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mb-2">
                <ul className="space-y-1">
                  {bottomSidebarItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-lg transition-all duration-200 w-full text-left font-medium text-base gap-3
                            ${isActive ? "bg-white/10 text-white shadow-inner" : "text-teal-100 hover:bg-white/10 hover:text-white"}
                          `}
                          prefetch={false}
                        >
                          <span className="flex justify-center items-center w-8 h-8">
                            <Icon className="w-5 h-5" />
                          </span>
                          {!sidebarCollapsed && (
                            <span className="ml-1 transition-all duration-300 group-hover:font-semibold">{item.label}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>
          </div>
          {/* Floating open button when collapsed */}
          {sidebarCollapsed && (
            <button
              className="fixed z-40 top-6 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md focus:outline-none"
              style={{ opacity: 1, border: 'none' }}
              onClick={() => setSidebarCollapsed(false)}
              aria-label="Open sidebar"
            >
              <span className="text-teal-800 font-extrabold text-lg pointer-events-none select-none">B</span>
              <MenuIcon className="w-4 h-4 absolute opacity-0" />
            </button>
          )}
          {/* Main Content */}
          <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 pl-0 md:pl-${sidebarCollapsed ? '16' : '64'}`} style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}>
            {children}
          </div>
        </div>
      </BranchProvider>
    </ThemeProvider>
  );
}
