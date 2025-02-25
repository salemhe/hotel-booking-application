import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";

// const menuList = {
//   id: 1,
//   name: "Jollof Rice & Chicken",
//   cuisine: "Nigerian",
//   image: "/hero-bg.jpg",
//   category: "Main Course",
//   price: 1500,
// };

interface dataType {
  _id: string;
  vendor: string;
  itemName: string;
  description: string;
  price: number;
  category: string;
  itemImage: string;
}

const MenuItem = ({ data }: { data: dataType }) => {
  const { _id, itemName, itemImage, category, price } = data;

  return (
    <div className="w-full max-w-sm bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl p-6 border border-gray-200">
      {/* Image Section with Gradient Overlay */}
      <div className="relative w-full h-56 rounded-xl overflow-hidden">
        <Image
          src={`https://hotel-booking-app-backend-30q1.onrender.com/uploads/${itemImage}` || "/hero-bg.jpg"}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
          alt={itemName}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="py-4 space-y-2">
        <h3 className="text-2xl font-semibold text-gray-900 truncate">
          {itemName}
        </h3>
        <p className="text-sm text-gray-600">
          {/* <span className="font-medium text-gray-800">Cuisine:</span> {vendor}{" "}
          |  */}
          <span className="font-medium text-gray-800">Category:</span>{" "}
          {category}
        </p>
        <p className="text-xl font-bold text-indigo-600">₦{price}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-5">
        <Link href={`menu/${_id}`} className="flex items-center gap-2">
          <Button
            variant="outline"
            className="px-4 py-2 text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
          >
            <Pencil size={18} /> Edit
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="icon"
          className="hover:scale-110 transition-all"
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default MenuItem;
