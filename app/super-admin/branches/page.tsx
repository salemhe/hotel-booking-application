"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Bell,
  ChevronDown,
  Plus,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Star,
  MapPin,
    ChevronLeft,
  ChevronRight,
  Download as Export,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const API_URL = "https://hotel-booking-app-backend-30q1.onrender.com/api";

// Removed unused sidebarItems

function AddNewBranchModal({ isOpen, setIsOpen, onBranchAdded }: { isOpen: boolean, setIsOpen: (v: boolean) => void, onBranchAdded: () => void }) {
  const [formData, setFormData] = useState({
    branchName: "",
    address: "",
    city: "",
    phoneNumber: "",
    countryCode: "+234",
    openingDays: {
      Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false,
    },
    opensAt: "08:00",
    closesAt: "22:00",
    assignedManager: "",
    assignedMenu: "",
    importAllMenuItems: false,
  });
    // Removed unused variable 'saving'
  type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const countryCodes = ["+234", "+1", "+44", "+91", "+86"];
  const handleDayChange = (day: DayOfWeek, checked: boolean) => {
    setFormData((prev) => ({ ...prev, openingDays: { ...prev.openingDays, [day]: checked } }));
  };
  const handleSubmit = async (action: string) => {
        try {
      // POST to backend
      await axios.post(`${API_URL}/super-admin/branches`, {
        name: formData.branchName,
        address: formData.address,
        city: formData.city,
        phoneNumber: formData.countryCode + formData.phoneNumber,
        openingDays: Object.keys(formData.openingDays).filter(day => formData.openingDays[day as keyof typeof formData.openingDays]),
        opensAt: formData.opensAt,
        closesAt: formData.closesAt,
        assignedManager: formData.assignedManager,
        assignedMenu: formData.assignedMenu,
        importAllMenuItems: formData.importAllMenuItems,
      });
      onBranchAdded(); // Refresh branch list
      if (action === "saveAndAdd") {
        setFormData({
          branchName: "",
          address: "",
          city: "",
          phoneNumber: "",
          countryCode: "+234",
          openingDays: { Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false },
          opensAt: "08:00",
          closesAt: "22:00",
          assignedManager: "",
          assignedMenu: "",
          importAllMenuItems: false,
        });
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const response = err.response;
        console.error('API error:', response.data);
        alert("Failed to save branch: " + (response.data?.message || JSON.stringify(response.data)));
      } else {
        console.error('Error:', err);
        alert("Failed to save branch. Please try again.");
      }
    } finally {
          }
  };
  return (
    <>
      <div className={isOpen ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" : "hidden"}>
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
          <div className="flex flex-row items-center justify-between pb-4">
            <div className="text-lg font-semibold">Add New Branch</div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-6">
            {/* Branch Name */}
            <div className="space-y-2">
              <label htmlFor="branchName" className="text-sm font-medium">Branch name*</label>
              <Input id="branchName" placeholder="e.g. Joe&apos;s Chicken and Grill - Ikeja" value={formData.branchName} onChange={e => setFormData(prev => ({ ...prev, branchName: e.target.value }))} className="w-full" />
            </div>
            {/* Address */}
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address*</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="address" placeholder="Start typing address..." value={formData.address} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} className="pl-10 w-full" />
              </div>
            </div>
            {/* City */}
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">City*</label>
              <select value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full border rounded px-3 py-2">
                <option value="">Select state</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="kano">Kano</option>
                <option value="ibadan">Ibadan</option>
                <option value="port-harcourt">Port Harcourt</option>
              </select>
            </div>
            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number*</label>
              <div className="flex gap-2">
                <select value={formData.countryCode} onChange={e => setFormData(prev => ({ ...prev, countryCode: e.target.value }))} className="w-20 border rounded px-3 py-2">
                  {countryCodes.map(code => <option key={code} value={code}>{code}</option>)}
                </select>
                <Input id="phoneNumber" placeholder="7012345678" value={formData.phoneNumber} onChange={e => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))} className="flex-1" />
              </div>
            </div>
            {/* Operating Hours */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Operating Hours</h3>
              {/* Opening Days */}
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Opening Days (Select opening days)</label>
                <div className="grid grid-cols-2 gap-2">
                  {days.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <input type="checkbox" id={day} checked={formData.openingDays[day]} onChange={e => handleDayChange(day as DayOfWeek, e.target.checked)} />
                      <label htmlFor={day} className="text-sm">{day}</label>
                    </div>
                  ))}
                </div>
              </div>
              {/* Time Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="opensAt" className="text-sm text-gray-600">Opens at</label>
                  <Input id="opensAt" type="time" value={formData.opensAt} onChange={e => setFormData(prev => ({ ...prev, opensAt: e.target.value }))} className="w-full" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="closesAt" className="text-sm text-gray-600">Closes at</label>
                  <Input id="closesAt" type="time" value={formData.closesAt} onChange={e => setFormData(prev => ({ ...prev, closesAt: e.target.value }))} className="w-full" />
                </div>
              </div>
            </div>
            {/* Management & Menu */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Management & Menu</h3>
              {/* Assign Manager */}
              <div className="space-y-2">
                <label htmlFor="assignManager" className="text-sm text-gray-600">Assign Manager</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="assignManager" placeholder="" value={formData.assignedManager} onChange={e => setFormData(prev => ({ ...prev, assignedManager: e.target.value }))} className="pl-10 w-full" />
                </div>
                <select className="w-full border rounded px-3 py-2" value={formData.assignedManager} onChange={e => setFormData(prev => ({ ...prev, assignedManager: e.target.value }))}>
                  <option value="">Select manager</option>
                  <option value="manager1">John Doe</option>
                  <option value="manager2">Jane Smith</option>
                  <option value="manager3">Mike Johnson</option>
                </select>
              </div>
              {/* Assign Menu */}
              <div className="space-y-2">
                <label htmlFor="assignMenu" className="text-sm text-gray-600">Assign Menu</label>
                <div className="relative">
                  <Input id="assignMenu" placeholder="Search & Select menu" value={formData.assignedMenu} onChange={e => setFormData(prev => ({ ...prev, assignedMenu: e.target.value }))} className="pr-10 w-full" />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" id="importAllMenuItems" checked={formData.importAllMenuItems} onChange={e => setFormData(prev => ({ ...prev, importAllMenuItems: e.target.checked }))} />
                  <label htmlFor="importAllMenuItems" className="text-sm text-gray-600">Import all menu and menu items</label>
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsOpen(false)} className="flex-1">Cancel</Button>
              <Button variant="secondary" onClick={() => handleSubmit("saveAndAdd")} className="flex-1">Save & Add another</Button>
              <Button onClick={() => handleSubmit("save") } className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">Save Branch</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function BranchesDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
   const [branches, setBranches] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddBranch, setShowAddBranch] = useState(false);
  // Removed unused variables 'router' and 'pathname'

  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line
  }, [searchTerm, activeTab, page]);

  async function fetchBranches() {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 12 };
      if (searchTerm) params.search = searchTerm;
      if (activeTab !== "All") params.status = activeTab;
      const res = await axios.get(`${API_URL}/super-admin/branches`, { params });
      setBranches(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setBranches([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  const filteredBranches = branches; // Already filtered by backend

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar removed: now handled by layout.tsx */}
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search"
                  className="pl-10 w-80"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarFallback>JE</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">Joseph Eyeaokah</div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Branches</h1>
            </div>
            <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm">
            <Export className="w-4 h-4 mr-2" />
            Export
            </Button>
            <AddNewBranchModal isOpen={showAddBranch} setIsOpen={setShowAddBranch} onBranchAdded={fetchBranches} />
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowAddBranch(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Branch
            </Button>
            </div>
          </div>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {["All", "Active", "Inactive"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search branches"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced filter
              </Button>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          {/* Branch Cards Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredBranches.map((branch) => (
                <Card key={String(branch.id)} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <Badge variant="secondary" className={`${branch.status === "Opened" ? "bg-green-500" : "bg-red-500"} text-white border-0`}>
                        {String(branch.status)}
                      </Badge>
                    </div>
                    {/* More Options */}
                    <div className="absolute top-4 right-4 z-10">
                      <Button variant="ghost" size="sm" className="h-8 w-8 bg-white/80 hover:bg-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    {/* Branch Avatar */}
                    <div className="flex justify-center pt-12 pb-4">
                      <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">{String(branch.name).split(" ")[0][0]}</span>
                      </div>
                    </div>
                    {/* Branch Info */}
                    <div className="px-6 pb-6">
                      <h3 className="text-lg font-semibold text-center mb-4 text-gray-900">{String(branch.name).replace(/'/g, "&apos;")}</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Today&apos;s Reservation</span>
                          <span className="text-sm font-semibold">{String(branch.todayReservation)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Today&apos;s Revenue</span>
                          <span className="text-sm font-semibold">₦{branch.todayRevenue?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Last Food Today</span>
                          <span className="text-sm font-semibold">{String(branch.lastFoodToday)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Average Rating</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">{String(branch.averageRating)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full mt-4 border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                      >
                        View Branch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mb-8">
              {/* List view can be implemented here if needed */}
              <div className="text-center text-gray-500">List view coming soon...</div>
            </div>
          )}
          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  className={p === page ? "bg-teal-600 hover:bg-teal-700" : ""}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
