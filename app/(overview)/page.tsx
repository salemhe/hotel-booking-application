// import Image from "next/image"
// import Link from "next/link"
// import { ArrowRight} from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { TabbedSearch } from "@/components/landing/TabbedSearch"

// export default function Home() {
//   return (
//     <div className="bg-gray-100">
//       {/* Hero section */}
//       <div className="relative bg-blue-600">
//         <div className="absolute inset-0">
//           <Image
//             className="w-full h-full object-cover"
//             src="/hero-bg.jpg"
//             alt="Hero background"
//             width={1600}
//             height={600}
//           />
//           <div className="absolute inset-0 bg-blue-600 opacity-75" aria-hidden="true"></div>
//         </div>
//         <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
//           <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
//             Discover Amazing Dining Experiences
//           </h1>
//           <p className="mt-6 text-xl text-blue-100 max-w-3xl">
//             Find and book the best restaurants and hotels for your next culinary adventure.
//           </p>
//         </div>
//       </div>

//       <TabbedSearch />

//       {/* Featured Restaurants section */}
//       <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Restaurants</h2>
//           <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
//             Discover our top-rated dining experiences
//           </p>
//         </div>
//         <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
//           {[1, 2, 3].map((index) => (
//             <Card key={index}>
//               <CardHeader className="p-0">
//                 <Image
//                   src="/hero-bg.jpg"
//                   alt={`Featured restaurant ${index}`}
//                   width={300}
//                   height={200}
//                   className="w-full h-48 object-cover rounded-t-lg"
//                 />
//               </CardHeader>
//               <CardContent className="p-6">
//                 <CardTitle>Restaurant {index}</CardTitle>
//                 <CardDescription>Cuisine Type • ₦₦ • 4.5 ★</CardDescription>
//                 <p className="mt-2 text-sm text-gray-500">
//                   Experience exquisite flavors and impeccable service at this top-rated restaurant.
//                 </p>
//               </CardContent>
//               <CardFooter className="p-6 pt-0">
//                 <Button asChild className="w-full">
//                   <Link href={`/restaurants/${index}`}>Book Now</Link>
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//         <div className="mt-12 text-center">
//           <Button asChild>
//             <Link href="/restaurants">
//               View All Restaurants
//               <ArrowRight className="ml-2 h-4 w-4" />
//             </Link>
//           </Button>
//         </div>
//       </div>

