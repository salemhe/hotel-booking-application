"use client";
import { Auths } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

const Step1 = dynamic(() => import("./personal/Step1"));
const Step2 = dynamic(() => import("./personal/Step2"));

const PersonalOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const { authInitials, updateFormData } = useContext(Auths);
  useEffect(() => {
    updateFormData(null);
  }, []);
  useEffect(() => {
    if (!authInitials) {
      router.push("/auth");
    }
  }, [authInitials, router]);
  if (!authInitials) {
    return;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleNextStep = (data: any) => {
      updateFormData({
        ...data,
        email: authInitials.email,
        password: authInitials.password,
      });
      setCurrentStep((prevStep) => prevStep + 1);
    };

    const renderStep = () => {
      switch (currentStep) {
        case 1:
          return <Step1 onNextStep={handleNextStep} />;
        case 2:
          return <Step2 />;
        default:
          return null;
      }
    };

    return (
      <div className="bg-[#979797] w-full h-screen flex items-center justify-center">
        <div className="w-[95vw] bg-white h-[95vh] rounded-lg overflow-auto">
          <button
            onClick={() => {
              setCurrentStep((prevStep) => prevStep - 1);
            }}
            className={`mt-4 ml-4 md:mt-9 md:ml-9 gap-1 h-6 font-medium text-lg leading-[24px] text-[#0C0C0C] ${
              currentStep > 1 ? "flex" : "hidden"
            }`}
          >
            <ChevronLeft size={24} /> Back
          </button>
          <div
            className={`mx-auto max-w-lg px-4 flex flex-col items-center ${
              currentStep < 2 && "mt-[40px] md:mt-[60px]"
            }`}
          >
            <Link
              href="/"
              className="font-medium text-4xl leading-[54px] mb-4 md:mb-[31px] mt-1"
            >
              LOGO
            </Link>
            <p className="text-[#9C9AA5] font-medium text-xs md:text-sm 2xl:text-lg leading-[24px] mb-2">
              {currentStep}/2
            </p>
            <h1 className="text-[#090909] font-medium text-lg md:text-2xl 2xl:text-[32px] mb-1">
              Customize your Profile
            </h1>
            <p className="text-center font-normal text-base 2xl:text-xl text-[#9C9AA5] mb-[30px] 2xl:mb-[70px]">
              Setup your profile now, to get started!
            </p>
            <Suspense fallback={<Skeleton className="w-full h-[1000px]" />}>
              {renderStep()}
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
};

export default PersonalOnboarding;
