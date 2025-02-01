import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

// This would typically come from an API call
const mockHotel = {
  id: "1",
  name: "Luxury Hotel",
  description: "Experience luxury like never before in our 5-star hotel.",
  rating: 4.5,
  price: 200,
  amenities: ["Free Wi-Fi", "Swimming Pool", "Spa", "Fitness Center"],
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
};

export default async function HotelDetail({ params }: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  // In a real application, you would fetch the hotel data based on the ID
    if (id !== mockHotel.id) {
      notFound()
    }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{mockHotel.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={mockHotel.images[0] || "/placeholder.svg"}
            alt={mockHotel.name}
            className="w-full h-auto rounded-lg"
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {mockHotel.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image || "/placeholder.svg"}
                alt={`${mockHotel.name} ${index + 2}`}
                className="w-full h-auto rounded-lg"
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-lg mb-4">{mockHotel.description}</p>
          <p className="font-bold text-2xl mb-4">
            Price: ${mockHotel.price}/night
          </p>
          <p className="mb-4">Rating: {mockHotel.rating}/5</p>
          <h2 className="text-xl font-semibold mb-2">Amenities:</h2>
          <ul className="list-disc list-inside mb-6">
            {mockHotel.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
          <Button size="lg">Book Now</Button>
        </div>
      </div>
    </div>
  );
}
