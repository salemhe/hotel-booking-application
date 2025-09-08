"use client";

import { Button } from '@/app/components/sammys-ui/button';
import { Input } from '@/app/components/sammys-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/sammys-ui/select';
import { BookingStatus, PaymentStatus } from '@/types/booking';
import { Filter, Search } from 'lucide-react';

interface BookingFiltersProps {
  activeStatus: BookingStatus;
  onStatusChange: (status: BookingStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  paymentStatus: PaymentStatus;
  onPaymentStatusChange: (status: PaymentStatus) => void;
}

export function BookingFilters({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  paymentStatus,
  onPaymentStatusChange,
}: BookingFiltersProps) {
  const statusTabs: BookingStatus[] = ['All', 'Upcoming', 'Completed', 'Canceled', 'No shows'];
  
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as PaymentStatus;
    onPaymentStatusChange(value);
  };

  return (
    <div className="space-x- flex items-center justify-between mb-4">
      {/* Status Tabs */}
      <div className="flex gap-1 b rounded-lg w-fit">
        {statusTabs.map((status) => (
         <Button   
  key={status}   
  variant={activeStatus === status ? 'secondary' : 'ghost'}   
  size="sm"   
  onClick={() => onStatusChange(status)}   
  className={`px-2 py-2 text-sm font-medium focus:outline-none focus:ring-0 focus:ring-offset-0 active:outline-none ${     
    activeStatus === status       
      ? 'bg-green-50 shadow-sm focus:outline-none focus:ring-0 focus:ring-offset-0 active:outline-none'       
      : 'text-gray-600 hover:text-gray-900'   
  }`} 
>   
  {status} 
</Button>

        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by guest name or ID"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
          <Select defaultValue="today"  >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue={paymentStatus} onChange={() => handleChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Payments</SelectItem>
              <SelectItem value="Fully Paid">Fully Paid</SelectItem>
              <SelectItem value="Partly paid">Partly Paid</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" className="gap-2 text-sm font-normal">
            <Filter className="h-4 w-4 flex-nowrap text-nowrap " />
            Advanced filter
          </Button>
        </div>
      </div>
    </div>
  );
}