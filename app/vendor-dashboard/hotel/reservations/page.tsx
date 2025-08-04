// "use client";
// import React, { useState, useEffect } from 'react';
// import { 
//   Calendar, 
//   Filter,
//   Bell,
//   Hotel,
//   Users,
//   User,
//   X,
// } from 'lucide-react';
// import API from '@/app/lib/api/axios';
// import { AuthService } from '@/app/lib/api/services/auth.service';

// interface Reservation {
//   id: string;
//   guestName: string;
//   roomNumber: string;
//   checkIn: string;
//   checkOut: string;
//   status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
//   totalAmount: number;
//   // Added fields for more reservation details
//   confirmationCode?: string;
//   customerName?: string;
//   customerEmail?: string;
//   customerPhone?: string;
//   roomType?: string;
//   guests?: number;
//   adults?: number;
//   children?: number;
//   specialRequest?: string;
//   paymentMethod?: string;
//   paymentStatus?: string;
//   totalPrice?: number;
//   _id?: string;
//   reservationStatus?: string;
//   businessName?: string;
//   location?: string;
//   nights?: number;
//   room?: {
//     roomNumber?: string;
//     roomType?: string;
//     roomPrice?: number;
//     hotelId?: string;
//   };
// }

// interface User {
//   id: string;
//   role: 'Super Admin' | 'Admin' | 'Hotel Owner';
//   name: string;
// }

// const mockUser: User = {
//   id: '1',
//   role: 'Admin',
//   name: 'John Doe'
// };

// const ReservationsManagement = () => {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [dateFilter, setDateFilter] = useState<string>('');
//   const [user] = useState<User>(mockUser);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [apiError, setApiError] = useState<string | null>(null);

//   const canManage = ['Super Admin', 'Admin', 'Hotel Owner'].includes(user.role);

//   const fetchReservations = async () => {
//     try {
//       setLoading(true);
//       setApiError(null);
      
//       // Get the user data from AuthService
//       const user = AuthService.getUser();
//       if (!user) {
//         console.warn("No user found in storage");
//         setLoading(false);
//         return;
//       }
      
//       // Get the token
//       const token = AuthService.getToken();
//       if (!token) {
//         console.warn("No token found");
//         setLoading(false);
//         return;
//       }
      
//       // Fetch reservations data
//       const response = await API.get(`users/bookings?vendorId=${user.id}`);
//       console.log(response.data, "response.data");
      
//       if (response.data && Array.isArray(response.data)) {
//         setReservations(response.data);
//       } else {
//         console.warn("Invalid reservation data format");
//         setApiError("Invalid data format received from server");
//       }
//     } catch (error: unknown) {
//       console.error("Failed to fetch reservation data:", error);
//       if (error && typeof error === 'object' && 'response' in error) {
//         const apiError = error as { response: { status: number; data: unknown } };
//         console.error("Error response:", apiError.response.status, apiError.response.data);
//         setApiError(`Failed to fetch reservations: ${apiError.response.status}`);
//       } else {
//         setApiError("Failed to fetch reservations");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("reservations", reservations);

//   useEffect(() => {
//     fetchReservations();
//   }, []);

//   // Add to useState at the top
// const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
// const [showModal, setShowModal] = useState(false);

// // Modal open handler
// const openModal = (reservation: Reservation) => {
//   setSelectedReservation(reservation);
//   setShowModal(true);
// };

// // Modal close handler
// const closeModal = () => {
//   setSelectedReservation(null);
//   setShowModal(false);
// };


//   const handleConfirmReservation = async (reservationId: string) => {
//     setLoading(true);
//     setApiError(null);
//     try {
//       const res = await API.put(`vendors/bookings/confirm/${reservationId}`);
//       if (res.status !== 200) throw new Error('Failed to confirm reservation');
//       // Refresh reservations
//       setReservations((prev) => 
//         prev.map(resv => 
//           (resv._id || resv.id) === reservationId 
//             ? { ...resv, reservationStatus: 'confirmed', status: 'confirmed' }
//             : resv
//         )
//       );
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setApiError(err.message || 'Error confirming reservation');
//       } else {
//         setApiError('Error confirming reservation');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async (
//     reservationId: string, 
//     newStatus: Reservation['status']
//   ) => {
//     setLoading(true);
//     setApiError(null);
//     try {
//       const res = await API.put(`/reservations/${reservationId}/status`, {
//         status: newStatus,
//         notes: ''
//       });
//       if (res.status !== 200) throw new Error('Failed to update reservation status');
      
