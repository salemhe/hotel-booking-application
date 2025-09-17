"use client";

import React, { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { fetchForFormData } from "@/lib/fetcher";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Search, Bell, ChevronDown} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {getUserProfile} from '@/lib/api-service'

export default function AddStaffPage() {
  const [step, setStep] = useState(1);
  const [isOn, setIsOn] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // form state
  const [staffName, setStaffName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [staffId, setStaffId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [branch, setBranch] = useState(""); 
  const [jobRole, setJobRole] = useState("");
  const [customPermissions, setCustomPermissions] = useState<{ permissionModule: string; permissions: string[]; }[]>([]);



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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeImage = () => {
    setFile(null);
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input
    }
  };

  
//   useEffect(() => {
//   console.log("HERE Custom Permissions:", customPermissions);
// }, [customPermissions]);


const handleCustomPermission = (
  mod: string,
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const { checked, value } = event.target;

  setCustomPermissions((prev) => {
    const existingModule = prev.find((p) => p.permissionModule === mod);

    if (checked) {
      if (existingModule) {
       
        const updated = prev.map((p) =>
          p.permissionModule === mod
            ? {
                ...p,
                permissions: [...new Set([...p.permissions, value])],
              }
            : p
        );
        return updated;
      } else {
      // new module
        return [
          ...prev,
          { permissionModule: mod, permissions: [value] },
        ];
      }
    } else {
      //to remove the permission
      if (existingModule) {
        const updatedPermissions = existingModule.permissions.filter(
          (perm) => perm !== value
        );

        if (updatedPermissions.length === 0) {
          // remove module entirely if no permissions are left
          return prev.filter((p) => p.permissionModule !== mod);
        } else {
          return prev.map((p) =>
            p.permissionModule === mod
              ? { ...p, permissions: updatedPermissions }
              : p
          );
        }
      }
    }

    return prev; // fallback
  });
};


  // 🔥 Save Staff API call
  const saveStaff = async () => {
    if (!file) return;

    const formData = new FormData();
    if(file) formData.append("file", file);
    formData.append("staffName", staffName)
    formData.append("phone", phone)
    formData.append("email", email)
    formData.append("staffId", staffId)
    formData.append("jobTitle", jobTitle)
    formData.append("branch", branch)
    formData.append("jobRole", jobRole)
    formData.append("customPermissions", JSON.stringify(customPermissions))

    console.log("Custom Permissions:", customPermissions)
    try {
      const response = await fetchForFormData(`/api/vendors/staff`, {
        method: "POST",
        body: formData,
      });
      
      toast.success("Staff saved successfully!");
      window.location.href = "/vendor-dashboard/hotel/staff";
      return response
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error(err);
      }
      toast.error("Error saving staff");
     }
  };

  return (
    <>
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

      <div className="mx-[34] bg-white rounded-2xl shadow-lg py-9 px-40">
      {/* Progress Bar */}
      <div className="flex items-center mb-6 mt-6">
        <div className="flex-1 relative">
          <div className="absolute top-1/2 left-0 h-1 w-full bg-gray-200 -translate-y-1/2"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-[#0A6C6D] -translate-y-1/2 transition-all"
            style={{ width: step === 1 ? "50%" : "100%" }}
          ></div>
        </div>
        <div className="flex gap-2 ml-4">
          <span
            className={`h-8 w-8 flex items-center justify-center rounded-full border-2 ${
              step >= 1
                ? "bg-[#0A6C6D] text-white border-[#0A6C6D]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            {step > 1 ? <Check size={16} /> : "1"}
          </span>
          <span
            className={`h-8 w-8 flex items-center justify-center rounded-full border-2 ${
              step === 2
                ? "bg-[#0A6C6D] text-white border-[#0A6C6D]"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            2
          </span>
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Add New Staff</h2>
          <form className="space-y-4">
            <div className="flex items-center space-x-3">
              {/* Display Image */}
              {image ? (
                <div className="w-14 h-14 rounded-full overflow-hidden border shadow-sm">
                  <Image
                    src={image}
                    alt="Staff Profile"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full overflow-hidden border shadow-sm">
                  <Image
                    src="/images/image-add.png"
                    alt="Staff Profile"
                    width={25}
                    height={25}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              {/* Upload + Remove */}
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="p-2 border-2 w-40 bg-[#0A6C6D] text-white cursor-pointer rounded-md"
                />
                <Button
                  variant="ghost"
                  size="md"
                  onClick={removeImage}
                  className="p-3 border-2 cursor-pointer "
                >
                  <Image
                    src={"/images/bin.png"}
                    alt="Remove"
                    width={16}
                    height={16}
                    className="mr-2"
                  />{" "}
                  Remove
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Full name*</label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="John Doe"
                className="w-full p-2 border rounded-md bg-[#F9FAFB] focus:ring-[#0A6C6D]"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number*</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 7012345678"
                className="w-full p-2 border bg-[#F9FAFB] rounded-md focus:ring-[#0A6C6D]"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full p-2 border bg-[#F9FAFB] rounded-md focus:ring-[#0A6C6D]"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Staff ID</label>
              <input
                type="text"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                placeholder="JD12345"
                className="w-full p-2 border bg-[#F9FAFB] rounded-md focus:ring-[#0A6C6D]"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Job Title</label>
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full p-2 border bg-[#F9FAFB] rounded-md"
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="accountant">Accountant</option>
                <option value="sales manager">Sales Manager</option>
                <option value="receptionist">Receptionist</option>
                <option value="room attendant">Room Attendant</option>
                <option value="laundry attendant">Laundry Attendant</option>
                <option value="banquet staff">Banquet Staff</option>
                <option value="chef">Chef</option>
                <option value="security">Security</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Assign to Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2 bg-[#F9FAFB] border rounded-md"
              >
                <option value="">Select branch</option>
                <option value="branch-a">Branch A</option>
                <option value="branch-b">Branch B</option>
              </select>
            </div>
          </form>

          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 rounded-md border cursor-pointer"
              onClick={() =>
                (window.location.href = "/vendor-dashboard/hotel/staff")
              }
            >
              Cancel
            </button>
            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-md bg-[#0A6C6D] text-white cursor-pointer"
            >
              Assign Role
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Assign Roles & Permissions
          </h2>

          <div className="mb-4">
            <label className="text-sm font-medium">Job Role</label>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="w-full p-2 border bg-[#F9FAFB] rounded-md"
            >
              <option value="">Select Role</option>
              <option value="manager">Manager</option>
              <option value="accountant">Accountant</option>
              <option value="sales manager">Sales Manager</option>
              <option value="receptionist">Receptionist</option>
              <option value="room attendant">Room Attendant</option>
              <option value="laundry attendant">Laundry Attendant</option>
              <option value="banquet staff">Banquet Staff</option>
              <option value="chef">Chef</option>
              <option value="security">Security</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Custom Permissions</label>
            <div className="flex items-center justify-between mt-2 ">
              <i className="text-[14px]">Override set default permissions</i>
              <Switch checked={isOn} onChange={() => setIsOn(!isOn)} />
            </div>
          </div>

          {/* Permissions (optional checkboxes) */}
          {isOn && (
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Modules</th>
                <th className="p-2">View</th>
                <th className="p-2">Create</th>
                <th className="p-2">Edit</th>
                <th className="p-2">Delete</th>
              </tr>
            </thead>

            <tbody>
              {["Reservations", "Menu Management", "Staff Management", "Payments & Reports"].map(
                (mod, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{mod}</td>
                    {["view", "create", "edit", "delete"].map((perm) => (
                      <td key={perm} className="p-2 text-center">
                        <input
                          type="checkbox"
                          value={perm}
                          onChange={(e) => handleCustomPermission(mod, e)}
                          checked={
                            !!customPermissions.find(
                              (p) =>
                                p.permissionModule === mod &&
                                p.permissions.includes(perm)
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>

          </table>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={prevStep}
              className="px-4 py-2 rounded-md border cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={saveStaff}
              className="px-4 py-2 rounded-md bg-[#0A6C6D] text-white cursor-pointer"
            >
              Save Staff
            </button>
          </div>
        </div>
      )}
    </div>
    </>

  );
}
