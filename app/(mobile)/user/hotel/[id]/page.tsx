'use client';

import { HotelProfile } from '../../../../../mobile/Users';

interface HotelPageProps {
  params: {
    id: string;
  };
}

export default function HotelPage({ params }: HotelPageProps) {
  return <HotelProfile hotelId={params.id} />;
}
