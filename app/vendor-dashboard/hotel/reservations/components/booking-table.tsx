"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Booking } from '@/types/booking';
import { MoreHorizontal } from 'lucide-react';

interface BookingTableProps {
  bookings: Booking[];
}

export function BookingTable({ bookings }: BookingTableProps) {
  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'Fully Paid':
        return 'default';
      case 'Partly paid':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'Fully Paid':
        return 'bg-green-100 text-green-800 p-3  0';
      case 'Partly paid':
        return 'bg-yellow-100 text-yellow-800 p-3 ';
      default:
        return 'bg-gray-100 text-gray-800 p-3 hover:bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] sm:min-w-full text-sm">
          <thead>
            <tr className="bg-[#e6f2f2] border-b">
              <th className="text-left py-4 px-4 sm:px-6 font-medium text-gray-600"> 
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="text-left py-4 px-4 sm:px-6 font-medium text-gray-600">Customer name</th>
              <th className="text-left py-4 px-4 sm:px-6 font-medium text-gray-600">Check-In Date</th>
              <th className="text-left py-4 px-4 sm:px-6 font-medium text-gray-600">Check-Out Date</th>
              <th className="text-left py-4 px-4 sm:px-6 font-medium text-gray-600">Room Type</th>
              <th className="text-left py-4 px-4 sm:px-6 font-medium text-gray-600">No of Guests</th>
              <th className="text-left py-4 px-4 sm:px-6 font-medium text-gray-600">Payment Status</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={`${booking.id}-${index}`} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 sm:px-6">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {/* <AvatarImage src={booking.customer.avatar} /> */}
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {booking?.customer?.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{booking.customer?.customerName}</p>
                      <p className="text-sm text-gray-500">ID: {booking.customer?.userId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 sm:px-6 text-gray-600">{booking?.checkInDate}</td>
                <td className="py-4 px-4 sm:px-6 text-gray-600">{booking?.checkOutDate}</td>
                <td className="py-4 px-4 sm:px-6 text-gray-600">{booking?.roomType}</td>
                <td className="py-4 px-4 sm:px-6 text-gray-600">{booking?.numberOfGuests}</td>
                <td className="py-4 px-4 sm:px-6">
                  <Badge 
                    variant={getPaymentStatusVariant(booking.paymentStatus)}
                    className={`py-2 px-3 ${getPaymentStatusClass(booking.paymentStatus)}`}
                  >
                    {booking.paymentStatus}
                  </Badge>
                </td>
                <td className="py-4 px-4 sm:px-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="text-2xl w-8 h-8 rotate-90 " />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit booking</DropdownMenuItem>
                      <DropdownMenuItem>Cancel booking</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Optional: Message for small screens */}
      <div className="sm:hidden px-4 py-3 text-center text-sm text-gray-500">
        Scroll right to see full table &rarr;
      </div>
    </div>
  );
}
