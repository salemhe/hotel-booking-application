"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Search, User as UserIcon } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bookings", label: "Moments", icon: CalendarDays },
  { href: "/search", label: "Search", icon: Search },
  { href: "/userDashboard/setting", label: "Profile", icon: UserIcon },
];

export default function UserBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white md:hidden">
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
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
