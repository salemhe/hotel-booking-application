"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/app/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Badge } from "@/app/components/ui/badge";
import type { Restaurant } from "@/app/lib/types/restaurant";
import API from "@/app/lib/api/userAxios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function Restaurants() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price" | "name">("rating");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [featuresFilter, setFeaturesFilter] = useState<string[]>([]);

  const cuisines = ["International", "Nigerian", "Italian", "Indian"];

  const features = [
    "Outdoor seating",
    "Indoor seating",
    "Vegan options",
    "Free WiFi",
  ];

  const ratings = [1, 2, 3, 4, 5];
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  const activeFiltersCount =
    cuisineFilter.length +
    priceFilter.length +
    (ratingFilter > 0 ? 1 : 0) +
    (locationFilter ? 1 : 0) +
    featuresFilter.length;

  const currentDate = "May 23, 2025";
  const currentTime = "7:30 pm";
  const currentGuests = "2 Guests";

  const handleSearch = async (data?: string) => {
    setIsLoading(true);

    try {
      const result = await API.get(
        `/vendors${data ? `?businessName=${data}` : ""}`,
      );
      setRestaurants(result.data);
      setTotal(result.data.length);
    } catch (error) {
      console.error("Search failed:", error);
      if (error instanceof AxiosError) {
        toast.error(error.message);
        if (error.status === 401 || error.status === 403) {
          router.push("/user-login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const test = async () => {
      const query = searchParams.get("search");
      if (query) {
        await handleSearch(query);
      } else {
        await handleSearch();
      }
    };
    const query = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";

    setSearchQuery(query);
    setLocationFilter(location);
    test();
  }, [searchParams]);

  const resetFilters = () => {
    setCuisineFilter([]);
    setPriceFilter([]);
    setRatingFilter(0);
    setLocationFilter("");
    setCurrentPage(1);
    setSortBy("rating");
    setSortOrder("desc");
    setFeaturesFilter([]);
    setIsOpen(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [
    cuisineFilter,
    priceFilter,
    ratingFilter,
    sortOrder,
    sortBy,
    restaurants,
    featuresFilter,
  ]);

  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (newSortBy: "rating" | "price" | "name") => {
    if (sortBy === newSortBy) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const applyFilters = () => {
    let filtered = restaurants;

    if (searchQuery) {
      filtered = filtered.filter((restaurant) =>
        restaurant.businessName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }
    if (locationFilter) {
      filtered = filtered.filter((restaurant) =>
        restaurant.address.toLowerCase().includes(locationFilter.toLowerCase()),
      );
    }

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  };

  const FilterContent = () => (
    <div className="space-y-6 overflow-y-auto py-4 h-[60vh] lg:h-auto">
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Cuisine Type
        </Label>
        <div className="space-y-2">
          {cuisines.map((cuisine) => (
            <div key={cuisine} className="flex items-center">
              <Checkbox
                id={`cuisine-${cuisine}`}
                checked={cuisineFilter.includes(cuisine)}
                onCheckedChange={() => {
                  setCuisineFilter((prev) =>
                    prev.includes(cuisine)
                      ? prev.filter((c) => c !== cuisine)
                      : [...prev, cuisine],
                  );
                }}
              />
              <label
                htmlFor={`cuisine-${cuisine}`}
                className="ml-2 text-sm font-medium"
              >
                {cuisine}
              </label>
            </div>
          ))}
        </div>
        <button className="text-sm text-teal-600 mt-2">Show more</button>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Location</Label>
        <select className="w-full p-2 border rounded-md text-sm">
          <option>Lagos Island</option>
        </select>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">
          Price Range
        </Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Minimum</span>
            <span className="text-sm">Maximum</span>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min="5000"
              max="70000"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>₦5,000</span>
              <span>₦70,000</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Features</Label>
        <div className="space-y-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-center">
              <Checkbox
                id={`feature-${feature}`}
                checked={featuresFilter.includes(feature)}
                onCheckedChange={() => {
                  setFeaturesFilter((prev) =>
                    prev.includes(feature)
                      ? prev.filter((f) => f !== feature)
                      : [...prev, feature],
                  );
                }}
              />
              <label
                htmlFor={`feature-${feature}`}
                className="ml-2 text-sm font-medium"
              >
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">Ratings</Label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              name="rating"
              id="any-rating"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="any-rating" className="text-sm">
              Any ratings
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" name="rating" id="3plus" className="mr-2" />
            <label htmlFor="3plus" className="text-sm flex items-center">
              3.0+
              <div className="flex ml-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i <= 3 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </label>
          </div>
          <div className="flex items-center">
            <input type="radio" name="rating" id="4plus" className="mr-2" />
            <label htmlFor="4plus" className="text-sm flex items-center">
              4.0+
              <div className="flex ml-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i <= 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Bookies
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-gray-600">Home</span>
              <span className="text-teal-600 font-medium border-b-2 border-teal-600 pb-1">
                Bookings/Reservations
              </span>
              <span className="text-gray-600">Promotions</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
              <button className="p-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5-5-5h5V3h0z"
                  />
                </svg>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">International Restaurant</span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{currentDate}</span>
                <Clock className="w-4 h-4" />
                <span>{currentTime}</span>
                <Users className="w-4 h-4" />
                <span>{currentGuests}</span>
              </div>
            </div>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">
          24 International Restaurants in Lagos
        </h1>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-6 space-y-4">
          <Card className="mb-8">
            <CardContent className="p-6 w-full py-5 px-4 gap-2 flex items-center flex-col">
              <div className="flex gap-2 w-full flex-col">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Enter restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    placeholder="Enter locations..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                onClick={() => handleSearch(searchQuery)}
                className="w-full"
              >
                Search Restaurants
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 "
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] sm:h-[90vh]">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <SheetTitle>Filters</SheetTitle>
                  </div>
                </SheetHeader>
                <div className="overflow-y-auto py-4">
                  <FilterContent />
                </div>
                <SheetFooter className="sticky bottom-0 bg-background pt-4 border-t">
                  <Button className="w-full" onClick={() => setIsOpen(false)}>
                    Show {total} results
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <FilterContent />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <Card className="mb-8 hidden lg:block">
              <CardContent className="p-6 w-full py-5 px-4 gap-2 flex flex-col">
                <div className="flex gap-2 w-full">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Enter restaurants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      placeholder="Enter locations..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  className="w-full"
                >
                  Search Restaurants
                </Button>
              </CardContent>
            </Card>

            {/* Results count and sorting */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading
                  ? "Searching..."
                  : `Found ${total} restaurant${total !== 1 ? "s" : ""}`}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleSort("rating")}>
                    Rating{" "}
                    {sortBy === "rating" && (sortOrder === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("price")}>
                    Price{" "}
                    {sortBy === "price" && (sortOrder === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("name")}>
                    Name{" "}
                    {sortBy === "name" && (sortOrder === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Restaurant Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedRestaurants.map((restaurant) => (
                <Card
                  key={restaurant._id}
                  className="overflow-hidden transition-transform hover:scale-[1.02] relative group"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48">
                      {/* Heart icon */}
                      <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-10">
                        <svg
                          className="w-4 h-4 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                      <Image
                        src="https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800"
                        alt={restaurant.businessName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <Star className="text-yellow-400 mr-1" size={16} />
                      <span className="text-sm font-medium">4.8</span>
                      <span className="text-gray-500 text-sm ml-1">
                        (1,000 reviews)
                      </span>
                    </div>
                    <CardTitle className="line-clamp-1 text-lg mb-1">
                      Kapadoccia
                    </CardTitle>
                    <CardDescription className="text-sm">
                      International, Turkish, Contemporary
                      <br />
                      Lagos, Ikeja
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show more button */}
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>Show more</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Button>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || isLoading}
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
                  disabled={currentPage === totalPages || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
