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
      {children}
    </div>
  );
};

export default layout;
