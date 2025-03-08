"use client"

import { useState } from "react"
import { Search, Printer, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { AuthService } from "@/services/auth.services"


export default function BookingList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("all")
  const [tableType, setTableType] = useState("all")
    const authUser = AuthService.getUser();

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter((booking) => {
    if (searchQuery && !booking.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (location !== "all" && booking.location !== location) {
      return false
    }
    if (tableType !== "all" && booking.tableType !== tableType) {
      return false
    }
    return true
  })

  // Handle print functionality
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-900/40">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{authUser?.firstName} {authUser?.lastName}</h1>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              <span className="sr-only">Print</span>
            </Button>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search restaurant"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-zinc-900">
                <SelectValue placeholder="Restaurant Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="victoria-island">Victoria Island</SelectItem>
                <SelectItem value="lekki">Lekki</SelectItem>
                <SelectItem value="ikoyi">Ikoyi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={tableType} onValueChange={setTableType}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-zinc-900">
                <SelectValue placeholder="Table Selection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tables</SelectItem>
                <SelectItem value="2-seats">2 Seats</SelectItem>
                <SelectItem value="4-seats">4 Seats</SelectItem>
                <SelectItem value="6-seats">6 Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Booking List */}
        <main>
          <h2 className="text-xl font-semibold mb-4">Booking List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking, index) => (
              <BookingCard key={index} booking={booking} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

interface Booking {
  name: string;
  location: string;
  image: string;
  dateRange: string;
  seats: number;
  pricePerTable: number;
  totalPayment: number;
  tableType: string;
}

function BookingCard({ booking }: { booking: Booking }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3]">
        <Image src={booking.image || "/placeholder.svg"} alt={booking.name} fill className="object-cover" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium">
          {formatPrice(booking.pricePerTable)} per table
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">{booking.name}</h3>
            <p className="text-sm text-muted-foreground">{booking.location}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{booking.dateRange}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Seats</span>
              <span className="font-medium">{booking.seats} seats</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Payment</span>
              <span className="font-medium">{formatPrice(booking.totalPayment)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Printer className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Booking</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Cancel Booking</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const bookings = [
  {
    name: "Ocean Basket",
    location: "Victoria Island",
    image: "/hero-bg.jpg",
    dateRange: "5th Feb - 10th Feb",
    seats: 2,
    pricePerTable: 80000,
    totalPayment: 80000,
    tableType: "2-seats",
  },
  {
    name: "Velivet Bar & Lounge",
    location: "Victoria Island",
    image: "/hero-bg.jpg",
    dateRange: "5th Mar - 8th Mar",
    seats: 2,
    pricePerTable: 80000,
    totalPayment: 80000,
    tableType: "2-seats",
  },
  {
    name: "Shiro Lagos",
    location: "Victoria Island",
    image: "/hero-bg.jpg",
    dateRange: "20th Feb - 21st Feb",
    seats: 4,
    pricePerTable: 80000,
    totalPayment: 80000,
    tableType: "4-seats",
  },
]

