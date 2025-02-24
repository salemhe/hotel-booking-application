import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ChefHat } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <ChefHat className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Bookie
                </span>
              </Link>
              <p className="text-gray-600">
                Making restaurant reservations simple and enjoyable
              </p>
              <div className="flex space-x-4 mt-4">
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <Linkedin className="h-6 w-6" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-600 hover:text-blue-600"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  contact@bookie.com
                </li>
                <li className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  (555) 123-4567
                </li>
                <li className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  123 Booking Street
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} Bookie. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
  )
}

export default Footer

