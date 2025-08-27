'use client';

import { RestaurantProfile } from '../../../../../mobile/Users';

interface RestaurantPageProps {
  params: {
    id: string;
  };
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  return <RestaurantProfile restaurantId={params.id} />;
}
