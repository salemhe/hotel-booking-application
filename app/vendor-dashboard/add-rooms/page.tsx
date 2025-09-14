"use client";

import { HotelFormData } from '@/lib/types/hotels';
import { useState } from 'react';
import { SetupSteps } from './components/setup-steps';
import { HotelSetupForm } from './components/hotel-setup-form';
import { Button } from '@/components/ui/button';
import Header from './components/Header';
import { AddRoomType } from './components/add-rooms';
import { RoomTypes } from '@/lib/types/rooms';
import { Plus } from 'lucide-react';
import { BookingPolicyForm } from './components/booking-policy';
import { BookingPolicyData } from '@/lib/types/booking-policy';
import HotelBookingInterface from './components/rooms-confirmation';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  const handleFormSubmit = (data: HotelFormData) => {
    console.log('Hotel setup data:', data);
    // Handle form submission here
  };

   const [roomTypes, setRoomTypes] = useState<RoomTypes[]>([
    {
      id: '1',
      name: 'Luxury Room',
      description: '',
      pricePerNight: 100000,
      adultsCapacity: 2,
      childrenCapacity: 2,
      totalAvailableRooms: 2,
      amenities: ['Wi-Fi', 'TV', 'AC'],
      images: []
    }
  ]);


  const [openAccordion, setOpenAccordion] = useState<string>('room-1');

  const handleAddRoomType = () => {
    const newRoomId = `${roomTypes.length + 1}`;
    const newRoom: RoomTypes = {
      id: newRoomId,
      name: `Room Type ${roomTypes.length + 1}`,
      description: '',
      pricePerNight: 100000,
      adultsCapacity: 2,
      childrenCapacity: 2,
      totalAvailableRooms: 2,
      amenities: ['Wi-Fi', 'TV', 'AC'],
      images: []
    };
    
    setRoomTypes(prev => [...prev, newRoom]);
    setOpenAccordion(`room-${newRoomId}`);
    // onAddRoomType();
  };

  const handleDeleteRoomType = (roomId: string) => {
    if (roomTypes.length > 1) {
      setRoomTypes(prev => prev.filter(room => room.id !== roomId));
      // If we're deleting the currently open accordion, open the first remaining one
      if (openAccordion === `room-${roomId}`) {
        const remainingRooms = roomTypes.filter(room => room.id !== roomId);
        if (remainingRooms.length > 0) {
          setOpenAccordion(`room-${remainingRooms[0].id}`);
        }
      }
    }
  };

    const handleInputChange = (
      roomId: string,
      field: keyof RoomTypes,
      value: string | number | string[] | File[] | number[] | undefined
    ) => {
    setRoomTypes(prev => prev.map(room => 
      room.id === roomId ? { ...room, [field]: value } : room
    ));
  };

  const handleAmenityToggle = (roomId: string, amenity: string) => {
    setRoomTypes(prev => prev.map(room => 
      room.id === roomId ? {
        ...room,
        amenities: room.amenities.includes(amenity)
          ? room.amenities.filter(a => a !== amenity)
          : [...room.amenities, amenity]
      } : room
    ));
  };

   const handleBookingPolicySubmit = (data: BookingPolicyData) => {
    console.log('Booking policy data:', data);
    // Handle booking policy submission here
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Header />
      <div className="max-w-6xl mx-auto  pt-24 px-6">
        {/* Progress Steps */}
        <SetupSteps currentStep={currentStep} />
        
        {/* Form Container */}
        <div className="">
          {
            currentStep === 1 && (
              <HotelSetupForm onSubmit={handleFormSubmit} />
            )

          }
          {currentStep === 2 && (
            <AddRoomType
              onSubmit={(data) => {
                console.log('Room configuration data:', data);
                // Handle room configuration submission here
              }}
              handleDeleteRoomType={handleDeleteRoomType}
              roomTypes={roomTypes}
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
              handleInputChange={handleInputChange}
              handleAmenityToggle={handleAmenityToggle}
            />
          )}
           {currentStep === 3 && (
            <div className=" ">
              <BookingPolicyForm onSubmit={handleBookingPolicySubmit} />
            </div>
          )}
          {
            currentStep === 4 && (
             <HotelBookingInterface />
            )
          }
        </div>
        
      </div>
      <div className="flex flex-row items-center justify-between px-10 py-2 bg-white mt-8 ">
          <Button
            variant="outline"
            size="default"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
          >
            Cancel
          </Button>

          {/* Add Another Room Type Button */}
        <div className="flex  items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRoomType}
            className={`gap-2 ${
                           currentStep === 1 ? 'hidden' : 'flex'
                           }`}
          >
            
            {currentStep === 3 || currentStep === 4 ? (
                <span>Save Draft</span>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Another Room Type</span>
                </>
              )}
          </Button>
        
          <Button
            variant="secondary"
            size="default"
            className='bg-[#0a6c6d] text-white hover:bg-teal-700'
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 4))}
            disabled={currentStep === 4}
          >
            Continue
          </Button>
          </div>
        </div>
    </div>
  );
}