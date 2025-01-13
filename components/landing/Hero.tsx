import React from "react";
import { options } from "@/constant";
import heroBg from "@/public/hero-bg.png";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between md:min-h-[680px] w-full relative gap-y-28 mt-[80px] container mx-auto px-4 md:px-8">
      <div className="size-[210px] bg-black/5 rounded-full blur-3xl absolute top-0 -right-32" />
      <div className="md:w-[45%] w-full flex flex-col gap-20">
        <div className="items-start flex flex-col gap-5">
          <h1 className="text-[#1E1E1E] font-bold text-[32px] md:text-[42px]">
            Find Your Perfect Stay, Anywhere You Want to Be.{" "}
          </h1>
          <p className="font-light text-base text-[#B0B0B0]">
            Step into a world of curated comfort and modern design. Whether
            you&apos;re chasing adventure, relaxation, or inspiration, we’ve got the
            ideal space for you. Book now and redefine the way you travel.
          </p>
          <Link href="#get-started" className="shadow-[0px_0px_16.1px_-1px_#00000040] font-normal text-white text-xl leading-8 bg-black hover:bg-gray-800 px-5 py-2 rounded-md">
            Get Started
          </Link>
        </div>
        <div className="flex items-center justify-between">
          {options.map((option, i) => (
            <div key={i} className="flex flex-col items-start gap-2">
              <Image src={option.img} alt={option.name} className="size-8" />
              <p className="font-light text-[#B0B0B0]">
                <span className="font-medium text-black">{option.number}</span>
                {option.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="md:flex items-center justify-end w-full md:w-[45%] hidden">
        <div className=" rounded-[100px_15px_15px_15px] relative w-[90%] self-end md:w-[500px] flex h-[300px] md:h-[400px] border-2">
          <Image
            src={heroBg}
            alt="Room with windows and sofa"
            className="w-full h-full object-cover absolute -left-[20px] -top-[15px] md:-top-[40px] md:-left-[53px] rounded-[100px_15px_15px_15px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
