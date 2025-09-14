"use client";

import { useState } from "react";
import {
  CalendarIcon,
  ChartColumn,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Search,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Mock data for transactions
const transactions = [
  {
    id: "101",
    date: new Date(2025, 2, 20),
    vendor: "Vendor A",
    paymentMethod: "Credit Card",
    amount: 5000,
    status: "Completed",
  },
  {
    id: "102",
    date: new Date(2025, 2, 21),
    vendor: "Vendor B",
    paymentMethod: "Bank Transfer",
    amount: 3000,
    status: "Pending",
  },
  {
    id: "103",
    date: new Date(2025, 2, 19),
    vendor: "Vendor A",
    paymentMethod: "Bank Transfer",
    amount: 7500,
    status: "Completed",
  },
  {
    id: "104",
    date: new Date(2025, 2, 18),
    vendor: "Vendor C",
    paymentMethod: "Credit Card",
    amount: 12000,
    status: "Completed",
  },
  {
    id: "105",
    date: new Date(2025, 2, 17),
    vendor: "Vendor B",
    paymentMethod: "Credit Card",
    amount: 4500,
    status: "Failed",
  },
  {
    id: "106",
    date: new Date(2025, 2, 16),
    vendor: "Vendor A",
    paymentMethod: "Credit Card",
    amount: 17500,
    status: "Completed",
  },
];

interface TransactionType {
  id: string;
  date: Date;
  vendor: string;
  paymentMethod: string;
  amount: number;
  status: string;
}

// Mock data for vendor summary
const vendorSummary = [
  {
    vendor: "Vendor A",
    totalEarned: 30000,
    transactionCount: 25,
    percentage: 80,
  },
  {
    vendor: "Vendor B",
    totalEarned: 12000,
    transactionCount: 10,
    percentage: 75,
  },
  {
    vendor: "Vendor C",
    totalEarned: 25000,
    transactionCount: 15,
    percentage: 65,
  },
];

export default function TrackPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Calculate total revenue
  const totalRevenue = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  // Filter transactions based on search query and status
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.vendor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      transaction.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesDate =
      !date ||
      (transaction.date.getDate() === date.getDate() &&
        transaction.date.getMonth() === date.getMonth() &&
        transaction.date.getFullYear() === date.getFullYear());

    return matchesSearch && matchesStatus && matchesDate;
  });

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentTransactions: TransactionType[] = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages: number = Math.ceil(
    filteredTransactions.length / itemsPerPage
  );

  return (
    <div className="min-h-screen text-gray-900 gap-4 grid">
      <h1 className="text-2xl font-bold">Payment Tracking</h1>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <CircleDollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              ₦{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-green-500">+15% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-600">
              Transactions
            </CardTitle>
            <ChartColumn className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {transactions.length.toLocaleString()}
            </div>
            <p className="text-xs text-green-500">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Vendor/Txns ID"
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left md:w-auto font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(value) => {
                      setDate(value);
                      setCurrentPage(1);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>P/Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>#{transaction.id}</TableCell>
                      <TableCell>{format(transaction.date, "MM/dd")}</TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                      <TableCell>{transaction.vendor}</TableCell>
                      <TableCell>
                        ₦{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            transaction.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="px-6 py-3 border-t border-gray-200 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="text-sm text-gray-700 flex items-center gap-2">
                Items per page:
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-700">
                  {filteredTransactions.length > 0
                    ? `${indexOfFirstItem + 1}-${Math.min(
                        indexOfLastItem,
                        filteredTransactions.length
                      )} of ${filteredTransactions.length}`
                    : "0-0 of 0"}
                </span>

                <div className="flex space-x-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className={`p-1 rounded-md ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages || 1)
                      )
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`p-1 rounded-md ${
                      currentPage === totalPages || totalPages === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Split per Vendor Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Total Earned</TableHead>
                  <TableHead># of Txns</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorSummary.length !== 0 ? (
                  <>
                    {vendorSummary.map((vendor) => (
                      <TableRow key={vendor.vendor}>
                        <TableCell>{vendor.vendor}</TableCell>
                        <TableCell>
                          ${vendor.totalEarned.toLocaleString()}
                        </TableCell>
                        <TableCell>{vendor.transactionCount}</TableCell>
                        <TableCell>{vendor.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No Data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
