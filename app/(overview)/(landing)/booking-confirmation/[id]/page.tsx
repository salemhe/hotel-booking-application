import { CheckCircle, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id

  // In a real application, you would fetch the booking details based on the ID
  const booking = {
    hotelName: "Grand Luxury Hotel",
    checkIn: "2023-07-01",
    checkOut: "2023-07-05",
    guests: 2,
    rooms: 1,
    bookingNumber: "B67890",
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <form
        action={async () => {
          "use server";
          redirect(`/`);
        }}
      >
        <Button variant="ghost" type="submit" className="mb-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>
      </form>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Booking Confirmed!</CardTitle>
          <CardDescription className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            Thank you for booking with {booking.hotelName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Booking Number:</strong> {booking.bookingNumber}
            </p>
            <p>
              <strong>Check-in:</strong> {booking.checkIn}
            </p>
            <p>
              <strong>Check-out:</strong> {booking.checkOut}
            </p>
            <p>
              <strong>Number of Guests:</strong> {booking.guests}
            </p>
            <p>
              <strong>Number of Rooms:</strong> {booking.rooms}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
        <form
            action={async () => {
              "use server";
              redirect(`/hotels/${id}`);
            }}
          >
            <Button type="submit" className="w-full">
              View Hotel Details
            </Button>
          </form>
          <form
            action={async () => {
              "use server";
              redirect(`/hotels`);
            }}
          >
            <Button variant="outline" type="submit" className="w-full">
              Book Another Hotel
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