//       setReservations((prev) => 
//         prev.map(resv => 
//           (resv._id || resv.id) === reservationId 
//             ? { ...resv, reservationStatus: newStatus, status: newStatus }
//             : resv
//         )
//       );
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setApiError(err.message || 'Error updating reservation status');
//       } else {
//         setApiError('Error updating reservation status');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'confirmed': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'checked-in': return 'bg-blue-100 text-blue-800';
//       case 'checked-out': return 'bg-gray-100 text-gray-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Helper function to get the actual status from the reservation
//   const getReservationStatus = (reservation: Reservation): string => {
//     return reservation.reservationStatus || reservation.status || 'pending';
//   };

//   // Helper function to get reservation ID
//   const getReservationId = (reservation: Reservation): string => {
//     return reservation._id ?? "";
//   };

//   // Filter reservations based on status and date
//   const filteredReservations = reservations.filter(reservation => {
//     const reservationStatus = getReservationStatus(reservation);
//     const statusMatch = statusFilter === 'all' || reservationStatus === statusFilter;
//     const dateMatch = !dateFilter || reservation.checkIn >= dateFilter;
//     return statusMatch && dateMatch;
//   });

//   return (
//     <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
//       <div className="space-y-6">
//         <h1 className="text-3xl font-bold text-gray-900">Reservation Management</h1>
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="flex items-center space-x-2">
//               <Filter size={20} className="text-gray-400" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="checked-in">Checked In</option>
//                 <option value="checked-out">Checked Out</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//             <div className="flex items-center space-x-2">
//               <Calendar size={20} className="text-gray-400" />
//               <input
//                 type="date"
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>

//           {apiError && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
//               {apiError}
//             </div>
//           )}

//           {loading ? (
//             <div className="text-center py-10">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//               <p className="mt-2 text-gray-600">Loading reservations...</p>
//             </div>
//           ) : filteredReservations.length === 0 ? (
//             <div className="text-center py-10">
//               <p className="text-gray-500">No reservations found.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                     {canManage && (
//                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredReservations.map((reservation) => (
//                     <tr key={getReservationId(reservation)} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                         {reservation.customerName || reservation.guestName || 'N/A'}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         {new Date(reservation.checkIn).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-500">
//                         {new Date(reservation.checkOut).toLocaleDateString()}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(getReservationStatus(reservation))}`}>
//                           {getReservationStatus(reservation)}
//                         </span>
//                       </td>
//                       {canManage && (
//                         <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
//                           {getReservationStatus(reservation) === 'pending' && (
//                             <button
//                               onClick={() => handleConfirmReservation(getReservationId(reservation))}
//                               className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
//                               disabled={loading}
//                               title="Confirm this reservation"
//                             >
//                               Confirm
//                             </button>
//                           )}
//                           <button
//                             onClick={() => openModal(reservation)}
//                             className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
//                             title="View full reservation details"
//                           >
//                             View Details
//                           </button>
//                           <select
//                             value={getReservationStatus(reservation)}
//                             onChange={(e) => handleUpdateStatus(getReservationId(reservation), e.target.value as Reservation['status'])}
//                             className="text-xs border rounded px-2 py-1"
//                             disabled={loading}
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="confirmed">Confirmed</option>
//                             <option value="checked-in">Checked In</option>
//                             <option value="checked-out">Checked Out</option>
//                             <option value="cancelled">Cancelled</option>
//                           </select>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>

//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {showModal && selectedReservation && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden">
//               <div className="bg-gradient-to-r from-teal-700 to-teal-800 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-xl font-bold text-white">Reservation Details</h2>
//                   <button
//                     onClick={closeModal}
//                     className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                   >
//                     <X className="h-5 w-5 text-white" />
//                   </button>
//                 </div>
//               </div>
              
