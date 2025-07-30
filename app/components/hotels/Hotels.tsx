"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
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
// import { searchRestaurants } from "@/app/actions";
import API from "@/app/lib/api/userAxios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function Hotels() {
  // const router = useRouter();
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

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

  // async function searchRestaurants(search: string) {
  //   try {
  //     return await API.get(`/vendors?businessName=${search}`)
  //   } catch (error) {
  //     console.error("Search error:", error)
  //     throw new Error("Failed to search restaurants")
  //   }
  // }

  // const cuisines = [
  //   "Italian",
  //   "Japanese",
  //   "Mexican",
  //   "Indian",
  //   "American",
  //   "Chinese",
  //   "French",
  //   "Vegetarian",
  // ];

  const prices = ["₦", "₦₦", "₦₦₦"];
  const ratings = [1, 2, 3, 4, 5];
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  // Calculate active filters count
  const activeFiltersCount =
    cuisineFilter.length +
    priceFilter.length +
    (ratingFilter > 0 ? 1 : 0) +
    (locationFilter ? 1 : 0);

  // Update URL with search params
  // const updateSearchParams = useCallback(
  //   (newParams: string) => {
  //     const params = new URLSearchParams(searchQuery);
  //     params.set("search", newParams);

  //     // Update URL without refresh
  //     router.push(`${pathname}?${params.toString()}`, { scroll: false });
  //   },
  //   [pathname, router, searchQuery]
  // );

  // Debounced search function
  const handleSearch = async (data?: string) => {
    setIsLoading(true);
    // applyFilters();

    try {
      const result = await API.get(
        `/vendors${data ? `?businessName=${data}` : ""}`
      );
      setRestaurants(result.data);
      console.log(result.data);
      setTotal(result.data.length);
      // Update URL params
      // updateSearchParams(searchParams.toString());
    } catch (error) {
      console.error("Search failed:", error);
      // Handle error (show toast, etc.)
      if (error instanceof AxiosError) {
        toast.error(error.message);
        if (error.status === 401 || error.status === 403) {
          // Redirect to login page
          router.push("/user-login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle search params and filters
  // useEffect(() => {
  //   if (initialRender.current) {
  //     initialRender.current = false;
  //     return;
  //   }

  //   const filters: SearchFilters = {
  //     query: searchQuery,
  //   };

  //   // debouncedSearch(filters);
  // }, [
  //   searchQuery,
  //   // cuisineFilter,
  //   // priceFilter,
  //   // ratingFilter,
  //   // locationFilter,
  //   // currentPage,
  //   // sortBy,
  //   // sortOrder,
  //   // debouncedSearch,
  // ]);

  // Initialize from URL params
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
    // setCuisineFilter(cuisines)
    // setPriceFilter(prices)
    // setRatingFilter(rating)
    // setCurrentPage(page)
    // setSortBy(sort)
    // setSortOrder(order)
  }, [searchParams]);

  const resetFilters = () => {
    setCuisineFilter([]);
    setPriceFilter([]);
    setRatingFilter(0);
    setLocationFilter("");
    setCurrentPage(1);
    setSortBy("rating");
    setSortOrder("desc");
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
  ]);

  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
    // if (cuisineFilter.length > 0) {
    //   filtered = filtered.filter((restaurant) =>
    //     cuisineFilter.includes(restaurant.cuisine)
    //   );
    // }
    // if (priceFilter.length > 0) {
    //   filtered = filtered.filter((restaurant) =>
    //     priceFilter.includes("$$")
    //   );
    // }
    // if (ratingFilter > 0) {
    //   filtered = filtered.filter(
    //     (restaurant) => 5 >= ratingFilter
    //   );
    // }
    if (searchQuery) {
      filtered = filtered.filter((restaurant) =>
        restaurant.businessName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (locationFilter) {
      filtered = filtered.filter((restaurant) =>
        restaurant.address.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    // Note: dateFilter and guestsFilter are not used in filtering as the mock data doesn't include this information
    // In a real application, you would use these to filter restaurants based on availability

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  };

  const handlePriceChange = (price: string) => {
    setPriceFilter((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const FilterContent = () => (
    <div className="space-y-6 overflow-y-auto py-4 h-[60vh] lg:h-auto">
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
                className="ml-2 text-sm font-medium"
              >
                {price}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="rating-mobile" className="text-base">
          Minimum Rating
        </Label>
        <div className="mt-2 space-y-2">
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center">
              <Checkbox
                id={`price-${rating}`}
                checked={priceFilter.includes(rating.toString())}
                onCheckedChange={() => handlePriceChange(rating.toString())}
              />
              <label
                htmlFor={`price-${rating}`}
                className="ml-2 text-sm font-medium flex items-center"
              >
                {rating} <Star className="text-yellow-400 ml-2" size={16} />
              </label>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={resetFilters} variant="outline" className="w-full">
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find and Book Restaurants</h1>

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
        <div className="hidden lg:block w-full lg:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Filters</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <FilterContent />
            </CardContent>
          </Card>
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
                  Name {sortBy === "name" && (sortOrder === "desc" ? "↓" : "↑")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col bg-white rounded-lg p-5 border mb-8">
            <h2 className="font-semibold text-xl text-blue-600">
              Popular Foods
            </h2>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto rounded-4xl py-4">
              {[
                {
                  name: "Jollof",
                  price: 1500,
                  amount: 50,
                  image:
                    "data:image/jpeg;base64,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",
                },
                {
                  name: "Jollof & Chicken",
                  price: 1500,
                  amount: 50,
                  image: "data:image/jpeg;base64,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",
                },
                {
                  name: "Jollof",
                  price: 1500,
                  amount: 50,
                  image: "data:image/jpeg;base64,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",
                },
                {
                  name: "Jollof",
                  price: 1500,
                  amount: 50,
                  image: "data:image/jpeg;base64,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",
                },
                {
                  name: "Jollof",
                  price: 1500,
                  amount: 50,
                  image: "data:image/jpeg;base64,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",
                },
                {
                  name: "Jollof",
                  price: 1500,
                  amount: 50,
                  image: "data:image/jpeg;base64,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",
                },
              ].map((food, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-3 cursor-pointer transition-all hover:scale-105"
                >
                  <div className="w-[100px] h-[100px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                      src={food.image}
                      alt={food.name}
                      width={100}
                      height={100}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                  <div className="mt-3 w-full px-4 text-center">
                    <p className="text-xs text-gray-600 flex justify-center gap-1">
                      <span>₦{food.price.toLocaleString()}</span> -
                      <span className="font-medium text-blue-800">
                        {food.amount.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-sm text-blue-500 font-semibold mt-1">
                      {food.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedRestaurants.map((restaurant) => (
              <Card
                key={restaurant._id}
                className="overflow-hidden transition-transform hover:scale-[1.02]"
              >
                <CardHeader className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={
                        `${restaurant.profileImage ? 'https://hotel-booking-app-backend-30q1.onrender.com/uploads/${restaurant.profileImage}' : "/hero-bg.jpg"}`}
                      alt={"image of restaurant"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-1">
                    {restaurant.businessName}
                  </CardTitle>
                  <CardDescription>
                    Restaurant • $$ • {restaurant.address}
                  </CardDescription>
                  <div className="flex items-center mt-2">
                    <Star className="text-yellow-400 mr-1" size={18} />
                    <span>50</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      (5)
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button asChild className="w-full">
                    <Link href={`/restaurants/${restaurant._id}`}>
                      Book Now
                    </Link>
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
  );
}
