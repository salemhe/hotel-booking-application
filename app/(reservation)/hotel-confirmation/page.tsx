"use client"

import { Check, Mail, Clock, MapPin, Calendar } from "lucide-react"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { format } from 'date-fns'
import { useEffect, useState } from 'react'

// Define the booking data type
interface BookingData {
  checkInDate: string;
  checkOutDate: string;
  guests: string;
  specialRequest?: string;
  hotelInfo?: {
    businessName?: string;
    address?: string;
    price?: number;
    profileImages?: string[];
  };
}

export default function HotelConfirmationPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [reservationId, setReservationId] = useState('')

  useEffect(() => {
    // Get booking data from localStorage or context
    const storedBookingData = localStorage.getItem('hotelBookingData')
    if (storedBookingData) {
      const data = JSON.parse(storedBookingData)
      setBookingData(data)
      
      // Generate reservation ID
      const id = `HTL${Date.now().toString().slice(-6)}`
      setReservationId(id)
      
      // Clear booking data after confirmation
      localStorage.removeItem('hotelBookingData')
    }
  }, [])

  const handleDoneClick = () => {
    router.push("/payment")
  }

  const handleGetDirections = () => {
    if (bookingData?.hotelInfo?.address) {
      const encodedAddress = encodeURIComponent(bookingData.hotelInfo.address)
      window.open(`https://maps.google.com?q=${encodedAddress}`, '_blank')
    }
  }

  // Loading state
  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation details...</p>
        </div>
      </div>
    )
  }

  const checkInDate = new Date(bookingData.checkInDate)
  const checkOutDate = new Date(bookingData.checkOutDate)
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  const pricePerNight = bookingData.hotelInfo?.price || 150000
  const totalPrice = pricePerNight * nights

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#0F766E1A] rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#0F766E] rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl sm:text-[22px] font-bold text-[#111827] mb-2">
            Your hotel reservation is confirmed & payment completed
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Your booking has been successfully confirmed for your upcoming stay
          </p>
        </div>

        {/* Reservation Details */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Reservation Details</h2>

            <div className="space-y-4 mb-6">
              {/* Hotel Info */}
              <div className="flex gap-3 sm:gap-4">
                <div className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={bookingData.hotelInfo?.profileImages?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=160&fit=crop"} 
                    alt={bookingData.hotelInfo?.businessName || "Hotel"} 
                    className="w-full h-full object-cover"
                    width={80}
                    height={64}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Hotel</p>
                  <p className="text-sm sm:text-base font-medium text-gray-900 mb-1 truncate">
                    {bookingData.hotelInfo?.businessName || "Hotel"}, Lagos, Nigeria
                  </p>
                  <div className="flex items-start gap-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {bookingData.hotelInfo?.address || "Address not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservation ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Reservation ID</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">#{reservationId}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Room Type</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Superior Deluxe Room</p>
                </div>
              </div>

              {/* Dates and Guests */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Check-in Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {format(checkInDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Check-out Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {format(checkOutDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Duration</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {nights} {nights === 1 ? 'night' : 'nights'}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Guests</p>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {bookingData.guests} {parseInt(bookingData.guests) === 1 ? 'person' : 'people'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 text-sm sm:text-base">
                  Superior Deluxe Room × {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
                <span className="font-medium text-gray-900 text-sm sm:text-base">₦{totalPrice.toLocaleString()}</span>
              </div>
              
              {bookingData?.specialRequest && (
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">Special Request</p>
                  <p className="text-sm text-gray-800">{bookingData.specialRequest}</p>
                </div>
              )}
            </div>

            {/* Amount paid section */}
            <div className="border-t pt-4 sm:pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-base sm:text-lg font-semibold text-gray-900">Total Amount Paid</span>
                <span className="text-base sm:text-lg font-semibold text-[#0F766E]">₦{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-5 h-5 bg-[#0F766E] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-[#0F766E] text-sm sm:text-base">Paid</span>
                <span className="text-gray-600 text-xs sm:text-sm">
                  • Payment completed on {format(new Date(), "MMM dd, yyyy 'at' h:mm a")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="bg-[#E6FFFA] border border-[#81E6D9] rounded-lg p-4 mb-6 sm:mb-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E] mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-gray-700">
                You will receive a confirmation email with your reservation and booking details
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E] mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-gray-700">
                Check-in time is 2:00 PM and check-out time is 12:00 PM
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E] mt-0.5 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-gray-700">
                Free cancellation until 24 hours before check-in
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-10 sm:h-11 text-sm font-medium rounded-xl px-6 border-gray-300 order-2 sm:order-1"
            onClick={handleGetDirections}
          >
            Get Directions
          </Button>
          <Button
            className="flex-1 h-10 sm:h-11 text-sm font-medium px-6 rounded-xl bg-[#0F766E] hover:bg-teal-800 order-1 sm:order-2"
            onClick={handleDoneClick}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}