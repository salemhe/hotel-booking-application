"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Users,
  Filter,
  Heart,
  Utensils,
  Bed,
  ChevronDown,
  Wifi
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Restaurant {
  _id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  location: string;
  image: string;
  openHours: string;
  priceRange: string;
  distance?: string;
  features: string[];
  isOpen: boolean;
}

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [activeCategory, setActiveCategory] = useState('Restaurant');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchTerm, selectedLocation, activeCategory]);

  const fetchRestaurants = async () => {
    try {
      // Mock data for development
      const mockRestaurants: Restaurant[] = Array.from({ length: 24 }, (_, i) => ({
        _id: `restaurant-${i + 1}`,
        name: 'Kapadoccia',
        cuisine: 'International, Turkish, Contemporary',
        rating: 4.8,
        reviewCount: 1000 + i * 100,
        location: 'Lagos, Nigeria',
        image: '/hero-bg.jpg',
        openHours: '12:00 PM - 11:00 PM Daily',
        priceRange: '₦���₦',
        features: ['Outdoor seating', 'Indoor seating', 'Vegan options', 'Free WiFi'],
        isOpen: Math.random() > 0.3
      }));
      
      setRestaurants(mockRestaurants);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(restaurant =>
        restaurant.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
  };

  const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          width={300}
          height={200}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-3 left-3">
          <Badge className="bg-green-600">
            Guest's favourite
          </Badge>
        </div>
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-red-600 text-white">
              Closed
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
            <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
            <p className="text-sm text-gray-600">{restaurant.location}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 font-medium">{restaurant.rating}</span>
              <span className="text-sm text-gray-600 ml-1">
                ({restaurant.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {restaurant.features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {restaurant.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{restaurant.features.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const categories = [
    { name: 'Restaurant', icon: Utensils },
    { name: 'Hotels', icon: Bed },
    { name: 'Clubs', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/hero-bg.jpg')` 
        }}
      >
        <div className="text-center text-white space-y-6 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Find your Perfect Table
          </h1>
          <p className="text-lg md:text-xl">
            Discover and reserve the best restaurants in your city
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Enter Restaurant or Cuisine"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-gray-900"
                  />
                </div>
              </div>
              
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Pick date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="19:00">7:00 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>

              <Select value={guestCount} onValueChange={setGuestCount}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Guest</SelectItem>
                  <SelectItem value="2">2 Guests</SelectItem>
                  <SelectItem value="4">4 Guests</SelectItem>
                  <SelectItem value="6">6 Guests</SelectItem>
                  <SelectItem value="8+">8+ Guests</SelectItem>
                </SelectContent>
              </Select>

              <Button className="bg-teal-600 hover:bg-teal-700 px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeCategory === category.name
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Popular Restaurants Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Restaurants</h2>
            <Button variant="ghost" className="flex items-center">
              Show more
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRestaurants.slice(0, 8).map((restaurant) => (
                <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`}>
                  <RestaurantCard restaurant={restaurant} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Top Rated Restaurants Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Rated Restaurants</h2>
            <Button variant="ghost" className="flex items-center">
              Show more
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRestaurants.slice(8, 16).map((restaurant) => (
              <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`}>
                <RestaurantCard restaurant={restaurant} />
              </Link>
            ))}
          </div>
        </section>

        {/* Fine Dining Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Fine Dining</h2>
            <Button variant="ghost" className="flex items-center">
              Show more
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRestaurants.slice(16, 24).map((restaurant) => (
              <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`}>
                <RestaurantCard restaurant={restaurant} />
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">B</span>
                </div>
                <span className="font-bold text-xl">Bookies</span>
              </div>
              <p className="text-gray-600 text-sm">
                Making restaurant reservations simple and enjoyable
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/restaurants">Restaurants</Link></li>
                <li><Link href="/hotels">Hotels</Link></li>
                <li><Link href="/restaurants">Top Restaurants</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about">About us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/faq">FAQs</Link></li>
                <li><Link href="/help">Help center</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>+2348234567</li>
                <li>Kapadoccia@gmail.com</li>
                <li>16, Idowu Taylor Street, Victoria Island 101241 Nigeria</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 Bookies - All Rights Reserved</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
