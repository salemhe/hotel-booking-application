"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Minus,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Textarea } from "@/app/components/ui/textarea";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  specialRequest?: string;
}

interface PrePaymentPageProps {
  params: Promise<{ id: string }>;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Mezze Platter",
    description: "Hummus, baba ghanoush, tzatziki, pita bread",
    price: 15000,
    image: "/placeholder-food.jpg",
    category: "starters",
  },
  {
    id: "2",
    name: "Chicken Springrolls",
    description: "Chicken, garnished vegetables",
    price: 12000,
    image: "/placeholder-food.jpg",
    category: "starters",
  },
  {
    id: "3",
    name: "Spaghetti Carbonara",
    description: "No special request",
    price: 15000,
    image: "/placeholder-food.jpg",
    category: "main",
  },
  {
    id: "4",
    name: "Calamari Fritti",
    description: "Add extra lemon on the side",
    price: 15000,
    image: "/placeholder-food.jpg",
    category: "desserts",
  },
];

export default function PrePaymentPage({ params }: PrePaymentPageProps) {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>(
    {
      "1": 2,
      "2": 1,
    },
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [activeTab, setActiveTab] = useState("starters");

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

  const getSelectedItems = () => {
    return Object.entries(selectedItems)
      .map(([id, quantity]) => {
        const item = menuItems.find((item) => item.id === id);
        return item ? { ...item, quantity } : null;
      })
      .filter(Boolean);
  };

  const getSubTotal = () => {
    return getSelectedItems().reduce((total, item) => {
      return total + item!.price * item!.quantity;
    }, 0);
  };

  const handleContinue = () => {
    router.push(`/payment/${params}/meal-selection`);
  };

  const MenuItemCard = ({ item }: { item: MenuItem }) => {
    const quantity = selectedItems[item.id] || 0;
    const isSelected = quantity > 0;

    return (
      <Card className={`mb-4 ${isSelected ? "ring-2 ring-teal-600" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=200&fit=crop&crop=center`;
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-lg font-semibold text-gray-900">
                ₦{item.price.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isSelected && (
                <div className="flex items-center gap-2 border rounded-full px-3 py-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-4 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {!isSelected && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}

              <button className="text-sm text-gray-500 underline">
                Special request (e.g no garlic)
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Pre-Select Your Meal</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Step 2 of 4</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-1 bg-teal-600 rounded"></div>
                  <div className="w-8 h-1 bg-teal-600 rounded"></div>
                  <div className="w-8 h-1 bg-gray-200 rounded"></div>
                  <div className="w-8 h-1 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Info Bar */}
      <div className="bg-teal-50 border-b px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 text-sm">
            <span className="font-medium">Reservation Completed</span>
            <span>Kapadoccia</span>
            <span>23rd May, 2025</span>
            <span>7:30 pm</span>
            <span>2 guests</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Selection */}
          <div className="lg:col-span-2">
            {/* Info Banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">
                    Want to pre-select your meal?
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Pre-selecting your meal helps the restaurant prepare faster
                    and ensures your favorite dishes are available. You can
                    always make changes later.
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="starters" className="text-sm">
                  Starters
                </TabsTrigger>
                <TabsTrigger value="main" className="text-sm">
                  Main Course
                </TabsTrigger>
                <TabsTrigger value="appetizers" className="text-sm">
                  Appetizers
                </TabsTrigger>
                <TabsTrigger value="desserts" className="text-sm">
                  Desserts
                </TabsTrigger>
                <TabsTrigger value="drinks" className="text-sm">
                  Drinks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="starters">
                {menuItems
                  .filter((item) => item.category === "starters")
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </TabsContent>

              <TabsContent value="main">
                {menuItems
                  .filter((item) => item.category === "main")
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </TabsContent>

              <TabsContent value="appetizers">
                <div className="text-center py-8 text-gray-500">
                  No appetizers available
                </div>
              </TabsContent>

              <TabsContent value="desserts">
                {menuItems
                  .filter((item) => item.category === "desserts")
                  .map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
              </TabsContent>

              <TabsContent value="drinks">
                <div className="text-center py-8 text-gray-500">
                  No drinks available
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Button variant="link" className="text-teal-600 p-0">
                Show more ↓
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">
                  Your Selection ({getSelectedItems().length} items)
                </h3>

                <div className="space-y-3 mb-4">
                  {getSelectedItems().map((item) => (
                    <div
                      key={item!.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <div>
                        <div className="font-medium">
                          {item!.quantity}x {item!.name}
                        </div>
                      </div>
                      <div className="font-medium">
                        ₦{(item!.price * item!.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Sub Total</span>
                    <span>₦{getSubTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="text-sm font-medium">
                    Additional note for the restaurant
                  </label>
                  <Textarea
                    placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                  >
                    Skip for now
                  </Button>
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={handleContinue}
                    disabled={getSelectedItems().length === 0}
                  >
                    Confirm Meal Selection
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
