"use client"
import { useState, useEffect } from 'react';
// import API from '@/app/lib/api/axios';
import { Button } from '../button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../dialog';
import { Input } from '../input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../table-hotel';

interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  amenities: string[];
}

interface RoomManagementProps {
  hotelId: string;
  userRole: string;
}

// Dummy room data for development
const DUMMY_ROOMS: Room[] = [
  {
    id: "room_001",
    number: "101",
    type: "Standard",
    price: 25000,
    amenities: ["WiFi", "TV", "AC", "Private Bathroom"]
  },
  {
    id: "room_002",
    number: "102",
    type: "Deluxe",
    price: 45000,
    amenities: ["WiFi", "TV", "AC", "Private Bathroom", "Mini Bar", "Ocean View"]
  },
  {
    id: "room_003",
    number: "201",
    type: "Suite",
    price: 85000,
    amenities: ["WiFi", "TV", "AC", "Private Bathroom", "Mini Bar", "Ocean View", "Balcony", "Jacuzzi"]
  },
  {
    id: "room_004",
    number: "202",
    type: "Standard",
    price: 25000,
    amenities: ["WiFi", "TV", "AC", "Private Bathroom"]
  },
  {
    id: "room_005",
    number: "301",
    type: "Presidential Suite",
    price: 150000,
    amenities: ["WiFi", "TV", "AC", "Private Bathroom", "Mini Bar", "Ocean View", "Balcony", "Jacuzzi", "Kitchen", "Living Room"]
  },
  {
    id: "room_006",
    number: "302",
    type: "Deluxe",
    price: 45000,
    amenities: ["WiFi", "TV", "AC", "Private Bathroom", "Mini Bar", "City View"]
  }
];

export function RoomManagement({ hotelId, userRole }: RoomManagementProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ number: '', type: '', price: 0, amenities: '' });

  useEffect(() => {
    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  const fetchRooms = async () => {
    if (!hotelId) {
      console.error('Hotel ID is required');
      return;
    }

    try {
      // For development, use dummy data instead of API call
      // Comment out the API call and use dummy data
      /*
      const response = await API.get(`/hotels/${hotelId}/rooms`);
      setRooms(response.data);
      */

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use dummy data for development
      setRooms(DUMMY_ROOMS);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleAddRoom = async () => {
    if (!hotelId) {
      console.error('Hotel ID is required');
      return;
    }

    try {
      // For development, use dummy data instead of API call
      // Comment out the API call and use dummy data
      /*
      await API.post(`/hotels/${hotelId}/rooms`, {
        ...newRoom,
        amenities: newRoom.amenities.split(',').map(item => item.trim())
      });
      */

      // Simulate adding a new room to dummy data
      const newRoomData: Room = {
        id: `room_${Date.now()}`,
        number: newRoom.number,
        type: newRoom.type,
        price: newRoom.price,
        amenities: newRoom.amenities.split(',').map(item => item.trim())
      };

      setRooms(prevRooms => [...prevRooms, newRoomData]);
      setIsModalOpen(false);
      setNewRoom({ number: '', type: '', price: 0, amenities: '' });
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!hotelId) {
      console.error('Hotel ID is required');
      return;
    }

    try {
      // For development, use dummy data instead of API call
      // Comment out the API call and use dummy data
      /*
      await API.delete(`/hotels/${hotelId}/rooms/${roomId}`);
      fetchRooms();
      */

      // Simulate deleting a room from dummy data
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Room Management</h2>
        {userRole !== 'HotelOwner' && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Room</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Room</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Room Number"
                  value={newRoom.number}
                  onChange={e => setNewRoom({ ...newRoom, number: e.target.value })}
                />
                <Input
                  placeholder="Room Type"
                  value={newRoom.type}
                  onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newRoom.price}
                  onChange={e => setNewRoom({ ...newRoom, price: parseFloat(e.target.value) })}
                />
                <Input
                  placeholder="Amenities (comma-separated)"
                  value={newRoom.amenities}
                  onChange={e => setNewRoom({ ...newRoom, amenities: e.target.value })}
                />
                <Button onClick={handleAddRoom}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Amenities</TableHead>
            {userRole !== 'HotelOwner' && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map(room => (
            <TableRow key={room.id}>
              <TableCell>{room.number}</TableCell>
              <TableCell>{room.type}</TableCell>
              <TableCell>${room.price}</TableCell>
              <TableCell>{room.amenities.join(', ')}</TableCell>
              {userRole !== 'HotelOwner' && (
                <TableCell>
                  <Button variant="destructive" onClick={() => handleDeleteRoom(room.id)}>
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}