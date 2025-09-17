"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function ManageBookingPage() {
  const [bookingNumber, setBookingNumber] = useState("")
  const [email, setEmail] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the booking retrieval logic
    console.log("Retrieving booking:", { bookingNumber, email })
    toast({
      title: "Booking Retrieved",
      description: "Your booking details have been sent to your email.",
    })
    // Reset form
    setBookingNumber("")
    setEmail("")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Manage Your Booking</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Retrieve Your Booking</CardTitle>
          <CardDescription>Enter your booking details to manage your reservation.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bookingNumber">Booking Number</Label>
                <Input
                  id="bookingNumber"
                  value={bookingNumber}
                  onChange={(e) => setBookingNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              Retrieve Booking
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">If you need assistance, please contact our customer support.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

