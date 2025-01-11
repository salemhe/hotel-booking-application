"use client"
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Navlinks } from "@/constant";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter()
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
          <Button onClick={() => router.push("/login")} className=" shadow-[0px_0px_16.1px_-1px_#00000040] font-normal text-white text-xl leading-8 bg-black hover:bg-gray-800">
            Login
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
