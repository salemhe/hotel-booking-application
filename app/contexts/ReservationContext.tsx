"use client";

import { createContext, useContext, useState } from "react";
import { MenuItem } from "../components/reservation/PreSelectMeal";
import { Restaurant } from "../lib/types/restaurant";
import { AuthService } from "../lib/api/services/userAuth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ReservationService, CreateReservationData } from "../lib/api/services/reservation.service";

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
      setIsLoading(true);

      // Validate required fields
      if (!date || !seatingPreference || !guestCount || !time) {
        throw new Error("Please fill in all required fields.");
      }

      if (!vendor?._id) {
        throw new Error("Vendor information is missing.");
      }

      const parsedGuestCount = parseInt(guestCount, 10);
      if (isNaN(parsedGuestCount) || parsedGuestCount < 1) {
        throw new Error("Please enter a valid number of guests.");
      }

      const selectedMeals = menuItems.filter(item => item.selected && item.quantity > 0);
      const id = await AuthService.getId();
      const user = await AuthService.fetchMyProfile(id!);

      if (!user?.email) {
        throw new Error("User information is missing. Please log in again.");
      }

      // Calculate total price
      const totalPrice = selectedMeals.reduce(
        (total, item) => total + ((item.price || 0) * (item.quantity || 1)),
        0
      );

      // Prepare reservation data
      const reservationData: CreateReservationData = {
        reservationType: "restaurant" as const,
        customerEmail: user.email,
        customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        date: date.toISOString(),
        time,
        guests: parsedGuestCount,
        seatingPreference,
        specialOccasion: selectedOccasion || "other",
        specialRequest,
        additionalNote,
        meals: selectedMeals.map(item => ({
          id: item._id,
          name: item.dishName,
          price: item.price || 0,
          quantity: item.quantity || 1,
          specialRequest: item.specialRequest || "",
          category: item.category,
        })),
        totalPrice,
        vendorId: vendor._id,
        businessName: vendor.businessName,
        location: vendor.address,
        image: vendor.profileImages?.[0]?.url,
      };

      console.log("Reservation Data to be sent:", reservationData);

      // Check availability before creating reservation
      try {
        const availability = await ReservationService.checkAvailability(
          vendor._id,
          date.toISOString().split('T')[0],
          time,
          parsedGuestCount
        );

        if (!availability.available) {
          throw new Error(availability.message || "Selected time slot is not available.");
        }
      } catch (availabilityError) {
        console.warn("Availability check failed, proceeding anyway:", availabilityError);
      }

      // Create reservation using the service
      const reservation = await ReservationService.createReservation(reservationData);

      console.log("Reservation created successfully:", reservation);
      toast.success("Reservation submitted successfully!");

      // Navigate to confirmation page
      router.push(`/completed/${reservation._id}`);

    } catch (error: unknown) {
      console.error("Error submitting reservation:", error);

      // Show specific error message
      let errorMessage = "Failed to submit reservation. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || "Failed to submit reservation. Please try again.";
      }
      toast.error(errorMessage);

      // Log detailed error for debugging
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: unknown } };
        if (axiosError.response?.data) {
          console.error("Server error details:", axiosError.response.data);
        }
      }
    } finally {
      setIsLoading(false);
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
