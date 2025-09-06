"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { RoomConfigurationData, RoomTypes, defaultAmenities } from '@/types/rooms';
import { Edit, Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';


interface RoomConfigurationFormProps {
  onSubmit: (data: RoomConfigurationData) => void;
   roomTypes: RoomTypes[];
   openAccordion: string;
   setOpenAccordion: (value: string) => void;
   handleInputChange: (
     roomId: string,
     field: keyof RoomTypes,
     value: string | number | string[] | number[] | File[] // adjust as needed for your RoomTypes fields
   ) => void;
   handleDeleteRoomType: (roomId: string) => void;
   handleAmenityToggle: (roomId: string, amenity: string) => void;

   
}

export function AddRoomType({ onSubmit, roomTypes, handleDeleteRoomType, openAccordion, setOpenAccordion, handleAmenityToggle, handleInputChange,  }: RoomConfigurationFormProps) {
 

  const [customAmenities, setCustomAmenities] = useState<{ [key: string]: string }>({});



  const handleAddCustomAmenity = (roomId: string) => {
    const customAmenity = customAmenities[roomId];
    if (customAmenity?.trim()) {
      const room = roomTypes.find(r => r.id === roomId);
      if (room && !room.amenities.includes(customAmenity.trim())) {
        handleInputChange(roomId, 'amenities', [...room.amenities, customAmenity.trim()]);
        setCustomAmenities(prev => ({ ...prev, [roomId]: '' }));
      }
    }
  };

  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, roomId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).slice(0, 5);
      const room = roomTypes.find(r => r.id === roomId);
      if (room) {
        const newImages = [...room.images, ...files].slice(0, 5);
        handleInputChange(roomId, 'images', newImages);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, roomId: string) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      const room = roomTypes.find(r => r.id === roomId);
      if (room) {
        const newImages = [...room.images, ...files].slice(0, 5);
        handleInputChange(roomId, 'images', newImages);
      }
    }
  };
   const roomTypesStringArray = roomTypes.map(roomType => roomType.name); // or .type

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ roomTypes: roomTypesStringArray });
  };


  const RoomTypeForm = ({ room }: { room: RoomTypes }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      {/* Left Column - Hotel Classification */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Hotel Classification</h3>
        
        {/* Room Type Name */}
        <div className="space-y-2">
          <Label htmlFor={`roomName-${room.id}`} className="text-sm font-medium text-gray-700">
            Room Type Name*
          </Label>
          <Input
            id={`roomName-${room.id}`}
            placeholder="e.g Luxury room"
            value={room.name}
            onChange={(e) => handleInputChange(room.id, 'name', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Room Description */}
        <div className="space-y-2">
          <Label htmlFor={`roomDescription-${room.id}`} className="text-sm font-medium text-gray-700">
            Room Description <span className="text-gray-400">(Optional)</span>
          </Label>
          <Textarea
            id={`roomDescription-${room.id}`}
            placeholder="Add a short description or notes about this menu"
            value={room.description}
            onChange={(e) => handleInputChange(room.id, 'description', e.target.value)}
            className="w-full min-h-[80px] resize-none"
          />
        </div>

        {/* Price Per Night */}
        <div className="space-y-2">
          <Label htmlFor={`pricePerNight-${room.id}`} className="text-sm font-medium text-gray-700">
            Price Per Night*
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
            <Input
              id={`pricePerNight-${room.id}`}
              type="number"
              value={room.pricePerNight}
              onChange={(e) => handleInputChange(room.id, 'pricePerNight', parseInt(e.target.value))}
              className="w-full pl-8"
            />
          </div>
        </div>

        {/* Adults Capacity */}
        <div className="space-y-2">
          <Label htmlFor={`adultsCapacity-${room.id}`} className="text-sm font-medium text-gray-700">
            Adults Capacity
          </Label>
          <Select value={room.adultsCapacity.toString()} onValueChange={(value) => handleInputChange(room.id, 'adultsCapacity', parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Children Capacity */}
        <div className="space-y-2">
          <Label htmlFor={`childrenCapacity-${room.id}`} className="text-sm font-medium text-gray-700">
            Children Capacity
          </Label>
          <Select value={room.childrenCapacity.toString()} onValueChange={(value) => handleInputChange(room.id, 'childrenCapacity', parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Total Available Rooms */}
        <div className="space-y-2">
          <Label htmlFor={`totalRooms-${room.id}`} className="text-sm font-medium text-gray-700">
            Total Available Unit
          </Label>
          <Select value={room.totalAvailableRooms.toString()} onValueChange={(value) => handleInputChange(room.id, 'totalAvailableRooms', parseInt(value))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right Column - Room Amenities & Images */}
      <div className="space-y-6">
        {/* Room Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Room Amenities</h3>
          
          <div className="flex items-center flex-wrap space-x-4 gap-3">
            {defaultAmenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={`${amenity}-${room.id}`}
                  checked={room.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(room.id, amenity)}
                />
                <Label htmlFor={`${amenity}-${room.id}`} className="text-sm text-gray-700">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>

          {/* Add Custom Amenity */}
          <div className="flex gap-2">
            <Input
              placeholder="Add new amenity"
              value={customAmenities[room.id] || ''}
              onChange={(e) => setCustomAmenities(prev => ({ ...prev, [room.id]: e.target.value }))}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomAmenity(room.id)}
            />
            <Button type="button" variant="outline" size="sm" onClick={() => handleAddCustomAmenity(room.id)}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>

        {/* Room Images */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Room Images</h3>
            <p className="text-sm text-gray-500">You can add up to 5 images</p>
          </div>

          {/* Image Upload Area */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, room.id)}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-600 mb-2">Drag and drop an image here, or</p>
                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById(`roomFileInput-${room.id}`)?.click()}>
                  Browse Files
                </Button>
                <input
                  id={`roomFileInput-${room.id}`}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileSelect(e, room.id)}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500">JPG, PNG OR GIF • Max 5MB</p>
            </div>
          </div>

          {/* Uploaded Images Preview */}
          {room.images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {room.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Room image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => {
                      const newImages = room.images.filter((_, i) => i !== index);
                      handleInputChange(room.id, 'images', newImages);
                    }}
                  >
                    ×
                  </Button>
                </div>
              ))}
              {room.images.length < 5 && (
                <div 
                  className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-teal-500"
                  onClick={() => document.getElementById(`roomFileInput-${room.id}`)?.click()}
                >
                  <div className="text-center">
                    <Plus className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">Upload Image</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

 

  return (
    <div className="bg-whit rounded-lg borde">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Accordion 
          type="single" 
          value={openAccordion} 
          onValueChange={setOpenAccordion}
          className="w-full space-y-8"
        >
          {roomTypes.map((room) => (
            <AccordionItem key={room.id} value={`room-${room.id}`} 
               className={`border rounded-lg shadow-sm ${
               openAccordion === `room-${room.id}` ? 'bg-white' : 'bg-[#e6f2f2]'
               }`}
         >
              <AccordionTrigger className={`px-6 py-0 hover:no-underline ${
               openAccordion === `room-${room.id}` ? 'hidden' : 'flex items-center justify-between'}`}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-gray-900">{room.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {roomTypes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoomType(room.id);
                        }}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                   
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0 pt-6">
                <RoomTypeForm room={room} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </form>
    </div>
  );
}