
'use client'

import { useState, useEffect } from 'react'
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

  getReservationSources,
  getUserProfile,
  getUpcomingReservations
} from '@/app/lib/api-service'

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

interface MenuCategory {
  name: string;
  percentage: number;
  amount: string | number;
  color: string;
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
  categories?: MenuCategory[];
}

interface SourcesData {
  website?: number;
  mobile?: number;
  walkIn?: number;
  total?: number;
}

export default function Dashboard() {
  const [showNotification, setShowNotification] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for user profile
  const [userProfile, setUserProfile] = useState({
    name: '',
    role: '',
    avatar: '',
    initials: 'VD' // Default initials for Vendor Dashboard
  })
  
  // State for upcoming reservations
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([])
  
  // State for dashboard data
  const [stats, setStats] = useState({
    reservationsToday: 0,
    prepaidReservations: 0,
    expectedGuests: 0,
    pendingPayments: 0,
    pendingPaymentsTrend: 0,
    reservationsTrend: 0,
    prepaidTrend: 0,
    guestsTrend: 0
  })
const [reservations, setReservations] = useState<Reservation[]>([])
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [customerData, setCustomerData] = useState({
    newCustomers: 0,
    returningCustomers: 0,
    totalCustomers: 0
  })
  const [reservationSources, setReservationSources] = useState({
    website: 0,
    mobile: 0,
    walkIn: 0,
    total: 0
  })
  const [selectedPeriod, setSelectedPeriod] = useState('weekly')

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    const reconnectDelay = 3000; // 3 seconds
    
    // Function to establish WebSocket connection for real-time data
    const setupWebSocket = () => {
      try {
        // Check if WebSocket is supported
        if (typeof window !== 'undefined' && 'WebSocket' in window) {
          // Use proper WebSocket endpoint from environment or config
          const wsEndpoint = process.env.NEXT_PUBLIC_WS_URL || 
                           (window.location.protocol === 'https:' 
                             ? 'wss://hotel-booking-app-backend-30q1.onrender.com' 
                             : 'ws://localhost:3001');
          
          console.log('Attempting to establish WebSocket connection for restaurant dashboard...');
          
          // Create WebSocket connection with proper error handling
          const socket = new WebSocket(wsEndpoint);
          
          // Connection opened
          socket.addEventListener('open', (event) => {
            console.log('WebSocket connection established for restaurant dashboard');
            reconnectAttempts = 0; // Reset reconnect attempts on successful connection
            
            // Subscribe to relevant data channels
            try {
              socket.send(JSON.stringify({
                action: 'subscribe',
                channels: ['restaurant_stats', 'restaurant_reservations', 'restaurant_notifications']
              }));
            } catch (sendError) {
              console.error('Error sending subscription message:', sendError);
            }
          });
          
          // Listen for messages from the server
          socket.addEventListener('message', (event) => {
            try {
              const data = JSON.parse(event.data);
              console.log('Real-time update received:', data.type);
              
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
                  
                default:
                  console.log('Unknown update type:', data.type);
              }
            } catch (error) {
              console.error('Error processing WebSocket message:', error);
            }
          });
          
          // Handle errors with detailed logging
          socket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            // Don't throw error here, let close handler handle reconnection
          });
          
          // Handle connection closing
          socket.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            
            // Only attempt reconnection if not manually closed and within retry limit
            if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
              reconnectAttempts++;
              console.log(`Attempting to reconnect WebSocket... (${reconnectAttempts}/${maxReconnectAttempts})`);
              
              setTimeout(() => {
                if (reconnectAttempts <= maxReconnectAttempts) {
                  setupWebSocket();
                } else {
                  console.log('Max reconnection attempts reached, falling back to polling');
                }
              }, reconnectDelay * reconnectAttempts);
            }
          });
          
          return socket;
        } else {
          console.log('WebSocket not supported, falling back to polling');
          return null;
        }
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        return null;
      }
    };
    
    // Initially set up WebSocket
    ws = setupWebSocket();
    
    // Fetch dashboard data - fallback to regular API calls
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        console.log("Fetching real-time dashboard data...");
        
        // Remove the artificial delay - we want real-time data
        // if (process.env.NODE_ENV === 'development') {
        //   await new Promise(resolve => setTimeout(resolve, 800));
        // }
        
        // Modified approach to handle API errors gracefully
        // Use the interfaces defined at the module level
        
        // Initialize with properly typed empty objects
        let statsData: StatsData = {};
        let todayReservations: Reservation[] = [];
        let trendsData: TrendsData = {};
        let frequencyData: FrequencyData = {};
        let revenueData: RevenueData = {};
        let sourcesData: SourcesData = {};
        let profileData: any = {};
        let upcomingData: Reservation[] = [];
            
        // Helper function to safely fetch data and handle errors with proper TypeScript typing
        const safelyFetchData = async <T,>(fetchFn: () => Promise<any>, defaultValue: T): Promise<T> => {
          try {
            const result = await fetchFn();
            
            // Check for error object
            if (result && typeof result === 'object' && 'isError' in result && result.isError) {
              const errorObj = result.error || {};
              const errorMessage = typeof errorObj === 'object' && 'message' in errorObj 
                ? errorObj.message 
                : (typeof errorObj === 'string' ? errorObj : 'Unknown error');
                
              console.log(`API Error fetching data: ${errorMessage}`);
              return defaultValue;
            }
            
            // Check for empty object (which may not have isError flag)
            if (result && typeof result === 'object' && 
                !Array.isArray(result) && 
                Object.keys(result).length === 0) {
              console.log('Received empty object from API');
              return defaultValue;
            }
            
            return result || defaultValue;
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
            console.log(`Exception fetching data: ${errorMessage}`);
            return defaultValue;
          }
        };
        
        // Fetch dashboard data sequentially to avoid overwhelming the API
        statsData = await safelyFetchData<StatsData>(() => getDashboardStats(), {});
        todayReservations = await safelyFetchData<Reservation[]>(() => getTodayReservations(), []);
        trendsData = await safelyFetchData<TrendsData>(() => getReservationTrends(selectedPeriod), {});
        frequencyData = await safelyFetchData<FrequencyData>(() => getCustomerFrequency(selectedPeriod), {});
        revenueData = await safelyFetchData<RevenueData>(() => getRevenueByCategory(selectedPeriod), {});
        sourcesData = await safelyFetchData<SourcesData>(() => getReservationSources(selectedPeriod), {});
        
        // Profile data needs special handling with retries
        for (let retry = 0; retry < 3; retry++) {
          profileData = await safelyFetchData<any>(() => getUserProfile(), {});
          if (profileData && Object.keys(profileData).length > 0) break;
          console.log(`Retrying profile fetch, attempt ${retry + 1}/3`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between retries
        }
        
        upcomingData = await safelyFetchData<Reservation[]>(() => getUpcomingReservations(), []);
        
        // Update state with fetched data
        setStats({
          reservationsToday: statsData.reservationsToday || 0,
          prepaidReservations: statsData.prepaidReservations || 0,
          expectedGuests: statsData.expectedGuests || 0,
          pendingPayments: statsData.pendingPayments || 0,
          pendingPaymentsTrend: statsData.pendingPaymentsTrend || 0,
          reservationsTrend: statsData.reservationsTrend || 0,
          prepaidTrend: statsData.prepaidTrend || 0,
          guestsTrend: statsData.guestsTrend || 0
        })
        
        setReservations(todayReservations || [])
        setChartData(trendsData?.chartData || [])
        
        setCustomerData({
          newCustomers: frequencyData?.newCustomers || 0,
          returningCustomers: frequencyData?.returningCustomers || 0,
          totalCustomers: frequencyData?.totalCustomers || 0
        })
        
        setMenuCategories(revenueData?.categories || [])
        
        setReservationSources({
          website: sourcesData?.website || 0,
          mobile: sourcesData?.mobile || 0,
          walkIn: sourcesData?.walkIn || 0,
          total: sourcesData?.total || 0
        })
        
        // Set user profile data with enhanced flexibility for different API response formats
        try {
          // Try to get the profile data from localStorage first if API failed
          let vendorName = '';
          let vendorRole = '';
          let vendorAvatar = '';
          let vendorInitials = 'VD';
          
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
          if (profileData && Object.keys(profileData).length > 0) {
            // Try multiple possible property names for the business name
            const possibleNameProps = ['businessName', 'name', 'companyName', 'restaurantName', 'hotelName'];
            for (const prop of possibleNameProps) {
              if (profileData[prop] && typeof profileData[prop] === 'string' && profileData[prop].trim() !== '') {
                vendorName = profileData[prop];
                break;
              }
            }
            
            // If no business name found, try to construct from first and last name
            if (!vendorName && profileData.firstName) {
              vendorName = profileData.lastName ? 
                `${profileData.firstName} ${profileData.lastName}` : 
                profileData.firstName;
            }
            
            // Get role information
            vendorRole = profileData.role || profileData.businessType || vendorRole || 'Vendor';
            
            // Get avatar information
            vendorAvatar = profileData.avatar || profileData.profileImage || profileData.image || '';
            
            // Store in localStorage for future use
            if (vendorName && typeof window !== 'undefined') {
              try {
                localStorage.setItem('businessName', vendorName);
                if (vendorRole) {
                  localStorage.setItem('user_role', vendorRole);
                }
              } catch (e) {
                console.warn('Failed to store vendor info in localStorage:', e);
              }
            }
          }
          
          // If we still don't have a name, use a friendly default rather than 'Guest User'
          if (!vendorName) {
            vendorName = 'Vendor Dashboard';
          }
          
          // Generate initials from the name
          if (vendorName && vendorName !== 'Guest User' && vendorName !== 'Vendor Dashboard') {
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
          
          console.log('Vendor profile loaded:', { name: vendorName, initials: vendorInitials, role: vendorRole });
        } catch (profileError) {
          console.error('Error processing profile data:', profileError);
          // Fallback to ensure UI doesn't break
          setUserProfile({
            name: 'Restaurant Dashboard',
            role: 'Vendor',
            avatar: '',
            initials: 'RD'
          });
        }
        
        // Set upcoming reservations
        if (upcomingData && Array.isArray(upcomingData)) {
          setUpcomingReservations(upcomingData);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
    
    // Set up fallback polling for when WebSocket is not available or disconnects
    let upcomingReservationsInterval: NodeJS.Timeout | null = null;
    let dashboardStatsInterval: NodeJS.Timeout | null = null;
    
    // Only set up polling if WebSocket isn't available or not connected
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log('Setting up fallback polling for restaurant dashboard');
      
      // Set up real-time polling for upcoming reservations
      upcomingReservationsInterval = setInterval(async () => {
        try {
          console.log('Polling for real-time upcoming reservations...');
          const upcomingReservationsData = await getUpcomingReservations();
          if (upcomingReservationsData && Array.isArray(upcomingReservationsData)) {
            setUpcomingReservations(upcomingReservationsData);
            // Show notification if there are upcoming reservations
            if (upcomingReservationsData.length > 0) {
              setShowNotification(true);
            }
          }
        } catch (err) {
          console.error('Error fetching upcoming reservations:', err);
        }
      }, 15000); // 15 seconds - increased frequency for better real-time experience
      
      // Set up additional polling for dashboard stats
      dashboardStatsInterval = setInterval(async () => {
        try {
          console.log('Refreshing dashboard stats...');
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
          console.error('Error refreshing dashboard stats:', err);
        }
      }, 30000); // 30 seconds
    }
    
    
    upcomingReservationsInterval = setInterval(async () => {
      try {
        console.log('Polling for real-time upcoming reservations...');
        const upcomingReservationsData = await getUpcomingReservations();
        if (upcomingReservationsData && Array.isArray(upcomingReservationsData)) {
          setUpcomingReservations(upcomingReservationsData);
          // Show notification if there are upcoming reservations
          if (upcomingReservationsData.length > 0) {
            setShowNotification(true);
          }
        }
      } catch (err) {
        console.error('Error fetching upcoming reservations:', err);
      }
    }, 30000); // 30 seconds - increased frequency for more real-time data
    
    // Define safelyFetchData function for the interval scope
    const intervalSafelyFetchData = async <T,>(fetchFn: () => Promise<any>, defaultValue: T): Promise<T> => {
      try {
        const result = await fetchFn();
        
        // Check for error object
        if (result && typeof result === 'object' && 'isError' in result && result.isError) {
          const errorObj = result.error || {};
          const errorMessage = typeof errorObj === 'object' && 'message' in errorObj 
            ? errorObj.message 
            : (typeof errorObj === 'string' ? errorObj : 'Unknown error');
            
          console.log(`API Error fetching restaurant data: ${errorMessage}`);
          return defaultValue;
        }
        
        return result || defaultValue;
      } catch (error) {
        console.log(`Exception fetching restaurant data in interval: ${error}`);
        return defaultValue;
      }
    };
    
    // Set up additional polling for dashboard stats to keep them up-to-date
    dashboardStatsInterval = setInterval(async () => {
      try {
        console.log('Refreshing dashboard stats...');
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
        console.error('Error refreshing dashboard stats:', err);
      }
    }, 60000); // 60 seconds
    
    // Clean up function
    return () => {
      // Close WebSocket if it exists
      if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection for restaurant dashboard');
        ws.close(1000, 'Component unmounting');
      }
      
      // Clear intervals if they exist
      if (upcomingReservationsInterval) clearInterval(upcomingReservationsInterval);
      if (dashboardStatsInterval) clearInterval(dashboardStatsInterval);
    };
  }, [selectedPeriod])
  
  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    if (!name) return 'VD';
    
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }
  
  // Handler for period change
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {upcomingReservations.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></span>
              )}
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg?height=32&width=32"} />
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
                    {isLoading ? '-' : `₦${stats.pendingPayments.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
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
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>{isLoading ? (
                <div className="flex justify-center items-center h-32 mb-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold">{chartData.reduce((sum, item) => sum + item.value1, 0)}</div>
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">8% vs last week</span>
                  </div>
                </div>
              )}
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
                  {chartData.length === 0 && !isLoading ? (
                    <div className="w-full flex items-center justify-center h-24">
                      <p className="text-gray-500 text-sm">No data available</p>
                    </div>
                  ) : (
                    chartData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="w-full flex flex-col justify-end h-24 space-y-1">
                          <div
                            className="w-full bg-blue-400 rounded-t"
                            style={{ height: `${Math.max((data.value1 / (chartData.length ? Math.max(...chartData.map(d => d.value1)) : 1)) * 100, 5)}%` }}
                          ></div>
                          <div
                            className="w-full bg-teal-600 rounded"
                            style={{ height: `${Math.max((data.value2 / (chartData.length ? Math.max(...chartData.map(d => d.value2)) : 1)) * 100, 5)}%` }}
                          ></div>
                          <div
                            className="w-full bg-yellow-400 rounded-b"
                            style={{ height: `${Math.max((data.value3 / (chartData.length ? Math.max(...chartData.map(d => d.value3)) : 1)) * 100, 5)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{data.day}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <>
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
                          strokeDasharray={`${(customerData.newCustomers / customerData.totalCustomers) * 100}, 100`}
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="3"
                          strokeDasharray={`${(customerData.returningCustomers / customerData.totalCustomers) * 100}, 100`}
                          strokeDashoffset={`-${(customerData.newCustomers / customerData.totalCustomers) * 100}`}
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
          
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm">Returning Customers</span>
                      </div>
                      <span className="text-sm font-medium">
                        {customerData.totalCustomers ? 
                          Math.round((customerData.returningCustomers / customerData.totalCustomers) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Revenue by Menu Category */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Revenue (Menu Category)</CardTitle>
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
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="text-2xl font-bold">₦{menuCategories.reduce((sum, item) => sum + (typeof item.amount === 'string' ? parseFloat(item.amount.toString().replace(/[^0-9.]/g, '')) : item.amount), 0).toLocaleString()}</div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span className="text-sm">8% vs last week</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {menuCategories.length === 0 ? (
                      <p className="text-gray-500 text-sm">No data available</p>
                    ) : (
                      menuCategories.map((category, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">{category.name}</span>
                            <div className="text-right">
                              <span className="text-sm font-medium">{category.percentage}%</span>
                              <span className="text-xs text-gray-500 ml-2">(₦{category.amount.toLocaleString()})</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`${category.color} h-2 rounded-full`}
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Reservation Source */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reservation Source</CardTitle>
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
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500"></div>
                </div>
              ) : (
                <>
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
                          strokeDasharray={`${(reservationSources.website / reservationSources.total) * 100}, 100`}
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="3"
                          strokeDasharray={`${(reservationSources.mobile / reservationSources.total) * 100}, 100`}
                          strokeDashoffset={`-${(reservationSources.website / reservationSources.total) * 100}`}
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray={`${(reservationSources.walkIn / reservationSources.total) * 100}, 100`}
                          strokeDashoffset={`-${((reservationSources.website + reservationSources.mobile) / reservationSources.total) * 100}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-500">Total Reservations</span>
                        <span className="text-xl font-bold">{reservationSources.total}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-teal-600 rounded-full mr-2"></div>
                        <span className="text-sm">{reservationSources.website} website</span>
                      </div>
                      <span className="text-sm font-medium">
                        {reservationSources.total ? 
                          Math.round((reservationSources.website / reservationSources.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm">{reservationSources.mobile} mobile</span>
                      </div>
                      <span className="text-sm font-medium">
                        {reservationSources.total ? 
                          Math.round((reservationSources.mobile / reservationSources.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm">{reservationSources.walkIn} walk-in</span>
                      </div>
                      <span className="text-sm font-medium">
                        {reservationSources.total ? 
                          Math.round((reservationSources.walkIn / reservationSources.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}