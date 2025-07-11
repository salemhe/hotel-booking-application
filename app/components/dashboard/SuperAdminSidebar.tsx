import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  MapPin,
  Menu as MenuIcon,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Star,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: Home, href: "/super-admin/dashboard" },
  { label: "Reservations", icon: Calendar, href: "/super-admin/reservations" },
  { label: "Branches", icon: MapPin, href: "/super-admin/branches" },
  { label: "Menu Management", icon: MenuIcon, href: "/super-admin/menu" },
  { label: "Payments", icon: CreditCard, href: "/super-admin/payments" },
  { label: "Reviews", icon: Star, href: "/super-admin/reviews" },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  return (
    <div className="w-64 bg-teal-800 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-teal-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-800 font-bold text-sm">B</span>
          </div>
          <span className="text-xl font-bold">Bookies</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                    isActive ? "bg-teal-700 text-white" : "text-teal-100 hover:bg-teal-700 hover:text-white"
                  }`}
                  prefetch={false}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-teal-700">
        <ul className="space-y-2">
          <li>
            <Link
              href="/super-admin/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-100 hover:bg-teal-700 hover:text-white transition-colors w-full text-left"
              prefetch={false}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link
              href="/logout"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-100 hover:bg-teal-700 hover:text-white transition-colors w-full text-left"
              prefetch={false}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
