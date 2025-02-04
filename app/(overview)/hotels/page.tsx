"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

const hotels = [
  {
    id: 1,
    name: "Luxury Resort & Spa",
    type: "Resort",
    rating: 4.8,
    price: "$$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "City Center Hotel",
    type: "Business",
    rating: 4.5,
    price: "$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Beachfront Paradise",
    type: "Resort",
    rating: 4.7,
    price: "$$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Mountain View Lodge",
    type: "Lodge",
    rating: 4.6,
    price: "$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Boutique Downtown Inn",
    type: "Boutique",
    rating: 4.4,
    price: "$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    name: "Family-Friendly Suites",
    type: "Suites",
    rating: 4.3,
    price: "$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    name: "Historic Grand Hotel",
    type: "Luxury",
    rating: 4.9,
    price: "$$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    name: "Eco-Friendly Retreat",
    type: "Eco",
    rating: 4.6,
    price: "$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 9,
    name: "Skyline Penthouse Apartments",
    type: "Apartments",
    rating: 4.7,
    price: "$$$",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 10,
    name: "Cozy Bed & Breakfast",
    type: "B&B",
    rating: 4.5,
    price: "$",
    image: "/placeholder.svg?height=200&width=300",
  },
]

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default function HotelsPage() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense fallback={<Loading />}>
      <Hotels />
    </Suspense>
  )
}

function Hotels() {
  const [filteredHotels, setFilteredHotels] = useState(hotels)
  const [currentPage, setCurrentPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<string[]>([])
  const [ratingFilter, setRatingFilter] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  const itemsPerPage = 6
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage)

  const types = Array.from(new Set(hotels.map((h) => h.type)))
  const prices = Array.from(new Set(hotels.map((h) => h.price)))

  useEffect(() => {
    applyFilters()
  }, [typeFilter, priceFilter, ratingFilter, searchQuery]) //Corrected dependency

  const applyFilters = () => {
    let filtered = hotels
    if (typeFilter.length > 0) {
      filtered = filtered.filter((hotel) => typeFilter.includes(hotel.type))
    }
    if (priceFilter.length > 0) {
      filtered = filtered.filter((hotel) => priceFilter.includes(hotel.price))
    }
    if (ratingFilter > 0) {
      filtered = filtered.filter((hotel) => hotel.rating >= ratingFilter)
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
    setFilteredHotels(filtered)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setTypeFilter([])
    setPriceFilter([])
    setRatingFilter(0)
    setSearchQuery("")
    setFilteredHotels(hotels)
    setCurrentPage(1)
  }

  const paginatedHotels = filteredHotels.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleTypeChange = (type: string) => {
    setTypeFilter((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handlePriceChange = (price: string) => {
    setPriceFilter((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]))
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find and Book Hotels</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-base">Hotel Type</Label>
                  <div className="mt-2 space-y-2">
                    {types.map((type) => (
                      <div key={type} className="flex items-center">
                        <Checkbox
                          id={`type-${type}`}
                          checked={typeFilter.includes(type)}
                          onCheckedChange={() => handleTypeChange(type)}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-base">Price Range</Label>
                  <div className="mt-2 space-y-2">
                    {prices.map((price) => (
                      <div key={price} className="flex items-center">
                        <Checkbox
                          id={`price-${price}`}
                          checked={priceFilter.includes(price)}
                          onCheckedChange={() => handlePriceChange(price)}
                        />
                        <label
                          htmlFor={`price-${price}`}
                          className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {price}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="rating" className="text-base">
                    Minimum Rating
                  </Label>
                  <Slider
                    id="rating"
                    min={0}
                    max={5}
                    step={0.1}
                    value={[ratingFilter]}
                    onValueChange={(value) => setRatingFilter(value[0])}
                    className="mt-2"
                  />
                  <span className="text-sm text-gray-500">{ratingFilter.toFixed(1)}</span>
                </div>
                <Button onClick={resetFilters} variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {/* Search Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <form className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <Label htmlFor="search" className="sr-only">
                    Search Hotels
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search hotels or types"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </CardContent>
          </Card>

          {/* Hotel Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedHotels.map((hotel) => (
              <Card key={hotel.id}>
                <CardHeader className="p-0">
                  <Image
                    // src={hotel.image || "/placeholder.svg"}
                    src="/hero-bg.jpg"
                    alt={hotel.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle>{hotel.name}</CardTitle>
                  <CardDescription>
                    {hotel.type} • {hotel.price}
                  </CardDescription>
                  <div className="flex items-center mt-2">
                    <Star className="text-yellow-400 mr-1" size={18} /> 
                    <span>{hotel.rating}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button asChild className="w-full">
                    <Link href={`/hotels/${hotel.id}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

