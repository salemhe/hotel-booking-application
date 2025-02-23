"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ChefHatIcon as Chef,
  Search,
  MapPin,
  Menu,
  LogIn,
  UserCircle,
  Facebook,
  Twitter,
  Instagram,
  Coffee,
  Pizza,
  Fish,
  Soup,
  Beef,
  Salad,
  IceCream,
  Cookie,
  Phone,
  Mail,
  Gift,
  ThumbsUp,
  Timer,
  Sparkles,
  ArrowRight,
  Utensils,
  Star,
  CalendarIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<string>()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    setIsAuthenticated(!!token)
  }, [])

  const cuisineTypes = [
    { name: "Italian", icon: Pizza },
    { name: "Seafood", icon: Fish },
    { name: "Asian", icon: Soup },
    { name: "Steakhouse", icon: Beef },
    { name: "Café", icon: Coffee },
    { name: "Vegetarian", icon: Salad },
    { name: "Desserts", icon: IceCream },
    { name: "Bakery", icon: Cookie },
  ]

  const features = [
    {
      icon: Timer,
      title: "Quick Booking",
      description: "Reserve your table in seconds",
      color: "blue",
    },
    {
      icon: Gift,
      title: "Special Offers",
      description: "Exclusive deals and discounts",
      color: "green",
    },
    {
      icon: ThumbsUp,
      title: "Verified Reviews",
      description: "Real feedback from diners",
      color: "purple",
    },
    {
      icon: Sparkles,
      title: "Premium Experience",
      description: "Curated dining selections",
      color: "orange",
    },
  ]

  const cities = [
    {
      name: "New York",
      image: "/placeholder.svg?height=300&width=400",
      restaurants: 1200,
      cuisine: "Diverse Culinary Scene",
    },
    {
      name: "Los Angeles",
      image: "/placeholder.svg?height=300&width=400",
      restaurants: 980,
      cuisine: "International Fusion",
    },
    {
      name: "Chicago",
      image: "/placeholder.svg?height=300&width=400",
      restaurants: 850,
      cuisine: "Classic American",
    },
    {
      name: "Miami",
      image: "/placeholder.svg?height=300&width=400",
      restaurants: 720,
      cuisine: "Latin & Seafood",
    },
  ]

  const deals = [
    {
      title: "Weekend Brunch Special",
      description: "Complimentary mimosa with any brunch entrée",
      restaurant: "Sunrise Café",
      discount: "20% OFF",
      validUntil: "Weekends Only",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Date Night Package",
      description: "4-course dinner for two with wine pairing",
      restaurant: "La Romance",
      discount: "Save $50",
      validUntil: "Tuesday-Thursday",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Happy Hour Delights",
      description: "Half-price appetizers and craft cocktails",
      restaurant: "Urban Lounge",
      discount: "50% OFF",
      validUntil: "4PM-7PM Daily",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Food Enthusiast",
      image: "/placeholder.svg?height=100&width=100",
      comment: "The best restaurant booking platform I've ever used. So easy and reliable!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Food Blogger",
      image: "/placeholder.svg?height=100&width=100",
      comment: "Game-changer for restaurant reservations. Love the instant confirmation!",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "Restaurant Owner",
      image: "/placeholder.svg?height=100&width=100",
      comment: "Increased our bookings by 40%. The platform is a must-have for restaurants.",
      rating: 5,
    },
    {
      name: "Alex Thompson",
      role: "Regular Diner",
      image: "/placeholder.svg?height=100&width=100",
      comment: "Never had a bad experience. The recommendations are always spot-on!",
      rating: 5,
    },
    {
      name: "Lisa Wang",
      role: "Food Critic",
      image: "/placeholder.svg?height=100&width=100",
      comment: "Finally, a platform that understands what diners and restaurants need.",
      rating: 5,
    },
    {
      name: "David Miller",
      role: "Chef",
      image: "/placeholder.svg?height=100&width=100",
      comment: "The attention to detail and customer service is exceptional.",
      rating: 5,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with gradient background */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Chef className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Bookie
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/restaurants" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Restaurants
            </Link>
            <Link href="/deals" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Deals & Offers
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" className="hidden md:flex">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button className="hidden md:flex bg-blue-600 hover:bg-blue-700">Sign Up</Button>
              </>
            ) : (
              <Button variant="ghost" className="hidden md:flex">
                <UserCircle className="mr-2 h-4 w-4" />
                My Account
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="flex items-center py-2 hover:text-blue-600">
                    Home
                  </Link>
                  <Link href="/restaurants" className="flex items-center py-2 hover:text-blue-600">
                    Restaurants
                  </Link>
                  <Link href="/deals" className="flex items-center py-2 hover:text-blue-600">
                    Deals & Offers
                  </Link>
                  <Link href="/blog" className="flex items-center py-2 hover:text-blue-600">
                    Blog
                  </Link>
                  <Link href="/about" className="flex items-center py-2 hover:text-blue-600">
                    About Us
                  </Link>
                  <Link href="/contact" className="flex items-center py-2 hover:text-blue-600">
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Gradient Overlay */}
        <section className="relative py-16 md:py-24 min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/placeholder.svg?height=600&width=1600"
              alt="Fine dining ambiance"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90" />
          </div>
          <div className="relative container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Discover Your Next Favorite Restaurant</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Book tables at the finest restaurants in your city with just a few clicks
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city.name} value={city.name.toLowerCase()}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cuisine</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineTypes.map((cuisine) => (
                            <SelectItem key={cuisine.name} value={cuisine.name.toLowerCase()}>
                              {cuisine.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Guests</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Number of Guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Guest" : "Guests"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time</label>
                      <Select onValueChange={setTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0")
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {`${hour}:00`}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-2 h-4 w-4" />
                    Find a Table
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Book your favorite restaurant in 3 simple steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Find",
                  description: "Search for restaurants by location, cuisine, or availability",
                },
                {
                  icon: CalendarIcon,
                  title: "Book",
                  description: "Select your preferred date, time, and party size",
                },
                {
                  icon: Utensils,
                  title: "Dine",
                  description: "Enjoy your meal with instant confirmation",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="mb-4 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <step.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {index < 2 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-6 w-8 h-8 text-blue-600 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Why Choose Bookie?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the best in dining reservations with our premium features
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className={`mx-auto w-16 h-16 mb-6 rounded-full bg-${feature.color}-100 flex items-center justify-center`}
                  >
                    <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Cities */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Popular Dining Cities
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Explore top restaurants in these culinary destinations</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city, index) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image
                      src={city.image || "/placeholder.svg"}
                      alt={city.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                      <p className="text-blue-200 text-sm">{city.restaurants} Restaurants</p>
                      <p className="text-blue-200 text-sm">{city.cuisine}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Cuisine Categories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Explore by Cuisine
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Find restaurants by your favorite type of food</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {cuisineTypes.map((cuisine, index) => (
                <motion.div
                  key={cuisine.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="text-center hover:border-blue-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <cuisine.icon className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">{cuisine.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offers */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Special Offers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Exclusive deals from top restaurants</p>
            </div>
            <Carousel className="w-full">
              <CarouselContent>
                {deals.map((deal, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
                    <Card className="overflow-hidden">
                      <div className="relative h-48">
                        <Image src={deal.image || "/placeholder.svg"} alt={deal.title} fill className="object-cover" />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-600 text-white">{deal.discount}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{deal.title}</CardTitle>
                        <CardDescription>{deal.restaurant}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-2">{deal.description}</p>
                        <p className="text-sm font-medium text-blue-600">{deal.validUntil}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <Gift className="mr-2 h-4 w-4" />
                          Claim Offer
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 overflow-hidden bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                What Our Users Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied diners and restaurant owners
              </p>
            </div>
            <div className="relative">
              <div className="flex space-x-8 animate-marquee">
                {[...testimonials, ...testimonials].map((testimonial, i) => (
                  <Card key={i} className="w-[300px] flex-shrink-0">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          <CardDescription>{testimonial.role}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex text-yellow-400 mb-2">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600">&quot;{testimonial.comment}&quot;</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant Vendors CTA */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-green-600">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-6">Are You a Restaurant Owner?</h2>
                <p className="text-xl mb-8 text-blue-50">
                  Join thousands of restaurants that trust us with their booking management. Increase your revenue and
                  reduce no-shows.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { number: "50K+", label: "Monthly Bookings" },
                    { number: "2K+", label: "Restaurant Partners" },
                    { number: "95%", label: "Customer Satisfaction" },
                    { number: "30%", label: "Revenue Increase" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-blue-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" variant="secondary">
                    Partner with Us
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-2xl" />
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Restaurant Management"
                  width={800}
                  height={600}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image src="/placeholder.svg?height=400&width=600" alt="Newsletter" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                    <p className="text-blue-100">Get the latest deals and restaurant recommendations</p>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="space-y-4">
                    <Input type="email" placeholder="Enter your email" className="w-full" />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Subscribe for Exclusive Offers</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Chef className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Bookie
                </span>
              </Link>
              <p className="text-gray-600">Making restaurant reservations simple and enjoyable</p>
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
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-blue-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-blue-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 hover:text-blue-600">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-blue-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-blue-600">
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
            <p className="text-gray-600">&copy; {new Date().getFullYear()} Bookie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

