import React from "react";
import { Button } from "../ui/button";
import { options } from "@/constant";
import heroBg from "@/public/hero-bg.png";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between md:min-h-[680px] w-full relative gap-y-28 mt-[80px] container mx-auto px-4 md:px-8">
      <div className="size-[210px] bg-black/5 rounded-full blur-3xl absolute top-0 -right-32" />
      <div className="md:w-[45%] w-full flex flex-col gap-20">
        <div className="items-start flex flex-col gap-5">
          <h1 className="text-[#1E1E1E] font-bold text-[42px]">
            Lorem ipsum dor amet, consectetur{" "}
          </h1>
          <p className="font-light text-base text-[#B0B0B0]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolor
          </p>
          <Button className="font-medium text-white text-xl h-12 px-7 leading-8 bg-[#262627] hover:bg-gray-800 shadow-[0px_0px_16.1px_-1px_#00000040] mt-3">
            Show more
          </Button>
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
