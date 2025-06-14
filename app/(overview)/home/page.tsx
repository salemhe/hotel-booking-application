"use client"
import React, { useEffect, useState } from 'react';
import { VendorService, Vendor } from '@/app/lib/api/services/vendors';
import SearchSection from "@/app/components/SearchSection";
import TableGrid, { TableGridTwo, Restaurant } from "@/app/components/TableGrid";

const tabs = [
  {
    name: "Restaurants",
    value: "restaurants"
  },
  {
    name: "Hotels", 
    value: "hotels"
  },
]

interface ApiRestaurant {
  _id: string;
  name: string;
  cuisine: string;
  badge?: string;
  id?:number;
  businessName: string;
  businessType: string;
  branch: string;
  address: string;
  email: string;
  phone: string;
  services: string[];
  image?: string;
  profileImages?: string[];
  description?: string;
  rating?: number;
  reviews?: string[];
  createdAt?: string;
  updatedAt?: string;
  featured?: boolean;
  location?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
    // Load saved tab from localStorage only on client side
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab && (savedTab === "restaurants" || savedTab === "hotels")) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await VendorService.getVendors();
        setVendors(data);
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted) {
      fetchVendors();
    }
  }, [mounted]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (mounted) {
      localStorage.setItem("activeTab", tab);
    }
  }

  // Convert vendors to restaurant format with better error handling
  const convertVendorsToRestaurants = (vendors: Vendor[]): ApiRestaurant[] => {
    return vendors.map((vendor, index) => {
      console.log(vendor._id);
      try {
        return {
          _id: vendor._id || `vendor-${index + 1}`,
          name: vendor.businessName || 'Unknown Business',
          businessName: vendor.businessName || 'Unknown Business',
          businessType: vendor.businessType || 'Various',
          branch: vendor.branch || '',
          address: vendor.address || '',
          email: vendor.email || '',
          phone: vendor.phone || '',
          services: vendor.services || [],
          image: vendor.profileImages?.[0] || '/placeholder.jpg',  // Use first image as main image
          profileImages: vendor.profileImages || [],  // Add all profile images
          description: vendor.description || '',
          rating: typeof vendor.rating === 'number' ? vendor.rating : 4.5,
          reviews: vendor.reviews || [],
          createdAt: vendor.createdAt || new Date().toISOString(),
          updatedAt: vendor.updatedAt || new Date().toISOString(),
          featured: vendor.featured || false,
          location: vendor.address || 'Location not specified',
          cuisine: vendor.businessType || 'Various',
        };
      } catch (error) {
        console.error('Error converting vendor to restaurant:', vendor, error);
        return {
          _id: String(index + 1),
          name: 'Error loading restaurant',
          businessName: 'Error loading restaurant',
          businessType: 'Unknown',
          branch: '',
          address: 'Unknown',
          email: '',
          phone: '',
          services: [],
          image: '/placeholder.jpg',
          profileImages: [],
          description: '',
          rating: 0,
          reviews: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          featured: false,
          location: 'Unknown',
          cuisine: 'Unknown',
        };
      }
    });
  };
  
  const convertToTableGridRestaurant = (apiRestaurant: ApiRestaurant): Restaurant => ({
    _id: apiRestaurant._id,
    name: apiRestaurant.name || apiRestaurant.businessName || 'Unknown Restaurant',
    image: apiRestaurant.profileImages?.[0] || apiRestaurant.image || '/placeholder.jpg',
    profileImages: Array.isArray(apiRestaurant.profileImages) 
      ? apiRestaurant.profileImages.map(img => ({ url: String(img) }))
      : [],
    rating: apiRestaurant.rating || 4.5,
    reviews: apiRestaurant.reviews?.length || 0,
    cuisine: apiRestaurant.cuisine || apiRestaurant.businessType || 'Various',
    location: apiRestaurant.location || apiRestaurant.address || 'Location Unknown',
    badge: apiRestaurant.featured ? 'Featured' : undefined
  });

  if (!mounted) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-700"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="relative min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-br-[20px] rounded-bl-[20px]"
          style={{
            backgroundImage: activeTab === "restaurants" ? "url('/find.png')" : "url('/find-hotel.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/70 rounded-br-[20px] rounded-bl-[20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 min-h-[400px] justify-center items-center sm:px-6 lg:px-8 py-20">
          <div className="text-center mt-16">
            {activeTab === "restaurants" ? (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Find your Perfect Table
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Discover and reserve the best restaurants in your city
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Start Living Your Dream
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Discover and reserve the best hotels in your city
                </p>
              </>
            )}

            <div className="flex justify-center items-center gap-4">
              {tabs.map((tab) => (
                <button 
                  key={tab.value} 
                  className={`px-4 py-2 rounded-[36px] cursor-pointer text-sm font-medium leading-none transition-colors duration-200 ${
                    activeTab === tab.value 
                      ? "bg-slate-200 text-gray-900" 
                      : "bg-transparent text-gray-50 hover:bg-white/10"
                  }`} 
                  onClick={() => handleTabChange(tab.value)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            
            <div className="relative">
              <SearchSection activeTab={activeTab} />
            </div>
          </div>
        </div>
      </div>

      {activeTab === "restaurants" ? (
        <div className="max-w-7xl mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
         
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
              <span className="ml-2 text-gray-600">Loading restaurants...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 font-medium">Error loading restaurants</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : vendors.length > 0 ? (
            <TableGrid 
              title='Top Rated Restaurants' 
              restaurants={vendors.map(vendor => convertToTableGridRestaurant(convertVendorsToRestaurants([vendor])[0]))} 
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No restaurants found</p>
            </div>
          )}

          <TableGrid title="Popular Searches" />
          <TableGrid title="In High Demand" />
          <TableGrid title="Your History" />
        </div>
      ) : (
        <div className="max-w-7xl mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TableGridTwo title="Popular Guest House Searches" />
        </div>
      )}
    </main>
  );
}