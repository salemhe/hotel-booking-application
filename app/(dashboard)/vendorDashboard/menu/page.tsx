"use client";
import MenuItem from "@/app/components/MenuItem";
import { MenuPopup } from "@/app/components/MenuPopup";
import { AuthService } from "@/app/lib/api/services/auth.service";
import API from "@/app/lib/api/axios";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VendorMenuPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = AuthService.getUser();

  const fetchMenu = async () => {
    try {
      const menuResponse = await API.get(`/vendors/menus?vendorId=${user?.profile.id}`);
      return menuResponse.data.menus;
    } catch (error) {
      console.log("menu fetch error", error)
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dataFetch = async () => {
      const menu = await fetchMenu();
      setData(menu);
      console.log("menu", menu);
    };
    dataFetch();
  }, [fetchMenu]);

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
            <MenuItem data={data[i]} key={i} />
          ))}
        </div>
      )}
    </div>
  );
}
