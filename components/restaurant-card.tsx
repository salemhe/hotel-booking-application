"use client"

import { useState } from "react"
import { Star, MapPin, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Helper function to format price
const formatPrice = (price: number) => {
  if (price < 5000) return "$"
  if (price < 10000) return "$$"
  if (price < 20000) return "$$$"
  return "$$$$"
}

interface menuType {
  price: number
  dishName: string
  description: string
}

export interface RestaurantType {
  _id: string
  menus: menuType[]
  profileImage: string
  services: string[]
  businessName: string
  address: string
  rating: number
  createdAt: string
}

interface RestaurantCardProps {
  restaurant: RestaurantType
  isFavorite: boolean
  onFavoriteToggle: () => void
}

export default function RestaurantCard({ restaurant, isFavorite, onFavoriteToggle }: RestaurantCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get the first menu item for price display
  const firstMenuItem = restaurant.menus?.[0]

  // Check if restaurant is open (in a real app, this would use actual opening hours)
  const isOpen = true

  // Calculate average price from menus
  const averagePrice = restaurant.menus?.length
    ? restaurant.menus.reduce((sum: number, menu: menuType) => sum + menu.price, 0) / restaurant.menus.length
    : 0

  // Format price range
  const priceRange = formatPrice(averagePrice)

  // Mock rating (in a real app, this would come from the API)
  const rating = 4.5
  const reviewCount = 42

  return (
    <Link href={`/userDashboard/search/${restaurant._id}`}
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200",
        isHovered && "shadow-lg transform -translate-y-1",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div
          className="h-48 bg-gray-200 bg-cover bg-center"
          style={{
            backgroundImage: restaurant.profileImage
              ? `url(${restaurant.profileImage})`
              : `url("/dan-gold.jpg")`,
          }}
        ></div>

        {/* Favorite button */}
        <button
          className={cn(
            "absolute top-2 right-2 p-2 rounded-full",
            isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-600",
          )}
          onClick={(e) => {
            e.stopPropagation()
            onFavoriteToggle()
          }}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>

        {/* Tags/badges */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {isOpen && <Badge className="bg-green-500 hover:bg-green-600">Open Now</Badge>}
          {restaurant.services?.map((service: string) => (
            <Badge key={service} variant="outline" className="bg-white/80">
              {service}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg truncate">{restaurant.businessName}</h3>
          <span className="text-gray-600 font-medium">{priceRange}</span>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium ml-1">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">({reviewCount})</span>
          <span className="mx-1">•</span>
          <span className="text-sm text-gray-500 truncate">{restaurant.services?.join(", ")}</span>
        </div>

        <div className="flex items-start gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{restaurant.address}</span>
        </div>

        {firstMenuItem && (
          <div className="text-sm text-gray-600 line-clamp-2">
            <span className="font-medium">Featured: </span>
            {firstMenuItem.dishName} - {firstMenuItem.description}
          </div>
        )}
      </div>
    </Link>
  )
}
