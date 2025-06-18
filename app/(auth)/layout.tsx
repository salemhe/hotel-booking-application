import Navigation from "@/app/components/Navigation";
import React from "react";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <Navigation />
      <div className="mt-[60px]">

      {children}
      </div>
    </div>
  );
};

export default layout;
