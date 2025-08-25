"use client";

import React, { useState, useRef } from "react";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { fetchForFormData } from "@/app/lib/fetcher";
import { toast } from "react-toastify";

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

  const token = localStorage.getItem("auth_token");
  console.log(token)

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <div className="mx-[34] bg-white rounded-2xl shadow-lg py-9 px-40">
      {/* Progress Bar */}
      <div className="flex items-center mb-6">
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
  );
}
