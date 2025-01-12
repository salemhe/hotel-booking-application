"use client"
import Link from "next/link";
import React, { useState } from "react";
import { Navlinks } from "@/constant";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 border-b border-[#E5E5E5]">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center py-5">
        <Link href="/" className="font-medium text-2xl">
          LOGO
        </Link>
        <nav className="md:flex gap-[49px] items-center hidden">
          <ul className="flex gap-8 items-center">
            {Navlinks.map((link, i) => (
              <li key={i} className={pathname === link.link ? "text-black" : "text-gray-500 transition-colors duration-200 hover:text-black"}>
                <Link href={link.link} className="font-normal text-base">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/auth?type=login" className="shadow-[0px_0px_16.1px_-1px_#00000040] font-normal text-white text-xl leading-8 bg-black hover:bg-gray-800 px-5 rounded-md">
            Login
          </Link>
        </nav>
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          )}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E5E5] py-4">
          <ul className="flex flex-col gap-4 p-4">
            {Navlinks.map((link, i) => (
              <li key={i} className={pathname === link.link ? "text-black" : "text-gray-500 transition-colors duration-200 hover:text-black"}>
                <Link href={link.link} className="font-normal text-base">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/auth?type=login" className="block text-center shadow-[0px_0px_16.1px_-1px_#00000040] font-normal text-white text-xl leading-8 bg-black hover:bg-gray-800 px-5 py-2 rounded-md mx-4">
            Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
