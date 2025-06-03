"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ChevronLeft, ChevronRight, Frown, RefreshCcwIcon } from "lucide-react";
import { Button } from "./ui/button";
import API from "@/utils/axios";
import { AuthService } from "@/services/auth.services";

interface PaymentType {
  _id: string;
  totalAmount: number;
  type: string;
  commision: number;
  amount: number;
  status: string;
  createdAt: string;
}

export function PaymentBreakdown() {
  const [sortBy, setSortBy] = useState("newest");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(true);
  const user = AuthService.getUser()

  const sortBookings = (bookings: PaymentType[]): PaymentType[] => {
    return [...bookings].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "highest":
          return (b.amount || 0) - (a.amount || 0);
        case "lowest":
          return (a.amount || 0) - (b.amount || 0);
        default:
          return 0;
      }
    });
  };

  const resetFilters = (): void => {
    setStatus("All");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const formatPaymentId = (id: string): string => {
    return `#${id.substring(0, 4)}`;
  };

  const filteredBookings = sortBookings(
    payments.filter((payment) => {
      // Handle status filter
      const statusMatches =
        status === "All" ||
        payment.status.toLowerCase() === status.toLowerCase();

      return statusMatches;
    })
  );

  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentPayments: PaymentType[] = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages: number = Math.ceil(filteredBookings.length / itemsPerPage);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      // const data = await fetchPaymentBreakdown();
      const res = await API.get(`/vendors/transactions?vendorId=${user?.id}`);
      const data = res.data.transactions;

      setPayments((data as PaymentType[]).filter((e: PaymentType) => e.type === "payment"))
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-600">
          Payment Breakdown
        </CardTitle>
        <div className="flex flex-col md:flex-row justify-end md:items-center mb-4 gap-4 w-full">
          <Button
            variant="outline"
            title="Reset filters"
            className="text-sm font-normal"
            onClick={resetFilters}
          >
            Reset Filters
            <RefreshCcwIcon />
          </Button>
          <div className="flex gap-2 flex-wrap w-full md:w-auto">
            <div className="flex md:items-center gap-2 flex-col md:flex-row w-full md:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Sort by
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-[130px] bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Earning</SelectItem>
                  <SelectItem value="lowest">Lowest Earning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex md:items-center gap-2 flex-col md:flex-row w-full md:w-auto">
              <span className="text-sm text-muted-foreground">Status</span>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="min-w-[130px] bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="success">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex w-full flex-col divide-y-2 divide-white">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse w-full h-[40px] bg-gray-200"
              />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className=" whitespace-nowrap">Payment ID</TableHead>
                <TableHead className=" whitespace-nowrap">Date</TableHead>
                <TableHead className=" whitespace-nowrap">
                  User Paid Amount
                </TableHead>
                <TableHead className=" whitespace-nowrap">Admin Cut</TableHead>
                <TableHead className=" whitespace-nowrap">
                  Vendor Earnings
                </TableHead>
                <TableHead className=" whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="flex flex-col items-center justify-center text-center py-10">
                      <Frown className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        No Payment found. Try adjusting your filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {currentPayments?.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium">
                        {formatPaymentId(item._id)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        {item.totalAmount
                          ? `₦${item.totalAmount.toLocaleString()}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {item.commision
                          ? `₦${item.commision.toLocaleString()}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="font-medium text-green-500">
                        ₦{item.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === "success"
                              ? "bg-green-100 text-green-800"
                              : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        )}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
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
              {filteredBookings.length > 0
                ? `${indexOfFirstItem + 1}-${Math.min(
                    indexOfLastItem,
                    filteredBookings.length
                  )} of ${filteredBookings.length}`
                : "0-0 of 0"}
            </span>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
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
  );
}
