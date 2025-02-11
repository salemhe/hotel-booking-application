import Image from "next/image"
import Link from "next/link"
import { ArrowRight} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TabbedSearch } from "@/components/landing/TabbedSearch"

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* Hero section */}
      <div className="relative bg-blue-600">
        <div className="absolute inset-0">
          <Image
            className="w-full h-full object-cover"
            src="/hero-bg.jpg"
            alt="Hero background"
            width={1600}
            height={600}
          />
          <div className="absolute inset-0 bg-blue-600 opacity-75" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover Amazing Dining Experiences
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Find and book the best restaurants and hotels for your next culinary adventure.
          </p>
        </div>
      </div>

      <TabbedSearch />

      {/* Featured Restaurants section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Restaurants</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover our top-rated dining experiences
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {[1, 2, 3].map((index) => (
            <Card key={index}>
              <CardHeader className="p-0">
                <Image
                  src="/hero-bg.jpg"
                  alt={`Featured restaurant ${index}`}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle>Restaurant {index}</CardTitle>
                <CardDescription>Cuisine Type • ₦₦ • 4.5 ★</CardDescription>
                <p className="mt-2 text-sm text-gray-500">
                  Experience exquisite flavors and impeccable service at this top-rated restaurant.
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/restaurants/${index}`}>Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/restaurants">
              View All Restaurants
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Featured Hotels section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Hotels</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Find the perfect place to stay for your culinary journey
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {[1, 2, 3].map((index) => (
              <Card key={index}>
                <CardHeader className="p-0">
                  <Image
                    src="/hero-bg.jpg"
                    alt={`Featured hotel ${index}`}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle>Hotel {index}</CardTitle>
                  <CardDescription>Location • ₦₦₦ • 4.8 ★</CardDescription>
                  <p className="mt-2 text-sm text-gray-500">
                    Luxurious accommodations with easy access to the city&apos;s best restaurants.
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button asChild className="w-full">
                    <Link href={`/hotels/${index}`}>Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild>
              <Link href="/hotels">
                View All Hotels
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

