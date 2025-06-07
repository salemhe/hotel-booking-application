"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, CircleDollarSign, Clock, MapPin } from "lucide-react";
import { cn } from "@/app/lib/utils";

const RestaurantOverview = ({ address }: {address: string}) => {
  const [showMore, setShowMore] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > 100);
    }
  }, []);

  const about = "Kapadoccia Restaurant is a fine-dining destination inspired by the magical caves and textures of Cappadocia, Turkey. Located in the heart of Abuja, Nigeria, the restaurant offers an immersive dining experience with cave-like interiors, ambient lighting, and an exotic fusion menu that blends Middle Eastern, Mediterranean, and African flavors.    It’s ideal for romantic dinners, group celebrations, and culinary explorers looking for a unique atmosphere and gourmet cuisine."

  return (
    <div className="space-y-6 text-sm md:text-base">
      <div className="flex flex-wrap gap-4">
        <div className="bg-[#E8FFE1] px-4 py-2 rounded-xl border border-[#72E94E] flex items-center gap-4">
          <div>
            <Clock className="text-[#068D33]" />
          </div>
          <div className="space-y-1">
            <p className="text-xs">Opening Hours</p>
            <p className="font-semibold text-sm">12:00 PM - 11:00 PM Daily</p>
          </div>
        </div>
        <div className="bg-[#C8FAFF] px-4 py-2 rounded-xl border border-[#49EDFF] flex items-center gap-4">
          <div>
            <MapPin className="text-[#028C9B]" />
          </div>
          <div className="space-y-1">
            <p className="text-xs">Location</p>
            <p className="font-semibold text-sm">
              {address}
            </p>
          </div>
        </div>
        <div className="bg-[#FFEFE1] px-4 py-2 rounded-xl border border-[#FFB778] flex items-center gap-4">
          <div>
            <Clock className="text-[#B76115]" />
          </div>
          <div className="space-y-1">
            <p className="text-xs">Cuisine</p>
            <p className="font-semibold text-sm">
              Middle Eastern, Turkish, Mediterranean
            </p>
          </div>
        </div>
        <div className="bg-[#EBE1FF] px-4 py-2 rounded-xl border border-[#C0A1FF] flex items-center gap-4">
          <div>
            <CircleDollarSign className="text-[#6729E5]" />
          </div>
          <div className="space-y-1">
            <p className="text-xs">Price Range</p>
            <p className="font-semibold text-sm">From ₦20,000</p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2 ml-3">About this Place</h2>
        <div
          ref={contentRef}
          className={cn(
            "transition-all overflow-hidden ml-3",
            showMore ? "max-h-[1000px]" : "max-h-[100px]"
          )}
        >
            <p className="text-gray-700 leading-relaxed">
            {about.split("  ").map((part, idx, arr) => (
              <span key={idx}>
              {part}
              {idx < arr.length - 1 && <br />}
              </span>
            ))}
            </p>
        </div>
        {isOverflowing && (
          <button
            className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline cursor-pointer"
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? "Show less" : "Show more"}
            {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default RestaurantOverview;
