"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Search, Download, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { format } from "date-fns";

// Mock transaction data
const MOCK_TRANSACTIONS = [
  {
    id: "TX123456",
    date: new Date(2023, 5, 15, 18, 30),
    customer: "John Doe",
    amount: 12500,
    status: "completed",
    paymentMethod: "card",
    items: [
      { name: "Jollof Rice & Chicken", quantity: 2, price: 3000 },
      { name: "Chapman", quantity: 2, price: 1500 },
      { name: "Beef Suya", quantity: 1, price: 3500 },
    ],
    paymentDetails: {
      cardType: "Visa",
      last4: "4242",
      processorFee: 250,
      netAmount: 12250,
    },
  },
  {
    id: "TX123457",
    date: new Date(2023, 5, 15, 19, 45),
    customer: "Sarah Johnson",
    amount: 8500,
    status: "completed",
    paymentMethod: "paystack",
    items: [
      { name: "Fried Rice & Turkey", quantity: 1, price: 3500 },
      { name: "Chicken Burger", quantity: 1, price: 2500 },
      { name: "Soft Drink", quantity: 2, price: 1250 },
    ],
    paymentDetails: {
      cardType: "Mastercard",
      last4: "5678",
      processorFee: 170,
      netAmount: 8330,
    },
  },
  {
    id: "TX123458",
    date: new Date(2023, 5, 16, 13, 15),
    customer: "Michael Brown",
    amount: 15000,
    status: "completed",
    paymentMethod: "card",
    items: [
      { name: "Seafood Pasta", quantity: 2, price: 4500 },
      { name: "Garlic Bread", quantity: 1, price: 1500 },
      { name: "Wine", quantity: 1, price: 4500 },
    ],
    paymentDetails: {
      cardType: "Visa",
      last4: "1234",
      processorFee: 300,
      netAmount: 14700,
    },
  },
  {
    id: "TX123459",
    date: new Date(2023, 5, 16, 20, 30),
    customer: "Emily Wilson",
    amount: 9500,
    status: "refunded",
    paymentMethod: "paystack",
    items: [
      { name: "Chicken Shawarma", quantity: 2, price: 3000 },
      { name: "Fries", quantity: 1, price: 1500 },
      { name: "Soft Drink", quantity: 2, price: 1000 },
    ],
    paymentDetails: {
      cardType: "Visa",
      last4: "9876",
      processorFee: 190,
      netAmount: 9310,
      refundReason: "Customer dissatisfaction with service",
      refundDate: new Date(2023, 5, 17, 10, 20),
    },
  },
  {
    id: "TX123460",
    date: new Date(2023, 5, 17, 12, 45),
    customer: "David Lee",
    amount: 7500,
    status: "partially_paid",
    paymentMethod: "split",
    items: [
      { name: "Beef Burger", quantity: 1, price: 3500 },
      { name: "Chicken Wings", quantity: 1, price: 3000 },
      { name: "Soft Drink", quantity: 1, price: 1000 },
    ],
    paymentDetails: {
      splitDetails: [
        { name: "David Lee", amount: 3750, status: "paid" },
        { name: "Jessica Lee", amount: 3750, status: "pending" },
      ],
      processorFee: 75,
      netAmount: 3675,
    },
  },
  {
    id: "TX123461",
    date: new Date(2023, 5, 18, 19, 30),
    customer: "Robert Johnson",
    amount: 22500,
    status: "completed",
    paymentMethod: "split",
    items: [
      { name: "Mixed Grill Platter", quantity: 1, price: 12500 },
      { name: "Seafood Combo", quantity: 1, price: 8000 },
      { name: "Cocktails", quantity: 2, price: 2000 },
    ],
    paymentDetails: {
      splitDetails: [
        { name: "Robert Johnson", amount: 11250, status: "paid" },
        { name: "Amanda Johnson", amount: 11250, status: "paid" },
      ],
      processorFee: 450,
      netAmount: 22050,
    },
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  type SplitDetail = {
    name: string;
    amount: number;
    status: string;
  };

  type PaymentDetails = {
    cardType?: string;
    last4?: string;
    processorFee: number;
    netAmount: number;
    refundReason?: string;
    refundDate?: Date;
    splitDetails?: SplitDetail[];
  };

  type TransactionItem = {
    name: string;
    quantity: number;
    price: number;
  };

  type Transaction = {
    id: string;
    date: Date;
    customer: string;
    amount: number;
    status: string;
    paymentMethod: string;
    items: TransactionItem[];
    paymentDetails: PaymentDetails;
  };

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    // In a real implementation, you would fetch data from your API
    // const fetchTransactions = async () => {
    //   const data = await fetch('/api/vendor/transactions').then(res => res.json());
    //   setTransactions(data);
    //   setFilteredTransactions(data);
    // };
    // fetchTransactions();

    // For now, we'll just use the mock data
    setTransactions(MOCK_TRANSACTIONS);
    applyFilters(MOCK_TRANSACTIONS, searchQuery, statusFilter, dateFilter);
  }, []);

  const applyFilters = (data: Transaction[], query: string, status: string, date: string) => {
    let filtered = [...data];

    // Apply search query filter
    if (query) {
      filtered = filtered.filter(
        (tx) =>
          tx.id.toLowerCase().includes(query.toLowerCase()) ||
          tx.customer.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((tx) => tx.status === status);
    }

    // Apply date filter
    if (date !== "all") {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.date);
        
        switch (date) {
          case "today":
            return txDate.toDateString() === today.toDateString();
          case "yesterday":
            return txDate.toDateString() === yesterday.toDateString();
          case "week":
            return txDate >= lastWeek;
          case "month":
            return txDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(transactions, query, statusFilter, dateFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(transactions, searchQuery, value, dateFilter);
  };

  const handleDateFilter = (value: string) => {
    setDateFilter(value);
    applyFilters(transactions, searchQuery, statusFilter, value);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "partially_paid":
        return <Badge className="bg-blue-100 text-blue-800">Partially Paid</Badge>;
      case "refunded":
        return <Badge className="bg-red-100 text-red-800">Refunded</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by transaction ID or customer"
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={handleDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy HH:mm")}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(transaction)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Transaction ID: {selectedTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">
                    {format(new Date(selectedTransaction.date), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p>{getStatusBadge(selectedTransaction.status)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedTransaction.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium capitalize">{selectedTransaction.paymentMethod}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTransaction.items.map((item: TransactionItem, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price * item.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(selectedTransaction.amount)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Payment Details</h3>
                
                {selectedTransaction.paymentDetails && (
                  <div>
                    {/* Split Payment Details */}
                    {selectedTransaction.paymentMethod === "split" && selectedTransaction.paymentDetails.splitDetails && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Split Payment Participants</p>
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Participant</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedTransaction.paymentDetails.splitDetails.map((split: SplitDetail, index: number) => (
                                <TableRow key={index}>
                                  <TableCell>{split.name}</TableCell>
                                  <TableCell className="text-right">{formatCurrency(split.amount)}</TableCell>
                                  <TableCell className="text-right">{getStatusBadge(split.status)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    )}

                    {/* Card Payment Details */}
                    {(selectedTransaction.paymentMethod === "card" || selectedTransaction.paymentMethod === "paystack") && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {selectedTransaction.paymentDetails.cardType && (
                          <div>
                            <p className="text-sm text-gray-500">Card Type</p>
                            <p className="font-medium">{selectedTransaction.paymentDetails.cardType}</p>
                          </div>
                        )}
                        {selectedTransaction.paymentDetails.last4 && (
                          <div>
                            <p className="text-sm text-gray-500">Last 4 Digits</p>
                            <p className="font-medium">**** {selectedTransaction.paymentDetails.last4}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Refund Information */}
                    {selectedTransaction.status === "refunded" && selectedTransaction.paymentDetails.refundReason && (
                      <div className="bg-red-50 p-3 rounded-md mb-4">
                        <p className="text-sm text-red-800">
                          <strong>Refund Reason:</strong> {selectedTransaction.paymentDetails.refundReason}
                        </p>
                        {selectedTransaction.paymentDetails.refundDate && (
                          <p className="text-sm text-red-800 mt-1">
                            <strong>Refund Date:</strong> {format(new Date(selectedTransaction.paymentDetails.refundDate), "MMM dd, yyyy HH:mm")}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Fee Summary */}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between">
                        <p className="text-sm text-gray-500">Processor Fee</p>
                        <p className="font-medium">{formatCurrency(selectedTransaction.paymentDetails.processorFee || 0)}</p>
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm font-bold">Net Amount</p>
                        <p className="font-bold">{formatCurrency(selectedTransaction.paymentDetails.netAmount || selectedTransaction.amount)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}