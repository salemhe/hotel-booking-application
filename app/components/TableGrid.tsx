import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { FiStar, FiHeart, FiChevronRight, FiChevronsDown } from "react-icons/fi";
// import rest from "@/public/restaurant.jpg";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export interface Restaurant {
  _id?: string;
  id?: number;
  name: string;
  image?: string;
  profileImages?: { url: string }[];
  rating?: number;
  reviews?: number;
  cuisine?: string;
  location?: string;
  badge?: string;
  price?: number;
  
  discount?: number;
}

interface Hotel {
  _id?: string;
  id?: number;
  name: string;
  image?: string;
  rating?: number;
  reviews?: number;
  price?: number;
  cuisine?: string;
  location?: string;
  badge?: string;
  discount?: number;
  
  profileImages?: { url: string }[];
}

interface TableGridProps {
  title: string;
  activeTab?: string;
  restaurants?: Restaurant[];
}

const DUMMY_DATA: Restaurant[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Kapaddocia",
  image: "/restaurant.jpg",
  rating: 4.8,
  reviews: 1000,
  cuisine: "International, Turkish, Contemporary",
  location: "Lagos, Ikeja",
  badge: i % 2 === 0 ? "Guest's Recommended" : undefined,
}));

const DUMMY_HOTEL_DATA: Hotel[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  name: "Kapaddocia",
  image: "/restaurant.jpg",
  rating: 4.8,
  reviews: 1000,
  cuisine: "International, Turkish, Contemporary",
  location: "Lagos, Ikeja",
  badge: i % 2 === 0 ? "Guest's Recommended" : undefined,
  price: 1000,
  discount: 10,
}));

