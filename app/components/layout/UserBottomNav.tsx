"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

const ICONS = {
  home: "https://cdn.builder.io/api/v1/image/assets%2Fe5fc2afc65d841558010095c57d7ddea%2F16ebc1c22dc34f35a33c3874ffa7de2d?format=webp&width=64",
  calendar: "https://cdn.builder.io/api/v1/image/assets%2Fe5fc2afc65d841558010095c57d7ddea%2Fa9f18933441348c3b45f4234e04ebba9?format=webp&width=64",
  search: "https://cdn.builder.io/api/v1/image/assets%2Fe5fc2afc65d841558010095c57d7ddea%2F06adb6b69679414c9caa6b84918af86c?format=webp&width=64",
};

const items = [
  { href: "/", label: "Home", key: "home" as const },
  { href: "/bookings", label: "Moments", key: "calendar" as const },
  { href: "/search", label: "Search", key: "search" as const },
  { href: "/userDashboard/setting", label: "Profile", key: "profile" as const },
];

export default function UserBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white md:hidden pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, key }) => {
          const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex flex-col items-center justify-center py-2 text-xs ${
                  active ? "text-teal-700" : "text-gray-500"
                }`}
              >
                {key === "profile" ? (
                  <Avatar className="h-5 w-5 mb-1">
                    <AvatarFallback className={`${active ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"}`}>P</AvatarFallback>
                  </Avatar>
                ) : (
                  <Image
                    src={ICONS[key]}
                    alt={`${label} icon`}
                    width={24}
                    height={24}
                    className={`mb-1 ${active ? "opacity-100" : "opacity-60"}`}
                    priority
                  />
                )}
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
