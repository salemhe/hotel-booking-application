"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, LogOut, ChevronDown, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { api, setAuthToken } from "@/lib/axios-config";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import AccountTypeModal from "./AccountTypeModal";
import { AuthService } from "@/services/userAuth.services";
import { Avatar, AvatarFallback } from "./ui/avatar";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

const Navigation = () => {
  const router = useRouter();

  // Auth state management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = AuthService.isAuthenticated() && profile?.firstName;

  const navItems = [
    { name: "Restaurants", href: "/userDashboard/search" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Vendor", href: "/vendors-landing-page" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      // try {
      //   let token = localStorage.getItem("auth_token");
      //   let userId = localStorage.getItem("user_id");

      //   if (!token || !userId ) {
      //     const sessionResponse = await api.get("/sessions/user");
      //     token = sessionResponse.data.token;
      //     userId = sessionResponse.data.userId;
      //     const expiresAt = sessionResponse.data.expiresAt;

      //     if (new Date(expiresAt) < new Date()) {
      //       return;
      //     }

      //     if (token && userId) {
      //       localStorage.setItem("auth_token", token);
      //       localStorage.setItem("user_id", userId);
      //     }
      //   }

      //   setAuthToken(token);
      //   const profileResponse = await api.get(`/users/profile/${userId}`);
      // } catch (error) {
      //   console.error("Session Fetch Error:", error);
      //   setProfile(null);
      // }
      setProfile(AuthService.getUser());
      setLoading(false);
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    setProfile(null);
    router.push("/user-login");
  };

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="size-10 bg-gray-300 mr-[50px] animate-pulse rounded-full" />
      );
    }

    if (isLoggedIn && profile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-2 hover:bg-transparent group"
            >
              <Avatar>
                <AvatarFallback>
                  {profile.firstName.charAt(0).toUpperCase()}
                  {profile.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* <div className="hidden md:block text-left">
                <p className="text-sm font-medium">
                  Hi, {profile.firstName}
                  {profile.lastName}
                </p>
                <p className="text-xs text-muted-foreground">User</p>
              </div> */}
              <div className="w-8 h-8 rounded-ful flex items-center justify-center">
                <ChevronDown
                  className="group-hover:translate-y-0.5 transition-all"
                  size={16}
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/userDashboard/search">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <Button className="cursor-pointer rounded-full" variant="ghost" asChild>
          <Link href="/user-login">Login</Link>
        </Button>
        <Button
          className="cursor-pointer rounded-full bg-blue-700 hover:bg-blue-700/90"
          asChild
        >
          <Link href="user-signup">Create Account</Link>
        </Button>
      </>
    );
  };

  const renderMobileMenu = () => {
    return (
      <div className="pt-4 pb-3 border-t border-gray-200 z-20 flex flex-col">
        {isLoggedIn && profile ? (
          <>
            <div className="flex items-center px-4">
              {/* <div className="bg-gray-500 w-10 h-10 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {
                    // profile.profile.name?.charAt(0).toUpperCase() ||
                    profile.firstName?.charAt(0).toUpperCase() || "U"
                  }
                </span>
              </div> */}
              <Avatar>
                <AvatarFallback>
                  {profile.firstName.charAt(0).toUpperCase()}
                  {profile.lastName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-800">
                  {
                    // profile.profile.name ||
                    profile.firstName
                  }
                  {/* {profile.lastName} */}
                </div>
                <div className="text-xs font-medium text-gray-500">
                  {profile.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 w-full">
              <SheetClose
                className="w-full text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm"
                asChild
              >
                <Link
                  href="/userDashboard/search"
                  className="w-full text-left hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm"
                >
                  Dashboard
                </Link>
              </SheetClose>
              <SheetClose
                className="w-full text-left hover:bg-accent hover:text-red-600 px-4 py-2 text-sm text-red-600 flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </SheetClose>
            </div>
          </>
        ) : (
          <div className="mt-3 space-y-2 flex flex-col w-full">
            <Button
              className="cursor-pointer rounded-full"
              variant="outline"
              asChild
            >
              <Link href="/user-login">Login</Link>
            </Button>
            <Button
              className="cursor-pointer rounded-full bg-blue-700 hover:bg-blue-700/90"
              asChild
            >
              <Link href="user-signup">Create Account</Link>
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Bookie
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex sm:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground text-sm hover:text-gray-700 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden md:ml-6 md:flex sm:items-center space-x-4">
            {/* <p
              className= "border-transparent cursor-pointer text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
               onClick={() => {
                setIsAccountTypeModalOpen(true);
                setAuth("login");
              }}
            >
              Login
            </p>
          <p
              className= "border-transparent cursor-pointer text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
               onClick={() => {
                setIsAccountTypeModalOpen(true);
                setAuth("signup");
              }}
            >
              Create Account
            </p> */}
            {/* {isLoggedIn && (
              <Button variant="ghost" size="icon">
                <BellDot className="h-5 w-5" />
              </Button>
            )} */}
            {/* <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button> */}
            {renderAuthButtons()}
          </div>
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="pt-4 pb-3 space-y-1">
                  {navItems.map((item) => (
                    <SheetClose
                      key={item.name}
                      asChild
                      onClick={() => router.push(item.href)}
                    >
                      <Link
                        href={item.href}
                        className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 py-2 border-l-4 text-base font-medium w-full text-start"
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
                {renderMobileMenu()}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* <AccountTypeModal
        auth={auth}
        isOpen={isAccountTypeModalOpen}
        onClose={() => setIsAccountTypeModalOpen(false)}
      /> */}
    </nav>
  );
};

export default Navigation;
