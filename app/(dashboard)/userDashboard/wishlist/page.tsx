import { Heart } from "lucide-react"
import Image from "next/image";
// import Layout from "@/app/components/layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Favorites() {
  const favorites = [
    {
      id: 1,
      name: "Vellvet",
      image: "/hero-bg.jpg",
    },
    {
      id: 2,
      name: "Tantalizer",
      image: "/hero-bg.jpg",
    },
    {
      id: 3,
      name: "Tantalizer",
      image: "/hero-bg.jpg",
    },
    {
      id: 4,
      name: "Chicken Republic",
      image: "/hero-bg.jpg",
    },
    {
      id: 5,
      name: "Domino",
      image: "/hero-bg.jpg",
    },
    {
      id: 6,
      name: "Shaunz Bar",
      image: "/hero-bg.jpg",
    },
  ]

  return (
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search restaurant"
              className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Select defaultValue="location">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Restaurant Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="location">Restaurant Location</SelectItem>
                <SelectItem value="vi">Victoria Island</SelectItem>
                <SelectItem value="lekki">Lekki</SelectItem>
                <SelectItem value="ikeja">Ikeja</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="table">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Table Selection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table Selection</SelectItem>
                <SelectItem value="2">2 Person</SelectItem>
                <SelectItem value="4">4 Person</SelectItem>
                <SelectItem value="6">6 Person</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="relative rounded-lg overflow-hidden group">
              <Image
                src={favorite.image || "/placeholder.svg"}
                alt={favorite.name}
                className="w-full h-48 object-cover"
                width={400}
                height={192}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-xl font-bold text-white">{favorite.name}</h3>
              </div>
              <button className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-full">
                <Heart className="h-5 w-5 text-white fill-white" />
              </button>
            </div>
          ))}
        </div>
      </div>
  )
}

