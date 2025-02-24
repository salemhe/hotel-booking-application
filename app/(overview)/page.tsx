"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Coffee,
  Pizza,
  Fish,
  Soup,
  Beef,
  Salad,
  IceCream,
  Cookie,
  Gift,
  ThumbsUp,
  Timer,
  Sparkles,
  ArrowRight,
  Utensils,
  Star,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const [location, setLocation] = useState<string>();
  const [cuisine, setCuisine] = useState<string>();
  const [guests, setGuests] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();



  const cuisineTypes = [
    { name: "Italian", icon: Pizza },
    { name: "Seafood", icon: Fish },
    { name: "Asian", icon: Soup },
    { name: "Steakhouse", icon: Beef },
    { name: "Café", icon: Coffee },
    { name: "Vegetarian", icon: Salad },
    { name: "Desserts", icon: IceCream },
    { name: "Bakery", icon: Cookie },
  ];

  const features = [
    {
      icon: Timer,
      title: "Quick Booking",
      description: "Reserve your table in seconds",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Gift,
      title: "Special Offers",
      description: "Exclusive deals and discounts",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: ThumbsUp,
      title: "Verified Reviews",
      description: "Real feedback from diners",
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Sparkles,
      title: "Premium Experience",
      description: "Curated dining selections",
      color: "text-orange-600 bg-orange-100",
    },
  ];

  const cities = [
    {
      name: "Lagos",
      image: "/hero-bg.jpg",
      restaurants: 1200,
      cuisine: "Diverse Culinary Scene",
    },
    {
      name: "Abuja",
      image: "/hero-bg.jpg",
      restaurants: 980,
      cuisine: "International Fusion",
    },
    {
      name: "Anambra",
      image: "/hero-bg.jpg",
      restaurants: 850,
      cuisine: "Classic American",
    },
    {
      name: "Bayelsa",
      image: "/hero-bg.jpg",
      restaurants: 720,
      cuisine: "Latin & Seafood",
    },
  ];

  const deals = [
    {
      title: "Weekend Brunch Special",
      description: "Complimentary mimosa with any brunch entrée",
      restaurant: "Sunrise Café",
      discount: "20% OFF",
      validUntil: "Weekends Only",
      image: "/hero-bg.jpg",
    },
    {
      title: "Date Night Package",
      description: "4-course dinner for two with wine pairing",
      restaurant: "La Romance",
      discount: "Save $50",
      validUntil: "Tuesday-Thursday",
      image: "/hero-bg.jpg",
    },
    {
      title: "Happy Hour Delights",
      description: "Half-price appetizers and craft cocktails",
      restaurant: "Urban Lounge",
      discount: "50% OFF",
      validUntil: "4PM-7PM Daily",
      image: "/hero-bg.jpg",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Food Enthusiast",
      image: "/hero-bg.jpg",
      comment:
        "The best restaurant booking platform I've ever used. So easy and reliable!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Food Blogger",
      image: "/hero-bg.jpg",
      comment:
        "Game-changer for restaurant reservations. Love the instant confirmation!",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "Restaurant Owner",
      image: "/hero-bg.jpg",
      comment:
        "Increased our bookings by 40%. The platform is a must-have for restaurants.",
      rating: 5,
    },
    {
      name: "Alex Thompson",
      role: "Regular Diner",
      image: "/hero-bg.jpg",
      comment:
        "Never had a bad experience. The recommendations are always spot-on!",
      rating: 5,
    },
    {
      name: "Lisa Wang",
      role: "Food Critic",
      image: "/hero-bg.jpg",
      comment:
        "Finally, a platform that understands what diners and restaurants need.",
      rating: 5,
    },
    {
      name: "David Miller",
      role: "Chef",
      image: "/hero-bg.jpg",
      comment: "The attention to detail and customer service is exceptional.",
      rating: 5,
    },
  ];

  const handleSubmit = () => {
    if (!location || !cuisine) return;
    router.push(`/restaurants?location=${location}&cuisine=${cuisine}&guests=${guests}&date=${date}&time=${time}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Section */}
      

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/hero-bg.jpg"
              alt="Fine dining ambiance"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 to-green-900/90" />
          </div>
          <div className="relative container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sm:text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Your Perfect Dining Experience Awaits
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Book your table at the finest restaurants in seconds. No calls
                needed, instant confirmation.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem
                              key={city.name}
                              value={city.name.toLowerCase()}
                            >
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cuisine</label>
                      <Select value={cuisine} onValueChange={setCuisine}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select Cuisine" />
                        </SelectTrigger>
                        <SelectContent>
                          {cuisineTypes.map((cuisine) => (
                            <SelectItem
                              key={cuisine.name}
                              value={cuisine.name.toLowerCase()}
                            >
                              {cuisine.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Guests</label>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger className="bg-white">
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
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time</label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0");
                            return (
                              <SelectItem key={hour} value={`${hour}:00`}>
                                {`${hour}:00`}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-2 h-4 w-4" />
                    Find a Table
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-linear-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Book your favorite restaurant in 3 simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Find",
                  description:
                    "Search for restaurants by location, cuisine, or availability",
                },
                {
                  icon: CalendarIcon,
                  title: "Book",
                  description:
                    "Select your preferred date, time, and party size",
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
                        <h3 className="text-xl font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {index < 2 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-8 w-8 h-8 text-blue-600 transform -translate-y-1/2" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-linear-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Why Choose Bookie?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the best in dining reservations with our premium
                features
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
                    className={`mx-auto w-16 h-16 mb-6 rounded-full ${feature.color} flex items-center justify-center`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Cities */}
        <section className="py-20 bg-linear-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Popular Dining Cities
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore top restaurants in these culinary destinations
              </p>
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
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-blue-900/90 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                      <p className="text-blue-200 text-sm">
                        {city.restaurants} Restaurants
                      </p>
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
              <h2 className="text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Explore by Cuisine
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find restaurants by your favorite type of food
              </p>
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
        <section className="py-20 bg-linear-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Special Offers
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Exclusive deals from top restaurants
              </p>
            </div>
            <Carousel className="w-full">
              <CarouselContent>
                {deals.map((deal, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-3/4 md:basis-1/2 lg:basis-1/3 p-2"
                  >
                    <Card className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={deal.image || "/placeholder.svg"}
                          alt={deal.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-600 text-white">
                            {deal.discount}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{deal.title}</CardTitle>
                        <CardDescription>{deal.restaurant}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-2">{deal.description}</p>
                        <p className="text-sm font-medium text-blue-600">
                          {deal.validUntil}
                        </p>
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
        <section className="py-20 overflow-hidden bg-linear-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-linear-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                What Our Users Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied diners and restaurant owners
              </p>
            </div>
            <div className="relative">
              <div className="flex space-x-8 animate-marquee">
                {[...testimonials, ...testimonials].map((testimonial, i) => (
                  <Card key={i} className="w-[300px] shrink-0">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {testimonial.name}
                          </CardTitle>
                          <CardDescription>{testimonial.role}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex text-yellow-400 mb-2">
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          )
                        )}
                      </div>
                      <p className="text-gray-600">
                        &quot;{testimonial.comment}&quot;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Restaurant Vendors CTA */}
        <section className="py-20 bg-linear-to-r from-blue-600 to-green-600">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-6">
                  Simplify Reservations & Grow Your Business
                </h2>
                <p className="text-xl mb-8 text-blue-50">
                  Say goodbye to no-shows and manual booking hassles! Our
                  advanced reservation system helps you manage table
                  availability, streamline customer flow, and increase
                  efficiency. Take your restaurant to the next level with smart
                  technology!
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { number: "50K+", label: "Monthly Bookings" },
                    { number: "2K+", label: "Restaurant Partners" },
                    { number: "95%", label: "Customer Satisfaction" },
                    { number: "30%", label: "Revenue Increase" },
                  ].map((stat, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      key={stat.label}
                      className="bg-white/10 rounded-lg p-4 backdrop-blur-xs"
                    >
                      <div className="text-2xl font-bold">{stat.number}</div>
                      <div className="text-blue-100">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
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
              <div className="relative hidden md:block">
                <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-green-600/20 rounded-2xl" />
                <Image
                  src="/hero-bg.jpg"
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
        <section className="py-20 bg-linear-to-b from-white to-blue-50">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image
                    src="/hero-bg.jpg"
                    alt="Newsletter"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 to-green-900/90" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                    <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
                    <p className="text-blue-100">
                      Get the latest deals and restaurant recommendations
                    </p>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full"
                    />
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Subscribe for Exclusive Offers
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
