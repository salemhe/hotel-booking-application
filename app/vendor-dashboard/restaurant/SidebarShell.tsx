"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/super-admin/ThemeContext";
import { BranchProvider, useBranchContext } from "./branches/BranchContext";
import {
  ChevronLeft,
  Menu as MenuIcon,
  Home,
  Calendar,
  UtensilsCrossed,
  CreditCard,
  Users,
  Settings,
  LogOut,
  MapPin,
} from "lucide-react";

const mainSidebarItems = [
  { icon: Home, label: "Dashboard", href: "/vendor-dashboard/restaurant/dashboard" },
  { icon: Calendar, label: "Reservations", href: "/vendor-dashboard/restaurant/reservations" },
  { icon: MapPin, label: "Branches", href: "/vendor-dashboard/restaurant/branches" },
  { icon: UtensilsCrossed, label: "Menu Management", href: "/vendor-dashboard/restaurant/menu" },
  { icon: CreditCard, label: "Payments", href: "/vendor-dashboard/restaurant/payments" },
  { icon: Users, label: "Staff", href: "/vendor-dashboard/restaurant/staff" },
];
const bottomSidebarItems = [
  { icon: Settings, label: "Settings", href: "/vendor-dashboard/restaurant/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" },
];

function BranchDropdown() {
  const { branches, selectedBranch, setSelectedBranch } = useBranchContext();
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4">
      <div className="relative">
        <button
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-white/40"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{selectedBranch ? selectedBranch.branchName : "No Branches"}</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && branches.length > 0 && (
          <div className="absolute left-0 mt-2 w-full bg-white text-gray-900 rounded shadow z-20">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className={`px-4 py-2 cursor-pointer hover:bg-teal-100 ${selectedBranch && selectedBranch.id === branch.id ? "bg-teal-600 text-white" : ""}`}
                onClick={() => { setSelectedBranch(branch); setOpen(false); }}
              >
                {branch.branchName}
              </div>
            ))}
          </div>
        )}
      </div>
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
                {/* Restaurant Dropdown (real-time branches) */}
                {!sidebarCollapsed && (
                  <BranchDropdown />
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
