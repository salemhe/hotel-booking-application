export type RoomType = "single" | "double" | "suite" | string;

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  price: number;
  amenities: string[];
}

export interface RoomTypes {
  id: string;
  name: string;
  description?: string;
  pricePerNight: number;
  adultsCapacity: number;
  childrenCapacity: number;
  totalAvailableRooms: number;
  amenities: string[];
  images: File[];
}

export interface RoomConfigurationData {
  roomTypes: RoomType[];
}

export const defaultAmenities = [
  'Wi-Fi',
  'TV',
  'AC',
  'Balcony',
  'Mini Fridge',
  'Workspace',
  'Breakfast',
  'Safe'
];