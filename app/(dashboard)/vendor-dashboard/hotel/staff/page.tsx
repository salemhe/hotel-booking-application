"use client";

import { useState, useEffect, useCallback } from "react";
import {ArrowUp, ArrowDown,Eye, EyeClosed, UserRoundPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { apiFetcher } from "@/lib/fetcher";
import StaffTable from "@/components/dashboard/StaffTable";
import Image  from "next/image";

import { Search, Bell, ChevronDown} from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {getUserProfile} from '@/lib/api-service'


interface StaffMember {
  _id: string;
  staffName: string;
  staffId: string;
  branch: string;
  jobRole: string;
  status: string;
  phone: string;
  email: string;
  profileImage: string;
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
  const [hide, setHide] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");

    // State for user profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    role: '',
    avatar: '',
    initials: ''
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const safelyFetchData = async <T,>(fetchFn: () => Promise<any>, defaultValue: T): Promise<T> => {
          try {
            const result = await fetchFn();
            
            // Check for error object
            if (result && typeof result === 'object' && 'isError' in result && result.isError) {
              const errorObj = result.error || {};
              const errorMessage = typeof errorObj === 'object' && 'message' in errorObj 
                ? errorObj.message 
                : (typeof errorObj === 'string' ? errorObj : 'Unknown error');
                
              console.log(`API Error fetching hotel data: ${errorMessage}`);
              return defaultValue;
            }
            
            // Check for empty object
            if (result && typeof result === 'object' && 
                !Array.isArray(result) && 
                Object.keys(result).length === 0) {
              console.log('Received empty object from API');
              return defaultValue;
            }
            
            return result || defaultValue;
          } catch (error) {
            let errorMessage = 'Unknown error';
            if (error) {
              if (typeof error === 'string') {
                errorMessage = error;
              } else if (typeof error === 'object' && error !== null) {
                // Use proper type checking to access the message property
                errorMessage = error && 'message' in error && typeof error.message === 'string'
                  ? error.message
                  : JSON.stringify(error);
              }
            }
            console.log(`Exception fetching hotel data: ${errorMessage}`);
            return defaultValue;
          }
        };
        let profileData = {};
        for (let retry = 0; retry < 3; retry++) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          profileData = await safelyFetchData<any>(() => getUserProfile(), {});
          if (profileData && Object.keys(profileData).length > 0) break;
          console.log(`Retrying profile fetch for hotel, attempt ${retry + 1}/3`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between retries
        }
        try {
          // Try to get the profile data from localStorage first if API failed
          let vendorName = '';
          let vendorRole = '';
          let vendorAvatar = '';
          let vendorInitials = 'HD';
          
          if (typeof window !== 'undefined') {
            // Check if we have business name in localStorage
            const storedBusinessName = localStorage.getItem('businessName');
            const storedRole = localStorage.getItem('user_role');
            
            if (storedBusinessName && storedBusinessName !== 'undefined' && storedBusinessName !== 'null') {
              vendorName = storedBusinessName;
            }
            
            if (storedRole && storedRole !== 'undefined' && storedRole !== 'null') {
              vendorRole = storedRole;
            }
          }
          
          // Prioritize API data over localStorage data
          if (profileData && Object.keys(profileData).length > 0) {
            // Cast profileData to any to allow indexing with strings
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const profileDataAny = profileData as any;
            
            // Try multiple possible property names for the business name
            const possibleNameProps = ['businessName', 'name', 'companyName', 'hotelName', 'restaurantName'];
            for (const prop of possibleNameProps) {
              if (profileDataAny[prop] && typeof profileDataAny[prop] === 'string' && profileDataAny[prop].trim() !== '') {
                vendorName = profileDataAny[prop];
                break;
              }
            }
            
            // If no business name found, try to construct from first and last name
            if (!vendorName && profileDataAny.firstName) {
              vendorName = profileDataAny.lastName ? 
                `${profileDataAny.firstName} ${profileDataAny.lastName}` : 
                profileDataAny.firstName;
            }
            
            // Get role information
            vendorRole = profileDataAny.role || profileDataAny.businessType || vendorRole || 'Hotel Manager';
            
            // Get avatar information
            vendorAvatar = profileDataAny.avatar || profileDataAny.profileImage || profileDataAny.image || '';
            
            // Store in localStorage for future use
            if (vendorName && typeof window !== 'undefined') {
              try {
                localStorage.setItem('businessName', vendorName);
                if (vendorRole) {
                  localStorage.setItem('user_role', vendorRole);
                }
              } catch (e) {
                console.warn('Failed to store hotel vendor info in localStorage:', e);
              }
            }
          }
          
          // If we still don't have a name, use a friendly default rather than 'Guest User'
          if (!vendorName) {
            vendorName = 'Hotel Dashboard';
          }
          
          // Generate initials from the name
          if (vendorName && vendorName !== 'Guest User' && vendorName !== 'Hotel Dashboard') {
            const nameParts = vendorName.split(' ').filter(part => part.length > 0);
            if (nameParts.length === 1) {
              vendorInitials = nameParts[0].charAt(0).toUpperCase();
            } else if (nameParts.length > 1) {
              vendorInitials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
            }
          }
          
          // Update the profile state
          setUserProfile({
            name: vendorName,
            role: vendorRole,
            avatar: vendorAvatar,
            initials: vendorInitials
          });
          
          console.log('Hotel profile loaded:', { name: vendorName, initials: vendorInitials, role: vendorRole });
        } catch (profileError) {
          console.error('Error processing hotel profile data:', profileError);
          // Fallback to ensure UI doesn't break
          setUserProfile({
            name: 'Hotel Dashboard',
            role: 'Hotel Manager',
            avatar: '',
            initials: 'HD'
          });
        }
      }catch{}
    }

    fetchDashboardData()
  },[])
  
  const fetchStaff = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (searchTerm) params.search = searchTerm;

      const queryString = new URLSearchParams(params).toString();
      const url = `/api/vendors/staff${queryString ? `?${queryString}` : ""}`;

      const data = await apiFetcher(url); 
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

      const data = await apiFetcher(url);
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
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 bg-gray-50 border-gray-200" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8"><AvatarImage src={userProfile.avatar || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>{userProfile.initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                <p className="text-xs text-gray-500">{userProfile.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-6">Staff List</h2>
      <div className="flex flex-row justify-between p-8 gap-4">
        <button className="flex flex-row gap-2 px-4 py-2 border-2 cursor-pointer rounded-md bg-white text-gray" onClick={() => setHide(!hide)}>
         {hide? <EyeClosed className="w-6 h-6" /> : <Eye className="w-6 h-6"  />} <span>Hide</span>
        </button>
        <button className="flex flex-row gap-2 px-4 py-2 cursor-pointer rounded-md bg-[#0A6C6D] text-white" onClick={() => window.location.href = '/vendor-dashboard/hotel/add-staff'}>
         <UserRoundPlus className="w-6 h-6" /> Add Staff
        </button>
      </div>
      </div>
      {/* Staff Stats */}
      {!hide &&       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 bg-white rounded-lg shadow p-5">
        <div className="flex flex-row justify-between items-center gap-4 p-6 border-r border-gray-300">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Total Staff</div>
            <div className="text-2xl font-bold text-gray-900">{staffStats?.totalStaff.count}</div>
            <span className="text-sm text-gray-600 flex flex-row items-center">{staffStats?.totalStaff.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}{staffStats?.totalStaff.change} vs last week</span>
          </div>
          <Image src="/images/total-staff.png" alt="total-staff" width={40} height={40} />
        </div>
        <div className="flex flex-row justify-between items-center gap-4 p-6 border-r border-gray-300">
           <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Active Staff</div>
            <div className="text-2xl font-bold text-gray-900">{staffStats?.activeStaff.count}</div>
            <span className="text-sm text-gray-600 flex flex-row items-center">{staffStats?.activeStaff.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}{staffStats?.activeStaff.change} vs last week</span>
           </div>
            <Image src="/images/active-staff.png" alt="active-staff" width={40} height={40} />
        </div>
        <div className="flex flex-row justify-between items-center gap-4 p-6 border-r border-gray-300">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">Inactive Staff</div>
            <div className="text-2xl font-bold text-gray-900">{staffStats?.inactiveStaff.count}</div>
            <span className="text-sm text-gray-600 flex flex-row items-center">{staffStats?.inactiveStaff.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}{staffStats?.inactiveStaff.change} vs last week</span>
          </div>
          <Image src="/images/inactive-staff.png" alt="inactive-staff" width={40} height={40} />
        </div>
        <div className="flex flex-row justify-between items-center gap-4 p-6">
          <div className="flex flex-col gap-2">
            <div className="text-sm text-gray-600">No Show Staff</div>
            <div className="text-2xl font-bold text-gray-900">{staffStats?.noShowStaff.count}</div>
            <span className="text-sm text-gray-600 flex flex-row items-center">{staffStats?.noShowStaff.trend === "up" ? <ArrowUp className="w-4 h-4 text-green-600" /> : <ArrowDown className="w-4 h-4 text-red-600" />}{staffStats?.noShowStaff.change} vs last week</span>
          </div>
          <Image src="/images/no-show-staff.png" alt="no-show-staff" width={40} height={40} />
        </div>
      </div>}
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
