"use client";

import { createContext, useContext, useState } from "react";
import { Bottles, Combos, Restaurant, VIP } from "@/types/user/restaurant";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { toast } from "sonner";

type ReservationsContextType = {
  comboItems: Combos[];
  setComboItems: React.Dispatch<React.SetStateAction<Combos[]>>;
  bottleItems: Bottles[];
  setBottleItems: React.Dispatch<React.SetStateAction<Bottles[]>>;
  vipExtraItems: VIP[];
  setVipExtraItems: React.Dispatch<React.SetStateAction<VIP[]>>;
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
  table: string;
  setTable: React.Dispatch<React.SetStateAction<string>>;
  vendor: Restaurant | undefined;
  setVendor: React.Dispatch<React.SetStateAction<Restaurant | undefined>>;
  handleSubmit: () => void;
  isLoading: boolean;
  totalPrice: number;
  setProposedPayment: React.Dispatch<React.SetStateAction<number>>;
  proposedPayment: number
};

const ReservationContext = createContext<ReservationsContextType | undefined>(
  undefined
);

export function ReservationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [comboItems, setComboItems] = useState<Combos[]>([]);
  const [bottleItems, setBottleItems] = useState<Bottles[]>([]);
  const [vipExtraItems, setVipExtraItems] = useState<VIP[]>([]);
  const [guestCount, setGuestCount] = useState<string>("1");
  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Starters");
  const [page, setPage] = useState(0);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [table, setTable] = useState("");
  const [vendor, setVendor] = useState<Restaurant | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [proposedPayment, setProposedPayment] = useState(0)
  const router = useRouter();

  const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Other"];

  const totalPrice = vendor ? bottleItems.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 1),
        0
      ) +
      comboItems.reduce((total, item) => total + (item.price || 0), 0) +
      vipExtraItems.reduce((total, item) => total + (item.price || 0), 0) +
      (vendor.priceRange * parseInt(guestCount, 10)) : 0

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (!date || !guestCount ||!table || !time) {
        throw new Error("Please fill in all required fields.");
      }

      const parsedGuestCount = parseInt(guestCount, 10);
      const combos = comboItems.filter((item) => item.selected);
      const bottles = bottleItems.filter((item) => item.selected);
      const vipExtras = vipExtraItems.filter((item) => item.selected);
      const id = await AuthService.getId();
      const user = await AuthService.fetchMyProfile(id!)
      if (!vendor) return;
      

      const reservationData = {
        reservationType: "club",
        customerEmail: user?.email,
        date: date.toISOString(),
        time,
        guests: parsedGuestCount,
        specialRequest,
        combos: combos.filter((item) => item.selected),
        bottles: bottles.filter((item) => item.selected),
        vipExtras: vipExtras.filter((item) => item.selected),
        proposedPayment,
        totalPrice,
        vendorId: vendor?._id,
        businessName: vendor?.businessName,
        location: vendor?.address,
        customerName: `${user?.firstName} ${user?.lastName}`,
        image: vendor?.profileImages?.[0].url,
      };
      console.log("Reservation Data to be sent:", reservationData);

      const res = await API.post("/users/bookings", reservationData);

      const bookingId = res.data.booking._id;
      console.log("Booking ID:", bookingId);

      toast.success("Reservation submitted successfully!");
      router.push(`/completed/${bookingId}`);
    } catch (error) {
      console.error("Error submitting reservation:", error);
      toast.error("Failed to submit reservation. Please try again.");
      // Handle error (e.g., show a notification to the user)
    } finally {
      setIsLoading(false);
    }
  };
  // Simulate fetching menu items

  return (
    <ReservationContext.Provider
      value={{
        comboItems,
        setComboItems,
        bottleItems,
        setBottleItems,
        vipExtraItems,
        setVipExtraItems,
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
        table,
        setTable,
        vendor,
        setVendor,
        handleSubmit,
        isLoading,
        totalPrice,
        setProposedPayment,
        proposedPayment,
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
