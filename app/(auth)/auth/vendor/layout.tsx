import HeroImage from "@/components/HeroImage";
import React from "react";

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
  <div className='w-full h-screen flex p-4 bg-white'>
      <div className='flex-1 h-full overflow-y-auto hide-scrollbar'>

      {children}
      </div>
      <HeroImage role="vendor" />
    </div>
  );
};

export default layout;
