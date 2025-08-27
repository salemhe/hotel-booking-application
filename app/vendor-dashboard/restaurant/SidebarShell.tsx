"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/super-administrator/ThemeContext";

import { useState } from "react";
import { useVendorDashboardSocket } from '@/hooks/useVendorDashboardSocket';
import { API_URL } from '../../config';
import DashboardLoader from '../../components/DashboardLoader';



export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || API_URL;
  const { dashboardData, loading } = useVendorDashboardSocket(API_URL, socketUrl);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const itemBase =
    "flex items-center gap-3 rounded-md px-3 h-10 font-medium transition-colors";
  const itemActive = "bg-[#0A6C6D] text-white";
  const itemInactive = "text-gray-300 hover:bg-[#0A6C6D] hover:text-white";
  const labelClass = `truncate whitespace-nowrap ${
    collapsed ? "sr-only" : ""
  }`;

  const menuItems = [
    { label: "Dashboard", href: "/vendor-dashboard/restaurant/dashboard" },
    { label: "Reservations", href: "/vendor-dashboard/restaurant/reservations" },
    { label: "Menu Management", href: "/vendor-dashboard/restaurant/menu" },
    { label: "Payments", href: "/vendor-dashboard/restaurant/payments" },
    { label: "Staff", href: "/vendor-dashboard/restaurant/staff" },
  ];
  const bottomItems = [
    { label: "Settings", href: "/vendor-dashboard/restaurant/settings" },
    { label: "Logout", href: "/vendor-login" },
  ];

  if (loading) {
    return <DashboardLoader />;
  }

  return (
    <ThemeProvider>
      
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <aside
            className={`sticky top-0 self-start h-screen ${
              collapsed ? "w-16" : "w-[230px]"
            } shrink-0 bg-[#042626] text-white transition-[width] duration-300 flex flex-col justify-between`}
          >
            {/* Top header */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between h-16 border-b border-[#0A6C6D] px-3">
                <span className="text-xl font-semibold select-none">
                  Bookies
                </span>
                <button
                  onClick={() => setCollapsed((v) => !v)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-[#0A6C6D] focus:outline-none"
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!collapsed}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={`transition-transform ${
                      collapsed ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M12.5 15L8.333 10.833L12.5 6.666"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              

              {/* Navigation */}
              <nav className="mt-4 flex flex-col space-y-2 px-3">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`${itemBase} ${
                      isActive(item.href) ? itemActive : itemInactive
                    }`}
                  >
                    <span className="shrink-0">
                      {/* Placeholder circle for icons */}
                      <div className="w-4 h-4 rounded-full bg-white/40"></div>
                    </span>
                    <span className={labelClass}>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Bottom items */}
            <div className="mb-4 px-3">
              {bottomItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`${itemBase} ${
                    isActive(item.href) ? itemActive : itemInactive
                  }`}
                >
                  <span className="shrink-0">
                    <div className="w-4 h-4 rounded-full bg-white/40"></div>
                  </span>
                  <span className={labelClass}>{item.label}</span>
                </Link>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            <div className="flex top-0 w-full h-[64px] px-[32px] py-[12px] flex-col items-start gap-2 shrink-0 bg-white">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {dashboardData?.vendorProfilePictureUrl ? (
                    <img
                      src={dashboardData.vendorProfilePictureUrl}
                      alt="Vendor Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium">
                      {dashboardData?.vendorName ? dashboardData.vendorName.charAt(0).toUpperCase() : 'V'}
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      Welcome Back, {dashboardData?.vendorName || 'Vendor'}!
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
                {/* Bell icon and search bar can be added here if needed */}
              </div>
            </div>
            {children}
          </main>
        </div>
      
    </ThemeProvider>
  );
}