import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";

const menuList = {
  id: 1,
  name: "Jollof Rice & Chicken",
  cuisine: "Nigerian",
  image: "/hero-bg.jpg",
  category: "Main Course",
  price: 1500,
};

const MenuItem = () => {
  const { id, name, cuisine, image, category, price } = menuList;

  return (
    <div
      key={id}
      className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl p-5"
    >
      {/* Image Section */}
      <div className="relative w-full h-56">
        <Image
          src={image}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
          alt={name}
        />
      </div>

      {/* Content Section */}
      <div className="py-4">
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium">Cuisine:</span> {cuisine} |{" "}
          <span className="font-medium">Category:</span> {category}
        </p>
        <p className="text-lg font-bold text-primary mt-2">${price}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline">
          <Link href={`menu/${id}`} className="flex items-center gap-2">
            <Pencil size={16} /> Edit
          </Link>
        </Button>
        <Button variant="destructive" size="icon">
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default MenuItem;
