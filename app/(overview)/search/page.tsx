"use client"

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { Star, Heart, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { restaurantService, Restaurant as ApiRestaurant } from '@/app/lib/api/services/restaurant.service';
import { SearchSectionTwo } from '@/app/components/SearchSection';

interface SearchData {
  query: string;
  tab: string;
  date?: string;
  time?: string;
  guests?: string;
  timestamp: string;
}

const LoadingFallback = () => (
  <div className="min-h-screen mt-[100px] bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    </div>
  </div>
);

const SearchContent = () => {
  const [selectedCuisine, setSelectedCuisine] = useState('International');
  const [priceRange, setPriceRange] = useState([10000, 70000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<ApiRestaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await restaurantService.searchRestaurants(query);
      setRestaurants(response.data);

      // Update localStorage with the current search
      const updatedSearchData: SearchData = {
        ...(searchData || {}),
        query: query,
        tab: (searchData && searchData.tab) || 'restaurants',
        timestamp: new Date().toISOString(),
      };
      setSearchData(updatedSearchData);
      localStorage.setItem('searchData', JSON.stringify(updatedSearchData));

    } catch (err) {
      console.error('Search error:', err);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [searchData]);

  // Load search data from URL parameters or localStorage on component mount
  useEffect(() => {
    setMounted(true);

    // First check URL parameters
    const urlQuery = searchParams.get('q');
    const urlDate = searchParams.get('date');
    const urlTime = searchParams.get('time');
    const urlGuests = searchParams.get('guests');
    const urlCategory = searchParams.get('category');

    if (urlQuery || urlDate || urlTime || urlGuests) {
      const urlSearchData: SearchData = {
        query: urlQuery || '',
        tab: urlCategory || 'Restaurant',
        date: urlDate || undefined,
        time: urlTime || undefined,
        guests: urlGuests || undefined,
        timestamp: new Date().toISOString()
      };

      setSearchData(urlSearchData);
      setSearchQuery(urlQuery || '');

      // Save to localStorage for persistence
      localStorage.setItem('searchData', JSON.stringify(urlSearchData));

      if (urlQuery) {
        handleSearch(urlQuery);
      }
      return;
    }

    // Fall back to localStorage if no URL parameters
    const stored = localStorage.getItem('searchData');
    if (stored) {
      try {
        const parsed: SearchData = JSON.parse(stored);
        setSearchData(parsed);
        setSearchQuery(parsed.query);
        if (parsed.query) {
          handleSearch(parsed.query);
        }
      } catch (error) {
        console.error('Error parsing search data from localStorage:', error);
      }
    }
  }, [searchParams, handleSearch]);

  const handleNewSearch = (newSearchData: SearchData) => {
    setSearchQuery(newSearchData.query);
    setSearchData(newSearchData);
    handleSearch(newSearchData.query);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen mt-[100px] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[100px] bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:hidden mb-8 flex">
          <SearchSectionTwo onSearch={handleNewSearch} searchData={searchData} />
        </div>
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 sm:flex hidden flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              
              {/* Cuisine Type */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Cuisine Type</h3>
                <div className="space-y-2">
                  {['International', 'Nigerian', 'Italian', 'Indian'].map((cuisine) => (
                    <label key={cuisine} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCuisine === cuisine}
                        onChange={() => setSelectedCuisine(cuisine)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{cuisine}</span>
                    </label>
                  ))}
                </div>
                <button className="text-sm text-blue-600 mt-2">Show more</button>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Location</h3>
                <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
                  <option>Lagos Island</option>
                  <option>Ikeja</option>
                  <option>Victoria Island</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Price Range</h3>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-24 border border-gray-300 rounded-md p-1 text-sm"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-24 border border-gray-300 rounded-md p-1 text-sm"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">Features</h3>
                <div className="space-y-2">
                  {['Outdoor seating', 'Indoor seating', 'Vegan options', 'Free WiFi'].map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="text-sm font-medium mb-3">Ratings</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Any ratings</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 flex items-center text-sm text-gray-600">
                      3.0+ <Star className="w-4 h-4 text-yellow-400 ml-1" />
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 flex items-center text-sm text-gray-600">
                      4.0+ <Star className="w-4 h-4 text-yellow-400 ml-1" />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-6">
              {`${restaurants.length} Restaurant${restaurants.length !== 1 ? 's' : ''} found`}
            </h1>
            
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Searching restaurants...</span>
              </div>
            )}
            
            {!loading && restaurants.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-gray-500">No restaurants found for &quot;{searchQuery}&quot;</p>
                <p className="text-sm text-gray-400 mt-2">Try searching with different keywords</p>
              </div>
            )}
            
            {!loading && restaurants.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <div 
                    key={restaurant._id} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/restaurants/${restaurant._id}`)}
                  >
                    <div className="relative">
                      <Image
                        src={restaurant.profileImage || "/restaurant.jpg"}
                        alt={restaurant.businessName}
                        width={384} height={192}
                        className="w-full h-48 object-cover"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                        <Heart className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-col mb-2">
                        <h3 className="font-semibold text-gray-900 mb-2">{restaurant.businessName}</h3>
                        <div className="flex items-center mb-2">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">4.5</span>
                          <span className="text-xs text-gray-500 ml-1">(50+ reviews)</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{restaurant.services.join(', ')}</p>
                      <p className="text-xs text-gray-500 mb-3">{restaurant.address}</p>
                      
                      {/* Menu Items Preview */}
                      {restaurant.menus.length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-xs text-gray-500 mb-2">Popular items:</p>
                          <div className="space-y-1">
                            {restaurant.menus.slice(0, 2).map((menu) => (
                              <div key={menu._id} className="flex justify-between items-center text-xs">
                                <span className="text-gray-700">{menu.dishName}</span>
                                <span className="text-gray-600">₦{menu.price.toLocaleString()}</span>
                              </div>
                            ))}
                            {restaurant.menus.length > 2 && (
                              <p className="text-xs text-blue-600">+{restaurant.menus.length - 2} more items</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this wrapper component
const Page = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchContent />
    </Suspense>
  );
};

export default Page;
