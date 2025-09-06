"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Store, CreditCard, Calendar, Settings } from "lucide-react";

const navItems = [
  { href: "/adminDashboard", label: "Home", icon: Home },
  { href: "/adminDashboard/manageUser", label: "Users", icon: Users },
  { href: "/adminDashboard/manageVendors", label: "Vendors", icon: Store },
  { href: "/adminDashboard/track-payments", label: "Payments", icon: CreditCard },
  { href: "/adminDashboard/bookingOverview", label: "Bookings", icon: Calendar },
  { href: "/adminDashboard/setting", label: "Settings", icon: Settings },
];

export default function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden">
      <ul className="grid grid-cols-6">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center py-2 text-xs ${
                  active ? "text-teal-700" : "text-gray-500"
                }`}
              >
                <Icon className={`h-5 w-5 mb-1 ${active ? "text-teal-700" : "text-gray-400"}`} />
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
