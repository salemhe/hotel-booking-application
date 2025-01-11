import Image, { StaticImageData } from "next/image";
import React from "react";
import blueOrigin from "@/public/blue-origin.png";
import oceanLand from "@/public/ocean-land.png";
import vinnaVill from "@/public/vinna-vill.png";

interface PropertyCardProps {
  name: string;
  location: string;
  price: number;
  imageUrl: string | StaticImageData;
  popular: boolean;
}

const properties: PropertyCardProps[] = [
  {
    name: "Blue Origin Fams",
    location: "Galle, Sri Lanka",
    price: 50,
    imageUrl: blueOrigin,
    popular: true,
  },
  {
    name: "Ocean Land",
    location: "Trincomalise, Sri Lanka",
    price: 22,
    imageUrl: oceanLand,
    popular: false,
  },
  {
    name: "Vinna Vill",
    location: "Beruwala, Sri Lanka",
    price: 62,
    imageUrl: vinnaVill,
    popular: false,
  },
  {
    name: "Blue Origin Fams",
    location: "Galle, Sri Lanka",
    price: 50,
    imageUrl: blueOrigin,
    popular: false,
  },
  {
    name: "Ocean Land",
    location: "Trincomalise, Sri Lanka",
    price: 22,
    imageUrl: oceanLand,
    popular: false,
  },
  {
    name: "Vinna Vill",
    location: "Beruwala, Sri Lanka",
    price: 62,
    imageUrl: vinnaVill,
    popular: false,
  },
  {
    name: "Ocean Land",
    location: "Trincomalise, Sri Lanka",
    price: 22,
    imageUrl: oceanLand,
    popular: false,
  },
  {
    name: "Vinna Vill",
    location: "Beruwala, Sri Lanka",
    price: 62,
    imageUrl: vinnaVill,
    popular: true,
  },
];

const Places = () => {
  return (
    <section className="py-16 container px-4 md:px-8 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {properties.map((property, i) => (
          <PropertyCard key={i} property={property} />
        ))}
      </div>
    </section>
  );
};

export default Places;

interface PropertyCardComponentProps {
  property: PropertyCardProps;
}

function PropertyCard({ property }: PropertyCardComponentProps) {
  return (
    <div className="flex flex-col  cursor-pointer group">
      <div className="relative rounded-2xl overflow-hidden aspect-video">
        {/* Image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={property.imageUrl}
            alt={property.name}
            fill
            className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-105 bg-gray-100"
          />
        </div>

        {/* Popular Tag */}
        {property.popular && (
          <div className="absolute top-0 right-0 bg-black px-4 w-[75%] flex items-center justify-center py-2 rounded-bl-2xl text-white font-medium text-base">
            Popular Choice
          </div>
        )}

        {/* Property Info */}
      </div>
      <div className="text-black">
        <h3 className="text-lg font-semibold">{property.name}</h3>
        <p className="text-sm text-[#B0B0B0]">{property.location}</p>
      </div>
    </div>
  );
}
