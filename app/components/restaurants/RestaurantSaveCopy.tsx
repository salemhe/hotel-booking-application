"use client";
import React from "react";
import { Button } from "../ui/button";
import { Heart, Share2Icon } from "lucide-react";
import { toast } from "sonner";

const RestaurantSaveCopy = ({ id }: { id: string }) => {
  const handleCopy = () => {
    navigator.clipboard
      .writeText(
        `https://hotel-booking-application-omega.vercel.app/restaurants/${id}`
      )
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => {
        toast.error("Failed to copy.");
      });
  };
  return (
    <div className="gap-4 hidden md:flex">
      <Button onClick={handleCopy} variant="outline" className="rounded-xl cursor-pointer">
        <Share2Icon />
        Share
      </Button>
      <Button variant="outline" className="rounded-xl cursor-pointer">
        <Heart />
        Save
      </Button>
    </div>
  );
};

export default RestaurantSaveCopy;
