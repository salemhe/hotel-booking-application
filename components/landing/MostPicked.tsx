import Image from "next/image";
import blueOrigin from "@/public/blue-origin.png";
import oceanLand from "@/public/ocean-land.png";
import vinnaVill from "@/public/vinna-vill.png";

import { StaticImageData } from "next/image";

interface PropertyCard {
  name: string;
  location: string;
  price: number;
  imageUrl: string | StaticImageData;
}

export default function MostPickedS() {
  const properties: PropertyCard[] = [
    {
      name: "Blue Origin Fams",
      location: "Galle, Sri Lanka",
      price: 50,
      imageUrl: blueOrigin,
    },
    {
      name: "Ocean Land",
      location: "Trincomalise, Sri Lanka",
      price: 22,
      imageUrl: oceanLand,
    },
    {
      name: "Vinna Vill",
      location: "Beruwala, Sri Lanka",
      price: 62,
      imageUrl: vinnaVill,
    },
    {
      name: "Blue Origin Fams",
      location: "Galle, Sri Lanka",
      price: 50,
      imageUrl: blueOrigin,
    },
  ];

  return (
    <section className="container mx-auto px-4 md:px-8">
      <h2 className="text-2xl font-medium mb-8">Most Picked</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left tall card */}
        <PropertyCard property={properties[0]} isTall={true} />

        {/* Middle column with two cards */}
        <div className="grid gap-4">
          {properties.slice(1, 3).map((property, index) => (
            <PropertyCard key={index} property={property} />
          ))}
        </div>

        {/* Right tall card */}
        <PropertyCard property={properties[3]} isTall={true} />
      </div>
    </section>
  );
}

interface PropertyCardProps {
  property: PropertyCard;
  isTall?: boolean;
}

function PropertyCard({ property, isTall = false }: PropertyCardProps) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${
        isTall
          ? "aspect-[3/3] lg:aspect-[3/4]"
          : "aspect-[3/3] lg:aspect-[3/1.94]"
      } group cursor-pointer`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
      <div className="absolute top-0 right-0 bg-black px-4 w-[45%] flex items-center justify-center py-2 rounded-bl-2xl">
        <p className="text-white text-sm font-medium">
          ${property.price} <span className="text-xs">per night</span>
        </p>
      </div>
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-xl font-semibold">{property.name}</h3>
        <p className="text-sm opacity-90">{property.location}</p>
      </div>
    </div>
  );
}
