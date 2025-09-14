"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { AuthService } from "@/lib/api/services/auth.service";
import {
  ChevronLeft, 
  ChevronRight, 
  Home,
  Calendar,
  MapPin,
  UtensilsCrossed,
  CreditCard,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { ThemeProvider } from "../../components/theme-provider";

interface SidebarItemType {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}

const sidebarItems: SidebarItemType[] = [
  { icon: Home, label: "Dashboard", href: "/super-administrator/dashboard" },
  { icon: Calendar, label: "Reservations", href: "/super-administrator/reservations" },
  { icon: MapPin, label: "Branches", href: "/super-administrator/branches" },
  { icon: UtensilsCrossed, label: "Menu Management", href: "/super-administrator/menu" },
  { icon: CreditCard, label: "Payments", href: "/super-administrator/payments" },
  { icon: Users, label: "Staff", href: "/super-administrator/staff" },
  { icon: Settings, label: "Settings", href: "/super-administrator/settings" },
  {
    icon: LogOut,
    label: "Logout",
    onClick: () => {
      // TODO: It's good practice to also notify the backend to invalidate the session/token.
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      // Hard redirect to ensure all state is cleared.
      window.location.href = "/vendor-login";
    },
  },
];

type SidebarItemProps = {
  item: SidebarItemType;
  isCollapsed: boolean;
  isActive: boolean;
};

const SidebarItem = ({ item, isCollapsed, isActive }: SidebarItemProps) => {
  const { icon: Icon, label, href, onClick } = item;

  const commonClasses = `group flex items-center rounded-lg transition-all duration-200 w-full text-left font-medium text-sm gap-3 ${
    isCollapsed ? "justify-center px-0 py-3" : "px-3 py-3"
  } ${
    isActive
      ? "bg-emerald-500 text-white shadow-lg"
      : "text-gray-300 hover:bg-white hover:bg-opacity-10 hover:text-white"
  }`;

  const content = (
    <>
      <span className="flex justify-center items-center w-8 h-8">
        <Icon className="w-5 h-5" />
      </span>
      {!isCollapsed && <span className="ml-1 transition-all duration-300">{label}</span>}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={commonClasses}>
        {content}
      </button>
    );
  }

  return (
    <Link href={href!} className={commonClasses} prefetch={false}>
      {content}
    </Link>
  );
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [cookieSet, setCookieSet] = useState(false); // New state to track cookie status
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const mainItems = sidebarItems.filter((i) => i.label !== "Settings" && i.label !== "Logout");
  const bottomItems = sidebarItems.filter((i) => i.label === "Settings" || i.label === "Logout");

  // 1. Authentication Check
  useEffect(() => {
    if (authLoading) return;

    const token = localStorage.getItem("auth_token");
    if (isAuthenticated && token && user?.role === "super-admin") {
      setAuthorized(true);
    } else {
      router.replace("/vendor-login");
    }
  }, [isAuthenticated, user, authLoading, router]);

  // 2. Set Session Cookie
  useEffect(() => {
    if (!authorized) return;

    const setCookie = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        console.log("setCookie: Attempting to set session cookie.");
        console.log("setCookie: Token found in localStorage:", !!token);

        if (token) {
          console.log("setCookie: Sending token to backend for session cookie.");
          await AuthService.setToken(token);
          console.log("setCookie: Backend response for set-admin-token:");
          setCookieSet(true); // Mark cookie as set
          console.log("setCookie: cookieSet state set to true.");
        } else {
          console.log("setCookie: No token found, redirecting to /vendor-login.");
          router.replace("/vendor-login");
        }
      } catch (e) {
        console.error("setCookie: Error setting session token cookie:", e); // Changed warn to error for visibility
        router.replace("/vendor-login");
      }
    };
    setCookie();
  }, [authorized, router]);

  // Show a loading spinner while checking auth or setting the cookie
  if (authLoading || !authorized || !cookieSet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Loading Super Admin Dashboard</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`fixed z-30 top-0 left-0 h-full flex flex-col bg-gray-900 text-white shadow-xl border-r border-gray-800 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"}`}
          style={{ minWidth: sidebarCollapsed ? '4rem' : '16rem', width: sidebarCollapsed ? '4rem' : '16rem' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-emerald-600 font-extrabold text-lg">B</span>
              </div>
              {!sidebarCollapsed && (
                <span className="text-xl font-extrabold tracking-wide transition-all duration-300">Bookies</span>
              )}
            </div>
            {/* Collapse/Expand Button (always visible, icon toggles) */}
            <button
              className="ml-2 p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-6 h-6" />
              ) : (
                <ChevronLeft className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {mainItems.map((item, index) => {
                return (
                  <li key={index}>
                    <SidebarItem
                      item={item}
                      isCollapsed={sidebarCollapsed}
                      isActive={pathname === item.href}
                    />
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom items */}
          <div className="px-2 py-3 border-t border-gray-800">
            <ul className="space-y-1">
              {bottomItems.map((item, index) => {
                return (
                  <li key={index}>
                    <SidebarItem
                      item={item}
                      isCollapsed={sidebarCollapsed}
                      isActive={pathname === item.href}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Floating open button when collapsed (preserved) */}
        {sidebarCollapsed && (
          <button
            className="fixed z-40 top-6 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md focus:outline-none"
            style={{ opacity: 1, border: 'none' }}
            onClick={() => setSidebarCollapsed(false)}
            aria-label="Open sidebar"
          >
            <span className="text-emerald-600 font-extrabold text-lg pointer-events-none select-none">B</span>
          </button>
        )}

        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}