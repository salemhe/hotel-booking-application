"use client"

import { useState, useEffect } from "react"
import { Search, Store } from "lucide-react"
// import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { AuthService } from "@/services/auth.services"
import API from "@/utils/axios"
import Link from "next/link"

export default function RestaurantDashboard() {
  const authUser = AuthService.getUser();
  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [timePeriod, setTimePeriod] = useState("")
  const [location, setLocation] = useState("")
  const [mealType, setMealType] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [sortBy, setSortBy] = useState("date")

  // Filtered data states
  const [filteredReservations, setFilteredReservations] = useState([])
  // const [filteredTables, setFilteredTables] = useState([])

  // Function to fetch restaurant data
  const fetchRestaurants = async (query = "") => {
    try {
      const response = await API.get(`/vendors?businessName=${query}`)
      const data = await response.data
      setFilteredReservations(data)
      // setFilteredTables(data.tables)
    } catch (error) {
      console.error("Error fetching restaurant data:", error)
    }
  }

  // Fetch data on initial load and when search query changes
  useEffect(() => {
    fetchRestaurants(searchQuery)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-400">
              {authUser?.firstName} {authUser?.lastName}
            </h1>
          </div>

          {/* Search and Sort */}
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
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="next-month">Next Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="lekki">Location: Lekki</SelectItem>
                <SelectItem value="victoria-island">Location: Victoria Island</SelectItem>
                <SelectItem value="ikeja">Location: Ikeja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Meal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[140px] bg-white/80 backdrop-blur-sm dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="$">$</SelectItem>
                <SelectItem value="$$">$$</SelectItem>
                <SelectItem value="$$$">$$$</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Main Content - No Tabs */}
        <div className="space-y-8">
          {/* Upcoming Reservations Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Upcoming Reservations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredReservations.map((reservation, index) => (
                <ReservationCard key={index} reservation={reservation} />
              ))}
            </div>
          </section>

          {/* Table Management Section */}
          {/* <section>
            <h2 className="text-xl font-semibold mb-4">Table Management Section</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredTables.map((table, index) => (
                <TableManagementCard key={index} table={table} />
              ))}
            </div>
          </section> */}
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
            {/* <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-zinc-300" />
              <span className="text-xs text-zinc-200">{reservation.time}</span>
            </div> */}
          </div>
        </div>
      </div>
      {/* <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">No. of guests: {reservation.guests}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent> */}
    </Card>
    </Link>
  )
}

// interface Table {
//   name: string;
//   image: string;
//   location: string;
//   guests: number;
//   tableType: string;
//   reservationStatus: string;
//   rating: number;
// }

// function TableManagementCard({ table }: { table: Table }) {
//   return (
//     <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-zinc-200/80 dark:border-zinc-800">
//       <div className="relative h-44 overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
//         <Image
//           src={table.image || "/placeholder.svg"}
//           alt={table.name}
//           width={300}
//           height={200}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//         />
//         <div className="absolute top-3 left-3 right-3 z-20 flex items-center gap-2 justify-end">
//           <Badge className="bg-white/90 hover:bg-white/95 text-zinc-900 backdrop-blur-sm font-medium flex items-center">
//             {table.guests} Guests
//           </Badge>

//           <Badge className="bg-white/90 hover:bg-white/95 text-zinc-900 backdrop-blur-sm font-medium">
//             {table.tableType}
//           </Badge>
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
//           <h3 className="text-white font-bold text-lg mb-1">{table.name}</h3>
//           <div className="flex items-center gap-3">
//             <div className="flex items-center gap-1">
//               <MapPin className="h-3.5 w-3.5 text-zinc-300" />
//               <span className="text-xs text-zinc-200">{table.location}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <CardContent className="p-3">
//         <div className="flex items-center justify-between">
//           <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <span key={star} className={`text-xs ${star <= table.rating ? "text-amber-500" : "text-zinc-300"}`}>
//                 ★
//               </span>
//             ))}
//           </div>
//           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
