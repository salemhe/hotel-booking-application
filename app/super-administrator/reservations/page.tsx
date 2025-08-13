/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { apiFetcher } from "@/app/lib/fetcher";
// axios removed, use apiFetcher

// Define the Reservation type
export type Reservation = {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  mealPreselected: boolean;
  paymentStatus: string;
  reservationStatus: string;
  // Add other fields as needed
};
import {
  Search,
  Bell,
  ChevronDown,
   MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  CreditCard,
  Filter,
  Download,
  Plus,
  Check,
  X,
} from "lucide-react";

// API_URL removed, use apiFetcher with path only


function ReservationDropdown({ reservation, onView, onEdit, onDelete }: { reservation: Reservation, onView: (r: Reservation) => void, onEdit: (r: Reservation) => void, onDelete: (r: Reservation) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="text-gray-400 hover:text-gray-600"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg">
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => { setOpen(false); onView(reservation); }}
          >
            View
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => { setOpen(false); onEdit(reservation); }}
          >
            Edit
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            onClick={() => { setOpen(false); onDelete(reservation); }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function RestaurantDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  interface Stats {
    reservationsToday: number;
    reservationsChange: number;
    prepaidReservations: number;
    prepaidChange: number;
    guestsToday: number;
    guestsChange: number;
    pendingPayments: number;
    paymentsChange: number;
  }
  const [stats, setStats] = useState<Stats>({
    reservationsToday: 0,
    reservationsChange: 0,
    prepaidReservations: 0,
    prepaidChange: 0,
    guestsToday: 0,
    guestsChange: 0,
    pendingPayments: 0,
    paymentsChange: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"view"|"edit"|"create"|null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation|null>(null);
  const [form, setForm] = useState<Reservation>({ id: '', name: "", email: "", date: "", time: "", guests: 1, mealPreselected: false, paymentStatus: "Paid", reservationStatus: "Upcoming" });
  const [formLoading, setFormLoading] = useState(false);
  
  useEffect(() => {
    fetchStats();
    fetchReservations();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, [searchTerm, filterStatus]);

  async function fetchStats() {
    try {
      const res = await apiFetcher(`/api/super-admin/analytics/summary`);
      setStats({
        reservationsToday: Number(res.data?.reservationsToday) || 0,
        reservationsChange: Number(res.data?.reservationsChange) || 0,
        prepaidReservations: Number(res.data?.prepaidReservations) || 0,
        prepaidChange: Number(res.data?.prepaidChange) || 0,
        guestsToday: Number(res.data?.guestsToday) || 0,
        guestsChange: Number(res.data?.guestsChange) || 0,
        pendingPayments: Number(res.data?.pendingPayments) || 0,
        paymentsChange: Number(res.data?.paymentsChange) || 0,
      });
    } catch {
      setStats({
        reservationsToday: 0,
        reservationsChange: 0,
        prepaidReservations: 0,
        prepaidChange: 0,
        guestsToday: 0,
        guestsChange: 0,
        pendingPayments: 0,
        paymentsChange: 0,
      });
    }
  }

  async function fetchReservations() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus && filterStatus !== "All") params.status = filterStatus;
      const url = `/api/super-admin/reservations/today` + (Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : "");
      const res = await apiFetcher(url);
      setReservations(res.data || []);
    } catch {
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateReservation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    try {
      await apiFetcher(`/api/super-admin/reservations`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setForm({ id: '', name: "", email: "", date: "", time: "", guests: 1, mealPreselected: false, paymentStatus: "Paid", reservationStatus: "Upcoming" });
      fetchReservations();
    } catch {
      // handle error
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteReservation(reservation: Reservation) {
    if (!window.confirm("Are you sure you want to delete this reservation?")) return;
    try {
      await apiFetcher(`/api/super-admin/reservations/${reservation.id}`, {
        method: "DELETE",
      });
      fetchReservations();
    } catch {
      // handle error
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
      {/* Sidebar removed: now handled by layout.tsx */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
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
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{typeof window !== 'undefined' && localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!).profile.businessName?.split(' ').map((n: string) => n[0]).join('') : 'SA'}</span>
                </div>
                <span className="text-sm font-medium">{typeof window !== 'undefined' && localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!).profile.businessName : 'Super Admin'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Header */}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reservations made today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.reservationsToday ?? 0}</p>
                  <p className="text-xs text-gray-500">{stats.reservationsChange ? `${stats.reservationsChange}% vs last week` : ""}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prepaid Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.prepaidReservations ?? 0}</p>
                  <p className="text-xs text-gray-500">{stats.prepaidChange ? `${stats.prepaidChange}% vs last week` : ""}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expected Guests Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.guestsToday ?? 0}</p>
                  <p className="text-xs text-gray-500">{stats.guestsChange ? `${stats.guestsChange}% vs last week` : ""}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.pendingPayments ?? 0}</p>
                  <p className="text-xs text-gray-500">{stats.paymentsChange ? `${stats.paymentsChange}% vs last week` : ""}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
          {/* Filters and Search */}
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
            {/* Table */}
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
                          <ReservationDropdown
                            reservation={reservation}
                            onView={(res: Reservation) => { setShowModal(true); setModalType("view"); setSelectedReservation(res); }}
                            onEdit={(res: Reservation) => { setShowModal(true); setModalType("edit"); setSelectedReservation(res); setForm(res); }}
                            onDelete={handleDeleteReservation}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Pagination */}
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">Page 1 of 20</div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">1</button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">2</button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">3</button>
                <span className="px-3 py-1 text-sm text-gray-500">...</span>
                <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">10</button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">11</button>
                <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50">12</button>
              </div>
            </div>
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
                  <form onSubmit={handleCreateReservation} className="space-y-4">
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
