import Image from "next/image";
import { Button } from "./ui/button";
import { Heart, Mail, MapPin, Phone, Share2Icon, Star } from "lucide-react";
import RestaurantInfo from "./RestaurantInfo";
import BookingForm from "./BookingForm";
import MapComponent from "./MapComponent";
import Link from "next/link";
import API from "@/app/lib/api/userServerAxios";
import { Restaurant } from "../lib/types/restaurant";

const images = [
  {
    image: "/blue-origin.png",
    name: "Blue Origin",
    style: "row-span-5 col-span-2",
  },
  {
    image: "/blue-origin.png",
    name: "Blue Origin",
    style: "row-span-2",
  },
  {
    image: "/blue-origin.png",
    name: "Blue Origin",
    style: "row-span-3",
  },
  {
    image: "/blue-origin.png",
    name: "Blue Origin",
    style: "row-span-3",
  },
  {
    image: "/blue-origin.png",
    name: "Blue Origin",
    style: "row-span-2",
  },
];

const fetchRestaurant = async (id: string): Promise<{
  data: Restaurant[]
}> => {
  try {
    // Example fetch, replace with actual API call
    const response = await API.get(`/vendors?vendorId=${id}`);
    const data = await response.data;
    return { data };
    // return { data: { name: "Sample Restaurant" } };
  } catch (error) {
    console.error(error)
    // Handle error and return a default value or rethrow
    return { data: [] };
  }
}

const RestaurantsPage = async ({ id }: { id: string }) => {
  const data = await fetchRestaurant(id)
  const restaurant = data.data[0]
  return (
    <main className="mx-auto py-8 px-4 max-w-7xl sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="w-full space-y-8">
          <div className="col-span-2">
            <div className="w-full space-y-6">
              <div className="grid md:grid-flow-col gap-2 w-full rounded-xl overflow-clip h-[300px] md:h-[400px] relative">
                <Button className="cursor-pointer absolute bottom-3 right-2 z-10 bg-white text-black rounded-2xl hover:bg-gray-50">
                  See more photos
                </Button>
                {images.map((image, i) => (
                  <div key={i} className={`relative ${image.style}`}>
                    <Image
                      src={image.image}
                      className="object-cover cursor-pointer"
                      alt={image.name}
                      fill
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-cente w-full gap-4">
                  <div className="flex gap-2 items-center">
                    <h1 className="text-2xl text-[#111827] font-semibold">
                      {restaurant.businessName}{" "}
                    </h1>{" "}
                    <span className="px-2 py-0.5 rounded-full border border-[#37703F] bg-[#D1FAE5] text-xs text-[#37703F]">
                      {" "}
                      Opened
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="rounded-xl">
                      <Share2Icon />
                      Share
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      <Heart />
                      Save
                    </Button>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Star className="fill-yellow-400 text-transparent font-bold" />{" "}
                  4.8 <span className="text-[#6B7280]">(1,000 views)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <RestaurantInfo data={restaurant} />
          </div>
        </div>
        <div className="space-y-8">
          <div className="p-4 rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB]">
            <h2 className="text-[#111827] font-semibold text-xl">
              Reserve your Table
            </h2>
            <BookingForm />
          </div>
          <div className="rounded-2xl bg-[#E7F0F0] border border-[#E5E7EB] p-2">
            <MapComponent address={restaurant.address} />
          </div>
          <div className="max-w-sm w-full p-4 rounded-2xl bg-white shadow space-y-4 text-sm text-gray-800">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-black mt-1" />
                <p>
                  {restaurant.address}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Contact Information
              </h3>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-black mt-1" />
                <a href={`tel:${restaurant.phone}`} className="hover:underline">
                  {restaurant.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="w-5 h-5 text-black mt-1" />
                <a
                  href={`mailto:${restaurant.email}`}
                  className="hover:underline"
                >
                  {restaurant.email}
                </a>
              </div>
            </div>

            <div>
              <Link
                href="#"
                className="text-green-700 font-medium underline hover:text-green-900"
              >
                Restaurant website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RestaurantsPage;
