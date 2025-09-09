import { NextRequest, NextResponse } from 'next/server';
import { Vendor } from '@/app/lib/api/services/vendors';

const mockVendors: Vendor[] = [
  {
    _id: '1',
    businessName: 'Chicken Republic',
    businessType: 'restaurant',
    branch: 'Lagos Main',
    onboarded: true,
    address: '123 Victoria Island, Lagos',
    email: 'info@chickenrepublic.com',
    phone: '+2348012345678',
    services: ['Dining', 'Takeout', 'Delivery'],
    image: '/chicken-republic.jpg',
    profileImages: ['/chicken-republic.jpg'],
    description: 'Delicious fried chicken and fast food restaurant',
    rating: 4.2,
    reviews: ['Great food!', 'Quick service'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: true,
    location: 'Victoria Island, Lagos'
  },
  {
    _id: '2',
    businessName: 'Domino\'s Pizza',
    businessType: 'restaurant',
    branch: 'Ikeja Branch',
    onboarded: true,
    address: '456 Ikeja, Lagos',
    email: 'ikeja@dominos.com',
    phone: '+2348012345679',
    services: ['Pizza', 'Delivery', 'Takeout'],
    image: '/dominos.webp',
    profileImages: ['/dominos.webp'],
    description: 'World-famous pizza delivery',
    rating: 4.5,
    reviews: ['Best pizza in town', 'Fast delivery'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: true,
    location: 'Ikeja, Lagos'
  },
  {
    _id: '3',
    businessName: 'KFC Nigeria',
    businessType: 'restaurant',
    branch: 'Abuja Central',
    onboarded: true,
    address: '789 Wuse, Abuja',
    email: 'abuja@kfc.ng',
    phone: '+2348012345680',
    services: ['Fried Chicken', 'Burgers', 'Delivery'],
    image: '/KFC.png',
    profileImages: ['/KFC.png'],
    description: 'Finger-lickin\' good chicken',
    rating: 4.3,
    reviews: ['Always delicious', 'Family favorite'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    location: 'Wuse, Abuja'
  },
  {
    _id: '4',
    businessName: 'The Place Hotel',
    businessType: 'hotel',
    branch: 'Luxury Branch',
    onboarded: true,
    address: '321 Lekki, Lagos',
    email: 'reservations@theplace.com',
    phone: '+2348012345681',
    services: ['Accommodation', 'Restaurant', 'Spa'],
    image: '/the-place.jpg',
    profileImages: ['/the-place.jpg'],
    description: 'Luxury hotel with ocean views',
    rating: 4.8,
    reviews: ['Amazing stay', 'Excellent service'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: true,
    location: 'Lekki, Lagos'
  },
  {
    _id: '5',
    businessName: 'Vinna Vill Resort',
    businessType: 'hotel',
    branch: 'Resort Branch',
    onboarded: true,
    address: '654 Eko Atlantic, Lagos',
    email: 'info@vinnavill.com',
    phone: '+2348012345682',
    services: ['Resort Stay', 'Pool', 'Restaurant'],
    image: '/vinna-vill.png',
    profileImages: ['/vinna-vill.png'],
    description: 'Beautiful resort with modern amenities',
    rating: 4.6,
    reviews: ['Peaceful location', 'Great facilities'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: true,
    location: 'Eko Atlantic, Lagos'
  },
  {
    _id: '6',
    businessName: 'Ocean Land Hotel',
    businessType: 'hotel',
    branch: 'Beach Branch',
    onboarded: true,
    address: '987 Victoria Island, Lagos',
    email: 'bookings@oceanland.com',
    phone: '+2348012345683',
    services: ['Beach Hotel', 'Swimming Pool', 'Fine Dining'],
    image: '/ocean-land.png',
    profileImages: ['/ocean-land.png'],
    description: 'Seaside hotel with stunning views',
    rating: 4.4,
    reviews: ['Beautiful location', 'Comfortable rooms'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: false,
    location: 'Victoria Island, Lagos'
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you might filter based on query params
    // For now, return all mock vendors
    return NextResponse.json(mockVendors);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vendors' },
      { status: 500 }
    );
  }
}
