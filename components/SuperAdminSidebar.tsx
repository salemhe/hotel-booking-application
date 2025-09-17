import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BuildingOffice2Icon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  // ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Settings } from "@mui/icons-material";
import { LogOut } from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", icon: HomeIcon, href: "/super-admin/dashboard" },
  { label: "Vendor's", icon: BuildingOffice2Icon, href: "/super-admin/vendors" },
  { label: "Reservations", icon: CalendarIcon, href: "/super-admin/reservations" },
  { label: "User's Management", icon: UserGroupIcon, href: "/super-admin/users" },
  { label: "Payments", icon: CurrencyDollarIcon, href: "/super-admin/payments" },
  { label: "Reviews", icon: Cog6ToothIcon, href: "/super-admin/reviews" },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();
  return (
    <div className="w-64 bg-teal-800 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-teal-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-800 font-bold text-sm">R</span>
          </div>
          <span className="text-xl font-bold">Rhace</span>
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
                  <Icon />
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
