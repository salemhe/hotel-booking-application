import { ReservationStatus } from "@/types/reservation";
import { useState } from "react";

interface Props {
  onChange: (filters: { status?: ReservationStatus; startDate?: string; endDate?: string }) => void;
}

const statuses: ReservationStatus[] = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];

export default function ReservationFilters({ onChange }: Props) {
  const [status, setStatus] = useState<ReservationStatus | "">("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = () => {
    onChange({
      status: status || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  return (
    <div className="flex gap-4 items-end mb-4">
      <div>
        <label className="block text-xs text-gray-600">Status</label>
        <select className="border rounded p-1" value={status} onChange={e => setStatus(e.target.value as ReservationStatus)}>
          <option value="">All</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600">Start Date</label>
        <input type="date" className="border rounded p-1" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-gray-600">End Date</label>
        <input type="date" className="border rounded p-1" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleFilter}>
        Apply
      </button>
    </div>
  );
}