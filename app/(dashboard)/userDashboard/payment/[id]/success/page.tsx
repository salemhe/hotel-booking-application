import SuccessPage from "@/app/components/SuccessPage";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <SuccessPage id={id} />;
};

export default page;
