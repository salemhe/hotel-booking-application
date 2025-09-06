"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Minus, Plus, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useReservations } from "@/app/contexts/ReservationContext";
import { toast } from "sonner";
import API from "@/app/lib/api/userAxios";

export interface MenuItem {
  _id: string;
  dishName: string;
  description: string;
  price: number;
  itemImage: string;
  quantity: number;
  specialRequest: string;
  selected: boolean;
  category: string;
}

export default function PreSelectMeal({ id }: { id: string }) {
  const {activeTab, setActiveTab, additionalNote, setAdditionalNote, menuItems, setMenuItems, vendor, time, guestCount, date, handleSubmit, isLoading} = useReservations();
  const [visibleCount, setVisibleCount] = useState(3);
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const tabs = [
    { name: "Starters", value: "Starters" },
    { name: "Main Course", value: "Main Course" },
    { name: "Appetizers", value: "Appetizer" },
    { name: "Desserts", value: "Dessert" },
    { name: "Drinks", value: "Drinks" },
  ];

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(`/vendors/menus?vendorId=${id}`);
      const data = res.data.menus as MenuItem[];
      setMenuItems(
        data.map((item) => ({
          ...item,
          selected: false, 
          quantity: 1,
          specialRequest: "",
        }))
      );
      if (data.length === 0) {
        toast.info("No menu items available at the moment.");
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      toast.error("Failed to load menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [id, setMenuItems]);

  useEffect(() => { fetchMenuItems(); }, [fetchMenuItems]);
  useEffect(() => { setVisibleCount(3); }, [activeTab]);

  const menuFiltered = menuItems.filter((a) => a.category === activeTab);
  const selectedItems = menuItems.filter((item) => item.selected);

  const handleQuantityChange = (id: string, change: number, type?: string) => {
    setMenuItems(
      menuItems.map((item) => {
        if (item._id === id) {
          if (type === "input") {
            const newQuantity = Math.max(1, change);
            return { ...item, quantity: newQuantity };
          } else {
            const newQuantity = Math.max(1, item.quantity + change);
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const handleSpecialRequestChange = (id: string, value: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item._id === id ? { ...item, specialRequest: value } : item
      )
    );
  };

  const handleSelectionChange = (id: string) => {
    setMenuItems(
      menuItems.map((item) =>
        item._id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const calculateSubtotal = () =>
    selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleClick = () => router.push("/completed");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading menu items...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation with stepper */}
      <div className="flex items-center justify-between px-6 pt-6 max-w-5xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Go Back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 text-center font-semibold text-lg -ml-10">
          Pre-Select Your Meal
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          Step 2 of 4
          <div className="flex gap-1 ml-2">
            <span className="w-14 h-1 rounded-full bg-[#0A6C6D]" />
            <span className="w-14 h-1 rounded-full bg-[#0A6C6D]" />
            <span className="w-14 h-1 rounded-full bg-gray-200" />
            <span className="w-14 h-1 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Reservation summary */}
      <div className="bg-gray-100 w-full mt-2">
        <div className="max-w-4xl mx-auto rounded-md mb-6 p-4">
          <div className="text-sm text-gray-600 mb-1">
            Reservation Completed
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="font-medium">{vendor?.businessName || "Restaurant Name"}</span>
            <span className="flex items-center">
              <span className="size-2 bg-black rounded-full mx-2"></span>
              {date
                ? date.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).replace(
                  /^(\d{1,2})/,
                  (d) =>
                    d +
                    (["1", "21", "31"].includes(d)
                      ? "st"
                      : ["2", "22"].includes(d)
                      ? "nd"
                      : ["3", "23"].includes(d)
                      ? "rd"
                      : "th"
                    )
                )
                : "N/A"}
            </span>
            <span className="flex items-center">
              <span className="size-2 bg-black rounded-full mx-2"></span>
              {time
                ? (() => {
                  const [hourStr, minuteStr] = time.split(":");
                  let hour = parseInt(hourStr, 10);
                  const minute = minuteStr || "00";
                  const ampm = hour >= 12 ? "pm" : "am";
                  hour = hour % 12 || 12;
                  return `${hour}:${minute} ${ampm}`;
                })()
                : "N/A"}
            </span>
            <span className="flex items-center">
              <span className="size-2 bg-black rounded-full mx-2"></span>
              {guestCount || "N/A"} Guest{guestCount && parseInt(guestCount) > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* Info Banner */}
        <div className="bg-[#FFFBEA] border border-[#E0B300] rounded-2xl p-4 mb-6 flex gap-3">
          <div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#FFECB3" />
              <path
                d="M16 8V16L21 19"
                stroke="#E0B300"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium mb-1">Want to pre-select your meal?</h3>
            <p className="text-sm text-gray-600">
              Pre-selecting your meal helps the restaurant prepare faster and ensures your favorite dishes are available. You can always make changes later.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 overflow-auto">
          <TabsList className="w-full justify-start bg-transparent p-0 h-auto">
            {tabs.map((tab, i) => (
              <TabsTrigger
                key={i}
                value={tab.value}
                className={`px-4 py-2 rounded-full border-2 ${
                  activeTab === tab.value
                    ? "border-[#0A6C6D] bg-[#0A6C6D] text-white"
                    : "border-transparent text-[#6B7280]"
                }`}
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Menu cards */}
        <div className="space-y-4 mb-6">
          {menuFiltered.length > 0
            ? menuFiltered.slice(0, visibleCount).map((item) => (
                <Card
                  key={item._id}
                  className={`overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                    item.selected ? "border-[#0A6C6D] shadow-lg" : "border-transparent"
                  }`}
                >
                  <CardContent className="p-0">
                    <div className={`p-2 ${item.selected ? "bg-[#E9EBF3]" : ""}`}>
                      <div className="flex flex-col sm:items-center border-0 sm:flex-row p-4 rounded-2xl gap-4 bg-white">
                        <div className="relative w-full h-24 sm:w-32 sm:h-32 flex-shrink-0">
                          <Image
                            src={item.itemImage || "/placeholder.svg"}
                            alt={item.dishName}
                            fill
                            className="object-cover rounded-2xl"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{item.dishName}</h3>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              <p className="font-medium mt-2">₦{item.price.toLocaleString()}</p>
                            </div>
                            <button
                              aria-label={item.selected ? "Deselect" : "Select"}
                              className={`w-6 h-6 rounded-md border flex items-center justify-center cursor-pointer mt-1 ml-2 ${
                                item.selected
                                  ? "bg-[#0A6C6D] border-[#0A6C6D] text-white"
                                  : "border-gray-300"
                              }`}
                              onClick={() => handleSelectionChange(item._id)}
                            >
                              {item.selected && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path
                                    d="M3.33301 9.33301C3.33301 9.33301 4.66634 9.66634 5.66634 11.6663C5.66634 11.6663 9.37221 5.55523 12.6663 4.33301"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-[#1E3A8A] border-2 text-[#1E3A8A]"
                                onClick={() => handleQuantityChange(item._id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center">
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  min={1}
                                  max={20}
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center"
                                  onWheel={(e) =>
                                    (e.target as HTMLInputElement).blur()
                                  }
                                  onChange={(e) => {
                                    let value = Number(e.target.value);
                                    if (value < 1) value = 1;
                                    handleQuantityChange(item._id, value, "input");
                                  }}
                                />
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full border-[#1E3A8A] border-2 text-[#1E3A8A]"
                                onClick={() => handleQuantityChange(item._id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex-1">
                              <Input
                                placeholder="Special request (e.g. no garlic)"
                                value={item.specialRequest}
                                onChange={(e) =>
                                  handleSpecialRequestChange(item._id, e.target.value)
                                }
                                className="h-8 text-sm bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] p-5"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : <div className="text-center text-gray-600">{`Not found any ${activeTab} items`}</div>
          }
        </div>

        {/* Show more */}
        {menuFiltered.length > 3 && menuFiltered.length > visibleCount && (
          <div className="flex justify-center mb-6">
            <Button
              variant="ghost"
              className="text-teal-600 flex items-center gap-1"
              onClick={() => {
                const filteredLength = menuItems.filter(
                  (a) => a.category === activeTab
                ).length;
                if (visibleCount >= filteredLength) return;
                setVisibleCount((prev) => prev + 3);
              }}
            >
              Show more <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Selection summary */}
        <Card className="bg-[#E9EBF3] rounded-2xl border-[#E5E7EB] mb-6">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">
              Your Selection ({selectedItems.length} {selectedItems.length === 1 ? "item" : "items"})
            </h3>
            <div className="space-y-2 mb-4">
              {selectedItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.dishName}
                  </span>
                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-medium border-t border-[#D2D3D7] pt-3">
              <span>Sub Total</span>
              <span>₦{calculateSubtotal().toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Additional note */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">
            Additional note for the restaurant
          </p>
          <Textarea
            placeholder="Let us know if you have any special request like dietary restrictions, birthday requests, etc."
            value={additionalNote}
            onChange={(e) => setAdditionalNote(e.target.value)}
            className="min-h-[100px] resize-none rounded-2xl p-4"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full bg-white border-t border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row justify-between gap-2 items-center max-w-4xl mx-auto p-4">
          <Button onClick={handleClick}  variant="ghost" className="text-teal-600">
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedItems.length || isLoading}
            className="bg-teal-600 hover:bg-teal-700 px-8 w-full max-w-xs"
          >
            {isLoading ? <span className="flex gap-2"><Loader2 className="animate-spin" /> Confirming</span> : "Confirm Meal Selection"}
          </Button>
        </div>
      </div>
    </div>
  );
}
