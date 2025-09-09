import { NextRequest, NextResponse } from 'next/server';
import { Restaurant, RestaurantsResponse } from '@/types/restaurants';

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Chicken Republic',
    image: '/chicken-republic.jpg',
    rating: 4.2,
    reviews: 1250,
    location: 'Victoria Island, Lagos',
    cuisine: 'Fast Food',
    priceRange: '$$',
    description: 'Delicious fried chicken and fast food',
    isOpen: true,
    distance: '2.5 km'
  },
  {
    id: '2',
    name: 'Domino\'s Pizza',
    image: '/dominos.webp',
    rating: 4.5,
    reviews: 890,
    location: 'Ikeja, Lagos',
    cuisine: 'Pizza',
    priceRange: '$$',
    description: 'World-famous pizza delivery',
    isOpen: true,
    distance: '3.1 km'
  },
  {
    id: '3',
    name: 'KFC Nigeria',
    image: '/KFC.png',
    rating: 4.3,
    reviews: 2100,
    location: 'Wuse, Abuja',
    cuisine: 'Fast Food',
    priceRange: '$$',
    description: 'Finger-lickin\' good chicken',
    isOpen: false,
    distance: '5.2 km'
  },
  {
    id: '4',
    name: 'The Place Restaurant',
    image: '/restaurant.jpg',
    rating: 4.8,
    reviews: 650,
    location: 'Lekki, Lagos',
    cuisine: 'Fine Dining',
    priceRange: '$$$',
    description: 'Luxury dining with ocean views',
    isOpen: true,
    distance: '4.0 km'
  },
  {
    id: '5',
    name: 'Ocean Land Bistro',
    image: '/restaurant.webp',
    rating: 4.6,
    reviews: 420,
    location: 'Eko Atlantic, Lagos',
    cuisine: 'Seafood',
    priceRange: '$$$',
    description: 'Fresh seafood with modern twist',
    isOpen: true,
    distance: '6.8 km'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine') || '';
    const location = searchParams.get('location') || '';
    const sortBy = searchParams.get('sortBy') || 'rating';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filtered = mockRestaurants.filter(restaurant => {
      const matchesSearch = !search || 
        restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(search.toLowerCase());
      const matchesCuisine = !cuisine || restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase());
      const matchesLocation = !location || restaurant.location.toLowerCase().includes(location.toLowerCase());
      
      return matchesSearch && matchesCuisine && matchesLocation;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      if (sortBy === 'distance') return (parseFloat(a.distance || '0') - parseFloat(b.distance || '0'));
      return 0;
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = filtered.slice(startIndex, endIndex);

    const response: RestaurantsResponse = {
      restaurants: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}
