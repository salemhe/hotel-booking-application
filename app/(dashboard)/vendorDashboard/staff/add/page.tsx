"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, X, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { useRouter } from "next/navigation";

interface StaffFormData {
  profilePicture: File | null;
  profilePicturePreview: string;
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  email: string;
  staffId: string;
  jobTitle: string;
  assignToBranch: string;
  jobRole: string;
  customPermissions: boolean;
  permissions: {
    [module: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

export default function AddStaffPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StaffFormData>({
    profilePicture: null,
    profilePicturePreview: "",
    fullName: "",
    phoneNumber: "",
    countryCode: "+234",
    email: "",
    staffId: "",
    jobTitle: "",
    assignToBranch: "",
    jobRole: "manager",
    customPermissions: false,
    permissions: {
      reservations: { view: true, create: true, edit: true, delete: false },
      "menu-management": { view: true, create: true, edit: true, delete: true },
      "staff-management": {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
      "payments-reports": {
        view: true,
        create: false,
        edit: false,
        delete: false,
      },
    },
  });

  const jobRoles = [
    "Manager",
    "Assistant Manager",
    "Chef",
    "Sous Chef",
    "Waiter",
    "Cashier",
    "Host/Hostess",
    "Kitchen Staff",
  ];

  const jobTitles = [
    "Restaurant Manager",
    "Assistant Manager",
    "Head Chef",
    "Senior Waiter",
    "Kitchen Assistant",
    "Front Desk",
  ];

  const branches = [
    "Josh Chicken & Grill - Ikeja",
    "Josh Chicken & Grill - Victoria Island",
    "Josh Chicken & Grill - Lekki",
    "Josh Chicken & Grill - Surulere",
  ];

  const modules = [
    {
      id: "reservations",
      name: "Reservations",
      info: "Manage restaurant reservations and bookings",
    },
    {
      id: "menu-management",
      name: "Menu Management",
      info: "Create and manage restaurant menus and items",
    },
    {
      id: "staff-management",
      name: "Staff Management",
      info: "Manage staff members and their roles",
    },
    {
      id: "payments-reports",
      name: "Payments & Reports",
      info: "Access payment records and generate reports",
    },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file),
      }));
    }
  };

  const removeImage = () => {
    if (formData.profilePicturePreview) {
      URL.revokeObjectURL(formData.profilePicturePreview);
    }
    setFormData((prev) => ({
      ...prev,
      profilePicture: null,
      profilePicturePreview: "",
    }));
  };

  const togglePermission = (moduleId: string, permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleId]: {
          ...prev.permissions[moduleId],
          [permission]: !prev.permissions[moduleId][permission],
        },
      },
    }));
  };

  const selectAllPermissions = () => {
    const allSelected = Object.values(formData.permissions).every(
      (module) => module.view && module.create && module.edit && module.delete,
    );

    setFormData((prev) => ({
      ...prev,
      permissions: Object.keys(prev.permissions).reduce(
        (acc, moduleId) => ({
          ...acc,
          [moduleId]: {
            view: !allSelected,
            create: !allSelected,
            edit: !allSelected,
            delete: !allSelected,
          },
        }),
        {},
      ),
    }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      // Submit form
      console.log("Staff data:", formData);
      router.push("/vendorDashboard/staff");
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else {
      router.back();
    }
  };

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Add New Staff</h2>
        <p className="text-gray-600">
          Fill in the staff member's basic information
        </p>
      </div>

      {/* Profile Picture */}
      <div className="text-center">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Profile Picture
        </label>
        <div className="flex justify-center space-x-4">
          {formData.profilePicturePreview ? (
            <div className="relative">
              <img
                src={formData.profilePicturePreview}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={removeImage}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </span>
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {formData.profilePicturePreview && (
              <Button variant="outline" size="sm" onClick={removeImage}>
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full name*
          </label>
          <Input
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            placeholder="John Doe"
            required
          />
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staff ID
          </label>
          <Input
            value={formData.staffId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, staffId: e.target.value }))
            }
            placeholder="JD12345"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <select
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Enter job Title</option>
            {jobTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign to Branch
          </label>
          <select
            value={formData.assignToBranch}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                assignToBranch: e.target.value,
              }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Select branch from the list</option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Assign Roles & Permissions</h2>
        <p className="text-gray-600">
          Set up access levels and permissions for this staff member
        </p>
      </div>

      {/* Job Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Role
        </label>
        <select
          value={formData.jobRole}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, jobRole: e.target.value }))
          }
          className="w-full p-3 border border-gray-300 rounded-lg bg-white max-w-md"
        >
          {jobRoles.map((role) => (
            <option key={role.toLowerCase()} value={role.toLowerCase()}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Permissions Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <div className="font-medium">Set Custom Permissions</div>
          <div className="text-sm text-gray-600">
            Override set default permissions
          </div>
        </div>
        <Switch
          checked={formData.customPermissions}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, customPermissions: checked }))
          }
        />
      </div>

      {/* Permissions Table */}
      {formData.customPermissions && (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">Module Permissions</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="select-all"
                  onChange={selectAllPermissions}
                  className="rounded border-gray-300"
                />
                <label htmlFor="select-all" className="text-sm">
                  Select all permissions
                </label>
              </div>
            </div>

            {/* Permissions Header */}
            <div className="grid grid-cols-6 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-gray-700">Modules</div>
              <div className="text-center font-medium text-gray-700">View</div>
              <div className="text-center font-medium text-gray-700">
                Create
              </div>
              <div className="text-center font-medium text-gray-700">Edit</div>
              <div className="text-center font-medium text-gray-700">
                Delete
              </div>
              <div></div>
            </div>

            {/* Permissions Rows */}
            {modules.map((module) => (
              <div
                key={module.id}
                className="grid grid-cols-6 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{module.name}</span>
                  <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                    <Info className="w-3 h-3 text-white" />
                  </div>
                </div>

                {["view", "create", "edit", "delete"].map((permission) => (
                  <div key={permission} className="text-center">
                    <input
                      type="checkbox"
                      checked={
                        formData.permissions[module.id]?.[permission] || false
                      }
                      onChange={() => togglePermission(module.id, permission)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                  </div>
                ))}

                <div></div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Add New Staff</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handleBack}>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Button>

          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleNext}
            disabled={
              currentStep === 1 && (!formData.fullName || !formData.phoneNumber)
            }
          >
            {currentStep === 1 ? "Assign Role" : "Save Staff"}
          </Button>
        </div>
      </div>
    </div>
  );
}
