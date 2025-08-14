"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeProvider } from "./ThemeContext";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  ChevronLeft,
  Menu as MenuIcon,
  Home,
  Calendar,
  MapPin,
  UtensilsCrossed,
  CreditCard,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/super-admin/dashboard" },
  { icon: Calendar, label: "Reservations", href: "/super-admin/reservations" },
  { icon: MapPin, label: "Branches", href: "/super-admin/branches" },
  { icon: UtensilsCrossed, label: "Menu Management", href: "/super-admin/menu" },
  { icon: CreditCard, label: "Payments", href: "/super-admin/payments" },
  { icon: Users, label: "Staff", href: "/super-admin/staff" },
  { icon: Settings, label: "Settings", href: "/super-admin/settings" },
  { icon: LogOut, label: "Logout", href: "#", onClick: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/vendor-login';
  }},
];export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const sidebarWidth = sidebarCollapsed ? "w-16" : "w-64";
  
  // Authentication check on mount and when auth state changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      console.log('Super admin layout auth check:', {
        isAuthenticated,
        hasToken: !!token,
        userRole: user?.role,
        loading: authLoading
      });
      
      if (!authLoading) {
        if (isAuthenticated && token && user?.role === 'super-admin') {
          console.log('Super admin authorization confirmed');
          setAuthorized(true);
          setLoading(false);
        } else {
          console.log('Not authorized as super admin, redirecting to login');
          setAuthorized(false);
          setLoading(false);
          // Use immediate hard navigation for most reliable redirect
          window.location.href = '/vendor-login';
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, user, authLoading, router]);

  // Show loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Loading Super Admin Dashboard</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-800"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Block rendering if not authorized
  if (!authorized) {
    return null; // Will redirect in useEffect
  }

  return (
    <ThemeProvider>
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
              <span className="text-2xl font-extrabold tracking-wide transition-all duration-300">Bookie</span>
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
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={index}>{item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-lg transition-all duration-200 w-full text-left font-medium text-base gap-3
                        ${isActive ? "bg-white/10 text-white shadow-inner" : "text-teal-100 hover:bg-white/10 hover:text-white"}
                      `}
                    >
                      <span className="flex justify-center items-center w-8 h-8">
                        <Icon className="w-5 h-5" />
                      </span>
                      {!sidebarCollapsed && (
                        <span className="ml-1 transition-all duration-300 group-hover:font-semibold">{item.label}</span>
                      )}
                    </button>
                  ) : (
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
                  )}
                </li>
              );
            })}
          </ul>
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
    </ThemeProvider>
  );
}
