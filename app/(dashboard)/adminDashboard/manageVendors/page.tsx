"use client";
import { Suspense, useEffect, useState } from "react";
import { Search, Store } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Skeleton } from "@/app/components/ui/skeleton";
import DropDown from "@/app/components/DropDown";
import axios from "axios";

interface Vendor {
  _id: string;
  businessName: string;
  businessType: string;
  branch: string;
  phone: string;
  services: string[];
  menuVisible?: boolean; // Add menu visibility status
}

function VendorTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        {/* <Skeleton className="h-10 w-[120px]" /> */}
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <Skeleton className="h-[400px] w-full" />
      </div>
    </div>
  );
}

function VendorsTable({
  vendors,
  loading,
  deleteVendor,
  // updateVendor,
}: {
  vendors: Vendor[];
  loading: boolean;
  deleteVendor: (id: string) => void;
  updateVendor?: (vendor: Vendor) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [vendorId, setId] = useState<string | null>(null);
  if (loading) {
    return <VendorTableSkeleton />;
  }
  if (vendors.length === 0) {
    return (
      <div className="text-center text-muted-foreground">No vendors found.</div>
    );
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vendors</h2>
      </div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="search"
          placeholder="Search vendors..."
          className="w-full"
        />
        <Button type="submit">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Services</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Store className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div className="hover:underline">{vendor.businessName}</div>
                  </div>
                </TableCell>
                <TableCell>{vendor.businessType}</TableCell>
                <TableCell>{vendor.branch}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {vendor.services
                      .slice(0, 2)
                      .map((service: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    {vendor.services.length > 2 && (
                      <Badge variant="outline">
                        +{vendor.services.length - 2} more
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropDown setShowConfirm={setShowConfirm} setId={setId} vendorId={vendor._id} />
                  {/* Show/Hide Menu Button */}
                  <Button
                    variant={vendor.menuVisible ? "destructive" : "default"}
                    size="sm"
                    className="ml-2"
                    onClick={async () => {
                      // Toggle menu visibility for this vendor
                      try {
                        await axios.patch(`https://hotel-booking-app-backend-30q1.onrender.com/api/admin/vendors/${vendor._id}/menu-visibility`, {
                          visible: !vendor.menuVisible,
                        });
                        // Update UI
                        updateVendor && updateVendor({ ...vendor, menuVisible: !vendor.menuVisible });
                      } catch (error) {
                        console.error("Error toggling menu visibility", error);
                      }
                    }}
                  >
                    {vendor.menuVisible ? "Hide Menu" : "Show Menu"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this vendor?</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  deleteVendor(vendorId!);
                  setShowConfirm(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  async function getVendors() {
    try {
      const res = await axios.get(
        "https://hotel-booking-app-backend-30q1.onrender.com/api/admin/vendors"
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching users", error);
      return null;
    }
  }

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      setLoading(true);
      const fetchedVendors = await getVendors();
      if (fetchedVendors) {
        setVendors(fetchedVendors);
      }
      setLoading(false);
    }
    fetchVendors();
  }, []);

  const deleteVendor = async (id: string) => {
    try {
      await axios.delete(
        `https://hotel-booking-app-backend-30q1.onrender.com/api/admin/vendors/${id}`
      );
      setVendors(vendors.filter((vendor) => vendor._id !== id));
    } catch (error) {
      console.error("Error deleting vendor", error);
    }
  };

  const updateVendor = async (vendor: Vendor) => {
    try {
      await axios.put(
        `https://hotel-booking-app-backend-30q1.onrender.com/api/admin/vendors/${vendor._id}`,
        vendor
      );
      setVendors(vendors.map((v) => (v._id === vendor._id ? vendor : v)));
    } catch (error) {
      console.error("Error updating vendor", error);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden bg-gray-50 min-h-screen">
      <div className="w-full flex-1 space-y-4 px-1 sm:px-8 xl:px-24 pt-6 pb-8 overflow-auto">
        <Suspense fallback={<VendorTableSkeleton />}>
          <VendorsTable
            vendors={vendors}
            loading={loading}
            deleteVendor={deleteVendor}
            updateVendor={updateVendor}
          />
        </Suspense>
      </div>
    </div>
  );
}
