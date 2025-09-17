"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const Footer = () => {
  
  const pathname = usePathname();
    const[ishotelPaymentPage, setIsHotelPaymentPage] = useState(pathname?.startsWith('/hotels/:id/payment'));

  // Check if the current path is a login slug
  useEffect(() => {
    setIsHotelPaymentPage(pathname?.startsWith('/hotels/') && pathname.endsWith('/payment'));
  }, [pathname]);
  return (
    <>
      {!ishotelPaymentPage && (
        <footer className="bg-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & tagline */}
          <div>
            <Link href="/" className="flex items-center space-x-3 mb-4">
              {/* small blue dot */}
              <span className="w-6 h-6 bg-blue-400 rounded-full inline-block" />
              <span className="text-gray-900 text-xl font-bold leading-relaxed">
                Bookies
              </span>
            </Link>
            <p className="text-gray-900 text-base font-normal leading-normal">
              Making restaurant reservations simple and enjoyable
            </p>
          </div>
          
          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold leading-snug mb-4">Explore</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="/restaurants" className="hover:text-gray-900 text-gray-900 text-base font-normal leading-normal">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="hover:text-gray-900  text-gray-900 text-base font-normal leading-normal">
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  href="/top-restaurants"
                  className="hover:text-gray-900  text-gray-900 text-base font-normal leading-normal"
                >
                  Top Restaurants
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold leading-snug mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="/about" className="hover:text-gray-900  text-gray-900 text-base font-normal leading-normal">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-900  text-gray-900 text-base font-normal leading-normal">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-gray-900  text-gray-900 text-base font-normal leading-normal">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-gray-900  text-gray-900 text-base font-normal leading-normal">
                  Help center
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold leading-snug mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-900 text-base font-normal leading-normal">
              <li className="flex items-start">
                <FiPhone className="mt-1 mr-2" /> +23412345678
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2" /> Kapadoccia@gmail.com
              </li>
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-2" /> 16, Idowu Taylor Street,
                Victoria Island 101241 Nigeria
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-300 pt-8 flex flex-col md:flex-row justify-between items-center ">
          <p className="text-gray-900 text-base font-normal leading-normal">© 2025 Bookies. All Rights Reserved</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-gray-900 text-gray-900 text-base font-normal leading-normal">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900 text-gray-900 text-base font-normal leading-normal">
              Terms of Service
            </Link>
          </div>
      </div>
          </div>
    </footer>
      )}
    </>
  );
};

export default Footer;
