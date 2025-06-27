"use client";
import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X,
} from 'lucide-react';
import { AuthService } from '@/app/lib/api/services/auth.service';

import API from "@/app/lib/api/axios";

interface User {
  id: string;
  role: 'Super Admin' | 'Admin' | 'Hotel Owner';
  name: string;
}
interface Room {
  id: string;
  roomNumber: string;
  type: 'Single' | 'Double' | 'Suite' | 'Deluxe';
  price: number;
  amenities: string[];
  status: 'Available' | 'Occupied' | 'Maintenance';
}

interface RoomFormData {
  roomNumber: string;
  type: Room['type'];
  price: number;
  amenities: string[];
}

const mockRooms: Room[] = [
  {
    id: '1',
    roomNumber: '101',
    type: 'Single',
    price: 120,
    amenities: ['WiFi', 'AC', 'TV'],
    status: 'Available'
  },
  {
    id: '2',
    roomNumber: '102',
    type: 'Double',
    price: 180,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
    status: 'Occupied'
  },
  {
    id: '3',
    roomNumber: '201',
    type: 'Suite',
    price: 350,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],
    status: 'Available'
  }
];

const mockUser: User = {
  id: '1',
  role: 'Admin',
  name: 'John Doe'
};
const RoomsManagement: React.FC<{ user: User }> = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | undefined>();
  const [user] = useState<User>(mockUser);
  
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const canEdit = ['Super Admin', 'Admin'].includes(user?.role);

  const handleAddRoom = () => {
    setEditingRoom(undefined);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      setRooms(prev => prev.filter(room => room.id !== roomId));
    }
  };

  const handleSaveRoom = (roomData: RoomFormData) => {
    if (editingRoom) {
      setRooms(prev => prev.map(room => 
        room.id === editingRoom.id 
          ? { ...room, ...roomData }
          : room
      ));
    } else {
      const newRoom: Room = {
        id: Date.now().toString(),
        ...roomData,
        status: 'Available'
      };
      setRooms(prev => [...prev, newRoom]);
    }
  };

  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Occupied': return 'bg-red-100 text-red-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true)
        
        // Get the user data from AuthService
        const user = AuthService.getUser()
        if (!user) {
          console.warn("No user found in storage")
          setLoading(false)
          return
        }

        // Get the token
        const token = AuthService.getToken()
        if (!token) {
          console.warn("No token found")
          setLoading(false)
          return
        }
        // Fetch vendors data
        const response = await API.get(`vendors`)
console.log(response)
        if (response.data && Array.isArray(response.data)) {
          // Find the vendor that matches the logged-in user's email
          const loggedInVendor = response.data.find(
            (vendor: VendorProfile) => vendor.email === user.email
          )

          if (loggedInVendor) {
            setProfile(loggedInVendor)
            console.log(loggedInVendor)
            // Store role in localStorage for ProtectedRoute
            localStorage.setItem("role", loggedInVendor.role)
          } else {
            console.warn("Logged in user not found in vendors list")
          }
        } else {
          console.warn("Invalid vendors data format")
        }
      } catch (error: unknown) {
        console.error("Failed to fetch vendor data:", error)
        interface ApiError {
          response: {
            status: number;
            data: unknown;
          };
        }
        if (error && typeof error === 'object' && 'response' in error) {
          const apiError = error as ApiError;
          console.error("Error response:", apiError.response.status, apiError.response.data);
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchVendorData()
  }, [])


  // useEffect(() => {
  //   fetchRooms();
  // }, []);
      
  return (
    <div className="min-h-screen text-gray-900 p-4 sm:p-6 lg:p-8">
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Room Management</h1>
        {canEdit && (
          <button
            onClick={handleAddRoom}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Add Room
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
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
                  Amenities
                </th>
                {canEdit && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {room.roomNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {room.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${room.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.map(amenity => (
                        <span key={amenity} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={editingRoom}
        onSave={handleSaveRoom}
      />
    </div>
    </div>
  );
};

export default RoomsManagement;

const RoomModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  room?: Room;
  onSave: (roomData: RoomFormData) => void;
}> = ({ isOpen, onClose, room, onSave }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    roomNumber: room?.roomNumber || '',
    type: room?.type || 'Single',
    price: room?.price || 0,
    amenities: room?.amenities || []
  });

  const amenityOptions = ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Room Service', 'Safe'];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {room ? 'Edit Room' : 'Add New Room'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Number
            </label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, roomNumber: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Room['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price per Night ($)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {amenityOptions.map(amenity => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="mr-2"
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {room ? 'Update' : 'Add'} Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
