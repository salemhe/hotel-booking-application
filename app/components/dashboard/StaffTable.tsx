"use client";

import React, { useMemo , useState} from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
// import { fas } from '@fortawesome/free-solid-svg-icons';
import { Eye, PenLine, Ban, RotateCcw, CircleX } from "lucide-react";


type StaffMember = {
  _id: string;
  staffName: string;
  staffId: string;
  branch: string;
  jobRole: string;
  status: string;
  createdAt: string;
  phone: string;
  email: string;
  profileImage: string;
};

export default function StaffTable({ staff }: { staff: StaffMember[] }) {
      const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setOpenMenu(openMenu === id ? null : id);
  };
  const columns = useMemo<ColumnDef<StaffMember>[]>(
    () => [
      {
        accessorKey: "staffName",
        header: "Name",
        cell: (info) => <span className="font-semibold">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "jobRole",
        header: "Role",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const value = info.getValue() as string;
          return (
            <Badge variant="secondary" className={`px-2 py-1 rounded-full text-xs font-medium ${
                    value === "active" ? "bg-green-100 text-green-700"
                      : value === "inactive"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
              {value === "active"
                ? "Active"
                : value === "inactive"
                ? "Inactive"
                : "No Show"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date Added",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
    ],
    []
  );

  const table = useReactTable({
    data: staff,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow">
      {/* Search box */}
      <div className="mb-4">
        <Input
          placeholder="Search staff..."
          value={(table.getColumn("staffName")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("staffName")?.setFilterValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg">
          <thead className=" bg-[#E6F2F2]">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} >
                <th  className="p-5 text-left border-b cursor-pointer"></th>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-5 text-left border-b cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                        asc: " 🔼",
                        desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                      
                  </th>
                  
                ))}
                <th  className="p-5 text-left border-b cursor-pointer"></th>
              </tr>
            ))}
  
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="p-5 border-b"><Image src={row.original.profileImage || "/images/staff.png"} alt={row.original.staffName} width={40} height={40} className=" rounded-full" /></td>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-5 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                 
                ))}
                 <td className="p-5 border-b"><Image src={"/images/ellipsis.png"} alt={row.original.staffName} width={20} height={20}className="rounded-full cursor-pointer" onClick={() => toggleMenu(row.original._id)} /></td>
                 {openMenu === row.original._id && (
                  <div className="absolute bg-white border rounded shadow-md mt-2 right-10 z-10">
                    <button className="flex align-middle  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer">
                        <Eye className="w-5 h-5 text-gray-700 mx-1" />
                        View Profile
                    </button>
                    <button className="flex align-middle px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer">
                        <PenLine className="w-5 h-5 text-gray-700 mx-1" />
                        Edit Staff Info
                    </button>
                    <button className="flex align-middle px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer">
                        <PenLine className="w-5 h-5 text-gray-700 mx-1 " />
                        Modify Roles
                    </button>
                    <button className="flex align-middle px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer">
                        <Ban className="w-5 h-5 text-gray-700 mx-1" />
                        Suspend Staff
                    </button>
                    <button className="flex align-middle px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-pointer">
                        <RotateCcw className="w-5 h-5 text-gray-700 mx-1" />
                        Reset Password
                    </button>
                    <button className="flex align-middle px-4 py-2 text-sm text-red-400 hover:bg-gray-100 w-full text-left mt-4 cursor-pointer">
                        <CircleX className="w-5 h-5 text-red-400 mx-1" />
                        Remove Staff
                    </button>
                  </div>
                 )}
              </tr>
            ))}
     
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="secondary"
          size="sm"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          Previous
        </Button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
