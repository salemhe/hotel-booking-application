import BookingInfo from "@/components/bookingInfo"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Restaurant Booking Info</h1>
      <BookingInfo />
    </main>
  )
}

