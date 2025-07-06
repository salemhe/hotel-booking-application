"use client"
import React, { useEffect, useState } from 'react';
import { VendorService, Vendor } from '@/app/lib/api/services/vendors';
import SearchSection from "@/app/components/SearchSection";
import TableGrid, { TableGridTwo, Restaurant } from "@/app/components/TableGrid";




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
      console.log('Vendor data:', {
        id: vendor._id,
        profileImages: vendor.profileImages,
        image: vendor.image
      });
      
      try {
        // Ensure profileImages are valid URLs or relative paths
        const sanitizedProfileImages = vendor.profileImages?.map(imgOrString => {
          // if it's a string, use it; otherwise assume it's { url: string }
          const url = typeof imgOrString === 'string'
            ? imgOrString
            : (imgOrString as { url?: string }).url || '';
    
          // only accept http or /-prefixed URLs
          return (url.startsWith('http') || url.startsWith('/'))
            ? url
            : '/placeholder.jpg';
        }) || [];

        // Ensure main image is a valid URL or relative path
        const mainImage = sanitizedProfileImages[0]
        || (typeof vendor.image === 'string' && (vendor.image.startsWith('http') || vendor.image.startsWith('/'))
            ? vendor.image
            : '/placeholder.jpg');

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
          image:           mainImage,
          profileImages:   sanitizedProfileImages,
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
  
  const convertToTableGridRestaurant = (apiRestaurant: ApiRestaurant): Restaurant => {
    console.log('Converting to TableGrid format:', {
      image: apiRestaurant.image,
      profileImages: apiRestaurant.profileImages
    });
    
    return {
      _id: apiRestaurant._id,
      name: apiRestaurant.name || apiRestaurant.businessName || 'Unknown Restaurant',
      image: apiRestaurant.image || '/placeholder.jpg',
      profileImages: apiRestaurant?.profileImages?.map(img => ({ 
        url: typeof img === 'string' && (img.startsWith('http') || img.startsWith('/')) 
          ? img 
          : '/placeholder.jpg'
      })),
      rating: apiRestaurant.rating || 4.5,
      reviews: apiRestaurant.reviews?.length || 0,
      cuisine: apiRestaurant.cuisine || apiRestaurant.businessType || 'Various',
      location: apiRestaurant.location || apiRestaurant.address || 'Location Unknown',
      badge: apiRestaurant.featured ? 'Featured' : undefined
    };
  };

  if (!mounted) {
    return (
      <main className="min-h-screen bg-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-700"></div>
        </div>
      </main>
    );
  }

  const SvgIcon: React.FC<{ activeTab: string }> = ({ activeTab }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        fill={activeTab === "restaurants" ? "#111827" : "#ffffff"}
        fillRule="evenodd"
        d="M5.5 1.333A.833.833 0 0 1 6.333.5h3.334a.833.833 0 0 1 0 1.667h-.834v.862c4.534.409 7.509 5.11 5.775 9.447a.83.83 0 0 1-.775.524H2.167a.83.83 0 0 1-.774-.524c-1.735-4.337 1.24-9.038 5.774-9.447v-.862h-.834a.833.833 0 0 1-.833-.834m2.308 3.334c-3.521 0-5.986 3.377-5.047 6.666h10.478c.94-3.289-1.526-6.666-5.047-6.666zm-7.308 10a.833.833 0 0 1 .833-.834h13.334a.833.833 0 0 1 0 1.667H1.333a.833.833 0 0 1-.833-.833"
        clipRule="evenodd"
      ></path>
    </svg>
  );
  
  const SvgIcon2: React.FC<{ activeTab: string }> = ({ activeTab }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 18 18"
      >
        <path
           fill={activeTab === "restaurants" ? "#ffffff" : "#111827"}
          fillRule="evenodd"
          d="M7.96.83a1.67 1.67 0 0 0-1.384.153l-3.433 2.06a1.67 1.67 0 0 0-.81 1.429v11.195H1.5a.833.833 0 0 0 0 1.666h15a.833.833 0 1 0 0-1.666h-.833V4.6a1.67 1.67 0 0 0-1.14-1.58zM14 15.668V4.6L8.167 2.657v13.01zM6.5 2.972 4 4.472v11.195h2.5z"
          clipRule="evenodd"
        ></path>
      </svg>
    );
    
    
  
  
  const tabs = [
    {
      name: "Restaurants",
      value: "restaurants",
      img: <SvgIcon activeTab={activeTab}/>,
    },
    {
      name: "Hotels", 
      value: "hotels",
      img: <SvgIcon2 activeTab={activeTab}/>,
    },
  ]

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    // Navigate to search page with the query
    const queryParams = new URLSearchParams({
      query: query,
      tab: activeTab
    });
    
    // Use router to navigate to search page
    if (typeof window !== 'undefined') {
      window.location.href = `/search?${queryParams.toString()}`;
    }
  };

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
                  className={`px-4 py-2 rounded-[36px] gap-2.5 cursor-pointer text-sm flex font-medium leading-none transition-colors duration-200 ${
                    activeTab === tab.value 
                      ? "bg-slate-200 text-gray-900" 
                      : "bg-transparent text-gray-50 hover:bg-white/10"
                  }`} 
                  onClick={() => handleTabChange(tab.value)}
                >
                <figure>{tab.img}</figure>  <span>{tab.name}</span> 
                </button>
              ))}
            </div>
            
            <div className="relative">
              <SearchSection activeTab={activeTab} onSearch={handleSearch} />
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
          ) : vendors.filter(v => v.businessType?.toLowerCase() === "restaurant").length > 0 ? (
            <TableGrid 
              title='Top Rated Restaurants' 
              restaurants={vendors
                .filter(vendor => vendor.businessType?.toLowerCase() === "restaurant")
                .map(vendor => convertToTableGridRestaurant(convertVendorsToRestaurants([vendor])[0]))
              } 
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
          <TableGridTwo 
            title="Popular Guest House Searches"
            restaurants={vendors
              .filter(vendor => vendor.businessType?.toLowerCase() === "hotel")
              .map(vendor => convertToTableGridRestaurant(convertVendorsToRestaurants([vendor])[0]))
            }
          />
        </div>
      )}
    </main>
  );
}