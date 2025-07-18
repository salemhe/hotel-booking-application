"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  Edit,
  MapPin,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { useRouter } from "next/navigation";

interface ReservationDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function ReservationDetailsPage({
  params,
}: ReservationDetailsPageProps) {
  const router = useRouter();
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [seatingPreference, setSeatingPreference] = useState("indoor");
  const [specialRequest, setSpecialRequest] = useState("");
  const [reservationDetails, setReservationDetails] = useState({
    date: "23rd May, 2025",
    time: "07:30 pm",
    guests: "2 people",
  });
  const [restaurantId, setRestaurantId] = useState<string>("");

  const occasions = ["Birthday", "Casual", "Business", "Anniversary", "Others"];

  React.useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setRestaurantId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const handleContinue = () => {
    // Navigate to meal pre-selection page
    router.push(`/pre-payment/${restaurantId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Reservation Details</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Step 1 of 4</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-1 bg-teal-600 rounded"></div>
                  <div className="w-8 h-1 bg-gray-200 rounded"></div>
                  <div className="w-8 h-1 bg-gray-200 rounded"></div>
                  <div className="w-8 h-1 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Restaurant Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="w-full h-32 rounded-lg bg-gray-200 overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop&crop=center"
                      alt="Kapadoccia Restaurant"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      Kapadoccia - Lagos, Nigeria
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        16, Idowu Taylor Street, Victoria Island 101241 Nigeria
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-sm text-gray-500">
                        (1,000 reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reservation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">
                  Reservation Details
                </h3>

                {/* Editable Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <div className="relative">
                      <Input
                        value={reservationDetails.date}
                        onChange={(e) =>
                          setReservationDetails({
                            ...reservationDetails,
                            date: e.target.value,
                          })
                        }
                      />
                      <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Available Time
                    </label>
                    <div className="relative">
                      <Input
                        value={reservationDetails.time}
                        onChange={(e) =>
                          setReservationDetails({
                            ...reservationDetails,
                            time: e.target.value,
                          })
                        }
                      />
                      <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Guest
                    </label>
                    <div className="relative">
                      <Input
                        value={reservationDetails.guests}
                        onChange={(e) =>
                          setReservationDetails({
                            ...reservationDetails,
                            guests: e.target.value,
                          })
                        }
                      />
                      <Edit className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Let's Plan For Your Visit */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Let's Plan For Your Visit
                    </h4>
                    <p className="text-sm text-gray-600 mb-6">
                      Kindly provide answers to the questions below to enable us
                      serve you better
                    </p>
                  </div>

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h5 className="font-medium">Preferences</h5>

                    {/* Special Occasion */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Special Occasion?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {occasions.map((occasion) => (
                          <Button
                            key={occasion}
                            variant={
                              selectedOccasion === occasion
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedOccasion(occasion)}
                            className={
                              selectedOccasion === occasion
                                ? "bg-teal-600 hover:bg-teal-700"
                                : ""
                            }
                          >
                            {occasion}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Seating Preference */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Seating Preference
                      </label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="indoor"
                            name="seating"
                            value="indoor"
                            checked={seatingPreference === "indoor"}
                            onChange={(e) =>
                              setSeatingPreference(e.target.value)
                            }
                            className="text-teal-600"
                          />
                          <label htmlFor="indoor" className="text-sm">
                            Indoor
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="outdoor"
                            name="seating"
                            value="outdoor"
                            checked={seatingPreference === "outdoor"}
                            onChange={(e) =>
                              setSeatingPreference(e.target.value)
                            }
                            className="text-teal-600"
                          />
                          <label htmlFor="outdoor" className="text-sm">
                            Outdoor
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="no-preference"
                            name="seating"
                            value="no-preference"
                            checked={seatingPreference === "no-preference"}
                            onChange={(e) =>
                              setSeatingPreference(e.target.value)
                            }
                            className="text-teal-600"
                          />
                          <label htmlFor="no-preference" className="text-sm">
                            No Preference
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Special Request */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">
                        Special Request (Optional)
                      </label>
                      <Textarea
                        placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={() => router.back()}>
                    Back to Restaurant Page
                  </Button>
                  <Button
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                    onClick={handleContinue}
                  >
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
