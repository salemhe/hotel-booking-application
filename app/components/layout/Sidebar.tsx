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


import { Home, Bed, Calendar } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole: string;
}

export function Sidebar({ activeSection, setActiveSection, userRole }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
  ].filter(item => {
    if (item.id === 'rooms' && userRole === 'HotelOwner') return false;
    return true;
  });

  return (
    <div className="w-64 bg-white shadow-md h-screen p-4">
      <div className="text-2xl font-bold mb-8">Hotel Admin</div>
      <nav>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`flex items-center w-full p-2 mb-2 rounded-lg ${
              activeSection === item.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
            }`}
            onClick={() => setActiveSection(item.id)}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}