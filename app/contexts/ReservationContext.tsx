"use client";

import { createContext, useContext, useState } from "react";
import { MenuItem } from "../components/reservation/PreSelectMeal";
import { Restaurant } from "../lib/types/restaurant";
import { AuthService } from "../lib/api/services/userAuth.service";
import { useRouter } from "next/navigation";
import API from "../lib/api/userAxios";
import { toast } from "sonner";

type ReservationsContextType = {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  additionalNote: string;
  setAdditionalNote: React.Dispatch<React.SetStateAction<string>>;
  selectedOccasion: string;
  setSelectedOccasion: React.Dispatch<React.SetStateAction<string>>;
  seatingPreference: string;
  setSeatingPreference: React.Dispatch<React.SetStateAction<string>>;
  guestCount: string;
  setGuestCount: React.Dispatch<React.SetStateAction<string>>;
  specialRequest: string;
  setSpecialRequest: React.Dispatch<React.SetStateAction<string>>;
  occasions: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: (value: number) => void;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  vendor: Restaurant | undefined;
  setVendor: React.Dispatch<React.SetStateAction<Restaurant | undefined>>;
  handleSubmit: () => void;
  isLoading: boolean
};

const ReservationContext = createContext<ReservationsContextType | undefined>(
  undefined
);

export function ReservationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [additionalNote, setAdditionalNote] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [seatingPreference, setSeatingPreference] = useState<string>("indoor");
  const [guestCount, setGuestCount] = useState<string>("1");
  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Starters");
  const [page, setPage] = useState(0);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [vendor, setVendor] = useState<Restaurant | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Other"];


  const handleSubmit = async () => {

    try {
      setIsLoading(true)
      if (!date || !seatingPreference || !guestCount || !time) {
        throw new Error("Please fill in all required fields.");
      }

      const parsedGuestCount = parseInt(guestCount, 10);
      const menus = menuItems.filter(item => item.selected);
      const id = await AuthService.getId();
      const user = await AuthService.fetchMyProfile(id!);

    const reservationData = {
      reservationType: "restaurant",
      customerEmail: user?.email,
      date: date.toISOString(),
      time,
      seatingPreference,
      guests: parsedGuestCount,
      additionalNote,
      specialOccasion: selectedOccasion.toLowerCase() || "other",
      specialRequest,
      meals: menus.filter(item => item.selected).map(item => ({
        id: item._id,
        name: item.dishName,
        price: item.price,
        quantity: item.quantity, 
        specialRequest: item.specialRequest || "",
        category: item.category,
      })),
      totalPrice: menus.reduce(
        (total, item) => total + ((item.price || 0) * (item.quantity || 1)),
        0
      ),
      vendorId: vendor?._id,
      businessName: vendor?.businessName,
      location: vendor?.address,
      customerName: `${user?.firstName} ${user?.lastName}`,
      image: vendor?.profileImages?.[0].url,

    };
    console.log("Reservation Data to be sent:", reservationData);

      const res = await API.post("/users/bookings", reservationData);

      const bookingId = res.data.booking._id
      console.log("Booking ID:", bookingId);

      toast.success("Reservation submitted successfully!");
      router.push(`/completed/${bookingId}`);

    } catch (error) {
      console.error("Error submitting reservation:", error);
      toast.error("Failed to submit reservation. Please try again.");
      // Handle error (e.g., show a notification to the user)
    } finally {
      setIsLoading(false)
    }
  };
  // Simulate fetching menu items

  return (
    <ReservationContext.Provider
      value={{
        menuItems,
        setMenuItems,
        additionalNote,
        setAdditionalNote,
        selectedOccasion,
        setSelectedOccasion,
        seatingPreference,
        setSeatingPreference,
        guestCount,
        setGuestCount,
        specialRequest,
        setSpecialRequest,
        occasions,
        activeTab,
        setActiveTab,
        page,
        setPage,
        date,
        setDate,
        time,
        setTime,
        vendor,
        setVendor,
        handleSubmit,
        isLoading,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error(
      "useReservations must be used within a ReservationsProvider"
    );
  }
  return context;
}