//               <div className="p-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-4">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center">
//                         <User className="h-6 w-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-slate-900">{selectedReservation.customerName}</h3>
//                         <p className="text-sm text-slate-600">{selectedReservation.confirmationCode}</p>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-3">
//                       <div className="flex items-center space-x-2">
//                         <User className="h-4 w-4 text-slate-400" />
//                         <span className="text-sm text-slate-600">Email:</span>
//                         <span className="text-sm text-slate-900">{selectedReservation.customerEmail}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Bell className="h-4 w-4 text-slate-400" />
//                         <span className="text-sm text-slate-600">Phone:</span>
//                         <span className="text-sm text-slate-900">{selectedReservation.customerPhone}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Hotel className="h-4 w-4 text-slate-400" />
//                         <span className="text-sm text-slate-600">Room:</span>
//                         <span className="text-sm text-slate-900">{selectedReservation.room?.roomNumber} - {selectedReservation.room?.roomType}</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Users className="h-4 w-4 text-slate-400" />
//                         <span className="text-sm text-slate-600">Guests:</span>
//                         <span className="text-sm text-slate-900">{selectedReservation.guests || selectedReservation.adults} Total</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div className="bg-slate-50 rounded-lg p-4">
//                       <h4 className="font-medium text-slate-900 mb-3">Stay Information</h4>
//                       <div className="space-y-2">
//                         <div className="flex justify-between">
//                           <span className="text-sm text-slate-600">Check-in:</span>
//                           <span className="text-sm font-medium text-slate-900">
//                             {new Date(selectedReservation.checkIn).toLocaleDateString('en-US', { 
//                               weekday: 'short', 
//                               year: 'numeric', 
//                               month: 'short', 
//                               day: 'numeric' 
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-sm text-slate-600">Check-out:</span>
//                           <span className="text-sm font-medium text-slate-900">
//                             {new Date(selectedReservation.checkOut).toLocaleDateString('en-US', { 
//                               weekday: 'short', 
//                               year: 'numeric', 
//                               month: 'short', 
//                               day: 'numeric' 
//                             })}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-sm text-slate-600">Payment:</span>
//                           <span className="text-sm font-medium text-slate-900">
//                             {selectedReservation.paymentMethod} ({selectedReservation.paymentStatus})
//                           </span>
//                         </div>
//                         <div className="flex justify-between border-t pt-2">
//                           <span className="text-sm font-medium text-slate-900">Total Amount:</span>
//                           <span className="text-lg font-bold text-slate-900">${selectedReservation.totalAmount}</span>
//                         </div>
//                       </div>
//                     </div>
                    
//                     {selectedReservation.specialRequest && (
//                       <div className="bg-amber-50 rounded-lg p-4">
//                         <h4 className="font-medium text-amber-900 mb-2">Special Request</h4>
//                         <p className="text-sm text-amber-800">{selectedReservation.specialRequest}</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="mt-6 flex justify-end">
//                   <button
//                     onClick={closeModal}
//                     className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
//                   >
//                     Close
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//     </div>
//   );
// };

// export default ReservationsManagement;

"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Download, Plus } from 'lucide-react';
import { BookingTable } from './components/booking-table';
import { BookingFilters } from './components/booking-filters';
import { BookingStatus, PaymentStatus } from '@/types/booking';
import { sampleBookings } from '@/data/sample-bookings';

export default function Home() {
  const [activeStatus, setActiveStatus] = useState<BookingStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('All');

  // Filter bookings based on current filters
  const filteredBookings = useMemo(() => {
    let filtered = sampleBookings;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.customer.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by payment status
    if (paymentStatus !== 'All') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentStatus);
    }

    return filtered;
  }, [searchQuery, paymentStatus]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
          
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Show tabs
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2 bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4" />
              New Booking
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BookingFilters
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            paymentStatus={paymentStatus}
            onPaymentStatusChange={setPaymentStatus}
          />
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {sampleBookings.length} bookings
          </p>
        </div>

        {/* Bookings Table */}
        <BookingTable bookings={filteredBookings} />
      </div>
    </div>
  );
}