"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

// Sample data for filters
const cuisineTypes = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "Japanese",
  "Thai",
  "American",
  "French",
  "Mediterranean",
  "African",
]

const priceRanges = [
  { label: "$", value: "$" },
  { label: "$$", value: "$$" },
  { label: "$$$", value: "$$$" },
  { label: "$$$$", value: "$$$$" },
]

const serviceTypes = ["Delivery", "Dine-In", "Takeout", "Curbside Pickup", "Catering"]

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Halal",
  "Kosher",
  "Dairy-Free",
  "Nut-Free",
  "Organic",
  "Paleo",
  "Keto",
]

interface filters {
  cuisineType: string[]
  priceRange: string[]
  services: string[]
  dietary: string[]
  rating: number
  distance: number
  openNow: boolean
}

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: filters
  onApplyFilters: (filters: filters) => void
}

export default function FilterSidebar({ isOpen, onClose, filters, onApplyFilters }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleCuisineChange = (cuisine: string) => {
    if (localFilters.cuisineType.includes(cuisine)) {
      setLocalFilters({
        ...localFilters,
        cuisineType: localFilters.cuisineType.filter((c: string) => c !== cuisine),
      })
    } else {
      setLocalFilters({
        ...localFilters,
        cuisineType: [...localFilters.cuisineType, cuisine],
      })
    }
  }

  const handlePriceChange = (price: string) => {
    if (localFilters.priceRange.includes(price)) {
      setLocalFilters({
        ...localFilters,
        priceRange: localFilters.priceRange.filter((p: string) => p !== price),
      })
    } else {
      setLocalFilters({
        ...localFilters,
        priceRange: [...localFilters.priceRange, price],
      })
    }
  }

  const handleServiceChange = (service: string) => {
    if (localFilters.services.includes(service)) {
      setLocalFilters({
        ...localFilters,
        services: localFilters.services.filter((s: string) => s !== service),
      })
    } else {
      setLocalFilters({
        ...localFilters,
        services: [...localFilters.services, service],
      })
    }
  }

  const handleDietaryChange = (diet: string) => {
    if (localFilters.dietary.includes(diet)) {
      setLocalFilters({
        ...localFilters,
        dietary: localFilters.dietary.filter((d: string) => d !== diet),
      })
    } else {
      setLocalFilters({
        ...localFilters,
        dietary: [...localFilters.dietary, diet],
      })
    }
  }

  const handleRatingChange = (rating: number) => {
    setLocalFilters({
      ...localFilters,
      rating,
    })
  }

  const handleDistanceChange = (distance: number[]) => {
    setLocalFilters({
      ...localFilters,
      distance: distance[0],
    })
  }

  const handleOpenNowChange = (checked: boolean) => {
    setLocalFilters({
      ...localFilters,
      openNow: checked,
    })
  }

  const resetFilters = () => {
    setLocalFilters({
      cuisineType: [],
      priceRange: [],
      rating: 0,
      distance: 10,
      openNow: false,
      services: [],
      dietary: [],
    })
  }

  const applyFilters = () => {
    onApplyFilters(localFilters)
  }

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 z-50 transition-opacity",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div
        className={cn(
          "absolute top-0 right-0 h-full bg-white w-full max-w-md transform transition-transform overflow-auto",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Cuisine Type */}
          <div>
            <h3 className="font-medium mb-3">Cuisine Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {cuisineTypes.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cuisine-${cuisine}`}
                    checked={localFilters.cuisineType.includes(cuisine)}
                    onCheckedChange={() => handleCuisineChange(cuisine)}
                  />
                  <Label htmlFor={`cuisine-${cuisine}`}>{cuisine}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="flex gap-4">
              {priceRanges.map((price) => (
                <div key={price.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`price-${price.value}`}
                    checked={localFilters.priceRange.includes(price.value)}
                    onCheckedChange={() => handlePriceChange(price.value)}
                  />
                  <Label htmlFor={`price-${price.value}`}>{price.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-medium mb-3">Minimum Rating</h3>
            <RadioGroup
              value={localFilters.rating.toString()}
              onValueChange={(value) => handleRatingChange(Number.parseInt(value))}
              className="flex gap-4"
            >
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                  <Label htmlFor={`rating-${rating}`}>{rating === 0 ? "Any" : `${rating}+`}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Distance */}
          <div>
            <h3 className="font-medium mb-3">Distance (km): {localFilters.distance}</h3>
            <Slider defaultValue={[localFilters.distance]} max={50} step={1} onValueChange={handleDistanceChange} />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Open Now */}
          <div className="flex items-center justify-between">
            <Label htmlFor="open-now">Open Now</Label>
            <Switch id="open-now" checked={localFilters.openNow} onCheckedChange={handleOpenNowChange} />
          </div>

          {/* Services */}
          <div>
            <h3 className="font-medium mb-3">Services</h3>
            <div className="grid grid-cols-2 gap-2">
              {serviceTypes.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${service}`}
                    checked={localFilters.services.includes(service)}
                    onCheckedChange={() => handleServiceChange(service)}
                  />
                  <Label htmlFor={`service-${service}`}>{service}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <h3 className="font-medium mb-3">Dietary Preferences</h3>
            <div className="grid grid-cols-2 gap-2">
              {dietaryOptions.map((diet) => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diet-${diet}`}
                    checked={localFilters.dietary.includes(diet)}
                    onCheckedChange={() => handleDietaryChange(diet)}
                  />
                  <Label htmlFor={`diet-${diet}`}>{diet}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t p-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={resetFilters}>
            Reset All
          </Button>
          <Button className="flex-1" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
