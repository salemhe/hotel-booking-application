import React from "react";
import Link from "next/link";
import { FiUser, FiSearch, FiMenu } from "react-icons/fi";

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            Bookies
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/restaurants"
            className="text-text-secondary hover:text-text-primary"
          >
            Restaurants
          </Link>
          <Link
            href="/reservations"
            className="text-text-secondary hover:text-text-primary"
          >
            Reservations
          </Link>
          <Link
            href="/offers"
            className="text-text-secondary hover:text-text-primary"
          >
            Offers
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiSearch className="w-5 h-5 text-text-secondary" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <FiUser className="w-5 h-5 text-text-secondary" />
          </button>
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
            <FiMenu className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;