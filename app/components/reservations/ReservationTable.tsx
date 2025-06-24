// import { useUserRole } from "@/app/contexts/UserRoleContex";
// import { Reservation, ReservationStatus } from "@/types/reservation";

// interface Props {
//   reservations: Reservation[];
//   onConfirm: (id: string) => void;
//   onUpdateStatus: (id: string, status: ReservationStatus) => void;
// }

// const statusOptions: ReservationStatus[] = ["pending", "confirmed", "checked-in", "checked-out", "cancelled"];

// export default function ReservationsTable({ reservations, onConfirm, onUpdateStatus }: Props) {
//   const role = useUserRole();
//   const canConfirm = role !== "hotel-owner";
//   const canUpdateStatus = role !== "hotel-owner";

//   return (
//     <div className="overflow-x-auto bg-white rounded shadow">
//       <table className="min-w-full text-sm">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2">Guest</th>
//             <th className="p-2">Room</th>
//             <th className="p-2">Status</th>
//             <th className="p-2">Check-In</th>
//             <th className="p-2">Check-Out</th>
//             <th className="p-2">Total</th>
//             {(canConfirm || canUpdateStatus) && <th className="p-2">Actions</th>}
//           </tr>
//         </thead>
//         <tbody>
//           {reservations.map((r) => (
//             <tr key={r.id} className="border-t">
//               <td className="p-2">{r.guestName}</td>
//               <td className="p-2">{r.roomNumber}</td>
//               <td className="p-2 capitalize">{r.status}</td>
//               <td className="p-2">{r.checkIn}</td>
//               <td className="p-2">{r.checkOut}</td>
//               <td className="p-2">${r.totalPrice}</td>
//               {(canConfirm || canUpdateStatus) && (
//                 <td className="p-2 space-x-2">
//                   {canConfirm && r.status === "pending" && (
//                     <button className="text-green-600 hover:underline" onClick={() => onConfirm(r.id)}>
//                       Confirm
//                     </button>
//                   )}
//                   {canUpdateStatus && (
//                     <select
//                       className="border rounded p-1"
//                       value={r.status}
//                       onChange={e => onUpdateStatus(r.id, e.target.value as ReservationStatus)}
//                     >
//                       {statusOptions.map((opt) => (
//                         <option key={opt} value={opt}>{opt}</option>
//                       ))}
//                     </select>
//                   )}
//                 </td>
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import API from '@/app/lib/api/axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { Input } from '../input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table-hotel';
import { Button } from '../button';

interface Reservation {
  id: string;
  guestName: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  startDate: string;
  endDate: string;
  roomId: string;
}

interface ReservationManagementProps {
  hotelId: string;
  userRole: string;
}

export function ReservationManagement({ hotelId, userRole }: ReservationManagementProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filters, setFilters] = useState({ status: 'all', startDate: '', endDate: '' });

  useEffect(() => {
    if (hotelId) {
      fetchReservations();
    }
  }, [hotelId, filters]);

  const fetchReservations = async () => {
    if (!hotelId) {
      console.error('Hotel ID is required');
      return;
    }

    try {
      const params = new URLSearchParams();
      
      // Only add status filter if it's not "all"
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      
      const response = await API.get(`/hotels/${hotelId}/reservations?${params}`);
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleConfirm = async (reservationId: string) => {
    try {
      await API.put(`/reservations/${reservationId}/confirm`);
      fetchReservations();
    } catch (error) {
      console.error('Error confirming reservation:', error);
    }
  };

  const handleStatusUpdate = async (reservationId: string, status: Reservation['status']) => {
    try {
      await API.put(`/reservations/${reservationId}/status`, { status });
      fetchReservations();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reservation Management</h2>
      <div className="flex gap-4 mb-4">
        <Select
          onValueChange={value => setFilters({ ...filters, status: value })}
          value={filters.status}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="checked-in">Checked In</SelectItem>
            <SelectItem value="checked-out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={e => setFilters({ ...filters, startDate: e.target.value })}
        />
        <Input
          type="date"
          placeholder="End Date"
          value={filters.endDate}
          onChange={e => setFilters({ ...filters, endDate: e.target.value })}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map(reservation => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.guestName}</TableCell>
              <TableCell>{reservation.roomId}</TableCell>
              <TableCell>{reservation.startDate}</TableCell>
              <TableCell>{reservation.endDate}</TableCell>
              <TableCell>{reservation.status}</TableCell>
              <TableCell>
                {reservation.status === 'pending' && (
                  <Button onClick={() => handleConfirm(reservation.id)}>Confirm</Button>
                )}
                {userRole !== 'HotelOwner' && (
                  <Select
                    onValueChange={value => handleStatusUpdate(reservation.id, value as Reservation['status'])}
                    value={reservation.status}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="checked-in">Checked In</SelectItem>
                      <SelectItem value="checked-out">Checked Out</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}