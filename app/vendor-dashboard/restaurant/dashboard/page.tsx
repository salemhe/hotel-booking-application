// 'use client'

// import { useState, useEffect } from 'react'
// import {
//   Search, Bell, ChevronDown, X, Plus, TrendingDown, TrendingUp,
//   Calendar, CreditCard, Users, DollarSign
// } from 'lucide-react'
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from '@/components/ui/input'
// import { Badge } from '@/components/ui/badge'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
// import { NativeSelect as Select } from '@/components/ui/select'
// import { 
//   getDashboardStats, 
//   getTodayReservations, 
//   getReservationTrends,
//   getCustomerFrequency,
//   getRevenueByCategory,

//   getReservationSources,
//   getUserProfile,
//   getUpcomingReservations
// } from '@/app/lib/api-service'
  getReservationSources,
  getUpcomingReservations
} from '@/app/lib/api-service'
import { AuthService } from '@/app/lib/api/services/auth.service'

// // Define interfaces for our data structures
// interface Reservation {
//   id: string;
//   customerName: string;
//   customerAvatar?: string;
//   customerInitials?: string;
//   name?: string;
//   date: string | Date;
//   time: string;
//   guests: number;
//   status: string;
// }

// interface ChartDataPoint {
//   day: string;
//   value1: number;
//   value2: number;
//   value3: number;
// }

// interface MenuCategory {
//   name: string;
//   percentage: number;
//   amount: string | number;
//   color: string;
// }

// // Define API response data interfaces at the module level
// interface StatsData {
//   reservationsToday?: number;
//   prepaidReservations?: number;
//   expectedGuests?: number;
//   pendingPayments?: number;
//   pendingPaymentsTrend?: number;
//   reservationsTrend?: number;
//   prepaidTrend?: number;
//   guestsTrend?: number;
// }

// interface TrendsData {
//   chartData?: ChartDataPoint[];
// }

// interface FrequencyData {
//   newCustomers?: number;
//   returningCustomers?: number;
//   totalCustomers?: number;
// }

// interface RevenueData {
//   categories?: MenuCategory[];
// }

// interface SourcesData {
//   website?: number;
//   mobile?: number;
//   walkIn?: number;
//   total?: number;
// }

// export default function Dashboard() {
//   const [showNotification, setShowNotification] = useState(true)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
  
//   // State for user profile
//   const [userProfile, setUserProfile] = useState({
//     name: '',
//     role: '',
//     avatar: '',
//     initials: 'VD' // Default initials for Vendor Dashboard
//   })
  
//   // State for upcoming reservations
//   const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
  
//   // State for dashboard data
//   const [stats, setStats] = useState({
//     reservationsToday: 0,
//     prepaidReservations: 0,
//     expectedGuests: 0,
//     pendingPayments: 0,
//     pendingPaymentsTrend: 0,
//     reservationsTrend: 0,
//     prepaidTrend: 0,
//     guestsTrend: 0
//   })
// const [reservations, setReservations] = useState<Reservation[]>([])
//   const [chartData, setChartData] = useState<ChartDataPoint[]>([])
//   const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
//   const [customerData, setCustomerData] = useState({
//     newCustomers: 0,
//     returningCustomers: 0,
//     totalCustomers: 0
//   })
//   const [reservationSources, setReservationSources] = useState({
//     website: 0,
//     mobile: 0,
//     walkIn: 0,
//     total: 0
//   })
//   const [selectedPeriod, setSelectedPeriod] = useState('weekly')

