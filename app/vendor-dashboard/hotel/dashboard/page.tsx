'use client'

import { useState, useEffect } from 'react'

// Define interfaces for our data structures
interface Reservation {
  id: string;
  customerName: string;
  customerAvatar?: string;
  customerInitials?: string;
  name?: string;
  date: string | Date;
  time: string;
  guests: number;
  status: string;
}

interface ChartDataPoint {
  day: string;
  value1: number;
  value2: number;
  value3: number;
}

// Define API response data interfaces at the module level
interface StatsData {
  reservationsToday?: number;
  prepaidReservations?: number;
  expectedGuests?: number;
  pendingPayments?: number;
  pendingPaymentsTrend?: number;
  reservationsTrend?: number;
  prepaidTrend?: number;
  guestsTrend?: number;
}

interface TrendsData {
  chartData?: ChartDataPoint[];
}

interface FrequencyData {
  newCustomers?: number;
  returningCustomers?: number;
  totalCustomers?: number;
}

interface RevenueData {
  totalRevenue?: number;
  revenueTrend?: number;
  categories?: string[];
}

// interface SourcesData {
//   website?: number;
//   mobile?: number;
//   walkIn?: number;
//   total?: number;
// }
import { 
  Search, Bell, ChevronDown, X, Plus, TrendingDown, TrendingUp,
  Calendar, CreditCard, Users, DollarSign
} from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NativeSelect as Select } from '@/components/ui/select'
import { 
  getDashboardStats, 
  getTodayReservations, 
  getReservationTrends,
  getCustomerFrequency,
  getRevenueByCategory,
  getUpcomingReservations,
  getUserProfile
} from '@/app/lib/api-service'

