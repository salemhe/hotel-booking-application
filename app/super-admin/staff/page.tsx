"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  dateAdded: string;
  status: "active" | "inactive";
  avatar: string;
}

const fetchStaff = (): StaffMember[] => {
  if (typeof window !== "undefined") {
    const staff = localStorage.getItem("adminStaff");
    if (staff) return JSON.parse(staff);
  }
  return [];
};

const SuperAdminStaffPage = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    setStaff(fetchStaff());
    const handler = () => setStaff(fetchStaff());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const activeStaff = staff.filter((s) => s.status === "active").length;
  const inactiveStaff = staff.filter((s) => s.status === "inactive").length;
  const totalStaff = staff.length;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Staff List</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Total Staff</div>
              <div className="text-2xl font-bold text-gray-900">{totalStaff}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Active Staff</div>
              <div className="text-2xl font-bold text-gray-900">{activeStaff}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <UserX className="w-8 h-8 text-purple-600" />
            <div>
              <div className="text-sm text-gray-600">Inactive Staff</div>
              <div className="text-2xl font-bold text-gray-900">{inactiveStaff}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6">
              <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="w-16 h-16 rounded-full mb-2" />
              <div className="font-semibold text-lg">{member.name}</div>
              <div className="text-gray-500 mb-1">{member.role}</div>
              <div className="flex gap-2 mb-2">
                <Badge variant="secondary">{member.status === "active" ? "Active" : "Inactive"}</Badge>
                <Badge variant="secondary">Added: {member.dateAdded}</Badge>
              </div>
              <div className="text-xs text-gray-500 mb-1">Phone: {member.phone}</div>
              <div className="text-xs text-gray-500 mb-1">Email: {member.email}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminStaffPage;
