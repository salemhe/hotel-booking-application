"use client"
import React, { useState } from 'react';

// const RestaurantBooking = () => {
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [partySize, setPartySize] = useState('2');

//   // Sample restaurant data
//   const restaurants = [
//     {
//       id: 1,
//       name: "Aquavitae",
//       cuisine: "Modern Australian",
//       location: "Darling Harbour, Sydney, International",
//       rating: 4.7,
//       reviews: 1234,
//       image: "/api/placeholder/280/200",
//       priceRange: "$$$$",
//       isBookmarked: false
//     },
//     {
//       id: 2,
//       name: "Aquavitae",
//       cuisine: "Modern Australian", 
//       location: "Darling Harbour, Sydney, International",
//       rating: 4.7,
//       reviews: 1234,
//       image: "/api/placeholder/280/200",
//       priceRange: "$$$$",
//       isBookmarked: false
//     },
//     // Repeat for demonstration
//   ];

//   const RestaurantCard = ({ restaurant }) => (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//       <div className="relative">
//         <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//           <div className="text-blue-400 text-6xl">🍽️</div>
//         </div>
//         <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
//           <Heart className="w-4 h-4 text-gray-400" />
//         </button>
//         <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded text-xs font-medium">
//           {restaurant.priceRange}
//         </div>
//       </div>
//       <div className="p-4">
//         <div className="flex items-center gap-2 mb-2">
//           <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
//           <Info className="w-4 h-4 text-gray-400" />
//         </div>
//         <p className="text-sm text-gray-600 mb-2">{restaurant.cuisine}</p>
//         <p className="text-xs text-gray-500 mb-3">{restaurant.location}</p>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-1">
//             <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//             <span className="text-sm font-medium">{restaurant.rating}</span>
//             <span className="text-xs text-gray-500">({restaurant.reviews})</span>
//           </div>
//           <div className="flex gap-1">
//             <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
//               7:00 PM
//             </button>
//             <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
//               7:30 PM
//             </button>
//             <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
//               8:00 PM
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                 <span className="text-white text-sm font-bold">B</span>
//               </div>
//               <span className="text-xl font-bold text-gray-900">Booklet</span>
//             </div>
//             <nav className="hidden md:flex items-center gap-8">
//               <a href="#" className="text-gray-700 hover:text-gray-900">Restaurants</a>
//               <a href="#" className="text-gray-700 hover:text-gray-900">Neighbourhoods</a>
//               <a href="#" className="text-gray-700 hover:text-gray-900">Offers</a>
//             </nav>
//             <div className="flex items-center gap-4">
//               <Search className="w-5 h-5 text-gray-500" />
//               <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 min-h-[400px]">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <div className="text-center">
//             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
//               Find your Perfect Table
//             </h1>
//             <p className="text-xl text-white/90 mb-8">
//               Join over 100,000 diners who trust us to help them find their next great meal
//             </p>
            
//             {/* Search Form */}
//             <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto shadow-xl">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="relative">
//                   <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Location"
//                     className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div className="relative">
//                   <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                   <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <div className="relative">
//                   <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                   <select
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                     className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Time</option>
//                     <option value="18:00">6:00 PM</option>
//                     <option value="18:30">6:30 PM</option>
//                     <option value="19:00">7:00 PM</option>
//                     <option value="19:30">7:30 PM</option>
//                     <option value="20:00">8:00 PM</option>
//                   </select>
//                 </div>
//                 <div className="relative">
//                   <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
//                   <select
//                     value={partySize}
//                     onChange={(e) => setPartySize(e.target.value)}
//                     className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="1">1 Guest</option>
//                     <option value="2">2 Guests</option>
//                     <option value="3">3 Guests</option>
//                     <option value="4">4 Guests</option>
//                     <option value="5">5+ Guests</option>
//                   </select>
//                 </div>
//               </div>
//               <button className="mt-4 w-full md:w-auto px-8 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-medium">
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Results Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Filter Bar */}
//         <div className="flex items-center gap-4 mb-6">
//           <span className="text-sm text-gray-600">Popular Reservations:</span>
//           <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50">
//             Date Night
//           </button>
//         </div>

//         {/* Restaurant Sections */}
//         <div className="space-y-12">
//           {/* Top Rated Restaurants */}
//           <section>
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Top Rated Restaurants</h2>
//               <button className="text-teal-600 hover:text-teal-700 font-medium">View all →</button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {Array(4).fill(null).map((_, i) => (
//                 <RestaurantCard key={i} restaurant={{
//                   id: i,
//                   name: "Aquavitae",
//                   cuisine: "Modern Australian",
//                   location: "Darling Harbour, Sydney, International",
//                   rating: 4.7,
//                   reviews: 1234,
//                   priceRange: "$$$$"
//                 }} />
//               ))}
//             </div>
//           </section>

