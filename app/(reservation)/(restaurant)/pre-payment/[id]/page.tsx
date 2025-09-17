import { Banknote, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReservationHeader from "@/components/user/restaurants/ReservationHeader";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";
import API from "@/lib/api";
import { BookingDetails } from "@/types/user/restaurant";

const fetchBookingDetails = async (id: string) => {
  try {
    const res = await API.get(`/users/bookings?bookingId=${id}`);
    return res.data[0];
  } catch (error) {
    if (error instanceof AxiosError) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        redirect(
          `/user-login?redirect=${encodeURIComponent(`/completed/${id}`)}`
        );
      }
    }
    console.error("Error fetching booking details:", error);
    throw new Error("Failed to fetch booking details");
  }
};

export default async function PrePaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = (await fetchBookingDetails(id)) as BookingDetails;
  const categories = [...new Set(data.meals.map((meal) => meal.category))];
  return (
    <div className="min-h-screen bg-gray-50 ">
      <ReservationHeader title="Reservation Details" index={3} />
      <div className="max-w-4xl px-4 py-6 md:px-6 md:py-8 mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Thank you for your meal selection
          </h1>
          <p className="text-gray-600 text-sm">
            Your pre-selected meals have been confirmed for your upcoming
            reservation
          </p>
        </div>

        {/* Pre-payment Info - With background */}
        <div className="bg-[#E7F0F0] border border-[#B3D1D2] rounded-xl p-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="">
              <Banknote className="size-10 text-[#0A6C6D]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Would you like to pre-pay for your meal?
              </h3>
              <p className="text-sm text-gray-600">
                Payment is optional, but helps the restaurant prepare your meal
                ahead of time. Your payment is secure & refundable according to
                the restaurant&apos;s cancellation policy.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="">
              <h3 className="font-semibold text-gray-900 mb-3">
                Choose your payment option
              </h3>
              <p className="text-gray-900 mb-4 font-bold">
                <span className="">Amount to pay:</span> ₦
                {data.totalPrice.toLocaleString()}
              </p>

              <div className="flex gap-3">
                <form
                  action={async () => {
                    "use server";
                    redirect(`/payment/${id}`);
                  }}
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    className="w-full h-10 text-sm font-medium rounded-xl px-6 bg-[#0A6C6D] hover:bg-teal-800"
                  >
                    Prepay Now
                  </Button>
                </form>
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-sm font-medium px-6 rounded-xl border-gray-300"
                >
                  Pay at Restaurant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

            {/* Starters with background */}
            {data.meals.length > 0 &&
              categories.map((category, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border mb-4">
                  <h4 className="font-medium text-gray-700 p-3">{category}</h4>
                  <hr className="border-gray-200" />
                  <div className="space-y-3 p-3">
                    {data.meals
                      .filter((meal) => meal.category === category)
                      .map((meal, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {meal.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {meal.specialRequest}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-medium text-gray-900">
                              ₦{meal.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {meal.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

            {/* Special Request */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-yellow-800 text-sm">
                <span className="font-medium">Special Request:</span>{" "}
                {data.specialRequest}
              </p>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Sub Total
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ₦{data.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
