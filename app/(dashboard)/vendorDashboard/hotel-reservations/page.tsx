"use client";
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter,
  CheckCircle,
} from 'lucide-react';
import API from '@/app/lib/api/axios';

interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  totalAmount: number;
}

interface User {
  id: string;
  role: 'Super Admin' | 'Admin' | 'Hotel Owner';
  name: string;
}

const mockUser: User = {
  id: '1',
  role: 'Admin',
  name: 'John Doe'
};

const hotelId = "685dbe1b348bf4006362be1f"; // Replace with actual hotelId source

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [user] = useState<User>(mockUser);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const canManage = ['Super Admin', 'Admin', 'Hotel Owner'].includes(user.role);

  // Fetch reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setApiError(null);
      try {
        let url = `/hotels/${hotelId}/reservations?`;
        if (statusFilter !== 'all') url += `status=${statusFilter}&`;
        if (dateFilter) url += `startDate=${dateFilter}&`;
        // Add pagination if needed
        const res = await API.get(url);
        setReservations(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setApiError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [statusFilter, dateFilter]);

  const handleConfirmReservation = async (reservationId: string) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await API.put(`/reservations/${reservationId}/confirm`);
      if (res.status !== 200) throw new Error('Failed to confirm reservation');
      // Refresh reservations
      setReservations((prev) => 
        prev.map(resv => 
          resv.id === reservationId 
            ? { ...resv, status: 'confirmed' }
            : resv
        )
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setApiError(err.message || 'Error confirming reservation');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    reservationId: string, 
    newStatus: Reservation['status']
  ) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ...',
        },
        body: JSON.stringify({ status: newStatus, notes: '' })
      });
      if (!res.ok) throw new Error('Failed to update reservation status');
      setReservations((prev) => 
        prev.map(resv => 
          resv.id === reservationId 
            ? { ...resv, status: newStatus }
            : resv
        )
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setApiError(err.message || 'Error updating reservation status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Reservation['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'checked-in': return 'bg-blue-100 text-blue-800';
      case 'checked-out': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // (Optional) local filter for demo if API doesn't support all filtering
  const filteredReservations = reservations.filter(reservation => {
    const dateMatch = !dateFilter || reservation.checkIn >= dateFilter;
    return dateMatch;
  });

  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Reservation Management</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
                <option value="checked-out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {apiError && <div className="text-red-600 mb-4">{apiError}</div>}
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Check Out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    {canManage && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {reservation.guestName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reservation.roomNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reservation.checkIn).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reservation.checkOut).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${reservation.totalAmount}
                      </td>
                      {canManage && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {reservation.status === 'pending' && (
                              <button
                                onClick={() => handleConfirmReservation(reservation.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Confirm Reservation"
                                disabled={loading}
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            <select
                              value={reservation.status}
                              onChange={(e) => handleUpdateStatus(reservation.id, e.target.value as Reservation['status'])}
                              className="text-xs px-2 py-1 border border-gray-300 rounded"
                              disabled={loading}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="checked-in">Checked In</option>
                              <option value="checked-out">Checked Out</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReservationsManagement;