"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const restaurants = [
  {
    id: 1,
    name: "The Italian Place",
    cuisine: "Italian",
    rating: 4.5,
    price: "₦₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "New York",
  },
  {
    id: 2,
    name: "Sushi Heaven",
    cuisine: "Japanese",
    rating: 4.8,
    price: "₦₦₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "Los Angeles",
  },
  {
    id: 3,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.2,
    price: "₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "Miami",
  },
  {
    id: 4,
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.6,
    price: "₦₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "Chicago",
  },
  {
    id: 5,
    name: "Pasta Paradise",
    cuisine: "Italian",
    rating: 4.3,
    price: "₦₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "New York",
  },
  {
    id: 6,
    name: "Burger Bliss",
    cuisine: "American",
    rating: 4.1,
    price: "₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "Los Angeles",
  },
  {
    id: 7,
    name: "Dim Sum Delight",
    cuisine: "Chinese",
    rating: 4.7,
    price: "₦₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "San Francisco",
  },
  {
    id: 8,
    name: "Le Petit Bistro",
    cuisine: "French",
    rating: 4.9,
    price: "₦₦₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "New Orleans",
  },
  {
    id: 9,
    name: "Veggie Vibes",
    cuisine: "Vegetarian",
    rating: 4.4,
    price: "₦₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "Portland",
  },
  {
    id: 10,
    name: "Steakhouse Supreme",
    cuisine: "American",
    rating: 4.6,
    price: "₦₦₦",
    image: "/placeholder.svg?height=200&width=300",
    location: "Dallas",
  },
];

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default function RestaurantsPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense fallback={<Loading />}>
      <Restaurants />
    </Suspense>
  );
}

function Restaurants() {
  const searchParams = useSearchParams();
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [currentPage, setCurrentPage] = useState(1);
  const [cuisineFilter, setCuisineFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)));
  const prices = Array.from(new Set(restaurants.map((r) => r.price)));

  useEffect(() => {
    const location = searchParams.get("location") || "";
    const cuisine = searchParams.get("cuisine") || "";

    setLocationFilter(location);
    if (cuisine && cuisine !== "any") {
      setCuisineFilter([cuisine]);
    }
    setSearchQuery(location); // Use location as initial search query

    applyFilters();
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [cuisineFilter, priceFilter, ratingFilter, searchQuery]); // Only searchParams is needed here

  const applyFilters = () => {
    let filtered = restaurants;
    if (cuisineFilter.length > 0) {
      filtered = filtered.filter((restaurant) =>
        cuisineFilter.includes(restaurant.cuisine)
      );
    }
    if (priceFilter.length > 0) {
      filtered = filtered.filter((restaurant) =>
        priceFilter.includes(restaurant.price)
      );
    }
    if (ratingFilter > 0) {
      filtered = filtered.filter(
        (restaurant) => restaurant.rating >= ratingFilter
      );
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          restaurant.cuisine
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (locationFilter) {
      filtered = filtered.filter((restaurant) =>
        restaurant.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    // Note: dateFilter and guestsFilter are not used in filtering as the mock data doesn't include this information
    // In a real application, you would use these to filter restaurants based on availability

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setCuisineFilter([]);
    setPriceFilter([]);
    setRatingFilter(0);
    setSearchQuery("");
    setLocationFilter("");
    setFilteredRestaurants(restaurants);
    setCurrentPage(1);
  };

  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCuisineChange = (cuisine: string) => {
    setCuisineFilter((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handlePriceChange = (price: string) => {
    setPriceFilter((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find and Book Restaurants</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Cuisine</Label>
                  <div className="mt-2 space-y-2">
                    {cuisines.map((cuisine) => (
                      <div key={cuisine} className="flex items-center">
                        <Checkbox
                          id={`cuisine-${cuisine}`}
                          checked={cuisineFilter.includes(cuisine)}
                          onCheckedChange={() => handleCuisineChange(cuisine)}
                        />
                        <label
                          htmlFor={`cuisine-${cuisine}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {cuisine}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base">Price Range</Label>
                  <div className="mt-2 space-y-2">
                    {prices.map((price) => (
                      <div key={price} className="flex items-center">
                        <Checkbox
                          id={`price-${price}`}
                          checked={priceFilter.includes(price)}
                          onCheckedChange={() => handlePriceChange(price)}
                        />
                        <label
                          htmlFor={`price-${price}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {price}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="rating" className="text-base">
                    Minimum Rating
                  </Label>
                  <Slider
                    id="rating"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[ratingFilter]}
                    onValueChange={(value) => setRatingFilter(value[0])}
                    className="mt-2"
                  />
                  <span className="text-sm text-gray-500">
                    {ratingFilter.toFixed(1)}
                  </span>
                </div>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative mt-1">
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="location"
                      placeholder="Enter a location"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <div className="relative mt-1">
                    <Calendar
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input id="date" type="date" className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="guests">Guests</Label>
                  <div className="relative mt-1">
                    <Users
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Select>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 guest</SelectItem>
                        <SelectItem value="2">2 guests</SelectItem>
                        <SelectItem value="3">3 guests</SelectItem>
                        <SelectItem value="4">4 guests</SelectItem>
                        <SelectItem value="5">5+ guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
              <Button className="w-full mt-6">
                <Search className="mr-2" size={18} />
                Search Restaurants
              </Button>
            </CardContent>
          </Card>

          {/* Restaurant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedRestaurants.map((restaurant) => (
              <Card className="overflow-hidden" key={restaurant.id}>
                <CardHeader className="p-0">
                  <Image
                    // src={restaurant.image || "/placeholder.svg"}
                    src="/hero-bg.jpg"
                    alt={restaurant.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />  
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle>{restaurant.name}</CardTitle>
                  <CardDescription>
                    {restaurant.cuisine} • {restaurant.price} •{" "}
                    {restaurant.location}
                  </CardDescription>
                  <div className="flex items-center mt-2">
                    <Star className="text-yellow-400 mr-1" size={18} />
                    <span>{restaurant.rating}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button asChild className="w-full">
                    <Link href={`/restaurants/${restaurant.id}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
