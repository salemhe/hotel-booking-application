"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/super-administrator/ThemeContext";

import {
  ChevronLeftIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { CalendarIcon, MenuIcon } from "lucide-react";

const mainSidebarItems = [
  { icon: HomeIcon, label: "Dashboard", href: "/vendor-dashboard/hotel/dashboard" },
  //{ icon: BuildingOffice2Icon, label: "Vendor's", href: "/vendor-dashboard/hotel/vendors" },
  { icon: CalendarIcon, label: "Reservations", href: "/vendor-dashboard/hotel/reservations" },
  //{ icon: UserGroupIcon, label: "User's Management", href: "/vendor-dashboard/hotel/users" },
  { icon: CurrencyDollarIcon, label: "Payments", href: "/vendor-dashboard/hotel/payments" },
  { icon: UserGroupIcon, label: "Staff", href: "/vendor-dashboard/hotel/staff" },
];
const bottomSidebarItems = [
  { icon: Cog6ToothIcon, label: "Settings", href: "/vendor-dashboard/hotel/settings" },
  { icon: ArrowRightOnRectangleIcon, label: "Logout", href: "/logout" },
];

export default function SidebarShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarWidth = sidebarCollapsed ? "w-1" : "w-[230px]";

  return (
    <ThemeProvider>

        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <div
            className={`fixed z-30 top-0 left-0 h-full flex flex-col bg-[#042626] text-white shadow-xl border-r border-teal-700 transition-all duration-300 ${sidebarWidth}`} style={{ minWidth: sidebarCollapsed ? '4rem' : '16rem', width: sidebarCollapsed ? '4rem' : '16rem'

            }}>
            {/* Logo and Collapse Button */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-teal-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-teal-800 font-extrabold text-lg">R</span>
                </div>
                {!sidebarCollapsed && (
                  <span className="text-2xl font-extrabold tracking-wide transition-all duration-300">Rhace</span>
                )}
              </div>
              {!sidebarCollapsed && (
                <button
                  className="ml-2 p-2 rounded-full hover:bg-[#042626] transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
              )}
            </div>
            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Vendor Name Display (not editable) */}

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
                            <Icon />
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
                            <Icon />
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
              <span className="text-teal-800 font-extrabold text-lg pointer-events-none select-none">R</span>
              <MenuIcon className="w-4 h-4 absolute opacity-0" />
            </button>
          )}
          {/* Main Content */}
          <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 pl-0 md:pl-${sidebarCollapsed ? '16' : '64'}`} style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}>
            {children}
          </div>
        </div>

    </ThemeProvider>
  );
}
