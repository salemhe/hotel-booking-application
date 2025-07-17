"use client";

import { useState } from "react";
import { ArrowLeft, Plus, Minus, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import Image from "next/image";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  allergens?: string[];
}

interface MealPreSelectionProps {
  restaurantName: string;
  reservationDate: string;
  reservationTime: string;
  guests: number;
  onBack: () => void;
  onConfirm: (selection: any) => void;
  onSkip: () => void;
}

export default function MealPreSelection({
  restaurantName,
  reservationDate,
  reservationTime,
  guests,
  onBack,
  onConfirm,
  onSkip,
}: MealPreSelectionProps) {
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {},
  );
  const [specialRequests, setSpecialRequests] = useState("");
  const [currentStep, setCurrentStep] = useState("Step 2 of 4");

  const menuItems: MenuItem[] = [
    {
      id: "mezze",
      name: "Mezze Platter",
      description: "Hummus, baba ganoush, tzatziki, pita bread",
      price: 15000,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
      category: "Starters",
      allergens: ["(e.g no garlic)"],
    },
    {
      id: "chicken-springrolls",
      name: "Chicken Springrolls",
      description: "Chicken, garnished vegetables",
      price: 12000,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
      category: "Starters",
      allergens: ["(e.g no garlic)"],
    },
    {
      id: "chicken-springrolls-2",
      name: "Chicken Springrolls",
      description: "Chicken, garnished vegetables",
      price: 12000,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F1196aafa7c6a4490bc0c7538d03b126b%2Fc472369a51c9438c94727aae6c4b95e4?format=webp&width=800",
      category: "Starters",
      allergens: ["(e.g no garlic)"],
    },
  ];

  const categories = [
    "Starters",
    "Main Course",
    "Appetizers",
    "Desserts",
    "Drinks",
  ];

  const updateQuantity = (itemId: string, change: number) => {
    setSelectedItems((prev) => {
      const newQuantity = (prev[itemId] || 0) + change;
      if (newQuantity <= 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const getItemQuantity = (itemId: string) => selectedItems[itemId] || 0;

  const getSubtotal = () => {
    return Object.entries(selectedItems).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find((m) => m.id === itemId);
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce(
      (total, quantity) => total + quantity,
      0,
    );
  };

  const handleConfirm = () => {
    const selection = {
      items: Object.entries(selectedItems).map(([itemId, quantity]) => {
        const item = menuItems.find((m) => m.id === itemId);
        return { ...item, quantity };
      }),
      specialRequests,
      subtotal: getSubtotal(),
    };
    onConfirm(selection);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium">Pre-Select Your Meal</span>
        </div>
        <Badge variant="secondary">{currentStep}</Badge>
      </div>

      {/* Reservation Info */}
      <div className="bg-blue-50 p-4 border-b">
        <div className="text-sm">
          <span className="font-medium">Reservation Completed</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          <span className="font-medium">{restaurantName}</span> •{" "}
          {reservationDate} • {reservationTime} • {guests} guests
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
          <div className="text-sm">
            <p className="font-medium text-yellow-800 mb-1">
              Want to pre-select your meal?
            </p>
            <p className="text-yellow-700">
              Pre-selecting your meal helps the restaurant prepare faster and
              ensures your favorite dishes are available. You can always make
              changes later
            </p>
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="p-4">
        <Tabs defaultValue="Starters" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-xs data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="space-y-4">
                {menuItems
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="w-24 h-24 relative flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {getItemQuantity(item.id) > 0 && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                ✓
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {item.description}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 mt-1">
                                  ₦{item.price.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={getItemQuantity(item.id) === 0}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {getItemQuantity(item.id)}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-8 h-8 p-0"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            {item.allergens && (
                              <p className="text-xs text-gray-500">
                                Special request {item.allergens.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Show more button */}
              <div className="text-center mt-6">
                <Button variant="ghost" className="text-teal-600">
                  Show more <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Selection Summary - Fixed at bottom when items selected */}
      {getTotalItems() > 0 && (
        <div className="bg-gray-50 border-t p-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Your Selection ({getTotalItems()} items)
              </h3>

              <div className="space-y-2 text-sm mb-4">
                {Object.entries(selectedItems).map(([itemId, quantity]) => {
                  const item = menuItems.find((m) => m.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="flex justify-between">
                      <span>
                        {quantity}x {item.name}
                      </span>
                      <span>₦{(item.price * quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-3 mb-4">
                <div className="flex justify-between font-semibold">
                  <span>Sub Total</span>
                  <span>₦{getSubtotal().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Special Requests */}
      <div className="p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional note for the restaurant
          </label>
          <Textarea
            placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onSkip} className="flex-1">
            Skip for now
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
            disabled={getTotalItems() === 0}
          >
            Confirm Meal Selection
          </Button>
        </div>
      </div>
    </div>
  );
}
