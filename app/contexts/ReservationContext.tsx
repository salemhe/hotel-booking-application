"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type MenuItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    quantity: number;
    specialRequest: string;
    selected: boolean;
};

type ReservationsContextType = {
    loading: boolean;
    menuItems: MenuItem[];
    setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
    fetchMenuItems: () => Promise<void>;
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
    setPage: (value: number) => void
};

const ReservationContext = createContext<ReservationsContextType | undefined>(
    undefined
);

const defaultMenuItems: MenuItem[] = [
    {
        id: "meze-platter",
        name: "Meze Platter",
        description: "Hummus, baba ghanoush, tzatziki, pita bread",
        price: 15000,
        image: "/meze-platter.png",
        quantity: 2,
        specialRequest: "",
        selected: true,
    },
    {
        id: "chicken-springrolls-1",
        name: "Chicken Springrolls",
        description: "Chicken, garnished vegetables",
        price: 12000,
        image: "/chicken-springrolls.png",
        quantity: 1,
        specialRequest: "",
        selected: true,
    },
    {
        id: "chicken-springrolls-2",
        name: "Chicken Springrolls",
        description: "Chicken, garnished vegetables",
        price: 12000,
        image: "/chicken-springrolls.png",
        quantity: 1,
        specialRequest: "",
        selected: false,
    },
];

export function ReservationsProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [additionalNote, setAdditionalNote] = useState("");
    const [selectedOccasion, setSelectedOccasion] = useState<string>("");
    const [seatingPreference, setSeatingPreference] = useState<string>("indoor");
    const [guestCount, setGuestCount] = useState<string>("2");
    const [specialRequest, setSpecialRequest] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("starters");
    const [page, setPage] = useState(0)

    const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Others"];

    // Simulate fetching menu items
    const fetchMenuItems = useCallback(async () => {
        setLoading(true);
        // Simulate network delay
        const data = new Promise<MenuItem[]>((resolve) => setTimeout(() => resolve(defaultMenuItems), 5000));
        setMenuItems(await data);
        setLoading(false);
    }, []);

    return (
        <ReservationContext.Provider
            value={{
                loading,
                menuItems,
                setMenuItems,
                fetchMenuItems,
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
            }}
        >
            {children}
        </ReservationContext.Provider>
    );
}

export function useReservations() {
    const context = useContext(ReservationContext);
    if (context === undefined) {
        throw new Error("useReservations must be used within a ReservationsProvider");
    }
    return context;
}
