import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useReservations } from "@/app/contexts/ReservationContext";
import { useRouter } from "next/navigation";

const ReservationHeader = ({
  title,
  index,
}: {
  title: string;
  index: number;
}) => {
  const { setPage } = useReservations();
  const router = useRouter()
  return (
    <div className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => {
                if (index === 2) {
                  setPage(0);
                } else {
                  router.back()
                }
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Step {index} of 4</span>
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-1 rounded ${
                    i < index ? "bg-blue-500" : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationHeader;