//   // Set up WebSocket connection for real-time updates
//   useEffect(() => {
//     // Function to establish WebSocket connection for real-time data
//     const setupWebSocket = () => {
//       try {
//         // Check if WebSocket is supported
//         if (typeof window !== 'undefined' && 'WebSocket' in window) {
//           // Replace with your actual WebSocket endpoint
//           const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT || 'wss://api.example.com/ws';
  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    // Function to establish WebSocket connection for real-time data
    const setupWebSocket = () => {
      try {
        // Check if WebSocket is supported
        if (typeof window !== 'undefined' && 'WebSocket' in window) {
          // Only initialize WebSocket if endpoint is configured properly; otherwise fall back to polling
          const wsEnv = process.env.NEXT_PUBLIC_WS_ENDPOINT;
          if (!wsEnv || !/^wss?:\/\//.test(wsEnv)) {
            console.warn('WebSocket endpoint not configured; falling back to polling');
            return null;
          }
          const wsEndpoint = wsEnv;
          
//           console.log('Attempting to establish WebSocket connection for restaurant dashboard...');
          
//           // Create WebSocket connection
//           const socket = new WebSocket(wsEndpoint);
          
//           // Connection opened
//           socket.addEventListener('open', (event) => {
//             console.log('WebSocket connection established for restaurant dashboard');
            
//             // Subscribe to relevant data channels
//             socket.send(JSON.stringify({
//               action: 'subscribe',
//               channels: ['restaurant_stats', 'restaurant_reservations', 'restaurant_notifications']
//             }));
//           });
          
//           // Listen for messages from the server
//           socket.addEventListener('message', (event) => {
//             try {
//               const data = JSON.parse(event.data);
//               console.log('Real-time update received:', data.type);
              
//               // Handle different types of updates
//               switch (data.type) {
//                 case 'stats_update':
//                   // Update dashboard stats
//                   setStats(prevStats => ({
//                     ...prevStats,
//                     ...data.stats
//                   }));
//                   break;
                  
//                 case 'new_reservation':
//                   // Add new reservation to the list
//                   setReservations(prev => [data.reservation, ...prev]);
//                   break;
                  
//                 case 'upcoming_reservation':
//                   // Update upcoming reservations
//                   setUpcomingReservations(prev => {
//                     const exists = prev.some(r => r.id === data.reservation.id);
//                     if (!exists) {
//                       setShowNotification(true);
//                       return [data.reservation, ...prev];
//                     }
//                     return prev;
//                   });
//                   break;
                  
//                 default:
//                   console.log('Unknown update type:', data.type);
//               }
//             } catch (error) {
//               console.error('Error processing WebSocket message:', error);
//             }
//           });
          
//           // Handle errors
//           socket.addEventListener('error', (event) => {
//             console.error('WebSocket error:', event);
//           });
          // Handle errors (downgraded to warning to avoid Next overlay)
          socket.addEventListener('error', (event) => {
            console.warn('WebSocket error suppressed:', event);
          });
          
//           // Handle connection closing
//           socket.addEventListener('close', (event) => {
//             console.log('WebSocket connection closed:', event.code, event.reason);
            
//             // Attempt to reconnect after a delay
//             setTimeout(() => {
//               console.log('Attempting to reconnect WebSocket...');
//               setupWebSocket();
//             }, 5000);
//           });
          
//           // Return cleanup function
//           return socket;
//         } else {
//           console.log('WebSocket not supported, falling back to polling');
//           return null;
//         }
//       } catch (error) {
//         console.error('Error setting up WebSocket:', error);
//         return null;
//       }
//     };
    
//     // Initially set up WebSocket
//     const socket = setupWebSocket();
    
//     // Fetch dashboard data - fallback to regular API calls
//     const fetchDashboardData = async () => {
//       try {
//         setIsLoading(true)
//         setError(null)
        
//         console.log("Fetching real-time dashboard data...");
        
//         // Remove the artificial delay - we want real-time data
//         // if (process.env.NODE_ENV === 'development') {
//         //   await new Promise(resolve => setTimeout(resolve, 800));
//         // }
        
//         // Modified approach to handle API errors gracefully
//         // Use the interfaces defined at the module level
        
//         // Initialize with properly typed empty objects
//         let statsData: StatsData = {};
//         let todayReservations: Reservation[] = [];
//         let trendsData: TrendsData = {};
//         let frequencyData: FrequencyData = {};
//         let revenueData: RevenueData = {};
//         let sourcesData: SourcesData = {};
//         let profileData: any = {};
//         let upcomingData: Reservation[] = [];
            
//         // Helper function to safely fetch data and handle errors with proper TypeScript typing
//         const safelyFetchData = async <T,>(fetchFn: () => Promise<any>, defaultValue: T): Promise<T> => {
//           try {
//             const result = await fetchFn();
            
//             // Check for error object
//             if (result && typeof result === 'object' && 'isError' in result && result.isError) {
//               const errorObj = result.error || {};
//               const errorMessage = typeof errorObj === 'object' && 'message' in errorObj 
//                 ? errorObj.message 
//                 : (typeof errorObj === 'string' ? errorObj : 'Unknown error');
                
//               console.log(`API Error fetching data: ${errorMessage}`);
//               return defaultValue;
//             }
            
//             // Check for empty object (which may not have isError flag)
//             if (result && typeof result === 'object' && 
//                 !Array.isArray(result) && 
//                 Object.keys(result).length === 0) {
//               console.log('Received empty object from API');
//               return defaultValue;
//             }
            
//             return result || defaultValue;
//           } catch (error) {
//             let errorMessage = 'Unknown error';
//             if (error) {
//               if (typeof error === 'string') {
//                 errorMessage = error;
//               } else if (typeof error === 'object' && error !== null) {
//                 // Use proper type checking to access the message property
//                 errorMessage = error && 'message' in error && typeof error.message === 'string'
//                   ? error.message
//                   : JSON.stringify(error);
//               }
//             }
//             console.log(`Exception fetching data: ${errorMessage}`);
//             return defaultValue;
//           }
//         };
        
//         // Fetch dashboard data sequentially to avoid overwhelming the API
//         statsData = await safelyFetchData<StatsData>(() => getDashboardStats(), {});
//         todayReservations = await safelyFetchData<Reservation[]>(() => getTodayReservations(), []);
//         trendsData = await safelyFetchData<TrendsData>(() => getReservationTrends(selectedPeriod), {});
//         frequencyData = await safelyFetchData<FrequencyData>(() => getCustomerFrequency(selectedPeriod), {});
//         revenueData = await safelyFetchData<RevenueData>(() => getRevenueByCategory(selectedPeriod), {});
//         sourcesData = await safelyFetchData<SourcesData>(() => getReservationSources(selectedPeriod), {});
        
//         // Profile data needs special handling with retries
//         for (let retry = 0; retry < 3; retry++) {
//           profileData = await safelyFetchData<any>(() => getUserProfile(), {});
//           if (profileData && Object.keys(profileData).length > 0) break;
//           console.log(`Retrying profile fetch, attempt ${retry + 1}/3`);
//           await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between retries
//         }
        // Profile data needs special handling with retries
        for (let retry = 0; retry < 3; retry++) {
          try {
            if (AuthService.isAuthenticated()) {
              const id = await AuthService.getId();
              if (id) {
                profileData = await AuthService.fetchMyProfile(id);
              }
            }
          } catch {}
          if (profileData && Object.keys(profileData).length > 0) break;
          console.log(`Retrying profile fetch, attempt ${retry + 1}/3`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between retries
        }
        
//         upcomingData = await safelyFetchData<Reservation[]>(() => getUpcomingReservations(), []);
        
//         // Update state with fetched data
//         setStats({
//           reservationsToday: statsData.reservationsToday || 0,
//           prepaidReservations: statsData.prepaidReservations || 0,
//           expectedGuests: statsData.expectedGuests || 0,
//           pendingPayments: statsData.pendingPayments || 0,
//           pendingPaymentsTrend: statsData.pendingPaymentsTrend || 0,
//           reservationsTrend: statsData.reservationsTrend || 0,
//           prepaidTrend: statsData.prepaidTrend || 0,
//           guestsTrend: statsData.guestsTrend || 0
//         })
        
//         setReservations(todayReservations || [])
//         setChartData(trendsData?.chartData || [])
        
//         setCustomerData({
//           newCustomers: frequencyData?.newCustomers || 0,
//           returningCustomers: frequencyData?.returningCustomers || 0,
//           totalCustomers: frequencyData?.totalCustomers || 0
//         })
        
//         setMenuCategories(revenueData?.categories || [])
        
//         setReservationSources({
//           website: sourcesData?.website || 0,
//           mobile: sourcesData?.mobile || 0,
//           walkIn: sourcesData?.walkIn || 0,
//           total: sourcesData?.total || 0
//         })
        
//         // Set user profile data with enhanced flexibility for different API response formats
//         try {
//           // Try to get the profile data from localStorage first if API failed
//           let vendorName = '';
//           let vendorRole = '';
//           let vendorAvatar = '';
//           let vendorInitials = 'VD';
          
//           if (typeof window !== 'undefined') {
//             // Check if we have business name in localStorage
//             const storedBusinessName = localStorage.getItem('businessName');
//             const storedRole = localStorage.getItem('user_role');
            
//             if (storedBusinessName && storedBusinessName !== 'undefined' && storedBusinessName !== 'null') {
//               vendorName = storedBusinessName;
//             }
            
//             if (storedRole && storedRole !== 'undefined' && storedRole !== 'null') {
//               vendorRole = storedRole;
//             }
//           }
          
//           // Prioritize API data over localStorage data
//           if (profileData && Object.keys(profileData).length > 0) {
//             // Try multiple possible property names for the business name
//             const possibleNameProps = ['businessName', 'name', 'companyName', 'restaurantName', 'hotelName'];
//             for (const prop of possibleNameProps) {
//               if (profileData[prop] && typeof profileData[prop] === 'string' && profileData[prop].trim() !== '') {
//                 vendorName = profileData[prop];
//                 break;
//               }
//             }
          // Prioritize API data over localStorage data
          if (profileData && Object.keys(profileData).length > 0) {
            const possibleNameProps = ['businessName', 'name', 'companyName', 'restaurantName', 'hotelName'];
            for (const prop of possibleNameProps) {
              if ((profileData as any)[prop] && typeof (profileData as any)[prop] === 'string' && (profileData as any)[prop].trim() !== '') {
                vendorName = (profileData as any)[prop];
                break;
              }
            }
            
//             // If no business name found, try to construct from first and last name
//             if (!vendorName && profileData.firstName) {
//               vendorName = profileData.lastName ? 
//                 `${profileData.firstName} ${profileData.lastName}` : 
//                 profileData.firstName;
//             }
            
//             // Get role information
//             vendorRole = profileData.role || profileData.businessType || vendorRole || 'Vendor';
            
//             // Get avatar information
//             vendorAvatar = profileData.avatar || profileData.profileImage || profileData.image || '';
            
//             // Store in localStorage for future use
//             if (vendorName && typeof window !== 'undefined') {
//               try {
//                 localStorage.setItem('businessName', vendorName);
//                 if (vendorRole) {
//                   localStorage.setItem('user_role', vendorRole);
//                 }
//               } catch (e) {
//                 console.warn('Failed to store vendor info in localStorage:', e);
//               }
//             }
//           }
          
//           // If we still don't have a name, use a friendly default rather than 'Guest User'
//           if (!vendorName) {
//             vendorName = 'Vendor Dashboard';
//           }
          
//           // Generate initials from the name
//           if (vendorName && vendorName !== 'Guest User' && vendorName !== 'Vendor Dashboard') {
//             const nameParts = vendorName.split(' ').filter(part => part.length > 0);
//             if (nameParts.length === 1) {
//               vendorInitials = nameParts[0].charAt(0).toUpperCase();
//             } else if (nameParts.length > 1) {
//               vendorInitials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
//             }
//           }
          
//           // Update the profile state
//           setUserProfile({
//             name: vendorName,
//             role: vendorRole,
//             avatar: vendorAvatar,
//             initials: vendorInitials
//           });
          
//           console.log('Vendor profile loaded:', { name: vendorName, initials: vendorInitials, role: vendorRole });
//         } catch (profileError) {
//           console.error('Error processing profile data:', profileError);
//           // Fallback to ensure UI doesn't break
//           setUserProfile({
//             name: 'Restaurant Dashboard',
//             role: 'Vendor',
//             avatar: '',
//             initials: 'RD'
//           });
//         }
        
//         // Set upcoming reservations
//         if (upcomingData && Array.isArray(upcomingData)) {
//           setUpcomingReservations(upcomingData);
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err)
//         setError('Failed to load dashboard data. Please try again later.')
//       } finally {
//         setIsLoading(false)
//       }
//     }
    
//     fetchDashboardData()
    
// // Set up fallback polling for when WebSocket is not available or disconnects
//     let upcomingReservationsInterval: NodeJS.Timeout | null = null;
//     let dashboardStatsInterval: NodeJS.Timeout | null = null;
    
//     // Only set up polling if WebSocket isn't available
//     if (!socket) {
//       console.log('Setting up fallback polling for restaurant dashboard');
      
//       // Set up real-time polling for upcoming reservations
//       upcomingReservationsInterval = setInterval(async () => {
//         try {
//           console.log('Polling for real-time upcoming reservations...');
//           const upcomingReservationsData = await getUpcomingReservations();
//           if (upcomingReservationsData && Array.isArray(upcomingReservationsData)) {
//             setUpcomingReservations(upcomingReservationsData);
//             // Show notification if there are upcoming reservations
//             if (upcomingReservationsData.length > 0) {
//               setShowNotification(true);
//             }
//           }
//         } catch (err) {
//           console.error('Error fetching upcoming reservations:', err);
//         }
//       }, 15000); // 15 seconds - increased frequency for better real-time experience
      
//       // Set up additional polling for dashboard stats
//       dashboardStatsInterval = setInterval(async () => {
//         try {
//           console.log('Refreshing dashboard stats...');
//           // Use the local intervalSafelyFetchData function
//           const statsData = await intervalSafelyFetchData<StatsData>(() => getDashboardStats(), {});
//           const todayReservations = await intervalSafelyFetchData<Reservation[]>(() => getTodayReservations(), []);
          
//           // Update the most time-sensitive stats
//           setStats(prevStats => ({
//             ...prevStats,
//             reservationsToday: statsData.reservationsToday || prevStats.reservationsToday,
//             prepaidReservations: statsData.prepaidReservations || prevStats.prepaidReservations,
//             expectedGuests: statsData.expectedGuests || prevStats.expectedGuests,
//             pendingPayments: statsData.pendingPayments || prevStats.pendingPayments
//           }));
          
//           // Update reservations list
//           if (todayReservations.length > 0) {
//             setReservations(todayReservations);
//           }
//         } catch (err) {
//           console.error('Error refreshing dashboard stats:', err);
//         }
//       }, 30000); // 30 seconds
//     }
    
    
//     upcomingReservationsInterval = setInterval(async () => {
//       try {
//         console.log('Polling for real-time upcoming reservations...');
//         const upcomingReservationsData = await getUpcomingReservations();
//         if (upcomingReservationsData && Array.isArray(upcomingReservationsData)) {
//           setUpcomingReservations(upcomingReservationsData);
//           // Show notification if there are upcoming reservations
//           if (upcomingReservationsData.length > 0) {
//             setShowNotification(true);
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching upcoming reservations:', err);
//       }
//     }, 30000); // 30 seconds - increased frequency for more real-time data
    
//     // Define safelyFetchData function for the interval scope
//     const intervalSafelyFetchData = async <T,>(fetchFn: () => Promise<any>, defaultValue: T): Promise<T> => {
//       try {
//         const result = await fetchFn();
        
//         // Check for error object
//         if (result && typeof result === 'object' && 'isError' in result && result.isError) {
//           const errorObj = result.error || {};
//           const errorMessage = typeof errorObj === 'object' && 'message' in errorObj 
//             ? errorObj.message 
//             : (typeof errorObj === 'string' ? errorObj : 'Unknown error');
            
//           console.log(`API Error fetching restaurant data: ${errorMessage}`);
//           return defaultValue;
//         }
        
//         return result || defaultValue;
//       } catch (error) {
//         console.log(`Exception fetching restaurant data in interval: ${error}`);
//         return defaultValue;
//       }
//     };
    
//     // Set up additional polling for dashboard stats to keep them up-to-date
//     dashboardStatsInterval = setInterval(async () => {
//       try {
//         console.log('Refreshing dashboard stats...');
//         // Use the local intervalSafelyFetchData function
//         const statsData = await intervalSafelyFetchData<StatsData>(() => getDashboardStats(), {});
//         const todayReservations = await intervalSafelyFetchData<Reservation[]>(() => getTodayReservations(), []);
        
//         // Update the most time-sensitive stats
//         setStats(prevStats => ({
//           ...prevStats,
//           reservationsToday: statsData.reservationsToday || prevStats.reservationsToday,
//           prepaidReservations: statsData.prepaidReservations || prevStats.prepaidReservations,
//           expectedGuests: statsData.expectedGuests || prevStats.expectedGuests,
//           pendingPayments: statsData.pendingPayments || prevStats.pendingPayments
//         }));
        
//         // Update reservations list
//         if (todayReservations.length > 0) {
//           setReservations(todayReservations);
//         }
//       } catch (err) {
//         console.error('Error refreshing dashboard stats:', err);
//       }
//     }, 60000); // 60 seconds
    
//     // Clean up function
//     return () => {
//       // Close WebSocket if it exists
//       if (socket && socket.readyState === WebSocket.OPEN) {
//         console.log('Closing WebSocket connection for restaurant dashboard');
//         socket.close();
//       }
      
//       // Clear intervals if they exist
//       if (upcomingReservationsInterval) clearInterval(upcomingReservationsInterval);
//       if (dashboardStatsInterval) clearInterval(dashboardStatsInterval);
//     };
//   }, [selectedPeriod])
  
//   // Helper function to get initials from name
//   const getInitials = (name: string): string => {
//     if (!name) return 'VD';
    
//     const names = name.split(' ');
//     if (names.length === 1) {
//       return names[0].charAt(0).toUpperCase();
//     }
    
//     return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
//   }
  
//   // Handler for period change
//   const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedPeriod(e.target.value)
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex-1 max-w-lg">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 type="text"
//                 placeholder="Search"
//                 className="pl-10 bg-gray-50 border-gray-200"
//               />
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             <Button variant="ghost" size="sm" className="relative">
//               <Bell className="h-5 w-5" />
//               {upcomingReservations.length > 0 && (
//                 <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></span>
//               )}
//             </Button>
//             <div className="flex items-center space-x-3">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage src={userProfile.avatar || "/placeholder.svg?height=32&width=32"} />
//                 <AvatarFallback>{userProfile.initials}</AvatarFallback>
//               </Avatar>
//               <div className="hidden sm:block">
//                 <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
//                 <p className="text-xs text-gray-500">{userProfile.role}</p>
//               </div>
//               <ChevronDown className="h-4 w-4 text-gray-400" />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Notification Banner */}
//       {showNotification && upcomingReservations.length > 0 && (
//         <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mx-4 sm:mx-6 lg:mx-8 mt-4 rounded">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="h-5 w-5 text-yellow-400">⏰</div>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-yellow-800">
//                   {upcomingReservations.length} {upcomingReservations.length === 1 ? 'Reservation' : 'Reservations'} commencing in the next 30 minutes
//                 </p>
//               </div>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setShowNotification(false)}
//               className="text-yellow-800 hover:text-yellow-900"
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <main className="px-4 sm:px-6 lg:px-8 py-6">
//         {/* Welcome Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Welcome Back, {userProfile.name ? (
//                 userProfile.name.split(' ')[0].replace(/[^a-zA-Z0-9 ]/g, '')
//               ) : 'there'}!
//             </h1>
//             <p className="text-gray-600 mt-1">{"Here's what is happening today."}</p>
//           </div>
          
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Reservations made today</p>
//                   <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.reservationsToday}</p>
//                   <div className="flex items-center mt-2">
//                     {stats.reservationsTrend >= 0 ? (
//                       <>
//                         <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                         <span className="text-sm text-green-500">{stats.reservationsTrend}% vs last week</span>
//                       </>
//                     ) : (
//                       <>
//                         <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
//                         <span className="text-sm text-red-500">{Math.abs(stats.reservationsTrend)}% vs last week</span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//                 <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <Calendar className="h-6 w-6 text-blue-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Prepaid Reservations</p>
//                   <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.prepaidReservations}</p>
//                   <div className="flex items-center mt-2">
//                     {stats.prepaidTrend >= 0 ? (
//                       <>
//                         <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                         <span className="text-sm text-green-500">{stats.prepaidTrend}% vs last week</span>
//                       </>
//                     ) : (
//                       <>
//                         <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
//                         <span className="text-sm text-red-500">{Math.abs(stats.prepaidTrend)}% vs last week</span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//                 <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <CreditCard className="h-6 w-6 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Expected Guests Today</p>
//                   <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.expectedGuests}</p>
//                   <div className="flex items-center mt-2">
//                     {stats.guestsTrend >= 0 ? (
//                       <>
//                         <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                         <span className="text-sm text-green-500">{stats.guestsTrend}% vs last week</span>
//                       </>
//                     ) : (
//                       <>
//                         <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
//                         <span className="text-sm text-red-500">{Math.abs(stats.guestsTrend)}% vs last week</span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//                 <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <Users className="h-6 w-6 text-purple-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Pending Payments</p>
//                   <p className="text-3xl font-bold text-gray-900">
//                     {isLoading ? '-' : `₦${stats.pendingPayments.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
//                   </p>
//                   <div className="flex items-center mt-2">
//                     {stats.pendingPaymentsTrend >= 0 ? (
//                       <>
//                         <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
//                         <span className="text-sm text-green-500">{stats.pendingPaymentsTrend}% vs last week</span>
//                       </>
//                     ) : (
//                       <>
//                         <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
//                         <span className="text-sm text-red-500">{Math.abs(stats.pendingPaymentsTrend)}% vs last week</span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//                 <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//                   <DollarSign className="h-6 w-6 text-yellow-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//           {/* Today's Reservations */}
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle>{"Today's Reservation"}</CardTitle>
//                 <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
//                   View All →
//                 </Button>
//               </CardHeader>
//               <CardContent>
//                 {isLoading ? (
//                   <div className="flex justify-center items-center h-48">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
//                   </div>
//                 ) : error ? (
//                   <div className="flex justify-center items-center h-48">
//                     <p className="text-red-500">{error}</p>
//                   </div>
//                 ) : reservations.length === 0 ? (
//                   <div className="flex justify-center items-center h-48">
//                     <p className="text-gray-500">No reservations for today</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {reservations.map((reservation) => (
//                       <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                         <div className="flex items-center space-x-4">
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage src={reservation.customerAvatar || "/placeholder.svg?height=40&width=40"} />
//                             <AvatarFallback>{reservation.customerInitials || (reservation.name ?? '').substring(0, 2).toUpperCase()}</AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="font-medium text-gray-900">{reservation.customerName}</p>
//                             <p className="text-sm text-gray-500">ID: {reservation.id}</p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-sm text-gray-900">{new Date(reservation.date).toLocaleDateString()}</p>
//                           <p className="text-sm text-gray-500">Time: {reservation.time}</p>
//                         </div>
//                         <div className="text-center">
//                           <p className="text-sm font-medium">{reservation.guests} Guests</p>
//                         </div>
//                         <Badge
//                           variant={reservation.status === 'Upcoming' ? 'secondary' : 'default'}
//                           className={reservation.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}
//                         >
//                           {reservation.status}
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Reservations Trends */}
//           <div>
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle>Reservations Trends</CardTitle>
//                 <div className="flex items-center space-x-2">
//                   <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
//                     View All →
//                   </Button>
//                   <Select 
//                     value={selectedPeriod} 
//                     onChange={handlePeriodChange}
//                   >
//                     <option value="weekly">Weekly</option>
//                     <option value="monthly">Monthly</option>
//                   </Select>
//                 </div>
//               </CardHeader>
//               <CardContent>{isLoading ? (
//                 <div className="flex justify-center items-center h-32 mb-4">
//                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="text-2xl font-bold">{chartData.reduce((sum, item) => sum + item.value1, 0)}</div>
//                   <div className="flex items-center text-green-500">
//                     <TrendingUp className="h-4 w-4 mr-1" />
//                     <span className="text-sm">8% vs last week</span>
//                   </div>
//                 </div>
//               )}
//                 <div className="flex items-center space-x-4 mb-4">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
//                     <span className="text-xs text-gray-600">This week</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
//                     <span className="text-xs text-gray-600">Last week</span>
//                   </div>
//                 </div>
//                 <div className="flex items-end justify-between h-32 space-x-2">
//                   {chartData.length === 0 && !isLoading ? (
//                     <div className="w-full flex items-center justify-center h-24">
//                       <p className="text-gray-500 text-sm">No data available</p>
//                     </div>
//                   ) : (
//                     chartData.map((data, index) => (
//                       <div key={index} className="flex flex-col items-center flex-1">
//                         <div className="w-full flex flex-col justify-end h-24 space-y-1">
//                           <div
//                             className="w-full bg-blue-400 rounded-t"
//                             style={{ height: `${Math.max((data.value1 / (chartData.length ? Math.max(...chartData.map(d => d.value1)) : 1)) * 100, 5)}%` }}
//                           ></div>
//                           <div
//                             className="w-full bg-teal-600 rounded"
//                             style={{ height: `${Math.max((data.value2 / (chartData.length ? Math.max(...chartData.map(d => d.value2)) : 1)) * 100, 5)}%` }}
//                           ></div>
//                           <div
//                             className="w-full bg-yellow-400 rounded-b"
//                             style={{ height: `${Math.max((data.value3 / (chartData.length ? Math.max(...chartData.map(d => d.value3)) : 1)) * 100, 5)}%` }}
//                           ></div>
//                         </div>
//                         <span className="text-xs text-gray-500 mt-2">{data.day}</span>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Bottom Analytics */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Customer Frequency */}
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle>Customer Frequency</CardTitle>
//               <Select 
//                 value={selectedPeriod} 
//                 onChange={handlePeriodChange}
//                 className="w-24"
//               >
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//               </Select>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex justify-center items-center h-48">
//                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex items-center justify-center mb-4">
//                     <div className="relative w-32 h-32">
//                       <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#e5e7eb"
//                           strokeWidth="3"
//                         />
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#0d9488"
//                           strokeWidth="3"
//                           strokeDasharray={`${(customerData.newCustomers / customerData.totalCustomers) * 100}, 100`}
//                         />
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#eab308"
//                           strokeWidth="3"
//                           strokeDasharray={`${(customerData.returningCustomers / customerData.totalCustomers) * 100}, 100`}
//                           strokeDashoffset={`-${(customerData.newCustomers / customerData.totalCustomers) * 100}`}
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex flex-col items-center justify-center">
//                         <span className="text-xs text-gray-500">Total Customers</span>
//                         <span className="text-xl font-bold">{customerData.totalCustomers}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
//                         <span className="text-sm">New Customers</span>
//                       </div>
//                       <span className="text-sm font-medium">
//                         {customerData.totalCustomers ? 
//                           Math.round((customerData.newCustomers / customerData.totalCustomers) * 100) : 0}%
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
          
//                         <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
//                         <span className="text-sm">Returning Customers</span>
//                       </div>
//                       <span className="text-sm font-medium">
//                         {customerData.totalCustomers ? 
//                           Math.round((customerData.returningCustomers / customerData.totalCustomers) * 100) : 0}%
//                       </span>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>

//           {/* Revenue by Menu Category */}
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle>Revenue (Menu Category)</CardTitle>
//               <Select 
//                 value={selectedPeriod} 
//                 onChange={handlePeriodChange}
//                 className="w-24"
//               >
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//               </Select>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex justify-center items-center h-48">
//                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="mb-4">
//                     <div className="text-2xl font-bold">₦{menuCategories.reduce((sum, item) => sum + (typeof item.amount === 'string' ? parseFloat(item.amount.toString().replace(/[^0-9.]/g, '')) : item.amount), 0).toLocaleString()}</div>
//                     <div className="flex items-center text-green-500">
//                       <TrendingUp className="h-4 w-4 mr-1" />
//                       <span className="text-sm">8% vs last week</span>
//                     </div>
//                   </div>
//                   <div className="space-y-3">
//                     {menuCategories.length === 0 ? (
//                       <p className="text-gray-500 text-sm">No data available</p>
//                     ) : (
//                       menuCategories.map((category, index) => (
//                         <div key={index}>
//                           <div className="flex items-center justify-between mb-1">
//                             <span className="text-sm text-gray-600">{category.name}</span>
//                             <div className="text-right">
//                               <span className="text-sm font-medium">{category.percentage}%</span>
//                               <span className="text-xs text-gray-500 ml-2">(₦{category.amount.toLocaleString()})</span>
//                             </div>
//                           </div>
//                           <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                               className={`${category.color} h-2 rounded-full`}
//                               style={{ width: `${category.percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>

//           {/* Reservation Source */}
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <CardTitle>Reservation Source</CardTitle>
//               <Select 
//                 value={selectedPeriod} 
//                 onChange={handlePeriodChange}
//                 className="w-24"
//               >
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//               </Select>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex justify-center items-center h-48">
//                   <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex items-center justify-center mb-4">
//                     <div className="relative w-32 h-32">
//                       <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#e5e7eb"
//                           strokeWidth="3"
//                         />
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#0d9488"
//                           strokeWidth="3"
//                           strokeDasharray={`${(reservationSources.website / reservationSources.total) * 100}, 100`}
//                         />
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#eab308"
//                           strokeWidth="3"
//                           strokeDasharray={`${(reservationSources.mobile / reservationSources.total) * 100}, 100`}
//                           strokeDashoffset={`-${(reservationSources.website / reservationSources.total) * 100}`}
//                         />
//                         <path
//                           d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#3b82f6"
//                           strokeWidth="3"
//                           strokeDasharray={`${(reservationSources.walkIn / reservationSources.total) * 100}, 100`}
//                           strokeDashoffset={`-${((reservationSources.website + reservationSources.mobile) / reservationSources.total) * 100}`}
//                         />
//                       </svg>
//                       <div className="absolute inset-0 flex flex-col items-center justify-center">
//                         <span className="text-xs text-gray-500">Total Reservations</span>
//                         <span className="text-xl font-bold">{reservationSources.total}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
//                         <span className="text-sm">{reservationSources.website} website</span>
//                       </div>
//                       <span className="text-sm font-medium">
//                         {reservationSources.total ? 
//                           Math.round((reservationSources.website / reservationSources.total) * 100) : 0}%
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
//                         <span className="text-sm">{reservationSources.mobile} mobile</span>
//                       </div>
//                       <span className="text-sm font-medium">
//                         {reservationSources.total ? 
//                           Math.round((reservationSources.mobile / reservationSources.total) * 100) : 0}%
//                       </span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
//                         <span className="text-sm">{reservationSources.walkIn} walk-in</span>
//                       </div>
//                       <span className="text-sm font-medium">
//                         {reservationSources.total ? 
//                           Math.round((reservationSources.walkIn / reservationSources.total) * 100) : 0}%
//                       </span>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }













"use client";

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  // Tooltip,
  Legend
} from 'chart.js';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";



export default function Dashboard() {
  // ----- dummy data for charts -----
  const reservationTrend = [
    { name: "Mon", web: 10, walkin: 5 },
    { name: "Tue", web: 25, walkin: 8 },
    { name: "Wed", web: 15, walkin: 6 },
    { name: "Thu", web: 20, walkin: 12 },
    { name: "Fri", web: 60, walkin: 18 },
    { name: "Sat", web: 90, walkin: 22 },
    { name: "Sun", web: 70, walkin: 20 },
  ];

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);


  // CHARTS STYLE
  const data = {
  labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Walk-in",
      data: [5, 8, 9, 4, 20, 25, 15],
      backgroundColor: "#FACC15", // yellow
      borderRadius: 6, // rounded edges
      stack: "stack1",
    },
    {
      label: "Web",
      data: [10, 12, 14, 6, 25, 30, 20],
      backgroundColor: "#22C55E", // green
      borderRadius: 6,
      stack: "stack1",
    },
    {
      label: "Others",
      data: [15, 18, 20, 10, 30, 25, 28],
      backgroundColor: "#60A5FA", // blue
      borderRadius: 6,
      stack: "stack1",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // hide legend like in the screenshot
    },
    tooltip: {
      enabled: true,
      backgroundColor: "#111827",
      titleColor: "#fff",
      bodyColor: "#fff",
      cornerRadius: 6,
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false, // no vertical grid lines
      },
      ticks: {
        color: "#6B7280", // gray text
        font: { size: 12 },
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      max: 100, // matches screenshot
      ticks: {
        stepSize: 20,
        color: "#6B7280",
        font: { size: 12 },
      },
      grid: {
        color: "#E5E7EB", // light gray grid lines
        drawBorder: false,
      },
    },
  },
};