const TableGrid = ({ title, restaurants = DUMMY_DATA }: TableGridProps) => {
  const [currentIndices, setCurrentIndices] = useState<{ [key: string]: number }>({});
  const [resetTimeouts, setResetTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});
  const [isHovering, setIsHovering] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const getImagesForRestaurant = (restaurant: Restaurant) => {
    if (restaurant?.profileImages && restaurant?.profileImages?.length > 1) {
      return restaurant?.profileImages?.map(image => image.url);
    }
    // Only return single image if there's only one or no profile images
    return restaurant.image ? [restaurant.image] : ['/placeholder.jpg'];
  };

  const hasMultipleImages = useCallback((restaurant: Restaurant) => {
    const images = getImagesForRestaurant(restaurant);
    return images.length > 1;
  }, []);

  const handleMouseEnter = (restaurantId: string) => {
    const restaurant = restaurants.find(r => (r._id || String(r.id)) === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: true }));
    
    if (resetTimeouts[restaurantId]) {
      clearTimeout(resetTimeouts[restaurantId]);
      setResetTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[restaurantId];
        return newTimeouts;
      });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, restaurantId: string) => {
    const restaurant = restaurants.find(r => (r._id || String(r.id)) === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const xPercent = (x / rect.width) * 100;
    const images = getImagesForRestaurant(restaurant);
    const imageIndex = Math.min(Math.max(Math.floor(xPercent / (100 / images.length)), 0), images.length - 1);
    
    setCurrentIndices(prev => ({
      ...prev,
      [restaurantId]: imageIndex
    }));
  }, [restaurants, hasMultipleImages]);

  const handleMouseLeave = useCallback((restaurantId: string) => {
    const restaurant = restaurants.find(r => (r._id || String(r.id)) === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: false }));

    const timeout = setTimeout(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [restaurantId]: 0
      }));
    }, 300); // Reduced timeout for smoother experience

    setResetTimeouts(prev => ({
      ...prev,
      [restaurantId]: timeout
    }));
  }, [restaurants, hasMultipleImages]);

  useEffect(() => {
    return () => {
      Object.values(resetTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [resetTimeouts]);
  return (
    <div className="mb-[92px]">
      <Button variant="outline" className="flex justify-between items-center mb-6 text-gray-900 text-sm font-medium leading-none">
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1" />
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const restaurantId = restaurant._id || String(restaurant.id);
          const currentIndex = currentIndices[restaurantId] || 0;
          const multipleImages = hasMultipleImages(restaurant);
          const hovering = isHovering[restaurantId];

          console.log(images, "images");
          return (
            <div
              key={restaurantId}
              onClick={() => {
                router.push(`/restaurants/${restaurant._id}`);
              }}
              className="h-80 px-2 cursor-pointer pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div 
                className={`relative h-52 w-full cursor-pointer`}
                onMouseEnter={() => handleMouseEnter(restaurantId)}
                onMouseMove={multipleImages ? (e) => handleMouseMove(e, restaurantId) : undefined}
                onMouseLeave={() => handleMouseLeave(restaurantId)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className={`absolute transition-all duration-300 ease-out ${
                        multipleImages 
                          ? `will-change-transform ${hovering ? 'brightness-105' : ''}` 
                          : 'hover:scale-105'
                      }`}
                      style={multipleImages ? {
                        transform: `translateX(${(index - currentIndex) * 100}%)`,
                        transition: hovering 
                          ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease'
                          : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease'
                      } : {
                        transition: 'transform 0.3s ease, brightness 0.3s ease'
                      }}
                    />
                  ))}
                  
                  {/* Subtle overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white">
                    {restaurant.badge}
                  </span>
                )}

                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>

                {/* Only show dots if there are multiple images */}
                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`block rounded-full transition-all duration-300 ease-out ${
                          index === currentIndex 
                            ? 'bg-white scale-125 w-6 h-2 shadow-md' 
                            : 'bg-white/70 w-2 h-2 hover:bg-white/90'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Progress bar for active sliding */}
                {/* {multipleImages && hovering && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
                    <div 
                      className="h-full bg-white/80 transition-all duration-200 ease-out"
                      style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                    />
                  </div>
                )} */}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant?.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                  <p className="text-sm text-gray-500">{restaurant.location}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="text-teal-700 mb-6 hover:underline flex items-center justify-center mx-auto transition-colors duration-200">
          <span className="text-sm font-medium">Show more</span>
          <FiChevronsDown className="text-center w-6 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default TableGrid;

export const TableGridTwo = ({ title, restaurants }: { title: string; restaurants: Hotel[] }) => {
  const [currentIndices, setCurrentIndices] = useState<{ [key: number]: number }>({});
  const [resetTimeouts, setResetTimeouts] = useState<{ [key: number]: NodeJS.Timeout }>({});
  const [isHovering, setIsHovering] = useState<{ [key: number]: boolean }>({});
  const router = useRouter();
  
  const getImagesForRestaurant = (restaurant: Restaurant) => {
    if (restaurant?.profileImages && restaurant?.profileImages?.length > 1) {
      return restaurant?.profileImages;
    }
    // Only return single image if there's only one or no profile images
    return restaurant.image ? [restaurant.image] : ['/placeholder.jpg'];
  };

  const hasMultipleImages = useCallback((restaurant: Restaurant) => {
    const images = getImagesForRestaurant(restaurant);
    return images.length > 1;
  }, []);

  const handleMouseEnter = (restaurantId: number) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: true }));
    
    if (resetTimeouts[restaurantId]) {
      clearTimeout(resetTimeouts[restaurantId]);
      setResetTimeouts(prev => {
        const newTimeouts = { ...prev };
        delete newTimeouts[restaurantId];
        return newTimeouts;
      });
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, restaurantId: number) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const xPercent = (x / rect.width) * 100;
    const images = getImagesForRestaurant(restaurant);
    const imageIndex = Math.min(Math.max(Math.floor(xPercent / (100 / images.length)), 0), images.length - 1);
    
    setCurrentIndices(prev => ({
      ...prev,
      [restaurantId]: imageIndex
    }));
  }, [hasMultipleImages]);

  const handleMouseLeave = useCallback((restaurantId: number) => {
    const restaurant = DUMMY_HOTEL_DATA.find(r => r.id === restaurantId);
    if (!restaurant || !hasMultipleImages(restaurant)) return;

    setIsHovering(prev => ({ ...prev, [restaurantId]: false }));

    const timeout = setTimeout(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [restaurantId]: 0
      }));
    }, 300);

    setResetTimeouts(prev => ({
      ...prev,
      [restaurantId]: timeout
    }));
  }, [hasMultipleImages]);

  useEffect(() => {
    return () => {
      Object.values(resetTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [resetTimeouts]);

  return (
    <div className="mb-[92px]">
      <Button variant="outline" className="flex justify-between items-center mb-6 text-gray-900 text-sm font-medium leading-none">
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1" />
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants?.map((restaurant: Hotel) => {
          const images = getImagesForRestaurant(restaurant);
          const currentIndex = currentIndices[restaurant.id || 0];
          const multipleImages = hasMultipleImages(restaurant);
          const hovering = isHovering[restaurant.id || 0];

          return (
            <div
              key={restaurant.id}
              onClick={() => {
                router.push(`/hotels/${restaurant._id}`);
              }}
              className="h-80 px-2 pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div 
                className={`relative h-52 w-full  cursor-pointer`}
                onMouseEnter={() => handleMouseEnter(restaurant.id || 0)}
                onMouseMove={multipleImages ? (e) => handleMouseMove(e, restaurant.id || 0) : undefined}
                onMouseLeave={() => handleMouseLeave(restaurant.id || 0)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      src={typeof image === 'string' ? image : image.url}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className={`absolute transition-all duration-300 ease-out ${
                        multipleImages 
                          ? `will-change-transform ${hovering ? 'brightness-105' : ''}` 
                          : 'hover:scale-105'
                      }`}
                      style={multipleImages ? {
                        transform: `translateX(${(index - currentIndex) * 100}%)`,
                        transition: hovering 
                          ? 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease'
                          : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), brightness 0.3s ease'
                      } : {
                        transition: 'transform 0.3s ease, brightness 0.3s ease'
                      }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                </div>

                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-lg transition-all duration-300 hover:bg-white">
                    {restaurant.badge}
                  </span>
                )}

                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg transition-all duration-300 hover:scale-110 hover:text-red-400 drop-shadow-md">
                  <FiHeart />
                </button>
{/* 
                {multipleImages && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`block rounded-full transition-all duration-300 ease-out ${
                          index === currentIndex 
                            ? 'bg-white scale-125 w-6 h-2 shadow-md' 
                            : 'bg-white/70 w-2 h-2 hover:bg-white/90'
                        }`}
                      />
                    ))}
                  </div>
                )} */}

                {/* {multipleImages && hovering && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-black/20">
                    <div 
                      className="h-full bg-white/80 transition-all duration-200 ease-out"
                      style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                    />
                  </div>
                )} */}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating?.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant.reviews?.toLocaleString()} reviews)
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                  <p className="text-sm text-gray-500">{restaurant.location}</p>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <div className="flex justify-start items-center gap-1">
                      <div className="justify-start text-gray-900 text-sm font-medium font-['Inter'] leading-none">${restaurant.price}</div>
                      <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-none">/night</div>
                    </div>
                    <div className="h-7 px-2 rounded-lg outline-1 outline-offset-[-1px] outline-yellow-500 inline-flex flex-col justify-center items-center gap-2">
                      <div className="inline-flex justify-start items-center gap-1.5">
                        <div className="w-4 h-4 relative overflow-hidden">
                          <div className="w-4 h-4 left-0 top-0 absolute">
                            <Image 
                              width={100}
                              height={100} src="/sale_fill.svg" alt="discount"
                             />
                                  </div>
                        </div>
                        <div className="justify-start text-gray-900 text-xs font-medium font-['Inter'] leading-none tracking-tight">{restaurant.discount}% off</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button className="text-teal-700 mb-6 hover:underline flex items-center justify-center mx-auto transition-colors duration-200">
          <span className="text-sm font-medium">Show more</span>
          <FiChevronsDown className="text-center w-6 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};
