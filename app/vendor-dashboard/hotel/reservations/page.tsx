"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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

// API endpoints to be implemented by backend:
// GET /api/vendor/hotel-rooms
// POST /api/vendor/hotel-rooms
// PUT /api/vendor/hotel-rooms/:id
// DELETE /api/vendor/hotel-rooms/:id

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  price: number;
  status: string;
  guests: number;
}

export default function HotelRooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"view"|"edit"|"create"|null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room|null>(null);
  const [form, setForm] = useState<Room>({ id: '', roomNumber: "", type: "", price: 0, status: "Available", guests: 1 });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [searchTerm]);

  async function fetchRooms() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      const res = await axios.get("/api/vendor/hotel-rooms", { params });
      setRooms(res.data || []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrEditRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (modalType === "edit") {
        await axios.put(`/api/vendor/hotel-rooms/${form.id}`, form);
      } else {
        await axios.post(`/api/vendor/hotel-rooms`, form);
      }
      setShowModal(false);
      setForm({ id: '', roomNumber: "", type: "", price: 0, status: "Available", guests: 1 });
      fetchRooms();
    } catch {
      // handle error
    } finally {
      setFormLoading(false);
    }
  }

  const statusOptions = ["Available", "Occupied", "Maintenance"];

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
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JE</span>
                </div>
                <span className="text-sm font-medium">Vendor Name</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Room List</h1>
              <button className="text-sm text-gray-500 hover:text-gray-700">Hide tabs</button>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50" title="Export">
                <Download className="w-4 h-4" />
              </button>
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                onClick={() => { setShowModal(true); setModalType("create"); setSelectedRoom(null); }}
              >
                <Plus className="w-4 h-4" />
                <span>Add Room</span>
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status filters if needed */}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by room number or type"
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>Status</option>
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
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
                        Room Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.roomNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${room.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${room.status === "Available" ? "bg-green-100 text-green-800" : room.status === "Occupied" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.guests}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative">
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => { setShowModal(true); setModalType("view"); setSelectedRoom(room); }}
                            >
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
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
          {/* Modal for View/Edit/Create Room */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5" />
                </button>
                {modalType === "view" && selectedRoom && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Room Details</h2>
                    <div className="mb-2"><b>Room Number:</b> {selectedRoom.roomNumber}</div>
                    <div className="mb-2"><b>Type:</b> {selectedRoom.type}</div>
                    <div className="mb-2"><b>Price:</b> ${selectedRoom.price}</div>
                    <div className="mb-2"><b>Status:</b> {selectedRoom.status}</div>
                    <div className="mb-2"><b>Guests:</b> {selectedRoom.guests}</div>
                  </div>
                )}
                {(modalType === "edit" || modalType === "create") && (
                  <form onSubmit={handleCreateOrEditRoom} className="space-y-4">
                    <h2 className="text-xl font-bold mb-4">{modalType === "edit" ? "Edit" : "Add"} Room</h2>
                    <input type="text" className="w-full border rounded px-3 py-2" placeholder="Room Number" value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} required />
                    <input type="text" className="w-full border rounded px-3 py-2" placeholder="Type (e.g. Deluxe, Suite)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required />
                    <input type="number" className="w-full border rounded px-3 py-2" placeholder="Price" value={form.price} min={0} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required />
                    <select className="w-full border rounded px-3 py-2" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <input type="number" className="w-full border rounded px-3 py-2" placeholder="Guests" value={form.guests} min={1} onChange={e => setForm({ ...form, guests: Number(e.target.value) })} required />
                    <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700" disabled={formLoading}>
                      {formLoading ? "Saving..." : modalType === "edit" ? "Update Room" : "Add Room"}
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
