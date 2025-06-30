export type RoomType = "single" | "double" | "suite" | string;

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  price: number;
  amenities: string[];
}