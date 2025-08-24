"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, UserCheck, UserX, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { apiFetcher } from "@/app/lib/fetcher";
import StaffTable from "@/app/components/dashboard/StaffTable";

interface StaffMember {
  _id: string;
  staffName: string;
  staffId: string;
  branch: string;
  jobRole: string;
  status: string;
  phone: string;
  email: string;
  profileImages: string[];
  createdAt: string;

}

interface StaffStats {
    totalStaff: {
        count: number,
        change: number,
        trend: string
    },
    activeStaff: {
        count: number,
        change: number,
        trend: string
    },
    inactiveStaff: {
        count: number,
        change: number,
        trend: string
    },
    noShowStaff: {
        count: number,
        change: number,
        trend: string
    }
}
 
export default function HotelStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [staffStats, setStaffStats] = useState<StaffStats | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");

  const fetchStaff = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;

      const queryString = new URLSearchParams(params).toString();
      const url = `/api/vendors/staff${queryString ? `?${queryString}` : ""}`;

      const data = await apiFetcher(url); // assuming apiFetcher returns parsed JSON
      console.log(data)
      // Backend response shape: { message, staffs }
      setStaff(data?.staffs || []);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setStaff([]);
    }
  }, [searchTerm]);

  const fetchStaffStats = useCallback(async () => {
    try {
      const url = `/api/vendors/staff/stats`;

      const data = await apiFetcher(url); // assuming apiFetcher returns parsed JSON
      console.log("DATA", data)
      // Backend response shape: { message, staffs }
      setStaffStats(data?.stats || {
        totalStaff: { count: 0, change: 0 },
        activeStaff: { count: 0, change: 0 },
        inactiveStaff: { count: 0, change: 0 },
        noShowStaff: { count: 0, change: 0 }
      });
    } catch (error) {
      console.error("Failed to fetch staff stats:", error);
      // setStaffStats({
      //   totalStaff: { count: 0, change: 0 },
      //   activeStaff: { count: 0, change: 0 },
      //   inactiveStaff: { count: 0, change: 0 },
      //   noShowStaff: { count: 0, change: 0 }
      // });
    }
  }, []);


  useEffect(() => {
    fetchStaff();
    fetchStaffStats();
  }, [fetchStaff, fetchStaffStats]);

  const activeStaff = staff.filter((s) => s.status === "active");
  const inactiveStaff = staff.filter((s) => s.status === "inactive");
  // const noShowStaff = staff.filter((s) => s.status === "no-show");
  

  // Tab content
  let tabStaff: StaffMember[] = staff;
  if (activeTab === "active") tabStaff = activeStaff;
  if (activeTab === "inactive") tabStaff = inactiveStaff;


  // function filterByRole(role: unknown) {
  //   setStaff(staff.filter((s) => s.jobRole === role));
  // }

  console.log(staffStats)

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Staff List</h2>
      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 bg-white rounded-lg shadow p-5">
        <div className="flex flex-row justify-between items-center gap-4 p-6 border-r border-gray-300">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Total Staff</div>
            <div className="text-2xl font-bold text-gray-900">{staffStats?.totalStaff.count}</div>
            <span className="text-sm text-gray-600 flex flex-row items-center">{staffStats?.totalStaff.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}{staffStats?.totalStaff.change} vs last week</span>
          </div>
          <Users className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex flex-row justify-between items-center gap-4 p-6 border-r border-gray-300">
           <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Active Staff</div>
            <div className="text-2xl font-bold text-gray-900">{staffStats?.activeStaff.count}</div>
            <span className="text-sm text-gray-600 flex flex-row items-center">{staffStats?.activeStaff.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}{staffStats?.activeStaff.change} vs last week</span>
           </div>
            <UserCheck className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex flex-row justify-between items-center gap-4 p-6 border-r border-gray-300">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Inactive Staff</div>
            <div className="text-2xl font-bold text-gray-900">{staffStats?.inactiveStaff.count}</div>
            <span className="text-sm text-gray-600 flex flex-row items-center">{staffStats?.inactiveStaff.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}{staffStats?.inactiveStaff.change} vs last week</span>
          </div>
          <UserX className="w-8 h-8 text-purple-600" />
        </div>
        <div className="flex flex-row justify-between items-center gap-4 p-6">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">No Show Staff</div>
            <div className="text-2xl font-bold text-gray-900">{staffStats?.noShowStaff.count}</div>
            <span className="text-sm text-gray-600 flex flex-row items-center">{staffStats?.noShowStaff.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}{staffStats?.noShowStaff.change} vs last week</span>
          </div>
          <EyeOff className="w-8 h-8 text-red-600" />
        </div>
      </div>
      {/* Search */}

      {/* Tabs for Staff Sections */}

      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row gap-4 mb-8 w-[50%]">
          <button
            className={`px-2 py-3 rounded-t-lg rounded-b-lg font-semibold text-base border-1 transition-colors ${activeTab === "all" ? "border-teal-600 text-black-100 bg-[#B3D1D2] shadow" : "border-transparent text-gray-500 bg-gray-50 hover:text-teal-700"}`}
            onClick={() => setActiveTab("all")}
          >
            All Staff
          </button>
          <button
            className={`px-2 py-3 rounded-t-lg rounded-b-lg font-semibold text-base border-1 transition-colors ${activeTab === "active" ? "border-teal-600 text-black-100 bg-[#B3D1D2] shadow" : "border-transparent text-gray-500 bg-gray-50 hover:text-teal-700"}`}
            onClick={() => setActiveTab("active")}
          >
            Active Staff
          </button>
          <button
            className={`px-2 py-3 rounded-t-lg rounded-b-lg font-semibold text-base border-1 transition-colors ${activeTab === "inactive" ? "border-teal-600 text-black-100 bg-[#B3D1D2] shadow" : "border-transparent text-gray-500 bg-gray-50 hover:text-teal-700"}`}
            onClick={() => setActiveTab("inactive")}
          >
            Inactive Staff
          </button>
        </div>
        <div className="mb-6 flex items-center gap-4 w-[50%]">
          <Input
            placeholder="Search staff by name, email, or role"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-80"
          />
           <Select className="w-[50%]">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="bartender">Bartender</SelectItem>
                <SelectItem value="chef">Chef</SelectItem>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="room-attendant">Room Attendant</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="waiter">Waiter</SelectItem>
              </SelectContent>
            </Select>
      </div>
      </div>
      {/* Staff List for Selected Tab */}
      <div className="flex flex-wrap gap-4">
        {tabStaff.length === 0 && <div className="p-6 text-gray-400 text-center w-full">No staff found.</div>}
    
        <StaffTable staff={tabStaff} />
      </div>
    </div>
  );
}
