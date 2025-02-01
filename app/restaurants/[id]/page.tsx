import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

// This would typically come from an API call
const mockRestaurant = {
  id: "1",
  name: "Gourmet Restaurant",
  description: "Experience fine dining with our award-winning chefs.",
  rating: 4.8,
  cuisine: "French",
  priceRange: "$$$",
  openingHours: "12:00 PM - 10:00 PM",
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
};

export default async function RestaurantDetail({ params }: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  // In a real application, you would fetch the hotel data based on the ID
    if (id !== mockRestaurant.id) {
      notFound()
    }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{mockRestaurant.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={mockRestaurant.images[0] || "/placeholder.svg"}
            alt={mockRestaurant.name}
            className="w-full h-auto rounded-lg"
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {mockRestaurant.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${mockRestaurant.name} ${index + 2}`}
                className="w-full h-auto rounded-lg"
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-lg mb-4">{mockRestaurant.description}</p>
          <p className="mb-2">Cuisine: {mockRestaurant.cuisine}</p>
          <p className="mb-2">Price Range: {mockRestaurant.priceRange}</p>
          <p className="mb-4">Rating: {mockRestaurant.rating}/5</p>
          <p className="mb-6">Opening Hours: {mockRestaurant.openingHours}</p>
          <Button size="lg">Make a Reservation</Button>
        </div>
      </div>
    </div>
  );
}