//CUSTOMER FREQUENCY DATA
const chartData = [
  { name: "New Customers", value: 45, color: "#0A6C6D" },
  { name: "Returning Customers", value: 55, color: "#EAB308" },
];

//RESERVATION SOURCE DATA
const ReservationChartData = [
  { name: "Websites", value: 50, color: "#0A6C6D" },
  { name: "Mobile", value: 30, color: "#EAB308" },
  { name: "Walk in", value: 20, color: "#60A5FA"}
];



  return (
    <div 
      // className="w-full flex flex-col items-start"
      // className="max-w-[1440px]"
      className='max-w-[1440px]'
    >
      
       <div 
        className="flex top-0 w-full h-[64px] px-[32px] py-[12px] flex-col items-start gap-2 shrink-0 bg-white"
        // className="w-[1000px] h-[64px] px-[32px] py-[12px] fixed flex-col items-start top-0 shrink-0 border-bottom:1px solid [#E9EBF3] bg-white z-10"
      >
        {/* inner row to place search + profile on the same line */}
        <div className="w-full flex items-center justify-between">
          {/* search */}
          <div className="flex justify-center items-center w-[520px] px-3 py-2 gap-2 rounded-lg border border-[#DAE9E9] bg-[#F9FAFB]"> 
            {/* random search svg */}
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_1224_81)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75003 1.66667C7.62052 1.66676 6.50741 1.93697 5.50358 2.45474C4.49974 2.97252 3.63427 3.72285 2.97939 4.64313C2.32451 5.56341 1.8992 6.62696 1.73895 7.74504C1.5787 8.86312 1.68815 10.0033 2.05818 11.0705C2.4282 12.1377 3.04807 13.1009 3.86606 13.8798C4.68405 14.6587 5.67645 15.2306 6.76046 15.548C7.84446 15.8654 8.98865 15.9189 10.0975 15.7041C11.2064 15.4893 12.2479 15.0125 13.135 14.3133L16.1784 17.3567C16.3355 17.5085 16.546 17.5925 16.7645 17.5906C16.983 17.5887 17.192 17.501 17.3465 17.3465C17.501 17.192 17.5887 16.983 17.5906 16.7645C17.5925 16.546 17.5085 16.3355 17.3567 16.1783L14.3134 13.135C15.1367 12.0905 15.6493 10.8353 15.7926 9.5131C15.9359 8.19088 15.704 6.85502 15.1235 5.65841C14.5431 4.4618 13.6374 3.4528 12.5103 2.74686C11.3831 2.04092 10.08 1.66658 8.75003 1.66667ZM3.33336 8.75C3.33336 7.31341 3.90404 5.93566 4.91987 4.91984C5.93569 3.90402 7.31344 3.33333 8.75003 3.33333C10.1866 3.33333 11.5644 3.90402 12.5802 4.91984C13.596 5.93566 14.1667 7.31341 14.1667 8.75C14.1667 10.1866 13.596 11.5643 12.5802 12.5802C11.5644 13.596 10.1866 14.1667 8.75003 14.1667C7.31344 14.1667 5.93569 13.596 4.91987 12.5802C3.90404 11.5643 3.33336 10.1866 3.33336 8.75Z" fill="#606368"/>
                </g>
                <defs>
                  <clipPath id="clip0_1224_81">
                    <rect width="20" height="20" fill="white"/>
                  </clipPath>
                </defs>
            </svg>
            <input
              placeholder="Search"
              className="w-full h-full outline-none text-sm placeholder:text-gray-400"
            />
          </div>


          {/* profile area */}
          <div className="flex items-center gap-4">
            {/* bell */}
            <button className="w-10 h-10 grid place-items-center rounded-full bg-white border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 2.66667C13.5246 2.66667 11.1507 3.65 9.40034 5.40034C7.65 7.15068 6.66667 9.52465 6.66667 12V16.704C6.66686 16.9108 6.61893 17.1149 6.52667 17.3L4.23733 21.8773C4.1255 22.101 4.0727 22.3495 4.08393 22.5992C4.09517 22.849 4.17007 23.0918 4.30153 23.3045C4.43298 23.5171 4.61663 23.6927 4.83502 23.8144C5.05342 23.9362 5.2993 24 5.54933 24H26.4507C26.7007 24 26.9466 23.9362 27.165 23.8144C27.3834 23.6927 27.567 23.5171 27.6985 23.3045C27.8299 23.0918 27.9048 22.849 27.9161 22.5992C27.9273 22.3495 27.8745 22.101 27.7627 21.8773L25.4747 17.3C25.3819 17.115 25.3336 16.9109 25.3333 16.704V12C25.3333 9.52465 24.35 7.15068 22.5997 5.40034C20.8493 3.65 18.4754 2.66667 16 2.66667ZM16 28C15.1725 28.0002 14.3653 27.7439 13.6895 27.2663C13.0138 26.7888 12.5027 26.1134 12.2267 25.3333H19.7733C19.4973 26.1134 18.9862 26.7888 18.3105 27.2663C17.6347 27.7439 16.8275 28.0002 16 28Z" fill="#111827"/>
              </svg>
            </button> 

            {/* avatar + name */}
             <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-300" />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  Joseph Eyebiokin
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </div> 
      </div> 


      {/* =========================================================
         B. MAIN CONTAINER (alert -> end)
      ========================================================== */}
      <div 
        className="flex w-full px-[32px] pt-[24px] pb-[34px] flex-col items-start gap-6"
        // className='flex-1 overflow-auto p-6'
      >

        {/* ======================= C. ALERT ======================= 
           display:flex; justify-between; align-items:center; align-self:stretch
        ======================================================== */}
        <div className="w-full relative flex items-center justify-between rounded-l-xl border-l-[3px] border-l-[#E0B300] bg-[#FFF7ED] px-4 py-3">
          {/* Content */}
          <div className="flex items-center gap-3 pl-3">
            {/* Info Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g clipPath="url(#clip0_802_695)">
                <path d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4ZM12 6C12.2449 6.00003 12.4813 6.08996 12.6644 6.25272C12.8474 6.41547 12.9643 6.63975 12.993 6.883L13 7V11.586L15.707 14.293C15.8863 14.473 15.9905 14.7144 15.9982 14.9684C16.006 15.2223 15.9168 15.4697 15.7488 15.6603C15.5807 15.8508 15.3464 15.9703 15.0935 15.9944C14.8406 16.0185 14.588 15.9454 14.387 15.79L14.293 15.707L11.293 12.707C11.1376 12.5514 11.0378 12.349 11.009 12.131L11 12V7C11 6.73478 11.1054 6.48043 11.2929 6.29289C11.4804 6.10536 11.7348 6 12 6Z" fill="#E0B300"/>
              </g>
              <defs>
                <clipPath id="clip0_802_695">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>

            {/* Message */}
            <span className="text-sm text-[#111827]">
              3 Reservations commencing in the next 30 minutes
            </span>
          </div>

          {/* Close Button */}
          <button className="p-1 rounded hover:bg-[#FEF3C7]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_802_700)">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.99993 11.1783L14.7141 15.8925C14.8713 16.0443 15.0818 16.1283 15.3003 16.1264C15.5188 16.1245 15.7278 16.0369 15.8823 15.8823C16.0368 15.7278 16.1244 15.5188 16.1263 15.3003C16.1282 15.0818 16.0442 14.8713 15.8924 14.7142L11.1783 10L15.8924 5.28583C16.0442 5.12866 16.1282 4.91816 16.1263 4.69967C16.1244 4.48117 16.0368 4.27216 15.8823 4.11765C15.7278 3.96314 15.5188 3.8755 15.3003 3.8736C15.0818 3.87171 14.8713 3.9557 14.7141 4.1075L9.99993 8.82167L5.28577 4.1075C5.12789 3.95945 4.91861 3.87864 4.70221 3.88215C4.48581 3.88567 4.27926 3.97323 4.12628 4.12633C3.97329 4.27942 3.88587 4.48603 3.88251 4.70243C3.87915 4.91884 3.96011 5.12806 4.10827 5.28583L8.8216 10L4.10743 14.7142C4.02784 14.791 3.96436 14.883 3.92068 14.9847C3.87701 15.0863 3.85402 15.1957 3.85306 15.3063C3.8521 15.417 3.87318 15.5267 3.91508 15.6291C3.95698 15.7315 4.01886 15.8246 4.0971 15.9028C4.17535 15.9811 4.26839 16.0429 4.37081 16.0849C4.47322 16.1268 4.58295 16.1478 4.6936 16.1469C4.80425 16.1459 4.9136 16.1229 5.01527 16.0793C5.11694 16.0356 5.2089 15.9721 5.28577 15.8925L9.99993 11.1783Z" fill="#E0B300"/>
              </g>
              <defs>
                <clipPath id="clip0_802_700">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>


        {/* ====================== D. HEADER ======================= 
        ======================================================== */}
        <div className="w-full self-stretch flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome Back, Joseph!
            </h1>
            <p className="text-sm text-gray-500">
              Here’s what is happening today.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-md bg-[#0A6C6D] px-4 py-2 text-white">
            {/* random plus svg */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
              <g clip-path="url(#clip0_1488_2854)">
                <path d="M9.16667 16.6667C9.16667 16.8877 9.25446 17.0996 9.41074 17.2559C9.56702 17.4122 9.77899 17.5 10 17.5C10.221 17.5 10.433 17.4122 10.5893 17.2559C10.7455 17.0996 10.8333 16.8877 10.8333 16.6667V10.8333H16.6667C16.8877 10.8333 17.0996 10.7455 17.2559 10.5893C17.4122 10.433 17.5 10.221 17.5 10C17.5 9.77899 17.4122 9.56702 17.2559 9.41074C17.0996 9.25446 16.8877 9.16667 16.6667 9.16667H10.8333V3.33333C10.8333 3.11232 10.7455 2.90036 10.5893 2.74408C10.433 2.5878 10.221 2.5 10 2.5C9.77899 2.5 9.56702 2.5878 9.41074 2.74408C9.25446 2.90036 9.16667 3.11232 9.16667 3.33333V9.16667H3.33333C3.11232 9.16667 2.90036 9.25446 2.74408 9.41074C2.5878 9.56702 2.5 9.77899 2.5 10C2.5 10.221 2.5878 10.433 2.74408 10.5893C2.90036 10.7455 3.11232 10.8333 3.33333 10.8333H9.16667V16.6667Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_1488_2854">
                  <rect width="20" height="20" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            New Reservation
          </button>
        </div>

        {/* ============== E. REPORT BOXES (TOP CARDS) ============= 
        ======================================================== */}
       <div 
        className="flex w-[965px] bg-white rounded-xl border-t border-b border-1 border-[#E5E7EB]"
      >
      {/* Card 1 */}
      <div className="flex w-[312px] h-[124px] items-center justify-between px-[29px] py-[20px]">
        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-gray-500">Reservations made today</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">32</p>
          <div className="flex items-center text-xs mt-1">
            <span className="mr-1 text-green-500">↑ 12%</span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>
        <div className="flex-shrink-0">
        <div className="flex w-8 h-10 items-center justify-center rounded-md border border-[#4C98F1] bg-[#EFF6FF]">
          {/* Calendar SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clipPath="url(#clip0_993_747)">
              <path
                d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V12H21ZM16 3C16.2652 3 16.5196 3.10536 16.7071 3.29289C16.8946 3.48043 17 3.73478 17 4V5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V10H3V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H7V4C7 3.73478 7.10536 3.48043 7.29289 3.29289C7.48043 3.10536 7.73478 3 8 3C8.26522 3 8.51957 3.10536 8.70711 3.29289C8.89464 3.48043 9 3.73478 9 4V5H15V4C15 3.73478 15.1054 3.48043 15.2929 3.29289C15.4804 3.10536 15.7348 3 16 3Z"
                fill="#4C98F1"
              />
            </g>
            <defs>
              <clipPath id="clip0_993_747">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      </div>

      {/* Divider (centered vertically) */}
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="64" viewBox="0 0 1 64" fill="none">
          <path d="M1 0V64" stroke="#E5E7EB" strokeWidth="2" />
        </svg>
      </div>

      {/* Card 2 */}
      <div className="flex w-[312px] h-[124px] items-center justify-between px-[29px] py-[20px]">
        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-gray-500">Prepaid Reservations</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">16</p>
          <div className="flex items-center text-xs mt-1">
            <span className="mr-1 text-green-500">↑ 8%</span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {/* Card SVG */}
          <div className="flex w-8 h-10 items-center justify-center rounded-md border border-[#06CD02] bg-[#ECF9EC]">
          {/* Calendar SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_993_767)">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M5 4C4.20435 4 3.44129 4.31607 2.87868 4.87868C2.31607 5.44129 2 6.20435 2 7V8H22V7C22 6.20435 21.6839 5.44129 21.1213 4.87868C20.5587 4.31607 19.7956 4 19 4H5ZM22 10H2V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H19C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17V10ZM8 15C8 14.7348 8.10536 14.4804 8.29289 14.2929C8.48043 14.1054 8.73478 14 9 14H13.414L13.293 13.879C13.1054 13.6915 12.9999 13.4371 12.9998 13.1719C12.9997 12.9066 13.105 12.6521 13.2925 12.4645C13.48 12.2769 13.7344 12.1714 13.9996 12.1713C14.2649 12.1712 14.5194 12.2765 14.707 12.464L16.535 14.293C16.7225 14.4805 16.8278 14.7348 16.8278 15C16.8278 15.2652 16.7225 15.5195 16.535 15.707L14.707 17.535C14.6148 17.6305 14.5044 17.7067 14.3824 17.7591C14.2604 17.8115 14.1292 17.8391 13.9964 17.8403C13.8636 17.8414 13.7319 17.8161 13.609 17.7658C13.4861 17.7155 13.3745 17.6413 13.2806 17.5474C13.1867 17.4535 13.1125 17.3419 13.0622 17.219C13.0119 17.0961 12.9866 16.9644 12.9877 16.8316C12.9889 16.6988 13.0165 16.5676 13.0689 16.4456C13.1213 16.3236 13.1975 16.2132 13.293 16.121L13.414 16H9C8.73478 16 8.48043 15.8946 8.29289 15.7071C8.10536 15.5196 8 15.2652 8 15Z" fill="#06CD02"/>
            </g>
            <defs>
              <clipPath id="clip0_993_767">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      </div>

      {/* Divider */}
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="64" viewBox="0 0 1 64" fill="none">
          <path d="M1 0V64" stroke="#E5E7EB" strokeWidth="2" />
        </svg>
      </div>

      {/* Card 3 */}
      <div className="flex w-[312px] h-[124px] items-center justify-between px-[29px] py-[20px]">
        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-gray-500">Expected Guests Today</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">80</p>
          <div className="flex items-center text-xs mt-1">
            <span className="mr-1 text-green-500">↑ 8%</span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {/* Guests SVG */}
          <div className="flex w-8 h-10 items-center justify-center rounded-md border border-[#CD16C3] bg-[#FFD3FC]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_993_787)">
              <path d="M12 12C13.873 12 15.57 12.62 16.815 13.487C17.998 14.312 19 15.538 19 16.857C19 17.581 18.691 18.181 18.204 18.627C17.746 19.048 17.148 19.321 16.532 19.507C15.301 19.88 13.68 20 12 20C10.32 20 8.699 19.88 7.468 19.507C6.852 19.321 6.254 19.048 5.795 18.627C5.31 18.182 5 17.582 5 16.858C5 15.539 6.002 14.313 7.185 13.488C8.43 12.62 10.127 12 12 12ZM19 13C20.044 13 20.992 13.345 21.693 13.833C22.333 14.28 23 15.023 23 15.929C23 16.446 22.775 16.875 22.44 17.182C22.134 17.463 21.756 17.628 21.411 17.732C20.941 17.874 20.386 17.947 19.81 17.979C19.932 17.634 20 17.259 20 16.857C20 15.322 19.041 14.018 17.968 13.113C18.3069 13.038 18.6529 13.0001 19 13ZM5 13C5.357 13 5.703 13.04 6.032 13.113C4.96 14.018 4 15.322 4 16.857C4 17.259 4.068 17.634 4.19 17.979C3.614 17.947 3.06 17.874 2.589 17.732C2.244 17.628 1.866 17.463 1.559 17.182C1.38288 17.0245 1.24204 16.8315 1.1457 16.6157C1.04937 16.4 0.999714 16.1663 1 15.93C1 15.025 1.666 14.281 2.307 13.834C3.09975 13.2902 4.03868 12.9994 5 13ZM18.5 7C19.163 7 19.7989 7.26339 20.2678 7.73223C20.7366 8.20107 21 8.83696 21 9.5C21 10.163 20.7366 10.7989 20.2678 11.2678C19.7989 11.7366 19.163 12 18.5 12C17.837 12 17.2011 11.7366 16.7322 11.2678C16.2634 10.7989 16 10.163 16 9.5C16 8.83696 16.2634 8.20107 16.7322 7.73223C17.2011 7.26339 17.837 7 18.5 7ZM5.5 7C6.16304 7 6.79893 7.26339 7.26777 7.73223C7.73661 8.20107 8 8.83696 8 9.5C8 10.163 7.73661 10.7989 7.26777 11.2678C6.79893 11.7366 6.16304 12 5.5 12C4.83696 12 4.20108 11.7366 3.73223 11.2678C3.26339 10.7989 3 10.163 3 9.5C3 8.83696 3.26339 8.20107 3.73223 7.73223C4.20108 7.26339 4.83696 7 5.5 7ZM12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3Z" fill="#CD16C3"/>
            </g>
            <defs>
              <clipPath id="clip0_993_787">
                <rect width="24" height="24" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          </div>
          
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="1" height="64" viewBox="0 0 1 64" fill="none">
          <path d="M1 0V64" stroke="#E5E7EB" strokeWidth="2" />
        </svg>
      </div>

      {/* Card 4 */}
      <div className="flex w-[312px] h-[124px] items-center justify-between px-[29px] py-[20px]">
        <div className="flex flex-col justify-center">
          <p className="text-[12px] text-gray-500">Pending Payments</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">$2,546.00</p>
          <div className="flex items-center text-xs mt-1">
            <span className="mr-1 text-red-500">↓ 5%</span>
            <span className="text-gray-400">vs last week</span>
          </div>
        </div>
        <div className="flex-shrink-0">
          {/* Money SVG */}
          <div className="flex w-8 h-10 items-center justify-center rounded-md border border-[#E1B505] bg-[#FFF8DE]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clip-path="url(#clip0_993_807)">
                  <path d="M11.287 4.717L11.594 4.587C14.444 3.319 17.274 3.35 19.125 3.591L19.535 3.649L19.907 3.712L20.24 3.777L20.53 3.84C21.394 4.038 21.934 4.777 21.994 5.571L22 5.721V17.306C22 18.333 21.024 19.007 20.107 18.796L19.827 18.734L19.502 18.672L19.137 18.612C18.9323 18.581 18.7269 18.5547 18.521 18.533L18.068 18.493C16.585 18.389 14.654 18.494 12.713 19.283L12.406 19.413C9.776 20.583 7.162 20.647 5.319 20.46L4.875 20.41L4.465 20.35L4.093 20.287C4.0356 20.2767 3.97827 20.266 3.921 20.255L3.471 20.16C2.606 19.962 2.066 19.223 2.006 18.429L2 18.279V6.694C2 5.667 2.976 4.992 3.893 5.204L4.173 5.266L4.498 5.328L4.863 5.388C6.399 5.618 8.835 5.714 11.287 4.717ZM12 8C10.9391 8 9.92172 8.42143 9.17157 9.17158C8.42143 9.92172 8 10.9391 8 12C8 13.0609 8.42143 14.0783 9.17157 14.8284C9.92172 15.5786 10.9391 16 12 16C13.0609 16 14.0783 15.5786 14.8284 14.8284C15.5786 14.0783 16 13.0609 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17158C14.0783 8.42143 13.0609 8 12 8ZM12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10Z" fill="#E1B505"/>
                </g>
                <defs>
                  <clipPath id="clip0_993_807">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
          </div>
        </div>
      </div>
    </div>

        {/* ====================== F. FIRST CHARTS ==================
        ======================================================== */}
        <div className="w-full self-stretch flex flex-wrap items-center justify-between gap-3">

          {/* -------- first box: Today's Reservations --------
          --------------------------------------------------- */}
          <div className="flex-1 min-w-[200px] h-[348px] rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden">
            {/* header */}
            <div className="flex w-full px-5 py-5 flex-col items-start gap-2">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#111827]">
                  Today’s Reservation
                </h2>
                <button className="inline-flex items-center gap-1 text-sm font-small text-[#0A6C6D] hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.24415 14.7558C5.08793 14.5996 5.00016 14.3876 5.00016 14.1667C5.00016 13.9457 5.08793 13.7338 5.24415 13.5775L8.82165 9.99999L5.24415 6.42249C5.16456 6.34562 5.10108 6.25367 5.0574 6.152C5.01373 6.05033 4.99074 5.94098 4.98978 5.83033C4.98882 5.71968 5.0099 5.60995 5.0518 5.50753C5.0937 5.40512 5.15558 5.31208 5.23382 5.23383C5.31207 5.15559 5.40511 5.09371 5.50752 5.05181C5.60994 5.00991 5.71967 4.98882 5.83032 4.98979C5.94097 4.99075 6.05032 5.01374 6.15199 5.05741C6.25366 5.10108 6.34561 5.16457 6.42249 5.24416L10.5892 9.41083C10.7454 9.5671 10.8331 9.77902 10.8331 9.99999C10.8331 10.221 10.7454 10.4329 10.5892 10.5892L6.42249 14.7558C6.26621 14.9121 6.05429 14.9998 5.83332 14.9998C5.61235 14.9998 5.40043 14.9121 5.24415 14.7558ZM10.2442 14.7558C10.0879 14.5996 10.0002 14.3876 10.0002 14.1667C10.0002 13.9457 10.0879 13.7338 10.2442 13.5775L13.8217 9.99999L10.2442 6.42249C10.0924 6.26533 10.0084 6.05482 10.0103 5.83633C10.0122 5.61783 10.0998 5.40882 10.2543 5.25431C10.4088 5.09981 10.6178 5.01216 10.8363 5.01027C11.0548 5.00837 11.2653 5.09236 11.4225 5.24416L15.5892 9.41083C15.7454 9.5671 15.8331 9.77902 15.8331 9.99999C15.8331 10.221 15.7454 10.4329 15.5892 10.5892L11.4225 14.7558C11.2662 14.9121 11.0543 14.9998 10.8333 14.9998C10.6123 14.9998 10.4004 14.9121 10.2442 14.7558Z" fill="#0A6C6D"/>
                  </svg>
                  View All
                </button>
              </div>
            </div>

            {/* content */}
            <div className="flex w-full px-3 py-1 flex-col items-start gap-3">
              {[1, 2, 3, 4].map((i) => {
                const isUpcoming = i % 2 === 0;
                return (
                <div
                  key={i}
                  className="w-full flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    {/* circle avatar */}
                    <div className="w-9 h-9 rounded-full bg-gray-200" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Emily Johnson
                      </p>
                      <p className="text-xs text-gray-500">ID: #12345</p>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-start text-xs text-gray-600">
                    <span>June 5, 2025</span>
                    <span>Time: 7:30 pm</span>
                  </div>

                  <div className="text-sm text-gray-700">4 Guests</div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                        ${
                          isUpcoming
                            ? "border-[#B3D1D2] bg-[#E7F0F0] text-[#0A6C6D]"
                            : "border-[#FAE48A] bg-[#FCF6DE] text-[#A28200]"
                        }`}
                    >
                      {/* clock svg */}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="mr-1"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          stroke={isUpcoming ? "#0A6C6D" : "#A28200"}
                        />
                        <path
                          d="M10 6v4l3 2"
                          stroke={isUpcoming ? "#0A6C6D" : "#A28200"}
                        />
                      </svg>
                      {isUpcoming ? "Upcoming" : "In 30 mins"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
          
          {/* -------- second box: Reservations Trends --------
          --------------------------------------------------- */}
          <div className="flex-1 min-w-[300px] h-[348px] rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden">
            {/* header */}
            <CardHeader className="flex w-full px-5 py-3 flex-col items-start gap-2 border-b">
              <div className="w-full flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-[#111827]">
                  Reservations Trends
                </CardTitle>
                <div className="flex items-center gap-3">
                  <button className="inline-flex items-center gap-1 text-sm font-small text-[#0A6C6D] hover:underline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.24415 14.7558C5.08793 14.5996 5.00016 14.3876 5.00016 14.1667C5.00016 13.9457 5.08793 13.7338 5.24415 13.5775L8.82165 9.99999L5.24415 6.42249C5.16456 6.34562 5.10108 6.25367 5.0574 6.152C5.01373 6.05033 4.99074 5.94098 4.98978 5.83033C4.98882 5.71968 5.0099 5.60995 5.0518 5.50753C5.0937 5.40512 5.15558 5.31208 5.23382 5.23383C5.31207 5.15559 5.40511 5.09371 5.50752 5.05181C5.60994 5.00991 5.71967 4.98882 5.83032 4.98979C5.94097 4.99075 6.05032 5.01374 6.15199 5.05741C6.25366 5.10108 6.34561 5.16457 6.42249 5.24416L10.5892 9.41083C10.7454 9.5671 10.8331 9.77902 10.8331 9.99999C10.8331 10.221 10.7454 10.4329 10.5892 10.5892L6.42249 14.7558C6.26621 14.9121 6.05429 14.9998 5.83332 14.9998C5.61235 14.9998 5.40043 14.9121 5.24415 14.7558ZM10.2442 14.7558C10.0879 14.5996 10.0002 14.3876 10.0002 14.1667C10.0002 13.9457 10.0879 13.7338 10.2442 13.5775L13.8217 9.99999L10.2442 6.42249C10.0924 6.26533 10.0084 6.05482 10.0103 5.83633C10.0122 5.61783 10.0998 5.40882 10.2543 5.25431C10.4088 5.09981 10.6178 5.01216 10.8363 5.01027C11.0548 5.00837 11.2653 5.09236 11.4225 5.24416L15.5892 9.41083C15.7454 9.5671 15.8331 9.77902 15.8331 9.99999C15.8331 10.221 15.7454 10.4329 15.5892 10.5892L11.4225 14.7558C11.2662 14.9121 11.0543 14.9998 10.8333 14.9998C10.6123 14.9998 10.4004 14.9121 10.2442 14.7558Z" fill="#0A6C6D"/>
                    </svg>
                    View All
                  </button>

                  <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50">
                    Weekly
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M5 8l5 5 5-5" stroke="currentColor" />
                    </svg>
                  </button>
                  {/* <select className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M5 8l5 5 5-5" stroke="currentColor" />
                    </svg>
                  </select> */}
                </div>
              </div>
            </CardHeader>

            {/* content top row */}
            <div className="px-5 pt-4">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-semibold text-gray-900">104</span>
                  <span className="mr-1 text-[#37703F] text-sm font-medium">↑ 8%</span>
                  <span className="text-xs text-gray-500">vs last week</span>
                </div>

                {/* legend */}
                <div className="flex items-center gap-4 text-xs text-gray-600 mt-[-15px]">
                  {/* <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-gray-800" />
                    This week
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-[#0A6C6D]" />
                    Last week
                  </span> */}
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="week"
                      defaultChecked
                      className="form-radio text-[#0A6C6D] focus:ring-0"
                    />
                    <span className="text-gray-700">This week</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="week"
                    className="form-radio text-gray-400 focus:ring-0"
                  />
                  <span className="text-gray-500">Last week</span>
                </label>
                </div>
              </div>
            </div>

            {/* bar chart */}
            <div className="h-[220px] px-5">
                <Bar data={data} options={options}>
                </Bar>
            </div>
          </div>
        </div>

        {/* ===================== G. SECOND CHARTS ==================
        ======================================================== */}
        <div className="w-full flex flex-wrap items-center gap-[24px]">
          {/* Customer Frequency */}
          <Card className="flex-1 w-[400px] h-[318px] rounded-[12px] border border-[#E5E7EB] bg-white">
            <CardHeader className="flex items-center justify-between px-4 py-2">
              <CardTitle className="text-xs font-semibold text-gray-900">
                Customer Frequency
              </CardTitle>

              {/*Single dropdown button*/}
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700">
                Weekly
                <svg
                  className="ml-1"
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M5 8l5 5 5-5" stroke="currentColor" />
                </svg>
              </button>
            </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
          {/* Donut Chart */}
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={70}
                  dataKey="value"
                  startAngle={180}
                  endAngle={-180}
                >
                  {chartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500">Total Customers</p>
              <p className="text-xl font-semibold text-gray-900">100</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-gray-600 px-5">
            {chartData.map((d) => (
              <span key={d.name} className="inline-flex items-center gap-1">
                <span
                  className="w-5 h-3 rounded-sm items-center"
                  style={{ backgroundColor: d.color }}
                />
                {d.name}
              </span>
            ))}
          </div>
         </CardContent>
      </Card>


          {/* Revenue [Menu Category] */}
          <Card className="flex-1 w-[400px] h-[318px] rounded-xl border border-gray-200 bg-white">
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xs font-semibold text-gray-900">
              Revenue [Menu Category]
            </CardTitle>
                  <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700">
                    Weekly
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M5 8l5 5 5-5" stroke="currentColor" />
                    </svg>
                  </button>
            </CardHeader>
          <CardContent>
        {/* Total & Change */}
        <div className="mb-5 flex gap-2">
          <p className="text-xl font-semibold text-gray-900">#220,500</p>
          <p className="text-xs text-gray-500 mt-2">
            <span className="text-[#0A6C6D] font-medium">+8%</span> vs last week
          </p>
        </div>

        {/* Faux Stacked Bar */}
        <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden flex">
          <div className="h-full w-[40%] bg-[#0A6C6D]" />
          <div className="h-full w-[27%] bg-[#EF4444]" />
          <div className="h-full w-[19%] bg-[#E0B300]" />
          <div className="h-full w-[9%] bg-[#60A5FA]" />
          <div className="h-full w-[5%] bg-[#8B5CF6]" />
        </div>

        {/* Legend */}
        <div className="mt-4 gap-y-3 gap-x-4 text-xs text-gray-700 tracking-wide">
          <div className="flex items-center gap-2">
            Main Dish <span className="ml-auto text-[#111827] mb-3">40.0% <span className='text-gray-500'>(#110,000)</span></span>
          </div>
          <div className="flex items-center gap-2">
            Drinks <span className="ml-auto text-[#111827] mb-3">27.7% <span className='text-gray-500'>(#50,000)</span></span>
          </div>

          <div className="flex items-center gap-2">
            Starters <span className="ml-auto text-[#111827] mb-3">19.3% <span className='text-gray-500'>(#30,000)</span></span>
          </div>
          <div className="flex items-center gap-2">
            Desserts <span className="ml-auto text-[#111827] mb-3">9.0% <span className='text-gray-500'>(#20,500)</span></span>
          </div>
          <div className="flex items-center gap-2">
            Sides <span className="ml-auto text-[#111827] mb-3">4.7% <span className='text-gray-500'>(#10,000)</span></span>
          </div>
        </div>
      </CardContent>
    </Card>

          {/* Reservation Source */}
          <Card className="flex-1 w-[400px] h-[318px] rounded-[12px] border border-[#E5E7EB] bg-white">
            <CardHeader className="flex items-center justify-between px-4 py-2">
              <CardTitle className="text-xs font-semibold text-gray-900">
                Customer Frequency
              </CardTitle>

              {/*Single dropdown button*/}
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-700">
                Weekly
                <svg
                  className="ml-1"
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path d="M5 8l5 5 5-5" stroke="currentColor" />
                </svg>
              </button>
            </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
          {/* Donut Chart */}
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ReservationChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={70}
                  dataKey="value"
                  startAngle={180}
                  endAngle={-180}
                >
                  {ReservationChartData.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500">Total Customers</p>
              <p className="text-xl font-semibold text-gray-900">100</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-gray-600">
            {ReservationChartData.map((d) => (
              <span key={d.name} className="inline-flex items-center gap-1">
                <span
                  className="w-5 h-3 rounded-sm items-center"
                  style={{ backgroundColor: d.color }}
                />
                {d.name}
              </span>
            ))}
          </div>
         </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}














