"use client";
import MenuItem from "@/components/MenuItem";
import { MenuPopup } from "@/components/MenuPopup";
import { api } from "@/lib/axios-config";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const vendorId = 3;

export default function VendorMenuPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const data = async () => {
      const menu = await fetchMenu();
      setData(menu);
    };
    data();
  }, []);

  const fetchMenu = async () => {
    try {
      const menuResponse = await api.get(`/vendors/menus/${vendorId}`);
      return menuResponse.data.menus;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occured wile fetching menus");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-3xl font-semibold">Your Menu</h2>
        <MenuPopup />
      </div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : !data ? (
        <div className="container mx-auto py-8 px-4">No Menu found!</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
          {data.map((menu, i) => (
            <MenuItem key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
