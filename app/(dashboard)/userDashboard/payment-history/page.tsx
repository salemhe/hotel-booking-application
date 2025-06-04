"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

// Type for payment history entry
interface PaymentEntry {
  id: string;
  date: string;
  amount: number;
  restaurantName: string;
  status: 'pending' | 'successful' | 'failed';
}

type StatusFilterType = 'all' | 'pending' | 'successful' | 'failed';
type SortOption = 'newest' | 'oldest' | 'amountHigh' | 'amountLow';

export default function PaymentHistoryDashboard() {
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedPayment, setSelectedPayment] = useState<PaymentEntry | null>(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      await new Promise((res) => setTimeout(res, 1000));
    
      const dummyData: PaymentEntry[] = [
        {
          id: '1',
          date: '2025-03-20',
          amount: 25.99,
          restaurantName: 'Tasty Bites',
          status: 'successful',
        },
        {
          id: '2',
          date: '2025-03-18',
          amount: 13.49,
          restaurantName: 'Burger Palace',
          status: 'pending',
        },
        {
          id: '3',
          date: '2025-03-15',
          amount: 42.00,
          restaurantName: 'Sushi World',
          status: 'failed',
        },
        {
          id: '4',
          date: '2025-03-10',
          amount: 18.75,
          restaurantName: 'Pizza Corner',
          status: 'successful',
        },
      ];
  
      setPayments(dummyData);
      setLoading(false);
    };

    fetchPaymentHistory();
  }, []);

  // Sorting function
  const sortPayments = (payments: PaymentEntry[]): PaymentEntry[] => {
    return [...payments].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amountHigh':
          return b.amount - a.amount;
        case 'amountLow':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  };

  // Filter payments by search query and status
  const filteredPayments = sortPayments(payments.filter(payment => {
    // Handle search
    const searchMatches = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Handle status filter
    const statusMatches = 
      statusFilter === 'all' || 
      payment.status.toLowerCase() === statusFilter.toLowerCase();
    
    return searchMatches && statusMatches;
  }));

  // Pagination
  const indexOfLastItem: number = currentPage * itemsPerPage;
  const indexOfFirstItem: number = indexOfLastItem - itemsPerPage;
  const currentPayments: PaymentEntry[] = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages: number = Math.ceil(filteredPayments.length / itemsPerPage);

  // Status badge color mapping
  const getStatusBadgeClass = (status: string): string => {
    switch(status.toLowerCase()) {
      case 'successful':
        return 'bg-green-600 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Reset filters
  const resetFilters = (): void => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Refund/Dispute Modal
  const RefundDisputeModal = () => {
    if (!selectedPayment) return null;

    const handleRefund = async () => {
      try {
        await axios.post(`/api/payments/${selectedPayment.id}/refund`);
        alert('Refund request submitted');
        setSelectedPayment(null);
      } catch (error) {
        console.error('Refund failed:', error);
        alert('Failed to submit refund request');
      }
    };

    const handleDispute = async () => {
      try {
        await axios.post(`/api/payments/${selectedPayment.id}/dispute`);
        alert('Dispute initiated');
        setSelectedPayment(null);
      } catch (error) {
        console.error('Dispute failed:', error);
        alert('Failed to initiate dispute');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/70  flex items-center justify-center z-50">
  <div className="bg-white p-8 rounded-xl z-10 shadow-2xl max-w-md w-full">
    <h2 className="text-2xl font-bold mb-4">Payment Actions</h2>
    <div className="space-y-4">
      <button 
        onClick={handleRefund}
        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
      >
        Request Refund
      </button>
      <button 
        onClick={handleDispute}
        className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
      >
        Initiate Dispute
      </button>
      <button 
        onClick={() => setSelectedPayment(null)}
        className="w-full py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300"
      >
        Cancel
      </button>
    </div>
  </div>
</div>

    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded w-full"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Payment History</h1>
        </div>
        
        {/* Search and filters bar */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="relative w-full md:w-2/5">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Find by Payment ID or Restaurant"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 border border-gray-300 bg-white px-3 py-2 rounded-md">
                Sort by: {sortBy === 'newest' ? 'Newest' : 
                        sortBy === 'oldest' ? 'Oldest' : 
                        sortBy === 'amountHigh' ? 'Highest Amount' : 'Lowest Amount'}
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('newest')}>Newest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')}>Oldest</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('amountHigh')}>Highest Amount</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('amountLow')}>Lowest Amount</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <button 
              className="border border-gray-300 bg-white p-2 rounded-md"
              onClick={resetFilters}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Status filter */}
        <div className="flex flex-wrap gap-4 mb-4">
          <Select value={statusFilter} onValueChange={(value: StatusFilterType) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="successful">Successful</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Payment history card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Payment History</h2>
          </div>
          
          {/* Table using shadcn/ui Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPayments.length > 0 ? (
                  currentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">#{payment.id}</TableCell>
                      <TableCell>{payment.restaurantName}</TableCell>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button 
                          onClick={() => setSelectedPayment(payment)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Actions
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                      No payments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination with shadcn Select */}
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700 flex items-center gap-2">
              Items per page:
              <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
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
                {filteredPayments.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredPayments.length)} of ${filteredPayments.length}` : '0-0 of 0'}
              </span>
              
              <div className="flex space-x-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-1 rounded-md ${currentPage === totalPages || totalPages === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund/Dispute Modal */}
      {selectedPayment && <RefundDisputeModal />}
    </div>
  );
}