import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const deals = [
  {
    id: 1,
    title: "Weekend Getaway Package",
    description: "Enjoy a luxurious weekend stay with complimentary breakfast and spa treatment.",
    image: "/placeholder.svg?height=200&width=300",
    price: 299,
    originalPrice: 399,
    type: "hotel",
  },
  {
    id: 2,
    title: "Romantic Dinner for Two",
    description: "Indulge in a 5-course meal with wine pairing at our award-winning restaurant.",
    image: "/placeholder.svg?height=200&width=300",
    price: 149,
    originalPrice: 199,
    type: "restaurant",
  },
  // Add more deals as needed
]

export default function DealsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Special Deals and Offers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardHeader className="p-0">
              <Image
                // src={deal.image || "/placeholder.svg"}
                src="/hero-bg.jpg"
                alt={deal.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle>{deal.title}</CardTitle>
              <CardDescription>{deal.description}</CardDescription>
              <div className="mt-4">
                <span className="text-2xl font-bold text-green-600">${deal.price}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">${deal.originalPrice}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/${deal.type}s/${deal.id}`}>Book Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

