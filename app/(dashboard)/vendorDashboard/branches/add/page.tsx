"use client";

import React, { useState } from "react";
import { ArrowLeft, MapPin, Clock, Search, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useRouter } from "next/navigation";

interface BranchFormData {
  branchName: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
  countryCode: string;
  openingDays: string[];
  opensAt: string;
  closesAt: string;
  assignedManager: string;
  assignedMenu: string;
  importAllMenuItems: boolean;
}

export default function AddBranchPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BranchFormData>({
    branchName: "",
    address: "",
    city: "",
    state: "",
    phoneNumber: "",
    countryCode: "+234",
    openingDays: [],
    opensAt: "09:00",
    closesAt: "22:00",
    assignedManager: "",
    assignedMenu: "",
    importAllMenuItems: false,
  });

  const weekDays = [
    { id: "monday", label: "Monday" },
    { id: "tuesday", label: "Tuesday" },
    { id: "wednesday", label: "Wednesday" },
    { id: "thursday", label: "Thursdays" },
    { id: "friday", label: "Friday" },
    { id: "saturday", label: "Saturday" },
    { id: "sunday", label: "Sunday" },
  ];

  const states = [
    "Lagos",
    "Abuja",
    "Kano",
    "Rivers",
    "Oyo",
    "Delta",
    "Kaduna",
    "Plateau",
    "Edo",
    "Ogun",
  ];

  const managers = [
    "John Doe - Manager",
    "Jane Smith - Senior Manager",
    "Mike Johnson - Assistant Manager",
    "Sarah Wilson - Branch Manager",
  ];

  const menus = [
    "Main Menu - Lagos",
    "Weekend Special Menu",
    "Holiday Menu",
    "Lunch Menu",
    "Dinner Menu",
  ];

  const toggleOpeningDay = (dayId: string) => {
    setFormData((prev) => ({
      ...prev,
      openingDays: prev.openingDays.includes(dayId)
        ? prev.openingDays.filter((day) => day !== dayId)
        : [...prev.openingDays, dayId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Branch data:", formData);
    router.push("/vendorDashboard/branches");
  };

  const handleSaveAndAddAnother = () => {
    console.log("Branch data:", formData);
    // Reset form for another entry
    setFormData({
      branchName: "",
      address: "",
      city: "",
      state: "",
      phoneNumber: "",
      countryCode: "+234",
      openingDays: [],
      opensAt: "09:00",
      closesAt: "22:00",
      assignedManager: "",
      assignedMenu: "",
      importAllMenuItems: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Add New Branch</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch name*
                  </label>
                  <Input
                    value={formData.branchName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        branchName: e.target.value,
                      }))
                    }
                    placeholder="e.g. Joe's Chicken and Grill - Ikeja"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address*
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Start typing address"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City*
                    </label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State*
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                      required
                    >
                      <option value="">Select state</option>
                      {states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number*
                  </label>
                  <div className="flex">
                    <select
                      value={formData.countryCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          countryCode: e.target.value,
                        }))
                      }
                      className="px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-white min-w-[80px]"
                    >
                      <option value="+234">+234</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                    </select>
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      placeholder="7012345678"
                      className="rounded-l-none border-l-0"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Opening Days (Select opening days)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {weekDays.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={day.id}
                          checked={formData.openingDays.includes(day.id)}
                          onChange={() => toggleOpeningDay(day.id)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor={day.id} className="text-sm">
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opens at
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="time"
                        value={formData.opensAt}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            opensAt: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closes at
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="time"
                        value={formData.closesAt}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            closesAt: e.target.value,
                          }))
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management & Menu */}
            <Card>
              <CardHeader>
                <CardTitle>Management & Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Manager
                  </label>
                  <div className="relative">
                    <select
                      value={formData.assignedManager}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          assignedManager: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none"
                    >
                      <option value="">Select manager</option>
                      {managers.map((manager) => (
                        <option key={manager} value={manager}>
                          {manager}
                        </option>
                      ))}
                    </select>
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Menu
                  </label>
                  <div className="relative">
                    <select
                      value={formData.assignedMenu}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          assignedMenu: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none"
                    >
                      <option value="">Search & Select menu</option>
                      {menus.map((menu) => (
                        <option key={menu} value={menu}>
                          {menu}
                        </option>
                      ))}
                    </select>
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="import-menu"
                    checked={formData.importAllMenuItems}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        importAllMenuItems: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="import-menu" className="text-sm">
                    Import all menu and menu items
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleSaveAndAddAnother}
              >
                Save & Add another
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Save Branch
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
