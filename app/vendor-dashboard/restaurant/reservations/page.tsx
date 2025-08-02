"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import {
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal,
  Filter,
  Download,
  Plus,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";



interface Reservation {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  mealPreselected: boolean;
  paymentStatus: string;
  reservationStatus: string;
}

export default function RestaurantReservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"view"|"edit"|"create"|null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation|null>(null);
  const [form, setForm] = useState<Reservation>({ id: '', name: "", email: "", date: "", time: "", guests: 1, mealPreselected: false, paymentStatus: "Paid", reservationStatus: "Upcoming" });
  const [formLoading, setFormLoading] = useState(false);
  const [vendorProfile, setVendorProfile] = useState<{ name: string; profileImage?: string }>({ name: '', profileImage: '' });
  const [socketAlert, setSocketAlert] = useState<{reservation: Reservation}|null>(null);

  useEffect(() => {
    fetchReservations();
    fetchVendorProfile();
  }, [searchTerm, filterStatus]);

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    // You may want to use your actual backend URL here
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    let socket: Socket | null = null;
    try {
      socket = io(BASE_URL);
      socket.on("connect", () => {
        // console.log("WebSocket connected");
      });
      socket.on("bookingsUpdate", (reservation: Reservation) => {
        setSocketAlert({ reservation });
        fetchReservations(); // Optionally refresh the list
      });
      socket.on("connect_error", () => {
        // console.error("Socket connection error");
      });
    } catch {
      // console.error("Socket error");
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  async function fetchVendorProfile() {
    try {
      const { AuthService } = await import("@/app/lib/api/services/auth.service");
      const user = AuthService.getUser();
      if (user && user.id) {
        const realProfile = await AuthService.fetchMyProfile(user.id);
        if (realProfile) {
          setVendorProfile({
            name: realProfile.businessName || realProfile.name || '',
            profileImage: realProfile.profileImage || ''
          });
        }
      }
    } catch {
      setVendorProfile({ name: '', profileImage: '' });
    }
  }

  async function fetchReservations() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus && filterStatus !== "All") params.status = filterStatus;
      const res = await axios.get("/api/vendor/reservations", { params });
      setReservations(res.data || []);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrEditReservation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (modalType === "edit") {
        await axios.put(`/api/vendor/reservations/${form.id}`, form);
        toast.success("Reservation updated successfully!");
      } else {
        await axios.post(`/api/vendor/reservations`, form);
        toast.success("Reservation created successfully!");
      }
      setShowModal(false);
      setForm({ id: '', name: "", email: "", date: "", time: "", guests: 1, mealPreselected: false, paymentStatus: "Paid", reservationStatus: "Upcoming" });
      fetchReservations();
    } catch {
      toast.error("Failed to save reservation. Please try again.");
    } finally {
      setFormLoading(false);
    }
  }

  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pay at Restaurant":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getReservationStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "In 30 mins":
        return "bg-orange-100 text-orange-800";
      case "In 1 hour":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusFilters = ["All", "Upcoming", "Completed", "Canceled", "No shows"];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-400" />
              <div className="flex items-center space-x-2">
                {vendorProfile.profileImage ? (
                  <img
                    src={vendorProfile.profileImage}
                    alt={vendorProfile.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {vendorProfile.name.trim().length > 0 ? vendorProfile.name.split(" ").map(n => n[0]).join("") : "?"}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{vendorProfile.name || "Vendor"}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {socketAlert && (
            <div className="mb-4 p-4 rounded bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 flex items-center justify-between">
              <div>
                <b>New Reservation Alert:</b> {socketAlert.reservation.name} ({socketAlert.reservation.paymentStatus}) for {socketAlert.reservation.date} at {socketAlert.reservation.time}
              </div>
              <button
                className="ml-4 px-3 py-1 rounded bg-yellow-200 hover:bg-yellow-300 text-yellow-900"
                onClick={() => setSocketAlert(null)}
              >
                Dismiss
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Reservation List</h1>
              <button className="text-sm text-gray-500 hover:text-gray-700">Hide tabs</button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" title="Export">
                <Download className="w-4 h-4" />
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                onClick={() => { setShowModal(true); setModalType("create"); setSelectedReservation(null); }}
              >
                <Plus className="w-4 h-4" />
                <span>New Reservation</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* ...stats cards if needed... */}
          </div>
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {statusFilters.map((status) => (
                    <button
                      key={status}
                      className={`px-3 py-1 text-sm rounded-md ${
                        filterStatus === status
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by guest name or ID"
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Payment Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                  </select>
                  <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 ml-1" title="Advanced Filter">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No of Guests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Meal Preselected
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reservation Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-medium">EJ</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                              <div className="text-sm text-gray-500">{reservation.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reservation.date}</div>
                          <div className="text-sm text-gray-500">{reservation.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reservation.guests}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {reservation.mealPreselected ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <X className="w-5 h-5 text-red-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(reservation.paymentStatus)}`}
                          >
                            {reservation.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReservationStatusColor(reservation.reservationStatus)}`}
                          >
                            {reservation.reservationStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => { setShowModal(true); setModalType("view"); setSelectedReservation(reservation); }}
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                            {/* Dropdown for edit/delete can be added here */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Pagination can be added here */}
          </div>
          {/* Modal for View/Edit/Create Reservation */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5" />
                </button>
                {modalType === "view" && selectedReservation && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Reservation Details</h2>
                    <div className="mb-2"><b>Name:</b> {selectedReservation.name}</div>
                    <div className="mb-2"><b>Email:</b> {selectedReservation.email}</div>
                    <div className="mb-2"><b>Date:</b> {selectedReservation.date}</div>
                    <div className="mb-2"><b>Time:</b> {selectedReservation.time}</div>
                    <div className="mb-2"><b>Guests:</b> {selectedReservation.guests}</div>
                    <div className="mb-2"><b>Meal Preselected:</b> {selectedReservation.mealPreselected ? "Yes" : "No"}</div>
                    <div className="mb-2"><b>Payment Status:</b> {selectedReservation.paymentStatus}</div>
                    <div className="mb-2"><b>Reservation Status:</b> {selectedReservation.reservationStatus}</div>
                  </div>
                )}
                {(modalType === "edit" || modalType === "create") && (
                  <form onSubmit={handleCreateOrEditReservation} className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">{modalType === "edit" ? "Edit" : "New"} Reservation</h2>
                    <input type="text" className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    <input type="email" className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <input type="date" className="w-full border rounded px-3 py-2" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                    <input type="time" className="w-full border rounded px-3 py-2" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
                    <input type="number" className="w-full border rounded px-3 py-2" placeholder="Guests" value={form.guests} min={1} onChange={e => setForm({ ...form, guests: Number(e.target.value) })} required />
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={form.mealPreselected} onChange={e => setForm({ ...form, mealPreselected: e.target.checked })} />
                      <span>Meal Preselected</span>
                    </div>
                    <select className="w-full border rounded px-3 py-2" value={form.paymentStatus} onChange={e => setForm({ ...form, paymentStatus: e.target.value })}>
                      <option value="Paid">Paid</option>
                      <option value="Pay at Restaurant">Pay at Restaurant</option>
                    </select>
                    <select className="w-full border rounded px-3 py-2" value={form.reservationStatus} onChange={e => setForm({ ...form, reservationStatus: e.target.value })}>
                      <option value="Upcoming">Upcoming</option>
                      <option value="In 30 mins">In 30 mins</option>
                      <option value="In 1 hour">In 1 hour</option>
                      <option value="Completed">Completed</option>
                      <option value="Canceled">Canceled</option>
                      <option value="No shows">No shows</option>
                    </select>
                    <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700" disabled={formLoading}>
                      {formLoading ? "Saving..." : modalType === "edit" ? "Update Reservation" : "Create Reservation"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
