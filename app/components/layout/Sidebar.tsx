// import { useUserRole } from "@/app/contexts/UserRoleContex";
// import Link from "next/link";
// // import { useUserRole } from "../../context/UserRoleContext";

// const nav = [
//   { name: "Dashboard", href: "/" },
//   { name: "Rooms", href: "/rooms" },
//   { name: "Reservations", href: "/reservations" },
// ];

// export default function Sidebar() {
// //   const role = useUserRole();

//   return (
//     <aside className="w-64 min-h-screen bg-gray-800 text-white flex flex-col">
//       <div className="p-6 font-bold text-xl">Hotel Admin</div>
//       <nav className="flex-1">
//         <ul>
//           {nav.map((item) => (
//             <li key={item.name}>
//               <Link href={item.href}>
//                 <span className="block px-6 py-3 hover:bg-gray-700">{item.name}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>
//       <div className="p-4 border-t border-gray-700 text-sm">
//         Role: 
//         {/* <span className="capitalize">{role.replace("-", " ")}</span> */}
//       </div>
//     </aside>
//   );
// }


import { Home, Bed, Calendar, Users, Store, CreditCard, TrendingUp, Settings, LogOut } from 'lucide-react';
import Link from "next/link";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole: string;
}

export function Sidebar({ activeSection, setActiveSection, userRole }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/adminDashboard' },
    { id: 'user-management', label: 'User Management', icon: Users, href: '/adminDashboard/manageUser' },
    { id: 'manage-vendors', label: 'Manage Vendors', icon: Store, href: '/adminDashboard/manageVendors' },
    { id: 'track-payments', label: 'Track Payments', icon: CreditCard, href: '/adminDashboard/track-payments' },
    { id: 'booking-overview', label: 'Booking Overview', icon: Calendar, href: '/adminDashboard/bookingOverview' },
    { id: 'reports-analytics', label: 'Reports & Analytics', icon: TrendingUp, href: '/adminDashboard/reports' },
    { id: 'staff', label: 'Staff', icon: Users, href: '/adminDashboard/staff' },
    { id: 'support', label: 'Support', icon: LogOut, href: '/adminDashboard/help' },
    { id: 'platform-setting', label: 'Platform Setting', icon: Settings, href: '/adminDashboard/setting' },
  ];

  return (
    <aside className="w-64 bg-teal-800 text-white flex flex-col h-screen">
      <div className="p-6 border-b border-teal-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-teal-800 font-bold text-sm">HA</span>
          </div>
          <span className="text-xl font-bold">Hotel Admin</span>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.id}>
              <Link href={item.href} legacyBehavior passHref>
                <a
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors w-full text-left ${
                    activeSection === item.id
                      ? 'bg-teal-700 text-white'
                      : 'text-teal-100 hover:bg-teal-700 hover:text-white'
                  }`}
                  tabIndex={0}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-teal-700 text-sm">
        Role: <span className="capitalize">{userRole.replace('-', ' ')}</span>
      </div>
    </aside>
  );
}