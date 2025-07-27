"use client";

import { Reservation } from '@/app/hooks/useRealtimeReservations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Mail, 
  Phone,
  Utensils,
  Bed,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Star
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ReservationDetailsModalProps {
  reservation: Reservation;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (reservationId: string, status: string) => void;
}

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

export const ReservationDetailsModal = ({
  reservation,
  isOpen,
  onClose,
  onStatusUpdate
}: ReservationDetailsModalProps) => {
  const StatusIcon = statusIcons[reservation.status];

  const handleStatusUpdate = (newStatus: string) => {
    onStatusUpdate(reservation._id, newStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Reservation Details</span>
            <Badge className={statusColors[reservation.status]}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{reservation.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{reservation.customerEmail}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {format(parseISO(reservation.date), 'EEEE, MMMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{reservation.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Reservation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {reservation.reservationType === 'restaurant' ? (
                    <Utensils className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Bed className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-sm">
                    {reservation.reservationType === 'restaurant' ? 'Restaurant' : 'Hotel'} Reservation
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{reservation.guests} guests</span>
                </div>
                {reservation.seatingPreference && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Seating: {reservation.seatingPreference}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{reservation.businessName}</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  {reservation.location}
                </div>
                {reservation.specialOccasion && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-gray-500" />
                    <span className="text-sm capitalize">{reservation.specialOccasion}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Meals (for restaurant reservations) */}
          {reservation.meals && reservation.meals.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Ordered Meals ({reservation.meals.length})
              </h3>
              <div className="space-y-3">
                {reservation.meals.map((meal, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{meal.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {meal.quantity}</p>
                        {meal.specialRequest && (
                          <p className="text-sm text-orange-600 mt-1">
                            Special request: {meal.specialRequest}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{(meal.price * meal.quantity).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">₦{meal.price.toLocaleString()} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms (for hotel reservations) */}
          {reservation.rooms && reservation.rooms.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Bed className="w-5 h-5" />
                Booked Rooms ({reservation.rooms.length})
              </h3>
              <div className="space-y-3">
                {reservation.rooms.map((room, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{room.type}</h4>
                        <p className="text-sm text-gray-600">{room.nights} nights</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₦{(room.price * room.nights).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">₦{room.price.toLocaleString()} per night</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Requests */}
          {reservation.specialRequest && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Special Requests
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {reservation.specialRequest}
              </p>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₦{reservation.totalPrice.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-600">₦{reservation.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            {reservation.status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleStatusUpdate('cancelled')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate('confirmed')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
              </>
            )}
            
            {reservation.status === 'confirmed' && (
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleStatusUpdate('completed')}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
