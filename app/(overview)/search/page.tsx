"use client"
import React, { useState } from 'react';
import { Star, Heart } from 'lucide-react';
import rest from "@/public/restaurant.jpg";
// import { useSearchParams } from 'next/navigation';
interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  priceRange: string;
  isBookmarked: boolean;
}

const SearchResults = () => {
  const [selectedCuisine, setSelectedCuisine] = useState('International');
  const [priceRange, setPriceRange] = useState([10000, 70000]);
  // const searchParams = useSearchParams();
  // const time = searchParams.get('time');
  // console.log(time);
  // Sample restaurant data
  const restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Kapadoccia",
      cuisine: "International, Turkish, Contemporary",
      location: "Lagos, Ikeja",
      rating: 4.8,
      reviews: 1000,
      image: rest.src,
      priceRange: "₦₦₦₦",
      isBookmarked: false
    },
    // Duplicate the same restaurant 5 more times for demonstration
    ...Array(5).fill(null).map((_, index) => ({
      id: index + 2,
      name: "Kapadoccia",
      cuisine: "International, Turkish, Contemporary",
      location: "Lagos, Ikeja",
      rating: 4.8,
      reviews: 1000,
      image: rest.src,
      priceRange: "₦₦₦₦",
      isBookmarked: false
    }))
  ];

  return (
    <div className="min-h-screen mt-[100px] bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
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
            <h1 className="text-2xl font-bold mb-6">24 International Restaurants in Lagos</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                      <Heart className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-col  mb-2">
                      
                      <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({restaurant.reviews})</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
                    <p className="text-xs text-gray-500">{restaurant.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 