"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Filter, ChevronDown } from "lucide-react";
import RestaurantCard, { RestaurantType } from "@/app/components/restaurant-card";
import FilterSidebar from "@/app/components/filter-sidebar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import API from "@/app/lib/api/userAxios";
import { AxiosError } from "axios";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([""]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [location, setLocation] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [favorites, setFavorites] = useState([""]);
  const [recentSearches, setRecentSearches] = useState([""]);
  const [initailLoad, setInitialLoad] = useState(true);

  const { toast } = useToast();

  interface filtersType {
    cuisineType: string[];
    priceRange: string[];
    services: string[];
    dietary: string[];
    rating: number;
    distance: number;
    openNow: boolean;
  }

  // Filter states
  const [filters, setFilters] = useState<filtersType>({
    cuisineType: [],
    priceRange: [],
    rating: 0,
    distance: 10,
    openNow: false,
    services: [],
    dietary: [],
  });

  // Get user location on mount

  useEffect(() => {
    setSuggestions([
      "Jollof Rice",
      "Chicken Republic",
      "Dominos Pizza",
      "Ice Cream",
    ]);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=68fb0fcd10d343988489bc4a44b35dd1`
            );
            const data = await response.json();
            const humanReadable = data.results[0].formatted;

            setLocation(humanReadable);
          } catch (error) {
            console.error("Error converting coordinates:", error);
            setLocation("Unable to fetch address");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation("Location permission denied");
        }
      );
    } else {
      setLocation("Geolocation is not supported by your browser.");
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Load recent searches
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    // Initial search to load featured restaurants
    const initialSearch = async () => {
      setInitialLoad(true);
      try {
        await searchRestaurants("");
      } catch (error) {
        console.error("Error during initial search:", error);
      } finally {
        setInitialLoad(false);
      }
    };

    initialSearch();
  }, [])

  const searchRestaurants = useCallback(
    async (query: string) => {
      setInitialLoad(false);
      setLoading(true);
      try {
        const [restaurantRes] = await Promise.allSettled([
          API.get(`/users/restaurant-search?query=${encodeURIComponent(query)}`),
        ]);
      
        if (restaurantRes.status === 'fulfilled') {
          setRestaurants(restaurantRes.value.data.data || []);
        } else if (restaurantRes.reason instanceof AxiosError && restaurantRes.reason.response?.status === 404) {
          setRestaurants([]);
        } else {
          throw restaurantRes.reason;
        }
        // Save to recent searches
        if (query.trim() !== "") {
          const updatedSearches = [
            query,
            ...recentSearches.filter((s) => s !== query),
          ].slice(0, 5);
          setRecentSearches(updatedSearches);
          localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            toast({
              title: "No results found",
              description: "Try a different search term.",
              variant: "destructive",
            });
          } else {
            console.error("Unexpected error:", error);
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        }
      } finally {
        setLoading(false);
      }
      
    },
    [recentSearches, toast]
  );

  // useEffect(() => {
  //   searchRestaurants("");
  // }, [searchRestaurants]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRestaurants(searchQuery);
    setShowSuggestions(false);
  };

  const toggleFavorite = (restaurantId: string) => {
    if (favorites.includes(restaurantId)) {
      setFavorites(favorites.filter((id) => id !== restaurantId));
      toast({
        title: "Removed from favorites",
        description: "Restaurant removed from your favorites",
      });
    } else {
      setFavorites([...favorites, restaurantId]);
      toast({
        title: "Added to favorites",
        description: "Restaurant added to your favorites",
      });
    }
  };

  const applyFilters = (newFilters: filtersType) => {
    setFilters(newFilters);
    // In a real app, you would apply these filters to your API call
    setShowFilters(false);
  };

  const applySorting = (sortOption: string) => {
    setSortBy(sortOption);

    // Apply sorting logic
    const sortedRestaurants = [...restaurants];

    switch (sortOption) {
      case "rating":
        sortedRestaurants.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low":
        sortedRestaurants.sort((a, b) => {
          const aPrice = a.menus?.[0]?.price || 0;
          const bPrice = b.menus?.[0]?.price || 0;
          return aPrice - bPrice;
        });
        break;
      case "price-high":
        sortedRestaurants.sort((a, b) => {
          const aPrice = a.menus?.[0]?.price || 0;
          const bPrice = b.menus?.[0]?.price || 0;
          return bPrice - aPrice;
        });
        break;
      case "distance":
        // In a real app, you would sort by actual distance
        break;
      case "newest":
        sortedRestaurants.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        // Default is relevance, which is the order from the API
        break;
    }

    setRestaurants(sortedRestaurants);
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce(
    (count, [key, value]) => {
      if (Array.isArray(value)) {
        return count + value.length;
      } else if (key === "rating" && value > 0) {
        return count + 1;
      } else if (key === "openNow" && value) {
        return count + 1;
      } else if (key === "distance" && value !== 10) {
        return count + 1;
      }
      return count;
    },
    0
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header with search */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="w-full md:w-2/3 relative">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search for restaurants, dishes..."
                    className="pl-10 pr-12 py-2 w-full"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                    onBlur={() =>
                      setTimeout(() => setShowSuggestions(false), 200)
                    }
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>

              {/* Search suggestions */}
              {showSuggestions && (
                <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                  {recentSearches.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Recent Searches
                      </h3>
                      <ul>
                        {recentSearches.map((search, index) => (
                          <li
                            key={index}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                            onClick={() => {
                              setSearchQuery(search);
                              searchRestaurants(search);
                              setShowSuggestions(false);
                            }}
                          >
                            {search}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestions.length > 0 && (
                    <div className="p-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Suggestions
                      </h3>
                      <ul>
                        {suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                            onClick={() => {
                              setSearchQuery(suggestion);
                              searchRestaurants(suggestion);
                              setShowSuggestions(false);
                            }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-1/3">
              <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-2 rounded-md w-full">
                <MapPin className="h-4 w-4" />
                <span
                  title={location || "loading"}
                  className="truncate max-w-[150px]"
                >
                  {location || "Set your location"}
                </span>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* View toggle and sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={sortBy}
              onChange={(e) => applySorting(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Featured restaurants section */}
        {initailLoad && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Featured Restaurants</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-200 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Recents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-200 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-4">
          {loading ? (
            // Loading skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 h-64">
                  <div className="h-32 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id}
                  restaurant={restaurant}
                  isFavorite={favorites.includes(restaurant._id)}
                  onFavoriteToggle={() => toggleFavorite(restaurant._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">
                No restaurants found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    cuisineType: [],
                    priceRange: [],
                    rating: 0,
                    distance: 10,
                    openNow: false,
                    services: [],
                    dietary: [],
                  });
                }}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Back to top button */}
        <button
          className="fixed bottom-6 right-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronDown className="h-5 w-5 transform rotate-180" />
        </button>
      </div>

      {/* Filter sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={applyFilters}
      />
    </main>
  );
}