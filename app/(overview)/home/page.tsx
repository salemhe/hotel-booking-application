"use client"
import React, { useEffect, useState } from 'react';
import { VendorService, Vendor } from '@/app/lib/api/services/vendors';
import  SearchSection  from "@/app/components/SearchSection";
import TableGrid, { TableGridTwo } from "@/app/components/TableGrid";

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

export default function Home() {
  const [activeTab, setActiveTab] = useState("restaurants");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      try {
        const data = await VendorService.getVendors();
        setVendors(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  }

  useEffect(() => {
    const tab = localStorage.getItem("activeTab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-white">
      <div className="relative min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-br-[20px] rounded-bl-[20px]"
          style={{
            backgroundImage: activeTab === "restaurants" ? "url('/find.png')" : "url('/find-hotel.jpg')",
          }}
        />
        <div className="absolute  bg-black/70 rounded-br-[20px] rounded-bl-[20px] "></div>
        <div className="relative max-w-7xl mx-auto px-4 min-h-[400px] justify-center items-center  sm:px-6 lg:px-8 py-20">
          <div className="text-center mt-16">
            {
              activeTab === "restaurants" ? (
                <><h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
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
              )
            }

            <div className="flex justify-center items-center gap-4">
              {tabs.map((tab) => (
                <button key={tab.value} className={`px-4 py-2 rounded-[36px] cursor-pointer text-sm  font-medium leading-none ${activeTab === tab.value ? "bg-slate-200  text-gray-900" : "bg-transparent  text-gray-50 "}`} onClick={() => handleTabChange(tab.value)}>
                  {tab.name}
                </button>
              ))}
            </div>
            
            {/* Search Form */}
            <div className=" relative">
              <SearchSection activeTab={activeTab} />
            </div>
          </div>
        </div>
      </div>
 {
  activeTab === "restaurants" ? (
    <div className="max-w-7xl mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <TableGrid title="Popular Searches" />
    <TableGrid title="In High Demand" />
    <TableGrid title="You History" />
    {isLoading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>Error loading vendors</div>
    ) : (
      <TableGrid title='Top Rated Restaurants' restaurants={vendors.map(vendor => ({
        id: parseInt(vendor.id),
        name: vendor.businessName,
        image: "/placeholder.jpg", // Add default image
        rating: 4.5, // Add default rating
        cuisine: vendor.businessType,
        priceRange: "$$",
        location: vendor.address
      }))} />
    )}
  </div>
 ) : (
  <div className="max-w-7xl mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <TableGridTwo title="Popular guest house Searches" />
  </div>
 )
}
      
    </main>
  );
}