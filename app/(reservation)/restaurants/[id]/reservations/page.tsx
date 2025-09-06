import Reservation from "@/app/components/reservation/Reservation";
import React from "react";

const Page = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  return (
    <div className="">
      <Reservation id={id} />
    </div>
  );
};

export default Page;