export default function Dashboard() {
  const [showNotification, setShowNotification] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for dashboard data
  const [stats, setStats] = useState({
    reservationsToday: 0,
    prepaidReservations: 0,
    expectedGuests: 0,
    pendingPayments: 0,
    pendingPaymentsTrend: 0,
    reservationsTrend: 0,
    prepaidTrend: 0,
    guestsTrend: 0,
    totalRevenue: 0,
    revenueTrend: 0
  })
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  // Customer frequency data
  const [customerData, setCustomerData] = useState({
    newCustomers: 0,
    returningCustomers: 0,
    totalCustomers: 0
  })
  const [selectedPeriod, setSelectedPeriod] = useState('weekly')
  
  // State for upcoming reservations notification
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
  
  // State for user profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    role: '',
    avatar: '',
    initials: ''
  })

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    // Function to establish WebSocket connection for real-time data
    const setupWebSocket = () => {
      try {
        // Check if WebSocket is supported
        if (typeof window !== 'undefined' && 'WebSocket' in window) {
          // Replace with your actual WebSocket endpoint
          const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT || 'wss://api.example.com/ws';
          
          console.log('Attempting to establish WebSocket connection for hotel dashboard...');
          
          // Create WebSocket connection
          const socket = new WebSocket(wsEndpoint);
          
          // Connection opened
          socket.addEventListener('open', (event) => {
            event.preventDefault();
            console.log('WebSocket connection established for hotel dashboard');
            
            // Subscribe to relevant data channels
            socket.send(JSON.stringify({
              action: 'subscribe',
              channels: ['hotel_stats', 'hotel_reservations', 'hotel_notifications']
            }));
          });
          
          // Listen for messages from the server
          socket.addEventListener('message', (event) => {
            try {
              const data = JSON.parse(event.data);
              console.log('Real-time hotel update received:', data.type);
              
              // Handle different types of updates
              switch (data.type) {
                case 'stats_update':
                  // Update dashboard stats
                  setStats(prevStats => ({
                    ...prevStats,
                    ...data.stats
                  }));
                  break;
                  
                case 'new_reservation':
                  // Add new reservation to the list
                  setReservations(prev => [data.reservation, ...prev]);
                  break;
                  
                case 'upcoming_reservation':
                  // Update upcoming reservations
                  setUpcomingReservations(prev => {
                    const exists = prev.some(r => r.id === data.reservation.id);
                    if (!exists) {
                      setShowNotification(true);
                      return [data.reservation, ...prev];
                    }
                    return prev;
                  });
                  break;
                  
                case 'room_availability_update':
                  // Handle room availability updates
                  console.log('Room availability updated:', data.availability);
                  break;
                  
                default:
                  console.log('Unknown hotel update type:', data.type);
              }
            } catch (error) {
              console.error('Error processing hotel WebSocket message:', error);
            }
          });
          
          // Handle errors
          socket.addEventListener('error', (event) => {
            console.error('Hotel WebSocket error:', event);
          });
          
          // Handle connection closing
          socket.addEventListener('close', (event) => {
            console.log('Hotel WebSocket connection closed:', event.code, event.reason);
            
            // Attempt to reconnect after a delay
            setTimeout(() => {
              console.log('Attempting to reconnect hotel WebSocket...');
              setupWebSocket();
            }, 5000);
          });
          
          // Return cleanup function
          return socket;
        } else {
          console.log('WebSocket not supported, falling back to polling for hotel dashboard');
          return null;
        }
      } catch (error) {
        console.error('Error setting up hotel WebSocket:', error);
        return null;
      }
    };
    
    // Initially set up WebSocket
    const socket = setupWebSocket();
    
    // Fetch dashboard data - fallback to regular API calls
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log("Fetching real-time hotel dashboard data...");
        
        // Use the interfaces defined at the module level
        
        // Helper function to safely fetch data and handle errors
        const safelyFetchData = async <T,>(fetchFn: () => Promise<unknown>, defaultValue: T): Promise<T> => {
          try {
            const result = await fetchFn();
            
            // Check for error object
            if (result && typeof result === 'object' && 'isError' in result && result.isError) {
              const errorObj = (typeof result === 'object' && result !== null && 'error' in result)
                ? (result as { error?: unknown }).error
                : {};
              const errorMessage = typeof errorObj === 'object' && errorObj !== null && 'message' in errorObj
                ? (errorObj as { message?: string }).message
                : (typeof errorObj === 'string' ? errorObj : 'Unknown error');
                
              console.log(`API Error fetching hotel data: ${errorMessage}`);
              return defaultValue;
            }
            
            // Check for empty object
            if (result && typeof result === 'object' && 
                !Array.isArray(result) && 
                Object.keys(result).length === 0) {
              console.log('Received empty object from API');
              return defaultValue;
            }
            
            // If result is an empty object, return defaultValue
            if (result && typeof result === 'object' && !Array.isArray(result) && Object.keys(result).length === 0) {
              return defaultValue;
            }
            return result as T;
          } catch (error) {
            let errorMessage = 'Unknown error';
            if (error) {
              if (typeof error === 'string') {
                errorMessage = error;
              } else if (typeof error === 'object' && error !== null) {
                // Use proper type checking to access the message property
                errorMessage = error && 'message' in error && typeof error.message === 'string'
                  ? error.message
                  : JSON.stringify(error);
              }
            }
            console.log(`Exception fetching hotel data: ${errorMessage}`);
            return defaultValue;
          }
        };
        
        // Fetch each data set sequentially to avoid overwhelming the API
        const statsData = await safelyFetchData<StatsData>(() => getDashboardStats(), {});
        const todayReservations = await safelyFetchData<Reservation[]>(() => getTodayReservations(), []);
        const trendsData = await safelyFetchData<TrendsData>(() => getReservationTrends(selectedPeriod), {});
        const frequencyData = await safelyFetchData<FrequencyData>(() => getCustomerFrequency(selectedPeriod), {});
        const revenueData = await safelyFetchData<RevenueData>(() => getRevenueByCategory(selectedPeriod), {});
        const upcomingReservationsData = await safelyFetchData<Reservation[]>(() => getUpcomingReservations(), []);
        
        // Profile data needs special handling with retries
        let profileData = {};
        for (let retry = 0; retry < 3; retry++) {
          profileData = await safelyFetchData<Record<string, unknown>>(() => getUserProfile(), {});
          if (profileData && Object.keys(profileData).length > 0) break;
          console.log(`Retrying profile fetch for hotel, attempt ${retry + 1}/3`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between retries
        }
        
        // Update state with fetched data
        setStats({
          reservationsToday: statsData.reservationsToday || 0,
          prepaidReservations: statsData.prepaidReservations || 0,
          expectedGuests: statsData.expectedGuests || 0,
          pendingPayments: statsData.pendingPayments || 0,
          pendingPaymentsTrend: statsData.pendingPaymentsTrend || 0,
          reservationsTrend: statsData.reservationsTrend || 0,
          prepaidTrend: statsData.prepaidTrend || 0,
          guestsTrend: statsData.guestsTrend || 0,
          totalRevenue: revenueData?.totalRevenue || 0,
          revenueTrend: revenueData?.revenueTrend || 0
        })
        
        setReservations(todayReservations || [])
        setChartData(trendsData?.chartData || [])
        
        setCustomerData({
          newCustomers: frequencyData?.newCustomers || 0,
          returningCustomers: frequencyData?.returningCustomers || 0,
          totalCustomers: frequencyData?.totalCustomers || 0
        })
        
        // No need to set menu categories as they're hardcoded in the UI
        
        // Set upcoming reservations for notification
        setUpcomingReservations(upcomingReservationsData || [])
        
        // Set user profile data with enhanced flexibility for different API response formats
        try {
          // Try to get the profile data from localStorage first if API failed
          let vendorName = '';
          let vendorRole = '';
          let vendorAvatar = '';
          let vendorInitials = 'HD';
          
          if (typeof window !== 'undefined') {
            // Check if we have business name in localStorage
            const storedBusinessName = localStorage.getItem('businessName');
            const storedRole = localStorage.getItem('user_role');
            
            if (storedBusinessName && storedBusinessName !== 'undefined' && storedBusinessName !== 'null') {
              vendorName = storedBusinessName;
            }
            
            if (storedRole && storedRole !== 'undefined' && storedRole !== 'null') {
              vendorRole = storedRole;
            }
          }
          
          // Prioritize API data over localStorage data
          // Define a type for possible profile data keys
          type ProfileData = {
            businessName?: string;
            name?: string;
            companyName?: string;
            hotelName?: string;
            restaurantName?: string;
            firstName?: string;
            lastName?: string;
            role?: string;
            businessType?: string;
            avatar?: string;
            profileImage?: string;
            image?: string;
          };

          if (profileData && Object.keys(profileData).length > 0) {
            const profileDataTyped = profileData as ProfileData;
            
            // Try multiple possible property names for the business name
            const possibleNameProps = ['businessName', 'name', 'companyName', 'hotelName', 'restaurantName'] as const;
            for (const prop of possibleNameProps) {
              if (profileDataTyped[prop] && typeof profileDataTyped[prop] === 'string' && profileDataTyped[prop]!.trim() !== '') {
                vendorName = profileDataTyped[prop]!;
                break;
              }
            }
            
            // If no business name found, try to construct from first and last name
            if (!vendorName && profileDataTyped.firstName) {
              vendorName = profileDataTyped.lastName ? 
                `${profileDataTyped.firstName} ${profileDataTyped.lastName}` : 
                profileDataTyped.firstName;
            }
            
            // Get role information
            vendorRole = profileDataTyped.role || profileDataTyped.businessType || vendorRole || 'Hotel Manager';
            
            // Get avatar information
            vendorAvatar = profileDataTyped.avatar || profileDataTyped.profileImage || profileDataTyped.image || '';
            
            // Store in localStorage for future use
            if (vendorName && typeof window !== 'undefined') {
              try {
                localStorage.setItem('businessName', vendorName);
                if (vendorRole) {
                  localStorage.setItem('user_role', vendorRole);
                }
              } catch (e) {
                console.warn('Failed to store hotel vendor info in localStorage:', e);
              }
            }
          }
          
          // If we still don't have a name, use a friendly default rather than 'Guest User'
          if (!vendorName) {
            vendorName = 'Hotel Dashboard';
          }
          
          // Generate initials from the name
          if (vendorName && vendorName !== 'Guest User' && vendorName !== 'Hotel Dashboard') {
            const nameParts = vendorName.split(' ').filter(part => part.length > 0);
            if (nameParts.length === 1) {
              vendorInitials = nameParts[0].charAt(0).toUpperCase();
            } else if (nameParts.length > 1) {
              vendorInitials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
            }
          }
          
          // Update the profile state
          setUserProfile({
            name: vendorName,
            role: vendorRole,
            avatar: vendorAvatar,
            initials: vendorInitials
          });
          
          console.log('Hotel profile loaded:', { name: vendorName, initials: vendorInitials, role: vendorRole });
        } catch (profileError) {
          console.error('Error processing hotel profile data:', profileError);
          // Fallback to ensure UI doesn't break
          setUserProfile({
            name: 'Hotel Dashboard',
            role: 'Hotel Manager',
            avatar: '',
            initials: 'HD'
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
    
    // Set up real-time polling for upcoming reservations and dashboard data
// Set up fallback polling for when WebSocket is not available or disconnects
    let upcomingReservationsInterval: NodeJS.Timeout | null = null;
    let dashboardStatsInterval: NodeJS.Timeout | null = null;
    
    // Only set up polling if WebSocket isn't available
    if (!socket) {
      console.log('Setting up fallback polling for hotel dashboard');
      
      // Set up real-time polling for upcoming reservations
      upcomingReservationsInterval = setInterval(async () => {
        try {
          console.log('Polling for real-time hotel upcoming reservations...');
          const upcomingReservationsData = await getUpcomingReservations();
          if (upcomingReservationsData && Array.isArray(upcomingReservationsData)) {
            setUpcomingReservations(upcomingReservationsData);
            // Show notification if there are upcoming reservations
            if (upcomingReservationsData.length > 0) {
              setShowNotification(true);
            }
          }
        } catch (err) {
          console.error('Error fetching hotel upcoming reservations:', err);
        }
      }, 15000); // 15 seconds - increased frequency for better real-time experience
      
      // Set up additional polling for hotel dashboard stats
      dashboardStatsInterval = setInterval(async () => {
        try {
          console.log('Refreshing hotel dashboard stats...');
          // Use the local intervalSafelyFetchData function
          const statsData = await intervalSafelyFetchData<StatsData>(() => getDashboardStats(), {});
          const todayReservations = await intervalSafelyFetchData<Reservation[]>(() => getTodayReservations(), []);
          
          // Update the most time-sensitive stats
          setStats(prevStats => ({
            ...prevStats,
            reservationsToday: statsData.reservationsToday || prevStats.reservationsToday,
            prepaidReservations: statsData.prepaidReservations || prevStats.prepaidReservations,
            expectedGuests: statsData.expectedGuests || prevStats.expectedGuests,
            pendingPayments: statsData.pendingPayments || prevStats.pendingPayments
          }));
          
          // Update reservations list
          if (todayReservations.length > 0) {
            setReservations(todayReservations);
          }
        } catch (err) {
          console.error('Error refreshing hotel dashboard stats:', err);
        }
      }, 30000); // 30 seconds
    }
    
    // Set up regular polling regardless of WebSocket for reliability
    upcomingReservationsInterval = setInterval(async () => {
      try {
        console.log('Polling for real-time hotel upcoming reservations...');
        const upcomingReservationsData = await getUpcomingReservations();
        if (upcomingReservationsData && Array.isArray(upcomingReservationsData)) {
          setUpcomingReservations(upcomingReservationsData);
          // Show notification if there are upcoming reservations
          if (upcomingReservationsData.length > 0) {
            setShowNotification(true);
          }
        }
      } catch (err) {
        console.error('Error fetching hotel upcoming reservations:', err);
      }
    }, 30000); // 30 seconds - increased frequency for more real-time data
    
    // Define safelyFetchData function for the interval scope
    const intervalSafelyFetchData = async <T,>(fetchFn: () => Promise<string | T | { isError: boolean; error?: unknown }>, defaultValue: T): Promise<T> => {
      try {
        const result = await fetchFn();
        
        // Check for error object
        if (result && typeof result === 'object' && 'isError' in result && result.isError) {
          const errorObj = result.error || {};
          const errorMessage = typeof errorObj === 'object' && 'message' in errorObj 
            ? errorObj.message 
            : (typeof errorObj === 'string' ? errorObj : 'Unknown error');
            
          console.log(`API Error fetching hotel data: ${errorMessage}`);
          return defaultValue;
        }
        
        if (typeof result === 'object' && result !== null && 'isError' in result) {
          return defaultValue;
        }
        if (typeof result === 'string') {
          return defaultValue;
        }
        return result as T || defaultValue;
      } catch (error) {
        console.log(`Exception fetching hotel data in interval: ${error}`);
        return defaultValue;
      }
    };
    
    // Set up additional polling for hotel dashboard stats to keep them up-to-date
    dashboardStatsInterval = setInterval(async () => {
      try {
        console.log('Refreshing hotel dashboard stats...');
        // Use the local intervalSafelyFetchData function
        const statsData = await intervalSafelyFetchData<StatsData>(() => getDashboardStats(), {});
        const todayReservations = await intervalSafelyFetchData<Reservation[]>(() => getTodayReservations(), []);
        
        // Update the most time-sensitive stats
        setStats(prevStats => ({
          ...prevStats,
          reservationsToday: statsData.reservationsToday || prevStats.reservationsToday,
          prepaidReservations: statsData.prepaidReservations || prevStats.prepaidReservations,
          expectedGuests: statsData.expectedGuests || prevStats.expectedGuests,
          pendingPayments: statsData.pendingPayments || prevStats.pendingPayments
        }));
        
        // Update reservations list
        if (todayReservations.length > 0) {
          setReservations(todayReservations);
        }
      } catch (err) {
        console.error('Error refreshing hotel dashboard stats:', err);
      }
    }, 60000); // 60 seconds
    
    // Clean up function
    return () => {
      // Close WebSocket if it exists
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection for hotel dashboard');
        socket.close();
      }
      
      // Clear intervals if they exist
      if (upcomingReservationsInterval) clearInterval(upcomingReservationsInterval);
      if (dashboardStatsInterval) clearInterval(dashboardStatsInterval);
    }
  }, [selectedPeriod])
  
  // Handler for period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value)
  }

  return (
    <><div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 bg-gray-50 border-gray-200" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8"><AvatarImage src={userProfile.avatar || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>{userProfile.initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                <p className="text-xs text-gray-500">{userProfile.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Notification Banner */}
      {showNotification && upcomingReservations.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 mx-4 sm:mx-6 lg:mx-8 mt-4 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-5 w-5 text-yellow-400">⏰</div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  {upcomingReservations.length} {upcomingReservations.length === 1 ? 'Reservation' : 'Reservations'} commencing in the next 30 minutes
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotification(false)}
              className="text-yellow-800 hover:text-yellow-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back, {userProfile.name ? (
                userProfile.name.split(' ')[0].replace(/[^a-zA-Z0-9 ]/g, '')
              ) : 'there'}!
            </h1>
            <p className="text-gray-600 mt-1">{"Here's what is happening today."}</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reservations made today</p>
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.reservationsToday}</p>
                  <div className="flex items-center mt-2">
                    {stats.reservationsTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{stats.reservationsTrend}% vs last week</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{Math.abs(stats.reservationsTrend)}% vs last week</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Prepaid Reservations</p>
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.prepaidReservations}</p>
                  <div className="flex items-center mt-2">
                    {stats.prepaidTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{stats.prepaidTrend}% vs last week</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{Math.abs(stats.prepaidTrend)}% vs last week</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expected Guests Today</p>
                  <p className="text-3xl font-bold text-gray-900">{isLoading ? '-' : stats.expectedGuests}</p>
                  <div className="flex items-center mt-2">
                    {stats.guestsTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{stats.guestsTrend}% vs last week</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{Math.abs(stats.guestsTrend)}% vs last week</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? '-' : `₦${stats.pendingPayments.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                  <div className="flex items-center mt-2">
                    {stats.pendingPaymentsTrend >= 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-500">{stats.pendingPaymentsTrend}% vs last week</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-500">{Math.abs(stats.pendingPaymentsTrend)}% vs last week</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Today's Reservations */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{"Today's Reservation"}</CardTitle>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                  View All →
                </Button>
              </CardHeader>
              <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="3"
                      strokeDasharray={`${(customerData.newCustomers / Math.max(customerData.totalCustomers, 1)) * 100}, 100`}
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="3"
                      strokeDasharray={`${(customerData.returningCustomers / Math.max(customerData.totalCustomers, 1)) * 100}, 100`}
                      strokeDashoffset={`-${(customerData.newCustomers / Math.max(customerData.totalCustomers, 1)) * 100}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500">Total Customers</span>
                    <span className="text-xl font-bold">{customerData.totalCustomers}</span>
                  </div>
                </div>
              </div>
              
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-48">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="flex justify-center items-center h-48">
                    <p className="text-gray-500">No reservations for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={reservation.customerAvatar || "/placeholder.svg?height=40&width=40"} />
                            <AvatarFallback>{reservation.customerInitials || (reservation.name ?? '').substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{reservation.customerName}</p>
                            <p className="text-sm text-gray-500">ID: {reservation.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{new Date(reservation.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">Time: {reservation.time}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{reservation.guests} Guests</p>
                        </div>
                        <Badge
                          variant={reservation.status === 'Upcoming' ? 'secondary' : 'default'}
                          className={reservation.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {reservation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reservations Trends */}
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Reservations Trends</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                    View All →
                  </Button>
                  <Select
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                    className="w-24"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold">{isLoading ? '-' : stats.reservationsToday + stats.prepaidReservations}</div>
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">{stats.reservationsTrend}% vs last week</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">This week</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">Last week</span>
                  </div>
                </div>
                <div className="flex items-end justify-between h-32 space-x-2">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div className="w-full flex flex-col justify-end h-24 space-y-1">
                        <div
                          className="w-full bg-blue-400 rounded-t"
                          style={{ height: `${(data.value1 / 60) * 100}%` }}
                        ></div>
                        <div
                          className="w-full bg-teal-600 rounded"
                          style={{ height: `${(data.value2 / 60) * 100}%` }}
                        ></div>
                        <div
                          className="w-full bg-yellow-400 rounded-b"
                          style={{ height: `${(data.value3 / 60) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">{data.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue</CardTitle>
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                className="w-24"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-2xl font-bold">₦{isLoading ? '-' : stats.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">{stats.revenueTrend}% vs last period</span>
                </div>
              </div>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="text-sm text-gray-600 mb-2">Revenue Breakdown</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Room Bookings</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">65%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-teal-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Food & Beverage</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">20%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Additional Services</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">15%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Frequency */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Customer Frequency</CardTitle>
              <Select
                value={selectedPeriod}
                onChange={handlePeriodChange}
                className="w-24"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#0d9488"
                      strokeWidth="3"
                      strokeDasharray="50, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="3"
                      strokeDasharray="30, 100"
                      strokeDashoffset="-50"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeDasharray="20, 100"
                      strokeDashoffset="-80"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500">Total Customers</span>
                    <span className="text-xl font-bold">{customerData.totalCustomers}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                    <span className="text-sm">New Customers</span>
                  </div>
                  <span className="text-sm font-medium">
                    {customerData.totalCustomers ?
                      Math.round((customerData.newCustomers / customerData.totalCustomers) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm">Returning Customers</span>
                  </div>
                  <span className="text-sm font-medium">
                    {customerData.totalCustomers ?
                      Math.round((customerData.returningCustomers / customerData.totalCustomers) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-sm">Total Customers</span>
                  </div>
                  <span className="text-sm font-medium">{customerData.totalCustomers}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div></>
  )
}