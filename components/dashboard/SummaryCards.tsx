// import type { HotelDashboardStats } from "../../types/hotel";

import { HotelDashboardStats } from "@/lib/types/hotels";

type Props = { stats: HotelDashboardStats | undefined; isLoading: boolean };

const cardData: {
  label: string;
  field: keyof HotelDashboardStats;
  format?: (v: number) => string;
}[] = [
  { label: "Total Rooms", field: "totalRooms" },
  { label: "Booked Today", field: "bookedToday" },
  { label: "Active Reservations", field: "activeReservations" },
  { label: "Revenue", field: "revenue", format: (v: number) => `$${v.toLocaleString()}` },
  { label: "Occupancy Rate", field: "occupancyRate", format: (v: number) => `${Math.round(v * 100)}%` },
];


export default function SummaryCards({ stats, isLoading }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {cardData.map(({ label, field, format }) => (
        <div key={label} className="bg-white p-4 rounded shadow text-center">
          <div className="text-xs text-gray-500">{label}</div>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <span className="animate-pulse text-gray-300">—</span>
            ) : stats ? (
              format
                ? format(stats[field])
                : stats[field]
            ) : (
              "-"
            )}
          </div>
        </div>
      ))}
    </div>
  );
}