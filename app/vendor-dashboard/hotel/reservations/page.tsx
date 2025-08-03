"use client";

import { useState, useEffect } from "react";
import { apiFetcher } from "@/app/lib/fetcher";
import {
  Search,
  Bell,
  ChevronDown,
  MoreHorizontal,
  Filter,
  Download,
  Plus,
  X,
} from "lucide-react";



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
  // const [form, setForm] = useState<Room>({ id: '', roomNumber: "", type: "", price: 0, status: "Available", guests: 1 });
  // const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [searchTerm]);

  async function fetchRooms() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      const query = new URLSearchParams(params).toString();
      const url = `/api/vendor/hotel-rooms${query ? `?${query}` : ""}`;
      const data = await apiFetcher(url);
      setRooms(data || []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }

  // async function handleCreateOrEditRoom(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   setFormLoading(true);
  //   try {
  //     if (modalType === "edit") {
  //       await axios.put(`/api/vendor/hotel-rooms/${form.id}`, form);
  //     } else {
  //       await axios.post(`/api/vendor/hotel-rooms`, form);
  //     }
  //     setShowModal(false);
  //     setForm({ id: '', roomNumber: "", type: "", price: 0, status: "Available", guests: 1 });
  //     fetchRooms();
  //   } catch {
  //     // handle error
  //   } finally {
  //     setFormLoading(false);
  //   }
  // }

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
                  <MultiRoomForm
                    isEdit={modalType === "edit"}
                    onClose={() => setShowModal(false)}
                    fetchRooms={fetchRooms}
                    selectedRoom={selectedRoom}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// MultiRoomForm component for adding multiple rooms at once
interface RoomForm extends Room {
  quality?: string;
  stars?: number;
  description?: string;
  amenities?: string;
}
function MultiRoomForm({ isEdit, onClose, fetchRooms, selectedRoom }: { isEdit: boolean, onClose: () => void, fetchRooms: () => void, selectedRoom: Room | null }) {
  const [roomForms, setRoomForms] = useState<RoomForm[]>(
    isEdit && selectedRoom
      ? [{ ...selectedRoom }]
      : Array(5).fill(null).map(() => ({ id: '', roomNumber: '', type: '', price: 0, status: 'Available', guests: 1, quality: '', stars: 1, description: '', amenities: '' }))
  );
  const [loading, setLoading] = useState(false);
  const [roomImages, setRoomImages] = useState<File[][]>(Array(5).fill([]));
  const [imagePreviews, setImagePreviews] = useState<string[][]>(Array(5).fill([]));
  const [imageErrors, setImageErrors] = useState<string[]>(Array(5).fill(""));

  const handleRoomChange = (idx: number, field: string, value: string | number) => {
    setRoomForms(forms => forms.map((room, i) => i === idx ? { ...room, [field]: value } : room));
  };

  const handleImageChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 5 || files.length > 10) {
      setImageErrors(errors => errors.map((err, i) => i === idx ? "Please select 5 to 10 images." : err));
      setRoomImages(imgs => imgs.map((arr, i) => i === idx ? [] : arr));
      setImagePreviews(previews => previews.map((arr, i) => i === idx ? [] : arr));
      return;
    }
    setImageErrors(errors => errors.map((err, i) => i === idx ? "" : err));
    setRoomImages(imgs => imgs.map((arr, i) => i === idx ? files : arr));
    setImagePreviews(previews => previews.map((arr, i) => i === idx ? files.map(file => URL.createObjectURL(file)) : arr));
  };

  const handleAddRooms = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validRooms = roomForms.filter(r => r.roomNumber && r.type && r.price && r.guests);
      if (validRooms.length === 0) return;
      // Upload images for each room
      const uploadedImagesPerRoom: string[][] = [];
      for (let i = 0; i < validRooms.length; i++) {
        let uploadedImageUrls: string[] = [];
        if (roomImages[i] && roomImages[i].length > 0) {
          const formData = new FormData();
          roomImages[i].forEach(img => formData.append("images", img));
          const data = await apiFetcher("/api/vendor/hotel-rooms/images", {
            method: "POST",
            body: formData
          });
          uploadedImageUrls = data.urls || [];
        }
        uploadedImagesPerRoom.push(uploadedImageUrls);
      }
      await apiFetcher("/api/vendor/hotel-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rooms: validRooms, roomImages: uploadedImagesPerRoom })
      });
      fetchRooms();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAddRooms} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold mb-4 text-center text-teal-700">{isEdit ? "Edit Room" : "Add Rooms (at least 5 at once)"}</h2>
      {roomForms.map((room, idx) => (
        <div key={idx} className="mb-8 rounded-lg shadow-sm border bg-gray-50 p-4">
          {/* Room Images Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-teal-800">Room Images (5-10 images)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => handleImageChange(idx, e)}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            {imageErrors[idx] && <div className="text-red-600 text-xs mt-1">{imageErrors[idx]}</div>}
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews[idx] && imagePreviews[idx].map((src, i) => (
                <img key={i} src={src} alt="preview" className="w-20 h-20 object-cover rounded border" />
              ))}
            </div>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-lg text-teal-800">Room {idx + 1}</span>
            <span className="text-xs text-gray-400">Fill all required fields</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-medium mb-1">Room Number *</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Room Number" value={room.roomNumber} onChange={e => handleRoomChange(idx, 'roomNumber', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type *</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Type (e.g. Deluxe, Suite)" value={room.type} onChange={e => handleRoomChange(idx, 'type', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (₦) *</label>
              <input type="number" className="w-full border rounded px-3 py-2" placeholder="Price (₦)" value={room.price} min={0} onChange={e => handleRoomChange(idx, 'price', Number(e.target.value))} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stars</label>
              <input type="number" className="w-full border rounded px-3 py-2" placeholder="Stars" value={room.stars || 1} min={1} max={5} onChange={e => handleRoomChange(idx, 'stars', Number(e.target.value))} />
              <span className="text-xs text-gray-400">1-5 stars</span>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quality</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Quality" value={room.quality || ''} onChange={e => handleRoomChange(idx, 'quality', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Guests *</label>
              <input type="number" className="w-full border rounded px-3 py-2" placeholder="Guests" value={room.guests} min={1} onChange={e => handleRoomChange(idx, 'guests', Number(e.target.value))} required />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Description" value={room.description || ''} onChange={e => handleRoomChange(idx, 'description', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amenities <span className="text-xs text-gray-400">(comma separated)</span></label>
            <input type="text" className="w-full border rounded px-3 py-2" placeholder="Amenities (comma separated)" value={room.amenities || ''} onChange={e => handleRoomChange(idx, 'amenities', e.target.value)} />
          </div>
        </div>
      ))}
      <button type="submit" className="w-full bg-gradient-to-r from-teal-600 to-blue-500 text-white py-3 rounded-lg font-semibold text-lg shadow hover:from-teal-700 hover:to-blue-600 transition-all duration-200" disabled={loading}>
        {loading ? <span className="animate-pulse">Adding...</span> : isEdit ? "Update Room" : "Add Room(s)"}
      </button>
    </form>
  );
}
