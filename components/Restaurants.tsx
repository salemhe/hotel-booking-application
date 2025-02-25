"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Restaurant } from "@/types/restaurant";
// import { searchRestaurants } from "@/app/actions";
import API from "@/utils/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function Restaurants() {
  // const router = useRouter();
  // const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);
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
    applyFilters();

    try {
      const result = await API.get(`/vendors${data ? `?businessName=${data}` : ""}`);
      setRestaurants(result.data);
      console.log(result.data)
      setTotal(result.data.length);
      // Update URL params
      // updateSearchParams(searchParams.toString());
    } catch (error) {
      console.error("Search failed:", error);
      // Handle error (show toast, etc.)
      if (error instanceof AxiosError) {
        toast.error(error.message);
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
  }, [cuisineFilter, priceFilter, ratingFilter, sortOrder, sortBy, restaurants]);

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
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                      src={"/hero-bg.jpg"}
                      alt={restaurant.name || "image of restaurant"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="line-clamp-1">
                    {restaurant.name}
                  </CardTitle>
                  <CardDescription>
                    Test • $$ •{" "}
                    {restaurant.address}
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