//       {/* Featured Hotels section */}
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Hotels</h2>
//             <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
//               Find the perfect place to stay for your culinary journey
//             </p>
//           </div>
//           <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
//             {[1, 2, 3].map((index) => (
//               <Card key={index}>
//                 <CardHeader className="p-0">
//                   <Image
//                     src="/hero-bg.jpg"
//                     alt={`Featured hotel ${index}`}
//                     width={300}
//                     height={200}
//                     className="w-full h-48 object-cover rounded-t-lg"
//                   />
//                 </CardHeader>
//                 <CardContent className="p-6">
//                   <CardTitle>Hotel {index}</CardTitle>
//                   <CardDescription>Location • ₦₦₦ • 4.8 ★</CardDescription>
//                   <p className="mt-2 text-sm text-gray-500">
//                     Luxurious accommodations with easy access to the city&apos;s best restaurants.
//                   </p>
//                 </CardContent>
//                 <CardFooter className="p-6 pt-0">
//                   <Button asChild className="w-full">
//                     <Link href={`/hotels/${index}`}>Book Now</Link>
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//           <div className="mt-12 text-center">
//             <Button asChild>
//               <Link href="/hotels">
//                 View All Hotels
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Link>
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChefHat,
  Search,
  Star,
  Users,
  Utensils,
  Clock,
  MapPin,
  ArrowRight,
  Menu,
  LogIn,
  UserCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for auth token in localStorage
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Found my new favorite Italian restaurant through TableScout! The booking process was seamless.",
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment:
        "Great app for last-minute dinner reservations. Saved me multiple times!",
    },
    {
      name: "Emma Davis",
      rating: 5,
      comment:
        "Love the special offers and the variety of restaurants available.",
    },
    {
      name: "James Wilson",
      rating: 5,
      comment:
        "The best restaurant booking platform I've used. Simple and efficient!",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Bookie
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
            >
              How It Works
            </Link>
            <Link
              href="/restaurants"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
            >
              Browse Restaurants
            </Link>
            <Link
              href="deals"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
            >
              Special Offers
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    variant="ghost"
                    className="relative"
                  >
                    <UserCircle className="h-5 w-5 mr-2" />
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      localStorage.removeItem("auth_token");
                      setIsAuthenticated(false);
                    }}
                    className="text-red-600 dark:text-red-400"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.push("/user-login")}
                  variant="ghost"
                  className="flex items-center"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/user-signup")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-4">
                <Link
                  href="#how-it-works"
                  className="text-sm font-medium hover:text-blue-600"
                >
                  How It Works
                </Link>
                <Link
                  href="/restaurants"
                  className="text-sm font-medium hover:text-blue-600"
                >
                  Browse Restaurants
                </Link>
                <Link
                  href="deals"
                  className="text-sm font-medium hover:text-blue-600"
                >
                  Special Offers
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm font-medium hover:text-blue-600"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/bookings"
                      className="text-sm font-medium hover:text-blue-600"
                    >
                      My Bookings
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        localStorage.removeItem("auth_token");
                        setIsAuthenticated(false);
                      }}
                      className="justify-start text-red-600"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start">
                      Sign In
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-green-900">
            <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] opacity-50 bg-cover bg-center" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container relative py-24 md:py-32 mx-auto px-4"
          >
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Your Perfect Dining Experience Awaits
              </h1>
              <p className="mt-6 text-lg leading-8 text-blue-100">
                Book your table at the finest restaurants in seconds. No calls
                needed, instant confirmation.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <div className="relative w-full flex-1 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search restaurants or cuisines"
                    className="pl-9 pr-4 py-1 text-base bg-white/95 dark:bg-slate-950/95 w-full"
                  />
                </div>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  Find a Table
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Featured Restaurants */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Top-Rated Restaurants
              </h2>
              <p className="mt-4 text-muted-foreground">
                Discover the most loved dining spots in your area
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="overflow-hidden group">
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center transform transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            Fine Dining {i}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            Downtown Area
                          </CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-orange-500 text-white"
                        >
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          4.8
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center">
                          <Utensils className="h-4 w-4 mr-1" />
                          Italian
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          2-8
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          30-60m
                        </span>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-center mb-12 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
            >
              Book in 3 Simple Steps
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Search",
                  description:
                    "Find restaurants by cuisine, location, or availability",
                  icon: Search,
                  color: "blue",
                },
                {
                  title: "Book",
                  description: "Reserve your table with just a few clicks",
                  icon: Clock,
                  color: "green",
                },
                {
                  title: "Dine",
                  description: "Enjoy your meal at your chosen restaurant",
                  icon: Utensils,
                  color: "orange",
                },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="relative h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div
                        className={`mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-${step.color}-100 dark:bg-${step.color}-900/20`}
                      >
                        <step.icon
                          className={`h-6 w-6 text-${step.color}-600 dark:text-${step.color}-400`}
                        />
                      </div>
                      <CardTitle>{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-blue-50 dark:bg-slate-900/50 overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tight text-center mb-12 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
            >
              What Our Users Say
            </motion.h2>
            <div className="relative">
              <div className="flex animate-marquee space-x-8">
                {[...testimonials, ...testimonials].map((testimonial, i) => (
                  <Card key={i} className="w-[300px] flex-shrink-0">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <Image
                            src="/hero-bg.jpg"
                            alt={testimonial.name}
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {testimonial.name}
                          </CardTitle>
                          <div className="flex text-orange-400">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        &quot;{testimonial.comment}&quot;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partner CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 p-8 md:p-12 lg:p-16"
            >
              <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-4">
                    Simplify Reservations & Grow Your Business
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Say goodbye to no-shows and manual booking hassles! Our
                    advanced reservation system helps you manage table
                    availability, streamline customer flow, and increase
                    efficiency. Take your restaurant to the next level with
                    smart technology!
                  </p>
                  <Button variant="secondary" size="lg" asChild>
                    <Link
                      href="/vendors-landing-page"
                      className="flex items-center"
                    >
                      Join for Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-white">
                  {[
                    { number: "5000+", label: "Restaurants" },
                    { number: "100K+", label: "Monthly Bookings" },
                    { number: "500K+", label: "Happy Diners" },
                    { number: "50+", label: "Cities" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="rounded-lg bg-white/10 p-4 backdrop-blur-sm"
                    >
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-sm text-blue-100">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-blue-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mx-auto max-w-xl text-center"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <p className="text-muted-foreground mb-8">
                Subscribe to our newsletter for exclusive restaurant
                recommendations and special offers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-white dark:bg-slate-950">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4 mx-auto px-4">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Bookie
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Making restaurant reservations simple and enjoyable.
            </p>
          </div>
          {[
            {
              title: "Company",
              links: ["About Us", "Careers", "Press", "Contact"],
            },
            {
              title: "Resources",
              links: ["Blog", "Help Center", "Guidelines", "FAQs"],
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
            },
          ].map((section, i) => (
            <div key={i}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-300 pt-8 md:flex md:items-center md:justify-between container mx-auto px-4">
          <div className="flex space-x-6 md:order-2">
            <Link href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" aria-hidden="true" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" aria-hidden="true" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" aria-hidden="true" />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" aria-hidden="true" />
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-400 md:mt-0 md:order-1">
            &copy; 2023 Brand name, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
