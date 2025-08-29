"use client";

import { useState } from 'react';
import { useRealtimeReservations, Reservation } from '@/app/hooks/useRealtimeReservations';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import {
  Clock,
  Users,
  MapPin,
  Mail,
  Calendar,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Utensils,
  Bed,
  MoreVertical
} from 'lucide-react';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/app/components/ui/dropdown-menu';
import { ReservationDetailsModal } from './ReservationDetailsModal';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const statusIcons = {
  pending: AlertCircle,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

export const RealtimeReservations = () => {
  const { reservations, loading, connected, updateReservationStatus } = useRealtimeReservations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    const matchesType = typeFilter === 'all' || reservation.reservationType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const handleStatusUpdate = async (reservationId: string, newStatus: string) => {
    await updateReservationStatus(reservationId, newStatus);
  };

  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailsModal(true);
  };

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
    const StatusIcon = statusIcons[reservation.status];
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{reservation.customerName}</h3>
                <Badge className={statusColors[reservation.status]}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {getDateLabel(reservation.date)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {reservation.time}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {reservation.guests} guests
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {reservation.customerEmail}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {reservation.reservationType === 'restaurant' ? (
                  <Utensils className="w-3 h-3" />
                ) : (
                  <Bed className="w-3 h-3" />
                )}
                {reservation.reservationType}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewDetails(reservation)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  {reservation.status === 'pending' && (
                    <>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(reservation._id, 'confirmed')}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(reservation._id, 'cancelled')}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                    </>
                  )}
                  {reservation.status === 'confirmed' && (
                    <DropdownMenuItem onClick={() => handleStatusUpdate(reservation._id, 'completed')}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {reservation.businessName} • {reservation.location}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg text-green-600">
                  ₦{reservation.totalPrice.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {reservation.meals?.length || 0} items • {reservation.rooms?.length || 0} rooms
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading reservations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Real-time Reservations</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by customer name, email, or business..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reservations Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({filteredReservations.length})</TabsTrigger>
          <TabsTrigger value="today">
            Today ({filteredReservations.filter(r => isToday(parseISO(r.date))).length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filteredReservations.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({filteredReservations.filter(r => r.status === 'confirmed').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'New reservations will appear here in real-time'}
              </p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <ReservationCard key={reservation._id} reservation={reservation} />
            ))
          )}
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          {filteredReservations
            .filter(r => isToday(parseISO(r.date)))
            .map((reservation) => (
              <ReservationCard key={reservation._id} reservation={reservation} />
            ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredReservations
            .filter(r => r.status === 'pending')
            .map((reservation) => (
              <ReservationCard key={reservation._id} reservation={reservation} />
            ))}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {filteredReservations
            .filter(r => r.status === 'confirmed')
            .map((reservation) => (
              <ReservationCard key={reservation._id} reservation={reservation} />
            ))}
        </TabsContent>
      </Tabs>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};
