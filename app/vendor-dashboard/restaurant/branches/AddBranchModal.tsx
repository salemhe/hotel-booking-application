"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/app/components/ui/checkbox"
import { X, MapPin, Clock, Search } from "lucide-react"

import type { Branch } from "./page";
interface AddBranchModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (branch: Branch) => void
  branch?: Branch | null
}

export default function AddBranchModal({ isOpen, onClose, onSave, branch }: AddBranchModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDays, setSelectedDays] = useState<string[]>(branch?.selectedDays || [])
  const [importMenuItems, setImportMenuItems] = useState(branch?.importMenuItems || false)
  const [branchName, setBranchName] = useState(branch?.branchName || "")
  const [address, setAddress] = useState(branch?.address || "")
  const [city, setCity] = useState(branch?.city || "")
  const [state, setState] = useState(branch?.state || "")
  // Parse country code and phone number
  const [countryCode, setCountryCode] = useState(() => {
    if (branch?.phone) {
      const match = branch.phone.match(/^(\+\d{1,4})(\d{7,15})$/);
      if (match) return match[1];
      return "+234";
    }
    return "+234";
  });
  const [phone, setPhone] = useState(() => {
    if (branch?.phone) {
      const match = branch.phone.match(/^(\+\d{1,4})(\d{7,15})$/);
      if (match) return match[2];
      return branch.phone.replace(/^[^0-9]+/, "");
    }
    return "";
  });
  const [opensAt, setOpensAt] = useState(branch?.opensAt || "09:00");
  const [closesAt, setClosesAt] = useState(branch?.closesAt || "22:00");
  const [manager, setManager] = useState(branch?.manager || "");
  const [menu, setMenu] = useState(branch?.menu || "");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setSelectedDays([...selectedDays, day])
    } else {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const branchData = {
        branchName,
        address,
        city,
        state,
        phone: countryCode + phone,
        opensAt,
        closesAt,
        selectedDays,
        manager,
        menu,
        importMenuItems,
      };
      let res;
      if (branch) {
        // Edit mode
        res = await fetch(`/api/branches/${branch.id ?? branch.branchName}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(branchData)
        })
      } else {
        // Add mode
        res = await fetch("/api/branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(branchData)
        })
      }
      if (res && res.ok) {
        if (onSave) onSave(branchData as Branch);
        onClose();
        // Reset form
        setBranchName("");
        setAddress("");
        setCity("");
        setState("");
        setPhone("");
        setCountryCode("+234");
        setOpensAt("09:00");
        setClosesAt("22:00");
        setSelectedDays([]);
        setManager("");
        setMenu("");
        setImportMenuItems(false);
      } else {
        alert("Failed to save branch.");
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Branch</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Branch Name */}
          <div className="space-y-2">
            <Label htmlFor="branch-name" className="text-sm font-medium text-gray-700">
              Branch name<span className="text-red-500">*</span>
            </Label>
            <Input id="branch-name" placeholder="e.g. Joe's Chicken and Grill - Ikeja" className="w-full" value={branchName} onChange={e => setBranchName(e.target.value)} />
          </div>
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Address<span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input id="address" placeholder="Start typing address" className="pl-10" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
          {/* City and State */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City<span className="text-red-500">*</span>
              </Label>
              <Input id="city" placeholder="City" className="w-full" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                State<span className="text-red-500">*</span>
              </Label>
              <select
                id="state"
                className="w-full border rounded px-3 py-2"
                value={state}
                onChange={e => setState(e.target.value)}
              >
                <option value="">Select state</option>
                <option value="lagos">Lagos</option>
                <option value="abuja">Abuja</option>
                <option value="kano">Kano</option>
                <option value="rivers">Rivers</option>
              </select>
            </div>
          </div>
          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number<span className="text-red-500">*</span>
            </Label>
            <div className="flex w-full max-w-xl rounded-lg border border-gray-300 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-200 overflow-hidden shadow-sm">
              <select
                className="w-16 h-12 rounded-l-lg border-none bg-transparent text-base px-2 focus:ring-0 focus:border-none"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
              >
                <option value="+234">+234</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
              <Input
                id="phone"
                placeholder="7012345678"
                className="w-full h-12 rounded-r-lg border-none bg-transparent text-base px-4 focus:ring-0 focus:border-none outline-none"
                value={phone}
                maxLength={11}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={e => {
                  // Only allow digits
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val);
                }}
              />
            </div>
          </div>
          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Operating Hours</h3>
            {/* Opening Days */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">
                Opening Days <span className="text-gray-500 font-normal">(Select opening days)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.toLowerCase()}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                    />
                    <Label htmlFor={day.toLowerCase()} className="text-sm text-gray-700 cursor-pointer">
                      {day === "Thursday" ? "Thursdays" : day}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            {/* Opening and Closing Times */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Opens at</Label>
                <div className="relative">
                  <Input type="time" value={opensAt} onChange={e => setOpensAt(e.target.value)} className="pr-10" />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Closes at</Label>
                <div className="relative">
                  <Input type="time" value={closesAt} onChange={e => setClosesAt(e.target.value)} className="pr-10" />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          {/* Management & Menu */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Management & Menu</h3>
            {/* Assign Manager */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Assign Manager</Label>
              <div className="relative">
                <Input placeholder="Select manager" className="pr-10" value={manager} onChange={e => setManager(e.target.value)} />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            {/* Assign Menu */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Assign Menu</Label>
              <div className="relative">
                <Input placeholder="Search & Select menu" className="pr-10" value={menu} onChange={e => setMenu(e.target.value)} />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            {/* Import Menu Items Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="import-menu" checked={importMenuItems} onCheckedChange={checked => setImportMenuItems(checked === true)} />
              <Label htmlFor="import-menu" className="text-sm text-gray-700 cursor-pointer">
                Import all menu and menu items
              </Label>
            </div>
          </div>
        </div>
        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <Button variant="ghost" onClick={onClose} className="text-gray-600 hover:text-gray-800">
            Cancel
          </Button>
          <Button variant="secondary" className="text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save & Add another"}
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Branch"}</Button>
        </div>
      </div>
    </div>
  )
}
