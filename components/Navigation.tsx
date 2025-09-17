"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/redux/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import AccountTypeModal from "./AccountTypeModal";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { SearchSectionTwo } from "./SearchSection";
import { useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { UserProfile } from "@/types/auth";

const Navigation = () => {
  
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isHomePage, setIsHomePage] = useState(pathname === '/');
  const [isSearchPage, setIsSearchPage] = useState(pathname?.startsWith('/search'));
  const [isLoginSlug, setIsLoginSlug] = useState(pathname?.startsWith('-login'));
  const[ishotelPaymentPage, setIsHotelPaymentPage] = useState(pathname?.startsWith('/hotels/:id/payment'));
  const [onboarding, setOnboarding] = useState(pathname === '/onboarding');
  const[isverifyStaffPage, setIsVerifyStaffPage] = useState(pathname?.startsWith('/verify-staff'));
  const  user = useSelector((state: RootState) => state.auth);


  // Check if the current path is a login slug
  useEffect(() => {

    setIsLoginSlug(pathname?.endsWith('-login'));
    setIsHotelPaymentPage(pathname?.startsWith('/hotels/') && pathname.endsWith('/payment'));
    setOnboarding(pathname === '/onboarding');
    setIsVerifyStaffPage(pathname?.startsWith('/verify-staff'));
  }, [pathname]);

  useEffect(() => {
    setIsHomePage(pathname === '/');
    setIsSearchPage(pathname?.startsWith('/search'));
  }, [pathname]);

  // Auth state management
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { name: "Home", href: "/" },
    // { name: "Restaurants", href: "/userDashboard/search" },
    { name: "Bookings / Reservations", href: "/bookings" },
    { name: "Offers", href: "#" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(user)
        if (user.isAuthenticated) {
          setProfile(user.user as UserProfile);
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    logout();
    setProfile(null);
  };

  const hideNavigation = !isLoginSlug && !ishotelPaymentPage && !onboarding && !isverifyStaffPage;

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="size-10 bg-gray-300 mr-[50px] animate-pulse rounded-full" />
      );
    }

    if (profile) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="flex items-center bg-transparent w-24 h-14 p-2 rounded-[36px]
                         outline-1 outline-offset-[-1px] outline-gray-200 gap-2 cursor-pointer"
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {profile.firstName[0].toUpperCase()}
                  {profile.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown size={18} className="text-gray-600" />
            </div>
          </DropdownMenuTrigger>
    
          <DropdownMenuContent align="end" className="w-72 bg-gray-50 rounded-2xl">
            {/* Header */}
            <div className="flex items-center px-4 py-4">
              <Avatar className="w-10 h-10 mr-3">
                <AvatarFallback>
                  {profile.firstName[0].toUpperCase()}
                  {profile.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Hi, {profile.firstName} {profile.lastName}
                </p>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
            </div>
    
            <DropdownMenuSeparator />
    
            {/* Primary links */}
                <DropdownMenuItem asChild className="  px-4 py-2">
                  <Link href="/messages">Messages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="  px-4 py-2">
                  <Link href="/bookings">Bookings/Reservation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="  px-4 py-2" >
                  <Link href="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="  px-4 py-2">
                  <Link href="/payments">Payments/Transaction</Link>
                </DropdownMenuItem>
    
            <DropdownMenuSeparator />
    
            {/* Secondary links */}
            <DropdownMenuItem asChild className="  px-4 py-2">
              <Link href="/account">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="  px-4 py-2">
              <Link href="/help">Help Center</Link>
            </DropdownMenuItem>
    
            <DropdownMenuSeparator />
    
            {/* Sign out */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    

    return (
      <>
        <Button className="cursor-pointer hidden md:flex rounded-full" variant={scrolled || !isHomePage ? "ghost" : "default"} asChild>
          <Link href="/auth/user/login">Login</Link>
        </Button>
        <Button
          className="cursor-pointer rounded-full bg-blue-700 hover:bg-blue-700/90"
          asChild
        >
          <Link href="/auth/user/signup">Create Account</Link>
        </Button>
      </>
    );
  };
  const handleSearch = (searchData: {
    query: string;
    tab: string;
    date?: string;
    time?: string;
    guests?: string;
    timestamp: string;
  }) => {
    if (!searchData.query.trim()) return;
    localStorage.setItem('searchData', JSON.stringify(searchData));
    if (typeof window !== 'undefined') {
      window.location.href = `/search`;
    }
  };

  return (
     hideNavigation ? (
      <nav className={`fixed top-0 z-90 w-full transition-all duration-300 ${scrolled || !isHomePage ? 'bg-[#F9FAFB] ' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex">
              <div className="shrink-0 flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-400 rounded-full inline-block" />
                  <span className={`text-2xl font-bold ${scrolled || !isHomePage ? 'text-gray-900' : 'text-[#F9FAFB]'}`}>
                    Bookies
                  </span>
                </Link>
              </div>
            </div>
            {
              !isSearchPage ? (
                <div className="hidden md:ml-6 md:flex sm:space-x-8">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname?.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${scrolled || !isHomePage ? 'text-gray-700' : 'text-[#F9FAFB]'} 
                          text-[1rem] hover:text-blue-500 font-bold px-3 py-2 transition-colors
                          relative group`}
                      >
                        {item.name}
                        <span
                          className={`absolute h-0.5 w-0 bg-blue-500 left-1/2 -translate-x-1/2 bottom-0 rounded-full
                          ${isActive ? 'w-[24px] h-2' : 'group-hover:w-[24px] h-2'} transition-all duration-300`}
                        />
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="sm:flex hidden">
          <SearchSectionTwo onSearch={handleSearch} />
                </div>
              )
            }
            <div className="md:ml-6 flex items-center space-x-4">
              {renderAuthButtons()}
            </div>
          </div>
        </div>
      </nav>
    ): null
  );
};

export default Navigation;
