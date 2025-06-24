"use client"
import { Room } from "@/types/rooms";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (room: Partial<Room>) => void;
  initial?: Room | null;
}

const emptyRoom: Partial<Room> = {
  roomNumber: "",
  type: "",
  price: 0,
  amenities: [],
};

export default function RoomModal({ open, onClose, onSave, initial }: Props) {
  const [form, setForm] = useState<Partial<Room>>(initial || emptyRoom);

  // Reset form when modal opens/closes
  useEffect(() => {
    setForm(initial || emptyRoom);
  }, [open, initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "price" ? Number(value) : value }));
  };

  const handleAmenities = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((prev) => ({
      ...prev,
      amenities: val.split(",").map((a) => a.trim()),
    }));
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-400" onClick={onClose}>✕</button>
        <h2 className="text-xl mb-4">{initial ? "Edit Room" : "Add Room"}</h2>
        <form
          className="space-y-4"
          onSubmit={e => {
            e.preventDefault();
            onSave(form);
          }}
        >
          <input
            name="roomNumber"
            value={form.roomNumber || ""}
            onChange={handleChange}
            placeholder="Room Number"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="type"
            value={form.type || ""}
            onChange={handleChange}
            placeholder="Type (single, double, suite)"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price || 0}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="amenities"
            value={(form.amenities || []).join(", ")}
            onChange={handleAmenities}
            placeholder="Amenities (comma separated)"
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="bg-gray-200 px-3 py-1 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">{initial ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}