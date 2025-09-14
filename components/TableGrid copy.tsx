import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { FiStar, FiHeart, FiChevronRight, FiChevronsDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  cuisine: string;
  location: string;
  badge?: string;
}

  interface Hotel {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  cuisine: string;
  location: string;
  badge?: string;
  discount: number;
}

interface TableGridProps {
  title: string;
  activeTab?: string;
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

const TableGrid = ({ title }: TableGridProps) => {
  const [currentIndices, setCurrentIndices] = useState<{ [key: number]: number }>({});
  const [resetTimeouts, setResetTimeouts] = useState<{ [key: number]: NodeJS.Timeout }>({});

  const getImagesForRestaurant = (restaurant: Restaurant) => {
    return Array(4).fill(restaurant.image);
  };

  const handleMouseEnter = (restaurantId: number) => {
    // Clear any existing reset timeout for this card
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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const xPercent = (x / rect.width) * 100;
    const imageIndex = Math.min(Math.max(Math.floor(xPercent / 25), 0), 3);
    
    setCurrentIndices(prev => ({
      ...prev,
      [restaurantId]: imageIndex
    }));
  }, []);

  const handleMouseLeave = useCallback((restaurantId: number) => {
    // Set a timeout to reset the index after 800ms
    const timeout = setTimeout(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [restaurantId]: 0
      }));
    }, 800);

    setResetTimeouts(prev => ({
      ...prev,
      [restaurantId]: timeout
    }));
  }, []);

  // Cleanup timeouts on unmount
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
        {DUMMY_DATA.map((restaurant) => {
          const images = getImagesForRestaurant(restaurant);
          const currentIndex = currentIndices[restaurant.id] || 0;

          return (
            <div
              key={restaurant.id}
              className="h-80 px-2 pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* image + overlays */}
              <div 
                className="relative h-52 w-full"
                onMouseEnter={() => handleMouseEnter(restaurant.id)}
                onMouseMove={(e) => handleMouseMove(e, restaurant.id)}
                onMouseLeave={() => handleMouseLeave(restaurant.id)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className="absolute will-change-transform"
                      style={{
                        transform: `translateX(${(index - currentIndex) * 100}%)`,
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  ))}
                </div>

                {/* badge */}
                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-md transition-all duration-300">
                    {restaurant.badge}
                  </span>
                )}

                {/* favorite heart */}
                <button className="absolute top-2 right-2 text-white text-lg transition-transform duration-300 hover:scale-110">
                  <FiHeart />
                </button>

                {/* right arrow */}
                {/* <button className="absolute right-2 bottom-2 bg-black bg-opacity-30 p-1 rounded-full text-white transition-all duration-300 hover:bg-opacity-50">
                  <FiChevronRight />
                </button> */}

                {/* dots */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`block w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                        index === currentIndex 
                          ? 'bg-white scale-125 w-6 h-2' 
                          : 'bg-white opacity-50 scale-100 w-2 h-2'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* footer */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant.reviews.toLocaleString()} reviews)
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

      {/* "Show more" trigger */}
      <div className="mt-6  text-center">
        <button className="text-teal-700 mb-6 hover:underline flex items-center justify-center mx-auto">
          <span className=" text-sm font-medium">Show mores</span>
           <FiChevronsDown className="text-center w-6 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TableGrid;


export const TableGridTwo = ({ title }: TableGridProps) => {
  const [currentIndices, setCurrentIndices] = useState<{ [key: number]: number }>({});
  const [resetTimeouts, setResetTimeouts] = useState<{ [key: number]: NodeJS.Timeout }>({});

  const getImagesForRestaurant = (restaurant: Restaurant) => {
    return Array(4).fill(restaurant.image);
  };

  const handleMouseEnter = (restaurantId: number) => {
    // Clear any existing reset timeout for this card
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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const xPercent = (x / rect.width) * 100;
    const imageIndex = Math.min(Math.max(Math.floor(xPercent / 25), 0), 3);
    
    setCurrentIndices(prev => ({
      ...prev,
      [restaurantId]: imageIndex
    }));
  }, []);

  const handleMouseLeave = useCallback((restaurantId: number) => {
    // Set a timeout to reset the index after 800ms
    const timeout = setTimeout(() => {
      setCurrentIndices(prev => ({
        ...prev,
        [restaurantId]: 0
      }));
    }, 800);

    setResetTimeouts(prev => ({
      ...prev,
      [restaurantId]: timeout
    }));
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(resetTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [resetTimeouts]);

  if  (!DUMMY_HOTEL_DATA || DUMMY_HOTEL_DATA.length === 0) {
    return <div className="text-center text-gray-500">No hotels available</div>;
  }

  return (
    <div className="mb-[92px]">
      <Button variant="outline" className="flex justify-between items-center mb-6 text-gray-900 text-sm font-medium leading-none">
        <h2 className="">{title}</h2>
        <FiChevronRight className="ml-1" />
      </Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {DUMMY_HOTEL_DATA.map((restaurant: Hotel) => {
          const images = getImagesForRestaurant(restaurant);
          const currentIndex = currentIndices[restaurant.id] || 0;

          return (
            <div
              key={restaurant.id}
              className="h-80 px-2 pt-2 pb-4 flex flex-col bg-white rounded-[20px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* image + overlays */}
              <div 
                className="relative h-52 w-full"
                onMouseEnter={() => handleMouseEnter(restaurant.id)}
                onMouseMove={(e) => handleMouseMove(e, restaurant.id)}
                onMouseLeave={() => handleMouseLeave(restaurant.id)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={restaurant.name}
                      layout="fill"
                      objectFit="cover"
                      className="absolute will-change-transform"
                      style={{
                        transform: `translateX(${(index - currentIndex) * 100}%)`,
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  ))}
                </div>

                {/* badge */}
                {restaurant.badge && (
                  <span className="absolute top-2 left-2 bg-white px-3 py-1 text-xs font-medium text-gray-800 rounded-full shadow-md transition-all duration-300">
                    {restaurant.badge}
                  </span>
                )}

                {/* favorite heart */}
                <button className="absolute top-2 right-2 text-white cursor-pointer text-lg transition-transform duration-300 hover:scale-110">
                  <FiHeart />
                </button>

                {/* right arrow */}
                {/* <button className="absolute right-2 bottom-2 bg-black bg-opacity-30 p-1 rounded-full text-white transition-all duration-300 hover:bg-opacity-50">
                  <FiChevronRight />
                </button> */}

                {/* dots */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`block w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                        index === currentIndex 
                          ? 'bg-white scale-125 w-6 h-2' 
                          : 'bg-white opacity-50 scale-100 w-2 h-2'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* footer */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-1">
                    <FiStar className="text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      ({restaurant.reviews.toLocaleString()} reviews)
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
                <div className="mt-2 ">
                 
                  <div className=" flex justify-between items-center">
    <div className="flex justify-start items-center gap-1">
        <div className="justify-start text-gray-900 text-sm font-medium font-['Inter'] leading-none">${restaurant.price}</div>
        <div className="justify-start text-zinc-600 text-xs font-normal font-['Inter'] leading-none">/night</div>
    </div>
    <div className="h-7 px-2 rounded-lg  outline-1 outline-offset-[-1px] outline-yellow-500 inline-flex flex-col justify-center items-center gap-2">
        <div className="inline-flex justify-start items-center gap-1.5">
            <div className="w-4 h-4 relative overflow-hidden">
                <div className="w-4 h-4 left-0 top-0 absolute" >
                  <Image src="/sale_fill.svg" alt="discount" />
                </div>
                {/* <div className="w-3.5 h-3.5 left-[1.29px] top-[1.29px] absolute bg-yellow-500" /> */}
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

      {/* "Show more" trigger */}
      <div className="mt-6  text-center">
        <button className="text-teal-700 mb-6 hover:underline flex items-center justify-center mx-auto">
          <span className=" text-sm font-medium">Show mores</span>
           <FiChevronsDown className="text-center w-6 h-5" />
        </button>
      </div>
    </div>
  );
};


