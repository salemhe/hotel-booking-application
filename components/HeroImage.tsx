import React from "react";
import HeroUser from "@/public/auth/HeroUser.jpg";
import HeroVendor from "@/public/auth/HeroVendor.svg";
import Image from "next/image";

const HeroImage = ({ role }: { role: string}) => {
  return (
    <div className="hidden md:flex flex-col items-center justify-center md:w-[50%] h-full bg-[#0A6C6D] gap-8 rounded-2xl p-20">
      <h1 className="text-white text-2xl font-bold">
        Effortlessly {role === "user" ? "Find" : "Manage"} Your Perfect{" "} Meal
      </h1>
      <Image
        src={role === "user" ? HeroUser : HeroVendor}
        alt="Hero"
        className="object-cover rounded-2xl"
      />
    </div>
  );
};

export default HeroImage;
