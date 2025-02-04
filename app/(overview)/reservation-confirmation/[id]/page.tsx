import { CheckCircle, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function ReservationConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id

  // In a real application, you would fetch the reservation details based on the ID
  const reservation = {
    restaurantName: "The Italian Place",
    date: "2023-06-15",
    time: "19:00",
    guests: 2,
    reservationNumber: "R12345",
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="ghost" onClick={() => redirect("/")} className="mb-4">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reservation Confirmed!</CardTitle>
          <CardDescription className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            Thank you for your reservation at {reservation.restaurantName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Reservation Number:</strong> {reservation.reservationNumber}
            </p>
            <p>
              <strong>Date:</strong> {reservation.date}
            </p>
            <p>
              <strong>Time:</strong> {reservation.time}
            </p>
            <p>
              <strong>Number of Guests:</strong> {reservation.guests}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={() => redirect(`/restaurants/${id}`)} className="w-full">
            View Restaurant Details
          </Button>
          <Button variant="outline" onClick={() => redirect("/")} className="w-full">
            Book Another Restaurant
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

