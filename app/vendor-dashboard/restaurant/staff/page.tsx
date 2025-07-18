"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, UserX, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

export default function RestaurantStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    fetchStaff();
  }, [searchTerm]);

  async function fetchStaff() {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;
      const res = await fetch("/api/vendor/staff" + (searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ""));
      const data = await res.json();
      setStaff(data || []);
    } catch {
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }

  const activeStaff = staff.filter((s) => s.status === "active");
  const inactiveStaff = staff.filter((s) => s.status === "inactive");
  const noShowStaff = staff.filter((s) => s.status === "no-show");

  // Staff card for list
  const StaffCard = ({ member }: { member: any }) => (
    <div className="flex flex-col items-center bg-white rounded-lg shadow p-4 min-w-[180px] max-w-[180px] mx-2 border border-gray-100 hover:shadow-lg transition">
      <Avatar className="w-12 h-12 mb-2" />
      <div className="font-semibold text-base text-gray-900 text-center">{member.name}</div>
      <div className="text-xs text-gray-500 text-center mb-1">{member.role}</div>
      <div className="flex gap-2 mb-2 flex-wrap justify-center">
        <Badge variant="secondary">{member.status === "active" ? "Active" : member.status === "inactive" ? "Inactive" : "No Show"}</Badge>
        <Badge variant="secondary">Added: {member.dateAdded}</Badge>
      </div>
      <div className="text-xs text-gray-500 text-center">
        <div>Phone: {member.phone}</div>
        <div>Email: {member.email}</div>
      </div>
    </div>
  );

  // Tab content
  let tabStaff: any[] = staff;
  if (activeTab === "active") tabStaff = activeStaff;
  if (activeTab === "inactive") tabStaff = inactiveStaff;

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Staff List</h2>
      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col items-center gap-2 p-6">
          <Users className="w-8 h-8 text-blue-600" />
          <div className="text-sm text-gray-600">Total Staff</div>
          <div className="text-2xl font-bold text-gray-900">{staff.length}</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-6">
          <UserCheck className="w-8 h-8 text-green-600" />
          <div className="text-sm text-gray-600">Active Staff</div>
          <div className="text-2xl font-bold text-gray-900">{activeStaff.length}</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-6">
          <UserX className="w-8 h-8 text-purple-600" />
          <div className="text-sm text-gray-600">Inactive Staff</div>
          <div className="text-2xl font-bold text-gray-900">{inactiveStaff.length}</div>
        </div>
        <div className="flex flex-col items-center gap-2 p-6">
          <EyeOff className="w-8 h-8 text-red-600" />
          <div className="text-sm text-gray-600">No Show Staff</div>
          <div className="text-2xl font-bold text-gray-900">{noShowStaff.length}</div>
        </div>
      </div>
      {/* Search */}
      <div className="mb-6 flex items-center gap-4">
        <Input
          placeholder="Search staff by name, email, or role"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-80"
        />
        <Button onClick={fetchStaff} className="bg-teal-600 hover:bg-teal-700">Search</Button>
      </div>
      {/* Tabs for Staff Sections */}
      <div className="flex flex-row gap-4 mb-8">
        <button
          className={`px-6 py-3 rounded-t-lg font-semibold text-base border-b-2 transition-colors ${activeTab === "all" ? "border-teal-600 text-teal-700 bg-white shadow" : "border-transparent text-gray-500 bg-gray-50 hover:text-teal-700"}`}
          onClick={() => setActiveTab("all")}
        >
          All Staff
        </button>
        <button
          className={`px-6 py-3 rounded-t-lg font-semibold text-base border-b-2 transition-colors ${activeTab === "active" ? "border-teal-600 text-teal-700 bg-white shadow" : "border-transparent text-gray-500 bg-gray-50 hover:text-teal-700"}`}
          onClick={() => setActiveTab("active")}
        >
          Active Staff
        </button>
        <button
          className={`px-6 py-3 rounded-t-lg font-semibold text-base border-b-2 transition-colors ${activeTab === "inactive" ? "border-teal-600 text-teal-700 bg-white shadow" : "border-transparent text-gray-500 bg-gray-50 hover:text-teal-700"}`}
          onClick={() => setActiveTab("inactive")}
        >
          Inactive Staff
        </button>
      </div>
      {/* Staff List for Selected Tab */}
      <div className="flex flex-wrap gap-4">
        {tabStaff.length === 0 && <div className="p-6 text-gray-400 text-center w-full">No staff found.</div>}
        {tabStaff.map((member) => <StaffCard key={member.id} member={member} />)}
      </div>
    </div>
  );
}
