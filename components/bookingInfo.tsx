import Image from "next/image"
import { Calendar, Clock, MapPin, Users, Utensils, CreditCard } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function BookingInfo() {
  // Sample booking data
  const booking = {
    id: "BK12345",
    restaurantName: "Chicken Republic",
    location: "Victoria Island",
    date: "Friday, March 21, 2025",
    time: "7:30 PM",
    partySize: 4,
    tableType: "2 Seat",
    specialRequests: "Anniversary celebration",
    status: "Pending",
  }

  return (
    <Card className="w-full max-w-3xl mx-auto overflow-hidden">
      <div className="relative w-full h-48 sm:h-64">
        <Image
          src="/hero-bg.jpg"
          alt={booking.restaurantName}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold text-white">{booking.restaurantName}</h2>
          <div className="flex items-center text-white/90 mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <p className="text-sm">{booking.location}</p>
          </div>
        </div>
      </div>

      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Booking Details</CardTitle>
          <Badge variant="outline" className="text-sm">
            {booking.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">{booking.date}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-muted-foreground">{booking.time}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Users className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">People</p>
                <p className="text-muted-foreground">{booking.partySize} people</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Booking Reference</p>
                <p className="text-muted-foreground">{booking.id}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Utensils className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Table</p>
                <p className="text-muted-foreground">{booking.tableType} table</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">Restaurant Policies</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Please arrive 10 minutes before your reservation time</li>
              <li>• Your table will be held for 15 minutes after your reservation time</li>
              <li>• Cancellations must be made at least 24 hours in advance</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button variant="outline">Edit Booking</Button>
            <Button variant="destructive">Cancel Booking</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