//           {/* Recently Opened */}
//           <section>
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Recently Opened</h2>
//               <button className="text-teal-600 hover:text-teal-700 font-medium">View all →</button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {Array(4).fill(null).map((_, i) => (
//                 <RestaurantCard key={i + 4} restaurant={{
//                   id: i + 4,
//                   name: "Aquavitae",
//                   cuisine: "Modern Australian",
//                   location: "Darling Harbour, Sydney, International",
//                   rating: 4.7,
//                   reviews: 1234,
//                   priceRange: "$$$$"
//                 }} />
//               ))}
//             </div>
//           </section>

//           {/* Big Brand Restaurants */}
//           <section>
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Big Brand Restaurants</h2>
//               <button className="text-teal-600 hover:text-teal-700 font-medium">View all →</button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {Array(4).fill(null).map((_, i) => (
//                 <RestaurantCard key={i + 8} restaurant={{
//                   id: i + 8,
//                   name: "Aquavitae",
//                   cuisine: "Modern Australian",
//                   location: "Darling Harbour, Sydney, International",
//                   rating: 4.7,
//                   reviews: 1234,
//                   priceRange: "$$$$"
//                 }} />
//               ))}
//             </div>
//           </section>

//           {/* Fine Dining */}
//           <section>
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Fine Dining</h2>
//               <button className="text-teal-600 hover:text-teal-700 font-medium">View all →</button>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {Array(4).fill(null).map((_, i) => (
//                 <RestaurantCard key={i + 12} restaurant={{
//                   id: i + 12,
//                   name: "Aquavitae",
//                   cuisine: "Modern Australian",
//                   location: "Darling Harbour, Sydney, International",
//                   rating: 4.7,
//                   reviews: 1234,
//                   priceRange: "$$$$"
//                 }} />
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-200 mt-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                   <span className="text-white text-sm font-bold">B</span>
//                 </div>
//                 <span className="text-xl font-bold text-gray-900">Booklet</span>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Your trusted dining companion and reservation platform
//               </p>
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
//               <ul className="space-y-2 text-sm text-gray-600">
//                 <li><a href="#" className="hover:text-gray-900">Restaurants</a></li>
//                 <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
//                 <li><a href="#" className="hover:text-gray-900">Blog</a></li>
//                 <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
//               <ul className="space-y-2 text-sm text-gray-600">
//                 <li><a href="#" className="hover:text-gray-900">Cuisines</a></li>
//                 <li><a href="#" className="hover:text-gray-900">Cities</a></li>
//                 <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
//               <ul className="space-y-2 text-sm text-gray-600">
//                 <li>📧 booklet@domain.com</li>
//                 <li>📧 big-team@booklet-help.com</li>
//                 <li>🏢 Lagos, Nigeria</li>
//                 <li>📞 +234-814-CALL</li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
//             <p>© 2024 Booklet. All Rights Reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default RestaurantBooking;

// import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import TableGrid, { TableGridTwo } from "@/components/TableGrid";

const tabs = [
  {
    name: "Restaurants",
    value: "restaurants"
  },
  {
    name: "Hotels",
    value: "hotels"
  },
]
export default function Home() {
  const [activeTab, setActiveTab] = useState("restaurants");
  return (
    <main className="min-h-screen bg-white">
      {/* <Header /> */}
      <div className="relative min-h-[400px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-br-[20px] rounded-bl-[20px]"
          style={{
            backgroundImage: activeTab === "restaurants" ? "url('/find.png')" : "url('/find-hotel.jpg')",
          }}
        />
        <div className="absolute  bg-black/70 rounded-br-[20px] rounded-bl-[20px] "></div>
        <div className="relative max-w-7xl mx-auto px-4 min-h-[400px] justify-center items-center  sm:px-6 lg:px-8 py-20">
          <div className="text-center mt-16">
            {
              activeTab === "restaurants" ? (
                <><h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Find your Perfect Table
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Discover and reserve the best restaurants in your city
              </p>
                </>
              ) : (
                <>
               <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
               Start Living Your Dream
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  Discover and reserve the best hotels in your city
                </p>
                </>
              )
            }

            <div className="flex justify-center items-center gap-4">
              {tabs.map((tab) => (
                <button key={tab.value} className={`px-4 py-2 rounded-[36px] cursor-pointer text-sm  font-medium leading-none ${activeTab === tab.value ? "bg-slate-200  text-gray-900" : "bg-transparent  text-gray-50 "}`} onClick={() => setActiveTab(tab.value)}>
                  {tab.name}
                </button>
              ))}
            </div>
            
            {/* Search Form */}
            <div className=" relative">
              <SearchSection activeTab={activeTab} />
            </div>
          </div>
        </div>
      </div>
 {
  activeTab === "restaurants" ? (
    <div className="max-w-7xl mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <TableGrid title="Popular Searches" />
    <TableGrid title="In High Demand" />
    <TableGrid title="You History" />
  </div>
 ) : (
  <div className="max-w-7xl mt-[65px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <TableGridTwo title="Popular guest house Searches" />
  </div>
 )
}
      
    </main>
  );
}