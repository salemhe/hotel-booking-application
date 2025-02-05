"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AccountTypeModal } from "./AccountTypeModal";

const Navigation = () => {
  const [isAccountTypeModalOpen, setIsAccountTypeModalOpen] = useState(false);
  const [auth, setAuth] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Restaurants", href: "/restaurants" },
    { name: "Hotels", href: "/hotels" },
    { name: "Deals", href: "/deals" },
    { name: "Manage Booking", href: "/manage-booking" },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                LOGO
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    setIsAccountTypeModalOpen(true);
                    setAuth("login");
                  }}
                >
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setIsAccountTypeModalOpen(true);
                    setAuth("signup");
                  }}
                >
                  Sign Up
                </DropdownMenuItem>
                {/* TODO show if user is logged in */}
                {/* <DropdownMenuItem>
                  <Link href="/account">Your Account</Link>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="sm:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <SheetClose 
                    onClick={() => router.push(item.href)}
                    className={`${
                      pathname === item.href
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-start`}
                    key={item.name}>
                        {item.name}
                    </SheetClose>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  {/* TODO show if user is logged in */}
                  {/* <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <User className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        Guest User
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        guest@example.com
                      </div>
                    </div>
                  </div> */}
                  <div className="mt-3 space-y-1">
                  <SheetClose 
                      className="w-full text-left hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2"
                      onClick={() => {
                        setIsAccountTypeModalOpen(true);
                        setAuth("login");
                      }}
                    >
                      Login
                    </SheetClose>
                    <SheetClose 
                      className="w-full text-left hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2"
                      onClick={() => {
                        setIsAccountTypeModalOpen(true);
                        setAuth("signup");
                      }}
                    >
                      Sign Up
                    </SheetClose>
                    {/* TODO show if user is logged in */}
                    {/* <SheetClose 
                      className="w-full text-left hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 py-2"
                      asChild
                    >
                      <Link href="/account">Your Account</Link>
                    </SheetClose> */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <AccountTypeModal
        auth={auth}
        isOpen={isAccountTypeModalOpen}
        onClose={() => setIsAccountTypeModalOpen(false)}
      />
    </nav>
  );
};

export default Navigation;
