"use client";

import { useState } from "react";
import { ArrowLeft, Edit, Calendar, Clock, Users, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import Image from "next/image";

interface ReservationDetailsProps {
  restaurant: {
    name: string;
    location: string;
    address: string;
    rating: number;
    reviews: number;
    image: string;
  };
  reservation: {
    date: string;
    time: string;
    guests: number;
  };
  onBack: () => void;
  onContinue: (details: any) => void;
}

export default function ReservationDetails({
  restaurant,
  reservation,
  onBack,
  onContinue,
}: ReservationDetailsProps) {
  const [formData, setFormData] = useState({
    specialOccasion: "",
    seatingPreference: "indoor",
    specialRequests: "",
  });

  const currentStep = "Step 1 of 4";

  const specialOccasions = [
    "Birthday",
    "Casual",
    "Business",
    "Anniversary",
    "Others",
  ];

  const handleContinue = () => {
    onContinue(formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">Reservation Details</span>
        </div>
        <Badge variant="secondary">{currentStep}</Badge>
      </div>

      <div className="p-4 space-y-6">
        {/* Restaurant Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-4">
              <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                <Image
                  src={restaurant.image}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {restaurant.address}
                </p>
                <div className="flex items-center text-sm">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-gray-500 ml-1">
                    ({restaurant.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reservation Details */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Reservation Details
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-4 h-4 text-gray-600 mr-1" />
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Date</div>
                  <div className="font-medium">{reservation.date}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4 text-gray-600 mr-1" />
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Available Time</div>
                  <div className="font-medium">{reservation.time}</div>
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-4 h-4 text-gray-600 mr-1" />
                  <Button variant="ghost" size="sm" className="p-0 h-auto">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Guest</div>
                  <div className="font-medium">{reservation.guests} people</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planning Form */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Let's Plan For Your Visit
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Kindly provide answers to list question below to enable us serve you
            better
          </p>

          <div className="space-y-6">
            {/* Preferences */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Preferences</h4>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Special Occasion?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {specialOccasions.map((occasion) => (
                    <Button
                      key={occasion}
                      variant={
                        formData.specialOccasion === occasion
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      className={`text-xs ${
                        formData.specialOccasion === occasion
                          ? "bg-gray-900 text-white"
                          : "text-gray-600"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, specialOccasion: occasion })
                      }
                    >
                      {occasion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Seating Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Seating Preference
              </label>
              <RadioGroup
                value={formData.seatingPreference}
                onValueChange={(value) =>
                  setFormData({ ...formData, seatingPreference: value })
                }
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="indoor" id="indoor" />
                  <Label htmlFor="indoor" className="text-sm">
                    Indoor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outdoor" id="outdoor" />
                  <Label htmlFor="outdoor" className="text-sm">
                    Outdoor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no-preference" id="no-preference" />
                  <Label htmlFor="no-preference" className="text-sm">
                    No Preference
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Request (Optional)
              </label>
              <Textarea
                placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                value={formData.specialRequests}
                onChange={(e) =>
                  setFormData({ ...formData, specialRequests: e.target.value })
                }
                className="resize-none text-sm"
                rows={4}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Back to Restaurant Page
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
