"use client"
import React, { useEffect, useState } from 'react';
import { 
  ChefHat, Calendar, BarChart3, Users, Building2, ArrowRight, 
  Clock, Star, Shield, Phone, Mail, MapPin,
  MenuSquare, Utensils, Tags, Bell,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/axios-config';
import { AuthService } from '@/app/lib/api/services/auth.service';
import { ChevronDown, LogOut, X, Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu"
import { Button } from "@/app/components/ui/button"

export interface VendorProfile {
  _id: string
  name: string
  businessName: string
  email: string
  phone: string
  address: string
  branch: string
  role: string
  services: string[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// Types and Interfaces
interface FeatureCardProps {
   icon: React.ReactNode;
   title: string;
   description: string;
 }
 
 interface RoleCardProps {
   icon: React.ReactNode;
   title: string;
   description: string;
   price: string;
   features: string[];
 }
 
 interface StatCardProps {
   number: string;
   label: string;
 }
 
 interface TestimonialCardProps {
   quote: string;
   author: string;
   role: string;
   company: string;
 }
 
 interface PricingCardProps {
   title: string;
   price: string;
   description: string;
   features: string[];
   highlighted?: boolean;
   router: ReturnType<typeof useRouter>;
 }
 
 interface ContactCardProps {
   icon: React.ReactNode;
   title: string;
   content: string;
 }
const LandingPage = () => {
   const router = useRouter();  
  
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true)
        
        // Get the user data from AuthService
        const user = AuthService.getUser()
        if (!user) {
          console.warn("No user found in storage")
          setLoading(false)
          return
        }

        // Get the token
        const token = AuthService.getToken()
        if (!token) {
          console.warn("No token found")
          setLoading(false)
          return
        }

        // Set up the API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        api.defaults.headers.common['x-api-secret'] = 'diys684iyu2hpre87u386'

        // Fetch vendors data
        const response = await api.get('/vendors')

        if (response.data && Array.isArray(response.data)) {
          // Find the vendor that matches the logged-in user's email
          const loggedInVendor = response.data.find(
            (vendor: VendorProfile) => vendor.email === user.email
          )

          if (loggedInVendor) {
            setProfile(loggedInVendor)
            // Store role in localStorage for ProtectedRoute
            localStorage.setItem("role", loggedInVendor.role)
          } else {
            console.warn("Logged in user not found in vendors list")
          }
        } else {
          console.warn("Invalid vendors data format")
        }
      } catch (error: unknown) {
        console.error("Failed to fetch vendor data:", error)
        if (error && typeof error === 'object' && 'response' in error && error.response && 
            typeof error.response === 'object' && 'status' in error.response && 'data' in error.response) {
          console.error("Error response:", error.response.status, error.response.data)
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchVendorData()
  }, [])

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await AuthService.logout()
      router.push("/vendor-login")
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const getInitials = () => {
   if (profile?.name) {
     const nameParts = profile.name.split(' ')
     return nameParts.length > 1 
       ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0).toUpperCase()}`
       : profile.name.charAt(0).toUpperCase()
   }
   return "V"
 }

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  
  // Close menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (
        isMenuOpen && 
        mobileMenu && 
        !mobileMenu.contains(target) && 
        !target.closest('.menu-toggle')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-linear-to-r from-blue-600 to-blue-800 text-white">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <ChefHat className="w-8 h-8" />
        <span className="text-xl font-bold">RestaurantOS</span>
      </div>

      {/* Mobile Menu Toggle Button */}
     

      {/* Desktop Navigation */}
      <div className=" flex space-x-6 justify-center items-center ">
        <button className="hover:text-blue-200 transition-colors  md:flex hidden">Features</button>
        <button className="hover:text-blue-200 transition-colors  md:flex hidden">Solutions</button>
        <button className="hover:text-blue-200 transition-colors  md:flex hidden">Pricing</button>
        <button className="hover:text-blue-200 transition-colors  md:flex hidden">Testimonials</button>
        <button className="hover:text-blue-200 transition-colors  md:flex hidden">Contact</button>
        
        {!profile ? (
          <button 
            className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors" 
            onClick={() => router.push("/vendor-login")}
          >
            Login
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-2">
                <div className="bg-gray-500 w-8 h-8 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {loading ? "..." : getInitials()}
                  </span>
                </div>
                <div className=" text-left">
                  <p className="text-sm font-medium">
                    {loading ? "Loading..." : `Hi, ${profile?.name || "Vendor"}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {loading ? "" : (profile?.businessName || "Business")}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-ful flex items-center justify-center">
                  <ChevronDown className="" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/vendorDashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <button 
         className="md:hidden menu-toggle z-50" 
         onClick={toggleMenu}
         aria-label="Toggle menu"
        >
         {isMenuOpen ? (
            <X className="w-6 h-6" />
         ) : (
            <Menu className="w-6 h-6" />
         )}
      </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        className={`md:hidden fixed inset-0 bg-blue-900 bg-opacity-95 z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-white">
          <button 
            className="text-xl font-medium hover:text-blue-200 transition-colors"
            onClick={() => {
              setIsMenuOpen(false);
              // Add navigation logic here
            }}
          >
            Features
          </button>
          <button 
            className="text-xl font-medium hover:text-blue-200 transition-colors"
            onClick={() => {
              setIsMenuOpen(false);
              // Add navigation logic here
            }}
          >
            Solutions
          </button>
          <button 
            className="text-xl font-medium hover:text-blue-200 transition-colors"
            onClick={() => {
              setIsMenuOpen(false);
              // Add navigation logic here
            }}
          >
            Pricing
          </button>
          <button 
            className="text-xl font-medium hover:text-blue-200 transition-colors"
            onClick={() => {
              setIsMenuOpen(false);
              // Add navigation logic here
            }}
          >
            Testimonials
          </button>
          <button 
            className="text-xl font-medium hover:text-blue-200 transition-colors"
            onClick={() => {
              setIsMenuOpen(false);
              // Add navigation logic here
            }}
          >
            Contact
          </button>
          
          {/* {!profile ? (
            <button 
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              onClick={() => {
                setIsMenuOpen(false);
                router.push("/vendor-login");
              }}
            >
              Login
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {loading ? "..." : getInitials()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-base font-medium">
                    {loading ? "Loading..." : `Hi, ${profile?.name || "Vendor"}`}
                  </p>
                  <p className="text-sm text-blue-200">
                    {loading ? "" : (profile?.businessName || "Business")}
                  </p>
                </div>
              </div>
              
              <button 
                className="w-full bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push("/vendorDashboard");
                }}
              >
                Dashboard
              </button>
              
              <button 
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center"
                onClick={(e) => {
                  setIsMenuOpen(false);
                  handleLogout(e);
                }}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          )} */}
        </div>
      </div>
    </nav>

        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Transform Your Restaurant Management with Smart Technology
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              A comprehensive dashboard system that streamlines operations, boosts efficiency, and helps you grow your restaurant business. Perfect for single locations and multi-branch operations.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center">
                Start 14-Day Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button className="border border-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Schedule Demo
              </button>
            </div>
            <div className="mt-12 flex items-center space-x-8">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>Secure & Reliable</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Key Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Comprehensive Restaurant Management</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Everything you need to run your restaurant efficiently, all in one place. From menu management to detailed analytics.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MenuSquare className="w-8 h-8 text-blue-600" />}
              title="Smart Menu Management"
              description="Easily upload and update menus, manage categories, and set special offers. Support for multiple languages and currencies."
            />
            <FeatureCard 
              icon={<Calendar className="w-8 h-8 text-blue-600" />}
              title="Advanced Booking System"
              description="Handle reservations with automated confirmation emails, table management, and waitlist features. Reduce no-shows with reminder systems."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
              title="Real-time Analytics"
              description="Track revenue, popular dishes, peak hours, and customer preferences. Make data-driven decisions with detailed insights."
            />
            <FeatureCard 
              icon={<Utensils className="w-8 h-8 text-blue-600" />}
              title="Kitchen Display System"
              description="Streamline kitchen operations with real-time order management, preparation times, and inventory tracking."
            />
            <FeatureCard 
              icon={<Tags className="w-8 h-8 text-blue-600" />}
              title="Promotional Tools"
              description="Create and manage special offers, happy hours, and loyalty programs. Engage customers with targeted marketing campaigns."
            />
            <FeatureCard 
              icon={<Bell className="w-8 h-8 text-blue-600" />}
              title="Smart Notifications"
              description="Stay informed with instant alerts for new bookings, low inventory, peak hours, and important updates."
            />
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Choose Your Perfect Solution</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Whether you&apos;re running a single restaurant or managing multiple locations, we have the right solution for you.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <RoleCard 
              icon={<Building2 className="w-12 h-12 text-blue-600" />}
              title="Restaurant Owner"
              description="Complete control over your single location with powerful management tools."
              price="Starting at $49/month"
              features={[
                "Full menu management system",
                "Table & reservation management",
                "Kitchen display system",
                "Basic analytics and reporting",
                "Staff management tools",
                "Customer feedback system",
                "Email & SMS notifications",
                "24/7 customer support"
              ]}
            />
            <RoleCard 
              icon={<Users className="w-12 h-12 text-blue-600" />}
              title="Multi-Branch Admin"
              description="Comprehensive solution for restaurant chains and multiple locations."
              price="Starting at $199/month"
              features={[
                "All Restaurant Owner features",
                "Unlimited vendor accounts",
                "Cross-location analytics",
                "Centralized menu management",
                "Advanced performance metrics",
                "Custom roles & permissions",
                "API access for integration",
                "Dedicated account manager"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="10,000+" label="Restaurants" />
            <StatCard number="1M+" label="Orders Processed" />
            <StatCard number="99.9%" label="Uptime" />
            <StatCard number="4.9/5" label="Customer Rating" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Join thousands of satisfied restaurant owners who have transformed their business with RestaurantOS.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="RestaurantOS has completely transformed how we manage our restaurant chain. The multi-branch features are exactly what we needed."
              author="Sarah Chen"
              role="Operations Director"
              company="Asian Fusion Group"
            />
            <TestimonialCard 
              quote="The analytics and reporting features have helped us make better decisions. We've increased our revenue by 25% since implementing RestaurantOS."
              author="Michael Rodriguez"
              role="Restaurant Owner"
              company="La Casa Restaurant"
            />
            <TestimonialCard 
              quote="Setup was incredibly easy, and the support team is always there when we need them. Best decision we've made for our business."
              author="Emma Thompson"
              role="General Manager"
              company="The Local Kitchen"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Transparent Pricing</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Choose the plan that best fits your business needs. All plans include our core features.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              title="Starter"
              price="49"
              description="Perfect for new restaurants"
              features={[
                "Menu management",
                "Basic reservations",
                "Simple analytics",
                "Email support"
              ]}
              router={router}
            />
            <PricingCard 
              title="Professional"
              price="99"
              description="For growing restaurants"
              features={[
                "Advanced reservations",
                "Detailed analytics",
                "Kitchen display system",
                "Priority support"
              ]}
              highlighted={true}
              router={router}
            />
            <PricingCard 
              title="Enterprise"
              price="199"
              description="For restaurant chains"
              features={[
                "Multi-location management",
                "Custom integrations",
                "Advanced security",
                "Dedicated support"
              ]}
              router={router}
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Get in Touch</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Have questions? Our team is here to help you choose the right solution for your restaurant.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <ContactCard 
              icon={<Phone className="w-6 h-6" />}
              title="Call Us"
              content="+1 (555) 123-4567"
            />
            <ContactCard 
              icon={<Mail className="w-6 h-6" />}
              title="Email Us"
              content="support@restaurantos.com"
            />
            <ContactCard 
              icon={<MapPin className="w-6 h-6" />}
              title="Visit Us"
              content="123 Restaurant Ave, NY 10001"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <ChefHat className="w-8 h-8" />
                <span className="text-xl font-bold">RestaurantOS</span>
              </div>
              <p className="text-gray-400">
                Transforming restaurant management with smart technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Solutions</li>
                <li>Pricing</li>
                <li>Updates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Terms</li>
                <li>Privacy</li>
                <li>Security</li>
                <li>Cookies</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RestaurantOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow bg-white">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, price, features }) => (
  <div className="p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow bg-white">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <p className="text-lg font-semibold text-blue-600 mb-6">{price}</p>
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center text-gray-700">
          <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const StatCard: React.FC<StatCardProps> = ({ number, label }) => (
   <div className="text-center">
     <div className="text-4xl font-bold mb-2">{number}</div>
     <div className="text-blue-100">{label}</div>
   </div>
 );
 
 const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role, company }) => (
   <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow bg-white">
     <div className="mb-6 flex">
       <Star className="w-6 h-6 text-yellow-400" />
       <Star className="w-6 h-6 text-yellow-400" />
       <Star className="w-6 h-6 text-yellow-400" />
       <Star className="w-6 h-6 text-yellow-400" />
       <Star className="w-6 h-6 text-yellow-400" />
     </div>
     <p className="text-gray-600 mb-6 italic">{quote}</p>
     <div>
       <p className="font-semibold">{author}</p>
       <p className="text-gray-600">{role}</p>
       <p className="text-sm text-blue-600">{company}</p>
     </div>
   </div>
 );
 
 const PricingCard: React.FC<PricingCardProps> = ({ router, title, price, description, features, highlighted = false }) => (
   <div className={`p-8 rounded-xl border ${
     highlighted 
       ? 'border-blue-600 shadow-lg' 
       : 'border-gray-200'
   } hover:shadow-lg transition-shadow bg-white relative`}>
     {highlighted && (
       <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
         <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
           Most Popular
         </span>
       </div>
     )}
     <h3 className="text-2xl font-semibold mb-2">{title}</h3>
     <p className="text-gray-600 mb-4">{description}</p>
     <div className="mb-6">
       <span className="text-4xl font-bold">${price}</span>
       <span className="text-gray-600">/month</span>
     </div>
     <ul className="space-y-3 mb-8">
       {features.map((feature, index) => (
         <li key={index} className="flex items-center text-gray-700">
           <div className="mr-3 text-blue-600">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
             </svg>
           </div>
           {feature}
         </li>
       ))}
     </ul>
     <button onClick={() => router.push("/vendor-signup")} className={`w-full py-3 rounded-lg font-semibold transition-colors ${
       highlighted
         ? 'bg-blue-600 text-white hover:bg-blue-700'
         : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
     }`}>
       Get Started
     </button>
   </div>
 );
 
 const ContactCard: React.FC<ContactCardProps> = ({ icon, title, content }) => (
   <div className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow bg-white">
     <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
       {icon}
     </div>
     <h3 className="text-xl font-semibold mb-2">{title}</h3>
     <p className="text-gray-600">{content}</p>
   </div>
 );
 
 export default LandingPage;