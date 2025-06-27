import { Mail, MapPin, Phone, Star } from "lucide-react";
import HotelInfo from "./HotelInfo";
import BookingForm from "../BookingForm";
import MapComponent from "../MapComponent";
import Link from "next/link";
import API from "@/app/lib/api/userServerAxios";
import { Restaurant } from "../../lib/types/restaurant";
import RestaurantImages from "./HotelImages";
import RestaurantSaveCopy from "./HotelSaveCopy";
import HotelImages from "./HotelImages";
import HotelSaveCopy from "./HotelSaveCopy";
import { HotelsPageClient } from "./HotelPageClient";

// const images = [
//   {
//     image: "/blue-origin.png",
//     name: "Blue Origin",
//   },
//   {
//     image: "/hero-bg.png",
//     name: "Blue Origin",
//   },
//   {
//     image: "/dominos.webp",
//     name: "Blue Origin",
//   },
//   {
//     image: "/blue-origin.png",
//     name: "Blue Origin",
//   },
//   {
//     image: "/blue-origin.png",
//     name: "Blue Origin",
//   },
//   {
//     image: "/blue-origin.png",
//     name: "Blue Origin",
//   },
//   {
//     image: "/blue-origin.png",
//     name: "Blue Origin",
//   },
// ];

const fetchRestaurant = async (
  id: string
): Promise<{
  data: Restaurant[];
}> => {
  try {
    const response = await API.get(`/vendors?vendorId=${id}`);
    const data = await response.data;
    // const data = [
    //   {
    //     _id: "12",
    //     name: "Kapadoccia",
    //     businessName: "Kapadoccia",
    //     businessDescription: "Escape to luxury at Oceanview Grand Hotel, a 5-star seaside retreat in the heart of Victoria Island. Designed for both business and leisure travelers, this elegant property offers breathtaking ocean views, modern interiors, and exceptional service. Choose from spacious deluxe rooms, executive suites, or penthouse options — all equipped with high-speed Wi-Fi, smart TVs, plush bedding, and 24-hour room service.",
    //     email: "info@kapadoccia.com",
    //     phone: "12345678990",
    //     address: "16, Idowu Taylor Street, Victoria Island 101241 Nigeria",
    //     openingTime: "09:00",
    //     closingTime: "23:00",
    //     cuisines: ["Turkish", "International"],
    //     availableSlots: ["12:00", "14:00", "18:00", "20:00"],
    //     rating: 4.8,
    //     reviews: 1200,
    //     profileImage: "/dominos.webp",
    //     businessType: "Restaurant",
    //     branch: "Victoria Island",
    //     role: "vendor",
    //     profileImages: [
    //       { id: "1", url: "/dominos.webp" },
    //       { id: "2", url: "/blue-origin.png" }
    //     ],
    //     services: ["Dine-in", "Takeaway", "Delivery"],
    //     paymentDetails: {
    //       bankAccountName: "Kapadoccia Ltd",
    //       bankName: "Zenith Bank",
    //       bankCode: "057",
    //       accountNumber: "1234567890",
    //       recipientCode: "RCP_123456",
    //     },
    //     percentageCharge: 2.5,
    //     balance: 500000,
    //     isVerified: true,
    //     createdAt: "2023-01-01T09:00:00Z",
    //     updatedAt: "2023-06-01T09:00:00Z"
    //   }
    // ];
    return { data };
  } catch (error) {
    console.error(error);
    // Handle error and return a default value or rethrow
    return { data: [] };
  }
};

const HotelsPage = async ({ id }: { id: string }) => {
  const data = await fetchRestaurant(id);


  const restaurant = data.data[0];

  // --- Add state for activeTab ---
  // Since this is a server component, you need to lift the tab state up to a client component.
  // We'll wrap the main content in a client component to manage the tab state.

  return (
    <HotelsPageClient id={id} restaurant={restaurant} />
  );
};

export default HotelsPage;

// --- Add this new client component below ---

