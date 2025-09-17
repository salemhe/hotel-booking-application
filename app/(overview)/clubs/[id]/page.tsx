import ClubPage from "@/components/user/clubs/ClubPage";
import React from "react";
import { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  return (
    <Suspense fallback={<Loading />}>
      <ClubPage id={id} />
    </Suspense>
  );
};

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
};

export default page;
