import React from "react";
import PaymentPage from "@/app/components/Payment";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <PaymentPage id={id} />;
};

export default page;
