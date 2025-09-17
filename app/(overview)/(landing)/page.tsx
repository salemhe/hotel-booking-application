"use client";
import React, { useEffect, useState } from "react";
import { VendorService, Vendor } from "@/services/vendors";
import SearchSection from "@/components/SearchSection";
import TableGrid, { TableGridTwo, Restaurant, TableGridThree } from "@/components/TableGrid";
import { useRouter } from "next/navigation";

interface ApiRestaurant {
  _id: string;
  name: string;
  cuisine: string;
  badge?: string;
  id?: number;
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
  const router = useRouter();

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
        console.error("Error fetching vendors:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch vendors"
        );
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
  };

  // Convert vendors to restaurant format with better error handling
  const convertVendorsToRestaurants = (vendors: Vendor[]): ApiRestaurant[] => {
    return vendors.map((vendor, index) => {
      try {
        // Ensure profileImages are valid URLs or relative paths
        const sanitizedProfileImages =
          vendor.profileImages?.map((imgOrString) => {
            // if it's a string, use it; otherwise assume it's { url: string }
            const url =
              typeof imgOrString === "string"
                ? imgOrString
                : (imgOrString as { url?: string }).url || "";

            // only accept http or /-prefixed URLs
            return url.startsWith("http") || url.startsWith("/")
              ? url
              : "/placeholder.jpg";
          }) || [];

        // Ensure main image is a valid URL or relative path
        const mainImage =
          sanitizedProfileImages[0] ||
          (typeof vendor.image === "string" &&
          (vendor.image.startsWith("http") || vendor.image.startsWith("/"))
            ? vendor.image
            : "/placeholder.jpg");

        return {
          _id: vendor._id || `vendor-${index + 1}`,
          name: vendor.businessName || "Unknown Business",
          businessName: vendor.businessName || "Unknown Business",
          businessType: vendor.businessType || "Various",
          vendorType: vendor.vendorType || "Various",
          branch: vendor.branch || "",
          address: vendor.address || "",
          email: vendor.email || "",
          phone: vendor.phone || "",
          services: vendor.services || [],
          image: mainImage,
          profileImages: sanitizedProfileImages,
          description: vendor.description || "",
          rating: typeof vendor.rating === "number" ? vendor.rating : 4.5,
          reviews: vendor.reviews || [],
          createdAt: vendor.createdAt || new Date().toISOString(),
          updatedAt: vendor.updatedAt || new Date().toISOString(),
          featured: vendor.featured || false,
          location: vendor.address || "Location not specified",
          cuisine: vendor.businessType || "Various",
        };
      } catch (error) {
        console.error("Error converting vendor to restaurant:", vendor, error);
        return {
          _id: String(index + 1),
          name: "Error loading restaurant",
          businessName: "Error loading restaurant",
          businessType: "Unknown",
          branch: "",
          address: "Unknown",
          email: "",
          phone: "",
          services: [],
          image: "/placeholder.jpg",
          profileImages: [],
          description: "",
          rating: 0,
          reviews: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          featured: false,
          location: "Unknown",
          cuisine: "Unknown",
        };
      }
    });
  };

  const convertToTableGridRestaurant = (
    apiRestaurant: ApiRestaurant
  ): Restaurant => {
    return {
      _id: apiRestaurant._id,
      name:
        apiRestaurant.name ||
        apiRestaurant.businessName ||
        "Unknown Restaurant",
      image: apiRestaurant.image || "/placeholder.jpg",
      profileImages: apiRestaurant?.profileImages?.map((img) => ({
        url:
          typeof img === "string" &&
          (img.startsWith("http") || img.startsWith("/"))
            ? img
            : "/placeholder.jpg",
      })),
      rating: apiRestaurant.rating || 4.5,
      reviews: apiRestaurant.reviews?.length || 0,
      cuisine: apiRestaurant.cuisine || apiRestaurant.businessType || "Various",
      location:
        apiRestaurant.location || apiRestaurant.address || "Location Unknown",
      badge: apiRestaurant.featured ? "Featured" : undefined,
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
        fill={activeTab === "hotels" ? "#111827" : "#ffffff"}
        fillRule="evenodd"
        d="M7.96.83a1.67 1.67 0 0 0-1.384.153l-3.433 2.06a1.67 1.67 0 0 0-.81 1.429v11.195H1.5a.833.833 0 0 0 0 1.666h15a.833.833 0 1 0 0-1.666h-.833V4.6a1.67 1.67 0 0 0-1.14-1.58zM14 15.668V4.6L8.167 2.657v13.01zM6.5 2.972 4 4.472v11.195h2.5z"
        clipRule="evenodd"
      ></path>
    </svg>
  );

  const SvgIcon3: React.FC<{ activeTab: string }> = ({ activeTab }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      viewBox="0 0 18 18"
    >
      <path
        fill={activeTab === "clubs" ? "#111827" : "#ffffff"}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.3333 1.3335C11.8638 1.3335 12.3725 1.54421 12.7476 1.91928C13.1226 2.29436 13.3333 2.80306 13.3333 3.3335V12.6668C13.3333 13.1973 13.1226 13.706 12.7476 14.081C12.3725 14.4561 11.8638 14.6668 11.3333 14.6668H4.66667C4.13624 14.6668 3.62753 14.4561 3.25246 14.081C2.87739 13.706 2.66667 13.1973 2.66667 12.6668V3.3335C2.66667 2.80306 2.87739 2.29436 3.25246 1.91928C3.62753 1.54421 4.13624 1.3335 4.66667 1.3335H11.3333ZM11.3333 2.66683H4.66667C4.48986 2.66683 4.32029 2.73707 4.19527 2.86209C4.07024 2.98712 4.00001 3.15668 4.00001 3.3335V12.6668C4.00001 12.8436 4.07024 13.0132 4.19527 13.1382C4.32029 13.2633 4.48986 13.3335 4.66667 13.3335H11.3333C11.5101 13.3335 11.6797 13.2633 11.8047 13.1382C11.9298 13.0132 12 12.8436 12 12.6668V3.3335C12 3.15668 11.9298 2.98712 11.8047 2.86209C11.6797 2.73707 11.5101 2.66683 11.3333 2.66683ZM8 6.66683C8.70725 6.66683 9.38553 6.94778 9.88562 7.44788C10.3857 7.94797 10.6667 8.62625 10.6667 9.3335C10.6667 10.0407 10.3857 10.719 9.88562 11.2191C9.38553 11.7192 8.70725 12.0002 8 12.0002C7.29276 12.0002 6.61448 11.7192 6.11439 11.2191C5.61429 10.719 5.33334 10.0407 5.33334 9.3335C5.33334 8.62625 5.61429 7.94797 6.11439 7.44788C6.61448 6.94778 7.29276 6.66683 8 6.66683ZM8 8.00016C7.64638 8.00016 7.30724 8.14064 7.0572 8.39069C6.80715 8.64074 6.66667 8.97987 6.66667 9.3335C6.66667 9.68712 6.80715 10.0263 7.0572 10.2763C7.30724 10.5264 7.64638 10.6668 8 10.6668C8.35363 10.6668 8.69277 10.5264 8.94281 10.2763C9.19286 10.0263 9.33334 9.68712 9.33334 9.3335C9.33334 8.97987 9.19286 8.64074 8.94281 8.39069C8.69277 8.14064 8.35363 8.00016 8 8.00016ZM8 4.00016C8.26522 4.00016 8.51958 4.10552 8.70711 4.29306C8.89465 4.48059 9 4.73495 9 5.00016C9 5.26538 8.89465 5.51973 8.70711 5.70727C8.51958 5.89481 8.26522 6.00016 8 6.00016C7.73479 6.00016 7.48043 5.89481 7.2929 5.70727C7.10536 5.51973 7 5.26538 7 5.00016C7 4.73495 7.10536 4.48059 7.2929 4.29306C7.48043 4.10552 7.73479 4.00016 8 4.00016Z"
      />
    </svg>
  );

  const tabs = [
    {
      name: "Restaurants",
      value: "restaurants",
      img: <SvgIcon activeTab={activeTab} />,
    },
    {
      name: "Hotels",
      value: "hotels",
      img: <SvgIcon2 activeTab={activeTab} />,
    },
    {
      name: "Clubs",
      value: "clubs",
      img: <SvgIcon3 activeTab={activeTab} />,
    },
  ];

  const handleSearch = (searchData: {
    query: string;
    tab: string;
    date?: string;
    time?: string;
    guests?: string;
    timestamp: string;
  }) => {
    if (!searchData.query.trim()) return;
    localStorage.setItem("searchData", JSON.stringify(searchData));
    if (typeof window !== "undefined") {
      window.location.href = `/search`;
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="relative min-h-[400px] mb-[200px] lg:mb-0 ">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-br-[20px] rounded-bl-[20px]"
          style={{
            backgroundImage:
              activeTab === "restaurants"
                ? "url('/find.png')"
                : activeTab === "hotels" 
                ? "url('/find-hotel.jpg')"
                : "url('/find-club.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/70 rounded-br-[20px] rounded-bl-[20px]"></div>
        <div className="relative max-w-7xl mx-auto px-2 md:px-4 min-h-[400px] justify-center items-center lg:px-8 py-20">
          <div className="text-center mt-16">
            {activeTab === "restaurants" ? (
              <>
                <h1 className="text-[22px] md:text-5xl font-bold text-white mb-4">
                  Find your Perfect Table
                </h1>
                <p className="text-xs md:text-xl text-white/90 mb-8">
                  Discover and reserve the best restaurants in your city
                </p>
              </>
            ) : activeTab === "hotels" ? (
              <>
                <h1 className="text-[22px] md:text-5xl font-bold text-white mb-4">
                  Start Living Your Dream
                </h1>
                <p className="text-xs md:text-xl text-white/90 mb-8">
                  Discover and reserve the best hotels in your city
                </p>
              </>
            ) : (
              <>
                <h1 className="text-[22px] md:text-5xl font-bold text-white mb-4">
                  Get Your Groove On
                </h1>
                <p className="text-xs md:text-xl text-white/90 mb-8">
                  Discover and reserve the best clubs in your city
                </p>
              </>
            )}

            <div className="flex justify-center items-center">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  className={`px-4 py-2 rounded-[36px] gap-2.5 cursor-pointer items-center text-xs md:text-sm flex font-medium leading-none transition-colors duration-200 ${
                    activeTab === tab.value
                      ? "bg-slate-200 text-gray-900"
                      : "bg-transparent text-gray-50 hover:bg-white/10"
                  }`}
                  onClick={() => handleTabChange(tab.value)}
                >
                  <figure className="size-[16px]">{tab.img}</figure>{" "}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <SearchSection activeTab={activeTab} onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>

      {/* stop */}
      {activeTab === "restaurants" ? (
        <div className="max-w-7xl lg:mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700"></div>
              <span className="ml-2 text-gray-600">Loading restaurants...</span>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-600 font-medium">
                Error loading restaurants
              </p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
              <button
                onClick={() => router.refresh()}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : vendors.filter(
              (v) => v.businessType?.toLowerCase() === "restaurant"
            ).length > 0 ? (
            <TableGrid
              title="Top Rated Restaurants"
              restaurants={vendors
                .filter(
                  (v) =>
                    v.onboarded === true &&
                    v.businessType?.toLowerCase() === "restaurant"
                )
                .map((vendor) =>
                  convertToTableGridRestaurant(
                    convertVendorsToRestaurants([vendor])[0]
                  )
                )}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No restaurants found</p>
            </div>
          )}

          {/* <TableGrid title="Popular Searches" />
          <TableGrid title="In High Demand" />
          <TableGrid title="Your History" /> */}
        </div>
      ) : activeTab === "hotels" ? (
        <div className="max-w-7xl mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {vendors.filter(
            (v) =>
              v.onboarded === true && v.vendorType?.toLowerCase() === "hotel"
          ).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No hotels found</p>
            </div>
          ) : (
            <TableGridTwo
              title="Popular Guest House Searches"
              restaurants={vendors
                .filter(
                  (v) =>
                    v.onboarded === true &&
                    v.vendorType?.toLowerCase() === "hotel"
                )
                .map((vendor) =>
                  convertToTableGridRestaurant(
                    convertVendorsToRestaurants([vendor])[0]
                  )
                )}
            />
          )}
        </div>
      ) : (
        <div className="max-w-7xl mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {vendors.filter(
            (v) =>
              v.onboarded === true && v.vendorType?.toLowerCase() === "club"
          ).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No clubs found</p>
            </div>
          ) : (
            <TableGridThree
              title="Open now"
              restaurants={vendors
                .filter(
                  (v) =>
                    v.onboarded === true &&
                    v.vendorType?.toLowerCase() === "club"
                )
                .map((vendor) =>
                  convertToTableGridRestaurant(
                    convertVendorsToRestaurants([vendor])[0]
                  )
                )}
            />
          )}
        </div>

      )}
    </main>
  );
}
