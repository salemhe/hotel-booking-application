"use client"

import type React from "react"
import { useState } from "react"
import {
  Search, /* Bell, ChevronDown, X, Upload, Trash2, */ Users, UserCheck, UserX, UserMinus, MoreHorizontal, ChevronLeft, ChevronRight,
} from "lucide-react"

interface StaffMember {
  id: string
  name: string
  phone: string
  email: string
  role: string
  dateAdded: string
  status: "active" | "inactive"
  avatar: string
}

interface Permission {
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
}

interface Permissions {
  reservations: Permission
  menuManagement: Permission
  staffManagement: Permission
  paymentsReports: Permission
}

const mockStaff: StaffMember[] = [
  { id: "1", name: "Emily Johnson", phone: "+234701234567", email: "staff@example@gmail.com", role: "Chef", dateAdded: "25/07/25", status: "active", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "2", name: "Emily Johnson", phone: "+234701234567", email: "staff@example@gmail.com", role: "Chef", dateAdded: "25/07/25", status: "active", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "3", name: "Emily Johnson", phone: "+234701234567", email: "staff@example@gmail.com", role: "Chef", dateAdded: "25/07/25", status: "active", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "4", name: "Emily Johnson", phone: "+234701234567", email: "staff@example@gmail.com", role: "Manager", dateAdded: "25/07/25", status: "active", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "5", name: "Emily Johnson", phone: "+234701234567", email: "staff@example@gmail.com", role: "Waiter", dateAdded: "25/07/25", status: "active", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "6", name: "Emily Johnson", phone: "+234701234567", email: "staff@example@gmail.com", role: "Waiter", dateAdded: "25/07/25", status: "active", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "7", name: "Emily Johnson", phone: "+234701234567", email: "staff@example@gmail.com", role: "Waiter", dateAdded: "25/07/25", status: "active", avatar: "/placeholder.svg?height=32&width=32" },
  { id: "8", name: "Emily Johnson", phone: "+234701234567", email: "staff@example@gmail.com", role: "Waiter", dateAdded: "25/07/25", status: "active", avatar: "/placeholder.svg?height=32&width=32" },
];

export default function StaffManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // const [modalStep, setModalStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("All")
  const [filterStatus, setFilterStatus] = useState("All")
  // const [formData, setFormData] = useState({
  //   fullName: "",
  //   phone: "",
  //   email: "",
  //   staffId: "",
  //   jobTitle: "",
  //   branch: "",
  //   profilePicture: null as File | null,
  // })
  // const [permissions, setPermissions] = useState<Permissions>({
  //   reservations: { view: true, create: true, edit: true, delete: false },
  //   menuManagement: { view: true, create: true, edit: true, delete: true },
  //   staffManagement: { view: true, create: false, edit: false, delete: false },
  //   paymentsReports: { view: true, create: false, edit: false, delete: false },
  // })
  // const [customPermissions, setCustomPermissions] = useState(false)

  const activeStaff = mockStaff.filter((staff) => staff.status === "active").length
  const inactiveStaff = mockStaff.filter((staff) => staff.status === "inactive").length
  const totalStaff = mockStaff.length
  const filteredStaff = mockStaff.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || staff.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "All" || staff.role === filterRole
    const matchesStatus = filterStatus === "All" || staff.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleOpenModal = () => { setIsModalOpen(true); /* setModalStep(1); */ }
  // const handleCloseModal = () => {
  //   setIsModalOpen(false); setModalStep(1);
  //   setFormData({ fullName: "", phone: "", email: "", staffId: "", jobTitle: "", branch: "", profilePicture: null })
  // }
  // const handleNextStep = () => { if (modalStep === 1) setModalStep(2); }
  // const handlePrevStep = () => { if (modalStep === 2) setModalStep(1); }
  // const handleSaveStaff = () => {
  //   if (!formData.fullName || !formData.phone || !formData.email) {
  //     alert("Please fill in all required fields.");
  //     return;
  //   }
  //   console.log("Saving staff:", formData, permissions); handleCloseModal();
  // }
  // const handlePermissionChange = (module: keyof Permissions, permission: keyof Permission, value: boolean) => {
  //   setPermissions((prev) => ({ ...prev, [module]: { ...prev[module], [permission]: value } }))
  // }
  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) setFormData((prev) => ({ ...prev, profilePicture: file }))
  // }

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-screen">
      <div className="w-full flex-1 space-y-4 px-1 sm:px-8 xl:px-24 pt-6 pb-8 overflow-auto">
        {/* Header removed as requested */}
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Staff List</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">Hide tabs</button>
              <button className="text-gray-600 hover:text-gray-900">Export</button>
              <button onClick={handleOpenModal} className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2">
                <span>+ New Staff</span>
              </button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Staff</p>
                  <p className="text-3xl font-bold text-gray-900">{totalStaff}</p>
                  <p className="text-xs text-gray-500">↑ 8% vs last week</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Staff</p>
                  <p className="text-3xl font-bold text-gray-900">{activeStaff}</p>
                  <p className="text-xs text-gray-500">↑ 8% vs last week</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inactive Staff</p>
                  <p className="text-3xl font-bold text-gray-900">{inactiveStaff}</p>
                  <p className="text-xs text-gray-500">↑ 8% vs last week</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UserX className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">No-show Staff</p>
                  <p className="text-3xl font-bold text-gray-900">1</p>
                  <p className="text-xs text-gray-500">↑ 8% vs last week</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <UserMinus className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
          {/* Filters and Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className={`px-3 py-1 text-sm font-medium ${filterStatus === "All" ? "text-gray-900 border-b-2 border-teal-600" : "text-gray-600 hover:text-gray-900"}`} onClick={() => setFilterStatus("All")}>All</button>
                  <button className={`px-3 py-1 text-sm font-medium ${filterStatus === "active" ? "text-gray-900 border-b-2 border-teal-600" : "text-gray-600 hover:text-gray-900"}`} onClick={() => setFilterStatus("active")}>Active</button>
                  <button className={`px-3 py-1 text-sm font-medium ${filterStatus === "inactive" ? "text-gray-900 border-b-2 border-teal-600" : "text-gray-600 hover:text-gray-900"}`} onClick={() => setFilterStatus("inactive")}>Inactive</button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search by name or email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="All">Filter by role</option>
                    <option value="Chef">Chef</option>
                    <option value="Manager">Manager</option>
                    <option value="Waiter">Waiter</option>
                  </select>
                  <button className="text-gray-600 hover:text-gray-900">Advanced Filter</button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Added</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-full" src={staff.avatar || "/placeholder.svg"} alt="" />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.dateAdded}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">Page 1 of 20</div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-1 text-sm bg-teal-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">2</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">3</button>
                <span className="text-gray-400">...</span>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">10</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">11</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">12</button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              {/* Modal Header and Steps restored */}
              {/* ...modal content as above... */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
