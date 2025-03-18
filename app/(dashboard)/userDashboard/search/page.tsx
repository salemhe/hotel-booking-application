"use client"

import { useState, useEffect } from "react"
import { Search, Store, Frown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { AuthService } from "@/services/auth.services"
import API from "@/utils/axios"
import Link from "next/link"

// Define the Restaurant type
interface Restaurant {
  businessName: string;
  createdAt: string;
}

export default function RestaurantDashboard() {
  const authUser = AuthService.getUser();
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filteredReservations, setFilteredReservations] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchRestaurants = async (query = "", sort = "date") => {
    setLoading(true)
    try {
      const response = await API.get(`/vendors?businessName=${query}`)
      let data = await response.data

      // Sort the data based on the selected sort option
      if (sort === "name") {
        data = data.sort((a: Restaurant, b: Restaurant) => (a.businessName || "").localeCompare(b.businessName || ""))
      } else if (sort === "date") {
        data = data.sort((a: Restaurant, b: Restaurant) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      setFilteredReservations(data)
    } catch (error) {
      console.error("Error fetching restaurant data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants(searchQuery, sortBy)
  }, [searchQuery, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              {authUser?.firstName} {authUser?.lastName}
            </h1>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search restaurant"
                className="pl-9 bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px] bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming Reservations</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="animate-pulse overflow-hidden border-zinc-200/80 dark:border-zinc-800">
                    <div className="relative h-44 bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10">
                <Frown className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reservations found. Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredReservations.map((reservation, index) => (
                  <ReservationCard key={index} reservation={reservation} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

interface Reservation {
  name: string;
  _id: string;
  businessName: string;
  profileImage: string;
  address: string
  date: string;
  time: string;
  guests: number;
  status: string;
  location: string;
  rating?: number; // Assuming rating is optional
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  return (
    <Link href={`/userDashboard/search/${reservation._id}`} >
      <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800 hover:scale-3d">
        <div className="relative h-44 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
          <Image
            src={reservation.profileImage || "/dan-gold.jpg"}
            alt={reservation.businessName || "Images"}
            width={300}
            height={200}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
            <h3 className="text-white font-bold text-lg mb-1">{reservation.businessName}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Store className="h-3.5 w-3.5 text-zinc-300" />
                <span className="text-xs text-zinc-200">{reservation.address}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
