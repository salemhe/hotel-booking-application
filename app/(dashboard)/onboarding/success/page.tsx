import Success from "@/components/auth/Success";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Success />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center space-y-4 w-full h-full">
      <div className="flex flex-col items-center justify-center space-y-4 ">

      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      {/* Loading text */}
      <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}
