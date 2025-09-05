// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ThemeProvider } from "@/app/super-administrator/ThemeContext";
// import { BranchProvider, useBranchContext } from "./branches/BranchContext";
// import {
//   ChevronLeft,
//   Menu as MenuIcon,
//   Home,
//   Calendar,
//   UtensilsCrossed,
//   CreditCard,
//   Users,
//   Settings,
//   LogOut
// } from "lucide-react";

// const mainSidebarItems = [
//   { icon: Home, label: "Dashboard", href: "/vendor-dashboard/restaurant/dashboard" },
//   { icon: Calendar, label: "Reservations", href: "/vendor-dashboard/restaurant/reservations" },
//   { icon: UtensilsCrossed, label: "Menu Management", href: "/vendor-dashboard/restaurant/menu" },
//   { icon: CreditCard, label: "Payments", href: "/vendor-dashboard/restaurant/payments" },
//   { icon: Users, label: "Staff", href: "/vendor-dashboard/restaurant/staff" },
// ];
// const bottomSidebarItems = [
//   { icon: Settings, label: "Settings", href: "/vendor-dashboard/restaurant/settings" },
//   { icon: LogOut, label: "Logout", href: "/logout" },
// ];

// function BranchNameDisplay() {
//   const { selectedBranch } = useBranchContext();
//   if (!selectedBranch) return null;
//   return (
//     <div className="mb-4 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold text-lg">
//       {selectedBranch.branchName}
//     </div>
//   );
// }

// export default function SidebarShell({ children }: { children: React.ReactNode }) {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const pathname = usePathname();
//   const sidebarWidth = sidebarCollapsed ? "w-16" : "w-50";

//   return (
//     <ThemeProvider>
//       <BranchProvider>
//         <div className="flex h-screen bg-gray-50">
//           {/* Sidebar */}
//           <div className={`fixed z-30 top-0 left-0 h-full flex flex-col bg-gradient-to-b from-teal-900 via-teal-800 to-teal-700 text-white shadow-xl border-r border-teal-700 transition-all duration-300 ${sidebarWidth}`} style={{ minWidth: sidebarCollapsed ? '4rem' : '16rem', width: sidebarCollapsed ? '4rem' : '16rem' }}>
//             {/* Logo and Collapse Button */}
//             <div className="flex items-center justify-between px-6 py-5 border-b border-teal-700">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
//                   <span className="text-teal-800 font-extrabold text-lg">B</span>
//                 </div>
//                 {!sidebarCollapsed && (
//                   <span className="text-2xl font-extrabold tracking-wide transition-all duration-300">Bookies</span>
//                 )}
//               </div>
//               {!sidebarCollapsed && (
//                 <button
//                   className="ml-2 p-2 rounded-full hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white/40"
//                   onClick={() => setSidebarCollapsed((prev) => !prev)}
//                   aria-label="Collapse sidebar"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </button>
//               )}
//             </div>
//             {/* Navigation */}
//             <nav className="flex-1 px-2 py-4 overflow-y-auto flex flex-col justify-between">
//               <div>
//                 {/* Vendor Name Display (not editable) */}
//                 {!sidebarCollapsed && (
//                   <BranchNameDisplay />
//                 )}
//                 <ul className="space-y-1">
//                   {mainSidebarItems.map((item, index) => {
//                     const isActive = pathname === item.href;
//                     const Icon = item.icon;
//                     return (
//                       <li key={index}>
//                         <Link
//                           href={item.href}
//                           className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-lg transition-all duration-200 w-full text-left font-medium text-base gap-3
//                             ${isActive ? "bg-white/10 text-white shadow-inner" : "text-teal-100 hover:bg-white/10 hover:text-white"}
//                           `}
//                           prefetch={false}
//                         >
//                           <span className="flex justify-center items-center w-8 h-8">
//                             <Icon className="w-5 h-5" />
//                           </span>
//                           {!sidebarCollapsed && (
//                             <span className="ml-1 transition-all duration-300 group-hover:font-semibold">{item.label}</span>
//                           )}
//                         </Link>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//               <div className="mb-2">
//                 <ul className="space-y-1">
//                   {bottomSidebarItems.map((item, index) => {
//                     const isActive = pathname === item.href;
//                     const Icon = item.icon;
//                     return (
//                       <li key={index}>
//                         <Link
//                           href={item.href}
//                           className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'} rounded-lg transition-all duration-200 w-full text-left font-medium text-base gap-3
//                             ${isActive ? "bg-white/10 text-white shadow-inner" : "text-teal-100 hover:bg-white/10 hover:text-white"}
//                           `}
//                           prefetch={false}
//                         >
//                           <span className="flex justify-center items-center w-8 h-8">
//                             <Icon className="w-5 h-5" />
//                           </span>
//                           {!sidebarCollapsed && (
//                             <span className="ml-1 transition-all duration-300 group-hover:font-semibold">{item.label}</span>
//                           )}
//                         </Link>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             </nav>
//           </div>
//           {/* Floating open button when collapsed */}
//           {sidebarCollapsed && (
//             <button
//               className="fixed z-40 top-6 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md focus:outline-none"
//               style={{ opacity: 1, border: 'none' }}
//               onClick={() => setSidebarCollapsed(false)}
//               aria-label="Open sidebar"
//             >
//               <span className="text-teal-800 font-extrabold text-lg pointer-events-none select-none">B</span>
//               <MenuIcon className="w-4 h-4 absolute opacity-0" />
//             </button>
//           )}
//           {/* Main Content */}
//           <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 pl-0 md:pl-${sidebarCollapsed ? '16' : '64'}`} style={{ marginLeft: sidebarCollapsed ? '4rem' : '16rem' }}>
//             {children}
//           </div>
//         </div>
//       </BranchProvider>
//     </ThemeProvider>
//   );
// }







"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/app/super-administrator/ThemeContext";
import { BranchProvider, useBranchContext } from "./branches/BranchContext";

function BranchNameDisplay({ collapsed }: { collapsed: boolean }) {
  const { selectedBranch } = useBranchContext();
  if (!selectedBranch) return null;

  return (
    <div
      className={`bg-[#B3D1D2] text-[#042626] ${
        collapsed ? "px-0" : "px-3"
      } py-2 text-sm font-medium`}
      title={selectedBranch.branchName}
    >
      {!collapsed ? (
        <span>{selectedBranch.branchName}</span>
      ) : (
        <span className="block text-center text-[#042626]">
          {selectedBranch.branchName.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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
    { label: "Logout", href: "/logout" },
  ];

  return (
    <ThemeProvider>
      <BranchProvider>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar */}
          <aside
            className={`
              sticky top-0 self-start h-screen ${
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

              {/* Branch */}
              <BranchNameDisplay collapsed={collapsed} />

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
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
      </BranchProvider>
    </ThemeProvider>
  );
}
