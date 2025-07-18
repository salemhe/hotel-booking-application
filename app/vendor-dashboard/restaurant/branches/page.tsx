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

// API endpoints to be implemented by backend:
// GET /api/vendor/branches
// POST /api/vendor/branches
// PUT /api/vendor/branches/:id
// DELETE /api/vendor/branches/:id

interface BranchForm {
  branchName: string;
  address: string;
  city: string;
  phoneNumber: string;
  countryCode: string;
  openingDays: {
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
    Sunday: boolean;
  };
  opensAt: string;
  closesAt: string;
  assignedManager: string;
  assignedMenu: string;
  importAllMenuItems: boolean;
  id: string;
}

export default function BranchesDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [form, setForm] = useState<BranchForm>({
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
    id: ""
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchBranches();
  }, [searchTerm, activeTab, page]);

  async function fetchBranches() {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 12 };
      if (searchTerm) params.search = searchTerm;
      if (activeTab !== "All") params.status = activeTab;
      const res = await axios.get("/api/vendor/branches", { params });
      setBranches(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      setBranches([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrEditBranch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (form.id) {
        await axios.put(`/api/vendor/branches/${form.id}`, form);
      } else {
        await axios.post(`/api/vendor/branches`, form);
      }
      setShowAddBranch(false);
      setForm({
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
        id: ""
      });
      fetchBranches();
    } catch {
      // handle error
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteBranch(branch: any) {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    try {
      await axios.delete(`/api/vendor/branches/${branch.id}`);
      fetchBranches();
    } catch {
      // handle error
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
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
                  <div className="text-sm font-medium">Vendor Name</div>
                  <div className="text-xs text-gray-500">Admin</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">All Branches</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm">
                <Export className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowAddBranch(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Branch
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {[
                  "All",
                  "Active",
                  "Inactive"
                ].map((tab) => (
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
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <svg className="animate-spin h-8 w-8 text-teal-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {branches.map((branch) => (
                <Card key={String(branch.id)} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="absolute top-4 left-4 z-10">
                      <Badge variant="secondary" className={`${branch.status === "Opened" ? "bg-green-500" : "bg-red-500"} text-white border-0`}>
                        {String(branch.status)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <Button variant="ghost" size="sm" className="h-8 w-8 bg-white/80 hover:bg-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex justify-center pt-12 pb-4">
                      <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">{String(branch.name).split(" ")[0][0]}</span>
                      </div>
                    </div>
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
              <div className="text-center text-gray-500">List view coming soon...</div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "default" : "secondary"}
                  size="sm"
                  className={p === page ? "bg-teal-600 hover:bg-teal-700" : ""}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Modal for Add/Edit Branch */}
          {showAddBranch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowAddBranch(false)}>
                  <X className="w-5 h-5" />
                </button>
                <form onSubmit={handleCreateOrEditBranch} className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">{form.id ? "Edit Branch" : "Add Branch"}</h2>
                  <Input placeholder="Branch Name" value={form.branchName} onChange={e => setForm(f => ({ ...f, branchName: e.target.value }))} required />
                  <Input placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
                  <Input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
                  <Input placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} required />
                  <Input placeholder="Country Code" value={form.countryCode} onChange={e => setForm(f => ({ ...f, countryCode: e.target.value }))} required />
                  <div className="flex gap-2">
                    <Input type="time" value={form.opensAt} onChange={e => setForm(f => ({ ...f, opensAt: e.target.value }))} required />
                    <Input type="time" value={form.closesAt} onChange={e => setForm(f => ({ ...f, closesAt: e.target.value }))} required />
                  </div>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700" type="submit" disabled={formLoading}>{form.id ? "Save Changes" : "Add Branch"}</Button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
